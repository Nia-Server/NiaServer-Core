cmake_minimum_required(VERSION 3.21)

set(PROJECT NIAHttpBOT)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_BUILD_TYPE Release)

project(${PROJECT})

aux_source_directory(./src/ SOURCE)
include_directories(./header)

add_executable(${PROJECT} ${SOURCE})


