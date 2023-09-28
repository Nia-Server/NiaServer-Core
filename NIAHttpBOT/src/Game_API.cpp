
#include "Game_API.h"

void init_game_API(httplib::Server &svr) {
    	//服务器开启检测
	svr.Get("/ServerStarted", [](const httplib::Request&, httplib::Response& res) {
		XINFO("Minecraft 服务器连接成功！");
		res.status = 200;
		res.set_content(X("服务器已启动"), "text/plain");
	});
	//玩家加入服务器检测
	svr.Post("/PlayerJoin", [](const httplib::Request& req, httplib::Response& res) {
		INFO(X("玩家 ") << req.body << X(" 进入了服务器"));
		res.status = 200;
		res.set_content(X("玩家进入服务器"), "text/plain");
	});
	//玩家离开服务器检测
	svr.Post("/PlayerLeave", [](const httplib::Request& req, httplib::Response& res) {
		INFO(X("玩家 ") << req.body << X(" 离开了服务器"));
		res.status = 200;
		res.set_content(X("玩家离开服务器"), "text/plain");
	});
	//玩家发言检测
	svr.Post("/PlayerChat", [](const httplib::Request& req, httplib::Response& res) {
		INFO(X("玩家发言 ") << req.body);
		res.status = 200;
		res.set_content(X("玩家进入服务器"), "text/plain");
	});




}

