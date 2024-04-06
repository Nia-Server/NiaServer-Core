#ifndef QQBOT_API_H
#define QQBOT_API_H

#include <httplib.h>
#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>

#include "I18Nize.hpp"
#include "Logger.hpp"



void init_qqbot_API(httplib::Server &svr, httplib::Client &cli, std::string &Locate, std::string &OwnerQQ, std::string &QQGroup) ;


#endif