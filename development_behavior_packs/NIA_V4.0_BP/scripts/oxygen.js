import {world} from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import {Tell,RunCmd,GetScore} from './customFunction.js'
import {ShopGUI} from './shop.js'

//呼吸装备等级
const equLevelData = {
    "0": {
        "name": "初级呼吸装备Ⅰ",
        "max": 5000,
        "consume": 20,
        "price": 0
    },
    "1": {
        "name": "初级呼吸装备Ⅱ",
        "max": 5300,
        "consume": 19,
        "price": 100
    },
    "2": {
        "name": "初级呼吸装备Ⅲ",
        "max": 5500,
        "consume": 18,
        "price": 300
    },
    "3": {
        "name": "中级呼吸装备Ⅰ",
        "max": 5800,
        "consume": 18,
        "price": 500
    },
    "4": {
        "name": "中级呼吸装备Ⅱ",
        "max": 6000,
        "consume": 17,
        "price": 1000
    },
    "5": {
        "name": "中级呼吸装备Ⅲ",
        "max": 6000,
        "consume": 16,
        "price": 1200
    },
    "6": {
        "name": "高级呼吸装备Ⅰ",
        "max": 6300,
        "consume": 16,
        "price": 1500
    },
    "7": {
        "name": "高级呼吸装备Ⅱ",
        "max": 6500,
        "consume": 15,
        "price": 2000
    },
    "8": {
        "name": "高级呼吸装备Ⅲ",
        "max": 6500,
        "consume": 14,
        "price": 2500
    },
    "9": {
        "name": "X级呼吸装备Ⅰ",
        "max": 7000,
        "consume": 13,
        "price": 5000
    },
    "10": {
        "name": "X级呼吸装备Ⅱ",
        "max": 8000,
        "consume": 13,
        "price": 8000
    },
    "11": {
        "name": "X级呼吸装备Ⅲ",
        "max": 9000,
        "consume": 12,
        "price": 10000
    },
    "12": {
        "name": "X级呼吸装备Ⅳ",
        "max": 10000,
        "consume": 11,
        "price": 10000
    },
    "13": {
        "name": "X级呼吸装备Ⅴ",
        "max": 15000,
        "consume": 10,
        "price": 15000
    },
    "14": {
        "name": "S级呼吸装备Ⅰ",
        "max": 15000,
        "consume": 5,
        "price": 20000
    },
    "15": {
        "name": "S级呼吸装备Ⅱ",
        "max": 15000,
        "consume": 3,
        "price": 30000
    },
    "16": {
        "name": "S级呼吸装备Ⅲ",
        "max": 15000,
        "consume": 2,
        "price": 40000
    },
    "17": {
        "name": "V级呼吸装备",
        "max": 15000,
        "consume": 1,
        "price": 50000
    }
}

const GUI = {
    OxygenMain(player) {
        const OxygenMainForm = new ActionFormData()
        .title("氧气装备商店")
        .body("§l===========================\n§r§e欢迎光临服务器官方氧气&呼吸装备商店！" + "\n§r§e当前氧气参考价： §6§l1能源币 = 10氧气值\n§r§l===========================" + "\n§r§e您的能源币余额为： §6§l" + GetScore("money",player.nameTag) + "\n§r§e您当前氧气值剩余为： §6§l" + GetScore("oxygen",player.nameTag) + "\n§r§e您当前呼吸装备的等级： §l§6" + equLevelData[GetScore("equLevel",player.nameTag)].name + "\n§r§e您当前呼吸装备的最大氧气值： §l§6" + equLevelData[GetScore("equLevel",player.nameTag)].max + "\n§r§e您当前每分钟消耗的氧气值为： §l§6" + equLevelData[GetScore("equLevel",player.nameTag)].consume + "\n§r§l===========================")
        .button("§c返回上一级")
        .button("购买氧气")
        .button("升级呼吸装备")
        .button("购买氧气制造机")
        OxygenMainForm.show(player).then(result => {
            switch (result.selection) {
                case 0:
                    ShopGUI.ShopMain(player)
                    break;
                case 1:
                    this.OxygenBuy(player)
                    break;
                case 2:
                    this.OxygenEqu(player)
                    break;
                case 3:
                    Tell(`§7>> 开发中内容，敬请期待！`)
                    break;
            }
        })
    },

    OxygenBuy(player) {
        const OxygenBuyForm = new ModalFormData()
            .title("§c§l购买氧气")
            .slider("请选择你购买的氧气",0,equLevelData[GetScore("equLevel",player.nameTag)].max - GetScore("oxygen",player.nameTag),10,10)
        OxygenBuyForm.show(player).then(result => {
            this.OxygenBuySub(player,result.formValues[0])
        })
    },

    OxygenBuySub(player,num) {
        const OxygenBuySubForm = new MessageFormData()
            .title("§c§l确认购买氧气")
            .body("§e您确定要以 §l" + parseInt(num / 10) + " §r§e能源币购买 §l" + num + " §r§e氧气值？")
            .button1("§c取消")
            .button2("§a确定")
            OxygenBuySubForm.show(player).then(result => {
                switch (result.selection) {
                    case 0:
                        //首先判断
                        if (parseInt(num / 10) <= GetScore("money",player.nameTag)) {
                            RunCmd(`scoreboard players add @a[name="${player.nameTag}"] oxygen ${num}`)
                            RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -${parseInt(num / 10)}`)
                            Tell(`§a>> 您使用 §l${parseInt(num / 10)} §r§a能源币，成功购买 §l${num} §r§a氧气值！`,player.nameTag)
                        } else {
                            Tell(`§c>> 购买失败！余额不足，您的余额为 ${GetScore("money",player.nameTag)} 能源币，而本次购买需要 ${parseInt(num / 10)} 能源币，您还缺少 ${parseInt(num / 10) - GetScore("money",player.nameTag)} 能源币，请在攒够足够货币后尝试再次购买！`,player.nameTag)
                        }
                        break;
                    case 1:
                        Tell(`§c>> 购买失败！原因是您取消了本次购买！`,player.nameTag)
                        break;
                }
            })

    },

    OxygenEqu(player){
        const OxygenEquForm = new ActionFormData()
            .title("升级呼吸装备")
            if (GetScore("equLevel",player.nameTag) == 17) {
                OxygenEquForm.body("§r§l===========================" + "\n§c您当前的呼吸装备已升到当前版本的最高级！" + "\n§r§l===========================")
                OxygenEquForm.button("§c返回上一级菜单")
            } else {
                OxygenEquForm.body("§r§l===========================" + "\n§r§e您的能源币余额为： §6§l" + GetScore("money",player.nameTag) + "\n§r§e您当前呼吸装备的等级： §l§6" + equLevelData[GetScore("equLevel",player.nameTag)].name + "\n§r§e您当前呼吸装备的最大氧气值： §l§6" + equLevelData[GetScore("equLevel",player.nameTag)].max + "\n§r§e您当前每分钟消耗的氧气值为： §l§6" + equLevelData[GetScore("equLevel",player.nameTag)].consume + "\n§r§l===========================" + "\n§r§e下一级升级所消耗的能源币： §l§6" + equLevelData[GetScore("equLevel",player.nameTag) + 1].price + "\n§r§e下一级呼吸装备的等级： §l§6" + equLevelData[GetScore("equLevel",player.nameTag) + 1].name + "\n§r§e下一级呼吸装备的最大氧气值： §l§6" + equLevelData[GetScore("equLevel",player.nameTag) + 1].max + "\n§r§e下一级每分钟消耗的氧气值为： §l§6" + equLevelData[GetScore("equLevel",player.nameTag) + 1].consume + "\n§r§l===========================")
                OxygenEquForm.button("§c返回上一级菜单")
                OxygenEquForm.button("§a升级至下一级呼吸装备")
            }
            OxygenEquForm.show(player).then(result => {
                if (result.selection == 0) {
                    this.OxygenMain(player)
                } else if (result.selection == 1) {
                    if (equLevelData[GetScore("equLevel",player.nameTag) + 1].price <= GetScore("money",player.nameTag)) {
                        RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -${equLevelData[GetScore("equLevel",player.nameTag) + 1].price}`)
                        Tell("§a>> 升级成功！您当前的氧气装备已经升级为 " + equLevelData[GetScore("equLevel",player.nameTag) + 1].name,player.nameTag)
                        RunCmd(`scoreboard players add @a[name="${player.nameTag}"] equLevel 1`)
                        this.OxygenEqu(player)
                    } else {
                        Tell("§c>> 升级失败！原因是余额不足！",player.nameTag)
                        this.OxygenEqu(player)
                    }
                }
            })
    }
}
export const OxygenGUI = GUI