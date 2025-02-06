import { world, system } from "@minecraft/server";
import { log,warn,error } from "../API/logger.js";

let player_hit_entity = {};

//玩家攻击监听
world.afterEvents.entityHitEntity.subscribe((event) => {
    if (event.damagingEntity.typeId == "minecraft:player") {
        //获取当前时间戳
        let time = new Date().getTime();
        //如果player_hit_entity对象中不存在当前攻击者的信息，则直接存入player_hit_entity对象
        if (!player_hit_entity[event.damagingEntity.nameTag]) {
            player_hit_entity[event.damagingEntity.nameTag] = {
                time: time,
                hitEntity: event.hitEntity,
                num: 0
            };
            return;
        } else {
            //如果player_hit_entity对象中存在当前攻击者的信息，则判断当前时间戳与上一次攻击时间戳的差值是否小于50ms
            if (time - player_hit_entity[event.damagingEntity.nameTag].time < 60) {
                //如果相同，则判定为疑似作弊行为
                log(`【反作弊系统】 ${event.damagingEntity.nameTag} 疑似作弊，作弊行为：连续点击！`);
                //发送警告信息
                event.damagingEntity.sendMessage("§c 检测到您的操作异常，请不要继续使用连点器！");
                player_hit_entity[event.damagingEntity.nameTag] = {
                    time: time,
                    hitEntity: event.hitEntity,
                    num: player_hit_entity[event.damagingEntity.nameTag].num + 1
                };
                //如果连续点击次数大于3次，则直接封禁玩家
                if (player_hit_entity[event.damagingEntity.nameTag].num >= 3) {
                    //次数归零
                    player_hit_entity[event.damagingEntity.nameTag].num = 0;
                    //踢出玩家
                    world.getDimension("overworld").runCommandAsync(`kick ${event.damagingEntity.nameTag} §c请规范您的游戏行为，请不要再次使用连点器进行游戏！\n如果您认为这个封禁是一个误封，请联系管理员申诉！`);
                    return;
                }
                return;
            }
            player_hit_entity[event.damagingEntity.nameTag] = {
                time: time,
                hitEntity: event.hitEntity,
                num: player_hit_entity[event.damagingEntity.nameTag].num
            };

        }

    }
});

//玩家异常移动

//飞行检测

system.runInterval(() => {
    //坐标显示
    for (const player of world.getPlayers()) {
        let velocity = Math.sqrt(player.getVelocity().x * player.getVelocity().x + player.getVelocity().y * player.getVelocity().y + player.getVelocity().z * player.getVelocity().z);
        player.onScreenDisplay.setActionBar(`pos: ${player.location.x.toFixed(2)} ,${player.location.y.toFixed(2)} ,${player.location.z.toFixed(2)}\nvelocity: ${player.getVelocity().x.toFixed(2)} ,${player.getVelocity().y.toFixed(2)} ,${player.getVelocity().z.toFixed(2)}\n${velocity.toFixed(2)}`);
        if (velocity > 0.5 && (player.getVelocity().y == 0 || player.getVelocity().y.toFixed(2) == 0.38 || player.getVelocity().y.toFixed(2) == -0.55)) {
            //判断脚底是否为空气
            let player_below_block = player.dimension.getBlock({x: player.location.x, y: player.location.y - 1, z: player.location.z});
            if (player_below_block.typeId == "minecraft:air") {
                //判断玩家是否在飞行
                log(`【反作弊系统】 ${player.nameTag} 疑似作弊，作弊行为：飞行！`);
                player.sendMessage("§c 检测到您的操作异常，请不要继续使用飞行作弊！");
                //踢出玩家
                world.getDimension("overworld").runCommandAsync(`kick ${player.nameTag} §c请规范您的游戏行为，请不要再次使用飞行作弊进行游戏！\n如果您认为这个封禁是一个误封，请联系管理员申诉！`);
            }
        }
        //记录玩家
    }


})



//范围挖矿检测

