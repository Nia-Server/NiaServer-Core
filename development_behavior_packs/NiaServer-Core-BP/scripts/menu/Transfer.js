import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import {Tell,RunCmd,GetScore} from '../customFunction.js'
import { world } from '@minecraft/server'
import { Main } from './main'

import { cfg } from '../config.js'
const MoneyShowName = cfg.MoneyShowName
const MoneyScoreboardName = cfg.MoneyScoreboardName


const GUI = {
    Transfer(player) {
        const TransferForm = new ActionFormData()
        .title("转账系统")
        .body(
            "§r§l===========================\n" +
            "§r§e欢迎使用转账系统！\n" +
            "§c所有转账请在提前告知对方的前提下转账\n"+
            "否则如果因为对方下线造成转账失败后果自负\n"+
            "所有转账均不可逆，请慎重考虑后使用\n"+
            "§r§l===========================\n"+
            "§r§e转账单笔10000"+ MoneyShowName + "以下不收取费用\n"+
            "单笔转账超出10000"+ MoneyShowName + "的收取%%0.5的服务费\n"+
            "能源币单笔转账最大数量为100000"+ MoneyShowName +"\n"+
            "§r§l==========================="
        )
        .button(`${MoneyShowName}转账`)
        .button("返回上一级页面")
        TransferForm.show(player).then(result => {
            if (result.selection == 0) {
                this.TFmoney(player)
            } else if (result.selection == 1) {
                Main(player)
            }
        })
    },

    TFmoney(player) {
        let players = world.getPlayers()
        let playerList = Array.from(players);
        let playersName = ["请选择在线玩家后提交"]
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].nameTag != player.nameTag) {
                playersName.push(playerList[i].nameTag)
            }
        }
        const TFmoney = new ModalFormData()
            .title(`${MoneyShowName}转账系统`)
            .dropdown("请选择转账目标玩家",playersName)
            .textField("请输入转账数目","只能输入正整数！")
        TFmoney.show(player).then(result => {
            if (result.canceled) {
                this.Transfer(player)
            }
            //三层数据判断，等待后续接入统一的提醒栏
            if (result.formValues[0] == 0) {
                player.sendMessage(`§c 请选择有效的玩家对象！`)
                return;
            }
            if (parseInt(result.formValues[1]) <= 0 || isNaN(parseInt(Number(result.formValues[1])))) {
                player.sendMessage(`§c 错误的转账数字格式，请重新输入！`)
                return;
            }
            if (parseInt(result.formValues[1]) >= GetScore("money",player.nameTag)) {
                player.sendMessage(`§c 您输入的转账数额过大，您的余额不足，请重新输入！`)
                return;
            }
            //扣钱
            RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -${parseInt(result.formValues[1])}`)
            if (result.formValues[1] <= 10000) {
                RunCmd(`scoreboard players add @a[name="${playersName[result.formValues[0]]}"] money ${parseInt(result.formValues[1])}`)
                Tell(`§a 转账成功！您已经成功向玩家 §6${playersName[result.formValues[0]]} §a转账§6 ${parseInt(result.formValues[1])} §a${MoneyShowName}！（本次操作免手续费）`,player.nameTag)
                Tell(`§a 您有一笔转账到账！您已收到玩家§6 ${player.nameTag} §a向您转账的§6 ${parseInt(result.formValues[1])} §a${MoneyShowName}！（本次操作免手续费）`,playersName[result.formValues[0]])
            } else {
                RunCmd(`scoreboard players add @a[name="${playersName[result.formValues[0]]}"] money ${parseInt(result.formValues[1] * 0.995)}`)
                Tell(`§a 转账成功！您已经成功向玩家§6 ${playersName[result.formValues[0]]} §a转账§6 ${parseInt(result.formValues[1])} §a${MoneyShowName}！（本次操作收取§6 ${parseInt(result.formValues[1] * 0.005)} §a手续费）`,player.nameTag)
                Tell(`§a 您有一笔转账到账！您已收到玩家§6 ${player.nameTag} §a向您转账的§6 ${parseInt(result.formValues[1])} §a${MoneyShowName}！（本次操作收取§6 ${parseInt(result.formValues[1] * 0.005)} §a手续费，故您实际收到§6 ${parseInt(result.formValues[1] * 0.995)} §a${MoneyShowName}）`,playersName[result.formValues[0]])
            }
        })

    }
}

export const TransferGUI = GUI