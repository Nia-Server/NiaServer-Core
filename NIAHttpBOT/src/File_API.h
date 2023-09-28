#ifndef FILE_API_H
#define FILE_API_H

#include <filesystem>

#include <httplib.h>
#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>

#include "I18Nize.hpp"
#include "Logger.hpp"



void init_file_API(httplib::Server &svr) ;


#endif