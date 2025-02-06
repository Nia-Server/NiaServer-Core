import { world } from '@minecraft/server'
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { RunCmd } from '../API/game.js'
import { Main } from './main_menu.js'
import { SetupGUI } from './setup.js'

const GUI = {
    TpaMain(player) {
        const TpaMainForm = new ActionFormData()
        .title("传送系统")
        .body(
            "§r§l===========================" +
            "\n§c欢迎使用传送系统！" +
            "\n§r§l==========================="
        )
        .button("开始传送")
        .button("传送设置")
        .button("返回上一级菜单")
        TpaMainForm.show(player).then(result => {
            if (result.selection == 0) {
                this.TpaSub(player)
            } else if (result.selection == 1) {
                this.TpaSetup(player)
            } else if (result.selection == 2) {
                Main(player)
            }
        })
    },

    TpaSub(player) {
        let players = world.getPlayers()
        let playerList = Array.from(players);
        let playersName = []
        for (let i = 0; i < playerList.length; i++) {
            playersName.push(playerList[i].nameTag)
        }

        const TpaSubForm = new ModalFormData()
            .title("传送系统")
            .dropdown("请选择本次传送的模式：",["将自己传送至目标玩家","将目标玩家传送至自己这里"],0)
            .dropdown("请选择要传送的玩家：",playersName,0)
            TpaSubForm.show(player).then(result => {
                if (result.canceled) {
                    this.TpaMain(player)
                }
                if (result.formValues[0] == 0) {
                    this.ApplyTpa1(playerList[result.formValues[1]],player)
                } else if (result.formValues[0] == 1) {
                    this.ApplyTpa2(playerList[result.formValues[1]],player)
                }
            })
    },

    ApplyTpa1(AcceptPlayer,ApplyPlayer) {
        //检查对方是否在黑名单中
        let BanList = [];
        let ScoreBoards = world.scoreboard.getObjectives()
        for (let i = 0; i < ScoreBoards.length; i++) {
            if (ScoreBoards[i].id == "T:" + AcceptPlayer.nameTag.slice(0,10)) {
                for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                    BanList.push(ScoreBoards[i].getParticipants()[j].displayName.slice(1))
                    break;
                }
                break;
            }
        }
        if (AcceptPlayer.hasTag("BanTpa") || BanList.includes(ApplyPlayer.nameTag)) {
            const ErrorTpaForm = new MessageFormData()
                .title("§c§l传送申请异常提醒")
                .body("§e玩家 §l§6" + AcceptPlayer.nameTag + " \n§r§e无法正常接收传送申请！"+
                    "\n可能是因为对方关闭了传送系统！")
                .button1("§c退出传送系统")
                .button2("§a返回传送系统")
            ErrorTpaForm.show(ApplyPlayer).then(result => {
                if (result.selection == 1) {
                    this.TpaMain(ApplyPlayer)
                }
            })
        } else {
            const ApplyTpa1Form = new MessageFormData()
                .title("§c§l传送申请")
                .body("§e玩家 §l§6" + ApplyPlayer.nameTag + " \n§r§e申请传送到您这里！请问您是否同意呢？")
                .button1("§c不同意")
                .button2("§a同意")
            ApplyTpa1Form.show(AcceptPlayer).then(result => {
                if (result.selection == 0) {
                    ApplyPlayer.sendMessage(`§c 对方拒绝了您的传送申请！请尝试稍后重试！（请勿短时间内多次发起申请，否则可能被对方加入黑名单！）`);
                } else if (result.selection == 1) {
                    ApplyPlayer.sendMessage(`§a 对方同意了您的申请，已把您传送过去！`);
                    AcceptPlayer.sendMessage(`§a 您已同意对方的传送申请！`);
                    RunCmd(`tp "${ApplyPlayer.nameTag}" "${AcceptPlayer.nameTag}"`)
                }
            })
        }
    },

    ApplyTpa2(AcceptPlayer,ApplyPlayer) {
        //检查对方是否在黑名单中
        let BanList = [];
        let ScoreBoards = world.scoreboard.getObjectives()
        for (let i = 0; i < ScoreBoards.length; i++) {
            if (ScoreBoards[i].id == "T:" + AcceptPlayer.nameTag.slice(0,10)) {
                for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                    BanList.push(ScoreBoards[i].getParticipants()[j].displayName.slice(1))
                    break;
                }
                break;
            }
        }
        if (AcceptPlayer.hasTag("BanTpa") || BanList.includes(ApplyPlayer.nameTag)) {
            const ErrorTpaForm = new MessageFormData()
                .title("§c§l传送申请异常提醒")
                .body("§e玩家 §l§6" + AcceptPlayer.nameTag + " \n§r§e无法正常接收传送申请！\n可能是因为对方关闭了传送系统！")
                .button1("§c退出传送系统")
                .button2("§a返回传送系统")
            ErrorTpaForm.show(ApplyPlayer).then(result => {
                if (result.selection == 1) {
                    this.TpaMain(ApplyPlayer)
                }
            })
        } else {
            const ApplyTpa2Form = new MessageFormData()
                .title("§c§l传送申请")
                .body("§e玩家 §l§6" + ApplyPlayer.nameTag + " \n§r§e申请将您传送到他那里！请问您是否同意呢？")
                .button1("§c不同意")
                .button2("§a同意")
            ApplyTpa2Form.show(AcceptPlayer).then(result => {
                if (result.selection == 0) {
                    ApplyPlayer.sendMessage(`§c 对方拒绝了您的传送申请！请尝试稍后重试！（请勿短时间内多次发起申请，否则可能被对方加入黑名单！）`);
                } else if (result.selection == 1) {
                    ApplyPlayer.sendMessage(`§a 对方同意了您的申请，已把对方传送过来！`);
                    AcceptPlayer.sendMessage(`§a 您已同意对方的传送申请，已把您传送至对方所在位置`)
                    RunCmd(`tp "${AcceptPlayer.nameTag}" "${ApplyPlayer.nameTag}"`)
                }
            })
        }
    },

    TpaSetup(player) {
        let players = world.getPlayers()
        let playerList = Array.from(players);
        let playersName = ["请选择在线玩家后提交"]
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].nameTag != player.nameTag) {
                playersName.push(playerList[i].nameTag)
            }
        }

        let HaveData = false;
        let BanList = ["选择下拉列表玩家后提交"];
        let ScoreBoards = world.scoreboard.getObjectives()
        for (let i = 0; i < ScoreBoards.length; i++) {
            if (ScoreBoards[i].id == "T:" + player.nameTag.slice(0,10)) {
                for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                    BanList.push(ScoreBoards[i].getParticipants()[j].displayName.slice(1))
                    HaveData = true;
                    break;
                }
                break;
            }
        }
        if (!HaveData) {
            if (world.scoreboard.getObjective(`T:${player.nameTag.slice(0,10)}`) == null) {
                world.scoreboard.addObjective(`T:${player.nameTag.slice(0,10)}`,`T:${player.nameTag.slice(0,10)}`);
            }
        }
        const TpaSetupForm = new ModalFormData()
            .title("传送系统设置")
            if (player.hasTag("BanTpa")) {
                TpaSetupForm.toggle("禁止别人向你发送传送申请",true)
            } else {
                TpaSetupForm.toggle("禁止别人向你发送传送申请",false)
            }
            TpaSetupForm.dropdown("添加传送黑名单",playersName,0)
            TpaSetupForm.dropdown("删除传送黑名单",BanList,0)
            TpaSetupForm.show(player).then(result => {
                player.removeTag("BanTpa")
                if (result.canceled) {
                    SetupGUI.SetupMain(player)
                } else {
                    if (result.formValues[0] == 1) {
                        player.addTag("BanTpa")
                        player.sendMessage("§c 您已拒绝所有人向您发送传送申请！")
                    } else {
                        player.sendMessage("§a 您已允许其他人向您发送传送申请！")
                    }
                    if (result.formValues[1] != 0) {
                        player.sendMessage(`§c 已把玩家 ${playersName[result.formValues[1]]} 成功加入传送黑名单！`);
                        RunCmd(`scoreboard players set "@${playersName[result.formValues[1]]}" T:${player.nameTag.slice(0,10)} 0`)
                    }
                    if (result.formValues[2] != 0) {
                        player.sendMessage(`§a 已把玩家 ${playersName[result.formValues[2]]} 成功从传送黑名单移除！`);
                        RunCmd(`scoreboard players reset "@${playersName[result.formValues[2]]}" T:${player.nameTag.slice(0,10)}`);
                    }
                }
            })
    }
}

export const TpaGUI = GUI