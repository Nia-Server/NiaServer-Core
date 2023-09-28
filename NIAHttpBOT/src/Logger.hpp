#ifndef LOGGER_HPP
#define LOGGER_HPP

#include <string>
#include <ctime>
#include <syncstream>
#include <iostream>

#define SYNC(a) std::basic_osyncstream(a)

#define LOG(sym,str) SYNC(std::cout)<<GetTime()<<#sym" "<<str<<std::endl

#define INFO(a) SYNC(std::cout)<<GetTime()<<"\x1b[32m[INFO]\x1b[0m "<<a<<std::endl

#define WARN(a) SYNC(std::cout)<<GetTime()<<"\x1b[43;1m[WARN]\x1b[0m "<<a<<std::endl

// #define REMOVE_PATH(a) (a + sizeof(__PROJECT__) -1)
constexpr const char* REMOVE_PATH(const char* str) {
	return (str + sizeof(__PROJECT__) -1);
}

#define FAIL(a) SYNC(std::cout)<<GetTime()<<"\x1b[41;1m[FAIL]\x1b[0m \x1b[36;45;4mError at " \
	<<REMOVE_PATH(__FILE__)<<":"<<__LINE__<<" ("<<__FUNCTION__ \
	<<")\x1b[0m ==>\n"<<a<<'\n'<<std::endl

#define XLOG(sym,str) SYNC(std::cout)<<GetTime()<<#sym" "<<__I18N(str)<<std::endl

#define XINFO(a) SYNC(std::cout)<<GetTime()<<"\x1b[32m[INFO]\x1b[0m "<<__I18N(a)<<std::endl

#define XWARN(a) SYNC(std::cout)<<GetTime()<<"\x1b[43;1m[WARN]\x1b[0m "<<__I18N(a)<<std::endl

#define XFAIL(a) SYNC(std::cout)<<GetTime()<<"\x1b[41;1m[FAIL]\x1b[0m \x1b[36;45;4mError at " \
	<<REMOVE_PATH(__FILE__)<<":"<<__LINE__<<" ("<<__FUNCTION__ \
	<<")\x1b[0m ==>\n"<<__I18N(a)<<'\n'<<std::endl

#define X(a) __I18N(a)

inline std::string GetTime() {
	time_t timep; tm p;
    char time_buffer[80];
	time(&timep);
#ifdef WIN32
	localtime_s(&p, &timep);
#else
	localtime_r(&timep, &p);
#endif
    strftime(time_buffer, sizeof(time_buffer), "[%Y/%m/%d %H:%M:%S] ", &p);
	return "\x1b[35m" + std::string(time_buffer) + "\x1b[0m";
}



#endif