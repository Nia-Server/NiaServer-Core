import {world,system, Player} from '@minecraft/server';
import {cfg} from './config.js'
import {Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution, GetTime, GetShortTime, log} from './customFunction.js'

import { adler32 } from './API/cipher_system.js'
import { ExternalFS } from './API/filesystem.js';
const fs = new ExternalFS();


//对一些指令的检测
world.afterEvents.chatSend.subscribe(t => {
    //对于指令前缀"-"的检测以及相关权限的检测
    if (t.message.slice(0,1) == "-") {
        //取消有自定义指令前缀的消息输出
        t.cancel = true;
        //检查玩家是否拥有相关权限
        if(t.sender.hasTag("op")) {
            //在拥有权限之后再次检测玩家消息
            let hasCommand = false;
            switch (t.message) {
                //install 指令
                case "-install":
                    hasCommand = true;
                    Broadcast("§c>> NIA V4初始化安装已开始！\n§a===============================");
                    //IslandData存储空岛数据计分板
                    AddScoreboard("IslandData","空岛数据");
                    //IslandID要获得的空岛坐标的空岛编号计分板
                    AddScoreboard("IslandID","空岛编号");
                    //posX坐标计分板
                    AddScoreboard("posX","x坐标");
                    //posX坐标计分板
                    AddScoreboard("posY","y坐标");
                    //posZ坐标计分板
                    AddScoreboard("posZ","z坐标");
                    //UUID分板
                    AddScoreboard("UUID","玩家识别码");
                    //数据计分板
                    AddScoreboard("DATA","服务器数据");
                    AddScoreboard("money","能源币");
                    AddScoreboard("oxygen","氧气值");
                    AddScoreboard("equLevel","装备等级");
                    AddScoreboard("actionbar","标题栏显示样式");
                    AddScoreboard("time","在线时间");
                    AddScoreboard("menu","§6==NIA服务器==");
                    AddScoreboard("AnoxicTime","缺氧时间");
                    AddScoreboard("CDK","CDK数据");
                    AddScoreboard("show_time","展示时间");
                    AddScoreboard("c_time","创建空岛时间");
                    AddScoreboard("stamina","体力值")
                    AddScoreboard("miningTime","采矿时间")
                    RunCmd(`scoreboard players set num IslandData 1`)
                    Broadcast("§a===============================\n§c>> NIA V4初始化安装已完成！");
                    break;
                case "-RN":
                    hasCommand = true;
                    let RN = parseInt(getNumberInNormalDistribution(100,20))
                    //防止物价指数出现极端数值
                    if (RN <= 20 || RN >= 180) {
                        RN = 100
                    }
                    RunCmd(`scoreboard players set RN DATA ${RN}`);
                    RunCmd(`title @a title §c物价指数触发手动更新！`)
                    RunCmd(`title @a subtitle §7物价指数由 §l§e${GetScore("DATA","RN") / 100} §r§7变为 §l§e${RN / 100}`)
                    RunCmd(`backup`);
                    Tell("§c>> 注意本指令为调试指令，不要在正式生产环境中使用本指令！",t.sender.nameTag);
                    break;
                case "-backup":
                    hasCommand = true;
                    t.cancel = true;
                    fs.Backup(`${cfg.MapFolder}`,`.${cfg.BackupFolder}\\${GetShortTime()}`).then((result) => {
                        if (result === "success") {
                            t.sender.sendMessage(`§e>> 地图备份成功！备份文件夹为：${cfg.BackupFolder}\\${GetShortTime()}`)
                        } else {
                            t.sender.sendMessage("§c>> 地图备份失败！失败错误码：" + result)
                        }
                    })
                    break;
            }
            if (!hasCommand) {
                Tell(`§c>> 未知的指令 ${t.message} ！请检查相关指令格式！`,t.sender.nameTag);
            }
        } else {
            Tell("§c>> 你没有相关权限!",t.sender.nameTag);
        }
    }
    //对于指令前缀"+"的检测
    if (t.message.slice(0,1) == "+") {
        //取消有自定义指令前缀的消息输出
        t.cancel = true;
        let hasCommand = false;
        switch (t.message) {
            //help 指令
            case "+help":
                hasCommand = true;
                Tell("§c暂无相关帮助",t.sender.nameTag);
                break;
            case "+zc":
                hasCommand = true;
                RunCmd(`tp "${t.sender.nameTag}" 702 82 554`);
                break;
            case "+clock":
                hasCommand = true;
                RunCmd(`give "${t.sender.nameTag}" clock`);
                Tell(`§e>> 钟表已经成功发放！`,t.sender.nameTag)
                break;
        }
        if (!hasCommand) {
            Tell(`§c>> 未知的指令 ${t.message} ！请检查相关指令格式或输入+help获取帮助！`,t.sender.nameTag)
        }
    }
    //对于指令前缀"*"的检测
    if (t.message.slice(0,1) == "*") {
        //取消有自定义指令前缀的消息输出
        t.cancel = true;
        if (t.sender.hasTag("op"))
            Tell(`§c>> 密码为§a${adler32(toString(t.message.slice(1)))}`,t.sender.nameTag);
    }


})