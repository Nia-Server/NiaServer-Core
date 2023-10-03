#ifndef I18NIZE_HPP
#define I18NIZE_HPP


#include <immintrin.h>

#include <unordered_map>
#include <string>
#include <vector>
#include <fstream>
#include <iostream>
class I18N{

private:

std::unordered_map<std::string, std::string> langMap;

inline std::vector<int> findEqualSigns(const std::string& str, char tar='=') {
        std::vector<int> ret;
        ret.push_back(-1);
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

inline bool load(const std::string& str) {
    std::vector<int> line_idx(findEqualSigns(str, '\n'));
    if(!(line_idx.size()&1)) return false;
    for(size_t i=0; i+2<line_idx.size(); i+=2) 
        langMap[str.substr(line_idx[i]+1, line_idx[i+1]-line_idx[i]-1)] = str.substr(line_idx[i+1]+1, line_idx[i+2]-line_idx[i+1]-1);
    return true;
}

public:

    I18N() : langMap() {}
    I18N(const std::string& file_path) {
        I18N();
        loadFromFile(file_path);
    }

    inline void clear() {
        langMap.clear();
    }

    bool loadFromFile(const std::string& path) {
        std::ifstream file(path);
        if (!file.is_open()) return false;
        std::string cont((std::istreambuf_iterator<char>(file)), std::istreambuf_iterator<char>());
        file.close();
        return load(cont);
    }

    std::string get(const std::string& cont) {
        if(langMap.count(cont)) return langMap[cont];
        return cont;
    }

};

static I18N i18n;

#define __I18N(a) i18n.get(a)

#endif