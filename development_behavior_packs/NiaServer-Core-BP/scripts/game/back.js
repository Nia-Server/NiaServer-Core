import { system, world ,CustomCommandRegistry ,CustomCommandParamType, CustomCommandStatus, CommandPermissionLevel  } from "@minecraft/server";
import { log } from "../API/logger.js";
import { GetScore } from "../API/game.js";
import { cfg } from "../config.js";


//注册自定义指令
system.beforeEvents.startup.subscribe((init) => {

    const backCommand = {
        name: "mcnia:back",
        description: "返回上一个死亡地点",
        permissionLevel: CommandPermissionLevel.Any
    };
    init.customCommandRegistry.registerCommand(backCommand, (origin) => {
        if (origin.sourceType != "Entity") return {
            status: CustomCommandStatus.Failure,
            message: "§c此命令只能玩家使用",
        }
        let player = origin.sourceEntity;
        system.run(() => {
            back_to_last_deaath(player);
        })
        return {
            status: CustomCommandStatus.Success
        }
    });

})


world.afterEvents.entityDie.subscribe((event) => {
    if (event.deadEntity.typeId != "minecraft:player") return;
    let player = event.deadEntity;
    let death_data = {
        "x": player.location.x,
        "y": player.location.y,
        "z": player.location.z,
        "dim": player.dimension.id
    }
    player.setDynamicProperty("death_data", JSON.stringify(death_data));
    player.sendMessage(" §e你上一次死亡坐标为: §c" +
        player.location.x.toFixed(2) + " " +
        player.location.y.toFixed(2) + " " +
        player.location.z.toFixed(2) + " " +
        "§e请在聊天栏输入 §cback §e消耗§c 50金币 §e来返回上一个死亡点"
    );
})

export function back_to_last_deaath(player) {
    let player_death_data = player.getDynamicProperty("death_data");
    if (player_death_data == undefined) {
        player.sendMessage(" §c你还没有死亡记录");
        return;
    }
    if (GetScore(cfg.MoneyScoreboardName,player.nameTag) < 50) {
        player.sendMessage(` §c你的${cfg.MoneyShowName}不足50，无法传送到上一个死亡地点`);
        return;
    }
    system.run(() =>{
        player_death_data = JSON.parse(player_death_data);
        world.scoreboard.getObjective(cfg.MoneyScoreboardName).addScore(player, -50);
        player.teleport({
            x: Number(player_death_data.x),
            y: Number(player_death_data.y),
            z: Number(player_death_data.z)
        },{
            dimension: world.getDimension(player_death_data.dim)});
        player.sendMessage(" §a已将你成功传送至上一次死亡地点: §c" +
            player_death_data.x.toFixed(2) + " " +
            player_death_data.y.toFixed(2) + " " +
            player_death_data.z.toFixed(2)
        );
    })
}
