import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import {RunCmd,GetScore} from '../customFunction.js'
import { world } from '@minecraft/server'
import { Main } from './main'
import { cfg } from '../config.js'


const GUI = {
    CheckOP(player) {
        const CheckOPForm = new ModalFormData()
        .title("管理员身份验证")
        .textField("请输入管理员面板授权码","不知道找腐竹索要！")
        CheckOPForm.show(player).then(result => {
            if (result.canceled) {
                Main(player)
            } else if (result.formValues[0] == cfg.OPMENUPassword) {
                this.OpMain(player)
            } else {
                player.sendMessage("§c>> 未经授权的访问！")
            }
        })
    },

    OpMain(player) {
        const OpMainForm = new ActionFormData()
        .title("管理员操作系统")
        .body("§r§l===========================" + "\n§eHi！ " + player.nameTag + " 欢迎使用！" + "\n§r§l===========================")
        .button("封禁玩家")
        .button("解封玩家")
        .button("添加CDK码")
        .button("管理CDK码")
        .button("调节玩家游戏数值")
        .button("调节物价指数")
        .button("§c紧急预案Ⅰ")
        .show(player).then(result => {
            switch (result.selection) {
                case 0:
                    player.sendMessage("§c>> 开发中内容，敬请期待！")
                    break;
                case 1:
                    player.sendMessage("§c>> 开发中内容，敬请期待！")
                    break;
                case 2:
                    this.AddCDKMain(player)
                    break;
                case 3:
                    this.SetCDK(player)
                    break;
                case 4:
                    player.sendMessage("§c>> 开发中内容，敬请期待！")
                    break;
                case 5:
                    player.sendMessage("§c>> 开发中内容，敬请期待！")
                    break;
                case 6:
                    player.sendMessage("§c>> 开发中内容，敬请期待！")
                    break;
            }
        })
    },

    AddCDKMain(player) {
        const AddCDKMainForm = new ActionFormData()
            .title("请选择CDK的形式")
            .body("请根据需求按照技术标准添加CDK\n请勿擅自添加CDK！\n请在仔细阅读技术规范后使用本系统！")
            .button("计分板形式")
            .button("物品形式")
            .button("返回上一层界面")
        AddCDKMainForm.show(player).then(result => {
            switch (result.selection) {
                case 0:
                    this.AddCDKSub1(player)
                    break;
                case 1:
                    this.AddCDKSub2(player)
                    break;
                case 2:
                    this.OpMain(player)
                    break;

            }
        })
    },

    AddCDKSub1(player) {
        let ScoreNames = ["money","oxygen",]
        const AddCDKSub1Form = new ModalFormData()
            .title("添加计分板形式CDK")
            .textField("请输入自定义CDK码","请勿重复、过长！")
            .dropdown("请选择要改变分数的计分板",["自定义计分板名称","能源币(money)","氧气值(oxygen)"])
            .textField("自定义计分板名称","请在上方选择自定义后填写")
            .textField("增加目标计分板的值","只能输入阿拉伯数字！")
            .textField("CDK可兑换的最大数量","只能输入阿拉伯数字！")
        AddCDKSub1Form.show(player).then(result => {
            //首先判断数据格式是否正确
            if (result.formValues[0] == "" || result.formValues[3] == "" || result.formValues[4] == "") {
                player.sendMessage("§c>> 错误的数据格式！请重新检查后再次填写！")
            } else if (result.formValues[1] == 0 && result.formValues[2] == "") {
                player.sendMessage("§c>> 错误的数据格式！请重新检查后再次填写！")
            } else {
                //判断CDK是否重复？
                let ScoreBoards = world.scoreboard.getObjectives()
                let HaveCDK = false;
                for (let i = 0; i < ScoreBoards.length; i++) {
                    if (ScoreBoards[i].id == "CDK") {
                        for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                            if (ScoreBoards[i].getParticipants()[j].displayName.slice(2,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@")) == result.formValues[0]) {
                                HaveCDK = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                if (HaveCDK) {
                    player.sendMessage("§c>> 重复的CDK！请重新检查后再次填写！")
                } else if (result.formValues[1] != 0) {
                    RunCmd(`scoreboard players set "S!${result.formValues[0]}@${ScoreNames[result.formValues[1] - 1]}#${parseInt(result.formValues[3])}" CDK ${parseInt(result.formValues[4])}`)
                    world.scoreboard.addObjective(`C:${result.formValues[0]}`,`C:${result.formValues[0]}`);
                    player.sendMessage("§a>> CDK码 " + result.formValues[0] + " 添加成功！校验值：S!" + result.formValues[0] + "@" + ScoreNames[result.formValues[1] - 1] + "#" + parseInt(result.formValues[3]) + " NUM: " + parseInt(result.formValues[4]))
                } else if (result.formValues[1] == 0) {
                    RunCmd(`scoreboard players set "S!${result.formValues[0]}@${result.formValues[2]}#${parseInt(result.formValues[3])}" CDK ${parseInt(result.formValues[4])}`)
                    world.scoreboard.addObjective(`C:${result.formValues[0]}`,`C:${result.formValues[0]}`);
                    player.sendMessage("§a>> CDK码 " + result.formValues[0] + " 添加成功！校验值：S!" + result.formValues[0] + "@" + result.formValues[2] + "#" + parseInt(result.formValues[3]) + " NUM: " + parseInt(result.formValues[4]))
                }
            }
        })
    },

    AddCDKSub2(player) {
        let ScoreNames = ["diamond","gold_ore",]
        const AddCDKSub2Form = new ModalFormData()
            .title("添加物品形式CDK")
            .textField("请输入自定义CDK码","请勿重复、过长！")
            .dropdown("请选择要赠与的物品ID",["自定义物品ID","钻石(diamond)","黄金锭(gold_ore)"])
            .textField("自定义物品ID","请在上方选择自定义后填写")
            .textField("给予数量","只能输入阿拉伯数字！","1")
            .textField("给予物品的特殊值","只能输入阿拉伯数字！","0")
            .textField("CDK可兑换的最大数量","只能输入阿拉伯数字！")
        AddCDKSub2Form.show(player).then(result => {
            //首先判断数据格式是否正确
            if (result.formValues[0] == "" || result.formValues[3] == "" || result.formValues[4] == "" || result.formValues[5] == "") {
                player.sendMessage("§c>> 错误的数据格式！请重新检查后再次填写！")
            } else if (result.formValues[1] == 0 && result.formValues[2] == "") {
                player.sendMessage("§c>> 错误的数据格式！请重新检查后再次填写！")
            } else {
                //判断CDK是否重复？
                let ScoreBoards = world.scoreboard.getObjectives()
                let HaveCDK = false;
                for (let i = 0; i < ScoreBoards.length; i++) {
                    if (ScoreBoards[i].id == "CDK") {
                        for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                            if (ScoreBoards[i].getParticipants()[j].displayName.slice(2,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@")) == result.formValues[0]) {
                                HaveCDK = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                if (HaveCDK) {
                    player.sendMessage("§c>> 重复的CDK！请重新检查后再次填写！")
                } else if (result.formValues[1] != 0) {
                    RunCmd(`scoreboard players set "I!${result.formValues[0]}@${ScoreNames[result.formValues[1] - 1]}#${parseInt(result.formValues[3])}$${parseInt(result.formValues[4])}" CDK ${parseInt(result.formValues[5])}`)
                    world.scoreboard.addObjective(`C:${result.formValues[0]}`,`C:${result.formValues[0]}`);
                    player.sendMessage("§a>> CDK码 " + result.formValues[0] + " 添加成功！校验值：I!" + result.formValues[0] + "@" + ScoreNames[result.formValues[1] - 1] + "#" + parseInt(result.formValues[3]) + "$" + parseInt(result.formValues[4]) + " NUM: " + parseInt(result.formValues[5]))
                } else if (result.formValues[1] == 0) {
                    RunCmd(`scoreboard players set "I!${result.formValues[0]}@${result.formValues[2]}#${parseInt(result.formValues[3])}$${parseInt(result.formValues[4])}" CDK ${parseInt(result.formValues[5])}`)
                    world.scoreboard.addObjective(`C:${result.formValues[0]}`,`C:${result.formValues[0]}`);
                    player.sendMessage("§a>> CDK码 " + result.formValues[0] + " 添加成功！校验值：I!" + result.formValues[0] + "@" + result.formValues[2] + "#" + parseInt(result.formValues[3]) + "$" + parseInt(result.formValues[4]) + " NUM: " + parseInt(result.formValues[5]))
                }
            }
        })
    },

    SetCDK(player) {
        const SetCDKForm = new ActionFormData()
            .title("设置CDK码")
            .body("§c服主提醒：\n请勿擅自更改CDK数据\n特别是已经发行的CDK\n防止同一CDK出现奖励不同的后果！")
            .button("§c返回上一层")
            let ScoreBoards = world.scoreboard.getObjectives()
            let i = 0
            for (i = 0; i < ScoreBoards.length; i++) {
                if (ScoreBoards[i].id == "CDK") {
                    for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                        if (ScoreBoards[i].getParticipants()[j].displayName.slice(0,1) == "S") {
                            SetCDKForm.button(`§c[计分板形式] CDK:§r§l${ScoreBoards[i].getParticipants()[j].displayName.slice(2,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@"))}\n§r§c计分板：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("@") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("#"))} §c增加数值：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("#") + 1)} §c余量：§r${GetScore("CDK",ScoreBoards[i].getParticipants()[j].displayName)}`)
                        } else if (ScoreBoards[i].getParticipants()[j].displayName.slice(0,1) == "I") {
                            SetCDKForm.button(`§c[物品形式] CDK:§r§l${ScoreBoards[i].getParticipants()[j].displayName.slice(2,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@"))}\n§r§c物品：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("@") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("#"))} §c数量：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("#") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("$"))} §c特殊值：§r${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("$") + 1)} §c余量：§r${GetScore("CDK",ScoreBoards[i].getParticipants()[j].displayName)}`)
                        }
                    }
                    break;
                }
            }
        SetCDKForm.show(player).then(result => {
            if (result.selection == 0) {
                this.OpMain(player)
            } else {
                this.SetCDKSub(player,ScoreBoards[i].getParticipants()[result.selection - 1].displayName)
            }
        })
    },

    SetCDKSub(player,CDKData) {
        let Str = "§c服主提醒：\n已创建的CDK不支持更改CDK码\n如果想要更改CDK码请删除该CDK后再次创建！\n§r§e已经兑换过本CDK的玩家ID：\n§6"
        const SetCDKSubForm = new ActionFormData()
        SetCDKSubForm.title("修改CDK-" + CDKData.slice(2,CDKData.indexOf("@")))
        let ScoreBoards = world.scoreboard.getObjectives()
        for (let i = 0; i < ScoreBoards.length; i++) {
            if (ScoreBoards[i].id == "C:" + CDKData.slice(2,CDKData.indexOf("@"))) {
                for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                    Str = Str + ScoreBoards[i].getParticipants()[j].displayName + "\n"
                }
                break;
            }
        }
        SetCDKSubForm.body(Str)
        SetCDKSubForm.button("返回上一级页面")
        SetCDKSubForm.button("编辑CDK信息")
        SetCDKSubForm.button("§c删除CDK")
        SetCDKSubForm.show(player).then(result => {
            if (result.selection == 0) {
                this.SetCDK(player);
            } else if (result.selection == 1) {
                this.ChangeCDK(player,CDKData)
            } else if (result.selection == 2) {
                this.RemoveCDK(player,CDKData)
            }
        })
    },

    ChangeCDK(player, CDKData) {
        const ChangeCDKForm = new ModalFormData()
        ChangeCDKForm.title("修改CDK-" + CDKData.slice(2,CDKData.indexOf("@")))
        if (CDKData.slice(0,1) == "S") {
            ChangeCDKForm.textField("计分板名称","请仔细检查后填写！",CDKData.slice(CDKData.indexOf("@") + 1,CDKData.indexOf("#")))
            ChangeCDKForm.textField("增加目标计分板的值","只能输入阿拉伯数字！",CDKData.slice(CDKData.indexOf("#") + 1))
            ChangeCDKForm.textField("CDK可兑换的最大数量","只能输入阿拉伯数字！",GetScore("CDK",CDKData).toString())
        } else if (CDKData.slice(0,1) == "I") {
            ChangeCDKForm.textField("物品名称（ID）","请仔细检查后填写！",CDKData.slice(CDKData.indexOf("@") + 1,CDKData.indexOf("#")))
            ChangeCDKForm.textField("物品数量","只能输入阿拉伯数字！",CDKData.slice(CDKData.indexOf("#") + 1,CDKData.indexOf("$")))
            ChangeCDKForm.textField("物品特殊值","只能输入阿拉伯数字！",CDKData.slice(CDKData.indexOf("$") + 1))
            ChangeCDKForm.textField("CDK可兑换的最大数量","只能输入阿拉伯数字！",GetScore("CDK",CDKData).toString())
        }
        ChangeCDKForm.show(player).then(result => {
            if (result.canceled) {
                this.SetCDKSub(player,CDKData)
            }
            if (CDKData.slice(0,1) == "S") {
                if (result.formValues[0] == "" || result.formValues[1] == "" || result.formValues[2] == "") {
                    player.sendMessage(`§C>> 错误的CDK数据格式！请重新检查后重新输入！`)
                } else {
                    RunCmd(`scoreboard players reset "${CDKData}" CDK`)
                    RunCmd(`scoreboard players set "S!${CDKData.slice(2,CDKData.indexOf("@"))}@${result.formValues[0]}#${parseInt(result.formValues[1])}" CDK ${parseInt(result.formValues[2])}`)
                    player.sendMessage("§a>> CDK码 " + CDKData.slice(2,CDKData.indexOf("@")) + " 修改成功！校验值：S!" + CDKData.slice(2,CDKData.indexOf("@")) + "@" + result.formValues[0] + "#" + parseInt(result.formValues[1]) + " NUM: " + parseInt(result.formValues[2]))
                }
            } else if (CDKData.slice(0,1) == "I") {
                if (result.formValues[0] == "" || result.formValues[1] == "" || result.formValues[2] == "" || result.formValues[3] == "") {
                    player.sendMessage(`§C>> 错误的CDK数据格式！请重新检查后重新输入！`)
                } else {
                    RunCmd(`scoreboard players reset "${CDKData}" CDK`)
                    RunCmd(`scoreboard players set "I!${CDKData.slice(2,CDKData.indexOf("@"))}@${result.formValues[0]}#${parseInt(result.formValues[1])}$${parseInt(result.formValues[2])}" CDK ${parseInt(result.formValues[3])}`)
                    player.sendMessage("§a>> CDK码 " + CDKData.slice(2,CDKData.indexOf("@")) + " 修改成功！校验值：I!" + CDKData.slice(2,CDKData.indexOf("@")) + "@" + result.formValues[0] + "#" + parseInt(result.formValues[1]) + "$" + parseInt(result.formValues[2]) + " NUM: " + parseInt(result.formValues[3]))
                }
            }
        })
    },

    RemoveCDK(player, CDKData) {
        const RemoveCDKForm = new MessageFormData()
        .title("§c§l删除CDK-" + CDKData.slice(2,CDKData.indexOf("@")))
        .body("§e是否§c删除§eCDK §l§6 " + CDKData.slice(2,CDKData.indexOf("@")) + " §r§e？ \n§r§e一旦删除数据将无法恢复！请谨慎操作！")
        .button1("§c§l>>删除CDK<<")
        .button2("§a返回上一级页面")
        RemoveCDKForm.show(player).then(result => {
            if (result.selection == 0) {
                this.SetCDKSub(player,CDKData)
            } else if (result.selection == 1) {
                RunCmd(`scoreboard players reset "${CDKData}" CDK`)
                RunCmd(`scoreboard objectives remove "C:${CDKData.slice(2,CDKData.indexOf("@"))}"`)
                player.sendMessage(`§a>> CDK ${CDKData.slice(2,CDKData.indexOf("@"))} 删除成功！校验值： ${CDKData} §c如果误删请将本条信息截图发给服主！`)
            }
        })

    }
}

export const OpGUI = GUI