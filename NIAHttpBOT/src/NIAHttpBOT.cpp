/*

Copyright (C) 2024 Nia-Server

The developer is not responsible for you, and the developer is not obliged to write code for you, and is not liable for any consequences of your use.

In addition, you are required to comply with the terms of the AGPL-3.0 (https://github.com/Nia-Server/NiaServer-Core/blob/main/LICENSE) open source licence for this project, and the related open source agreements used by all sub-projects of this project.

If you do not accept these terms, please delete this project immediately.

authors: NIANIANKNIA && jiansyuan

email: dev@mcnia.com

Project address: https://github.com/Nia-Server/NiaServer-Core/

If you have any problems with this project, please contact the authors.

*/

#include <ctime>
#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <syncstream>
#include <cstdlib>
#include <cstdio>
#include <unordered_map>
#include <chrono>
#include <unordered_map>
#include <functional>
#include <sstream>

#ifdef WIN32 //only enable TLS in windows
#define CPPHTTPLIB_OPENSSL_SUPPORT
#endif

#include <httplib.h>
#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>


#include "CFG_Parser.hpp"
#include "I18Nize.hpp"
#include "Logger.hpp"

#include "QQBot.h"
#include "File_API.h"
#include "Game_API.h"


//定义版本号
#define VERSION "v1.5.0-pre-3"

#ifdef WIN32
#define popen _popen
#define pclose _pclose
#define WEXITSTATUS
#endif

#ifdef WIN32
void sslThread(){
	//与GitHub的API通信来检查更新
	httplib::SSLClient cli("api.github.com");
	auto res = cli.Get("/repos/Nia-Server/NiaServer-Core/releases");
	if (res && res->status == 200) {
		rapidjson::Document doc;
		doc.Parse(res->body.c_str());
		if (doc.HasParseError()) {
			WARN("解析JSON数据失败！");
			return;
		}
		if (doc.Size() == 0) {
			WARN("未找到任何版本信息！");
			return;
		}
		std::string latest_version = doc[0]["tag_name"].GetString();
		std::string changelog = doc[0]["body"].GetString();
		std::string download_url = doc[0]["html_url"].GetString();
		std::string current_version = VERSION;

		// 分割版本号和预发布版本号
		std::string latest_main_version = latest_version;
		std::string current_main_version = current_version;
		std::string latest_pre_version, current_pre_version;
		if (latest_version.find("-") != std::string::npos) {
			latest_main_version = latest_version.substr(0, latest_version.find("-"));
			latest_pre_version = latest_version.substr(latest_version.find("-") + 1);
		}
		if (current_version.find("-") != std::string::npos) {
			current_main_version = current_version.substr(0, current_version.find("-"));
			current_pre_version = current_version.substr(current_version.find("-") + 1);
		}

		bool is_latest_greater = false;
		if (latest_main_version != current_main_version) {
			// 如果主版本号不同，直接比较主版本号
			is_latest_greater = latest_main_version > current_main_version;
		} else if (!latest_pre_version.empty() && !current_pre_version.empty()) {
			// 如果主版本号相同，并且都有预发布版本号，比较预发布版本号
			is_latest_greater = latest_pre_version > current_pre_version;
		} else if (!latest_pre_version.empty() && current_pre_version.empty()) {
			// 如果主版本号相同，最新版本有预发布版本号，当前版本没有预发布版本号，那么当前版本是最新的
			is_latest_greater = false;
		} else if (latest_pre_version.empty() && !current_pre_version.empty()) {
			// 如果主版本号相同，最新版本没有预发布版本号，当前版本有预发布版本号，那么最新版本是最新的
			is_latest_greater = true;
		}

		if (is_latest_greater) {
			//如果是预发布版本，输出警告
			if (latest_version.find("-pre-") != std::string::npos) {
				WARN("检查更新成功，当前github的release最新版本为：" + latest_version + "，当前版本为：" + VERSION + "，但请注意，这是一个预发布版本！可能存在未知的问题，请根据实际情况更新！");
			} else {
				WARN("检查更新成功，当前github的release最新版本为：" + latest_version + "，当前版本为：" + VERSION + "，请及时更新！");
			}
			//向控制台输出最新版本release更新日志
			INFO(changelog);
			INFO("下载地址：" + download_url);
		} else {
			INFO("检查更新成功！当前版本已是最新版本！");
		}
	} else {
		//向控制台输出错误状态码
		WARN("检查更新失败！错误状态码：" + res->status);
		WARN("检查更新失败！");
	}

}
#else
void sslThread(){
}
#endif

signed int main(signed int argc, char** argv) {



	std::string LanguageFile = "";
	std::string IPAddress = "127.0.0.1";
	int ServerPort = 10086;
	bool UseCmd = false;
	bool UseQQBot = true;
	int ClientPort = 10023;
	std::string Locate = "/qqEvent";
	std::string OwnerQQ = "123456789";
	std::string QQGroup = "123456789";

	std::cout << "\033]0;NIAHttpBOT " << VERSION <<"\007";

#ifdef WIN32
	SetConsoleOutputCP(65001);
#endif

	//检测是否有其他进程正在运行
	#ifdef WIN32
		HANDLE hMutex = CreateMutex(NULL, FALSE, "NIAHttpBOT");
		if (hMutex == NULL) {
			WARN("CreateMutex failed!");
			return 1;
		}
		if (GetLastError() == ERROR_ALREADY_EXISTS) {
			WARN("检测到已有进程正在运行，3s后即将关闭当前进程。");
			std::this_thread::sleep_for(std::chrono::seconds(3));
			CloseHandle(hMutex);
			return 1;
		}
	#else
		int fd = open("lockfile", O_RDWR | O_CREAT, 0666);
		if (fd < 0) {
			WARN("open lockfile failed");
			return 1;
		}
		if (lockf(fd, F_TLOCK, 0) < 0) {
			WARN("检测到已有进程正在运行，3s后即将关闭当前进程。");
			std::this_thread::sleep_for(std::chrono::seconds(3));
			close(fd);
			return 1;
		}
	#endif

	std::ios::sync_with_stdio(false), std::cin.tie(0), std::cout.tie(0);

	std::cout<<"\x1b[36m"<<R"(
    __/\\\\\_____/\\\___/\\\\\\\\\\\______/\\\\\\\\\____
     _\/\\\\\\___\/\\\__\/////\\\///_____/\\\\\\\\\\\\\__
      _\/\\\/\\\__\/\\\______\/\\\_______/\\\/////////\\\_
       _\/\\\//\\\_\/\\\______\/\\\______\/\\\_______\/\\\_
        _\/\\\\//\\\\/\\\______\/\\\______\/\\\\\\\\\\\\\\\_
         _\/\\\_\//\\\/\\\______\/\\\______\/\\\/////////\\\_
          _\/\\\__\//\\\\\\______\/\\\______\/\\\_______\/\\\_
           _\/\\\___\//\\\\\___/\\\\\\\\\\\__\/\\\_______\/\\\_
            _\///_____\/////___\///////////___\///________\///__
    )";

	std::cout<<"\x1b[0;32m"<<
	R"(
	   _  _    _____   _____     ___             ___     ___    _____
    o O O | || |  |_   _| |_   _|   | _ \    o O O  | _ )   / _ \  |_   _|
   o      | __ |    | |     | |     |  _/   o       | _ \  | (_) |   | |
  TS__[O] |_||_|   _|_|_   _|_|_   _|_|_   TS__[O]  |___/   \___/   _|_|_
 {======|_|"""""|_|"""""|_|"""""|_| """ | {======|_|"""""|_|"""""|_|"""""|
./o--000'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'./o--000'"`-0-0-'"`-0-0-'"`-0-0-'
	)" <<"\x1b[0m"<< std::endl;

	CFGPAR::parser par;

	//解析版本号，如果版本号后面有-pre-则输出警告这是一个预览版本
	if (std::string(VERSION).find("-pre-") != std::string::npos) {
		WARN("这是一个预发布版本，仅供开发者预览，不要在正式生产环境中使用！");
	}

	//首先检查有没有配置文件
	if (!par.parFromFile("./NIAHttpBOT.cfg")) {
		std::ofstream outcfgFile("NIAHttpBOT.cfg");
		outcfgFile << "# 基础配置:\n\nLanguageFile = \"\"\nIPAddress = \"127.0.0.1\"\nServerPort = 10086\n\n# 功能配置:\n\nUseCmd = false\n\n# QQ机器人配置:\n\nUseQQBot = true\nClientPort = 10023\nLocate = \"/qqEvent\"\nOwnerQQ = \"123456789\"\nQQGroup = \"123456789\"";
		outcfgFile.close();
		WARN("未找到配置文件，已自动初始化配置文件 NIAHttpBOT.cfg");
	} else {
		IPAddress = par.getString("IPAddress");
		ServerPort = par.getInt("ServerPort");
		UseCmd = par.getBool("UseCmd");
		UseQQBot = par.getBool("UseQQBot");
		ClientPort = par.getInt("ClientPort");
		Locate = par.getString("Locate");
		OwnerQQ = par.getString("OwnerQQ");
		QQGroup = par.getString("QQGroup");
		INFO("已成功读取配置文件！");
		if(!par.hasKey("LanguageFile") || !par.getString("LanguageFile").size()) INFO("已使用默认语言");
		else if(!i18n.loadFromFile(par.getString("LanguageFile"))) WARN("语言文件加载失败");
		else XINFO("语言配置已加载成功");
	}

	INFO(X("sapi事件监听服务器已在 ") + IPAddress + ":" + std::to_string(ServerPort) + X(" 上成功启动!"));
	if (UseQQBot) {
		INFO(X("qq-bot事件监听服务器已在 ") + IPAddress + ":" + std::to_string(ServerPort) + Locate + X(" 上成功启动!"));
		INFO(X("qq-bot客户端已在 ") + IPAddress + ":" + std::to_string(ClientPort) + X(" 上成功启动!"));
	}
	XINFO("项目地址：https://github.com/Nia-Server/NiaServer-Core/tree/main/NIAHttpBOT");
	XINFO("项目作者：@NIANIANKNIA @jiansyuan");
	XINFO("在使用中遇到问题请前往项目下的 issue 反馈，如果觉得本项目不错不妨点个 star！");
	if (UseCmd)  XWARN("检测到执行DOS命令功能已启用，请注意服务器安全！");


	#ifdef WIN32
	// std::thread ssl_thread(sslThread);
	// ssl_thread.detach();
	sslThread();
	#endif

	//初始化服务器
	httplib::Server svr;


    svr.Post("/GetConfig", [&par](const httplib::Request& req, httplib::Response& res){
		rapidjson::Document req_json;
		req_json.Parse(req.body.c_str()), res.status = 400;
		if(req_json.HasParseError()||!req_json.HasMember("Name")||!req_json.HasMember("Type")
			||!par.hasKey(req_json["Name"].GetString())) [[unlikely]] // Type: B->bool, I->int, C->char, S->string
			return res.set_content("json data error", "text/plain");
		switch(req_json["Type"].GetString()[0]) {
			case 'B':
				if(!par.isBool("Name")) [[unlikely]] goto error;
				res.set_content(par.getBool("Name")?"1":"0", "text/plain");
				break;
			case 'I':
				if(!par.isInt("Name")) [[unlikely]] goto error;
				res.set_content(std::to_string(par.getInt("Name")), "text/plain");
				break;
			case 'C':
				if(!par.isChar("Name")) [[unlikely]] goto error;
				res.set_content(std::string()+par.getChar("Name"), "text/plain");
				break;
			case 'S':
				if(!par.isString("Name")) [[unlikely]] goto error;
				res.set_content(par.getString("Name"), "text/plain");
				break;
			[[unlikely]]default : error:
				res.status = 114514, res.set_content("config type error", "text/plain");
		}
		if(res.status!=114514) [[likely]] res.status=200;

	});

	//执行cmd命令
	svr.Post("/RunCmd",  [UseCmd](const httplib::Request& req, httplib::Response& res) {
		//首先判断配置文件是否启用
		if (!UseCmd) [[unlikely]] {
			XWARN("执行DOS命令的功能暂未启用！请在启用后使用！");
			res.set_content("feature not enabled!", "text/plain");
			return ;
		}
		const std::string& cmd = req.body;
		WARN(X("收到一条执行DOS命令的请求：") + cmd);
		auto [cmdres, excd] = ([&cmd]() -> std::pair<std::string, int> {
			int exitCode = 0;
			std::array<char, 64> buffer {};
			std::string result;
			FILE *pipe = popen(cmd.c_str(), "r");
			if (pipe == nullptr) [[unlikely]] return {"popen() error!!", -114514};
			std::size_t bytesRead;
			while ((bytesRead = std::fread(buffer.data(), sizeof(buffer.at(0)), sizeof(buffer), pipe)) != 0) 
				result += std::string(buffer.data(), bytesRead);
			exitCode = WEXITSTATUS(pclose(pipe));
			return {result, exitCode};
		})();
		if(cmdres[cmdres.size()-1]=='\n') [[likely]] cmdres.pop_back();
		INFO(X("命令执行输出: ") + cmdres);
		if (excd!=0) [[unlikely]] WARN(X("命令执行失败, 返回值: ")+std::to_string(excd));
		else XINFO("命令执行成功！返回值: 0");
		res.set_content(cmdres, "text/plain"), res.status = excd; // exitCode
	});


	//qq机器人主函数
	main_qqbot(svr);

	//初始化游戏API
	init_game_API(svr);

	//初始化文件API
	init_file_API(svr);

	//监听终端命令输入
	using CommandHandler = std::function<void(const std::vector<std::string>&)>;

    std::unordered_map<std::string, CommandHandler> commandMap;

    commandMap["help"] = [](const std::vector<std::string>&) {
        std::cout << "可用指令列表：" << std::endl;
        std::cout << "  reload - 重启程序" << std::endl;
        std::cout << "  stop - 关闭程序" << std::endl;
        std::cout << "  setcfg <cfgname> <cfgdata> - 设置配置项" << std::endl;
    };

	std::string programName = argv[0];
	commandMap["reload"] = [programName](const std::vector<std::string>&) {
        INFO("1s后重启程序..." );
        std::this_thread::sleep_for(std::chrono::seconds(1));
        #ifdef _WIN32
        std::system(("start cmd /k " + std::string(programName)).c_str());
        #else
        if (fork() == 0) {
            execl(programName, programName, (char*)NULL);
        }
        #endif
        exit(0);
    };

    commandMap["stop"] = [](const std::vector<std::string>&) {
        INFO("1s后将关闭程序...");
        std::this_thread::sleep_for(std::chrono::seconds(1));
        exit(0);
    };

    commandMap["setcfg"] = [](const std::vector<std::string>& args) {
        if (args.size() < 3) {
            WARN("setcfg 指令需要两个参数: <cfgname> <cfgdata>");
            return;
        }
        std::string cfgname = args[1];
        std::string cfgdata = args[2];
    };

    // 启动输入监听线程
    std::thread inputThread([&commandMap]() {
        std::string line;
        while (std::getline(std::cin, line)) {
            std::istringstream iss(line);
            std::vector<std::string> tokens;
            std::string token;
            while (iss >> token) {
                tokens.push_back(token);
            }
            if (tokens.empty()) {
                continue;
            }
            auto it = commandMap.find(tokens[0]);
            if (it != commandMap.end()) {
                it->second(tokens); // 调用对应的处理函数
            } else {
                std::cout << "未知指令，请检查后再次输入！" << std::endl;
            }
        }
    });

	svr.listen(IPAddress, ServerPort);

    // 等待输入线程完成
    inputThread.join();

	return 0;
}
