import { world,system, Player } from '@minecraft/server';
import { cfg } from '../config.js'
import { RunCmd,  GetTime} from '../API/game.js';
import { log,warn,error } from "../API/logger.js";
import { ExternalFS } from '../API/http.js';
const fs = new ExternalFS();


const BAN_WORDS = [
    "女装"
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
                    t.sender.sendMessage("§c服务器游玩指南：\n" +
                        ""
                    );
                    break;
                case "-zc":
                    RunCmd(`tp "${t.sender.nameTag}" 702 82 554`);
                    break;
                case "-clock":
                    RunCmd(`give "${t.sender.nameTag}" clock`);
                    t.sender.sendMessage(`§e 钟表已经成功发放！`);
                    break;
                case "-test":
                    RunCmd(`kick "${t.sender.nameTag}" §c哎？你在在说什么？`);
                    break;
                default:
                    t.sender.sendMessage(`§c 未知的指令 ${t.message} ！请检查相关指令格式或输入+help获取帮助！`);
                    break;
            }
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

    // //屏蔽词检测
    // if (BAN_WORDS.some(word => t.message.includes(word))) {
    //     // 字符串包含屏蔽词
    //     t.cancel = true;
    //     t.sender.sendMessage("§c 你的消息中包含屏蔽词！请检查后再发送！");
    //     //全服广播
    //     world.sendMessage(`§c 玩家 §e${t.sender.nameTag} §c于§e ${GetTime()} §r§c发送的消息中包含屏蔽词！已被系统自动禁言！`);
    //     mute_list[t.sender.nameTag] = new Date(new Date().getTime() + 1 * 60 * 1000) ;
    //     for ( const player of world.getAllPlayers()) {
    //         if (player.hasTag("op")) {
    //             player.sendMessage(`§c 玩家 §e${t.sender.nameTag} §c发送的 §e"${t.message}" §r§c消息中包含屏蔽词！已被系统自动禁言！如需手动解禁请前往服务器管理面板处理！`);
    //         }
    //     }
    //     return;
    // }

})