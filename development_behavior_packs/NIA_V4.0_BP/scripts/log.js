import { system, world } from "@minecraft/server";
import { ExternalFS } from "./API/filesystem";
import { log, GetTime, Broadcast, warn } from "./customFunction";

const fs = new ExternalFS();

//定义文件名称
var log_file_name = `2024-07-24.csv`;

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
        log(`[log] The log file ${log_file} already exists!`);
    } else if (result === "false") {
        fs.CreateNewFile(log_file,"时间,维度,主体,X,Y,Z,事件,目标,x,y,z,附加信息\n").then((result) => {
            log("ssss" + result)
            if (result === "success") {
                log(`[log] The log file ${log_file} has been successfully created!`);
            } else {
                warn("Failed to create log file!");
            }
        })
    } else if (result === -1) {
        warn("Failed to connect to the server!");
    }
})

//判断时间日期是否切换
// system.runInterval(() => {
//     if (log_file_name !== `log_${GetTime()}.csv`) {
//         log_file_name = `log_${GetTime()}.csv`;
//         log_file = log_folder + log_file_name;
//         log(`[log] The log file has been successfully switched to ${log_file}!`);
//         //创建新的日志文件
//         fs.CreateNewFile(log_file).then((result) => {
//             if (result === "success") {
//                 log(`[log] The log file ${log_file} has been successfully created!`);
//             } else {
//                 warn("Failed to create new log file!");
//             }
//         })
//     }
// },100)

//启动检测特定文件是否存在
const log_API = {
    WriteToLog(dimension,subject,x0,y0,z0,event,target,x1,y1,z1,extra) {
        fs.WriteLineToFile(log_file,`${GetTime()},${dimension},${subject},${x0},${y0},${z0},${event},${target},${x1},${y1},${z1},${extra}\n`).then((result) => {
            if (result === "success") {
                log(`[log][${dimension}] ${subject} 在 ${GetTime()} 发生了 ${event} 事件，目标为 ${target}，附加信息为 ${extra}`);
            } else {
                warn("Failed to write to log file!");
            }
        })
    }
}

//监听玩家聊天事件
world.beforeEvents.chatSend.subscribe((event) => {
    if (config.chat_send) {
        system.run(() => {
            log_API.WriteToLog(event.sender.dimension.id,event.sender.nameTag,event.sender.location.x,event.sender.location.y,event.sender.location.z,"玩家聊天事件","","","","",event.message);
        })
    }
})

//
world.afterEvents.explosion.subscribe((event) => {
    log(event.source.location.x)
    log_API.WriteToLog(event.dimension.id,event.source.typeId,event.source.location.x,event.source.location.y,event.source.location.z,"实体爆炸事件","","","","","");
})

