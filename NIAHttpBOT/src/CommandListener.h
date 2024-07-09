#ifndef COMMANDLISTENER_H
#define COMMANDLISTENER_H

#include <string>
#include <iostream>
#include <thread>
#include <chrono>
#include <cstdlib>
#include <unordered_map>
#include <functional>
#include <sstream>
#include "Logger.hpp"

#ifdef _WIN32
#include <process.h>
#else
#include <unistd.h>
#endif




// 声明命令监听函数
void listenForCommands(const char* programName);

#endif