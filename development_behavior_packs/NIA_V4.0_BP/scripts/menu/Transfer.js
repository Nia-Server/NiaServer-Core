import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import {Tell,RunCmd,GetScore} from '../customFunction.js'
import { world } from '@minecraft/server'
import { Main } from './main'


const GUI = {
    Transfer(player) {
        const TransferForm = new ActionFormData()
        .title("转账系统")
        .body("§r§l===========================" + "\n§r§e欢迎使用转账系统！\n§c所有转账请在提前告知对方的前提下转账\n否则如果因为对方下线造成转账失败后果自负\n所有转账均不可逆，请慎重考虑后使用" + "\n§r§l===========================" + "\n§r§e能源币转账单笔10000以下不收取费用\n单笔转账超出10000货币的收取百分之0.5的服务费\n能源币单笔转账最大数量为100000能源币\n氧气值转账每次将随机失去百分之5-50的氧气值\n请谨慎考虑！" + "\n§r§l===========================")
        .button("能源币转账")
        .button("氧气值转账")
        .button("返回上一级页面")
        TransferForm.show(player).then(result => {
            if (result.selection == 0) {
                this.TFmoney(player)
            } else if (result.selection == 1) {
                this.TFoxygen(player)
            } else if (result.selection == 2) {
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
            .title("能源币转账系统")
            .dropdown("请选择转账目标玩家",playersName)
            .textField("请输入转账数目","只能输入正整数！")
        TFmoney.show(player).then(result => {
            if (result.canceled) {
                this.Transfer(player)
            }
            if (result.formValues[0] == 0) {
                Tell(`§c 请选择有效的玩家对象！`,player.nameTag)
            } else {
                //开始判断数据
                if (parseInt(result.formValues[1]) <= 0 || isNaN(parseInt(Number(result.formValues[1])))) {
                    Tell(`§c 错误的转账数字格式，请重新输入！`,player.nameTag)
                } else if (parseInt(result.formValues[1]) >= GetScore("money",player.nameTag)) {
                    Tell(`§c 您输入的转账数额过大，您的余额不足，请重新输入！`,player.nameTag)
                } else {
                    RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -${parseInt(result.formValues[1])}`)
                    if (result.formValues[1] <= 10000) {
                        RunCmd(`scoreboard players add @a[name="${playersName[result.formValues[0]]}"] money ${parseInt(result.formValues[1])}`)
                        Tell(`§a 转账成功！您已经成功向玩家 §6${playersName[result.formValues[0]]} §a转账§6 ${parseInt(result.formValues[1])} §a能源币！（本次操作免手续费）`,player.nameTag)
                        Tell(`§a 您有一笔转账到账！您已收到玩家§6 ${player.nameTag} §a向您转账的§6 ${parseInt(result.formValues[1])} §a能源币！（本次操作免手续费）`,playersName[result.formValues[0]])
                    } else {
                        RunCmd(`scoreboard players add @a[name="${playersName[result.formValues[0]]}"] money ${parseInt(result.formValues[1] * 0.995)}`)
                        Tell(`§a 转账成功！您已经成功向玩家§6 ${playersName[result.formValues[0]]} §a转账§6 ${parseInt(result.formValues[1])} §a能源币！（本次操作收取§6 ${parseInt(result.formValues[1] * 0.005)} §a手续费）`,player.nameTag)
                        Tell(`§a 您有一笔转账到账！您已收到玩家§6 ${player.nameTag} §a向您转账的§6 ${parseInt(result.formValues[1])} §a能源币！（本次操作收取§6 ${parseInt(result.formValues[1] * 0.005)} §a手续费，故您实际收到§6 ${parseInt(result.formValues[1] * 0.995)} §a能源币）`,playersName[result.formValues[0]])
                    }
                }
            }
        })

    },

    TFoxygen(player) {
        let players = world.getPlayers()
        let playerList = Array.from(players);
        let playersName = ["请选择在线玩家后提交"]
        for (let i = 0; i < playerList.length; i++) {
            if (playerList[i].nameTag != player.nameTag) {
                playersName.push(playerList[i].nameTag)
            }
        }
        const TFmoney = new ModalFormData()
            .title("氧气转移系统")
            .dropdown("请选择氧气转移目标玩家",playersName)
            TFmoney.slider("请选择转账数目",1,GetScore("oxygen",player.nameTag),1,1)
        TFmoney.show(player).then(result => {
            if (result.canceled) {
                this.Transfer(player)
            }
            if (result.formValues[0] == 0) {
                Tell(`§c 请选择有效的玩家对象！`,player.nameTag)
            } else {
                RunCmd(`scoreboard players add @a[name="${player.nameTag}"] oxygen -${parseInt(result.formValues[1])}`)
                let ReciveOxygen = Math.round(result.formValues[1] * ((Math.random() * 45 + 50) / 100))
                RunCmd(`scoreboard players add @a[name="${playersName[result.formValues[0]]}"] oxygen ${ReciveOxygen}`)
                Tell(`§a 氧气转移成功！您已经成功向玩家§6 ${playersName[result.formValues[0]]} §a转移§6 ${parseInt(result.formValues[1])} §a氧气值！（本次操作损失§6 ${parseInt(result.formValues[1]) - ReciveOxygen} §a氧气值）`,player.nameTag)
                Tell(`§a 氧气转移成功！您已收到玩家§6 ${player.nameTag} §a向您转移的§6 ${parseInt(result.formValues[1])} §a氧气值！（本次操作损失§6 ${parseInt(result.formValues[1]) - ReciveOxygen} §a氧气值，故您实际收到§6 ${ReciveOxygen} §a氧气值）`,playersName[result.formValues[0]])
            }
        })

    }
}

export const TransferGUI = GUI