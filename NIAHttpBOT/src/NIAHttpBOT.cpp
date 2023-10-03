
#include <ctime>
#include <iostream>
#include <fstream>
#include <string>
#include <filesystem>
#include <syncstream>
#include <cstdlib>
#include <cstdio> 

#include <httplib.h>
#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>

#include "CFG_Parser.hpp"
#include "I18Nize.hpp"
#include "Logger.hpp"

#include "File_API.h"
#include "Game_API.h"

#ifdef _WIN32
#define popen _popen
#define pclose _pclose
#define WEXITSTATUS
#endif

signed int main(signed int argc, char** argv) {

	std::string IPAddress = "127.0.0.1";
	int PORT = 10086;
	bool UseCmd = false;

    std::cout << "\033]0;NIAHttpBOT V1.4.0\007";

#ifdef WIN32
	SetConsoleOutputCP(65001);
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


	//首先检查有没有配置文件
	if (!par.parFromFile("./NIAHttpBOT.cfg")) {
		std::ofstream outcfgFile("NIAHttpBOT.cfg");
		outcfgFile << "# 基础配置:\n\nLanguageFile = \"\"\nIPAddress = \"127.0.0.1\"\nPort = 10086\n\n# 功能配置:\n\nUseCmd = false\n";
		outcfgFile.close();
		WARN("未找到配置文件，已自动初始化配置文件 NIAHttpBOT.cfg");
	} else {
		IPAddress = par.getString("IPAddress");
		PORT = par.getInt("Port");
		UseCmd = par.getBool("UseCmd");
		INFO("已成功读取配置文件！");
		if(!par.hasKey("LanguageFile") || !par.getString("LanguageFile").size()) INFO("已使用默认语言");
		else if(!i18n.loadFromFile(par.getString("LanguageFile"))) WARN("语言文件加载失败");
		else XINFO("语言配置已加载成功");
	}

	INFO(X("NIAHttpBOT 已在 ") + IPAddress + ":" + std::to_string(PORT) + X(" 上成功启动!"));
	XINFO("项目地址：https://github.com/NIANIANKNIA/NIASERVER-V4/tree/main/NIAHttpBOT");
	XINFO("项目作者：@NIANIANKNIA @jiansyuan");
	XINFO("在使用中遇到问题请前往项目下的 issue 反馈，如果觉得本项目不错不妨点个 star！");
	if (UseCmd)  XWARN("检测到执行DOS命令功能已启用，请注意服务器安全！");



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

	init_game_API(svr);

	init_file_API(svr);

	svr.listen(IPAddress, PORT);

	return 0;
}
