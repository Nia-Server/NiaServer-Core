
#ifndef QQBOT_API_H
#define QQBOT_API_H

#ifdef WIN32 //only enable TLS in windows
#define CPPHTTPLIB_OPENSSL_SUPPORT
#endif

#include <httplib.h>
#include <vector>
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
    int32_t send_private_message(const std::string & user_id, const std::string & message, bool auto_escape = false);

    /**
     * @brief 发送群消息
     *
     * @param group_id 群ID
     * @param message 消息内容
     * @param auto_escape 是否自动转义
     */
    int32_t send_group_message(const std::string & group_id, const std::string & message, bool auto_escape = false);

    /**
     * @brief 撤回消息
     *
     * @param message_id 讨论组ID
     * @return 是否撤回成功
     */
    int delete_msg(const int32_t & message_id);


    /**
     * @brief 发送点赞
     *
     * @param user_id 用户ID
     * @param times 点赞次数
     */
    int send_like(const std::string & user_id, int times);

    /**
     * @brief 设置群成员踢出
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param reject_add_request 是否拒绝加
     *群请求
     */
    int set_group_kick(const std::string & group_id, const std::string & user_id, bool reject_add_request = false);

    /**
     * @brief 设置群成员禁言
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param duration 禁言时长
     */
    int set_group_ban(const std::string & group_id, const std::string & user_id, long long duration);

    /**
     * @brief 设置全群禁言
     * @param group_id 群ID
     * @param enable 是否开启全群禁言
     */
    int set_group_whole_ban(const std::string & group_id, bool enable);

    /**
     * @brief 设置群管理员
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param enable 是否设置为管理员
     */
    int set_group_admin(const std::string & group_id, const std::string & user_id, bool enable);

    /**
     * @brief 设置群成员名片
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param card 名片内容
     */
    int set_group_card(const std::string & group_id, const std::string & user_id, const std::string & card);

    /**
     * @brief 设置群名称
     *
     * @param group_id 群ID
     * @param group_name 群名称
     */
    int set_group_name(const std::string & group_id, const std::string & group_name);

    /**
     * @brief 退出群聊
     *
     * @param group_id 群ID
     * @param is_dismiss 是否解散群
     */
    int set_group_leave(const std::string & group_id, bool is_dismiss = false);

    /**
     * @brief 处理群请求
     *
     * @param flag 请求标识
     * @param sub_type 子类型
     * @param approve 是否同意请求
     * @param reason 原因
     */
    int set_group_request(const std::string & flag, const std::string & sub_type, const std::string & approve, const std::string & reason);

    struct login_info {
        int status;
        int64_t user_id;
        std::string nickname;
    };

    /**
     * @brief 获取登录信息
     *
     * @return login_info
     */
    login_info get_login_info();


    struct bot_status {
        int status;
        bool online;
        bool good;
    };
    /**
     * @brief 获取机器人运行状态
     *
     * @return status
     */
    bot_status get_status();

    struct group_list {
        int status;
        int64_t group_id;
        std::string group_name;
        int32_t member_count;
        int32_t max_member_count;
    };

    /**
     * @brief 获取群列表
     *
     * @return std::vector<group_list>
     */
    std::vector<group_list> get_group_list();

    struct group_member_info {
        int status;
        int64_t group_id;
        int64_t user_id;
        std::string nickname;
        std::string card;
        std::string sex;
        int32_t age;
        std::string area;
        int32_t join_time;
        int32_t last_sent_time;
        int32_t level;
        std::string role;
        //std::string title;
        int32_t title_expire_time;
        bool card_changeable;
    };

    /**
     * @brief 获取群成员信息
     *
     * @param group_id 群ID
     * @param user_id 用户ID
     * @param no_cache 是否不使用缓存
     * @return group_member_info
     */
    group_member_info get_group_member_info(const std::string & group_id, const std::string & user_id, bool no_cache = false);



private:
    httplib::Client cli;

};

#endif