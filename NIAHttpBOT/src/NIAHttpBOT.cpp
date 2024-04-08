
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

#include "QQBot.h"
#include "File_API.h"
#include "Game_API.h"

#ifdef _WIN32
#define popen _popen
#define pclose _pclose
#define WEXITSTATUS
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

    std::cout << "\033]0;NIAHttpBOT V1.5.0\007";

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

	INFO(X("NiaHttp-BOT 监听服务器已在 ") + IPAddress + ":" + std::to_string(ServerPort) + X(" 上成功启动!"));
	//如果配置文件中启用使用qq机器人，则输出qq机器人的监听端口
	if (UseQQBot) INFO(X("NiaHttp-BOT 客户端已在 ") + IPAddress + ":" + std::to_string(ClientPort) + Locate + X(" 上成功启动!"));
	XINFO("项目地址：https://github.com/Nia-Server/NiaServer-Core/tree/main/NIAHttpBOT");
	XINFO("项目作者：@NIANIANKNIA @jiansyuan");
	XINFO("在使用中遇到问题请前往项目下的 issue 反馈，如果觉得本项目不错不妨点个 star！");
	if (UseCmd)  XWARN("检测到执行DOS命令功能已启用，请注意服务器安全！");


	//初始化服务器
	httplib::Server svr;
	//初始化客户端
	//后续主要用于向QQ机器人发送消息
	httplib::Client cli(IPAddress + ":" + std::to_string(ClientPort));


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

	if (UseQQBot) {
		INFO("已启用QQ机器人相关功能！");
		//输出QQ机器人监听的qq群号
		INFO(X("QQ机器人监听的QQ群号为：") + QQGroup);
		//尝试与QQ机器人建立连接
		auto get_status_res = cli.Get("/get_status");
		if (get_status_res && get_status_res->status == 200) {
			INFO("已成功连接到QQ机器人！");
			main_qqbot(svr, cli, Locate, OwnerQQ, QQGroup);
			//发送指定群组消息
			cli.Post("/send_group_msg", "{\"group_id\":"+ QQGroup +",\"message\":\"NiaHttp-BOT已启动！\"}", "application/json");
		} else {
			WARN("QQ机器人连接失败！请检查QQ机器人是否已启动&&配置是否正确！");
			WARN("如需更多帮助请前往 https://docs.mcnia.com/dev/Http-Bot.html 查看！");
		}
	} else {
		WARN("未启用QQ机器人相关功能！");
	}

	svr.listen(IPAddress, ServerPort);

	return 0;
}
