import { world } from "@minecraft/server"
import { ActionFormData,ModalFormData,MessageFormData } from "@minecraft/server-ui"
import { log,warn,error } from "./API/logger";

const title_data = {
    "title_c_op": {
        "title": "",
        "tag": "title_c_op",
        "type": "image",
        "can_buy": true,
        "show_in_shop": true,
        "price": 0,
        "description": "服务器管理员专用称号",
        "check_mode": "and",
        "check": [
            {
                "type": "tag",
                "operator": "==",
                "value": "op"
            },
            {
                "type": "scoreboard",
                "scoreboard": "menu",
                "operator": ">=",
                "value": 100
            }
        ],
    },
    "title_c_donator": {
        "title": "",
        "tag": "title_c_donator",
        "type": "image",
        "can_buy": true,
        "show_in_shop": true,
        "price": 100,
        "description": "服务器捐赠者专用称号",
        "check_mode": "and",
        "check": [
            {
                "type": "tag",
                "operator": "==",
                "value": "donator"
            },
            {
                "type": "scoreboard",
                "scoreboard": "menu",
                "operator": ">=",
                "value": 100
            }
        ],
    },
    "title_c_default":{
        "title": "",
        "tag": "title_c_default",
        "type": "image",
        "can_buy": true,
        "show_in_shop": true,
        "price": 0,
        "description": "普通玩家称号",
        "check_mode": "and",
        "check": [
            {
                "type": "tag",
                "operator": "==",
                "value": "normal"
            },
            {
                "type": "scoreboard",
                "scoreboard": "menu",
                "operator": ">=",
                "value": 100
            }
        ],
    },
    "title_default": {
        "title": "萌新一枚",
        "tag": "title_default",
        "type": "text",
        "can_buy": true,
        "show_in_shop": true,
        "price": 0,
        "description": "普通玩家称号",
        "check_mode": "and",
        "check": [
            {
                "type": "tag",
                "operator": "==",
                "value": "normal"
            },
            {
                "type": "scoreboard",
                "scoreboard": "menu",
                "operator": "<",
                "value": 100
            }
        ],
    },


}

var title = {};
var count = 0;
for (let key in title_data) {
    let show_key = "show_" + key;
    title[show_key] = title_data[key].title;
    count++;
}
log(`【称号系统】已成功加载${count}个称号！`);


const GUI = {

}

