#ifndef CFG_PARSER_HPP
#define CFG_PARSER_HPP

// CFG (==CFG File's Genteel) Parser, writen by jiansyuan(github.com/jiansyuan)
/*
    |    version ? ? ? ----------------- ? ? ? ?     |  support more...
    |--> version 0.0.0 ----------------- 2023.7.8 <--|  support basic types: bool, int, char, string and null
    |    version -1    ----------------- ? ? ? ?     |
*/


/*

Copyright (C) 2023 jiansyuan

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the “Software”), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/


#include <immintrin.h>

#include <string>
#include <vector>
#include <variant>
#include <unordered_map>
#include <fstream>


#define IS_SPACE(ch) ((ch==' ')||(ch=='\t')||(ch=='\r'))
#define IS_DIGIT(ch) (('0'<=ch)&&(ch<='9'))
#define IS_LETTER(ch) (('a'<=ch&&ch<='z')||('A'<=ch&&ch<='Z'))
#define IS_SYMBOL(ch) (IS_LETTER(ch)||IS_DIGIT(ch)||ch=='-'||ch=='_')




namespace CFGPAR {

enum ValueTypeEnum{
    IDontKnow = -1,
    BoolType, IntType, CharType, StringType, NullType
};

// struct KVnode{
//     std::string key;
//     ValueTypeEnum typ = IDontKnow;
//     std::variant<bool, int, char, std::string> val;
// };

struct Vnode{
    ValueTypeEnum typ = IDontKnow;
    std::variant<bool, int, char, std::string> val;
    template<typename T> inline T get() {
        return std::get<T>(val);
    }
};

class parser{
private:
    std::unordered_map<std::string, Vnode> KVmap;

private:

    inline std::vector<unsigned> findEqualSigns(const std::string& str, char tar='=') {
        std::vector<unsigned> ret;
#ifdef __AVX2__
        const char* data = str.data();
        __m256i tars = _mm256_set1_epi8(tar);
        size_t i = 0;
        for (; i+32<str.size(); i+=32) {
            __m256i chunk = _mm256_loadu_si256(reinterpret_cast<const __m256i*>(data+i)),
                    match = _mm256_cmpeq_epi8(chunk, tars);
            int mask = _mm256_movemask_epi8(match);
            while (mask != 0) {
                int index = 
    #ifdef __GNUC__
                __builtin_ctz(mask);
    #else
                _tzcnt_u32(mask); 
    #endif
                ret.push_back(i+(unsigned)index), mask &= ~(1<<index);
            }
        }
        for(; i<str.size(); i++) if(str[i]==tar) ret.push_back(i);
#else
        for(size_t i=0; i<str.size(); i++) if(str[i]==tar) ret.push_back(i);
#endif
        return ret;
    }

    inline char escapeChar(char ch){
        if(ch=='0') ch = '\0';
        else if(ch=='\\') ch = '\\';
        else if(ch=='r') ch = '\r';
        else if(ch=='n') ch = '\n';
        else if(ch=='t') ch = '\t';
        else if(ch=='\'') ch = '\'';
        else if(ch=='\"') ch = '\"';
        else ch = ' '; // TODO: need more
        return ch;
    }

    std::pair<bool, bool> matchBool(const std::string& str, int idx) {
        if(str.size()-idx<3) return std::make_pair(false, false);
        if(str[idx+1]=='r'&&str[idx+2]=='u'&&str[idx+3]=='e') return std::make_pair(true, true);
        if(str.size()-idx<4) return std::make_pair(false, false);
        if(str[idx+1]=='a'&&str[idx+2]=='l'&&str[idx+3]=='s'&&str[idx+4]=='e')
            return std::make_pair(true, false);
        return std::make_pair(false, false);
    }
    
    std::pair<bool, int> matchInt(const std::string& str, int idx) { // TODO: need to support more formats of number
        int num = 0, pre = 1;
        if(str[idx]=='-') pre=-1, idx++;
        if(idx>=str.size() || !IS_DIGIT(str[idx])) return std::make_pair(false, 0);
        for(int i=idx; i<str.size(); i++) {
            if(IS_SPACE(str[i])||str[i]=='\n') break; 
            if(!IS_DIGIT(str[i])) return std::make_pair(false, 0);
            num*=10, num+=str[i]-'0';
        }
        return std::make_pair(true, pre*num);
    }

    // TODO: parse float or double number

    std::pair<bool, char> matchChar(const std::string& str, int idx) {
        char ch;
        if(str.size()-idx<2 || (str[idx+1]=='\\'&&str.size()-idx<3)) return std::make_pair(false, '\0'); 
        if(str[idx+1]=='\\') ch = escapeChar(str[idx+2]), idx++;
        else ch = str[idx+1];
        if(str[idx+2]!='\'') return std::make_pair(false, '\0');
        return std::make_pair(true, ch);
    }

    std::pair<bool, std::string> matchString(const std::string& str, int idx) {
        std::string ret;
        for(int i=idx+1; i<str.size(); i++) {
            if(str[i]=='\"') return std::make_pair(true, ret);
            if(str[i]=='\n') return std::make_pair(false, ""); // lack double quotation mark
            if(str[i]=='\\'){
                if(i+1>=str.size()) return std::make_pair(false, ""); // out of range
                ret.push_back(escapeChar(str[i+1])), i++;
            }else ret.push_back(str[i]);
        }
        return std::make_pair(true, ret);
    }

    bool matchNull(const std::string& str, int idx){
        if(str.size()-idx<3) return false;
        if(str[idx+1]=='u'&&str[idx+2]=='l'&&str[idx+3]=='l') return true;
        return false;
    }

    inline Vnode& operator[] (const std::string& idx){ 
        return KVmap[idx];
    }

    template<typename T> inline T getVal(const std::string& idx){
        return KVmap[idx].get<T>();
    }

public:
    parser() : KVmap() {}

    parser(const std::string& cfg) {
        parser();
        parFromStr(cfg);
    }

    void clear() {
        KVmap.clear();
    }

    bool parFromStr(const std::string& str) {
        std::vector<unsigned> key = findEqualSigns(str);
        for(auto i : key) {
            int tmp = -1;
            std::string sym;
            std::variant<bool, int, char, std::string> val;
            ValueTypeEnum typ = IDontKnow;
            for(int j=i; j>=0; j--) {
                if(str[j] == '\n') break;
                if(IS_SPACE(str[j])||str[j]=='=') continue;
                if(IS_SYMBOL(str[j])) {
                    tmp=j; break;
                }
            }
            if(tmp == -1) return false; // no symbol in left of the equal sign
            for(int j=tmp; j>=0; j--) {
                if(str[j]=='\n') break;
                if(IS_SYMBOL(str[j])) sym.push_back(str[j]);
                else if(IS_SPACE(str[j])) break;
            }
            std::reverse(sym.begin(), sym.end());
            for(int j=i; j<str.size(); j++) {
                if(str[j] == '\n') break;
                if(IS_SPACE(str[j])||str[j]=='=') continue;
                if(str[j]=='f'||str[j]=='t') {
                    std::pair<bool, bool> pbi = matchBool(str, j);
                    if(!pbi.first) return false; // error in matching boolean
                    val=pbi.second, typ=BoolType; break;
                }else if(IS_DIGIT(str[j])||str[j]=='-') { 
                    std::pair<bool, int> pbi = matchInt(str, j);
                    if(!pbi.first) return false; // error in matching number
                    val=pbi.second, typ=IntType; break;
                }else if(str[j]=='\'') {
                    std::pair<bool, char> pbi = matchChar(str, j);
                    if(!pbi.first) return false; // ditto
                    val=pbi.second, typ=CharType; break;
                }else if(str[j]=='\"') {
                    std::pair<bool, std::string> pbi = matchString(str, j);
                    if(!pbi.first) return false; // ditto
                    val=pbi.second ,typ=StringType; break;
                }else if(str[j]=='n') {
                    bool pbi = matchNull(str, j);
                    if(!pbi) return false; // ditto
                    typ=NullType; break;
                }

            }
            if(typ==IDontKnow) return false; //error in match
            KVmap.insert(std::make_pair(sym, Vnode{ typ, val }));
        }
        return true;
    }

    bool parFromFile(const std::string& path){
        std::ifstream file(path);
        if (!file.is_open()) return false;
        std::string cont((std::istreambuf_iterator<char>(file)),
                             std::istreambuf_iterator<char>());
        file.close();
        return parFromStr(cont);
    }

    inline bool hasKey(const std::string& idx){
        return KVmap.count(idx)==1;
    }

    #define MAKEIS(name) inline bool is##name(const std::string& idx){ if(KVmap.count(idx)==0) return false; return KVmap[idx].typ == name##Type; }
    #define MAKEGET(name,typ) inline typ get##name(const std::string& idx){ if(KVmap.count(idx)==0) return NULL; return getVal<typ>(idx); }
    #define MAKEISGET(name,typ) MAKEIS(name) MAKEGET(name,typ)

    MAKEISGET(Bool, bool)
    MAKEISGET(Int, int)
    MAKEISGET(Char, char)
    MAKEISGET(String, std::string)

    MAKEIS(Null)
    inline bool getNull(const std::string& idx){ return isNull(idx);}

    inline bool isError(const std::string& idx){ 
        return !hasKey(idx) || KVmap[idx].typ==IDontKnow;
    }

};

}

#undef IS_SPACE
#undef IS_DIGIT
#undef IS_LETTER
#undef IS_SYMBOL
#undef MAKEIS
#undef MAKEGET
#undef MAKEISGET


#endif //CFG_PARSER_HPP