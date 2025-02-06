import { system, world,ItemStack,EnchantmentType } from "@minecraft/server";
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { log, warn, error } from "../API/logger.js";
import { cfg } from "../config.js";

const MoneyScoreboardName = cfg.MoneyScoreboardName;
const TimeScoreboardName = cfg.TimeScoreboardName;

const first_join_message =
    "§b========================\n" +
    "§6欢迎来到NiaServer V5 玩家内容共创版本！\n" +
    "§6在这个版本之中，我们内容更新将非常频繁\n" +
    "§6我们会根据玩家的反馈进行内容更新\n" +
    "§6如果您有任何建议或者意见，请联系腐竹\n" +
    "§6服务器菜单使用的是§c钟表菜单\n" +
    "§6使用钟表右键（PC） && 手持钟表对着空气长按（手机）\n" +
    "§6即可打开服务器菜单进行一系列便捷操作\n" +
    // "§6服务器游玩任务指引，请使用§c任务指引卷轴§6进行查看\n" +
    "§6如需更多详细关于服务器游玩指南\n" +
    "§6请前往服务器官网查看\n" +
    "§6服务器官网：§chttps://docs.mcnia.com\n" +
    "§6请遵守服务器规则，不要使用任何作弊行为！\n" +
    "§6如果有任何问题，请联系管理员！\n" +
    "§6为了表示欢迎，我们向您背包发放了一些见面礼，希望您能喜欢！\n" +
    "§b========================\n";



world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        let player = event.player;
        system.runTimeout(() => {
            if (!player) {return}
            if (player.getDynamicProperty("has_entered") == undefined) {
                player.sendMessage(first_join_message);
                world.scoreboard.getObjective(MoneyScoreboardName).addScore(player,233);
                world.scoreboard.getObjective(TimeScoreboardName).addScore(player,0);
                let clock = new ItemStack("minecraft:clock", 1);
                player.getComponent("minecraft:inventory").container.addItem(clock);
                let iron_ingot = new ItemStack("minecraft:iron_ingot", 16);
                player.getComponent("minecraft:inventory").container.addItem(iron_ingot);
                let bread = new ItemStack("minecraft:bread", 16);
                player.getComponent("minecraft:inventory").container.addItem(bread);
                let wood_sword = new ItemStack("minecraft:wooden_sword", 1);
                const sharpness = new EnchantmentType("minecraft:sharpness");
                wood_sword.getComponent("minecraft:enchantable").addEnchantments([{type: sharpness, level: 1}]);
                wood_sword.nameTag = "§a新手之剑";
                player.getComponent("minecraft:inventory").container.addItem(wood_sword);
                player.setDynamicProperty("has_entered", true);
            } else {
                player.sendMessage(" §6欢迎来到NiaServer V5 玩家内容共创版本");
            }
        },100)
        //检查玩家是否第一次进入服务器
    }
})