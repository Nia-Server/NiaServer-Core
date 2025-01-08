/*

Copyright (C) 2025 Nia-Server

filename: qqBot.js

authors: NIANIANKNIA

version: v1.0.0

last update: 2025/01/06

license: AGPL-3.0

*/
import { ExplosionAfterEvent, world } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { http,HttpRequestMethod,HttpRequest,HttpHeader } from '@minecraft/server-net';
import { GetTime, RunCmd ,log } from './customFunction.js';

import { ExternalFS,QQBotSystem } from './API/filesystem.js';
import { VERSION,BDS_VERSION,LAST_UPGRATE,CODE_BRANCH } from "./main.js";


const bot = new QQBotSystem();
const fs = new ExternalFS();



console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] QQBot has been successfully started on this server!\x1b[0m\n`);

// world.afterEvents.worldInitialize.subscribe((event) => {
//     bot.send_group_msg(`服务器已与机器人成功连接！\nBDS当前版本:${BDS_VERSION}\nCore版本:${VERSION}\n上次更新时间:${LAST_UPGRATE}`,"724360499").then((result) => {
//         console.log(result);
//     })
// })




world.afterEvents.chatSend.subscribe((event) => {
    //console.log("[" + event.sender.nameTag + "] " + event.message);
    bot.send_group_msg("[" + event.sender.nameTag + "] " + event.message,"724360499").then((result) => {
        console.log(result);
    })
});

world.afterEvents.playerLeave.subscribe((event) => {
    //console.log(`玩家 ${event.playerName} 离开了服务器！`);
    // bot.send_group_msg(`玩家 ${event.playerName} 离开了服务器！`,"724360499").then((result) => {
    //     console.log(result);
    // })
})

world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        //首先检查是否有预览商品
        console.log(`玩家 ${event.player.nameTag} 加入了服务器！`);
        // bot.send_group_msg(`玩家 ${event.player.nameTag} 加入了服务器！`,"724360499").then((result) => {
        //     console.log(result);
        // })
        let players_data = {};
        let player = event.player;
        //读取player_data.json文件
        fs.GetJSONFileData("player_data.json").then((result) => {
            //文件不存在
            if (result === 0) {
                RunCmd(`kick ${player.nameTag} 由于无法读取玩家数据\n您暂时无法游玩服务器，您可以在一段时间后再次尝试进入！\n这不是您的问题，请尽快联系管理员解决！`);
                log("The player data file does not exist and has been successfully created!");
            } else if (result === -1) {
                RunCmd(`kick ${player.nameTag} 由于服务器连接失败\n您暂时无法游玩服务器，您可以在一段时间后再次尝试进入！\n这不是您的问题，请尽快联系管理员解决！`);
                console.error("[NiaServer-Core] Dependency server connection failed!");
            } else {
                //文件存在且服务器连接成功
                players_data = result;
                let have_player = false;
                //开始遍历玩家数据，寻找名为event.playerName的玩家
                for (let qqid in players_data) {
                    if (players_data[qqid].xboxid == player.nameTag) {
                        //检查玩家状态
                        if (players_data[qqid].status != "normal") {
                            have_player = true;
                            RunCmd(`kick ${player.nameTag} 由于您的账号状态异常\n您暂时无法游玩服务器，您的账号状态为：${players_data[qqid].status}\n如果您想要解决这个问题，请尽快联系管理员！`);
                            return;
                        }
                        //检查玩家是否被封禁
                        if (players_data[qqid].ban_time != "0") {
                            //比对封禁时间
                            if (players_data[qqid].ban_time >= GetTime()) {
                                RunCmd(`kick ${player.nameTag} 由于您的账号§c存在违规行为§r\n您已被§c封禁§r，封禁解除时间为：${players_data[qqid].ban_time}\n如果您认为这是一个误封，请尽快联系管理员！`);
                            } else {
                                //发送欢迎消息
                                player.sendMessage("§a 欢迎回到服务器！");
                            }
                            have_player = true;
                            return;
                        }
                        //发送欢迎消息
                        player.sendMessage("§a 欢迎回到服务器！");
                        have_player = true;
                        return;
                    }
                }
                //未找到玩家数据
                if (!have_player) {
                    RunCmd(`kick ${player.nameTag} 由于§c未找到您的相关数据§r，您暂时无法游玩服务器！\n为了服务器安全，您需要§c加入服务器官方QQ群并绑定XboxID§r才可以正常游玩！\n请您尽快加入服务器官方QQ群并自自助绑定XboxID！\n§e详情见服务器官方文档站:https://docs.mcnia.com`);
                }
            }
        })
    }

})


world.afterEvents.explosion.subscribe((event) => {
    bot.send_group_msg(`服务器在 ${event.source.location.x.toFixed(2).toString()} 发生了爆炸！`,"724360499").then((result) => {
        console.log(result);
    })
});