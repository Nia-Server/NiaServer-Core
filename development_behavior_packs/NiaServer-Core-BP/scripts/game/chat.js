import { world,system, Player } from '@minecraft/server';
import { cfg } from '../config.js'
import { RunCmd,  GetTime} from '../API/game.js';
import { log,warn,error } from "../API/logger.js";
import { ExternalFS } from '../API/http.js';
import { get_player_title } from './playertitle.js';
import { transfer_data } from '../qqBot/main.js';
import { back_to_last_deaath } from './back.js';
const fs = new ExternalFS();
const USEQQBOT = cfg.USEQQBot;

const BAN_WORDS = [
    "女装"
];

const command_list = [
    "back",
    "kill"
]

var mute_list = {};

//对一些指令的检测
world.beforeEvents.chatSend.subscribe(event => {
    let message = event.message;
    let player = event.sender;
    event.cancel = true;

    if (command_list.includes(message)) {
        switch (message) {
            case "back":
                back_to_last_deaath(player);
                break;
            case "kill":
                player.kill();
                break;
        }
        return;
    };

    //禁言检测
    if (mute_list.hasOwnProperty(player.nameTag)) {
        //首先判断时间
        if (mute_list[player.nameTag] > new Date()) {
            //禁言时间未到
            player.sendMessage(`§c 你已被系统禁言，暂时无法发送消息，禁言剩余时间：§e${((mute_list[player.nameTag] - new Date()) / 1000).toFixed(2)}§c秒`);
            return;
        } else {
            //禁言时间已到
            delete mute_list[player.nameTag];
            player.sendMessage(`§a 你已被系统解除禁言，请注意言行！`);
        }
    }

    //屏蔽词检测
    if (BAN_WORDS.some(word => message.includes(word))) {
        // 字符串包含屏蔽词
        player.sendMessage("§c 你的消息中包含屏蔽词，请检查后再发送！");
        //全服广播
        world.sendMessage(`§c 玩家 §e${player.nameTag} §c于§e ${GetTime()} §r§c发送的消息中包含屏蔽词，已被系统自动禁言！`);
        mute_list[player.nameTag] = new Date(new Date().getTime() + 1 * 60 * 1000) ;
        for ( const player of world.getAllPlayers()) {
            if (player.hasTag("op")) {
                player.sendMessage(`§c 玩家 §e${player.nameTag} §c发送的 §e"${message}" §r§c消息中包含屏蔽词！已被系统自动禁言，如需手动解禁请前往服务器管理面板处理！`);
            }
        }
        return;
    }

    message =  `<${player.name}> ${event.message}`;
    world.sendMessage(get_player_title(player) + message);
    if (USEQQBOT) {
        let new_message = {"type": "game_chat","data": "<" + player.nameTag + "> " + message};
        transfer_data.data.push(new_message);
    }

})