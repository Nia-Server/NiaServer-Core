import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import { RunCmd,GetScore} from '../customFunction.js'
import { world } from '@minecraft/server'
import { Main } from './main'

import '../API/cipher_system.js'

export function FlyGUI(player) {
    if (player.hasTag("CanFly")) {
        const FlyForm = new ActionFormData()
        .title("飞行系统")
        .body("§r§l===========================" + "§r\n§e欢迎使用飞行系统!\n您已经是授权玩家，请自行遵守飞行系统准则！否则会被永远取消飞行系统使用资格！\n飞行系统在使用期间氧气消耗为原有消耗速度的15倍，请注意氧气消耗" + "\n§r§l===========================")
        .button("开启飞行模式")
        .button("关闭飞行模式")
        .button("返回上一级菜单")
        FlyForm.show(player).then(result => {
            switch (result.selection) {
                case 0:
                    player.addTag("fly")
                    RunCmd(`ability "${player.nameTag}" mayfly true`)
                    RunCmd(`title "${player.nameTag}" title §a飞行模式 开启`)
                    RunCmd(`title "${player.nameTag}" subtitle §7注意氧气值消耗哦！ 退出服务器记得关闭哦`)
                    break
                case 1:
                    player.removeTag("fly")
                    RunCmd(`title "${player.nameTag}" title §c飞行模式 关闭`)
                    RunCmd(`title "${player.nameTag}" subtitle §7今天有好好遵守使用规则嘛？`)
                    player.kill()
                    RunCmd(`ability @a[name="${player.nameTag}",m=!c] mayfly false`)
                    break
                case 2:
                    Main(player)
                    break
            }
        })
    } else {
        RunCmd(`scoreboard players add @a UUID 0`)
        if (GetScore("equLevel",player.nameTag) >= 13 && GetScore("UUID",player.nameTag) == 0) {
            const FlyForm = new ActionFormData()
            .title("申请使用飞行系统")
            .body("§r§l===========================" + "§r\n§e欢迎使用飞行系统!\n您暂时不是授权玩家，无法使用飞行系统\n您可以尝试使用5000能源币购买使用资格后申请使用飞行系统\n§c§l但值得注意的是，在您购买使用资格后我们运营团队会对申请玩家进行申请人工复核，如果您原来在服务器有不利的记录，您仍有概率无法获得飞行系统使用资格，即使审核不通过，服务器也不会退掉您购买的使用资格费用，介意者请不要购买！\n§r§e请在购买后将UUID发给服主获取对应的激活码！" + "\n§r§l===========================")
            .button("购买使用资格")
            .button("返回上一层")
            .show(player).then(result => {
                if (result.selection == 0) {
                    if (GetScore("money",player.nameTag) >= 5000) {
                        RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -5000`)
                        RunCmd(`scoreboard players add @a UUID 0`)
                        let Participants = world.scoreboard.getObjective("UUID").getParticipants();
                        let UUID = 0
                        for (let i = 0; i < Participants.length; i++) {
                            if (Participants[i].displayName == player.nameTag) {
                                UUID = world.scoreboard.getObjective("UUID").getScore(Participants[i]);
                                if (UUID == 0) {
                                    UUID = 100000 + Math.floor(Math.random() * 100000);
                                    RunCmd(`scoreboard players set @a[name=${player.nameTag}] UUID ${UUID}`);
                                    player.sendMessage(`§c>> 您第一次获取UUID，已经为您获取的UUID为：§a${UUID}§c，请发给腐竹获取飞行系统激活码！`);
                                } else {
                                    player.sendMessage(`§c>> 您的UUID为：§a${UUID}§c，请发给腐竹获取飞行系统验证码！`);
                                }
                                break;
                            }
                        }
                    } else {
                        player.sendMessage(`§c>> 余额不足，请尝试攒够5000能源币后再次尝试购买！`)
                    }
                } else if (result.selection == 1) {
                    this.Main(player)
                }
            })
        } else if (GetScore("equLevel",player.nameTag) >= 13 && GetScore("UUID",player.nameTag) != 0) {
            let UUID = GetScore("UUID",player.nameTag)
            const FlyForm = new ModalFormData()
            .title("§c§l您的UUID为 " + UUID)
            .textField("请输入飞行系统激活码","请不要尝试破解（")
            .show(player).then(result => {
                let password = result.formValues[0];
                if(password != adler32(UUID)) 
                    player.sendMessage(`§c>> 您输入的激活码不正确，请再次重试！如果您还未获得激活码，请将您的UUID§a${UUID}§c发给腐竹获取飞行系统激活码！`),
                    FlyGUI(player);
                else player.sendMessage(`§a>> 验证码正确！您已获得相关权限！`), RunCmd(`tag "${player.nameTag}" add CanFly`);
            })
        } else {
            const FlyForm = new ActionFormData()
            .title("申请使用飞行系统")
            .body("§r§l===========================" + "§r\n§c欢迎使用飞行系统!\n您暂时不是授权玩家，无法使用飞行系统\n飞行系统仅支持X级呼吸装备Ⅴ以上的玩家使用,您暂时无法申请使用飞行系统！\n请在尝试升级到足够等级的呼吸装备后尝试申请！" + "\n§r§l===========================")
            .button("返回上一层界面")
            .show(player).then(result => {
                if (result.selection == 0) {
                    Main(player)
                }
            })
        }
    }
}