cmake_minimum_required(VERSION 3.21)

set(PROJECT NIAHttpBOT)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_BUILD_TYPE Release)

set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

project(${PROJECT})

aux_source_directory(./src/ SOURCE)
include_directories(./header)

add_definitions(-D__PROJECT__="${CMAKE_CURRENT_SOURCE_DIR}")

add_executable(${PROJECT} ${SOURCE})


