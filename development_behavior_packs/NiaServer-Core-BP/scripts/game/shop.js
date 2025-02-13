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
            // //遍历SellData数据
            // for(let i = 0; i < SellData.length; i++) {
            //     for(let j = 0; j < SellData[i].content.length; j++) {
            //         //删除其中的data键
            //         delete SellData[i].content[j].data;
            //         //添加type键
            //         SellData[i].content[j].type = "item";
            //         //添加influence_by_RN键
            //         SellData[i].content[j].influence_by_RN = true;
            //         //添加item_type键
            //         SellData[i].content[j].item_type = "default";
            //     }
            // }
            // //遍历RecycleData数据
            // for(let i = 0; i < RecycleData.length; i++) {
            //     for(let j = 0; j < RecycleData[i].content.length; j++) {
            //         //删除其中的lim键
            //         delete RecycleData[i].content[j].lim;
            //         //添加type键
            //         RecycleData[i].content[j].type = "item";
            //         //添加influence_by_RN键
            //         RecycleData[i].content[j].influence_by_RN = true;
            //         //添加item_type键
            //         RecycleData[i].content[j].item_type = "default";
            //     }
            // }

            // fs.OverwriteJsonFile("shop_data.json",{"sell_data":SellData,"recycle_data":RecycleData})
        }
    })
})

var basic_RN = 1.0;//基础物价指数

var single_RN = {
    "mineral": 1.2,//矿物
    "weapon": 1.5,//武器
    "equipment": 1.8,//装备
    "vegetative": 1.0,//植物
    "entity": 1.0,//实体
    "redstone": 1.5,//红石
    "enchanted_book": 2.0,//附魔书
    "block": 1.0,//方块
    "prop": 1.0,//道具
    "default": 1.0//默认
}


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
                "目前服务器的基础物价指数为： §6§l" + basic_RN+
                "\n§r§e目前您的" + MoneyShowName + "余额为： §6§l" + GetScore("money",player.nameTag) +"\n"+
                "§r§c请根据自己需求理性购物！\n"+
                "§r§l===========================")
            .button("返回上一级","textures/ui/wysiwyg_reset")
            .button("查看今日折扣商品\n立即查看现在的折扣商品！")
            .button("售卖物品商店\n在这里售卖各式各样的物品！")
            .button("回收物品商店\n在这里回收各式各样的物品！")
            .button("称号商店\n在这里购买各种称号！")
        ShopMainForm.show(player).then((response) => {
            if (response.canceled) return;
            switch (response.selection) {
                case 0:
                    Main(player);
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
                    TitleGUI.TitleShop(player);
                    break;
            }
        })
    },

    Discount(player) {
        for(let i = 0; i < SellData.length; i++) {
            for(let j = 0; j < SellData[i].content.length; j++) {
                if(SellData[i].content[j].discount != 1 && SellData[i].content[j].discount_end_time != "-1") {
                    if (SellData[i].content[j].discount_end_time < GetTime()) {
                        SellData[i].content[j].discount = 1;
                    }
                }
            }
        }
        const DiscountForm = new ActionFormData()
        DiscountForm.title("今日折扣")
        let Str = "§l===========================§r\n"+
        "§e§l每天各个物品的折扣\n" +
        "可能根据市场有所变动！\n"+
        "§r§l===========================§r\n"
        let num = 1;
        for(let i = 0; i < SellData.length; i++) {
            for(let j = 0; j < SellData[i].content.length; j++) {
                if(SellData[i].content[j].discount != 1) {
                    Str = Str + "§r§c"+
                    num + ".§r§e" +
                    SellData[i].content[j].name + " §6" +
                    SellData[i].content[j].discount * 10 + "§e折 折后价格：§6" +
                    parseInt(
                        SellData[i].content[j].price *
                        SellData[i].content[j].discount *
                        basic_RN *
                        single_RN[SellData[i].content[j].item_type]
                    ) +"\n§r"
                    num++
                }
            }
        }
        DiscountForm.body(Str +
            "§l===========================\n§c" +
            "【广告】广告位招商\n详情咨询腐竹！" +
            "\n§r§l===========================")
        DiscountForm.button("返回上一级","textures/ui/wysiwyg_reset")
        DiscountForm.show(player).then((result) => {
            if (result.selection == 0) {
                this.ShopMain(player)
            }
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
                "目前服务器的物价指数为： §6§l" + basic_RN + "\n" +
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
                basic_RN+
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

                    if (influence_by_RN) price = price * basic_RN * single_RN[merchandise.item_type];
                    if (discount != 1) {
                        button_content = button_content +
                        "原价：§9" + parseInt(price) +
                        "§r 现价：§9" + parseInt(price * discount)
                    } else {
                        button_content = button_content +
                        "价格：§9" + parseInt(price)
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
        if (influence_by_RN) price *= basic_RN * single_RN[merchandise.item_type];
        price *= discount;

        let can_buy_num = Math.floor(GetScore("money", player.nameTag) / price);
        if (merchandise.lim_num) {
            let shopPlayerData = JSON.parse(world.getDynamicProperty("shop_player_data"));
            let remaining = merchandise.lim_num;
            if (shopPlayerData.shop[player.nameTag]?.[merchandise.type_id]) {
                remaining -= shopPlayerData.shop[player.nameTag][merchandise.type_id];
            }
            can_buy_num = Math.min(can_buy_num, remaining);
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
            this.ShopBuySub(player, index1, index2, input, price);
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
                            let shop_player_data = JSON.parse(world.getDynamicProperty("shop_player_data"));
                            if (!shop_player_data.shop[player.nameTag]) shop_player_data.shop[player.nameTag] = {};
                            if (!shop_player_data.shop[player.nameTag][merchandise.type_id]) shop_player_data.shop[player.nameTag][merchandise.type_id] = 0;
                            shop_player_data.shop[player.nameTag][merchandise.type_id] += num;
                            world.setDynamicProperty("shop_player_data", JSON.stringify(shop_player_data));
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
                        break;
                    case "special_item":
                        if (merchandise.lim_num) {
                            let shop_player_data = JSON.parse(world.getDynamicProperty("shop_player_data"));
                            if (!shop_player_data.shop[player.nameTag]) shop_player_data.shop[player.nameTag] = {};
                            if (!shop_player_data.shop[player.nameTag][merchandise.type_id]) shop_player_data.shop[player.nameTag][merchandise.type_id] = 0;
                            shop_player_data.shop[player.nameTag][merchandise.type_id] += num;
                            world.setDynamicProperty("shop_player_data", JSON.stringify(shop_player_data));
                        }
                        world.scoreboard.getObjective(MoneyScoreboardName).addScore(player, -price * num);
                        let cmd = `give "${player.nameTag}" ${merchandise.type_id} ${num}`;
                        if (merchandise.hasOwnProperty("item_data")) cmd += ` ${merchandise.item_data}`;
                        if (merchandise.hasOwnProperty("item_data") &&
                            merchandise.hasOwnProperty("item_json")) cmd += ` ${merchandise.item_json}`;
                        RunCmd(cmd);
                        player.sendMessage(`§a 购买成功！您以§e§l${price * num}§r§a${MoneyShowName}，成功购买§e§l${num}§r§a个§e${merchandise.name}§r§a!期待您的下次光临！`);
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
                "目前服务器的物价指数为： §6§l" + basic_RN+ "\n" +
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
                "目前服务器的物价指数为： §6§l" + basic_RN+
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

                    if (influence_by_RN) price = price * basic_RN * single_RN[recycle_item.item_type];
                    button_content = button_content +"回收单价：§9" + parseInt(price)
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
                if (influence_by_RN) price = recycle_item.price * basic_RN * single_RN[recycle_item.item_type];
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
                                    if (!recycle_data[player.nameTag]) recycle_data[player.nameTag] = {};
                                    if (!recycle_data[player.nameTag][recycle_item.type_id]) recycle_data[player.nameTag][recycle_item.type_id] = 0;
                                    recycle_data[player.nameTag][recycle_item.type_id] += num;
                                    world.setDynamicProperty("shop_player_data", JSON.stringify({recycle: recycle_data}));
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

