
#include "File_API.h"

void init_file_API(httplib::Server &svr) {



	//检查文件是否存在
	svr.Post("/CheckFile", [](const httplib::Request& req, httplib::Response& res) {
		INFO(X("接收到检查文件是否存在的请求，请求检查的文件名称: ") << req.body);
		std::ifstream file(req.body);
		res.status = 200;
		res.set_content(file?"true":"false", "text/plain");
		file.close();
	});

		//检测指定文件夹是否存在
	svr.Post("/CheckDir",  [](const httplib::Request& req, httplib::Response& res) {
		res.status = 200;
		std::filesystem::path p{req.body};
		if (std::filesystem::exists(p)) {
			res.set_content("true", "text/plain");
		} else {
			res.set_content("false", "text/plain");
		}
	});

	//创建新的文件
	svr.Post("/CreateNewFile", [](const httplib::Request& req, httplib::Response& res) {
		XINFO("接收到创建文件的请求！ ");
		//解析字符串并创建一个json对象
		rapidjson::Document NewFileData;
		NewFileData.Parse(req.body.c_str());
		//判断是否解析成功
		if (NewFileData.HasParseError()) [[unlikely]]{
			res.status = 400;
			res.set_content("Data parsing failed", "text/plain");
			return ;
		}
		if(!NewFileData.HasMember("fileName")) [[unlikely]]{
			res.status = 400;
			res.set_content("The fileName key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		if(!NewFileData.HasMember("content")) [[unlikely]]{
			res.status = 400;
			res.set_content("The content key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		//初始化文件名称
		std::string fileName = "";
		//读取键为fileName的内容
		//读取文件名称
		fileName = NewFileData["fileName"].GetString();
		//读取文件内容
		std::string fileContent = NewFileData["content"].GetString();
		// 检测${fileName}文件是否存在，如果不存在，就创建一个新的文件，并写入内容
		std::ifstream file(fileName);
		if(file) [[unlikely]]{
			res.status = 400;
			res.set_content("The target file already exists and cannot be regenerated.", "text/plain");
			return ;
		}
		//打开指定文件开始写入数据
		std::ofstream outFile(fileName);
		outFile << fileContent;
		outFile.close();
		res.status = 200;
		res.set_content("success", "text/plain");
		file.close();
	});


	//创建新的json文件
	svr.Post("/CreateNewJsonFile", [](const httplib::Request& req, httplib::Response& res) {
		XINFO("接收到创建json文件的请求！ ");
		//解析字符串并创建一个json对象
		rapidjson::Document NewFileData;
		NewFileData.Parse(req.body.c_str());
		//判断是否解析成功
		if (NewFileData.HasParseError()) [[unlikely]]{
			res.status = 400;
			res.set_content("Data parsing failed", "text/plain");
			return ;
		}
		if(!NewFileData.HasMember("fileName")) [[unlikely]]{
			res.status = 400;
			res.set_content("The fileName key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		if(!NewFileData.HasMember("content")) [[unlikely]]{
			res.status = 400;
			res.set_content("The content key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		//初始化文件名称
		std::string fileName = "";
		//读取键为fileName的内容
		//读取文件名称
		fileName = NewFileData["fileName"].GetString();
		//读取文件内容
		rapidjson::Value& content = NewFileData["content"];
		//将文件内容转换为字符串，便于后续写入文件
		rapidjson::StringBuffer buffer;
		rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
		writer.SetIndent(' ', 4);
		content.Accept(writer);
		// 检测${fileName}文件是否存在，如果不存在，就创建一个新的文件，并写入内容
		std::ifstream file(fileName);
		if(file) [[unlikely]]{
			res.status = 400;
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

	//获取文件数据
	svr.Post("/GetFileData", [](const httplib::Request& req, httplib::Response& res) {
		INFO(X("接收到获取文件数据的请求,请求获取的文件名称为： ") << req.body);
		//初始化文件名称
		std::string fileName = req.body;
		//判断文件存不存在
		std::ifstream file(fileName);
		if(!file) [[unlikely]]{
			//文件打开失败
			res.status = 400;
			res.set_content("The target file does not exist", "text/plain");
			return ;
		}
		std::string line_content;
		std::string file_data = "";
		while(getline(file,line_content))
			file_data = file_data + line_content + "\n";
		res.status = 200;
		res.set_content(file_data, "text/plain");
		file.close();
	});

	//获取json文件数据
	svr.Post("/GetJsonFileData", [](const httplib::Request& req, httplib::Response& res) {
		INFO(X("接收到获取文件数据的请求,请求获取的文件名称为： ") << req.body);
		//初始化文件名称
		std::string fileName = req.body;
		//判断文件存不存在
		std::ifstream file(fileName);
		if(!file) [[unlikely]]{
			//文件打开失败
			res.status = 400;
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

	//向目标文件覆盖内容
	svr.Post("/OverwriteFile",  [](const httplib::Request& req, httplib::Response& res) {
		XINFO("接收到覆写文件的请求！");
		//解析字符串并创建一个json对象
		rapidjson::Document OverwriteFileData;
		OverwriteFileData.Parse(req.body.c_str());
		//判断是否解析成功
		if (OverwriteFileData.HasParseError()) [[unlikely]]{
			res.status = 400;
			res.set_content("Data parsing failed", "text/plain");
			return ;
		}
		if(!OverwriteFileData.HasMember("fileName")) [[unlikely]]{
			res.status = 400;
			res.set_content("The fileName key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		if(!OverwriteFileData.HasMember("content")) [[unlikely]]{
			res.status = 400;
			res.set_content("The content key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		//初始化文件名称
		std::string fileName = "";
		//读取文件名称
		fileName = OverwriteFileData["fileName"].GetString();
		//读取文件内容
		std::string fileContent = OverwriteFileData["content"].GetString();
		// 检测${fileName}文件是否存在
		std::ifstream file(fileName);
		if(!file) [[unlikely]]{
			res.status = 400;
			res.set_content("The target file does not exist.", "text/plain");
			return ;
		}
		//打开指定文件开始写入数据
		std::ofstream outFile(fileName);
		outFile << fileContent;
		outFile.close();
		res.status = 200;
		res.set_content("success", "text/plain");
		file.close();
	});

	//覆盖json文件内容
	svr.Post("/OverwriteJsonFile", [](const httplib::Request& req, httplib::Response& res) {
		XINFO("接收到覆写 json 文件的请求！");
		//解析字符串并创建一个json对象
		rapidjson::Document overWriteFileData;
		overWriteFileData.Parse(req.body.c_str());
		//判断是否解析成功
		if (overWriteFileData.HasParseError()) [[unlikely]]{
			res.status = 400;
			res.set_content("Data parsing failed", "text/plain");
			return ;
		}
		if(!overWriteFileData.HasMember("fileName")) [[unlikely]]{
			res.status = 400;
			res.set_content("The fileName key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		if(!overWriteFileData.HasMember("content")) [[unlikely]]{
			res.status = 400;
			res.set_content("The fileData key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		//初始化文件名称
		std::string fileName = "";
		//读取键为fileName的内容
		//读取文件名称
		fileName = overWriteFileData["fileName"].GetString();
		//读取文件内容
		rapidjson::Value& content = overWriteFileData["content"];
		//将文件内容转换为字符串，便于后续写入文件
		rapidjson::StringBuffer buffer;
		rapidjson::PrettyWriter<rapidjson::StringBuffer> writer(buffer);
		writer.SetIndent(' ', 4);
		content.Accept(writer);
		// 检测${fileName}文件是否存在，如果不存在，就创建一个新的文件，并写入内容
		std::ifstream file(fileName);
		if(!file) [[unlikely]]{
			res.status = 400;
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


	//向目标文件写入一行内容
	svr.Post("/WriteLineToFile",  [](const httplib::Request& req, httplib::Response& res) {
		XINFO("接收到向目标文件写入一行内容的请求！");
		//解析字符串并创建一个json对象
		rapidjson::Document WriteLineData;
		WriteLineData.Parse(req.body.c_str());
		//判断是否解析成功
		if (WriteLineData.HasParseError()) [[unlikely]]{
			res.status = 400;
			res.set_content("Data parsing failed", "text/plain");
			return ;
		}
		if(!WriteLineData.HasMember("fileName")) [[unlikely]]{
			res.status = 400;
			res.set_content("The fileName key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		if(!WriteLineData.HasMember("content")) [[unlikely]]{
			res.status = 400;
			res.set_content("The content key for the json object was not found! Please recheck and send again.", "text/plain");
			return ;
		}
		//初始化文件名称
		std::string fileName = "";
		//读取文件名称
		fileName = WriteLineData["fileName"].GetString();
		//读取文件内容
		std::string fileContent = WriteLineData["content"].GetString();
		// 检测${fileName}文件是否存在，如果不存在，就创建一个新的文件，并写入内容
		std::ifstream file(fileName);
		if(!file)  [[unlikely]]{
			res.status = 400;
			res.set_content("The target file does not exist.", "text/plain");
			return ;
		}
		//打开指定文件开始写入数据
		std::ofstream outFile(fileName, std::ios_base::app);
		outFile << fileContent;
		outFile.close();
		res.status = 200;
		res.set_content("success", "text/plain");
		file.close();
	});

	svr.Post("/CopyFolder", [](const httplib::Request& req, httplib::Response& res) {

		rapidjson::Document req_json;
		req_json.Parse(req.body.c_str()), res.status = 400;
		if(req_json.HasParseError()||!req_json.HasMember("Folder")||!req_json.HasMember("To")) [[unlikely]]
			return res.set_content("json data error", "text/plain");
    	try {
			std::filesystem::copy(req_json["Folder"].GetString(), req_json["To"].GetString(),
				std::filesystem::copy_options::recursive); // copy totally
			res.status = 200;
		} catch(const std::filesystem::filesystem_error& err) {
			res.set_content("transfer folder error, " + std::string(err.what()), "text/plain");
		}
		if(res.status == 200) [[likely]] res.set_content("success", "text/plain");
	});

	svr.Post("/CopyFolderOverwrite", [](const httplib::Request& req, httplib::Response& res) {

		rapidjson::Document req_json;
		req_json.Parse(req.body.c_str()), res.status = 400;
		if(req_json.HasParseError()||!req_json.HasMember("Folder")||!req_json.HasMember("To")) [[unlikely]]
			return res.set_content("json data error", "text/plain");
    	try {
			std::filesystem::copy(req_json["Folder"].GetString(), req_json["To"].GetString(),
				std::filesystem::copy_options::recursive | std::filesystem::copy_options::overwrite_existing); // copy totally and overwrite
			res.status = 200;
		} catch(const std::filesystem::filesystem_error& err) {
			res.set_content("transfer folder error, " + std::string(err.what()), "text/plain");
		}
		if(res.status == 200) [[likely]] res.set_content("success", "text/plain");
	});

	svr.Post("/CopyFile", [](const httplib::Request& req, httplib::Response& res) {

		rapidjson::Document req_json;
		req_json.Parse(req.body.c_str()), res.status = 400;
		if(req_json.HasParseError()||!req_json.HasMember("File")||!req_json.HasMember("To")) [[unlikely]]
			return res.set_content("json data error", "text/plain");
    	try {
			std::filesystem::copy_file(req_json["File"].GetString(), req_json["To"].GetString(),
				std::filesystem::copy_options::none);
			res.status = 200;
		} catch(const std::filesystem::filesystem_error& err) {
			res.set_content("transfer file error, " + std::string(err.what()), "text/plain");
		}
		if(res.status == 200) [[likely]] res.set_content("success", "text/plain");
	});

	svr.Post("/CopyFileOverwrite", [](const httplib::Request& req, httplib::Response& res) {

		rapidjson::Document req_json;
		req_json.Parse(req.body.c_str()), res.status = 400;
		if(req_json.HasParseError()||!req_json.HasMember("File")||!req_json.HasMember("To")) [[unlikely]]
			return res.set_content("json data error", "text/plain");
    	try {
			std::filesystem::copy_file(req_json["File"].GetString(), req_json["To"].GetString(),
				std::filesystem::copy_options::overwrite_existing); // overwrite
			res.status = 200;
		} catch(const std::filesystem::filesystem_error& err) {
			res.set_content("transfer file error, " + std::string(err.what()), "text/plain");
		}
		if(res.status == 200) [[likely]] res.set_content("success", "text/plain");
	});


}



