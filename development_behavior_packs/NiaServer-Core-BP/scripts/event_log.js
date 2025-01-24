/*

Copyright (C) 2025 Nia-Server

filename: event_log.js

authors: NIANIANKNIA

version: v1.0.0

last update: 2025/01/10

license: AGPL-3.0

*/

import { system, world } from "@minecraft/server";
import { ExternalFS } from './API/http.js';
import { GetTime,GetDate } from "./customFunction";
import { log,warn,error } from "./API/logger.js";

const fs = new ExternalFS();

//定义文件名称
var log_file_name = `${GetDate()}.csv`;

//定义日志文件存放文件夹
const log_folder = "./log/";

//配置文件

const config = {
    "chat_send": true,
}

var log_file = log_folder + log_file_name;

//创建日志文件夹
fs.RunCmd(`mkdir "${log_folder}"`)

//检查日志文件是否存在，如果不存在则创建
fs.CheckFile(`${log_file}`).then((result) => {
    if (result === "true") {
        log(`【日志系统】 ${log_file} 已经存在，无需重复创建`);
    } else if (result === "false") {
        fs.CreateNewFile(log_file,"时间,维度,主体,X,Y,Z,事件,目标,x,y,z,附加信息\n").then((result) => {
            if (result === "success") {
                log(`【日志系统】 ${log_file_name} 已经成功创建`);
            } else {
                warn("【日志系统】 创建日志文件时遇到了一些问题...");
            }
        })
    } else if (result === -1) {
        warn(`【日志系统】在检查日志文件 ${log_file_name} 时与NIAHttpBOT连接失败`);
    }
})

//判断时间日期是否切换
system.runInterval(() => {
    if (log_file_name !== `${GetDate()}.csv`) {
        log_file_name = `${GetDate()}.csv`;
        log_file = log_folder + log_file_name;
        log(`【日志系统】日期已经切换，新的日志文件为 ${log_file_name}`);
        //创建新的日志文件
        fs.CreateNewFile(log_file,"时间,维度,主体,X,Y,Z,事件,目标,x,y,z,附加信息\n").then((result) => {
            if (result === "success") {
                log(`【日志系统】 ${log_file_name} 已经成功创建`);
            } else {
                warn("【日志系统】 创建日志文件时遇到了一些问题...");
            }
        })
    }
},100)

//启动检测特定文件是否存在
const log_API = {
    WriteToLog(dimension,subject,x0,y0,z0,event,target,x1,y1,z1,extra) {
        fs.WriteLineToFile(log_file,`${GetTime()},${dimension},${subject},${x0},${y0},${z0},${event},${target},${x1},${y1},${z1},${extra}\n`).then((result) => {
            if (result === "success") {
                log(`【日志】[${dimension}] ${subject} 在 ${GetTime()} 发生了 ${event} 事件，目标为 ${target}，附加信息为 ${extra}`);
            } else {
                warn("【日志】写入日志时遇到了一些问题...");
            }
        })
    }
}

//监听玩家聊天事件
world.beforeEvents.chatSend.subscribe((event) => {
    if (config.chat_send) {
        system.run(() => {
            log_API.WriteToLog(event.sender.dimension.id,event.sender.nameTag,event.sender.location.x,event.sender.location.y,event.sender.location.z,"玩家聊天事件","","","","",event.message)
        })
    }
})

//监听玩家进入事件
world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        log_API.WriteToLog(
            event.player.dimension.id,
            event.player.nameTag,
            event.player.location.x,
            event.player.location.y,
            event.player.location.z,
            "玩家加入服务器事件",
            "",
            "",
            "",
            "",
            ""
        )
    }
})

world.beforeEvents.playerLeave.subscribe((event) => {
    system.run(() => {
        log_API.WriteToLog(
            event.player.dimension.id,
            event.player.nameTag,
            event.player.location.x,
            event.player.location.y,
            event.player.location.z,
            "玩家离开服务器事件",
            "",
            "",
            "",
            "",
            ""
        )
    })
})

world.afterEvents.playerPlaceBlock.subscribe((event) => {
    log_API.WriteToLog(
        event.dimension.id,
        event.player.nameTag,
        event.player.location.x,
        event.player.location.y,
        event.player.location.z,
        "玩家放置方块事件",
        event.block.typeId,
        event.block.location.x,
        event.block.location.y,
        event.block.location.z,
        ""
    )
})

world.afterEvents.chatSend.subscribe((event) => {
    log_API.WriteToLog(
        event.sender.dimension.id,
        event.sender.nameTag,
        event.sender.location.x,
        event.sender.location.y,
        event.sender.location.z,
        "玩家聊天事件",
        "",
        "",
        "",
        "",
        event.message
    )
})

//
// world.afterEvents.explosion.subscribe((event) => {
//     log_API.WriteToLog(event.dimension.id,event.source.typeId,event.source.location.x,event.source.location.y,event.source.location.z,"实体爆炸事件","","","","","");
// })

