#include "QQBot_API.h"
//使用https://github.com/botuniverse/onebot-11/

void init_qqbot_API(httplib::Server &svr, httplib::Client &cli, std::string &Locate, std::string &QQGroup)
{
	//启动时向指定qq群发送消息
	cli.Post("/send_group_msg", "{\"group_id\":"+ QQGroup +",\"message\":\"NiaServer-Bot已启动！\"}", "application/json");

	//检查player_data.json文件是否存在,不存在则创建
	std::ifstream player_data_file("player_data.json");
	if (!player_data_file) {
		std::ofstream player_data_file("player_data.json");
		player_data_file << "{}";
		player_data_file.close();
		//向指定qq群发送消息
		cli.Post("/send_group_msg", "{\"group_id\":"+ QQGroup +",\"message\":\"player_data.json文件不存在，已自动创建！\"}", "application/json");
	}

	//接收QQ消息事件
	svr.Post(Locate, [&cli, &QQGroup](const httplib::Request& req, httplib::Response& res) {
		INFO(X("NiaHttp-BOT 客户端接收的数据为 ") << req.body);
		//解析字符串并创建一个json对象
		rapidjson::Document qqEventData;
		qqEventData.Parse(req.body.c_str());
		//解析post_type字段,用来判断事件类型
		std::string post_type = "";
		post_type = qqEventData["post_type"].GetString();

		//判断事件类型
		//处理消息事件
		if (post_type == "message") {
			//解析message字段
			std::string message = "";
			message = qqEventData["raw_message"].GetString();

			//解析sub_type字段
			std::string sub_type = "";
			sub_type = qqEventData["sub_type"].GetString();

			//如果是私聊消息
			if (sub_type == "private") {
				//解析user_id字段
				std::string user_id = "";
				user_id = std::to_string(qqEventData["user_id"].GetInt64());

				return ;
			}

			//如果是群消息
			if (sub_type == "group") {
				//解析group_id字段
				std::string group_id = "";
				group_id = std::to_string(qqEventData["group_id"].GetInt());

				//判断group_id是否为指定的QQ群
				if (group_id != QQGroup) {
					return ;
				}

				//判断消息是否以#开头
				if (message[0] == '#') {
					//判断#后直到空格的字符串
					std::string command = "";
					for (int i = 1; i < message.size(); i++) {
						if (message[i] == ' ') {
							break;
						}
						command += message[i];
					}

					//帮助菜单
					if (command == "帮助") {
						std::string helpMenu = "Nia-ServerBot菜单:\\n";
						helpMenu += "使用方法: 在消息中以#开头，后跟指令和参数\\n";
						helpMenu += "\\n";
						helpMenu += "==一般指令==\\n";
						helpMenu += "#帮助: 显示帮助菜单\\n";
						helpMenu += "#赞我: 给自己点10个赞\\n";
						helpMenu += "#绑定 <XboxID>: 绑定XboxID\\n";
						helpMenu += "例：#绑定 NIANIANKNIA\\n";
						helpMenu += "#查：查询自己账号的相关信息\\n";
						helpMenu += "#查 @要查询的人 : 查询别人账号的相关信息\\n";
						helpMenu += "\\n";
						helpMenu += "==管理指令==\\n";
						helpMenu += "#禁言 @要禁言的人 <时间>: 禁言指定群成员\\n";
						helpMenu += "例：#禁言 @NIANIANKNIA 1h\\n";
						helpMenu += "#解禁 @要解禁的人: 解禁指定群成员\\n";
						helpMenu += "#改绑 @要改绑的人 <XboxID>: 改绑XboxID\\n";
						helpMenu += "#封禁 @要封禁的人 <时间>: 封禁指定群成员游戏账号\\n";
						helpMenu += "例：#封禁 @NIANIANKNIA 1d\\n";
						helpMenu += "#解封 @要解封的人: 解封指定群成员账号\\n";
						helpMenu += "power by Nia-Http-Bot";
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"" + helpMenu + "\"}", "application/json");
						return;
					}

					//赞我
					if (command == "赞我") {
						//获取发送者的qq号
						std::string sender_qq = std::to_string(qqEventData["user_id"].GetInt64());
						//发送好友赞
						cli.Post("/send_like", "{\"user_id\":" + sender_qq + ",\"times\":10}", "application/json");
						//向群聊发送消息
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"已经给你点了十个赞哦！注意查收！\\n(一天只能一次，重复点赞无效！)\"}", "application/json");
						return;
					}

					//禁言
					if (command == "禁言") {
						//判断指令执行者是否为管理员
						std::string user_permission = "";
						user_permission = qqEventData["sender"]["role"].GetString();
						if (user_permission != "admin" && user_permission != "owner") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"您没有权限执行此操作！\"}", "application/json");
							return ;
						}
						//获取禁言字段
						std::string band_message = "";
						size_t firstSpace = message.find(' ');
						if (firstSpace != std::string::npos) {
							size_t secondSpace = message.find(' ', firstSpace + 1);
							if (secondSpace != std::string::npos) {
								band_message = message.substr(firstSpace + 1, secondSpace - firstSpace - 1);
							}
						}
						//获取禁言时间
						std::string band_time = "";
						size_t secondSpace = message.find(' ', firstSpace + 1);
						if (secondSpace != std::string::npos) {
							band_time = message.substr(secondSpace + 1);  // 从第二个空格后的位置开始获取子字符串
						}
						//判断band_message和band_time是否为空
						if (band_message == "" || band_time == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"禁言指令格式错误，禁言格式为:#禁言 @要禁言的人 时间\"}", "application/json");
							return ;
						}
						//从类似[CQ:at,qq=3374574180]中获取band_qq
						std::string band_qq = "";
						size_t firstComma = band_message.find(',');
						if (firstComma != std::string::npos) {
							size_t equalSign = band_message.find('=', firstComma + 1);
							if (equalSign != std::string::npos) {
								band_qq = band_message.substr(equalSign + 1, band_message.size() - equalSign - 2);
							}
						}
						//判断band_qq是否为空
						if (band_qq == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"禁言指令格式错误，禁言格式为:#禁言 @要禁言的人 时间\"}", "application/json");
							return ;
						}
						//解析band_time，将时间转换为秒,用长整型
						long long band_time_long = 0;
						//解析band_time，min后缀为分钟，h后缀为小时，d后缀为天
						if (band_time.find("min") != std::string::npos) {
							band_time_long = std::stoll(band_time.substr(0, band_time.size() - 3)) * 60;
						} else if (band_time.find("h") != std::string::npos) {
							band_time_long = std::stoll(band_time.substr(0, band_time.size() - 1)) * 60 * 60;
						} else if (band_time.find("d") != std::string::npos) {
							band_time_long = std::stoll(band_time.substr(0, band_time.size() - 1)) * 60 * 60 * 24;
						} else {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"禁言时间格式错误，时间格式要以min/h/d结尾\"}", "application/json");
							return ;
						}
						//判断禁言时间是否超过30天
						if (band_time_long > 60 * 60 * 24 * 30) {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"禁言时间不能超过30天！\"}", "application/json");
							return ;
						}
						//判断禁言时间是否小于1分钟
						if (band_time_long < 60) {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"禁言时间不能小于1分钟！\"}", "application/json");
							return ;
						}
						//禁言
						cli.Post("/set_group_ban", "{\"group_id\":" + group_id + ",\"user_id\":" + band_qq + ",\"duration\":" + std::to_string(band_time_long) + "}", "application/json");
						//向群聊发送消息
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"已成功禁言" + band_message + "，禁言时间为" + band_time + "\"}", "application/json");
						return ;
					}

					//解除禁言
					if (command == "解禁") {
						//判断指令执行者是否为管理员
						std::string user_permission = "";
						user_permission = qqEventData["sender"]["role"].GetString();
						if (user_permission != "admin" && user_permission != "owner") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"您没有权限执行此操作！\"}", "application/json");
							return ;
						}
						//获取解禁字段
						std::string unband_message = "";
						size_t firstSpace = message.find(' ');
						if (firstSpace != std::string::npos) {
							unband_message = message.substr(firstSpace + 1);
						}
						//判断unband_message是否为空
						if (unband_message == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"解禁指令格式错误，解禁格式为:#解 @要解禁的人\"}", "application/json");
							return ;
						}
						//从类似[CQ:at,qq=3374574180]中获取unband_qq
						std::string unband_qq = "";
						size_t firstComma = unband_message.find(',');
						if (firstComma != std::string::npos) {
							size_t equalSign = unband_message.find('=', firstComma + 1);
							if (equalSign != std::string::npos) {
								unband_qq = unband_message.substr(equalSign + 1, unband_message.size() - equalSign - 2);
							}
						}
						//判断unband_qq是否为空
						if (unband_qq == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"解禁指令格式错误，解禁格式为:#解 @要解禁的人\"}", "application/json");
							return ;
						}
						//解禁
						cli.Post("/set_group_ban", "{\"group_id\":" + group_id + ",\"user_id\":" + unband_qq + ",\"duration\":0}", "application/json");
						//向群聊发送消息
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"已成功解禁" + unband_message + "\"}", "application/json");
						return ;
					}

					//绑定
					if (command == "绑定") {
						//指令格式为:#绑定 XboxID
						//获取绑定字段
						std::string bind_message = "";
						size_t firstSpace = message.find(' ');
						if (firstSpace != std::string::npos) {
							bind_message = message.substr(firstSpace + 1);
						}
						//判断bind_message是否为空
						if (bind_message == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"绑定指令格式错误，绑定格式为:#绑定 XboxID\"}", "application/json");
							return ;
						}

						// 获取发送者的qq号
						std::string sender_qq = std::to_string(qqEventData["user_id"].GetInt64());

						//读取player_data.json文件
						std::ifstream players_data_file("player_data.json");
						//文件读取失败
						if (!players_data_file) {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
							return ;
						}
						//文件打开成功，读取json文件内容，并创建一个json对象
						rapidjson::Document players_data;
						rapidjson::IStreamWrapper isw(players_data_file);
						players_data.ParseStream(isw);
						//检查json文件中是否存在sender_qq
						if (players_data.HasMember(sender_qq.c_str())) {
							//向群聊发送消息“您已绑定Xboxid XXX，如需改绑请联系在线管理员！”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"您已绑定Xboxid " + players_data[sender_qq.c_str()]["xboxid"].GetString() + "，如需改绑请联系在线管理员！\"}", "application/json");
							return ;
						} else {
							//向player_data.json文件中添加形如"qq号":{"xboxid":"XBoxid"}的键值对，并写入文件
							//新建一个json对象
							rapidjson::Document player_data;
							player_data.SetObject();

							// 添加 "xboxid" 键值对到 player_data 对象中
							rapidjson::Value xbox(rapidjson::kStringType);
							xbox.SetString(bind_message.c_str(), player_data.GetAllocator());
							player_data.AddMember("xboxid", xbox, player_data.GetAllocator());

							// 添加 "qqid" 键值对到 player_data 对象中
							rapidjson::Value id(rapidjson::kStringType);
							id.SetString(sender_qq.c_str(), player_data.GetAllocator());
							player_data.AddMember("qqid", id, player_data.GetAllocator());

							// 添加 "status" 键值对到 player_data 对象中
							rapidjson::Value status(rapidjson::kStringType);
							status.SetString("normal", player_data.GetAllocator());
							player_data.AddMember("status", status, player_data.GetAllocator());

							// 添加 "ban_time" 键值对到 player_data 对象中
							rapidjson::Value ban_time(rapidjson::kStringType);
							ban_time.SetString("0", player_data.GetAllocator());
							player_data.AddMember("ban_time", ban_time, player_data.GetAllocator());

							// 添加 "role" 键值对到 player_data 对象中
							rapidjson::Value role(rapidjson::kStringType);
							role.SetString("member", player_data.GetAllocator());
							player_data.AddMember("role", role, player_data.GetAllocator());

							// 添加 "money" 键值对到 player_data 对象中
							rapidjson::Value money(rapidjson::kStringType);
							money.SetString("0", player_data.GetAllocator());
							player_data.AddMember("money", money, player_data.GetAllocator());

							//添加 "data:{}" 键值对到 player_data 对象中
							rapidjson::Value data(rapidjson::kObjectType);
							data.SetObject();
							player_data.AddMember("data", data, player_data.GetAllocator());

							// 添加 player_data 对象到 players_data 对象中
							rapidjson::Value key(sender_qq.c_str(), players_data.GetAllocator());
							players_data.AddMember(key, player_data, players_data.GetAllocator());

							//将players_data对象写入player_data.json文件，缩进为4
							std::ofstream players_data_file("player_data.json");
							rapidjson::OStreamWrapper osw(players_data_file);
							rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
							writer.SetIndent(' ', 4); // 设置缩进为4个空格
							players_data.Accept(writer);
							players_data_file.close();
							//向群聊发送类似“绑定Xboxid成功,绑定的Xboxid为：xxx，如需改绑请联系在线管理员！”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"绑定Xboxid成功,绑定的Xboxid为：" + bind_message + "，如需改绑请联系在线管理员！\"}", "application/json");
							return ;
						}

						return ;
					}

					//改变已经绑定的XboxID
					if (command == "改绑") {
						//指令格式为:#改绑 @qq XboxID
						//先判断指令执行者是否为管理员
						std::string user_permission = "";
						user_permission = qqEventData["sender"]["role"].GetString();
						if (user_permission != "admin" && user_permission != "owner") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"您没有权限执行此操作！\"}", "application/json");
							return ;
						}
						//获取改绑字段
						std::string rebind_message = "";
						size_t firstSpace = message.find(' ');
						if (firstSpace != std::string::npos) {
							rebind_message = message.substr(firstSpace + 1);
						}
						//判断rebind_message是否为空
						if (rebind_message == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改绑指令格式错误，改绑格式为:#改绑 @要改绑的人 XboxID\"}", "application/json");
							return ;
						}
						//从类似[CQ:at,qq=3374574180]中获取rebind_qq
						std::string rebind_qq = "";
						size_t firstComma = rebind_message.find(',');
						if (firstComma != std::string::npos) {
							size_t equalSign = rebind_message.find('=', firstComma + 1);
							if (equalSign != std::string::npos) {
								size_t closingBracket = rebind_message.find(']', equalSign + 1);
								if (closingBracket != std::string::npos) {
									rebind_qq = rebind_message.substr(equalSign + 1, closingBracket - equalSign - 1);
								}
							}
						}
						//判断rebind_qq是否为空
						if (rebind_qq == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改绑指令格式错误，改绑格式为:#改绑 @要改绑的人 XboxID\"}", "application/json");
							return ;
						}
						//获取新的XboxID
						std::string new_xboxid = "";
						size_t secondSpace = rebind_message.find(' ', firstSpace + 1);
						if (secondSpace != std::string::npos) {
							new_xboxid = rebind_message.substr(secondSpace + 1);
						}
						//判断new_xboxid是否为空
						if (new_xboxid == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改绑指令格式错误，改绑格式为:#改绑 @要改绑的人 XboxID\"}", "application/json");
							return ;
						}
						//读取player_data.json文件
						std::ifstream players_data_file("player_data.json");
						//文件读取失败
						if (!players_data_file) {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
							return ;
						}
						//文件打开成功，读取json文件内容，先检查json文件中是否存在rebind_qq
						rapidjson::Document players_data;
						rapidjson::IStreamWrapper isw(players_data_file);
						players_data.ParseStream(isw);
						if (players_data.HasMember(rebind_qq.c_str())) {
							//修改player_data.json文件中的XboxID
							players_data[rebind_qq.c_str()]["xboxid"].SetString(new_xboxid.c_str(), players_data.GetAllocator());
							//将players_data对象写入player_data.json文件，缩进为4
							std::ofstream players_data_file("player_data.json");
							rapidjson::OStreamWrapper osw(players_data_file);
							rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
							writer.SetIndent(' ', 4); // 设置缩进为4个空格
							players_data.Accept(writer);
							players_data_file.close();
							//向群聊发送类似“改绑Xboxid成功,改绑的Xboxid为：xxx”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改绑Xboxid成功,改绑的Xboxid为：" + new_xboxid + "\"}", "application/json");
							return ;
						} else {
							//向群聊发送消息“改绑失败，未找到该QQ号！”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改绑失败，未找到该QQ号！\"}", "application/json");
							return ;
						}
						return ;
					}

					//封禁玩家
					if (command == "封禁") {
						//指令格式为：#封禁 @qq 时间
						//封禁原理：将ban_time字段设置为当前时间+封禁时间后的时间字符串形似“2021-08-01 12:00:00“
						//先判断指令执行者是否为管理员
						std::string user_permission = "";
						user_permission = qqEventData["sender"]["role"].GetString();
						if (user_permission != "admin" && user_permission != "owner") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"您没有权限执行此操作！\"}", "application/json");
							return ;
						}
						//获取封禁字段
						std::string ban_message = "";
						size_t firstSpace = message.find(' ');
						if (firstSpace != std::string::npos) {
							ban_message = message.substr(firstSpace + 1);
						}
						//判断ban_message是否为空
						if (ban_message == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"封禁指令格式错误，封禁格式为:#封禁 @要封禁的人 时间\"}", "application/json");
							return ;
						}
						//从类似[CQ:at,qq=3374574180]中获取ban_qq
						std::string ban_qq = "";
						size_t firstComma = ban_message.find(',');
						if (firstComma != std::string::npos) {
							size_t equalSign = ban_message.find('=', firstComma + 1);
							if (equalSign != std::string::npos) {
								size_t closingBracket = ban_message.find(']', equalSign + 1);
								if (closingBracket != std::string::npos) {
									ban_qq = ban_message.substr(equalSign + 1, closingBracket - equalSign - 1);
								}
							}
						}
						//判断ban_qq是否为空
						if (ban_qq == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"封禁指令格式错误，封禁格式为:#封禁 @要封禁的人 时间\"}", "application/json");
							return ;
						}
						//获取封禁时间
						std::string ban_time = "";
						size_t secondSpace = message.find(' ', firstSpace + 1);
						if (secondSpace != std::string::npos) {
							ban_time = message.substr(secondSpace + 1);
						}
						//判断ban_time是否为空
						if (ban_time == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"封禁指令格式错误，封禁格式为:#封禁 @要封禁的人 时间\"}", "application/json");
							return ;
						}
						//解析ban_time，将时间转换为秒,用长整型
						long long ban_time_long = 0;
						//解析ban_time，min后缀为分钟，h后缀为小时，d后缀为天
						if (ban_time.find("min") != std::string::npos) {
							ban_time_long = std::stoll(ban_time.substr(0, ban_time.size() - 3)) * 60;
						} else if (ban_time.find("h") != std::string::npos) {
							ban_time_long = std::stoll(ban_time.substr(0, ban_time.size() - 1)) * 60 * 60;
						} else if (ban_time.find("d") != std::string::npos) {
							ban_time_long = std::stoll(ban_time.substr(0, ban_time.size() - 1)) * 60 * 60 * 24;
						} else {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"封禁时间格式错误，时间格式要以min/h/d结尾\"}", "application/json");
							return ;
						}
						//读取player_data.json文件
						std::ifstream players_data_file("player_data.json");
						//文件读取失败
						if (!players_data_file) {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
							return ;
						}
						//文件打开成功，读取json文件内容，先检查json文件中是否存在ban_qq
						rapidjson::Document players_data;
						rapidjson::IStreamWrapper isw(players_data_file);
						players_data.ParseStream(isw);
						if (players_data.HasMember(ban_qq.c_str())) {
							//修改player_data.json文件中的ban_time
							//获取当前时间
							time_t now = time(0);
							tm *ltm = localtime(&now);
							char ban_time_str[20];
							sprintf(ban_time_str, "%d-%02d-%02d %02d:%02d:%02d", 1900 + ltm->tm_year, 1 + ltm->tm_mon, ltm->tm_mday, ltm->tm_hour, ltm->tm_min, ltm->tm_sec);
							//将ban_time_long转换为时间字符串
							time_t ban_time_t = now + ban_time_long;
							tm *ltm_ban = localtime(&ban_time_t);
							char ban_time_str_ban[20];
							sprintf(ban_time_str_ban, "%d-%02d-%02d %02d:%02d:%02d", 1900 + ltm_ban->tm_year, 1 + ltm_ban->tm_mon, ltm_ban->tm_mday, ltm_ban->tm_hour, ltm_ban->tm_min, ltm_ban->tm_sec);
							//修改ban_time字段
							players_data[ban_qq.c_str()]["ban_time"].SetString(ban_time_str_ban, players_data.GetAllocator());
							//将players_data对象写入player_data.json文件，缩进为4
							std::ofstream players_data_file("player_data.json");
							rapidjson::OStreamWrapper osw(players_data_file);
							rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
							writer.SetIndent(' ', 4); // 设置缩进为4个空格
							players_data.Accept(writer);
							players_data_file.close();
							//向群聊发送类似“封禁成功,封禁时间为：xxx”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"封禁成功,封禁解除时间为：" + ban_time_str_ban + "\"}", "application/json");
							return ;
						} else {
							//向群聊发送消息“封禁失败，未找到该QQ号！”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"封禁失败，未找到该QQ号！\"}", "application/json");
							return ;
						}
						return ;

					}

					//解除封禁
					if (command == "解封") {
						//指令格式为：#解封 @qq
						//先判断指令执行者是否为管理员
						std::string user_permission = "";
						user_permission = qqEventData["sender"]["role"].GetString();
						if (user_permission != "admin" && user_permission != "owner") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"您没有权限执行此操作！\"}", "application/json");
							return ;
						}
						//获取解封字段
						std::string unban_message = "";
						size_t firstSpace = message.find(' ');
						if (firstSpace != std::string::npos) {
							unban_message = message.substr(firstSpace + 1);
						}
						//判断unban_message是否为空
						if (unban_message == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"解封指令格式错误，解封格式为:#解封 @要解封的人\"}", "application/json");
							return ;
						}
						//从类似[CQ:at,qq=3374574180]中获取unban_qq
						std::string unban_qq = "";
						size_t firstComma = unban_message.find(',');
						if (firstComma != std::string::npos) {
							size_t equalSign = unban_message.find('=', firstComma + 1);
							if (equalSign != std::string::npos) {
								size_t closingBracket = unban_message.find(']', equalSign + 1);
								if (closingBracket != std::string::npos) {
									unban_qq = unban_message.substr(equalSign + 1, closingBracket - equalSign - 1);
								}
							}
						}
						//判断unban_qq是否为空
						if (unban_qq == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"解封指令格式错误，解封格式为:#解封 @要解封的人\"}", "application/json");
							return ;
						}
						//读取player_data.json文件
						std::ifstream players_data_file("player_data.json");
						//文件读取失败
						if (!players_data_file) {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
							return ;
						}
						//文件打开成功，读取json文件内容，先检查json文件中是否存在unban_qq
						rapidjson::Document players_data;
						rapidjson::IStreamWrapper isw(players_data_file);
						players_data.ParseStream(isw);
						if (players_data.HasMember(unban_qq.c_str())) {
							//修改player_data.json文件中的ban_time
							players_data[unban_qq.c_str()]["ban_time"].SetString("0", players_data.GetAllocator());
							//将players_data对象写入player_data.json文件，缩进为4
							std::ofstream players_data_file("player_data.json");
							rapidjson::OStreamWrapper osw(players_data_file);
							rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
							writer.SetIndent(' ', 4); // 设置缩进为4个空格
							players_data.Accept(writer);
							players_data_file.close();
							//向群聊发送类似“解封成功”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"解封成功\"}", "application/json");
							return ;
						} else {
							//向群聊发送消息“解封失败，未找到该QQ号！”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"解封失败，未找到该QQ号！\"}", "application/json");
							return ;
						}
						return ;
					}

					//查询玩家信息
					if (command == "查") {
						//指令格式为：#查 @qq
						//获取查询字段
						std::string search_message = "";
						size_t firstSpace = message.find(' ');
						if (firstSpace != std::string::npos) {
							search_message = message.substr(firstSpace + 1);
						}
						//判断search_message是否为空
						if (search_message == "") {
							//为空直接查询自己
							//获取发送者的qq号
							std::string search_qq = std::to_string(qqEventData["user_id"].GetInt64());
							//读取player_data.json文件
							std::ifstream players_data_file("player_data.json");
							//文件读取失败
							if (!players_data_file) {
								cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
								return ;
							}
							//文件打开成功，读取json文件内容，先检查json文件中是否存在search_qq
							rapidjson::Document players_data;
							rapidjson::IStreamWrapper isw(players_data_file);
							players_data.ParseStream(isw);
							if (players_data.HasMember(search_qq.c_str())) {
								//获取查询到的玩家信息
								std::string xboxid = players_data[search_qq.c_str()]["xboxid"].GetString();
								std::string status = players_data[search_qq.c_str()]["status"].GetString();
								std::string ban_time = players_data[search_qq.c_str()]["ban_time"].GetString();
								std::string role = players_data[search_qq.c_str()]["role"].GetString();
								std::string money = players_data[search_qq.c_str()]["money"].GetString();
								//向群聊发送类似“查询成功，Xboxid为：xxx，状态为：xxx，封禁时间为：xxx，权限为：xxx，金币为：xxx”
								cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"查询成功，Xboxid为：" + xboxid + "，状态为：" + status + "，封禁时间为：" + ban_time + "，权限为：" + role + "，金币为：" + money + "\"}", "application/json");
								return ;
							} else {
								//向群聊发送消息“查询失败，未找到该QQ号！”
								cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"查询失败，未找到该QQ号！\"}", "application/json");
								return ;
							}
							return ;
						}
						//从类似[CQ:at,qq=3374574180]中获取search_qq
						std::string search_qq = "";
						size_t firstComma = search_message.find(',');
						if (firstComma != std::string::npos) {
							size_t equalSign = search_message.find('=', firstComma + 1);
							if (equalSign != std::string::npos) {
								size_t closingBracket = search_message.find(']', equalSign + 1);
								if (closingBracket != std::string::npos) {
									search_qq = search_message.substr(equalSign + 1, closingBracket - equalSign - 1);
								}
							}
						}
						//判断search_qq是否为空
						if (search_qq == "") {
							//向群聊发送消息“查询指令格式错误，查询格式为:#查 @要查询的人”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"查询指令格式错误，查询格式为:#查 @要查询的人\"}", "application/json");
							return ;
						}
						//读取player_data.json文件
						std::ifstream players_data_file("player_data.json");
						//文件读取失败
						if (!players_data_file) {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
							return ;
						}
						//文件打开成功，读取json文件内容，先检查json文件中是否存在search_qq
						rapidjson::Document players_data;
						rapidjson::IStreamWrapper isw(players_data_file);
						players_data.ParseStream(isw);
						if (players_data.HasMember(search_qq.c_str())) {
							//获取查询到的玩家信息
							std::string xboxid = players_data[search_qq.c_str()]["xboxid"].GetString();
							std::string status = players_data[search_qq.c_str()]["status"].GetString();
							std::string ban_time = players_data[search_qq.c_str()]["ban_time"].GetString();
							std::string role = players_data[search_qq.c_str()]["role"].GetString();
							std::string money = players_data[search_qq.c_str()]["money"].GetString();
							//向群聊发送类似“查询成功，Xboxid为：xxx，状态为：xxx，封禁时间为：xxx，权限为：xxx，金币为：xxx”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"查询成功，Xboxid为：" + xboxid + "，状态为：" + status + "，封禁时间为：" + ban_time + "，权限为：" + role + "，金币为：" + money + "\"}", "application/json");
							return ;
						} else {
							//向群聊发送消息“查询失败，未找到该QQ号！”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"查询失败，未找到该QQ号！\"}", "application/json");
							return ;
						}
					}

					//更改玩家权限
					if (command == "改权限") {
						//指令格式为：#改权限 @qq 权限
						//先判断指令执行者是否为管理员
						std::string user_permission = "";
						user_permission = qqEventData["sender"]["role"].GetString();
						if (user_permission != "admin" && user_permission != "owner") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"您没有权限执行此操作！\"}", "application/json");
							return ;
						}
						//获取改权限字段
						std::string change_permission_message = "";
						size_t firstSpace = message.find(' ');
						if (firstSpace != std::string::npos) {
							change_permission_message = message.substr(firstSpace + 1);
						}
						//判断change_permission_message是否为空
						if (change_permission_message == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改权限指令格式错误，改权限格式为:#改权限 @要改权限的人 权限\"}", "application/json");
							return ;
						}
						//从类似[CQ:at,qq=3374574180]中获取change_permission_qq
						std::string change_permission_qq = "";
						size_t firstComma = change_permission_message.find(',');
						if (firstComma != std::string::npos) {
							size_t equalSign = change_permission_message.find('=', firstComma + 1);
							if (equalSign != std::string::npos) {
								size_t closingBracket = change_permission_message.find(']', equalSign + 1);
								if (closingBracket != std::string::npos) {
									change_permission_qq = change_permission_message.substr(equalSign + 1, closingBracket - equalSign - 1);
								}
							}
						}
						//判断change_permission_qq是否为空
						if (change_permission_qq == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改权限指令格式错误，改权限格式为:#改权限 @要改权限的人 权限\"}", "application/json");
							return ;
						}
						//获取新的权限
						std::string new_permission = "";
						size_t secondSpace = message.find(' ', firstSpace + 1);
						if (secondSpace != std::string::npos) {
							new_permission = message.substr(secondSpace + 1);
						}
						//判断new_permission是否为空
						if (new_permission == "") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改权限指令格式错误，改权限格式为:#改权限 @要改权限的人 权限\"}", "application/json");
							return ;
						}
						//判断new_permission是否为admin、member
						if (new_permission != "admin" && new_permission != "member") {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改权限失败，权限只能为admin或member！\"}", "application/json");
							return ;
						}
						//读取player_data.json文件
						std::ifstream players_data_file("player_data.json");
						//文件读取失败
						if (!players_data_file) {
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
							return ;
						}
						//文件打开成功，读取json文件内容，先检查json文件中是否存在change_permission_qq
						rapidjson::Document players_data;
						rapidjson::IStreamWrapper isw(players_data_file);
						players_data.ParseStream(isw);
						if (players_data.HasMember(change_permission_qq.c_str())) {
							//修改player_data.json文件中的role
							players_data[change_permission_qq.c_str()]["role"].SetString(new_permission.c_str(), players_data.GetAllocator());
							//将players_data对象写入player_data.json文件，缩进为4
							std::ofstream players_data_file("player_data.json");
							rapidjson::OStreamWrapper osw(players_data_file);
							rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
							writer.SetIndent(' ', 4); // 设置缩进为4个空格
							players_data.Accept(writer);
							players_data_file.close();
							//向群聊发送类似“改权限成功,改权限为：xxx”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改权限成功,新权限为：" + new_permission + "\"}", "application/json");
							return ;
						} else {
							//向群聊发送消息“改权限失败，未找到该QQ号！”
							cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"改权限失败，未找到该QQ号！\"}", "application/json");
							return ;
						}
						return ;
					}

					//未知指令，发送相关提示
					cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"未知指令，请发送#帮助 获取指令帮助！\"}", "application/json");
					return ;
				}

				//消息不为"#"开头，则进行

				return ;
			}
		}
		//处理通知事件
		if (post_type == "notice") {
			//看看group_id，是否为指定的群聊
			std::string group_id = std::to_string(qqEventData["group_id"].GetInt64());
			if (group_id != QQGroup) {
				return ;
			}

			//解析"notice_type"字段
			std::string notice_type = qqEventData["notice_type"].GetString();

			//处理群成员减少事件
			if (notice_type == "group_decrease") {
				//获取操作者qq号
				std::string operator_qq = std::to_string(qqEventData["operator_id"].GetInt64());
				//获取被操作者qq号
				std::string user_qq = std::to_string(qqEventData["user_id"].GetInt64());
				//获取减少类型
				std::string sub_type = qqEventData["sub_type"].GetString();
				//获取减少类型为"kick_me"，即自己被踢出群聊
				if (sub_type == "kick_me") {
					//向群聊发送消息“qq:[123456] 已被移出群聊”
					cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"[" + user_qq + "] 已被移出群聊\"}", "application/json");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
						return ;
					}
					//文件打开成功，读取json文件内容，先检查json文件中是否存在user_qq
					rapidjson::Document players_data;
					rapidjson::IStreamWrapper isw(players_data_file);
					players_data.ParseStream(isw);
					if (players_data.HasMember(user_qq.c_str())) {
						//修改player_data.json文件中的status
						players_data[user_qq.c_str()]["status"].SetString("ban", players_data.GetAllocator());
						//将players_data对象写入player_data.json文件，缩进为4
						std::ofstream players_data_file("player_data.json");
						rapidjson::OStreamWrapper osw(players_data_file);
						rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
						writer.SetIndent(' ', 4); // 设置缩进为4个空格
						players_data.Accept(writer);
						players_data_file.close();
						//向群聊发送类似“玩家账号已经被自动冻结”
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"由于玩家退出群聊，账号已经被自动冻结\"}", "application/json");
						return ;
					}
					return ;
				}
				//获取减少类型为"kick"，即被管理员踢出群聊
				if (sub_type == "kick") {
					//向群聊发送消息“qq:[123456] 已被管理员移出群聊”
					cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"[" + user_qq + "] 被管理员扔出了群聊!\"}", "application/json");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
						return ;
					}
					//文件打开成功，读取json文件内容，先检查json文件中是否存在user_qq
					rapidjson::Document players_data;
					rapidjson::IStreamWrapper isw(players_data_file);
					players_data.ParseStream(isw);
					if (players_data.HasMember(user_qq.c_str())) {
						//修改player_data.json文件中的status
						players_data[user_qq.c_str()]["status"].SetString("ban", players_data.GetAllocator());
						//将players_data对象写入player_data.json文件，缩进为4
						std::ofstream players_data_file("player_data.json");
						rapidjson::OStreamWrapper osw(players_data_file);
						rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
						writer.SetIndent(' ', 4); // 设置缩进为4个空格
						players_data.Accept(writer);
						players_data_file.close();
						//向群聊发送类似“玩家账号已经被自动冻结”
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"由于玩家退出群聊，账号已经被自动冻结！\"}", "application/json");
						return ;
					}
					return ;
				}
				//获取减少类型为"leave"，即有成员离开群聊
				if (sub_type == "leave") {
					//向群聊发送消息“qq:[123456] 已退出群聊”
					cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"[" + user_qq + "] 离开了我们...\"}", "application/json");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
						return ;
					}
					//文件打开成功，读取json文件内容，先检查json文件中是否存在user_qq
					rapidjson::Document players_data;
					rapidjson::IStreamWrapper isw(players_data_file);
					players_data.ParseStream(isw);
					if (players_data.HasMember(user_qq.c_str())) {
						//修改player_data.json文件中的status
						players_data[user_qq.c_str()]["status"].SetString("ban", players_data.GetAllocator());
						//将players_data对象写入player_data.json文件，缩进为4
						std::ofstream players_data_file("player_data.json");
						rapidjson::OStreamWrapper osw(players_data_file);
						rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
						writer.SetIndent(' ', 4); // 设置缩进为4个空格
						players_data.Accept(writer);
						players_data_file.close();
						//向群聊发送类似“玩家账号已经被自动冻结”
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"由于玩家退出群聊，账号已被自动冻结！\"}", "application/json");
						return ;
					}
					return ;
				}
				return ;
			}

			//处理群成员增加事件
			if (notice_type == "group_increase") {
				//获取操作者qq号
				std::string operator_qq = std::to_string(qqEventData["operator_id"].GetInt64());
				//获取被操作者qq号
				std::string user_qq = std::to_string(qqEventData["user_id"].GetInt64());
				//获取增加类型
				std::string sub_type = qqEventData["sub_type"].GetString();
				//获取增加类型为"invite"，即被邀请进入群聊
				if (sub_type == "invite") {
					//向群聊发送消息"欢迎@qq 加入本群，发送#帮助获取指令帮助，来绑定自己的Xbox账号！"
					cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"欢迎 [CQ:at,qq=" + user_qq + "] 加入本群，发送 #帮助 获取指令帮助，来绑定自己的Xbox账号！\"}", "application/json");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
						return ;
					}
					//文件打开成功，读取json文件内容，先检查json文件中是否存在user_qq
					rapidjson::Document players_data;
					rapidjson::IStreamWrapper isw(players_data_file);
					players_data.ParseStream(isw);
					if (players_data.HasMember(user_qq.c_str())) {
						//修改player_data.json文件中的status
						players_data[user_qq.c_str()]["status"].SetString("normal", players_data.GetAllocator());
						//将players_data对象写入player_data.json文件，缩进为4
						std::ofstream players_data_file("player_data.json");
						rapidjson::OStreamWrapper osw(players_data_file);
						rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
						writer.SetIndent(' ', 4); // 设置缩进为4个空格
						players_data.Accept(writer);
						players_data_file.close();
						//向群聊发送类似“玩家账号已经被自动解封”
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"该玩家存在相关数据，账号状态已经自动恢复！\"}", "application/json");
						return ;
					}
					return ;
				}
				//获取增加类型为"approve"，即被管理员同意进入群聊
				if (sub_type == "approve") {
					//向群聊发送消息“qq:[123456] 已被管理员同意进入群聊”
					cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"欢迎 [CQ:at,qq=" + user_qq + "] 加入本群，发送 #帮助 获取指令帮助，来绑定自己的Xbox账号！\"}", "application/json");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"player_data.json文件读取失败！\"}", "application/json");
						return ;
					}
					//文件打开成功，读取json文件内容，先检查json文件中是否存在user_qq
					rapidjson::Document players_data;
					rapidjson::IStreamWrapper isw(players_data_file);
					players_data.ParseStream(isw);
					if (players_data.HasMember(user_qq.c_str())) {
						//修改player_data.json文件中的status
						players_data[user_qq.c_str()]["status"].SetString("normal", players_data.GetAllocator());
						//将players_data对象写入player_data.json文件，缩进为4
						std::ofstream players_data_file("player_data.json");
						rapidjson::OStreamWrapper osw(players_data_file);
						rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
						writer.SetIndent(' ', 4); // 设置缩进为4个空格
						players_data.Accept(writer);
						players_data_file.close();
						//向群聊发送类似“玩家账号已经被自动解封”
						cli.Post("/send_group_msg", "{\"group_id\":" + group_id + ",\"message\":\"该玩家存在相关数据，账号状态已经自动恢复！\"}", "application/json");
						return ;
					}
					return ;
				}

			}
			return ;
		}
		//处理请求事件
		if (post_type == "request") {
			return ;
		}
		//处理元事件
		if (post_type == "meta_event") {
			return ;
		}
		res.status = 200;
		res.set_content("success", "text/plain");
	});

}
