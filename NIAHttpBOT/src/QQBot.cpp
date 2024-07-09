#include "QQBot.h"
//使用https://github.com/botuniverse/onebot-11/

//读取配置文件
CFGPAR::parser par;

//获取配置文件中的Locate,OwnerQQ,QQGroup,IPAddress,ClientPort
std::string Locate;
bool UseQQBot;
std::string OwnerQQ;
std::string QQGroup;
std::string IPAddress;
int ClientPort;

//声明qqbot
QQBot* qqbot;

std::vector<std::string> forbiddenWords;

struct command_addition_info {
    std::string group_id;
    std::string sender_qq;
	std::string sender_role;
	std::string target_qq;
};

// 拆分指令和参数
std::vector<std::string> splitCommand(const std::string& command) {
    std::vector<std::string> tokens;
    std::istringstream stream(command);
    std::string token;
    while (stream >> token) {
        tokens.push_back(token);
    }
    return tokens;
}


using CommandHandler = std::function<void(const command_addition_info&, const std::vector<std::string>&)>;


//展示帮助菜单
void showHelpMenu(const command_addition_info& info, const std::vector<std::string>& args) {
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
    helpMenu += "#改权限 @要改权限的人 <权限>: 改变指定群成员的权限";
    qqbot->send_group_message(info.group_id, helpMenu);
}

//赞我
void sendLike(const command_addition_info& info, const std::vector<std::string>& args) {
	//发送好友赞
	auto send_like_res = qqbot->send_like(info.sender_qq, 10);
	//判断是否发送成功
	if (send_like_res == 1) {
		qqbot->send_group_message(info.group_id, "已经给你点了十个赞哦！注意查收！");
	} else if (send_like_res == 0) {
		qqbot->send_group_message(info.group_id, "点赞失败！原因是今天已经给你点过赞了！");
	} else {
		qqbot->send_group_message(info.group_id, "点赞失败！请稍后再试！");
	}
}

//禁言
void muteUser(const command_addition_info& info, const std::vector<std::string>& args) {
    if (args.size() < 1) {
		qqbot->send_group_message(info.group_id, "禁言指令格式错误，禁言格式为:#禁言 @要禁言的人 时间");
        return;
    }
    std::string duration = args[0];


	//判断指令执行者是否为管理员
	if (info.sender_role != "admin" && info.sender_role  != "owner" && info.sender_qq != OwnerQQ) {
		qqbot->send_group_message(info.group_id, "您没有权限执行此操作！");
		return ;
	}
	//获取禁言qq号
	if (info.target_qq == "") {
		qqbot->send_group_message(info.group_id, "禁言指令格式错误，禁言格式为:#禁言 @要禁言的人 时间");
		return ;
	}
	//获取禁言时间
	std::string band_time_str = duration;
	//检查band_time是否有空格，有的话就去除
	if (band_time_str.find(' ') != std::string::npos) {
		band_time_str = band_time_str.substr(0, band_time_str.find(' '));
	}
	//解析band_time，将时间转换为秒,用长整型
	int64_t band_time = 0;
	//解析band_time，min后缀为分钟，h后缀为小时，d后缀为天
	if (band_time_str.find("min") != std::string::npos) {
		band_time = std::stoll(band_time_str.substr(0, band_time_str.size() - 3)) * 60;
	} else if (band_time_str.find("h") != std::string::npos) {
		band_time = std::stoll(band_time_str.substr(0, band_time_str.size() - 1)) * 60 * 60;
	} else if (band_time_str.find("d") != std::string::npos) {
		band_time = std::stoll(band_time_str.substr(0, band_time_str.size() - 1)) * 60 * 60 * 24;
	} else {
		qqbot->send_group_message(info.group_id, "禁言时间格式错误，时间格式要以min/h/d结尾");
		return ;
	}
	//判断禁言时间是否超过30天
	if (band_time > 60 * 60 * 24 * 30) {
		qqbot->send_group_message(info.group_id, "禁言时间不能超过30天！");
		return ;
	}
	//判断禁言时间是否小于1分钟
	if (band_time < 60) {
		qqbot->send_group_message(info.group_id, "禁言时间不能小于1分钟！");
		return ;
	}
	//禁言
	auto set_group_ban_res = qqbot->set_group_ban(info.group_id, info.target_qq, band_time);
	//判断是否禁言成功
	if (set_group_ban_res == 1) {
		qqbot->send_group_message(info.group_id, "已成功禁言 [CQ:at,qq=" + info.target_qq + "]，禁言时间为" + band_time_str);
	} else if (set_group_ban_res == 0) {
		qqbot->send_group_message(info.group_id, "禁言失败！原因可能是机器人权限不足，请检查机器人权限！");
	} else {
		qqbot->send_group_message(info.group_id, "禁言失败！请稍后再试！");
	}

}

//解禁
void unmuteUser(const command_addition_info& info, const std::vector<std::string>& args) {
	//判断指令执行者是否为管理员
	if (info.sender_role != "admin" && info.sender_role  != "owner" && info.sender_qq != OwnerQQ) {
		qqbot->send_group_message(info.group_id, "您没有权限执行此操作！");
		return ;
	}
	//判断target_qq是否为空
	if (info.target_qq == "") {
		qqbot->send_group_message(info.group_id, "解禁指令格式错误，解禁格式为:#解禁 @要解禁的人");
		return ;
	}
	//解禁
	auto set_group_ban_res = qqbot->set_group_ban(info.group_id, info.target_qq, 0);
	//判断是否解禁成功
	if (set_group_ban_res == 1) {
		qqbot->send_group_message(info.group_id, "已成功解禁 [CQ:at,qq=" + info.target_qq + "]");
	} else if (set_group_ban_res == 0) {
		qqbot->send_group_message(info.group_id, "解禁失败！原因可能是机器人权限不足，请检查机器人权限！");
	} else {
		qqbot->send_group_message(info.group_id, "解禁失败！请稍后再试！");
	}
}

//绑定
void bindXboxID(const command_addition_info& info, const std::vector<std::string>& args) {
	//判断参数是否为空
	if (args.size() < 1) {
		qqbot->send_group_message(info.group_id, "绑定指令格式错误，绑定格式为:#绑定 <XboxID>");
		return ;
	}
	//获取XboxID
	std::string XboxID = args[0];

	//读取player_data.json文件
	std::ifstream players_data_file("player_data.json");
	//文件读取失败
	if (!players_data_file) {
		qqbot->send_group_message(info.group_id, "player_data.json文件读取失败！");
		return ;
	}
	//文件打开成功，读取json文件内容，并创建一个json对象
	rapidjson::Document players_data;
	rapidjson::IStreamWrapper isw(players_data_file);
	players_data.ParseStream(isw);
	//检查json文件中是否存在sender_qq
	if (players_data.HasMember(info.sender_qq.c_str())) {
		//向群聊发送消息“您已绑定Xboxid XXX，如需改绑请联系在线管理员！”
		qqbot->send_group_message(info.group_id, "您已绑定Xboxid " + std::string(players_data[info.sender_qq.c_str()]["xboxid"].GetString()) + "，如需改绑请联系在线管理员！");
		return ;
	} else {
		//新建一个json对象
		rapidjson::Document player_data;
		player_data.SetObject();

		// 添加 "xboxid" 键值对到 player_data 对象中
		rapidjson::Value xbox(rapidjson::kStringType);
		xbox.SetString(XboxID.c_str(), player_data.GetAllocator());
		player_data.AddMember("xboxid", xbox, player_data.GetAllocator());

		// 添加 "qq" 键值对到 player_data 对象中
		rapidjson::Value qq(rapidjson::kStringType);
		qq.SetString(info.sender_qq.c_str(), player_data.GetAllocator());
		player_data.AddMember("qq", qq, player_data.GetAllocator());

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
		rapidjson::Value key(info.sender_qq.c_str(), players_data.GetAllocator());
		players_data.AddMember(key, player_data, players_data.GetAllocator());

		//将players_data对象写入player_data.json文件，缩进为4
		std::ofstream players_data_file("player_data.json");
		rapidjson::OStreamWrapper osw(players_data_file);
		rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
		writer.SetIndent(' ', 4); // 设置缩进为4个空格
		players_data.Accept(writer);
		players_data_file.close();
		//向群聊发送类似“绑定Xboxid成功,绑定的Xboxid为：xxx，如需改绑请联系在线管理员！”
		qqbot->send_group_message(info.group_id, "绑定Xboxid成功,绑定的Xboxid为：" + XboxID + "，如需改绑请联系在线管理员！");
		return ;
	}
}

//改绑
void changeBindXboxID(const command_addition_info& info, const std::vector<std::string>& args) {
	//判断执行者是否为管理员
	if (info.sender_role != "admin" && info.sender_role  != "owner" && info.sender_qq != OwnerQQ) {
		qqbot->send_group_message(info.group_id, "您没有权限执行此操作！");
		return ;
	}
	//判断target_qq是否为空
	if (info.target_qq == "") {
		qqbot->send_group_message(info.group_id, "改绑指令格式错误，改绑格式为:#改绑 @要改绑的人 XboxID");
		return ;
	}
	//判断参数是否为空
	if (args.size() < 1) {
		qqbot->send_group_message(info.group_id, "改绑指令格式错误，改绑格式为:#改绑 @要改绑的人 XboxID");
		return ;
	}
	//获取XboxID
	std::string new_xboxid = args[0];

	//读取player_data.json文件
	std::ifstream players_data_file("player_data.json");
	//文件读取失败
	if (!players_data_file) {
		qqbot->send_group_message(info.group_id, "player_data.json文件读取失败！");
		return ;
	}
	//文件打开成功
	rapidjson::Document players_data;
	rapidjson::IStreamWrapper isw(players_data_file);
	players_data.ParseStream(isw);
	if (players_data.HasMember(info.target_qq.c_str())) {
		//修改player_data.json文件中的XboxID
		players_data[info.target_qq.c_str()]["xboxid"].SetString(new_xboxid.c_str(), players_data.GetAllocator());
		//将players_data对象写入player_data.json文件，缩进为4
		std::ofstream players_data_file("player_data.json");
		rapidjson::OStreamWrapper osw(players_data_file);
		rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
		writer.SetIndent(' ', 4); // 设置缩进为4个空格
		players_data.Accept(writer);
		players_data_file.close();
		//向群聊发送类似“改绑Xboxid成功,改绑的Xboxid为：xxx”
		qqbot->send_group_message(info.group_id, "改绑Xboxid成功,改绑的Xboxid为：" + new_xboxid);
		return ;
	} else {
		//向群聊发送消息“改绑失败，未找到该QQ号！”
		qqbot->send_group_message(info.group_id, "改绑失败，未在玩家数据库中找到该QQ号！");
		return ;
	}
}

//封禁
void banPlayer(const command_addition_info& info, const std::vector<std::string>& args) {
	//判断执行者是否为管理员
	if (info.sender_role != "admin" && info.sender_role  != "owner" && info.sender_qq != OwnerQQ) {
		qqbot->send_group_message(info.group_id, "您没有权限执行此操作！");
		return ;
	}
	//判断target_qq是否为空
	if (info.target_qq == "") {
		qqbot->send_group_message(info.group_id, "封禁指令格式错误，封禁格式为:#封禁 @要封禁的人 时间");
		return ;
	}
	//判断参数是否为空
	if (args.size() < 1) {
		qqbot->send_group_message(info.group_id, "封禁指令格式错误，封禁格式为:#封禁 @要封禁的人 时间");
		return ;
	}
	//获取封禁时间
	std::string band_time_str = args[0];
	//解析band_time，将时间转换为秒,用长整型
	int64_t band_time = 0;
	//解析band_time，min后缀为分钟，h后缀为小时，d后缀为天
	if (band_time_str.find("min") != std::string::npos) {
		band_time = std::stoll(band_time_str.substr(0, band_time_str.size() - 3)) * 60;
	} else if (band_time_str.find("h") != std::string::npos) {
		band_time = std::stoll(band_time_str.substr(0, band_time_str.size() - 1)) * 60 * 60;
	} else if (band_time_str.find("d") != std::string::npos) {
		band_time = std::stoll(band_time_str.substr(0, band_time_str.size() - 1)) * 60 * 60 * 24;
	} else {
		qqbot->send_group_message(info.group_id, "封禁时间格式错误，时间格式要以min/h/d结尾");
		return ;
	}
	//读取player_data.json文件
	std::ifstream players_data_file("player_data.json");
	//文件读取失败
	if (!players_data_file) {
		qqbot->send_group_message(info.group_id, "player_data.json文件读取失败！");
		return ;
	}
	//文件打开成功
	rapidjson::Document players_data;
	rapidjson::IStreamWrapper isw(players_data_file);
	players_data.ParseStream(isw);
	if (players_data.HasMember(info.target_qq.c_str())) {
		//获取当前时间，并把封禁时间加上获得封禁解除的时间
		int64_t now_time = std::chrono::duration_cast<std::chrono::seconds>(std::chrono::system_clock::now().time_since_epoch()).count();
		band_time += now_time;
		//将封禁时间转换为形如“2021-01-01 00:00:00”的字符串
		std::time_t band_time_t = band_time;
		std::tm* band_time_tm = std::localtime(&band_time_t);
		char band_time_str[20];
		std::strftime(band_time_str, 20, "%Y-%m-%d %H:%M:%S", band_time_tm);
		//修改player_data.json文件中的ban_time
		players_data[info.target_qq.c_str()]["ban_time"].SetString(band_time_str, players_data.GetAllocator());
		//将players_data对象写入player_data.json文件，缩进为4
		std::ofstream players_data_file("player_data.json");
		rapidjson::OStreamWrapper osw(players_data_file);
		rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
		writer.SetIndent(' ', 4); // 设置缩进为4个空格
		players_data.Accept(writer);
		players_data_file.close();
		//向群聊发送类似“封禁成功,封禁的QQ号为：xxx，封禁时间为：xxx”
		qqbot->send_group_message(info.group_id, "封禁成功,封禁的QQ号为：" + info.target_qq + "，本次封禁解除时间为：" + band_time_str);
		return ;
	} else {
		//向群聊发送消息“封禁失败，未找到该QQ号！”
		qqbot->send_group_message(info.group_id, "封禁失败，未在玩家数据库中找到该QQ号！");
		return ;
	}
}

//解封
void unbanPlayer(const command_addition_info& info, const std::vector<std::string>& args) {
	//判断执行者是否为管理员
	if (info.sender_role != "admin" && info.sender_role  != "owner" && info.sender_qq != OwnerQQ) {
		qqbot->send_group_message(info.group_id, "您没有权限执行此操作！");
		return ;
	}
	//判断target_qq是否为空
	if (info.target_qq == "") {
		qqbot->send_group_message(info.group_id, "解封指令格式错误，解封格式为:#解封 @要解封的人");
		return ;
	}
	//读取player_data.json文件
	std::ifstream players_data_file("player_data.json");
	//文件读取失败
	if (!players_data_file) {
		qqbot->send_group_message(info.group_id, "player_data.json文件读取失败！");
		return ;
	}
	//文件打开成功
	rapidjson::Document players_data;
	rapidjson::IStreamWrapper isw(players_data_file);
	players_data.ParseStream(isw);
	if (players_data.HasMember(info.target_qq.c_str())) {
		//修改player_data.json文件中的ban_time
		players_data[info.target_qq.c_str()]["ban_time"].SetString("0", players_data.GetAllocator());
		//将players_data对象写入player_data.json文件，缩进为4
		std::ofstream players_data_file("player_data.json");
		rapidjson::OStreamWrapper osw(players_data_file);
		rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
		writer.SetIndent(' ', 4); // 设置缩进为4个空格
		players_data.Accept(writer);
		players_data_file.close();
		//向群聊发送类似“解封成功,解封的QQ号为：xxx”
		qqbot->send_group_message(info.group_id, "解封成功,解封的QQ号为：" + info.target_qq);
		return ;
	} else {
		//向群聊发送消息“解封失败，未找到该QQ号！”
		qqbot->send_group_message(info.group_id, "解封失败，未在玩家数据库中找到该QQ号！");
		return ;
	}
}

//查询玩家个人信息
void queryPlayerInfo(const command_addition_info& info, const std::vector<std::string>& args) {
	//查询自己账号的相关信息
	if (info.target_qq == "") {
		//读取player_data.json文件
		std::ifstream players_data_file("player_data.json");
		//文件读取失败
		if (!players_data_file) {
			qqbot->send_group_message(info.group_id, "player_data.json文件读取失败！");
			return ;
		}
		//文件打开成功
		rapidjson::Document players_data;
		rapidjson::IStreamWrapper isw(players_data_file);
		players_data.ParseStream(isw);
		if (players_data.HasMember(info.sender_qq.c_str())) {
			//获取XboxID
			std::string xboxid = players_data[info.sender_qq.c_str()]["xboxid"].GetString();
			//获取账号状态
			std::string status = players_data[info.sender_qq.c_str()]["status"].GetString();
			//获取封禁时间
			std::string ban_time = players_data[info.sender_qq.c_str()]["ban_time"].GetString();
			//获取权限
			std::string role = players_data[info.sender_qq.c_str()]["role"].GetString();
			//获取金币数量
			std::string money = players_data[info.sender_qq.c_str()]["money"].GetString();
			qqbot->send_group_message(info.group_id, "玩家信息查询成功！\\nXboxid为：" + xboxid + "\\n账号状态为：" + status + "\\n账号封禁解除时间为：" + ban_time + "\\n账号权限为：" + role + "\\n下线后金币收益为：" + money);
			return ;
		} else {
			qqbot->send_group_message(info.group_id, "未在玩家数据库中找到您的QQ号！");
			return ;
		}
	} else {
		//查询别人账号的相关信息
		//读取player_data.json文件
		std::ifstream players_data_file("player_data.json");
		//文件读取失败
		if (!players_data_file) {
			qqbot->send_group_message(info.group_id, "player_data.json文件读取失败！");
			return ;
		}
		//文件打开成功
		rapidjson::Document players_data;
		rapidjson::IStreamWrapper isw(players_data_file);
		players_data.ParseStream(isw);
		if (players_data.HasMember(info.target_qq.c_str())) {
			//获取XboxID
			std::string xboxid = players_data[info.target_qq.c_str()]["xboxid"].GetString();
			//获取账号状态
			std::string status = players_data[info.target_qq.c_str()]["status"].GetString();
			//获取封禁时间
			std::string ban_time = players_data[info.target_qq.c_str()]["ban_time"].GetString();
			//获取权限
			std::string role = players_data[info.target_qq.c_str()]["role"].GetString();
			//获取金币数量
			std::string money = players_data[info.target_qq.c_str()]["money"].GetString();
			qqbot->send_group_message(info.group_id, "玩家信息查询成功！\\nXboxid为：" + xboxid + "\\n账号状态为：" + status + "\\n账号封禁解除时间为：" + ban_time + "\\n账号权限为：" + role + "\\n下线后金币收益为：" + money);
			return ;
		} else {
			qqbot->send_group_message(info.group_id, "未在玩家数据库中找到 [CQ:at,qq=" + info.target_qq + "] 的信息！");
			return ;
		}
	}
}

//改变权限
void changeRole(const command_addition_info& info, const std::vector<std::string>& args) {
	//判断执行者是否为管理员
	if (info.sender_role != "admin" && info.sender_role  != "owner" && info.sender_qq != OwnerQQ) {
		qqbot->send_group_message(info.group_id, "您没有权限执行此操作！");
		return ;
	}
	//判断target_qq是否为空
	if (info.target_qq == "") {
		qqbot->send_group_message(info.group_id, "变更权限指令格式错误，改权限格式为:#改权限 @要改权限的人 权限");
		return ;
	}
	//判断参数是否为空
	if (args.size() < 1) {
		qqbot->send_group_message(info.group_id, "变更权限指令格式错误，改权限格式为:#改权限 @要改权限的人 权限");
		return ;
	}
	//获取权限
	std::string new_role = args[0];
	//判断权限是否为owner、admin、member
	if (new_role != "owner" && new_role != "admin" && new_role != "member") {
		qqbot->send_group_message(info.group_id, "权限格式错误，权限只能为owner、admin、member！");
		return ;
	}
	//读取player_data.json文件
	std::ifstream players_data_file("player_data.json");
	//文件读取失败
	if (!players_data_file) {
		qqbot->send_group_message(info.group_id, "player_data.json文件读取失败！");
		return ;
	}
	//文件打开成功
	rapidjson::Document players_data;
	rapidjson::IStreamWrapper isw(players_data_file);
	players_data.ParseStream(isw);
	if (players_data.HasMember(info.target_qq.c_str())) {
		//修改player_data.json文件中的role
		players_data[info.target_qq.c_str()]["role"].SetString(new_role.c_str(), players_data.GetAllocator());
		//将players_data对象写入player_data.json文件，缩进为4
		std::ofstream players_data_file("player_data.json");
		rapidjson::OStreamWrapper osw(players_data_file);
		rapidjson::PrettyWriter<rapidjson::OStreamWrapper> writer(osw);
		writer.SetIndent(' ', 4); // 设置缩进为4个空格
		players_data.Accept(writer);
		players_data_file.close();
		//向群聊发送类似“改权限成功,改权限的QQ号为：xxx，新权限为：xxx”
		qqbot->send_group_message(info.group_id, "变更权限成功,变更权限的QQ号为：" + info.target_qq + "，新权限为：" + new_role);
		return ;
	} else {
		//向群聊发送消息“改权限失败，未找到该QQ号！”
		qqbot->send_group_message(info.group_id, "变更权限失败，未在玩家数据库中找到该QQ号！");
		return ;
	}
}

// 定义指令映射
std::unordered_map<std::string, CommandHandler> commandMap = {
    {"帮助", showHelpMenu},
    {"菜单", showHelpMenu},
	{"赞我", sendLike},
    {"禁言", muteUser},
	{"禁", muteUser},
	{"解禁", unmuteUser},
	{"绑定", bindXboxID},
	{"改绑", changeBindXboxID},
	{"封禁", banPlayer},
	{"解封", unbanPlayer},
	{"查询", queryPlayerInfo},
	{"查", queryPlayerInfo},
	{"改权限", changeRole}
};

//读取违禁词列表
void loadForbiddenWords(const std::string& filename) {
    std::ifstream file(filename);
	//如果文件没有就创建一个，并写入默认的违禁词
	if (!file) {
		std::ofstream file(filename);
		file << "#违禁词每个词占一行，结尾可以用“，”或“；”结尾，或者直接换行\n";
		file << "#违禁词前加“#”前缀则不会解析本行的违禁词\n";
		file << "test\n";
		file.close();
		//向控制台输出警告
		WARN("违禁词文件不存在，已自动创建！请编辑违禁词文件！文件名称为：" + filename);
	}
	//文件打开成功，读取文件内容
    std::string word;
	//定义违禁词数量
	int count = 0;
    while (std::getline(file, word)) {
		//如果违禁词结尾为；，等符号，去掉尾部符号再加入到违禁词列表中
		if (word[word.size() - 1] == ';' || word[word.size() - 1] == ',' || word[word.size() - 1] == '；' || word[word.size() - 1] == '，') {
			word = word.substr(0, word.size() - 1);
		}
		//如果违禁词开头为#，跳过这一行
		if (word[0] == '#') {
			continue;
		}
		//如果违禁词为空，跳过这一行
		if (word == "") {
			continue;
		}
        forbiddenWords.push_back(word);
		count++;
    }
	//向控制台输出
	INFO("已成功加载" + std::to_string(count) + "个违禁词！");
}

//判断消息是否包含违禁词
bool containsForbiddenWords(const std::string& input) {
    for (const auto& word : forbiddenWords) {
        if (input.find(word) != std::string::npos) {
            return true;
        }
    }
    return false;
}

void main_qqbot(httplib::Server &svr) {
	//初始化变量
	par.parFromFile("./NIAHttpBOT.cfg");
	//获取配置文件中的UseQQBot
	UseQQBot = par.getBool("UseQQBot");
	if (!UseQQBot) {
		WARN("未启用QQ机器人相关功能！");
		return;
	};
	INFO("已启用QQ机器人相关功能！");
	//检测QQ机器人配置文件QQBOT.cfg是否存在,不存在则创建并写入默认配置
	// if (!par.parFromFile("./QQBOT.cfg")) {
	// 	std::ofstream outcfgFile("QQBOT.cfg");
	// 	outcfgFile << "ForbiddenMessage = 请注意发言规范！详情见 https://docs.mcnia.com/play-guide/regulation.html\n";
	// 	outcfgFile.close();
	// 	WARN("未找到QQ机器人配置文件，已自动初始化配置文件 QQBOT.cfg");
	// } else {

	// 	INFO("已成功读取QQ机器人配置文件！");
	// }
	//获取配置文件中的Locate,OwnerQQ,QQGroup,IPAddress,ClientPort
    Locate = par.getString("Locate");
    OwnerQQ = par.getString("OwnerQQ");
    QQGroup = par.getString("QQGroup");
    IPAddress = par.getString("IPAddress");
    ClientPort = par.getInt("ClientPort");

    //初始化qqbot
    qqbot = new QQBot(IPAddress, ClientPort);
	//尝试与QQ机器人建立连接
	auto get_status_res = qqbot->get_status();
	//检查是否成功连接到QQ机器人
	if (get_status_res.status == 1) {
		INFO("已成功连接到QQ机器人！");
		//加载违禁词列表
		loadForbiddenWords("ForbiddenWords.txt");
	} else {
		WARN("QQ机器人连接失败！请检查QQ机器人是否已启动&&配置是否正确！");
		WARN("如需更多帮助请前往 https://docs.mcnia.com/dev/Http-Bot.html 查看！");
		return;
	}


	//检查player_data.json文件是否存在,不存在则创建
	std::ifstream player_data_file("player_data.json");
	if (!player_data_file) {
		std::ofstream player_data_file("player_data.json");
		player_data_file << "{}";
		player_data_file.close();
		//向控制台输出
		WARN("player_data.json文件不存在，已自动创建！");
	}

	//获取群列表
	auto get_group_list_res = qqbot->get_group_list();
	//检测群列表群号是否有指定的QQ群
	bool isGroupExist = false;
	for (int i = 0; i < get_group_list_res.size(); i++) {
		if (get_group_list_res[i].group_id == std::stoi(QQGroup)) {
			isGroupExist = true;
			break;
		}
	}
	//如果指定的QQ群不存在
	if (!isGroupExist) {
		//向控制台输出
		WARN(X("没有在机器人的群列表中找到指定的QQ群：") + QQGroup);
	} else {
		//向控制台输出
		INFO(X("机器人监听已在指定QQ群开启：") + QQGroup);
		//开始检测机器人在指定的QQ群中的权限
		//获取机器人自己的QQ号
		auto get_login_info_res = qqbot->get_login_info();
		std::string selfQQ = std::to_string(get_login_info_res.user_id);
		//获取机器人在指定QQ群中的权限
		auto get_group_member_info_res = qqbot->get_group_member_info(QQGroup, selfQQ);
		std::string selfPermission = get_group_member_info_res.role;
		//向控制台输出
		INFO(X("机器人在指定QQ群中的权限为：") << selfPermission);
		//如果机器人在指定QQ群中的权限不是管理员或者群主
		if (selfPermission != "admin" && selfPermission != "owner") {
			//向控制台输出
			WARN(X("机器人在指定QQ群中的权限不足,部分功能可能受限，如果要使用完整功能，请将机器人设置为管理员或者群主！"));
			//向指定QQ群发送消息
			qqbot->send_group_message(QQGroup, "机器人在指定QQ群中的权限不足,部分功能可能受限，如果要使用完整功能，请将机器人设置为管理员或者群主！");
		}
	}

	//接收QQ消息事件
	svr.Post(Locate, [](const httplib::Request& req, httplib::Response& res) {

		INFO(X("qq客户端接收的事件数据为:") << req.body);
		//解析字符串并创建一个json对象
		rapidjson::Document qq_event_data;
		qq_event_data.Parse(req.body.c_str());
		//解析post_type字段,用来判断事件类型
		std::string post_type = qq_event_data["post_type"].GetString();

		//判断事件类型
		//处理群消息事件
		//解析message_type字段,用来判断消息事件类型
		std::string message_type = "";
		if (post_type == "message") {
			message_type = qq_event_data["message_type"].GetString();
		}

		//处理群消息事件
		if (post_type == "message" && message_type == "group") {

			//解析group_id字段
			std::string group_id = std::to_string(qq_event_data["group_id"].GetInt());

			//判断group_id是否为指定的QQ群
			if (group_id != QQGroup) {
				return ;
			}

			//解析发送者的qq号
			std::string sender_qq = std::to_string(qq_event_data["user_id"].GetInt64());

			//解析发送者的权限
			std::string sender_role = qq_event_data["sender"]["role"].GetString();

			bool is_command = false;
			bool is_reply = false;
			std::string message = "";
			std::string target_qq = "";
			std::string reply_message_id = "";
			const rapidjson::Value& raw_message_data = qq_event_data["message"];
			if (!qq_event_data.HasMember("message") || !qq_event_data["message"].IsArray()) {
				return ;
			}
			const rapidjson::Value& message_array = qq_event_data["message"].GetArray();

			for (rapidjson::SizeType i = 0; i < message_array.Size(); i++) {
				const rapidjson::Value& message_item = message_array[i];
				if (message_item.IsObject() && message_item.HasMember("type") && message_item["type"].IsString() && message_item.HasMember("data") && message_item["data"].IsObject()) {
					std::string type = message_item["type"].GetString();
					const rapidjson::Value& data = message_item["data"];

					if (type == "text") {
						std::string text = data["text"].GetString();
						message += text;
						if (i == 0 && text[0] == '#') is_command = true;
					}

					if (type == "at") {
						target_qq = data["qq"].GetString();
					}

					if (type == "reply") {
						is_reply = true;
						reply_message_id = data["id"].GetString();
					}

					if (type == "face") {
						std::string face_id = data["id"].GetString();
						message += "[face_id=" + face_id + "]";
					}

					//暂时不处理图片消息


				}
			}

			//判断消息是否包含违禁词
			if (containsForbiddenWords(message)) {
				//看发送者是否为管理员或者群主
				std::string user_permission = "";
				user_permission = qq_event_data["sender"]["role"].GetString();
				if (user_permission == "admin" || user_permission == "owner" || sender_qq == OwnerQQ) {
					return ;
				}
				//发送警告消息
				qqbot->send_group_message(group_id, "请注意发言规范！详情见 https://docs.mcnia.com/play-guide/regulation.html");
				//撤回消息
				auto delete_msg_res = qqbot->delete_msg(qq_event_data["message_id"].GetInt());
				//判断撤回消息是否成功
				if (delete_msg_res == 1) {
					qqbot->send_private_message(OwnerQQ, "qq[" + sender_qq + "] 在 群[" + group_id + "] 发送了违禁消息：" + message + ",已成功撤回！");
				} else {
					qqbot->send_private_message(OwnerQQ, "qq[" + sender_qq + "] 在 群[" + group_id + "] 发送了违禁消息：" + message + ",撤回失败,请手动撤回！");
				}
				//禁言发送消息
				qqbot->set_group_ban(group_id, sender_qq, 60);
				return ;
			}


			std::vector<std::string> tokens = splitCommand(message);

			if (!tokens.empty() && tokens[0][0] == '#') {
				std::string main_command = tokens[0].substr(1);
				tokens.erase(tokens.begin());

				auto it = commandMap.find(main_command);
				if (it != commandMap.end()) {
					command_addition_info info = {group_id, sender_qq, sender_role, target_qq};
					it->second(info, tokens); // 调用对应的处理函数
				} else {
					qqbot->send_group_message(group_id, "未知指令，请发送#帮助 获取指令帮助！");
				}
			}

			//处理回复消息,如果是管理员回复内容为撤回，则撤回原消息以及回复消息
			if (is_reply) {
				if (message == "撤回") {
					auto delete_msg_res = qqbot->delete_msg(std::stoi(reply_message_id));
					if (delete_msg_res == 1) {
						qqbot->send_private_message(OwnerQQ, "qq[" + sender_qq + "] 在 群[" + group_id + "] 发送了消息：" + message + ",已被管理员成功撤回！");
					} else {
						qqbot->send_private_message(OwnerQQ, "qq[" + sender_qq + "] 在 群[" + group_id + "] 发送了消息：" + message + ",撤回失败,请手动撤回！");
					}
					auto delete_msg_res2 = qqbot->delete_msg(qq_event_data["message_id"].GetInt());
				}
			}

			return ;
		}

		//处理私聊消息
		if (post_type == "message" && message_type == "private") {
			//解析user_id字段
			std::string user_id = "";
			user_id = std::to_string(qq_event_data["user_id"].GetInt64());
			//后续功能待添加
			return ;
		}

		//处理通知事件
		if (post_type == "notice") {
			//看看group_id，是否为指定的群聊
			std::string group_id = std::to_string(qq_event_data["group_id"].GetInt64());
			if (group_id != QQGroup) {
				return ;
			}

			//解析"notice_type"字段
			std::string notice_type = qq_event_data["notice_type"].GetString();

			//处理群成员减少事件
			if (notice_type == "group_decrease") {
				//获取操作者qq号
				std::string operator_qq = std::to_string(qq_event_data["operator_id"].GetInt64());
				//获取被操作者qq号
				std::string user_qq = std::to_string(qq_event_data["user_id"].GetInt64());
				//获取减少类型
				std::string sub_type = qq_event_data["sub_type"].GetString();
				//获取减少类型为"kick_me"，即自己被踢出群聊
				if (sub_type == "kick_me") {
					//向群聊发送消息“qq:[123456] 已被移出群聊”
					qqbot->send_group_message(group_id, "[" + user_qq + "] 已被移出群聊");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						qqbot->send_group_message(group_id, "player_data.json文件读取失败！");
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
						qqbot->send_group_message(group_id, "由于玩家退出群聊，账号已经被自动冻结");
						return ;
					}
					return ;
				}
				//获取减少类型为"kick"，即被管理员踢出群聊
				if (sub_type == "kick") {
					//向群聊发送消息“qq:[123456] 已被管理员移出群聊”
					qqbot->send_group_message(group_id, "[" + user_qq + "] 已被管理员移出群聊");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						qqbot->send_group_message(group_id, "player_data.json文件读取失败！");
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
						qqbot->send_group_message(group_id, "由于玩家退出群聊，账号已经被自动冻结");
						return ;
					}
					return ;
				}
				//获取减少类型为"leave"，即有成员离开群聊
				if (sub_type == "leave") {
					//向群聊发送消息“qq:[123456] 已退出群聊”
					qqbot->send_group_message(group_id, "[" + user_qq + "] 已退出群聊");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						qqbot->send_group_message(group_id, "player_data.json文件读取失败！");
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
						qqbot->send_group_message(group_id, "由于玩家退出群聊，账号已经被自动冻结");
						return ;
					}
					return ;
				}
				return ;
			}

			//处理群成员增加事件
			if (notice_type == "group_increase") {
				//获取操作者qq号
				std::string operator_qq = std::to_string(qq_event_data["operator_id"].GetInt64());
				//获取被操作者qq号
				std::string user_qq = std::to_string(qq_event_data["user_id"].GetInt64());
				//获取增加类型
				std::string sub_type = qq_event_data["sub_type"].GetString();
				//获取增加类型为"invite"，即被邀请进入群聊
				if (sub_type == "invite") {
					//向群聊发送消息"欢迎@qq 加入本群，发送#帮助获取指令帮助，来绑定自己的Xbox账号！"
					qqbot->send_group_message(group_id, "欢迎 [CQ:at,qq=" + user_qq + "] 加入本群，发送 #帮助 获取指令帮助，来绑定自己的Xbox账号！");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						qqbot->send_group_message(group_id, "player_data.json文件读取失败！");
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
						qqbot->send_group_message(group_id, "该玩家存在相关数据，账号状态已经自动恢复！");
					}
					return ;
				}
				//获取增加类型为"approve"，即被管理员同意进入群聊
				if (sub_type == "approve") {
					//向群聊发送消息"欢迎@qq 加入本群，发送#帮助获取指令帮助，来绑定自己的Xbox账号！"
					qqbot->send_group_message(group_id, "欢迎 [CQ:at,qq=" + user_qq + "] 加入本群，发送 #帮助 获取指令帮助，来绑定自己的Xbox账号！");
					//读取player_data.json文件
					std::ifstream players_data_file("player_data.json");
					//文件读取失败
					if (!players_data_file) {
						qqbot->send_group_message(group_id, "player_data.json文件读取失败！");
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
						qqbot->send_group_message(group_id, "该玩家存在相关数据，账号状态已经自动恢复！");
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
