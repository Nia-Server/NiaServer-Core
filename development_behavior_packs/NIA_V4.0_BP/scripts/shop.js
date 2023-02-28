import {world} from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import {Tell,RunCmd,GetScore} from './customFunction.js'
import {OxygenGUI} from './oxygen.js'
///////////////////////////////////////////////////////////////
//只能修改
///////////////////////////////////////////////////////////////
//商店售卖数据
var SellData = [
    {
        "name": "一些免费赠送的东西",
        "description": "无限次免费购买（",
        "image": "textures/ui/gift_square.png",
        "content": [
            {
                "name": "钟表",
                "type": "minecraft:clock",
                "price": 50,
                "discount": 0,
                "data": 0,
                "image": "textures/items/clock_item"
            }
        ]
    },
    {
        "name": "杂项商店",
        "description": "卖一些杂七杂八的东西",
        "image": "textures/items/apple_golden",
        "content": [
            {
                "name": "附魔金苹果",
                "type": "minecraft:enchanted_golden_apple",
                "price": 500,
                "discount": 1,
                "data": 0,
                "image": "textures/items/apple_golden"
            },
            {
                "name": "三叉戟",
                "type": "minecraft:trident",
                "price": 5000,
                "discount": 1,
                "data": 0,
                "image": "textures/items/trident"
            },
            {
                "name": "细雪桶",
                "type": "minecraft:powder_snow_bucket",
                "price": 400,
                "discount": 1,
                "data": 0,
                "image": "textures/items/bucket_powder_snow"
            }
        ]
    },
    {
        "name": "生物蛋？",
        "description": "值钱玩意家人",
        "image": "textures/items/egg_villager",
        "content": [
            {
                "name": "村民蛋",
                "type": "minecraft:villager_spawn_egg",
                "price": 12000,
                "discount": 1,
                "data": 0,
                "image": "textures/items/egg_villager"
            },
            {
                "name": "猫猫蛋",
                "type": "minecraft:cat_spawn_egg",
                "price": 15000,
                "discount": 1,
                "data": 0,
                "image": "textures/items/egg_cat"
            },
            {
                "name": "狼蛋",
                "type": "minecraft:wolf_spawn_egg",
                "price": 15000,
                "discount": 1,
                "data": 0,
                "image": "textures/items/egg_wolf"
            },
            {
                "name": "鹦鹉蛋",
                "type": "minecraft:parrot_spawn_egg",
                "price": 15000,
                "discount": 1,
                "data": 0,
                "image": "textures/items/egg_parrot"
            },
            {
                "name": "熊猫蛋",
                "type": "minecraft:panda_spawn_egg",
                "price": 50000,
                "discount": 0.8,
                "data": 0,
                "image": "textures/items/egg_panda"
            }
        ]
    },
    {
        "name": "树苗",
        "description": "在这里售卖各种各样的树苗！",
        "image": "textures/blocks/sapling_oak",
        "content": [
            {
                "name": "橡树苗",
                "type": "minecraft:sapling",
                "price": 100,
                "discount": 1,
                "data": 0,
                "image": "textures/blocks/sapling_oak"
            },
            {
                "name": "云杉树苗",
                "type": "minecraft:sapling",
                "price": 100,
                "discount": 1,
                "data": 1,
                "image": "textures/blocks/sapling_spruce"
            },
            {
                "name": "桦树苗",
                "type": "minecraft:sapling",
                "price": 100,
                "discount": 1,
                "data": 2,
                "image": "textures/blocks/sapling_birch"
            },
            {
                "name": "丛林树苗",
                "type": "minecraft:sapling",
                "price": 100,
                "discount": 1,
                "data": 3,
                "image": "textures/blocks/sapling_jungle"
            },
            {
                "name": "金合欢树苗",
                "type": "minecraft:sapling",
                "price": 100,
                "discount": 1,
                "data": 4,
                "image": "textures/blocks/sapling_acacia"
            },
            {
                "name": "深色橡树苗",
                "type": "minecraft:sapling",
                "price": 100,
                "discount": 1,
                "data": 5,
                "image": "textures/blocks/sapling_roofed_oak"
            },
            {
                "name": "红树胎生苗",
                "type": "minecraft:mangrove_propagule",
                "price": 150,
                "discount": 1,
                "data": 0,
                "image": "textures/blocks/mangrove_propagule"
            }
        ]
    },
    {
        "name": "珊瑚相关方块",
        "description": "采摘于稻妻海祗岛，品质值得信赖",
        "image": "textures/blocks/coral_fan_pink",
        "content": [
            {
                "name": "管珊瑚块",
                "type": "minecraft:coral_block",
                "price": 60,
                "discount": 1,
                "data": 0,
                "image": "textures/blocks/coral_blue"
            },
            {
                "name": "脑纹珊瑚块",
                "type": "minecraft:coral_block",
                "price": 60,
                "discount": 1,
                "data": 1,
                "image": "textures/blocks/coral_pink"
            },
            {
                "name": "气泡珊瑚块",
                "type": "minecraft:coral_block",
                "price": 60,
                "discount": 1,
                "data": 2,
                "image": "textures/blocks/coral_purple"
            },
            {
                "name": "火珊瑚块",
                "type": "minecraft:coral_block",
                "price": 60,
                "discount": 1,
                "data": 3,
                "image": "textures/blocks/coral_red"
            },
            {
                "name": "鹿角珊瑚块",
                "type": "minecraft:coral_block",
                "price": 60,
                "discount": 1,
                "data": 4,
                "image": "textures/blocks/coral_yellow"
            },
            {
                "name": "管珊瑚",
                "type": "minecraft:coral",
                "price": 60,
                "discount": 1,
                "data": 0,
                "image": "textures/blocks/coral_fan_blue"
            },
            {
                "name": "脑纹珊瑚",
                "type": "minecraft:coral",
                "price": 60,
                "discount": 1,
                "data": 1,
                "image": "textures/blocks/coral_fan_pink"
            },
            {
                "name": "气泡珊瑚",
                "type": "minecraft:coral",
                "price": 60,
                "discount": 1,
                "data": 2,
                "image": "textures/blocks/coral_fan_purple"
            },
            {
                "name": "火珊瑚",
                "type": "minecraft:coral",
                "price": 60,
                "discount": 1,
                "data": 3,
                "image": "textures/blocks/coral_fan_red"
            },
            {
                "name": "鹿角珊瑚",
                "type": "minecraft:coral",
                "price": 60,
                "discount": 1,
                "data": 4,
                "image": "textures/blocks/coral_fan_yellow"
            },
        ]
    },
    {
    "name": "其他的杂项方块",
    "description": "在这里购买其他杂项方块",
    "image": "textures/blocks/grass_side_carried",
    "content": [
        {
            "name": "泥土方块",
            "type": "minecraft:dirt",
            "price": 50,
            "discount": 0.8,
            "data": 0,
            "image": "textures/blocks/dirt"
        },
        {
            "name": "草方块",
            "type": "minecraft:grass",
            "price": 150,
            "discount": 0.8,
            "data": 0,
            "image": "textures/blocks/grass_side_carried"
        },
        {
            "name": "沙砾",
            "type": "minecraft:gravel",
            "price": 50,
            "discount": 1,
            "data": 0,
            "image": "textures/blocks/gravel"
        },
        {
            "name": "沙子",
            "type": "minecraft:sand",
            "price": 50,
            "discount": 0.8,
            "data": 0,
            "image": "textures/blocks/sand"
        },
        {
            "name": "浮冰",
            "type": "minecraft:packed_ice",
            "price": 40,
            "discount": 0.75,
            "data": 0,
            "image": "textures/blocks/ice_packed"
        },
        {
            "name": "赭黄蛙明灯",
            "type": "minecraft:ochre_froglight",
            "price": 500,
            "discount": 0.8,
            "data": 0,
            "image": "textures/blocks/ochre_froglight_side"
        },
        {
            "name": "珠光蛙明灯",
            "type": "minecraft:pearlescent_froglight",
            "price": 500,
            "discount": 0.8,
            "data": 0,
            "image": "textures/blocks/pearlescent_froglight_side"
        },
        {
            "name": "青翠蛙明灯",
            "type": "minecraft:verdant_froglight",
            "price": 500,
            "discount": 0.8,
            "data": 0,
            "image": "textures/blocks/verdant_froglight_side"
        },
        {
            "name": "海晶灯（贴图错了",
            "type": "minecraft:sea_lantern",
            "price": 500,
            "discount": 0.8,
            "data": 0,
            "image": "textures/blocks/sea_lantern"
        }
    ]
    },
    // {
    // "name": "各种木头相关方块",
    // "description": "在这里购买木头相关方块",
    // "image": "textures/blocks/log_oak",
    // "content": [
    //     {
    //         "name": "橡木",
    //         "type": "minecraft:log",
    //         "price": 50,
    //         "discount": 1,
    //         "data": 0,
    //         "image": "textures/blocks/log_oak"
    //     },
    //     {
    //         "name": "云杉木",
    //         "type": "minecraft:log",
    //         "price": 50,
    //         "discount": 1,
    //         "data": 1,
    //         "image": "textures/blocks/log_spruce"
    //     },
    //     {
    //         "name": "白桦木",
    //         "type": "minecraft:log",
    //         "price": 50,
    //         "discount": 1,
    //         "data": 2,
    //         "image": "textures/blocks/log_birch"
    //     },
    //     {
    //         "name": "从林木",
    //         "type": "minecraft:log",
    //         "price": 50,
    //         "discount": 1,
    //         "data": 3,
    //         "image": "textures/blocks/log_jungle"
    //     },
    //     {
    //         "name": "金合欢木",
    //         "type": "minecraft:log2",
    //         "price": 50,
    //         "discount": 1,
    //         "data": 0,
    //         "image": "textures/blocks/log_acacia"
    //     },
    //     {
    //         "name": "深色像木",
    //         "type": "minecraft:log2",
    //         "price": 50,
    //         "discount": 1,
    //         "data": 1,
    //         "image": "textures/blocks/log_big_oak"
    //     }
    // ]
    // },
    {
    "name": "各种陶瓦方块",
    "description": "在这里购买陶瓦相关方块",
    "image": "textures/blocks/hardened_clay",
    "content": [
        {
            "name": "陶瓦",
            "type": "minecraft:hardened_clay",
            "price": 100,
            "discount": 1,
            "data": 0,
            "image": "textures/blocks/hardened_clay"
        },
        {
            "name": "橙色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 1,
            "image": "textures/blocks/hardened_clay_stained_orange"
        },
        {
            "name": "品红色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 2,
            "image": "textures/blocks/hardened_clay_stained_magenta"
        },
        {
            "name": "淡蓝色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 3,
            "image": "textures/blocks/hardened_clay_stained_light_blue"
        },
        {
            "name": "黄色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 4,
            "image": "textures/blocks/hardened_clay_stained_yellow"
        },
        {
            "name": "黄绿色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 5,
            "image": "textures/blocks/hardened_clay_stained_lime"
        },
        {
            "name": "粉红色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 6,
            "image": "textures/blocks/hardened_clay_stained_pink"
        },
        {
            "name": "灰色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 7,
            "image": "textures/blocks/hardened_clay_stained_gray"
        },
        {
            "name": "淡灰色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 8,
            "image": "textures/blocks/hardened_clay_stained_silver"
        },
        {
            "name": "青色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 9,
            "image": "textures/blocks/hardened_clay_stained_cyan"
        },
        {
            "name": "紫色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 10,
            "image": "textures/blocks/hardened_clay_stained_purple"
        },
        {
            "name": "蓝色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 11,
            "image": "textures/blocks/hardened_clay_stained_blue"
        },
        {
            "name": "棕色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 12,
            "image": "textures/blocks/hardened_clay_stained_brown"
        },
        {
            "name": "绿色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 13,
            "image": "textures/blocks/hardened_clay_stained_green"
        },
        {
            "name": "红色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 14,
            "image": "textures/blocks/hardened_clay_stained_red"
        },
        {
            "name": "黑色陶瓦",
            "type": "minecraft:stained_hardened_clay",
            "price": 120,
            "discount": 1,
            "data": 15,
            "image": "textures/blocks/hardened_clay_stained_black"
        }
    ]
    },
    {
    "name": "各种石头相关方块",
    "description": "在这里购买石头相关方块",
    "image": "textures/blocks/stone",
    "content": [
        {
            "name": "石头",
            "type": "minecraft:stone",
            "price": 80,
            "discount": 1,
            "data": 0,
            "image": "textures/blocks/stone"
        },
        {
            "name": "花岗岩",
            "type": "minecraft:stone",
            "price": 80,
            "discount": 1,
            "data": 1,
            "image": "textures/blocks/stone_granite"
        },
        {
            "name": "磨制花岗岩",
            "type": "minecraft:stone",
            "price": 100,
            "discount": 1,
            "data": 2,
            "image": "textures/blocks/stone_granite_smooth"
        },
        {
            "name": "闪长岩",
            "type": "minecraft:stone",
            "price": 80,
            "discount": 1,
            "data": 3,
            "image": "textures/blocks/stone_diorite"
        },
        {
            "name": "磨制闪长岩",
            "type": "minecraft:stone",
            "price": 100,
            "discount": 1,
            "data": 4,
            "image": "textures/blocks/stone_diorite_smooth"
        },
        {
            "name": "安山岩",
            "type": "minecraft:stone",
            "price": 80,
            "discount": 1,
            "data": 5,
            "image": "textures/blocks/stone_andesite"
        },
        {
            "name": "磨制安山岩",
            "type": "minecraft:stone",
            "price": 100,
            "discount": 1,
            "data": 6,
            "image": "textures/blocks/stone_andesite_smooth"
        }
    ]
    },
    {
    "name": "红石相关物品",
    "description": "在这里购买红石相关的物品",
    "image": "textures/blocks/redstone_torch_on",
    "content": [
        {
            "name": "漏斗",
            "type": "minecraft:hopper",
            "price": 2000,
            "discount": 0.95,
            "data": 0,
            "image": "textures/items/hopper"
        },
        {
            "name": "活塞",
            "type": "minecraft:piston",
            "price": 500,
            "discount": 1,
            "data": 0,
            "image": "textures/blocks/piston_side"
        },
        {
            "name": "粘液球",
            "type": "minecraft:slime_ball",
            "price": 100,
            "discount": 1,
            "data": 0,
            "image": "textures/items/slimeball"
        },
        {
            "name": "红石中继器",
            "type": "minecraft:repeater",
            "price": 1000,
            "discount": 0.6,
            "data": 0,
            "image": "textures/items/repeater"
        },
        {
            "name": "红石比较器",
            "type": "minecraft:comparator",
            "price": 1000,
            "discount": 0.6,
            "data": 0,
            "image": "textures/items/comparator"
        },
        {
            "name": "发射器",
            "type": "minecraft:dispenser",
            "price": 1000,
            "discount": 1,
            "data": 0,
            "image": "textures/blocks/dispenser_front_horizontal"
        },
        {
            "name": "投掷器",
            "type": "minecraft:dropper",
            "price": 600,
            "discount": 1,
            "data": 0,
            "image": "textures/blocks/dropper_front_horizontal"
        }
    ]
    }
]

//商店回收数据
var RecycleData = [
    {
        "name": "jiansyuan的小当铺",
        "description": "童叟无欺，老少皆宜～",
        "image": "textures/ui/village_hero_effect",
        "content": [
            {
                "name": "腐肉肉，恶心心",
                "type": "minecraft:rotten_flesh",
                "price": 5,
                "data": 0,
                "image": "textures/items/rotten_flesh",
                "lim": true,
                "limnum": 48
            },
            {
                "name": "生牛肉",
                "type": "minecraft:beef",
                "price": 15,
                "data": 0,
                "image": "textures/items/beef_raw",
                "lim": false
            },
            {
                "name": "生猪肉",
                "type": "minecraft:porkchop",
                "price": 15,
                "data": 0,
                "image": "textures/items/porkchop_raw",
                "lim": false,
            },
            {
                "name": "苹果",
                "type": "minecraft:apple",
                "price": 20,
                "data": 0,
                "image": "textures/items/apple",
                "lim": false,
            },
            {
                "name": "农村自养生土鸡",
                "type": "minecraft:chicken",
                "price": 15,
                "data": 0,
                "image": "textures/items/chicken_raw",
                "lim": true,
                "limnum": 128
            },
            {
                "name": "农村天然土鸡蛋",
                "type": "minecraft:egg",
                "price": 20,
                "data": 0,
                "image": "textures/items/egg",
                "lim": true,
                "limnum": 128
            },
            {
                "name": "非常普通的小麦",
                "type": "minecraft:wheat",
                "price": 35,
                "data": 0,
                "image": "textures/items/wheat",
                "lim": true,
                "limnum": 256
            },
            {
                "name": "熟高档安格斯牛",
                "type": "minecraft:cooked_beef",
                "price": 60,
                "data": 0,
                "image": "textures/items/beef_cooked",
                "lim": true,
                "limnum": 16
            }
        ]
    },
    {
        "name": "NIA的小当铺(木匠",
        "description": "童叟无欺，老少皆宜～",
        "image": "textures/ui/mashup_world",
        "content": [
            {
                "name": "橡木/云杉木/白桦木/丛林木",
                "type": "minecraft:log",
                "price": 40,
                "data": -1,
                "image": "textures/blocks/log_oak",
                "lim": false,
                "limnum": 0
            },
            {
                "name": "金合欢原木/深色橡木原木",
                "type": "minecraft:log2",
                "price": 40,
                "data": -1,
                "image": "textures/blocks/log_acacia",
                "lim": false,
                "limnum": 0
            }
        ]
    },
    {
        "name": "矿物回收",
        "description": "在这里回收矿物",
        "image": "textures/items/diamond",
        "content": [
            {
                "name": "煤炭",
                "type": "minecraft:coal",
                "price": 50,
                "data": 0,
                "image": "textures/items/coal",
                "lim": true,
                "limnum": 32
            },
            {
                "name": "红石",
                "type": "minecraft:redstone",
                "price": 150,
                "data": 0,
                "image": "textures/items/redstone_dust",
                "lim": true,
                "limnum": 16
            },
            {
                "name": "青金石",
                "type": "minecraft:lapis_lazuli",
                "price":  400,
                "data": 0,
                "image": "textures/items/dye_powder_blue",
                "lim": true,
                "limnum": 16
            },
            {
                "name": "铁锭",
                "type": "minecraft:iron_ingot",
                "price":  150,
                "data": 0,
                "image": "textures/items/iron_ingot",
                "lim": true,
                "limnum": 16
            },
            {
                "name": "黄金锭",
                "type": "minecraft:gold_ingot",
                "price": 450,
                "data": 0,
                "image": "textures/items/gold_ingot",
                "lim": true,
                "limnum": 16
            },
            {
                "name": "绿宝石",
                "type": "minecraft:emerald",
                "price": 700,
                "data": 0,
                "image": "textures/items/emerald",
                "lim": true,
                "limnum": 16
            },
            {
                "name": "钻石",
                "type": "minecraft:diamond",
                "price": 1000,
                "data": 0,
                "image": "textures/items/diamond",
                "lim": true,
                "limnum": 16
            },
            {
                "name": "下界合金锭",
                "type": "minecraft:netherite_ingot",
                "price": 1800,
                "data": 0,
                "image": "textures/items/netherite_ingot",
                "lim": false,
                "limnum": 0
            }
        ]
    },
    {
        "name": "战利品回收",
        "description": "在这里回收战利品",
        "image": "textures/items/end_crystal",
        "content": [
            {
                "name": "骨头",
                "type": "minecraft:bone",
                "price": 5,
                "data": -1,
                "image": "textures/items/bone",
                "lim": true,
                "limnum": 48
            },
            {
                "name": "箭矢",
                "type": "minecraft:arrow",
                "price": 5,
                "data": -1,
                "image": "textures/items/arrow",
                "lim": true,
                "limnum": 48
            },
            {
                "name": "炸药",
                "type": "minecraft:gunpowder",
                "price": 5,
                "data": -1,
                "image": "textures/items/gunpowder",
                "lim": true,
                "limnum": 48
            },
            {
                "name": "鞘翅",
                "type": "minecraft:elytra",
                "price": 50000,
                "data": -1,
                "image": "textures/items/elytra",
                "lim": false,
                "limnum": 0
            },
            {
                "name": "龙头",
                "type": "minecraft:skull",
                "price": 50000,
                "data": -1,
                "image": "",
                "lim": false,
                "limnum": 0
            }
        ]
    },
    {
        "name": "部分方块回收",
        "description": "在这里回收一些方块",
        "image": "textures/blocks/grass_side_carried",
        "content": [
            {
                "name": "草方块",
                "type": "minecraft:grass",
                "price": 100,
                "data": 0,
                "image": "textures/blocks/grass_side_carried",
                "lim": true,
                "limnum": 10
            },
            {
                "name": "圆石",
                "type": "minecraft:cobblestone",
                "price": 5,
                "data": 0,
                "image": "textures/blocks/cobblestone",
                "lim": true,
                "limnum": 512
            },
            {
                "name": "沙砾",
                "type": "minecraft:gravel",
                "price": 10,
                "data": -1,
                "image": "textures/blocks/gravel",
                "lim": true,
                "limnum": 64
            },
            {
                "name": "沙子",
                "type": "minecraft:sand",
                "price": 10,
                "data": -1,
                "image": "textures/blocks/sand",
                "lim": true,
                "limnum": 64
            },
            {
                "name": "陶瓦",
                "type": "minecraft:hardened_clay",
                "price": 50,
                "data": -1,
                "image": "textures/blocks/hardened_clay",
                "lim": true,
                "limnum": 64
            },
            {
                "name": "基岩",
                "type": "minecraft:bedrock",
                "price": 0,
                "data": -1,
                "image": "textures/blocks/bedrock",
                "lim": false,
                "limnum": 0
            }
        ]
    }
]
///////////////////////////////////////////////////////////////

const GUI = {
    ShopMain(player) {
        const ShopMainForm = new ActionFormData()
            .title("§e§l服务器商店")
            .body("§l===========================\n§r§e欢迎光临服务器官方商店！\n目前服务器的物价指数为： §6§l" + GetScore("DATA","RN")/100 + "\n§r§e目前您的能源币余额为： §6§l" + GetScore("money",player.nameTag) + "\n§r§c请根据自己需求理性购物！\n§r§l===========================")
            .button("§c返回上一级")
            .button("查看今日折扣商品\n§7立即查看现在的折扣商品！")
            .button("售卖物品商店\n§7在这里售卖各式各样的物品！")
            .button("回收物品商店\n§7在这里回收各式各样的物品！")
            .button("氧气装备商店\n§7在这里售卖氧气、呼吸装备等物品！")
        ShopMainForm.show(player).then((response) => {
            switch (response.selection) {
                case 0:
                    this.Main(player);
                    break;
                case 1:
                    this.Discount(player);
                    break;
                case 2:
                    this.ShopPurchase(player)
                    break;
                case 3:
                    this.ShopRecycle(player);
                    break;
                case 4:
                    OxygenGUI.OxygenMain(player);
                    break
            }
        })
    },

    Discount(player) {
        const DiscountForm = new ActionFormData()
        DiscountForm.title("今日折扣")
        let Str = "§l===========================§r\n§e§l每天各个物品的折扣\n可能根据市场有所变动！\n§r§l===========================§r\n"
        let num = 1;
        for(let i = 0; i < SellData.length; i++) {
            for(let j = 0; j < SellData[i].content.length; j++) {
                if(SellData[i].content[j].discount != 1) {
                    Str = Str + "§r§c"+ num + ".§r§e" + SellData[i].content[j].name + " §6" + SellData[i].content[j].discount * 10 + "§e折 折后价格：§6" + parseInt(SellData[i].content[j].price *  SellData[i].content[j].discount * GetScore("DATA","RN") / 100) + "\n§r"
                    num++
                }
            }
        }
        DiscountForm.body(Str + "§l===========================\n§c" + "【广告】广告位招商\n详情咨询腐竹！" + "\n§r§l===========================")
        DiscountForm.button("§c返回上一级")
        DiscountForm.show(player).then((result) => {
            if (result.selection == 0) {
                this.ShopMain(player)
            }
        })
    },

    ShopPurchase(player) {
        //定义商店售卖页面菜单
        const ShopPurchaseForm = new ActionFormData()
            .title("§e§l服务器商店")
            .body("§l===========================\n§r§e欢迎光临服务器官方商店！\n目前服务器的物价指数为： §6§l" + GetScore("DATA","RN")/100 + "\n§r§e目前您的能源币余额为： §6§l" + GetScore("money",player.nameTag) + "\n§r§c请根据自己需求理性购物！\n§r§l===========================")
            .button("§c返回上一级")
            for(let i = 0; i < SellData.length; i++) {
                ShopPurchaseForm.button(SellData[i].name + "\n" + SellData[i].description,SellData[i].image)
            }
        ShopPurchaseForm.show(player).then((response) => {
            if (response.selection == 0) {
                this.ShopMain(player)
            } else {
                this.ShopPurchaseSub(player, response.selection - 1)
            }
        })
    },

    ShopPurchaseSub(player,index1) {
        //定义商店售卖二级页面
        const ShopPurchaseSubForm = new ActionFormData()
            .title("§e§l服务器商店")
            .body("§l===========================\n§r§e欢迎光临服务器官方商店！\n目前服务器的物价指数为： §6§l" + GetScore("DATA","RN")/100 + "\n§r§e目前您的能源币余额为： §6§l" + GetScore("money",player.nameTag) + "\n§r§c请根据自己需求理性购物！\n§r§l===========================")
            .button("§c返回上一级")
        for(let i = 0; i < SellData[index1].content.length; i++) {
            if (SellData[index1].content[i].discount == 1) {
                ShopPurchaseSubForm.button(SellData[index1].content[i].name + "\n价格: §9" + parseInt(SellData[index1].content[i].price * GetScore("DATA","RN") / 100),SellData[index1].content[i].image)
            } else {
                ShopPurchaseSubForm.button("§c[限时优惠]§r" + SellData[index1].content[i].name + "\n原价：§9" + parseInt(SellData[index1].content[i].price * GetScore("DATA","RN") / 100) +"§r 现价: §9" + parseInt(SellData[index1].content[i].price * SellData[index1].content[i].discount * GetScore("DATA","RN") / 100),SellData[index1].content[i].image)
            }
        }
        ShopPurchaseSubForm.show(player).then((response) => {
            if (response.selection == 0) {
                this.ShopPurchase(player)
            } else {
                this.ShopBuy(player,index1,response.selection - 1)
            }
        })
    },

    ShopBuy(player,index1,index2) {
        //定义商店售卖二级页面
        const ShopBuyForm = new ModalFormData()
        ShopBuyForm.title("§c§l确认购买 " + SellData[index1].content[index2].name + " 的数量")
        // ShopBuyForm.slider("请选择你要购买的数量",1,64,1,1);
        ShopBuyForm.textField("请输入你要购买的数量","只能输入正整数！","1")
        ShopBuyForm.show(player).then((result) => {
            if(result.canceled) {
                this.ShopPurchaseSub(player,index1)
            }
            if (parseInt(result.formValues[0]) <= 0 || isNaN(parseInt(Number(result.formValues[0])))) {
                player.tell(`§c>> 错误的数字格式，请重新输入！`)
                // Tell(`§c>> 错误的数字格式，请重新输入！`,player.nameTag)
                this.ShopBuy(player,index1,index2)
            } else if (parseInt(result.formValues[0]) >= 1025) {
                player.tell(`§c>> 单次购买物品的数量上限是1024，请重新输入！`)
                Tell(`§c>> 单次购买物品的数量上限是1024，请重新输入！`,player.nameTag)
                this.ShopBuy(player,index1,index2)
            } else {
                this.ShopBuySub(player,index1,index2,result.formValues[0])
            }
        })
    },

    ShopBuySub(player,i,j,num) {
        const ShopBuySubForm = new MessageFormData()
            .title("§c§l确认购买 " + SellData[i].content[j].name)
            .body("§e您确定要以 §l" + parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num + "§r§e 能源币，购买 §l" + num + " §r§e个" + SellData[i].content[j].name + "?\n§c§l注意：所有商品一旦售出概不退换！")
            .button1("§c§l取消")
            .button2("§a§l确定")
        ShopBuySubForm.show(player).then((result) => {
            switch(result.selection) {
                case 0:
                    if (GetScore("money",player.nameTag) >= parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num) {
                        RunCmd(`give "${player.nameTag}" ${SellData[i].content[j].type} ${num} ${SellData[i].content[j].data}`)
                        RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -${parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num}`)
                        Tell("§a>> 购买成功！§e您以 §l" + parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num + "§r§e 能源币，成功购买 §l" + num + " §r§e个" + SellData[i].content[j].name + "!期待您的下次光临！",player.nameTag)
                        this.ShopPurchaseSub(player,i)
                    } else {
                        Tell(`§c>> 购买失败！余额不足，您的余额为 ${GetScore("money",player.nameTag)} 能源币，而本次购买需要 ${parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num} 能源币，您还缺少 ${parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num - GetScore("money",player.nameTag)} 能源币，请在攒够足够能源币后尝试再次购买！`,player.nameTag)
                        this.ShopPurchaseSub(player,i)
                    }
                    break;
                case 1:
                    Tell("§c>> 购买失败！原因是您自己取消了本次购买！",player.nameTag)
                    this.ShopPurchaseSub(player,i)
                    break;
            }
        })
    },

    /////////////////////////////////////////////
    ShopRecycle(player) {
        //定义商店回收页面菜单
        const ShopRecycleForm = new ActionFormData()
            .title("§e§l回收商店")
            .body("§l===========================\n§r§e欢迎光临服务器官方回收商店！\n目前服务器的物价指数为： §6§l" + GetScore("DATA","RN")/100 + "\n§r§e目前您的能源币余额为： §6§l" + GetScore("money",player.nameTag) + "\n§r§l===========================")
            .button("§c返回上一级")
            for(let i = 0; i < RecycleData.length; i++) {
                ShopRecycleForm.button(RecycleData[i].name + "\n" + RecycleData[i].description,RecycleData[i].image)
            }
            ShopRecycleForm.show(player).then((response) => {
            if (response.selection == 0) {
                this.ShopMain(player)
            } else {
                this.ShopRecycleSub(player, response.selection - 1)
            }
        })
    },

    ShopRecycleSub(player,index1) {
        //定义商店回收的二级页面
        const ShopRecycleSubForm = new ActionFormData()
            .title("§e§l回收商店")
            .body("§l===========================\n§r§e欢迎光临服务器官方回收商店！\n目前服务器的物价指数为： §6§l" + GetScore("DATA","RN")/100 + "\n§r§e目前您的能源币余额为： §6§l" + GetScore("money",player.nameTag) + "\n§r§l===========================")
            .button("§c返回上一级")
        for(let i = 0; i < RecycleData[index1].content.length; i++) {
            if (RecycleData[index1].content[i].lim == false) {
                ShopRecycleSubForm.button(RecycleData[index1].content[i].name + "\n回收单价: §9" + parseInt(RecycleData[index1].content[i].price * GetScore("DATA","RN") / 100),RecycleData[index1].content[i].image)
            } else {
                ShopRecycleSubForm.button("§c[单日回收数量限制]§r" + RecycleData[index1].content[i].name + "\n回收单价：§9" + parseInt(RecycleData[index1].content[i].price * GetScore("DATA","RN") / 100) +" §r回收数量限制:§9 " + RecycleData[index1].content[i].limnum,RecycleData[index1].content[i].image)
            }
        }
        ShopRecycleSubForm.show(player).then((response) => {
            if (response.selection == 0) {
                this.ShopRecycle(player)
            } else {
                this.ShopSell(player,index1,response.selection - 1)
            }
        })
    },

    ShopSell(player,index1,index2) {
        //回收物品这里有四种情况-没有相关物品-回收数量达到限额-有相关物品但有数量限制-有相关物品但没有数量限制
        //首先判断有没有相关物品
        let ItemNum = 0;
        //判断回收项目是否不限特殊值
        if (RecycleData[index1].content[index2].data == -1) {
            for (let i = 0; i < 35; i++) {
                if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined && player.getComponent("minecraft:inventory").container.getItem(i).typeId == RecycleData[index1].content[index2].type) {
                    ItemNum = ItemNum + player.getComponent("minecraft:inventory").container.getItem(i).amount
                }
            }
        } else {
            for (let i = 0; i < 35; i++) {
                if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined && player.getComponent("minecraft:inventory").container.getItem(i).typeId == RecycleData[index1].content[index2].type && player.getComponent("minecraft:inventory").container.getItem(i).data == RecycleData[index1].content[index2].data) {
                    ItemNum = ItemNum + player.getComponent("minecraft:inventory").container.getItem(i).amount
                }
            }
        }
        //有物品之后再次判断是否限制数量
        if (ItemNum != 0) {
            let HasLim = false;
            //限制每日兑换数量
            if (RecycleData[index1].content[index2].lim) {
                //限制数量就判断是否达到限额
                let HaveData = false;
                let ScoreBoards = world.scoreboard.getObjectives()
                //直接遍历所有计分板看玩家有没有创建相关数据
                for (let i = 0; i < ScoreBoards.length; i++) {
                    if (ScoreBoards[i].id == "R:" + player.nameTag.slice(0,10)) {
                        //进入到这里就说明玩家有相关计分板
                        for (let j = 0; j < ScoreBoards[i].getParticipants().length; j++) {
                            if (ScoreBoards[i].getParticipants()[j].displayName == RecycleData[index1].content[index2].type.slice(10)) {
                                if (GetScore(`R:${player.nameTag.slice(0,10)}`,`${ScoreBoards[i].getParticipants()[j].displayName}`) == RecycleData[index1].content[index2].limnum) {
                                    HasLim = true;
                                }
                                HaveData = true;
                                break;
                            }
                        }
                        break;
                    }
                }
                //没有数据就创建数据计分板！
                if (!HaveData) {
                    //创建计分板
                    if (world.scoreboard.getObjective(`R:${player.nameTag.slice(0,10)}`) == null) {
                        world.scoreboard.addObjective(`R:${player.nameTag.slice(0,10)}`,`R:${player.nameTag}`);
                    }
                    //设置分数
                    RunCmd(`scoreboard players set ${RecycleData[index1].content[index2].type.slice(10)} R:${player.nameTag.slice(0,10)} 0`)
                }
            }
            //没有达到限额&&没有限额
            if (!HasLim) {
                const ShopSellForm = new ModalFormData()
                ShopSellForm.title("§c§l确认回收 " + RecycleData[index1].content[index2].name + " 的数量")
                if (RecycleData[index1].content[index2].lim) {
                    let CanRecycleNum = RecycleData[index1].content[index2].limnum - GetScore(`R:${player.nameTag.slice(0,10)}`,RecycleData[index1].content[index2].type.slice(10))
                    if (ItemNum > CanRecycleNum) {
                        ShopSellForm.slider("请选择你要回收的数量",1,CanRecycleNum,1,1);
                    } else {
                        ShopSellForm.slider("请选择你要回收的数量",1,ItemNum,1,1);
                    }
                } else {
                    ShopSellForm.slider("请选择你要回收的数量",1,ItemNum,1,1);
                }
                ShopSellForm.show(player).then((result) => {
                    this.ShopSellSub(player,index1,index2,result.formValues[0])
                })
            } else {
                //达到限额提示
                const ShopSellLimForm = new MessageFormData()
                    .title("§c§l回收 " + RecycleData[index1].content[index2].name + " 限额提醒")
                    .body("§e该物品已达到本日回收最大数量，请明天再次尝试回收哦！")
                    .button1("§c退出")
                    .button2("§a返回上一级菜单")
                    ShopSellLimForm.show(player).then(result => {
                        switch (result.selection) {
                            case 0:
                                this.ShopRecycleSub(player,index1);
                                break;
                            case 1:
                                Tell("§c>> 回收失败！原因是该物品已达到本日回收最大数量，请明天再次尝试回收哦！",player.nameTag)
                                break;
                        }
                    })
            }

        } else {
            //没有相关物品提醒
            const ShopSellNoItemForm = new MessageFormData()
                .title("§c§l回收 " + RecycleData[index1].content[index2].name + " 失败提醒")
                .body("§c§l没有在您的背包中找到相应物品！请检查背包后再次尝试！")
                .button1("§c退出")
                .button2("§a返回上一级菜单")
                ShopSellNoItemForm.show(player).then(result => {
                    switch (result.selection) {
                        case 0:
                            this.ShopRecycleSub(player,index1);
                            break;
                        case 1:
                            Tell("§c>> 回收失败！原因是没有在您的背包中找到相应物品！请检查背包后再次尝试！",player.nameTag)
                            break;
                    }
                })
        }

    },

    //开始发送确认回收的表单
    ShopSellSub(player,index1,index2,num) {
        const ShopSellSubForm = new MessageFormData()
            .title("§c§l确认回收 " + RecycleData[index1].content[index2].name)
            .body("§e您确定要以 §l" + parseInt(RecycleData[index1].content[index2].price *  GetScore("DATA","RN") / 100) * num + "§r§e 能源币的报酬，回收 §l" + num + " §r§e个" + RecycleData[index1].content[index2].name + "?\n§c§l注意：所有商品一旦回收无法逆转！")
            .button1("§c§l取消")
            .button2("§a§l确定")
            ShopSellSubForm.show(player).then((result) => {
            switch(result.selection) {
                case 0:
                    //首先进行判断是否有限制，有限制就直接写入相关数据
                    if (RecycleData[index1].content[index2].lim) {
                        // PlayerRecycleData[player.nameTag][RecycleData[index1].content[index2].type] = PlayerRecycleData[player.nameTag][RecycleData[index1].content[index2].type] + num
                        RunCmd(`scoreboard players set ${RecycleData[index1].content[index2].type.slice(10)} R:${player.nameTag.slice(0,10)} ${GetScore(`R:${player.nameTag.slice(0,10)}`,RecycleData[index1].content[index2].type.slice(10)) + num}`)
                    }
                    //然后进行扣除物品的操作
                    RunCmd(`clear @a[name="${player.nameTag}"] ${RecycleData[index1].content[index2].type} ${RecycleData[index1].content[index2].data} ${num}`)
                    //然后执行加钱的操作！
                    RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money ${parseInt(RecycleData[index1].content[index2].price * GetScore("DATA","RN") / 100) * num}`)
                    Tell(`§a>> 回收成功！您成功回收 §l${num}§r§a 个 §l${RecycleData[index1].content[index2].name}§r§a，并获得了 §l${parseInt(RecycleData[index1].content[index2].price * GetScore("DATA","RN") / 100) * num} §r§a能源币！期待您的下次光临！`,player.nameTag)
                    break;
                case 1:
                    Tell("§c>> 回收失败！原因是您自己取消了本次回收！",player.nameTag)
                    break;
            }
        })
    }
}

export const ShopGUI = GUI

