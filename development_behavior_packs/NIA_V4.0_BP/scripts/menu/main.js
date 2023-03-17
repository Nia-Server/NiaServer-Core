import { world } from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import { Broadcast,Tell,log,RunCmd,GetScore } from '../customFunction.js';
import { cfg } from '../config.js'

const MainGUI = {
    "title": "%playername% *money*",
    "body": "*money*-*time*-*money*-*time*",
    "buttons": [
        {
            "name": "立即回城",
            "icon": "textures/blocks/chest_front",
            "type": "runCmd",
            "content": ""
        },
        {
            "name": "返回主岛",
            "icon": "textures/ui/backup_replace",
            "type": "runCmd",
            "content": ""
        },
        {
            "name": "个人传送点",
            "icon": "textures/ui/icon_new",
            "type": "runCmd",
            "content": "say %playername%"
        }
    ]
}

function Main(player) {
    let title = MainGUI.title.replace("%playername%",player.nameTag)
    let body = MainGUI.body.replace("%playername%",player.nameTag)
    let bodyarr = title.split("*"); //将字符串按照%分割成一个数组
    for (let i = 1; i < bodyarr.length; i += 2) { //从第二个元素开始，每隔一个元素取一个
        let a = bodyarr[i]; //将元素赋值给变量a
        body.replace(`*${a}*`,GetScore(a,player.nameTag))
    }
    const MainForm = new ActionFormData()
        .title(title)
        .body(body)
        .button("tyest")
    MainForm.show(player)
}



//对于钟表使用的检测
world.events.beforeItemUse.subscribe(event => {
    Broadcast("1")
    Tell(`§c>> ${event.item.typeId} ${event.source.nameTag}`,`NIANIANKNIA`)
    if (event.item.typeId == "minecraft:stick") {
        // Tell(`§c>> 你使用钟表!`,event.source.nameTag);
        let player = event.source;
        //调用服务器主菜单
        Broadcast("12")
        Main(player)
        Broadcast("123")
    }
})
