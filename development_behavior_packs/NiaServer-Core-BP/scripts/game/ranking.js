import { system, world } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { log } from "../API/logger.js";
import { Main } from "./main_menu.js";
import { ExternalFS } from "../API/http.js";

const fs = new ExternalFS();


const GUI = {
    Main(player) {
        const Main_Form = new ActionFormData()
        .title("排行榜")
        .body("请选择你要查看的排行榜 数据更新可能延迟")
        .button("返回上一页")
        .button("玩家在线时间排行榜")
        .button("玩家金币排行榜")
        .show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0){
                Main(player);
                return;
            }
            if (response.selection == 1){
                this.TimeRanking(player);
                return;
            }
            if (response.selection == 2){
                this.MoneyRanking(player);
                return;
            }
        })
    },

    TimeRanking(player){
        let time_ranking = [];
        fs.GetJSONFileData("player_data.json").then((response) => {
            if (response == -1) {
                player.sendMessage(" §c在与NIAHttpBOT通讯时发生错误，请及时联系管理员");
                system.runTimeout(() => {this.Main(player)}, 60);
                return;
            }
            if (response == 0) {
                player.sendMessage(" §c没有在服务器上找到相关文件，请联系管理员");
                system.runTimeout(() => {this.Main(player)}, 60);
                return;
            }
            let player_data = response;
            for (const player_qq in player_data) {
                if (!player_data[player_qq].data.hasOwnProperty("time")) {
                    continue;
                }
                time_ranking.push({
                    "player_name": player_data[player_qq].xboxid,
                    "time": player_data[player_qq].data.time
                })
            }
            //将所有玩家的在线时间从大到小排序
            time_ranking.sort((a,b) => {
                return b.time - a.time;
            })
            let time_ranking_str = "";
            //根据排序后的数据生成排行榜
            for (let i = 0; i < time_ranking.length; i++) {
                time_ranking_str += `§e${i + 1}. §a${time_ranking[i].player_name} §e在线时间: §6${time_ranking[i].time}分钟\n`;
            }
            const TimeRankingForm = new ActionFormData()
            .title("玩家在线时间排行榜")
            .body(time_ranking_str)
            .button("返回上一页")
            .show(player).then((response) => {
                if (response.canceled) return;
                this.Main(player);
            })
        })

    },

    MoneyRanking(player){
        let money_ranking = [];
        fs.GetJSONFileData("player_data.json").then((response) => {
            if (response == -1) {
                player.sendMessage(" §c在与NIAHttpBOT通讯时发生错误，请及时联系管理员");
                system.runTimeout(() => {this.Main(player)}, 60);
                return;
            }
            if (response == 0) {
                player.sendMessage(" §c没有在服务器上找到相关文件，请联系管理员");
                system.runTimeout(() => {this.Main(player)}, 60);
                return;
            }
            let player_data = response;
            for (const player_qq in player_data) {
                if (!player_data[player_qq].data.hasOwnProperty("money")) {
                    continue;
                }
                money_ranking.push({
                    "player_name": player_data[player_qq].xboxid,
                    "money": player_data[player_qq].data.money
                })
            }
            //将所有玩家的金币从大到小排序
            money_ranking.sort((a,b) => {
                return b.money - a.money;
            })
            let money_ranking_str = "";
            //根据排序后的数据生成排行榜
            for (let i = 0; i < money_ranking.length; i++) {
                money_ranking_str += `§e${i + 1}. §a${money_ranking[i].player_name} §e金币: §6${money_ranking[i].money}\n`;
            }
            const MoneyRankingForm = new ActionFormData()
            .title("玩家金币排行榜")
            .button("返回上一页")
            .body(money_ranking_str)
            .show(player).then((response) => {
                if (response.canceled) return;
                this.Main(player);
            })
        })
    }
};

export const RankingGUI = GUI;

// world.afterEvents.itemUse.subscribe(event => {
//     if (event.itemStack.typeId == "minecraft:stick") {
//         GUI.Main(event.source);
//     }
// })

