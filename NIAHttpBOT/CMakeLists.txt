cmake_minimum_required(VERSION 3.21)

include(CheckCXXCompilerFlag)

set(PROJECT NIAHttpBOT)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_BUILD_TYPE Release)

project(${PROJECT})

set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")

check_cxx_compiler_flag("/arch:AVX2" COMPILER_SUPPORTS_AVX2)
if(COMPILER_SUPPORTS_AVX2)
	set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} /arch:AVX2")
endif()

aux_source_directory(./src/ SOURCE)
include_directories(./header)

add_definitions(-D__PROJECT__="${CMAKE_CURRENT_SOURCE_DIR}")

add_executable(${PROJECT} ${SOURCE})

