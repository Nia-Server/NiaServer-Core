import { world } from '@minecraft/server';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { Tell,RunCmd,GetScore,log } from '../customFunction.js'
import { Main } from './main.js';
import { ExternalFS } from '../API/filesystem';

const fs = new ExternalFS();
var SellData = [];
var RecycleData = [];

//商店数据读取

//服务器启动监听&&获得商店数据
world.afterEvents.worldInitialize.subscribe(() => {
    const start = Date.now();
    fs.GetJSONFileData("shop_data.json").then((result) => {
        //文件不存在
        if (result === 0) {
            fs.CreateNewJsonFile("shop_data.json",{"sell_data":[],"recycle_data":[]}).then((result) => {
                if (result === "success") {
                    console.warn("[NIA V4.5] The shop raw data was not read successfully, the initialisation data file has been created successfully, please open shop_data.json to modify it and enter reload to reload it!");
                } else if (result === -1) {
                    console.error("[NIA V4.5] Dependency server connection failed!");
                }
            });
        } else if (result === -1) {
            console.error("[NIA V4.5] Dependency server connection failed!");
        } else {
            SellData = result.sell_data;
            RecycleData = result.recycle_data;
            log("The shop data acquisition successful!");
        }
    })
})

const GUI = {
    ShopMain(player) {
        const ShopMainForm = new ActionFormData()
            .title("§e§l服务器商店")
            .body("§l===========================\n§r§e欢迎光临服务器官方商店！\n目前服务器的物价指数为： §6§l" + GetScore("DATA","RN")/100 + "\n§r§e目前您的能源币余额为： §6§l" + GetScore("money",player.nameTag) + "\n§r§c请根据自己需求理性购物！\n§r§l===========================")
            .button("§c返回上一级")
            .button("查看今日折扣商品\n§7立即查看现在的折扣商品！")
            .button("售卖物品商店\n§7在这里售卖各式各样的物品！")
            .button("回收物品商店\n§7在这里回收各式各样的物品！")
        ShopMainForm.show(player).then((response) => {
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
                player.sendMessage(`§c 错误的数字格式，请重新输入！`)
                // Tell(`§c 错误的数字格式，请重新输入！`,player.nameTag)
                this.ShopBuy(player,index1,index2)
            } else if (parseInt(result.formValues[0]) >= 1025) {
                player.sendMessage(`§c 单次购买物品的数量上限是1024，请重新输入！`);
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
                case 1:
                    if (GetScore("money",player.nameTag) >= parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num) {
                        RunCmd(`give "${player.nameTag}" ${SellData[i].content[j].type} ${num} ${SellData[i].content[j].data}`)
                        RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money -${parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num}`)
                        Tell("§a 购买成功！§e您以 §l" + parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num + "§r§e 能源币，成功购买 §l" + num + " §r§e个" + SellData[i].content[j].name + "!期待您的下次光临！",player.nameTag)
                    } else {
                        Tell(`§c 购买失败！余额不足，您的余额为 ${GetScore("money",player.nameTag)} 能源币，而本次购买需要 ${parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num} 能源币，您还缺少 ${parseInt(SellData[i].content[j].price * SellData[i].content[j].discount * GetScore("DATA","RN") / 100) * num - GetScore("money",player.nameTag)} 能源币，请在攒够足够能源币后尝试再次购买！`,player.nameTag)
                    }
                    break;
                case 0:
                    Tell("§c 购买失败！原因是您自己取消了本次购买！",player.nameTag)
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
        for (let i = 0; i < 36; i++) {
            if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined && player.getComponent("minecraft:inventory").container.getItem(i).typeId == RecycleData[index1].content[index2].type && player.getComponent("minecraft:inventory").container.getItem(i).lockMode == "none") {
                ItemNum = ItemNum + player.getComponent("minecraft:inventory").container.getItem(i).amount;
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
                            case 1:
                                this.ShopRecycleSub(player,index1);
                                break;
                            case 0:
                                Tell("§c 回收失败！原因是该物品已达到本日回收最大数量，请明天再次尝试回收哦！",player.nameTag)
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
                        case 1:
                            this.ShopRecycleSub(player,index1);
                            break;
                        case 0:
                            Tell("§c 回收失败！原因是没有在您的背包中找到相应物品！请检查背包后再次尝试！",player.nameTag)
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
                case 1:
                    //首先进行判断是否有限制，有限制就直接写入相关数据
                    if (RecycleData[index1].content[index2].lim) {
                        // PlayerRecycleData[player.nameTag][RecycleData[index1].content[index2].type] = PlayerRecycleData[player.nameTag][RecycleData[index1].content[index2].type] + num
                        RunCmd(`scoreboard players set ${RecycleData[index1].content[index2].type.slice(10)} R:${player.nameTag.slice(0,10)} ${GetScore(`R:${player.nameTag.slice(0,10)}`,RecycleData[index1].content[index2].type.slice(10)) + num}`)
                    }
                    //然后进行扣除物品的操作
                    RunCmd(`clear @a[name="${player.nameTag}"] ${RecycleData[index1].content[index2].type} ${RecycleData[index1].content[index2].data} ${num}`)
                    //然后执行加钱的操作！
                    RunCmd(`scoreboard players add @a[name="${player.nameTag}"] money ${parseInt(RecycleData[index1].content[index2].price * GetScore("DATA","RN") / 100) * num}`)
                    Tell(`§a 回收成功！您成功回收 §l${num}§r§a 个 §l${RecycleData[index1].content[index2].name}§r§a，并获得了 §l${parseInt(RecycleData[index1].content[index2].price * GetScore("DATA","RN") / 100) * num} §r§a能源币！期待您的下次光临！`,player.nameTag)
                    break;
                case 0:
                    Tell("§c 回收失败！原因是您自己取消了本次回收！",player.nameTag)
                    break;
            }
        })
    }
}

export const ShopGUI = GUI

