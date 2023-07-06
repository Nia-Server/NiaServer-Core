
#include <time.h>
#include <iostream>
#include <fstream>
#include <string>
#include "httplib.h"
#include "rapidjson/document.h"
#include "rapidjson/stringbuffer.h"
#include "rapidjson/writer.h"
#include "rapidjson/prettywriter.h"
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>


void GetTime()
{
	time_t timep;
	struct tm* p;

	time(&timep);
	p = localtime(&timep);

	printf("[%d/%d/%d %02d:%02d:%02d] ", 1900 + p->tm_year, 1 + p->tm_mon, p->tm_mday, p->tm_hour, p->tm_min, p->tm_sec);//2019/2/28 14:18:31

}


int main()
{
	SetConsoleOutputCP(65001);
	GetTime();
	std::cout << "NIA服务器依赖服务器启动成功！" << std::endl;

	//检查配置文件是否存在


	httplib::Server svr;

	//服务器开启检测
	svr.Get("/ServerStarted", [](const httplib::Request&, httplib::Response& res) {
		GetTime();
		std::cout << "Minecraft服务器连接成功！\n";
		res.status = 200;
		res.set_content("服务器已启动", "text/plain");
		});
	svr.Post("/Check", [](const httplib::Request& req, httplib::Response& res) {
		res.status = 200;
		res.set_content("{\"msgboxs\":[]}", "text/plain");
		});
	//玩家加入服务器检测
	svr.Post("/PlayerJoin", [](const httplib::Request& req, httplib::Response& res) {
		GetTime();
		std::cout << "玩家 " << req.body << " 进入了服务器\n";
		res.status = 200;
		res.set_content("玩家进入服务器", "text/plain");
		});
	//玩家离开服务器检测
	svr.Post("/PlayerLeave", [](const httplib::Request& req, httplib::Response& res) {
		GetTime();
		std::cout << "玩家 " << req.body << " 离开了服务器\n";
		res.status = 200;
		res.set_content("玩家离开服务器", "text/plain");
		});
	//玩家发言检测
	svr.Post("/PlayerChat", [](const httplib::Request& req, httplib::Response& res) {
		GetTime();
		std::cout << "玩家发言 " << req.body << "\n";
		res.status = 200;
		res.set_content("玩家进入服务器", "text/plain");
		});
	//玩家市场初始化检测
	svr.Post("/MarketInitialize", [](const httplib::Request& req, httplib::Response& res) {
		GetTime();
		std::cout << "读取玩家市场文件！\n";
		res.status = 200;
		res.set_content("[]", "text/plain");
		});

	//检查文件是否存在
	svr.Post("/CheckFile", [](const httplib::Request& req, httplib::Response& res) {
		GetTime();
		std::cout << "接收到检查文件是否存在的请求，请求检查的文件名称: " << req.body << std::endl;
		std::ifstream file(req.body);
		if (file) {
			res.status = 200;
			res.set_content("true", "text/plain");
		}
		else {
			res.status = 200;
			res.set_content("false", "text/plain");
		}
		file.close();
		});


	//创建新的json文件
	svr.Post("/CreateNewJsonFile", [](const httplib::Request& req, httplib::Response& res) {
		GetTime();
		std::cout << "接收到创建文件的请求 " << std::endl;
		//将获取的body数据转换为char*
		char* json = (char*)req.body.c_str();
		//解析字符串并创建一个json对象
		rapidjson::Document NewFileData;
		NewFileData.Parse(json);
		//判断是否解析成功
		if (NewFileData.HasParseError()) {
			res.status = 200;
			res.set_content("Data parsing failed", "text/plain");
		}
		else {
			//初始化文件名称
			std::string fileName = "";
			//读取键为fileName的内容
			if (NewFileData.HasMember("fileName")) {
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
				if (!file) {
					file.close();
					std::ofstream out(fileName);
					out << buffer.GetString();
					out.close();
					res.status = 200;
					res.set_content("success", "text/plain");
				}
				else {
					res.status = 200;
					res.set_content("The target file already exists and cannot be regenerated.", "text/plain");
				};
				file.close();
			}
			else {
				res.status = 200;
				res.set_content("Incorrect data format, please recheck and send again.", "text/plain");
			}

		};

		});

	//获取json文件数据
	svr.Post("/GetJsonFileData", [](const httplib::Request& req, httplib::Response& res) {
		GetTime();
		std::cout << "接收到获取文件数据的请求,请求获取的文件名称为： " << req.body << std::endl;
		//初始化文件名称
		std::string fileName = req.body;
		//判断文件存不存在
		std::ifstream file(fileName);
		if (file) {
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
		}
		else {
			//文件打开失败
			res.status = 200;
			res.set_content("The target file does not exist", "text/plain");
		};
		file.close();
		});

	//覆盖json文件内容
	svr.Post("/OverwriteJsonFile", [](const httplib::Request& req, httplib::Response& res) {
		GetTime();
		std::cout << "接收到覆写文件的请求，请求覆写文件的数据: " << req.body << std::endl;
		//将获取的body数据转换为char*
		char* json = (char*)req.body.c_str();
		//解析字符串并创建一个json对象
		rapidjson::Document NewFileData;
		NewFileData.Parse(json);
		//判断是否解析成功
		if (NewFileData.HasParseError()) {
			res.status = 200;
			res.set_content("Data parsing failed", "text/plain");
		}
		else {
			//初始化文件名称
			std::string fileName = "";
			//读取键为fileName的内容
			if (NewFileData.HasMember("fileName")) {
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
				if (file) {
					std::ofstream out(fileName);
					out << buffer.GetString();
					out.close();
					res.status = 200;
					res.set_content("success", "text/plain");
				}
				else {
					res.status = 200;
					res.set_content("The target file does not exist.", "text/plain");
				};
				file.close();
			}
			else {
				res.status = 200;
				res.set_content("Incorrect data format, please recheck and send again.", "text/plain");
			}

		};

		});

	svr.listen("127.0.0.1", 10086);

	return 0;
}
