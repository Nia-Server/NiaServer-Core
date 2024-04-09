#include "QQBot_API.h"

QQBot::QQBot(const std::string& IPAddress, int ClientPort)
    : cli(IPAddress + ":" + std::to_string(ClientPort)) {}


void QQBot::send_private_message(const std::string & user_id, const std::string & message, bool auto_escape) {
    std::string auto_escape_str = auto_escape ? "true" : "false";
    auto res = cli.Post("/send_private_msg", "{\"user_id\":\"" + user_id + "\",\"message\":\"" + message + "\",\"auto_escape\":\"" + auto_escape_str +"\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}


void QQBot::send_group_message(const std::string & group_id, const std::string & message, bool auto_escape) {
    std::string auto_escape_str = auto_escape ? "true" : "false";
     auto res = cli.Post("/send_group_msg", "{\"group_id\":\"" + group_id + "\",\"message\":\"" + message + "\",\"auto_escape\":\"" + auto_escape_str +"\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}


void QQBot::send_like(const std::string & user_id, int times) {
    auto res = cli.Post("/send_like", "{\"user_id\":\"" + user_id + "\",\"times\":" + std::to_string(times) + "}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}

void QQBot::set_group_kick(const std::string & group_id, const std::string & user_id, bool reject_add_request) {
    std::string reject_add_request_str = reject_add_request ? "true" : "false";
    auto res = cli.Post("/set_group_kick", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"reject_add_request\":\"" + reject_add_request_str +"\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}

void QQBot::set_group_ban(const std::string & group_id, const std::string & user_id, long long duration) {
    auto res = cli.Post("/set_group_ban", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"duration\":" + std::to_string(duration) + "}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}

void QQBot::set_group_whole_ban(const std::string & group_id, bool enable) {
    std::string enable_str = enable ? "true" : "false";
    auto res = cli.Post("/set_group_whole_ban", "{\"group_id\":\"" + group_id + "\",\"enable\":\"" + enable_str + "\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}

void QQBot::set_group_admin(const std::string & group_id, const std::string & user_id, bool enable) {
    std::string enable_str = enable ? "true" : "false";
    auto res = cli.Post("/set_group_admin", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"enable\":\"" + enable_str + "\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}

void QQBot::set_group_card(const std::string & group_id, const std::string & user_id, const std::string & card) {
    auto res = cli.Post("/set_group_card", "{\"group_id\":\"" + group_id + "\",\"user_id\":\"" + user_id + "\",\"card\":\"" + card + "\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}

void QQBot::set_group_name(const std::string & group_id, const std::string & group_name) {
    auto res = cli.Post("/set_group_name", "{\"group_id\":\"" + group_id + "\",\"group_name\":\"" + group_name + "\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}

void QQBot::set_group_leave(const std::string & group_id, bool is_dismiss) {
    std::string is_dismiss_str = is_dismiss ? "true" : "false";
    auto res = cli.Post("/set_group_leave", "{\"group_id\":\"" + group_id + "\",\"is_dismiss\":\"" + is_dismiss_str + "\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}

void QQBot::set_group_request(const std::string & flag, const std::string & sub_type, const std::string & approve, const std::string & reason) {
    auto res = cli.Post("/set_group_request", "{\"flag\":\"" + flag + "\",\"sub_type\":\"" + sub_type + "\",\"approve\":\"" + approve + "\",\"reason\":\"" + reason + "\"}", "application/json");
    if (res) {
        std::cout << res->body << std::endl;
    }
    else {
        std::cout << "error code: " << res.error() << std::endl;
    }
}
