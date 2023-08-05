cmake_minimum_required(VERSION 3.21)

include(CheckCXXCompilerFlag)

set(PROJECT NIAHttpBOT)
set(CMAKE_CXX_STANDARD 20)
set(CMAKE_BUILD_TYPE Release)

project(${PROJECT})

if(CMAKE_SYSTEM_NAME STREQUAL "Windows")
	set(CMAKE_MSVC_RUNTIME_LIBRARY "MultiThreaded$<$<CONFIG:Debug>:Debug>")
	set(AVX2_FLAG /arch:AVX2)
elseif(CMAKE_SYSTEM_NAME STREQUAL "Linux")
	set(AVX2_FLAG -mavx2)
endif()

check_cxx_compiler_flag("${AVX2_FLAG}" SUPPORTS_AVX2)
if(SUPPORTS_AVX2)
	message("use AVX2 (\"${AVX2_FLAG}\")")
	set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${AVX2_FLAG}")
endif()

aux_source_directory(./src/ SOURCE)
include_directories(./header)

add_definitions(-D__PROJECT__="${CMAKE_CURRENT_SOURCE_DIR}")

add_executable(${PROJECT} ${SOURCE})

