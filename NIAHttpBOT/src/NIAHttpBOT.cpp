
#include <ctime>
#include <iostream>
#include <fstream>
#include <string>

#include <httplib.h>
#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>

#include "CFG_Parser.hpp"

#define INFO(a) GetTime(), std::cout<<"\x1b[32m[INFO]\x1b[0m "<<a<<std::endl
#define WARN(a) GetTime(), std::cout<<"\x1b[43;1m[WARN]\x1b[0m "<<a<<std::endl
#define REMOVE_PATH(a) (a + sizeof(__PROJECT__) -1)
#define FAIL(a) GetTime(), std::cout<<"\x1b[41;1m[FAIL]\x1b[0m \x1b[36;45;4mError at " \
	<<REMOVE_PATH(__FILE__)<<":"<<__LINE__<<" ("<<__FUNCTION__ \
	<<")\x1b[0m ==>\n"<<a<<'\n'<<std::endl
#define LOG(sym,str) GetTime(), std::cout<<#sym" "<<str<<std::endl

const std::string IPAddress = "127.0.0.1";
const int PORT = 10086;


void GetTime() {
	time_t timep; tm p;
    char time_buffer[80];
	time(&timep), localtime_s(&p, &timep);
    strftime(time_buffer, sizeof(time_buffer), "[%Y/%m/%d %H:%M:%S] ", &p);
	std::cout << "\x1b[35m" << time_buffer << "\x1b[0m";
}

int main() {
	SetConsoleOutputCP(65001);
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
R"(           _  _    _____   _____     ___             ___     ___    _____  
    o O O | || |  |_   _| |_   _|   | _ \    o O O  | _ )   / _ \  |_   _| 
   o      | __ |    | |     | |     |  _/   o       | _ \  | (_) |   | |   
  TS__[O] |_||_|   _|_|_   _|_|_   _|_|_   TS__[O]  |___/   \___/   _|_|_  
 {======|_|"""""|_|"""""|_|"""""|_| """ | {======|_|"""""|_|"""""|_|"""""| 
./o--000'"`-0-0-'"`-0-0-'"`-0-0-'"`-0-0-'./o--000'"`-0-0-'"`-0-0-'"`-0-0-' 
)" <<"\x1b[0m"<< std::endl;

	INFO("NIAHttpBOT 已在 " + IPAddress + ":" + std::to_string(PORT) + " 上成功启动!");
	INFO("项目地址：https://github.com/NIANIANKNIA/NIASERVER-V4/tree/main/NIAHttpBOT");
	INFO("项目作者：@NIANIANKNIA @jiansyuan");
	INFO("在使用中遇到问题请前往项目下的 issue 反馈，如果觉得本项目不错不妨点个 star！");

	CFGPAR::parser par;
	par.parFromFile("./test.cfg");
	bool enableFeature = par.getBool("enable_feature");
	bool useCache = par.getBool("use_cache");

	int maxConnections = par.getInt("max_connections");
	int timeout = par.getInt("timeout");

	char delimiter = par.getChar("delimiter");
	char quote = par.getChar("quote");

	std::string welcomeMessage = par.getString("welcome_message");
	std::string apiEndpoint = par.getString("api_endpoint");

	bool unusedValueIsNull = par.isNull("unused_value");
	
	std::cout << "enable_feature: " << enableFeature << std::endl;
	std::cout << "use_cache: " << useCache << std::endl;
	std::cout << "max_connections: " << maxConnections << std::endl;
	std::cout << "timeout: " << timeout << std::endl;
	std::cout << "delimiter: " << delimiter << std::endl;
	std::cout << "quote: " << quote << std::endl;
	std::cout << "welcome_message: " << welcomeMessage << std::endl;
	std::cout << "api_endpoint: " << apiEndpoint << std::endl;
	std::cout << "unused_value is null: " << unusedValueIsNull << std::endl;


	httplib::Server svr;

	//服务器开启检测
	svr.Get("/ServerStarted", [](const httplib::Request&, httplib::Response& res) {
		INFO("Minecraft服务器连接成功！");
		res.status = 200;
		res.set_content("服务器已启动", "text/plain");
	});
	svr.Post("/Check", [](const httplib::Request& req, httplib::Response& res) {
		res.status = 200;
		res.set_content("{\"msgboxs\":[]}", "text/plain");
	});
	//玩家加入服务器检测
	svr.Post("/PlayerJoin", [](const httplib::Request& req, httplib::Response& res) {
		INFO("玩家 " << req.body << " 进入了服务器");
		res.status = 200;
		res.set_content("玩家进入服务器", "text/plain");
	});
	//玩家离开服务器检测
	svr.Post("/PlayerLeave", [](const httplib::Request& req, httplib::Response& res) {
		INFO("玩家 " << req.body << " 离开了服务器");
		res.status = 200;
		res.set_content("玩家离开服务器", "text/plain");
	});
	//玩家发言检测
	svr.Post("/PlayerChat", [](const httplib::Request& req, httplib::Response& res) {
		INFO("玩家发言 " << req.body);
		res.status = 200;
		res.set_content("玩家进入服务器", "text/plain");
	});
	//玩家市场初始化检测
	svr.Post("/MarketInitialize", [](const httplib::Request& req, httplib::Response& res) {
		INFO("读取玩家市场文件！");
		res.status = 200;
		res.set_content("[]", "text/plain");
	});

	//检查文件是否存在
	svr.Post("/CheckFile", [](const httplib::Request& req, httplib::Response& res) {
		INFO("接收到检查文件是否存在的请求，请求检查的文件名称: " << req.body);
		std::ifstream file(req.body);
		res.status = 200;
		res.set_content(file?"true":"false", "text/plain");
		file.close();
	});


	//创建新的json文件
	svr.Post("/CreateNewJsonFile", [](const httplib::Request& req, httplib::Response& res) {
		INFO("接收到创建文件的请求 ");
		//解析字符串并创建一个json对象
		rapidjson::Document NewFileData;
		NewFileData.Parse(req.body.c_str());
		//判断是否解析成功
		if (NewFileData.HasParseError()) {
			res.status = 200;
			res.set_content("Data parsing failed", "text/plain");
			return ;
		}
		if(!NewFileData.HasMember("fileName")){
			res.status = 200;
			res.set_content("Incorrect data format, please recheck and send again.", "text/plain");
			return ;
		}
		//初始化文件名称
		std::string fileName = "";
		//读取键为fileName的内容
		//读取文件名称
		fileName = NewFileData["fileName"].GetString();
		//读取文件内容
		rapidjson::Value& fileContent = NewFileData["fileContent"];
		//将文件内容转换为字符串，便于后续写入文件
		rapidjson::StringBuffer buffer;
		rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
		writer.SetIndent(' ', 4);
		fileContent.Accept(writer);
		// 检测${fileName}文件是否存在，如果不存在，就创建一个新的文件，并写入内容
		std::ifstream file(fileName);
		if(file){
			res.status = 200;
			res.set_content("The target file already exists and cannot be regenerated.", "text/plain");
			return ;
		}
		file.close();
		std::ofstream out(fileName);
		out << buffer.GetString();
		out.close();
		res.status = 200;
		res.set_content("success", "text/plain");
		file.close();
	});

	//获取json文件数据
	svr.Post("/GetJsonFileData", [](const httplib::Request& req, httplib::Response& res) {
		INFO("接收到获取文件数据的请求,请求获取的文件名称为： " << req.body);
		//初始化文件名称
		std::string fileName = req.body;
		//判断文件存不存在
		std::ifstream file(fileName);
		if(!file) {
			//文件打开失败
			res.status = 200;
			res.set_content("The target file does not exist", "text/plain");
			return ;
		}
		//文件打开成功，并创建文件流对象
		rapidjson::IStreamWrapper isw(file);
		//创建json对象
		rapidjson::Document doc;
		//从文件流中解析数据
		doc.ParseStream(isw);
		//将文件内容转换为字符串，便于后续写入文件
		rapidjson::StringBuffer buffer;
		rapidjson::Writer<rapidjson::StringBuffer> writer(buffer);
		doc.Accept(writer);
		std::string jsonStr = buffer.GetString();
		res.status = 200;
		res.set_content(jsonStr, "text/plain");
		file.close();
	});

	//覆盖json文件内容
	svr.Post("/OverwriteJsonFile", [](const httplib::Request& req, httplib::Response& res) {
		INFO("接收到覆写文件的请求，请求覆写文件的数据: " << req.body);
		//解析字符串并创建一个json对象
		rapidjson::Document NewFileData;
		NewFileData.Parse(req.body.c_str());
		//判断是否解析成功
		if (NewFileData.HasParseError()) {
			res.status = 200;
			res.set_content("Data parsing failed", "text/plain");
			return ;
		}
		if(!NewFileData.HasMember("fileName")){
			res.status = 200;
			res.set_content("Incorrect data format, please recheck and send again.", "text/plain");
			return ;
		}
		//初始化文件名称
		std::string fileName = "";
		//读取键为fileName的内容
		//读取文件名称
		fileName = NewFileData["fileName"].GetString();
		//读取文件内容
		rapidjson::Value& fileData = NewFileData["fileData"];
		//将文件内容转换为字符串，便于后续写入文件
		rapidjson::StringBuffer buffer;
		rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
		writer.SetIndent(' ', 4);
		fileData.Accept(writer);
		// 检测${fileName}文件是否存在，如果不存在，就创建一个新的文件，并写入内容
		std::ifstream file(fileName);
		if(!file) {
			res.status = 200;
			res.set_content("The target file does not exist.", "text/plain");
			return ;
		}
		std::ofstream out(fileName);
		out << buffer.GetString();
		out.close();
		res.status = 200;
		res.set_content("success", "text/plain");
		file.close();

	});

	svr.listen(IPAddress, PORT);

	return 0;
}
