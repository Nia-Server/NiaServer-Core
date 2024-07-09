#ifndef QQBOT_H
#define QQBOT_H

#include <vector>
#include <unordered_map>
#include <string>
#include <algorithm>
#include <httplib.h>
#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>

#include "QQBot_API.h"
#include "CFG_Parser.hpp"
#include "I18Nize.hpp"
#include "Logger.hpp"



void main_qqbot(httplib::Server &svr);


#endif