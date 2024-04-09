#ifndef QQBOT_API_H
#define QQBOT_API_H

#include <httplib.h>
#include <rapidjson/document.h>
#include <rapidjson/stringbuffer.h>
#include <rapidjson/prettywriter.h>
#include <rapidjson/ostreamwrapper.h>
#include <rapidjson/istreamwrapper.h>

#include "I18Nize.hpp"
#include "Logger.hpp"

class QQBot {
public:
    QQBot(const std::string& IPAddress, int ClientPort);
    /**
     * @brief 发送私聊消息
     *
     * @param user_id 用户ID
     * @param message 消息内容
     * @param auto_escape 是否自动转义
     */
    void send_private_message(const std::string & user_id, const std::string & message, bool auto_escape = false);

    /**
     * @brief 发送群消息
     *
     * @param group_id 群ID
     * @param message 消息内容
     * @param auto_escape 是否自动转义
     */
    void send_group_message(const std::string & group_id, const std::string & message, bool auto_escape = false);


    /**
     * @brief 发送点赞
     *
     * @param user_id 用户ID
     * @param times 点赞次数
     */
    void send_like(const std::string & user_id, int times);

    /**
     * @brief 设置群成员踢出
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param reject_add_request 是否拒绝加
     *群请求
     */
    void set_group_kick(const std::string & group_id, const std::string & user_id, bool reject_add_request = false);

    /**
     * @brief 设置群成员禁言
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param duration 禁言时长
     */
    void set_group_ban(const std::string & group_id, const std::string & user_id, long long duration);

    /**
     * @brief 设置全群禁言
     * @param group_id 群ID
     * @param enable 是否开启全群禁言
     */
    void set_group_whole_ban(const std::string & group_id, bool enable);

    /**
     * @brief 设置群管理员
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param enable 是否设置为管理员
     */
    void set_group_admin(const std::string & group_id, const std::string & user_id, bool enable);

    /**
     * @brief 设置群成员名片
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param card 名片内容
     */
    void set_group_card(const std::string & group_id, const std::string & user_id, const std::string & card);

    /**
     * @brief 设置群名称
     *
     * @param group_id 群ID
     * @param group_name 群名称
     */
    void set_group_name(const std::string & group_id, const std::string & group_name);

    /**
     * @brief 退出群聊
     *
     * @param group_id 群ID
     * @param is_dismiss 是否解散群
     */
    void set_group_leave(const std::string & group_id, bool is_dismiss);

    /**
     * @brief 处理群请求
     *
     * @param flag 请求标识
     * @param sub_type 子类型
     * @param approve 是否同意请求
     * @param reason 原因
     */
    void set_group_request(const std::string & flag, const std::string & sub_type, const std::string & approve, const std::string & reason);



private:
    httplib::Client cli;
};

#endif