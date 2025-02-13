import { ItemStack, system, world, ItemComponentTypes,EnchantmentType, EntityComponentTypes } from '@minecraft/server';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { Tell,RunCmd,GetScore, GetTime,GetDate } from '../API/game.js';
import { Main } from './main_menu.js';
import { ExternalFS } from '../API/http.js';
import { log,warn,error } from "../API/logger.js";
import { TitleGUI } from './playertitle.js';
import { cfg } from '../config.js';

//武器等不可堆叠武器构建判断后期写
const fs = new ExternalFS();
var SellData = [];
var RecycleData = [];
const MoneyShowName = cfg.MoneyShowName
const MoneyScoreboardName = cfg.MoneyScoreboardName
const USE_RN_SYSTEM = true;
//商店数据读取

//服务器启动监听&&获得商店数据
world.afterEvents.worldInitialize.subscribe(() => {
    const start = Date.now();
    fs.GetJSONFileData("shop_data.json").then((result) => {
        //文件不存在
        if (result === 0) {
            fs.CreateNewJsonFile("shop_data.json",{"sell_data":[],"recycle_data":[]}).then((result) => {
                if (result === "success") {
                    warn("【商店系统】在获取商店数据文件 shop_data.json 时发现文件不存在，已成功创建")
                } else if (result === -1) {
                    error("【商店系统】在创建玩家货币数据文件 shop_data.json 时与NIAHttpBOT连接失败")
                }
            });
        } else if (result === -1) {
            error("【商店系统】在获取商店数据文件 shop_data.json 时与NIAHttpBOT连接失败")
        } else {
            SellData = result.sell_data;
            RecycleData = result.recycle_data;
            log(`【商店系统】商店系统数据文件 shop_data.json 获取成功`)
        }
    })
})

var single_RN = {
    "basic": 1.0,//基础
    "mineral": 1.0,//矿物
    "weapon": 1.0,//武器
    "equipment": 1.0,//装备
    "vegetative": 1.0,//植物
    "entity": 1.0,//实体
    "redstone": 1.0,//红石
    "enchanted_book": 1.0,//附魔书
    "block": 1.0,//方块
    "prop": 1.0,//道具
    "default": 1.0//默认
}

var single_RN_name = {
    "basic": "基础",
    "mineral": "矿物",
    "weapon": "武器",
    "equipment": "装备",
    "vegetative": "植物",
    "entity": "实体",
    "redstone": "红石",
    "enchanted_book": "附魔书",
    "block": "方块",
    "prop": "道具",
    "default": "默认"
}

var event = [
    {
        "weights": 1,
        "description": "由于腐竹偷偷使用服务器打原神",
        "influence_RN": {
            "basic":[0.1,0.2,0.4,1.6]
        }
    },
    {
        "weights": 3,
        "description": "由于某人大量抛售矿物",
        "influence_RN": {
            "mineral":[-0.2,-0.1,0.4,1.6]
        }
    },
    {
        "weights": 2,
        "description": "下界猪灵开启大规模金锭贸易",
        "influence_RN": {
            "mineral":[0.3,0.5,0.4,1.6]
        }
    },
    {
        "weights": 3,
        "description": "拼多多现已与服务器达成战略合作关系",
        "influence_RN": {
            "prop":[-0.15,-0.05,0.4,1.6]
        }
    },
    {
        "weights": 1,
        "description": "末影龙重生意外重生摧毁交易所",
        "influence_RN": {
            "entity":[0.4,0.6,0.4,1.6]
        }
    },
    {
        "weights": 4,
        "description": "村民大量抛售武器装备",
        "influence_RN": {
            "equipment":[-0.25,-0.15,0.4,1.6]
        }
    },
    {
        "weights": 2,
        "description": "林地府邸发现隐藏刷怪笼工厂",
        "influence_RN": {
            "redstone":[-0.3,-0.2,0.4,1.6]
        }
    },
    {
        "weights": 3,
        "description": "凋灵风暴摧毁主世界农田",
        "influence_RN": {
            "vegetative":[0.2,0.4,0.4,1.6]
        }
    },
    {
        "weights": 1,
        "description": "jsy在服务器下h游误删物品数据库",
        "influence_RN": {
            "block":[0.1,0.3,0.4,1.6]
        }
    },
    {
        "weights": 2,
        "description": "考古系统上线引发历史方块热",
        "influence_RN": {
            "basic":[0.15,0.25,0.4,1.6]
        }
    },
    {
        "weights": 3,
        "description": "末地城发现鞘翅复制BUG",
        "influence_RN": {
            "equipment":[-0.4,-0.3,0.4,1.6]
        }
    },
    {
        "weights": 1,
        "description": "村民AI觉醒集体罢工",
        "influence_RN": {
            "prop":[0.35,0.45,0.4,1.6]
        }
    },
    {
        "weights": 2,
        "description": "海底神殿发现海绵农场漏洞",
        "influence_RN": {
            "block":[-0.25,-0.15,0.4,1.6]
        }
    },
    {
        "weights": 4,
        "description": "玩家建造全自动工厂",
        "influence_RN": {
            "redstone":[0.2,0.3,0.4,1.6]
        }
    },
    {
        "weights": 1,
        "description": "HIM现身导致大量玩家弃坑",
        "influence_RN": {
            "default":[-0.5,-0.4,0.4,1.6]
        }
    },
    {
        "weights": 2,
        "description": "凋零玫瑰种植场遭雷击",
        "influence_RN": {
            "vegetative":[-0.3,-0.2,0.4,1.6]
        }
    },
    {
        "weights": 1,
        "description": "下界合金工具耐久翻倍BUG",
        "influence_RN": {
            "weapon":[-0.5,-0.4,0.4,1.6]
        }
    },
    {
        "weights": 3,
        "description": "流浪商人大量倾销紫颂果",
        "influence_RN": {
            "vegetative":[-0.4,-0.3,0.4,1.6]
        }
    },
    {
        "weights": 2,
        "description": "苦力怕娘皮肤引发收藏热",
        "influence_RN": {
            "entity":[0.25,0.35,0.4,1.6]
        }
    },
    {
        "weights": 1,
        "description": "末影珍珠复制机被修复",
        "influence_RN": {
            "prop":[0.5,0.7,0.4,1.6]
        }
    },
    {
        "weights": 4,
        "description": "村民发起第三次世界大战",
        "influence_RN": {
            "weapon":[0.3,0.5,0.4,1.6]
        }
    },
    {
        "weights": 2,
        "description": "由于服务器举办基础物品狂欢节",
        "influence_RN": {
          "basic": [0.15, 0.3, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "基础资源开采过剩导致市场饱和",
        "influence_RN": {
          "basic": [-0.3, -0.15, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "矿物陨石坠落扩充矿石供应",
        "influence_RN": {
          "mineral": [0.25, 0.4, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "地底开发技术失控导致矿物供过于求",
        "influence_RN": {
          "mineral": [-0.25, -0.1, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "腐竹颁布新法案提高武器质量标准",
        "influence_RN": {
          "weapon": [0.2, 0.35, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "武器铺推出暴击率系统拖低武器行情",
        "influence_RN": {
          "weapon": [-0.3, -0.2, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "装备打造工匠离奇失踪导致产量骤减",
        "influence_RN": {
          "equipment": [0.25, 0.45, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "旧装备热潮兴起，装备供给量提升",
        "influence_RN": {
          "equipment": [-0.2, -0.1, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "植物品种改良引起农作物需求暴涨",
        "influence_RN": {
          "vegetative": [0.2, 0.4, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "bug横行重创植物类种植业",
        "influence_RN": {
          "vegetative": [-0.3, -0.15, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "发现美元猪引发驯养热",
        "influence_RN": {
          "entity": [0.3, 0.5, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "生物多样性锐减引发物种保护担忧",
        "influence_RN": {
          "entity": [-0.25, -0.15, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "红石科技展引发红石技术革新",
        "influence_RN": {
          "redstone": [0.2, 0.35, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "红石器件频现故障导致市场信心下降",
        "influence_RN": {
          "redstone": [-0.25, -0.1, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "附魔书工坊推出全新强力附魔",
        "influence_RN": {
          "enchanted_book": [0.2, 0.4, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "过量附魔书充斥市场引发价格下跌",
        "influence_RN": {
          "enchanted_book": [-0.3, -0.15, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "方块艺术崛起引发收藏热潮",
        "influence_RN": {
          "block": [0.2, 0.45, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "大型拆迁工程使方块原料库存暴增",
        "influence_RN": {
          "block": [-0.25, -0.15, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "服务器又一次大规模更新引发道具狂潮",
        "influence_RN": {
          "prop": [0.25, 0.35, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "jsy大量抛售装备导致市场饱和",
        "influence_RN": {
          "prop": [-0.3, -0.2, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "服务器bug导致默认分类物品奇缺",
        "influence_RN": {
          "default": [0.25, 0.4, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "玩家大规模乱扔垃圾",
        "influence_RN": {
          "default": [-0.35, -0.2, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "神秘国度开启带动基础与矿物齐涨",
        "influence_RN": {
          "basic": [0.15, 0.25, 0.4, 1.6],
          "mineral": [0.1, 0.2, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "末影之门能量衰退导致武器与装备需求猛增",
        "influence_RN": {
          "weapon": [0.2, 0.3, 0.4, 1.6],
          "equipment": [0.2, 0.35, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "环保法案限制大型农业流水线，植物与红石类受损",
        "influence_RN": {
          "vegetative": [-0.2, -0.1, 0.4, 1.6],
          "redstone": [-0.25, -0.15, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "高能附魔技术泄露引发附魔书与武器价格波动",
        "influence_RN": {
          "enchanted_book": [0.15, 0.25, 0.4, 1.6],
          "weapon": [-0.1, -0.05, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "史诗级超级工程开启，方块与道具需求大增",
        "influence_RN": {
          "block": [0.3, 0.5, 0.4, 1.6],
          "prop": [0.2, 0.3, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "红石大战结束，剩余红石装备抛售导致崩盘",
        "influence_RN": {
          "redstone": [-0.4, -0.2, 0.4, 1.6],
          "equipment": [-0.2, -0.1, 0.4, 1.6]
        }
      },
      {
        "weights": 2,
        "description": "大规模怪物反攻，实体与武器类物品全面涨价",
        "influence_RN": {
          "entity": [0.3, 0.5, 0.4, 1.6],
          "weapon": [0.25, 0.4, 0.4, 1.6]
        }
      },
      {
        "weights": 1,
        "description": "服务器极度内卷，基础与默认类物价均下滑",
        "influence_RN": {
          "basic": [-0.3, -0.15, 0.4, 1.6],
          "default": [-0.2, -0.1, 0.4, 1.6]
        }
      }
]


if (USE_RN_SYSTEM) {
    //随机化所有物价指数0.8-1.2
    for(let i = 0; i < Object.keys(single_RN).length; i++) {
        if (Object.keys(single_RN)[i] == "default") continue;
        if (Object.keys(single_RN)[i] == "basic") continue;
        let ratio = Math.random() * 0.4 + 0.8;
        single_RN[Object.keys(single_RN)[i]] = ratio.toFixed(2);
    }
    system.runInterval(() => {
        //获取所有权重
        let all_weights = 0;
        for(let i = 0; i < event.length; i++) {
            all_weights = all_weights + event[i].weights;
        }
        //获取0到权重总和的随机数
        let random_num = Math.random() * all_weights;
        //根据随机数确定是哪个事件
        let event_num = 0;
        for(let i = 0; i < event.length; i++) {
            random_num = random_num - event[i].weights;
            if (random_num <= 0) {
                event_num = i;
                break;
            }
        }
        //根据事件对物价指数进行调整,
        for(let i = 0; i < Object.keys(event[event_num].influence_RN).length; i++) {
            let key = Object.keys(event[event_num].influence_RN)[i];
            let ratio_min = event[event_num].influence_RN[key][0];
            let ratio_max = event[event_num].influence_RN[key][1];
            if (ratio_min > ratio_max) {
                let temp = ratio_min;
                ratio_min = ratio_max;
                ratio_max = temp;
            }
            let min = event[event_num].influence_RN[key][2];
            let max = event[event_num].influence_RN[key][3];
            if (min > max) {
                let temp = min;
                min = max;
                max = temp;
            }
            let ratio = Math.random() * (ratio_max - ratio_min) + ratio_min;
            let new_RN = (single_RN[key] * (1 + ratio)).toFixed(2);
            if (new_RN < min) new_RN = min.toFixed(2);
            if (new_RN > max) new_RN = max.toFixed(2);
            world.sendMessage("§7" + event[event_num].description + "，" +
                single_RN_name[Object.keys(event[event_num].influence_RN)[0]] + "品类物价指数从" +
                single_RN[key] + "调整为" + new_RN)
            single_RN[key] = new_RN;
        }

    },12000)
}

system.runInterval(() => {

},100)

system.runInterval(() => {
    if (world.getDynamicProperty("shop_TIME") == undefined) {
        world.setDynamicProperty("shop_TIME",GetDate());
    }
    if (world.getDynamicProperty("shop_player_data") == null) {
        world.setDynamicProperty("shop_player_data",JSON.stringify({"shop":{},"recycle":{}}));
    }
    if (world.getDynamicProperty("shop_TIME") != GetDate()) {
        world.setDynamicProperty("shop_TIME",GetDate());
        world.setDynamicProperty("shop_player_data",JSON.stringify({"shop":{},"recycle":{}}));
        world.sendMessage("§a 服务器商店交易数量限制已重置！")
    }
},1200)

const GUI = {
    ShopMain(player) {
        const ShopMainForm = new ActionFormData()
            .title("服务器商店")
            .body("§l===========================\n"+
                "§r§e欢迎光临服务器官方商店！\n"+
                "目前服务器的基础物价指数为： §6§l" + single_RN.basic+
                "\n§r§e目前您的" + MoneyShowName + "余额为： §6§l" + GetScore("money",player.nameTag) +"\n"+
                "§r§c请根据自己需求理性购物！\n"+
                "§r§l===========================")
            .button("返回上一级","textures/ui/wysiwyg_reset")
            .button("查看物价指数\n查看当前服务器的物价指数！", "textures/ui/worldsIcon")
            .button("售卖物品商店\n在这里售卖各式各样的物品！", "textures/ui/store_home_icon")
            .button("回收物品商店\n在这里回收各式各样的物品！", "textures/ui/icon_deals")
            .button("玩家称号商店\n在这里购买各种称号！", "textures/ui/icon_armor")
        ShopMainForm.show(player).then((response) => {
            if (response.canceled) return;
            switch (response.selection) {
                case 0:
                    Main(player);
                    break;
                case 1:
                    this.ShowRN(player);
                    break;
                case 2:
                    this.ShopPurchase(player);
                    break;
                case 3:
                    this.ShopRecycle(player);
                    break;
                case 4:
                    TitleGUI.TitleShop(player);
                    break;
            }
        })
    },

    ShowRN(player) {
        const ShowRNForm = new ActionFormData()
        .title("服务器物价指数")
        let bodu_content = "§l===========================\n"+
        "§r§e欢迎查看服务器的物价指数！\n"+
        "§r§e当前服务器的§c基础物价指数§e为： §6§l" + single_RN.basic + "\n" +
        "§r§e物价指数用于调整商店物品的价格\n"+
        "§r§e物价指数越高，商店物品价格越高，反之亦然\n\n"
        for(let i = 0; i < Object.keys(single_RN).length; i++) {
            if (Object.keys(single_RN)[i] == "default") continue;
            if (Object.keys(single_RN)[i] == "basic") continue;
            bodu_content = bodu_content + "§r§c" +
            single_RN_name[Object.keys(single_RN)[i]] + "品类§e的物价指数为： §6§l" + single_RN[Object.keys(single_RN)[i]] + "\n"
        }
        bodu_content = bodu_content + "§r§l==========================="
        ShowRNForm.body(bodu_content);
        ShowRNForm.button("返回上一级","textures/ui/wysiwyg_reset")
        ShowRNForm.show(player).then((response) => {
            if (response.canceled) return;
            this.ShopMain(player);
        })
    },

    ShopPurchase(player) {
        //定义商店售卖页面菜单
        for(let i = 0; i < SellData.length; i++) {
            for(let j = 0; j < SellData[i].content.length; j++) {
                if(SellData[i].content[j].discount != 1 && SellData[i].content[j].discount_end_time != "-1") {
                    if (SellData[i].content[j].discount_end_time < GetTime()) {
                        SellData[i].content[j].discount = 1;
                    }
                }
            }
        }
        const ShopPurchaseForm = new ActionFormData()
            .title("服务器商店")
            .body("§l===========================\n"+
                "§r§e欢迎光临服务器官方商店！\n"+
                "目前服务器的物价指数为： §6§l" + single_RN.basic + "\n" +
                "§r§e目前您的" + MoneyShowName +
                "余额为： §6§l" + GetScore("money",player.nameTag) + "\n" +
                "§r§c§l带有◆的商品价格不受物价指数影响" + "\n" +
                "§r§l===========================")
            .button("返回上一级","textures/ui/wysiwyg_reset")
            for(let i = 0; i < SellData.length; i++) {
                ShopPurchaseForm.button(SellData[i].name + "\n" + SellData[i].description,SellData[i].image)
            }
        ShopPurchaseForm.show(player).then((response) => {
            if (response.canceled) return;
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
            .title("服务器商店")
            .body("§l===========================\n"+
                "§r§e欢迎光临服务器官方商店！\n目前服务器的物价指数为： §6§l" +
                single_RN.basic+
                "\n§r§e目前您的" +
                MoneyShowName +
                "余额为： §6§l" +
                GetScore("money",player.nameTag) +
                "\n§r§c§l带有◆的商品价格不受物价指数影响\n"+
                "§r§l===========================")
            .button("返回上一级","textures/ui/wysiwyg_reset")
        for(let i = 0; i < SellData[index1].content.length; i++) {
            let button_content = "";
            let influence_by_RN = true;
            let discount = 1;
            let merchandise = SellData[index1].content[i];
            let price = merchandise.price;
            //判断type
            switch(merchandise.type) {
                case "item" || "special_item":
                    //判断是否有"influence_by_RN"属性
                    if (!merchandise.influence_by_RN) {
                        button_content = "§c◆§r"
                        influence_by_RN = false;
                    }
                    //判断是否有"discount"属性
                    if (merchandise.hasOwnProperty("discount") &&
                    merchandise.discount != 1) {
                        button_content = button_content + "§c[限时优惠]§r"
                        discount = merchandise.discount;
                    }
                    if (merchandise.lim_num) {
                        button_content = button_content + "§c[单日限购]§r"
                    }
                    button_content = button_content + merchandise.name + "\n"
                    if (merchandise.lim_num) {
                        button_content = button_content + "限购§9" + merchandise.lim_num + "§r个 "
                    }
                    //判断是否有item_type属性，如果有属性是否在single_RN中
                    if (influence_by_RN) {
                        if (merchandise.item_type && single_RN[merchandise.item_type]) {
                            price = price * single_RN.basic * single_RN[merchandise.item_type];
                        } else {
                            price = price * single_RN.basic * single_RN["default"];
                        }
                    }
                    if (discount != 1) {
                        button_content = button_content +
                        "原价：§9" + Math.ceil(price) +
                        "§r 现价：§9" + Math.ceil(price * discount)
                    } else {
                        button_content = button_content +
                        "价格：§9" + Math.ceil(price)
                    }
                    break;
                default:
                    button_content = "商店物品类型解析出错\n请联系管理员处理";
                    break;
            }
            if (merchandise.hasOwnProperty("image")) {
                ShopPurchaseSubForm.button(button_content,merchandise.image)
            } else {
                ShopPurchaseSubForm.button(button_content)
            }
        }
        ShopPurchaseSubForm.show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0) {
                this.ShopPurchase(player)
            } else {
                this.ShopBuy(player,index1,response.selection - 1)
            }
        })
    },

    ShopBuy(player, index1, index2) {
        const merchandise = SellData[index1].content[index2];
        let influence_by_RN = merchandise.hasOwnProperty("influence_by_RN") ? merchandise.influence_by_RN : true;
        let discount = (merchandise.hasOwnProperty("discount") && merchandise.discount !== 1) ? merchandise.discount : 1;

        let price = merchandise.price;
        if (influence_by_RN) {
            if (merchandise.item_type && single_RN[merchandise.item_type]) {
                price = price * single_RN.basic * single_RN[merchandise.item_type];
            } else {
                price = price * single_RN.basic * single_RN["default"];
            }
        }
        price *= discount;

        let can_buy_num = Math.floor(GetScore("money", player.nameTag) / Math.ceil(price));
        if (merchandise.lim_num) {
            let shopPlayerData = JSON.parse(world.getDynamicProperty("shop_player_data")).shop;
            let remaining = merchandise.lim_num;
            if (shopPlayerData[player.nameTag]?.[merchandise.type_id]) {
                remaining -= shopPlayerData[player.nameTag][merchandise.type_id];
            }
            can_buy_num = Math.min(can_buy_num, remaining);
        }
        if (can_buy_num <= 0) {
            player.sendMessage(`§c 购买失败！原因是您的${MoneyShowName}不足或达到了购买上限！`);
            system.runTimeout(() => this.ShopPurchaseSub(player, index1), 20);
            return;
        }

        const ShopBuyForm = new ModalFormData()
            .title(`§c§l购买数量确认: ${merchandise.name}`)
            .textField(
                `\n§c§l当前最大可购买数量: ${can_buy_num} 个\n\n§r请输入购买数量`,
                "只能输入正整数"
            );

        ShopBuyForm.show(player).then((result) => {
            if (result.canceled) {
                this.ShopPurchaseSub(player, index1);
                return;
            }
            const input = parseInt(result.formValues[0]);
            if (isNaN(input) || input <= 0) {
                player.sendMessage(`§c 错误数字格式，请重新输入！`);
                system.runTimeout(() => this.ShopBuy(player, index1, index2), 20);
                return;
            }
            if (input > can_buy_num) {
                player.sendMessage(`§c 购买数量超过可买上限，原因可能是达到购买上限或${MoneyShowName}不足，请重新输入！`);
                system.runTimeout(() => this.ShopBuy(player, index1, index2), 20);
                return;
            }
            if (input > 1024) {
                player.sendMessage(`§c 单次购买数量上限是1024，请重新输入！`);
                system.runTimeout(() => this.ShopBuy(player, index1, index2), 20);
                return;
            }
            let item = new ItemStack(merchandise.type_id);
            if (player.getComponent(EntityComponentTypes.Inventory).container.emptySlotsCount < input / item.maxAmount) {
                player.sendMessage(`§c 购买失败！您的背包空间不足，请至少清理 ${Math.ceil(input / item.maxAmount)} 格后再次尝试购买！`);
                return;
            }
            this.ShopBuySub(player, index1, index2, input, Math.ceil(price));
        });
    },

    ShopBuySub(player,i,j,num,price) {
        const ShopBuySubForm = new MessageFormData()
            .title("§c§l确认购买 " + SellData[i].content[j].name)
            .body("§e您确定要以 §l" +
                price * num +
                "§r§e "+ MoneyShowName + "，购买 §l" + num + " §r§e个" + SellData[i].content[j].name +
                "?\n§c§l注意：所有商品一旦售出概不退换！")
            .button1("§c§l返回数量确认界面")
            .button2("§a§l确定购买商品")
        ShopBuySubForm.show(player).then((result) => {
            if (result.canceled) return;
            if (result.selection == 1) {
                let merchandise = SellData[i].content[j];
                switch(merchandise.type) {
                    case "item":
                        let item = new ItemStack(merchandise.type_id);
                        if (merchandise.hasOwnProperty("lores")) item.setLore(merchandise.lores);
                        if (merchandise.hasOwnProperty("enchs")) {
                            merchandise.enchs.forEach(ench => {
                                item.getComponent(ItemComponentTypes.Enchantable).addEnchantment(
                                    {type: new EnchantmentType(ench.type), level: ench.level}
                                );
                            });
                        }
                        if (merchandise.damage) item.getComponent(ItemComponentTypes.Durability).damage = merchandise.damage;
                        if (merchandise.name_tag) item.nameTag = merchandise.name_tag;
                        if (merchandise.lim_num) {
                            let shop_data = JSON.parse(world.getDynamicProperty("shop_player_data")).shop;
                            let recycle_data = JSON.parse(world.getDynamicProperty("shop_player_data")).recycle;
                            if (!shop_data[player.nameTag]) shop_data[player.nameTag] = {};
                            if (!shop_data[player.nameTag][merchandise.type_id]) shop_data[player.nameTag][merchandise.type_id] = 0;
                            shop_data[player.nameTag][merchandise.type_id] += num;
                            world.setDynamicProperty("shop_player_data", JSON.stringify({"shop": shop_data, "recycle": recycle_data}));
                        }
                        let fullStacks = Math.floor(num / item.maxAmount);
                        for (let i = 0; i < fullStacks; i++) {
                            const fullItem = item.clone();
                            fullItem.amount = item.maxAmount;
                            player.getComponent(EntityComponentTypes.Inventory).container.addItem(fullItem);
                        }
                        const remainder = num % item.maxAmount;
                        if (remainder > 0) {
                            const remainderItem = item.clone();
                            remainderItem.amount = remainder;
                            player.getComponent(EntityComponentTypes.Inventory).container.addItem(remainderItem);
                        }
                        world.scoreboard.getObjective(MoneyScoreboardName).addScore(player, -price * num);
                        player.sendMessage(`§a 购买成功！您以§e§l${price * num}§r§a${MoneyShowName}，成功购买§e§l${num}§r§a个§e${merchandise.name}§r§a!期待您的下次光临！`);
                        system.runTimeout(() => this.ShopPurchaseSub(player, i), 20);
                        break;
                    case "special_item":
                        if (merchandise.lim_num) {
                            let shop_data = JSON.parse(world.getDynamicProperty("shop_player_data")).shop;
                            let recycle_data = JSON.parse(world.getDynamicProperty("shop_player_data")).recycle;
                            if (!shop_data[player.nameTag]) shop_data[player.nameTag] = {};
                            if (!shop_data[player.nameTag][merchandise.type_id]) shop_data[player.nameTag][merchandise.type_id] = 0;
                            shop_data[player.nameTag][merchandise.type_id] += num;
                            world.setDynamicProperty("shop_player_data", JSON.stringify({"shop": shop_data, "recycle": recycle_data}));
                        }
                        world.scoreboard.getObjective(MoneyScoreboardName).addScore(player, -price * num);
                        let cmd = `give "${player.nameTag}" ${merchandise.type_id} ${num}`;
                        if (merchandise.hasOwnProperty("item_data")) cmd += ` ${merchandise.item_data}`;
                        if (merchandise.hasOwnProperty("item_data") &&
                            merchandise.hasOwnProperty("item_json")) cmd += ` ${merchandise.item_json}`;
                        RunCmd(cmd);
                        player.sendMessage(`§a 购买成功！您以§e§l${price * num}§r§a${MoneyShowName}，成功购买§e§l${num}§r§a个§e${merchandise.name}§r§a!期待您的下次光临！`);
                        system.runTimeout(() => this.ShopPurchaseSub(player, i), 20);
                        break;
                    default:
                        player.sendMessage("§c 购买失败！原因是商品类型解析出错，请联系管理员处理！")
                        break;
                }
            } else {
                this.ShopBuy(player,i,j);
            }

        })
    },



    /////////////////////////////////////////////
    ShopRecycle(player) {
        //定义商店回收页面菜单
        const ShopRecycleForm = new ActionFormData()
            .title("回收商店")
            .body("§l===========================\n"+
                "§r§e欢迎光临服务器官方回收商店！\n"+
                "目前服务器的物价指数为： §6§l" + single_RN.basic+ "\n" +
                "§r§e目前您的" + MoneyShowName +
                "余额为： §6§l" + GetScore("money",player.nameTag) + "\n" +
                "§r§l===========================")
            .button("返回上一级","textures/ui/wysiwyg_reset")
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
            .title("回收商店")
            .body("§l===========================\n"+
                "§r§e欢迎光临服务器官方回收商店！\n"+
                "目前服务器的物价指数为： §6§l" + single_RN.basic+
                "\n§r§e目前您的" + MoneyShowName +
                "余额为： §6§l" + GetScore("money",player.nameTag) + "\n" +
                "§r§c§l带有◆的商品价格不受物价指数影响\n"+
                "§r§l===========================")
            .button("返回上一级","textures/ui/wysiwyg_reset")
        for(let i = 0; i < RecycleData[index1].content.length; i++) {
            let button_content = "";
            let influence_by_RN = true;
            let recycle_item = RecycleData[index1].content[i];
            let price = recycle_item.price;
            //判断type
            switch(recycle_item.type) {
                case "item":
                    if (!recycle_item.influence_by_RN) {
                        button_content = "§c◆§r"
                        influence_by_RN = false;
                    }
                    if (recycle_item.lim_num) {
                        button_content = button_content + "§c[单日回收数量限制]§r"
                    }
                    button_content = button_content + recycle_item.name + "\n"
                    if (recycle_item.lim_num) {
                        button_content = button_content + "单日回收限制§9" + recycle_item.lim_num + "§r个 "
                    }
                    if (influence_by_RN) {
                        if (recycle_item.item_type && single_RN[recycle_item.item_type]) {
                            price = price * single_RN.basic * single_RN[recycle_item.item_type];
                        } else {
                            price = price * single_RN.basic * single_RN["default"];
                        }
                    }
                    button_content = button_content +"回收单价：§9" + Math.ceil(price)
                    break;
                default:
                    button_content = "商店物品类型解析出错\n请联系管理员处理";
                    break;
            }
            if (recycle_item.hasOwnProperty("image")) {
                ShopRecycleSubForm.button(button_content,recycle_item.image)
            } else {
                ShopRecycleSubForm.button(button_content)
            }
        }
        ShopRecycleSubForm.show(player).then((response) => {
            if (response.canceled) return;
            if (response.selection == 0) {
                this.ShopRecycle(player)
            } else {
                this.ShopSell(player,index1,response.selection - 1)
            }
        })
    },

    ShopSell(player,index1,index2) {
        let recycle_item = RecycleData[index1].content[index2];
        switch(recycle_item.type) {
            case "item":
                let can_recycle_num = 0;
                for (let i = 0; i < 36; i++) {
                    if (player.getComponent(EntityComponentTypes.Inventory).container.getItem(i) != undefined
                    && player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).typeId == recycle_item.type_id
                    && player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).lockMode == "none") {
                        can_recycle_num = can_recycle_num + player.getComponent(EntityComponentTypes.Inventory).container.getItem(i).amount;
                    }
                }
                if (recycle_item.lim_num) {
                    let recycle_data = JSON.parse(world.getDynamicProperty("shop_player_data")).recycle;
                    let remaining = recycle_item.lim_num;
                    if (recycle_data[player.nameTag]?.[recycle_item.type_id]) {
                        remaining -= recycle_data[player.nameTag][recycle_item.type_id];
                    }
                    if (can_recycle_num > remaining) can_recycle_num = remaining;
                }
                if (can_recycle_num != 0) {
                    const ShopSellForm = new ModalFormData()
                    .title("§c§l确认回收 " + recycle_item.name + " 的数量")
                    .textField(`\n§c§l当前最大可回收数量: ${can_recycle_num} 个\n\n§r请输入要回收的数量`,
                        "只能输入正整数")
                    .show(player).then((result) => {
                        if (result.canceled) {
                            this.ShopRecycleSub(player, index1);
                            return;
                        }
                        const input = parseInt(result.formValues[0]);
                        if (isNaN(input) || input <= 0) {
                            player.sendMessage(`§c 错误数字格式，请重新输入！`);
                            system.runTimeout(() => this.ShopSell(player, index1, index2), 20);
                            return;
                        }
                        if (input > can_recycle_num) {
                            player.sendMessage(`§c 回收数量超过可回收上限，原因可能是达到回收上限或背包中物品数量不够，请重新输入！`);
                            system.runTimeout(() => this.ShopSell(player, index1, index2), 20);
                            return;
                        }
                        this.ShopSellSub(player, index1, index2, input);
                    })
                } else {
                    player.sendMessage("§c 回收失败！原因是没有在您的背包中找到相应物品或达到了物品单日回收上限！")
                    system.runTimeout(() => this.ShopRecycleSub(player, index1), 20);
                }
                break;
            default:
                player.sendMessage("§c 回收失败！原因是商品类型解析出错，请联系管理员处理！")
                break;
        }
    },

    //开始发送确认回收的表单
    ShopSellSub(player,index1,index2,num) {
        let recycle_item = RecycleData[index1].content[index2];
        switch(recycle_item.type) {
            case "item":
                let price = recycle_item.price;
                let influence_by_RN = recycle_item.hasOwnProperty("influence_by_RN") ? recycle_item.influence_by_RN : true;
                if (influence_by_RN) {
                    if (recycle_item.item_type && single_RN[recycle_item.item_type]) {
                        price = price * single_RN.basic * single_RN[recycle_item.item_type];
                    } else {
                        price = price * single_RN.basic * single_RN["default"];
                    }
                }
                price = Math.ceil(price);
                const ShopSellSubForm = new MessageFormData()
                    .title("§c§l确认回收 " + recycle_item.name)
                    .body("§e您确定要以 §l" + price * num + "§r§e " +
                        MoneyShowName + "的报酬，回收 §l" + num + " §r§e个" + recycle_item.name + "?\n"+
                        "§c§l注意：所有商品一旦回收无法逆转！")
                    .button1("§c§l取消")
                    .button2("§a§l确定回收")
                    .show(player).then((result) => {
                        if (result.canceled) return;
                        switch(result.selection) {
                            case 1:
                                //首先进行判断是否有限制，有限制就直接写入相关数据
                                if (recycle_item.lim_num) {
                                    let recycle_data = JSON.parse(world.getDynamicProperty("shop_player_data")).recycle;
                                    let shop_data = JSON.parse(world.getDynamicProperty("shop_player_data")).shop;
                                    if (!recycle_data[player.nameTag]) recycle_data[player.nameTag] = {};
                                    if (!recycle_data[player.nameTag][recycle_item.type_id]) recycle_data[player.nameTag][recycle_item.type_id] = 0;
                                    recycle_data[player.nameTag][recycle_item.type_id] += num;
                                    world.setDynamicProperty("shop_player_data", JSON.stringify({"shop": shop_data, "recycle": recycle_data}));
                                }
                                //然后进行扣除物品的操作
                                if (recycle_item.item_data) {
                                    RunCmd(`clear @a[name="${player.nameTag}"] ${recycle_item.type_id} ${recycle_item.item_data} ${num}`)
                                } else {
                                    RunCmd(`clear @a[name="${player.nameTag}"] ${recycle_item.type_id} -1 ${num}`)
                                }
                                //最后进行给予货币的操作
                                world.scoreboard.getObjective(MoneyScoreboardName).addScore(player, price * num);
                                player.sendMessage(`§a 回收成功！您以§e§l${price * num}§r§a${MoneyShowName}，成功回收§e§l${num}§r§a个§e${recycle_item.name}§r§a!期待您的下次光临！`);
                                system.runTimeout(() => this.ShopRecycleSub(player, index1), 20);
                                break;
                            case 0:
                                player.sendMessage("§c 回收失败！原因是您自己取消了本次回收！")
                                break;
                        }
                    })
                break;
            default:
                player.sendMessage("§c 回收失败！原因是商品类型解析出错，请联系管理员处理！")
                break;
        }
    }
}


export const ShopGUI = GUI

