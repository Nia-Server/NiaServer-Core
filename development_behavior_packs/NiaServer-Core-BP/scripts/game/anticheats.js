import { world, system, PlaceJigsawError } from "@minecraft/server";
import { log,warn,error } from "../API/logger.js";
import { log_API } from "../basic/event_log.js";

let player_hit_entity = {};

//玩家攻击监听
// world.afterEvents.entityHitEntity.subscribe((event) => {
//     if (event.damagingEntity.typeId == "minecraft:player") {
//         //获取当前时间戳
//         let time = new Date().getTime();
//         //如果player_hit_entity对象中不存在当前攻击者的信息，则直接存入player_hit_entity对象
//         if (!player_hit_entity[event.damagingEntity.nameTag]) {
//             player_hit_entity[event.damagingEntity.nameTag] = {
//                 time: time,
//                 hitEntity: event.hitEntity,
//                 num: 0
//             };
//             return;
//         } else {
//             //如果player_hit_entity对象中存在当前攻击者的信息，则判断当前时间戳与上一次攻击时间戳的差值是否小于50ms
//             if (time - player_hit_entity[event.damagingEntity.nameTag].time < 60) {
//                 //如果相同，则判定为疑似作弊行为
//                 log(`【反作弊系统】 ${event.damagingEntity.nameTag} 疑似作弊，作弊行为：连续点击！`);
//                 //发送警告信息
//                 event.damagingEntity.sendMessage("§c 检测到您的操作异常，请不要继续使用连点器！");
//                 player_hit_entity[event.damagingEntity.nameTag] = {
//                     time: time,
//                     hitEntity: event.hitEntity,
//                     num: player_hit_entity[event.damagingEntity.nameTag].num + 1
//                 };
//                 //如果连续点击次数大于3次，则直接封禁玩家
//                 if (player_hit_entity[event.damagingEntity.nameTag].num >= 3) {
//                     //次数归零
//                     player_hit_entity[event.damagingEntity.nameTag].num = 0;
//                     //踢出玩家
//                     world.getDimension("overworld").runCommandAsync(`kick ${event.damagingEntity.nameTag} §c请规范您的游戏行为，请不要再次使用连点器进行游戏！\n如果您认为这个封禁是一个误封，请联系管理员申诉！`);
//                     return;
//                 }
//                 return;
//             }
//             player_hit_entity[event.damagingEntity.nameTag] = {
//                 time: time,
//                 hitEntity: event.hitEntity,
//                 num: player_hit_entity[event.damagingEntity.nameTag].num
//             };

//         }

//     }
// });

// //玩家异常移动

// //飞行检测

// system.runInterval(() => {
//     //坐标显示
//     for (const player of world.getPlayers()) {
//         let velocity = Math.sqrt(player.getVelocity().x * player.getVelocity().x + player.getVelocity().y * player.getVelocity().y + player.getVelocity().z * player.getVelocity().z);
//         player.onScreenDisplay.setActionBar(`pos: ${player.location.x.toFixed(2)} ,${player.location.y.toFixed(2)} ,${player.location.z.toFixed(2)}\nvelocity: ${player.getVelocity().x.toFixed(2)} ,${player.getVelocity().y.toFixed(2)} ,${player.getVelocity().z.toFixed(2)}\n${velocity.toFixed(2)}`);
//         if (velocity > 0.5 && (player.getVelocity().y == 0 || player.getVelocity().y.toFixed(2) == 0.38 || player.getVelocity().y.toFixed(2) == -0.55)) {
//             //判断脚底是否为空气
//             let player_below_block = player.dimension.getBlock({x: player.location.x, y: player.location.y - 1, z: player.location.z});
//             if (player_below_block.typeId == "minecraft:air") {
//                 //判断玩家是否在飞行
//                 log(`【反作弊系统】 ${player.nameTag} 疑似作弊，作弊行为：飞行！`);
//                 player.sendMessage("§c 检测到您的操作异常，请不要继续使用飞行作弊！");
//                 //踢出玩家
//                 world.getDimension("overworld").runCommandAsync(`kick ${player.nameTag} §c请规范您的游戏行为，请不要再次使用飞行作弊进行游戏！\n如果您认为这个封禁是一个误封，请联系管理员申诉！`);
//             }
//         }
//         //记录玩家
//     }
// })


world.afterEvents.playerPlaceBlock.subscribe((event) => {
    let block = event.block;
    let player = event.player;
    if (player.hasTag("op")) return;
    if (block.typeId == "minecraft:hopper" && block.above().typeId == ("minecraft:chest" || "minecraft:trapped_chest")) {
        let chest = block.above;
        let hopper_pos = block.location;
        if (Math.abs(hopper_pos.x) % 16 == 0 ||
            Math.abs(hopper_pos.z) % 16 == 0 ||
            Math.abs(hopper_pos.x) % 16 == 1 ||
            Math.abs(hopper_pos.z) % 16 == 1 ||
            Math.abs(hopper_pos.x) % 16 == 15 ||
            Math.abs(hopper_pos.z) % 16 == 15) {
                player.sendMessage("§c 为了服务器公平运行，您无法在这里放置漏斗，如有任何疑问，请联系在线管理！");
                log_API.WriteToLog(
                    block.dimension.id,
                    player.nameTag,
                    player.location.x,
                    player.location.y,
                    player.location.z,
                    "疑似刷物品",
                    block.typeId,
                    block.location.x,
                    block.location.y,
                    block.location.z,
                    ""
                )
                world.getDimension(block.dimension.id).runCommand("tell @a[tag=op] "+player.nameTag+" 可能尝试刷物品，请及时处理");
                world.getDimension(block.dimension.id).runCommand("setblock "+hopper_pos.x+" "+hopper_pos.y+" "+hopper_pos.z+" air destroy");
            }
    }
    if (block.typeId == ("minecraft:chest" || "minecraft:trapped_chest") && block.below().typeId == "minecraft:hopper") {
        let chest = block;
        if (Math.abs(chest.location.x) % 16 == 0 ||
            Math.abs(chest.location.z) % 16 == 0 ||
            Math.abs(chest.location.x) % 16 == 1 ||
            Math.abs(chest.location.z) % 16 == 1 ||
            Math.abs(chest.location.x) % 16 == 15 ||
            Math.abs(chest.location.z) % 16 == 15) {
                player.sendMessage("§c 为了服务器公平运行，您无法在这里放置箱子，如有任何疑问，请联系在线管理！");
                log_API.WriteToLog(
                    block.dimension.id,
                    player.nameTag,
                    player.location.x,
                    player.location.y,
                    player.location.z,
                    "疑似刷物品",
                    block.typeId,
                    block.location.x,
                    block.location.y,
                    block.location.z,
                    ""
                )
                world.getDimension(block.dimension.id).runCommand("tell @a[tag=op] "+player.nameTag+" 可能尝试刷物品，请及时处理");
                world.getDimension(block.dimension.id).runCommand("setblock "+chest.location.x+" "+chest.location.y+" "+chest.location.z+" air destroy");
            }
    }
})

world.beforeEvents.itemUseOn.subscribe((event) => {
    if (!event.source.hasTag("ban_redstone")) return;
    const items = [
        //按钮
        "minecraft:acacia_button",
        "minecraft:bamboo_button",
        "minecraft:birch_button",
        "minecraft:cherry_button",
        "minecraft:crimson_button",
        "minecraft:dark_oak_button",
        "minecraft:jungle_button",
        "minecraft:mangrove_button",
        "minecraft:wooden_button",
        "minecraft:pale_oak_button",
        "minecraft:polished_blackstone_button",
        "minecraft:spruce_button",
        "minecraft:stone_button",
        "minecraft:warped_button",
        //压力板
        "minecraft:acacia_pressure_plate",
        "minecraft:bamboo_pressure_plate",
        "minecraft:birch_pressure_plate",
        "minecraft:cherry_pressure_plate",
        "minecraft:crimson_pressure_plate",
        "minecraft:dark_oak_pressure_plate",
        "minecraft:heavy_weighted_pressure_plate",
        "minecraft:jungle_pressure_plate",
        "minecraft:light_weighted_pressure_plate",
        "minecraft:mangrove_pressure_plate",
        "minecraft:oak_pressure_plate",
        "minecraft:pale_oak_pressure_plate",
        "minecraft:polished_blackstone_pressure_plate",
        "minecraft:spruce_pressure_plate",
        "minecraft:stone_pressure_plate",
        "minecraft:warped_pressure_plate",
        //熔炉
        "minecraft:furnace",
        //高炉
        "minecraft:blast_furnace",
        //烟熏炉
        "minecraft:smoker",
        //音符盒
        "minecraft:noteblock",
        //讲台
        "minecraft:lectern",
        //炼药锅
        "minecraft:cauldron",
        //堆肥桶
        "minecraft:composter",
        //合成器
        "minecraft:crafter",
        //织布机
        "minecraft:loom",
        //漏斗
        "minecraft:hopper",
        //发射器
        "minecraft:dispenser",
        //投掷器
        "minecraft:dropper",
        //拉杆
        "minecraft:lever",
        //红石比较器
        "minecraft:unpowered_comparator",
        //红石中继器
        "minecraft:unpowered_repeater",
        //阳光探测器
        "minecraft:daylight_detector_inverted",
        "minecraft:daylight_detector",
        //活塞
        "minecraft:piston",
        //粘性活塞
        "minecraft:sticky_piston",
        //粘液块
        "minecraft:slime_block",
        //蜂蜜
        "minecraft:honey_block",
        //漏斗矿车
        "minecraft:hopper_minecart",
        //红石火把
        "minecraft:redstone_torch",
        //红石灯
        "minecraft:redstone_lamp",
        //红石块
        "minecraft:redstone_block",
        //红石线
        "minecraft:redstone",
        //标靶
        "minecraft:target",
        //TNT
        "minecraft:tnt",
        //铁轨
        "minecraft:rail",
        //动力铁轨
        "minecraft:powered_rail",
        //探测铁轨
        "minecraft:detector_rail",
        //凋零
        "minecraft:wither_skeleton_skull",
        //侦测器
        "minecraft:observer",
        //陷阱箱
        "minecraft:trapped_chest",
        //拌线勾
        "minecraft:tripwire_hook",
        //避雷针
        "minecraft:lightning_rod",
    ]
    // log(event.itemStack.typeId);
    if (items.includes(event.itemStack.typeId)) {
        event.source.sendMessage("§c 由于您过去的违规行为，已被暂时禁止使用部分物品，具体解封时间请联系管理员");
        event.cancel = true;
    }
})
