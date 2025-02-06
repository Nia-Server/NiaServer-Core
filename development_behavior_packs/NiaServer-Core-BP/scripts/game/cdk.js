import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { RunCmd,GetScore } from '../API/game.js'
import { world } from '@minecraft/server'
import { Main } from './main_menu.js'

//将在未来基于HTTP-BOT重构
export function CDKGUI(player) {
    const CDKForm = new ModalFormData()
    .title("兑换码系统")
    .dropdown("请选择CDK码类型",["计分板形式","物品形式"])
    .textField("请输入CDK码","CDK码输入时请注意大小写！")
    CDKForm.show(player).then(result => {
        let CDK = result.formValues[1]
        if (result.canceled) {
            Main(player)
        } else {
            let HaveCDK = false;
            let CDKD = false;
            if (CDK == "") {
                player.sendMessage(`§c CDK码为空兑换失败`)
            } else if (result.formValues[0] == 0) {
                let ScoreBoards = world.scoreboard.getObjectives()
                for (let k = 0; k < ScoreBoards.length; k++) {
                    if (ScoreBoards[k].id == "C:" + CDK) {
                        for (let l = 0; l < ScoreBoards[k].getParticipants().length; l++) {
                            if (ScoreBoards[k].getParticipants()[l].displayName == player.nameTag) {
                                CDKD = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                for (let i = 0; i < ScoreBoards.length; i++) {
                    if (ScoreBoards[i].id == "CDK") {
                        for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                            if (!CDKD && ScoreBoards[i].getParticipants()[j].displayName.slice(0,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@")) == "S!" + CDK) {
                                RunCmd(`scoreboard players add @a[name="${player.nameTag}"] ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("@") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("#"))} ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("#") + 1)}`)
                                RunCmd(`scoreboard players add "${ScoreBoards[i].getParticipants()[j].displayName}" CDK -1`)
                                RunCmd(`scoreboard players set "${player.nameTag}" "C:${CDK}" 0`)
                                player.sendMessage("§a 兑换成功！")
                                HaveCDK = true
                                if (GetScore("CDK",ScoreBoards[i].getParticipants()[j].displayName) == 1) {
                                    RunCmd(`scoreboard players reset "${ScoreBoards[i].getParticipants()[j].displayName}" CDK`)
                                    RunCmd(`scoreboard objectives remove "C:${CDK}"`)
                                }
                                break;
                            } else if (CDKD) {
                                player.sendMessage("§c 您已兑换过此CDK!")
                                break;
                            }
                        }
                        break;
                    }
                }
            } else if (result.formValues[0] == 1) {
                let ScoreBoards = world.scoreboard.getObjectives()
                for (let k = 0; k < ScoreBoards.length; k++) {
                    if (ScoreBoards[k].id == "C:" + CDK) {
                        for (let l = 0; l < ScoreBoards[k].getParticipants().length; l++) {
                            if (ScoreBoards[k].getParticipants()[l].displayName == player.nameTag) {
                                CDKD = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                for (let i = 0; i < ScoreBoards.length; i++) {
                    if (ScoreBoards[i].id == "CDK") {
                        for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                            if (!CDKD && ScoreBoards[i].getParticipants()[j].displayName.slice(0,ScoreBoards[i].getParticipants()[j].displayName.indexOf("@")) == "I!" + CDK) {
                                RunCmd(`give @a[name="${player.nameTag}"] ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("@") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("#"))} ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("#") + 1,ScoreBoards[i].getParticipants()[j].displayName.indexOf("$"))} ${ScoreBoards[i].getParticipants()[j].displayName.slice(ScoreBoards[i].getParticipants()[j].displayName.indexOf("$") + 1)}`)
                                RunCmd(`scoreboard players add "${ScoreBoards[i].getParticipants()[j].displayName}" CDK -1`)
                                RunCmd(`scoreboard players set "${player.nameTag}" "C:${CDK}" 0`)
                                player.sendMessage("§a 兑换成功！")
                                HaveCDK = true
                                if (GetScore("CDK",ScoreBoards[i].getParticipants()[j].displayName) == 1) {
                                    RunCmd(`scoreboard players reset "${ScoreBoards[i].getParticipants()[j].displayName}" CDK`)
                                    RunCmd(`scoreboard objectives remove "C:${CDK}"`)
                                }
                                break;
                            } else if (CDKD) {
                                player.sendMessage("§c 您已兑换过此CDK!")
                                break;
                            }
                        }
                        break;
                    }
                }
            }
            if (!HaveCDK && !CDKD) {
                player.sendMessage(`§c 无效的CDK兑换码，可能是输错、兑换码类型选择错误、兑换数量达到上限！您可以重新检查后再次尝试！具体情况请联系腐竹！`)
            }
        }
    })
}