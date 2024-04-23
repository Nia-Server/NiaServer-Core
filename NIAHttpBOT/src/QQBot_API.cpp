#include "QQBot_API.h"

QQBot::QQBot(const std::string& IPAddress, int ClientPort)
    : cli(IPAddress + ":" + std::to_string(ClientPort)) {}


int32_t QQBot::send_private_message(const std::string & user_id, const std::string & message, bool auto_escape) {
    std::string auto_escape_str = auto_escape ? "true" : "false";
    auto res = cli.Post("/send_private_msg", "{\"user_id\":\"" + user_id + "\",\"message\":\"" + message + "\",\"auto_escape\":\"" + auto_escape_str +"\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok" && doc.HasMember("data")) {
            return doc["data"]["message_id"].GetInt();
        } else {
            WARN(X("调用API <send_private_msg()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <send_private_msg()> 超时，请检查连接！"));
        return -2;
    }
}


int32_t QQBot::send_group_message(const std::string & group_id, const std::string & message, bool auto_escape) {
    std::string auto_escape_str = auto_escape ? "true" : "false";
    auto res = cli.Post("/send_group_msg", "{\"group_id\":\"" + group_id + "\",\"message\":\"" + message + "\",\"auto_escape\":\"" + auto_escape_str +"\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok" && doc.HasMember("data")) {
            return doc["data"]["message_id"].GetInt();
        } else {
            WARN(X("调用API <send_group_msg()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <send_group_msg()> 超时，请检查连接！"));
        return -2;
    }

}

int QQBot::delete_msg(const int32_t &message_id)
{
    auto res = cli.Post("/delete_msg", "{\"message_id\":" + std::to_string(message_id) + "}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else {
            WARN(X("调用API <delete_msg()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <delete_msg()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::send_like(const std::string & user_id, int times) {
    auto res = cli.Post("/send_like", "{\"user_id\":\"" + user_id + "\",\"times\":" + std::to_string(times) + "}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <send_like()> 后，点赞失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <send_like()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <send_like()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::set_group_kick(const std::string & group_id, const std::string & user_id, bool reject_add_request) {
    std::string reject_add_request_str = reject_add_request ? "true" : "false";
    auto res = cli.Post("/set_group_kick", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"reject_add_request\":\"" + reject_add_request_str +"\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <set_group_kick()> 后，踢出失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <set_group_kick()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <set_group_kick()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::set_group_ban(const std::string & group_id, const std::string & user_id, long long duration) {
    auto res = cli.Post("/set_group_ban", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"duration\":" + std::to_string(duration) + "}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <set_group_ban()> 后，禁言失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <set_group_ban()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <set_group_ban()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::set_group_whole_ban(const std::string & group_id, bool enable) {
    std::string enable_str = enable ? "true" : "false";
    auto res = cli.Post("/set_group_whole_ban", "{\"group_id\":\"" + group_id + "\",\"enable\":\"" + enable_str + "\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <set_group_whole_ban()> 后，全群禁言失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <set_group_whole_ban()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <set_group_whole_ban()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::set_group_admin(const std::string & group_id, const std::string & user_id, bool enable) {
    std::string enable_str = enable ? "true" : "false";
    auto res = cli.Post("/set_group_admin", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"enable\":\"" + enable_str + "\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <set_group_admin()> 后，设置管理员失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <set_group_admin()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <set_group_admin()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::set_group_card(const std::string & group_id, const std::string & user_id, const std::string & card) {
    auto res = cli.Post("/set_group_card", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"card\":\"" + card + "\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <set_group_card()> 后，设置名片失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <set_group_card()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <set_group_card()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::set_group_name(const std::string & group_id, const std::string & group_name) {
    auto res = cli.Post("/set_group_name", "{\"group_id\":\"" + group_id + "\",\"group_name\":\"" + group_name + "\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <set_group_name()> 后，设置群名称失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <set_group_name()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <set_group_name()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::set_group_leave(const std::string & group_id, bool is_dismiss) {
    std::string is_dismiss_str = is_dismiss ? "true" : "false";
    auto res = cli.Post("/set_group_leave", "{\"group_id\":\"" + group_id + "\",\"is_dismiss\":\"" + is_dismiss_str + "\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <set_group_leave()> 后，退出群聊失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <set_group_leave()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <set_group_leave()> 超时，请检查连接！"));
        return -2;
    }
}

int QQBot::set_group_request(const std::string & flag, const std::string & sub_type, const std::string & approve, const std::string & reason) {
    auto res = cli.Post("/set_group_request", "{\"flag\":\"" + flag + "\",\"sub_type\":\"" + sub_type + "\",\"approve\":\"" + approve + "\",\"reason\":\"" + reason + "\"}", "application/json");
    if (res) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok") {
            return 1;
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN(X("调用API <set_group_request()> 后，处理群请求失败：") + res->body);
            return 0;
        } else {
            WARN(X("调用API <set_group_request()> 后，返回的数据无法解析：") + res->body);
            return -1;
        }
    } else {
        WARN(X("调用API <set_group_request()> 超时，请检查连接！"));
        return -2;
    }
}

QQBot::login_info QQBot::get_login_info() {
    login_info info;
    auto res = cli.Get("/get_login_info");
    if (res && res->status == 200) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok" && doc.HasMember("data")) {
            info.status = 1;
            info.user_id = doc["data"]["user_id"].GetInt64();
            info.nickname = doc["data"]["nickname"].GetString();
        } else {
            WARN("调用API <get_login_info()> 后，无法解析返回的数据：" + res->body);
            info.status = -1;
        }
        return info;
    } else {
        WARN("调用API <get_login_info()> 超时，请检查连接！");
        info.status = -2;
        return info;
    }
}


QQBot::bot_status QQBot::get_status() {
    bot_status status;
    auto res = cli.Get("/get_status");
    if (res && res->status == 200) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok" && doc.HasMember("data")) {
            status.status = 1;
            status.good = doc["data"]["good"].GetBool();
            status.online = doc["data"]["online"].GetBool();
        } else if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "failed") {
            WARN("调用API <get_status()> 后，获取状态失败：" + res->body);
            status.status = 0;
        } else {
            WARN("调用API <get_status()> 后，无法解析返回的数据：" + res->body);
            status.status = -1;
        }
        return status;
    } else {
        WARN("调用API <get_status()> 超时，请检查连接！");
        status.status = -2;
        return status;
    }
}

std::vector<QQBot::group_list> QQBot::get_group_list() {
    std::vector<group_list> group_list;
    auto res = cli.Get("/get_group_list");
    if (res && res->status == 200) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok" && doc.HasMember("data")) {
            for (auto& group : doc["data"].GetArray()) {
                group_list.push_back({
                    1,
                    group["group_id"].GetInt64(),
                    group["group_name"].GetString(),
                    group["member_count"].GetInt(),
                    group["max_member_count"].GetInt()
                });
            }
        } else {
            group_list.push_back({-1, 0, "", 0, 0});
            WARN("调用API <get_group_list()> 后，无法解析返回的数据：" + res->body);
        }
        return group_list;
    } else {
        group_list.push_back({-2, 0, "", 0, 0});
        WARN("调用API <get_group_list()> 超时，请检查连接！");
        return group_list;
    }
}

QQBot::group_member_info QQBot::get_group_member_info(const std::string & group_id, const std::string & user_id, bool no_cache) {
    group_member_info info;
    auto res = cli.Post("/get_group_member_info", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"no_cache\":" + (no_cache ? "true" : "false") + "}", "application/json");
    if (res && res->status == 200) {
        rapidjson::Document doc;
        doc.Parse(res->body.c_str());
        if (doc.HasMember("status") && std::string(doc["status"].GetString()) == "ok" && doc.HasMember("data")) {
            info.status = 1;
            info.group_id = doc["data"]["group_id"].GetInt64();
            info.user_id = doc["data"]["user_id"].GetInt64();
            info.nickname = doc["data"]["nickname"].GetString();
            info.card = doc["data"]["card"].GetString();
            info.sex = doc["data"]["sex"].GetString();
            info.age = doc["data"]["age"].GetInt();
            info.area = doc["data"]["area"].GetString();
            info.join_time = doc["data"]["join_time"].GetInt();
            info.last_sent_time = doc["data"]["last_sent_time"].GetInt();
            info.level = doc["data"]["level"].GetInt();
            info.role = doc["data"]["role"].GetString();
            //info.title = doc["data"]["title"].GetString();
            info.title_expire_time = doc["data"]["title_expire_time"].GetInt();
            info.card_changeable = doc["data"]["card_changeable"].GetBool();
        } else {
            WARN("调用API <get_group_member_info()> 后，无法解析返回的数据：" + res->body);
            info.status = -1;
        }
        return info;
    } else {
        WARN("调用API <get_group_member_info()> 超时，请检查连接！");
        info.status = -2;
        return info;
    }
}
