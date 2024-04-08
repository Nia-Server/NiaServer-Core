#ifndef QQBOT_H
#define QQBOT_H

#include <httplib.h>
#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>

#include "I18Nize.hpp"
#include "Logger.hpp"



void main_qqbot(httplib::Server &svr, httplib::Client &cli, std::string &Locate, std::string &OwnerQQ, std::string &QQGroup) ;


#endif