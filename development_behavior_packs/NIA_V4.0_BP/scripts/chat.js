import {world,system, Player} from '@minecraft/server';
import {cfg} from './config.js'
import {Broadcast,Tell,RunCmd,AddScoreboard,GetScore,getNumberInNormalDistribution, GetTime, GetShortTime, log} from './customFunction.js'

import { adler32 } from './API/cipher_system.js'
import { ExternalFS } from './API/filesystem.js';
const fs = new ExternalFS();

const BAN_WORDS = [
    "test",
    "测试"
];

var mute_list = {};


//对一些指令的检测
world.beforeEvents.chatSend.subscribe(t => {

        //对于指令前缀"+"的检测
        if (t.message.slice(0,1) == "-") {
            //取消有自定义指令前缀的消息输出
            t.cancel = true;
            switch (t.message) {
                //help 指令
                case "-help":
                    t.sender.sendMessage("§c暂无相关帮助");
                    break;
                case "-zc":
                    RunCmd(`tp "${t.sender.nameTag}" 702 82 554`);
                    break;
                case "-clock":
                    RunCmd(`give "${t.sender.nameTag}" clock`);
                    t.sender.sendMessage(`§e 钟表已经成功发放！`);
                    break;
                case "-test":
                    RunCmd(`kick "${t.sender.nameTag}" §c测试\njjj`);
                    break;
                default:
                    t.sender.sendMessage(`§c 未知的指令 ${t.message} ！请检查相关指令格式或输入+help获取帮助！`);
                    break;
            }
            return;
        }

        //对于指令前缀"*"的检测
        if (t.message.slice(0,1) == "*") {
            //取消有自定义指令前缀的消息输出
            t.cancel = true;
            if (t.sender.hasTag("op"))
            t.sender.sendMessage(`§c 密码为§a${adler32(toString(t.message.slice(1)))}`);
            return;
        }

    //禁言检测
    if (mute_list.hasOwnProperty(t.sender.nameTag)) {
        //首先判断时间
        if (mute_list[t.sender.nameTag] > new Date()) {
            //禁言时间未到
            t.cancel = true;
            t.sender.sendMessage(`§c 你已被系统禁言！暂时无法发送消息，禁言剩余时间：${((mute_list[t.sender.nameTag] - new Date()) / 1000).toFixed(2)}秒`);
            return;
        } else {
            //禁言时间已到
            delete mute_list[t.sender.nameTag];
            t.sender.sendMessage(`§a 你已被系统解除禁言！请注意言行！`);
        }
    }

    //屏蔽词检测
    if (BAN_WORDS.some(word => t.message.includes(word))) {
        // 字符串包含屏蔽词
        t.cancel = true;
        t.sender.sendMessage("§c 你的消息中包含屏蔽词！请检查后再发送！");
        //全服广播
        world.sendMessage(`§c 玩家 §e${t.sender.nameTag} §c于§e ${GetTime()} §r§c发送的消息中包含屏蔽词！已被系统自动禁言！`);
        mute_list[t.sender.nameTag] = new Date(new Date().getTime() + 1 * 60 * 1000) ;
        for ( const player of world.getAllPlayers()) {
            if (player.hasTag("op")) {
                player.sendMessage(`§c 玩家 §e${t.sender.nameTag} §c发送的 §e"${t.message}" §r§c消息中包含屏蔽词！已被系统自动禁言！如需手动解禁请前往服务器管理面板处理！`);
            }
        }
        return;
    }


    //对于指令前缀"-"的检测以及相关权限的检测
    //后期转化为script-event
    // if (t.message.slice(0,1) == "-") {
    //     //取消有自定义指令前缀的消息输出
    //     t.cancel = true;
    //     //检查玩家是否拥有相关权限
    //     if(t.sender.hasTag("op")) {
    //         //在拥有权限之后再次检测玩家消息
    //         t.cancel = true;
    //         switch (t.message) {
    //             //install 指令
    //             case "-install":
    //                 Broadcast("§c NIA V4初始化安装已开始！\n§a===============================");
    //                 //posX坐标计分板
    //                 AddScoreboard("posX","x坐标");
    //                 //posX坐标计分板
    //                 AddScoreboard("posY","y坐标");
    //                 //posZ坐标计分板
    //                 AddScoreboard("posZ","z坐标");
    //                 //UUID分板
    //                 AddScoreboard("UUID","玩家识别码");
    //                 //数据计分板
    //                 AddScoreboard("DATA","服务器数据");
    //                 AddScoreboard("money","能源币");
    //                 AddScoreboard("oxygen","氧气值");
    //                 AddScoreboard("equLevel","装备等级");
    //                 AddScoreboard("actionbar","标题栏显示样式");
    //                 AddScoreboard("time","在线时间");
    //                 AddScoreboard("menu","§6==NIA服务器==");
    //                 AddScoreboard("AnoxicTime","缺氧时间");
    //                 AddScoreboard("CDK","CDK数据");
    //                 AddScoreboard("show_time","展示时间");

    //                 AddScoreboard("stamina","体力值")
    //                 AddScoreboard("miningTime","采矿时间")
    //                 RunCmd(`scoreboard players set num IslandData 1`)
    //                 Broadcast("§a===============================\n§c NIA V4初始化安装已完成！");
    //                 break;
    //             case "-RN":
    //                 let RN = parseInt(getNumberInNormalDistribution(100,20))
    //                 //防止物价指数出现极端数值
    //                 if (RN <= 20 || RN >= 180) {
    //                     RN = 100
    //                 }
    //                 RunCmd(`scoreboard players set RN DATA ${RN}`);
    //                 RunCmd(`title @a title §c物价指数触发手动更新！`)
    //                 RunCmd(`title @a subtitle §7物价指数由 §l§e${GetScore("DATA","RN") / 100} §r§7变为 §l§e${RN / 100}`)
    //                 RunCmd(`backup`);
    //                 Tell("§c 注意本指令为调试指令，不要在正式生产环境中使用本指令！",t.sender.nameTag);
    //                 break;
    //             case "-backup":
    //                 //暂时不可用
    //                 // fs.Backup(`${cfg.MapFolder}`,`.${cfg.BackupFolder}\\${GetShortTime()}`).then((result) => {
    //                 //     if (result === "success") {
    //                 //         t.sender.sendMessage(`§e 地图备份成功！备份文件夹为：${cfg.BackupFolder}\\${GetShortTime()}`)
    //                 //     } else {
    //                 //         t.sender.sendMessage("§c 地图备份失败！失败错误码：" + result)
    //                 //     }
    //                 // })
    //                 break;
    //             default:
    //                 t.sender.sendMessage("§c 未知的指令 " + t.message + " ！请检查相关指令格式！");
    //                 break;
    //         }
    //     } else {
    //         t.sender.sendMessage("§c 你没有权限使用此指令！");
    //     }
    //     return;
    // }


    //开始判断头衔
    switch (true) {
        case t.sender.hasTag("show_op"):
            t.cancel = true;
            world.sendMessage(' [' + t.sender.nameTag + '] ' + t.message);
            break;
        case t.sender.hasTag("show_donator"):
            t.cancel = true;
            world.sendMessage(' [' + t.sender.nameTag + '] ' + t.message);
            break;
        default:
            t.cancel = true;
            world.sendMessage(' [' + t.sender.nameTag + '] ' + t.message);
            break;
    }



})