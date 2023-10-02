//玩家交易市场

import {system, world, ItemStack, Enchantment} from '@minecraft/server';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui';
import { GetTime, GetScore, log } from './customFunction';
import { adler32 } from './API/cipher_system';
import { ExternalFS } from './API/filesystem';

//违禁物品，等后期接入配置文件
const fs = new ExternalFS();
const BanItems = ["minecraft:paper","minecraft:clock"]
var MarketData = [];
var temp_player_money = {};

let start = Date.now();

//服务器启动监听&&获得玩家市场数据
world.afterEvents.worldInitialize.subscribe(() => {
    fs.GetJSONFileData("market.json").then((result) => {
        //文件不存在
        if (result === 0) {
            fs.CreateNewJsonFile("market.json",[]).then((result) => {
                if (result === "success") {
                    MarketData = [];
                    log("玩家市场文件不存在，已成功创建！");
                } else if (result === -1) {
                    console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                }
            });
        } else if (result === -1) {
            console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
        } else {
            //文件存在且服务器连接成功
            MarketData = result;
            log("玩家市场数据获取成功，本次读取用时：" + (Date.now() - start) + "ms");
        }
    })
    fs.GetJSONFileData("temp_player_money.json").then((result) => {
        if (result === 0) {
            fs.CreateNewJsonFile("temp_player_money.json",{}).then((result) => {
                if (result === "success") {
                    log("玩家金币数据文件不存在，已成功创建！");
                } else if (result === -1) {
                    console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                }
            });
        } else if (result === -1) {
            console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
        } else {
            //文件存在且服务器连接成功
            temp_player_money = result;
            log("(market)玩家金币数据获取成功，本次读取用时：" + (Date.now() - start) + "ms");
        }
    })

})


const GUI = {
    //市场主菜单
    Main(player) {
        fs.GetJSONFileData("market.json").then((result) => {
            //服务器连接失败
            if (result === -1) {
                const MainForm = new ActionFormData()
                    .title("§e§l服务器交易市场")
                    .body("§c§l服务器连接失败！无法获取玩家市场数据，请联系腐竹及时处理！")
                    .button("返回上一级")
                MainForm.show(player).then((response) => {
                    switch (response.selection) {
                        case 0:
                            break;
                    }
                })
            } else {
                //服务器连接成功
                MarketData = result;
                const MainForm = new ActionFormData()
                    .title("§e§l服务器交易市场")
                    .body("§c欢迎光临服务器交易市场\n市场中所有物品均由玩家自主上架，定价！")
                    .button("浏览市场")
                    .button("上架商品")
                    .button("管理商品")
                    .button("返回上一级")
                MainForm.show(player).then((response) => {
                    switch (response.selection) {
                        case 0:
                            this.Market(player);
                            break;
                        case 1:
                            this.Shelf(player);
                            break;
                        case 2:
                            this.Manage(player);
                            break;
                        case 3:

                            break;
                    }
                })
            }
        })
    },

    //市场
    Market(player) {
        let CanBuyCommodities = [];
        const MarketForm = new ActionFormData()
            .title("服务器交易市场")
            .body("§c欢迎光临服务器交易市场")
            .button("搜索物品")
        for (let i = 0; i < MarketData.length; i ++) {
            if (MarketData[i].state) {
                MarketForm.button(MarketData[i].name + "\n单价: " + MarketData[i].price + " 库存数量: " + MarketData[i].amount)
                CanBuyCommodities.push(MarketData[i])
                //console.log(JSON.stringify(CanBuyCommodities))
            }
        }
        MarketForm.show(player).then((response) => {
            if (response.canceled) {
                this.Main(player)
            } else if (response.selection == 0) {
                player.sendMessage("§c>> 该功能正在开发中，敬请期待！");
            } else {
                let pre_item_data = {};
                const MarketSubForm = new ActionFormData()
                    .title("商品详情页")
                    if (CanBuyCommodities[response.selection - 1].Hasdamage == true || CanBuyCommodities[response.selection - 1].Hasench == false) {
                        MarketSubForm.body(`商品名称: ${CanBuyCommodities[response.selection - 1].name} (${CanBuyCommodities[response.selection - 1].typeid}) \n商品简介: ${CanBuyCommodities[response.selection - 1].description} \n商品单价: ${CanBuyCommodities[response.selection - 1].price}\n商品剩余库存: ${CanBuyCommodities[response.selection - 1].amount}\n商品上架人: ${CanBuyCommodities[response.selection - 1].playerName}\n商品流水号: ${CanBuyCommodities[response.selection - 1].id}\n已消耗耐久度:${CanBuyCommodities[response.selection - 1].damage}\n拥有的附魔：${JSON.stringify(CanBuyCommodities[response.selection - 1].ench)} `);
                        pre_item_data = CanBuyCommodities[response.selection - 1];
                        // log(JSON.stringify(pre_item_data));
                    } else {
                        MarketSubForm.body(`商品名称: ${CanBuyCommodities[response.selection - 1].name} (${CanBuyCommodities[response.selection - 1].typeid}) \n商品简介: ${CanBuyCommodities[response.selection - 1].description} \n商品单价: ${CanBuyCommodities[response.selection - 1].price}\n商品剩余库存: ${CanBuyCommodities[response.selection - 1].amount}\n商品上架人: ${CanBuyCommodities[response.selection - 1].playerName}\n商品流水号: ${CanBuyCommodities[response.selection - 1].id}`);
                        pre_item_data = CanBuyCommodities[response.selection - 1];
                        //log(JSON.stringify(pre_item_data));
                    }
                    MarketSubForm.button("预览商品")
                    MarketSubForm.button("购买商品")
                    MarketSubForm.show(player).then((response) => {
                        if (response.canceled) {
                            this.Market(player);
                        } else if (response.selection == 0) {
                            //预览商品
                            //开始构建预览商品
                            let pre_item_lores = Object.assign([],pre_item_data.Lores);
                            //标记商品标签
                            pre_item_lores.push("§c预览商品请勿进行其他操作！","§c预览商品关联id：" + pre_item_data.id)
                            let preview_item = new ItemStack(pre_item_data.typeid);
                            preview_item.setLore(pre_item_lores);
                            //锁定物品
                            preview_item.lockMode = "slot";
                            //物品名字
                            //物品附魔属性
                            if (pre_item_data.Hasench) {
                                let newench = preview_item.getComponent('enchantments');
                                let enchList = newench.enchantments;
                                for (let ench in pre_item_data.ench) {
                                    enchList.addEnchantment(new Enchantment(ench,pre_item_data.ench[ench]));
                                }
                                newench.enchantments = enchList;
                            }
                            //物品耐久值
                            if (pre_item_data.Hasdamage) {
                                preview_item.getComponent("minecraft:durability").damage = pre_item_data.damage;
                            }
                            //检查背包是否还有空余空间
                            let has_empty_slot = false;
                            for (let i = 9; i < 36; i++) {
                                if (player.getComponent("minecraft:inventory").container.getItem(i) == undefined) {
                                    player.getComponent("minecraft:inventory").container.setItem(i,preview_item);
                                    has_empty_slot = true;
                                    break;
                                }
                            }
                            if (!has_empty_slot) {
                                player.sendMessage("§c>> 您背包没有多余的空间来放置预览商品，请清空后重试！");
                            } else {
                                player.sendMessage("§e>> 已成功将预览商品送至您的背包中，预览商品将在10s后自动收回！请及时查看！");
                                system.runTimeout(()=>{
                                    try {
                                        player.sendMessage("§e>> 预览时间已到，物品已自动收回！");
                                        for (let i = 9 ; i < 36; i++) {
                                            if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined && player.getComponent("minecraft:inventory").container.getItem(i).getLore()[player.getComponent("minecraft:inventory").container.getItem(i).getLore().length - 2] == "§c预览商品请勿进行其他操作！") {
                                                player.getComponent("minecraft:inventory").container.setItem(i,new ItemStack("minecraft:air"));
                                            }
                                        }
                                    } catch (e) {
                                        console.error("[NIA V4] 玩家预览商品没有正常回收（回收失败）！");
                                    }
                                },200);
                            }
                        } else if (response.selection == 1) {
                            //购买商品
                            this.Buy(player,pre_item_data);
                        }
                    })
            }
        })
    },


    Buy(player,item_data) {
        const BuyForm = new ModalFormData()
            .title("请选择要购买的商品数量")
            .slider("请选择要购买的商品数量",1,item_data.amount,1,1)
            .show(player).then((response) => {
                //首先判断是否取消
                if (response.canceled) {
                    this.Market(player);
                } else if (response.formValues[0] * item_data.price <= GetScore("money",player.nameTag)) {
                    //玩家金币足够,开始构造物品
                    //开始构建预览商品
                    let item_lores = item_data.Lores;
                    let new_item = new ItemStack(item_data.typeid);
                    new_item.setLore(item_lores);
                    //物品名字()
                    new_item.nameTag = item_data.name;
                    //物品数量
                    new_item.amount = response.formValues[0];
                    //物品附魔属性
                    if (item_data.Hasench) {
                        let newench = new_item.getComponent('enchantments');
                        let enchList = newench.enchantments;
                        for (let ench in item_data.ench) {
                            enchList.addEnchantment(new Enchantment(ench,item_data.ench[ench]));
                        }
                        newench.enchantments = enchList;
                    }
                    //物品耐久值
                    if (item_data.Hasdamage) {
                        new_item.getComponent("minecraft:durability").damage = item_data.damage;
                    }
                    //检查背包是否还有空余空间
                    let has_empty_slot = false;
                    if (player.getComponent("minecraft:inventory").container.emptySlotsCount != 0) {
                        has_empty_slot = true;
                    }
                    if (!has_empty_slot) {
                        player.sendMessage("§c>> 购买失败！您背包没有多余的空间来放置商品，请清空后重试！");
                    } else {
                        //根据商品id寻找
                        for (let i = 0; i < MarketData.length; i++) {
                            if (MarketData[i].id == item_data.id) {
                                MarketData[i].amount = item_data.amount - response.formValues[0];
                                //判断商品数量是否为0，如果为0则删除相应物品数据
                                let old_MarketData = Object.assign({},MarketData);
                                if (MarketData[i].amount == 0) {
                                    MarketData.splice(i,1);
                                }
                                //开始连接服务器
                                fs.OverwriteJsonFile("market.json",MarketData).then((result) => {
                                    if (result === "success") {
                                        let old_temp_player_money = Object.assign({},temp_player_money);
                                        temp_player_money[player.id] = response.formValues[0] * item_data.price;
                                        fs.OverwriteJsonFile("temp_player_money.json",temp_player_money).then((result) => {
                                            if (result === "success") {
                                                player.sendMessage("§e>> 购买成功！已将商品送至您的背包中！");
                                                //扣除玩家金币
                                                world.scoreboard.getObjective("money").setScore(player,GetScore("money",player.nameTag) - (response.formValues[0] * item_data.price));
                                                //发送物品
                                                player.getComponent("minecraft:inventory").container.addItem(new_item);
                                            } else {
                                                this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","MainfForm");
                                                console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                                                temp_player_money = old_temp_player_money;
                                            }
                                        })
                                    } else {
                                        this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","MainfForm");
                                        console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                                        MarketData = old_MarketData;
                                    }
                                })
                                break;
                            };
                        }
                    }
                } else if (response.formValues[0] * item_data.price > GetScore("money",player.nameTag)) {
                    //玩家金币不够
                    player.sendMessage("§c>> 购买失败！您的金币不足！");
                }
            })

    },

    //上架商品菜单
    Shelf(player) {
        let InventoryData = ["-无-"]
        const ShelfForm = new ModalFormData()
            .title("请选择要上架的物品")
            let HaveItemIndex = []
            for (let i = 0; i < 36; i++) {
                if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined) {
                    if (player.getComponent("minecraft:inventory").container.getItem(i).nameTag != undefined) {
                        InventoryData.push("§c槽id：" + i + " §r" + player.getComponent("minecraft:inventory").container.getItem(i).nameTag)
                        HaveItemIndex.push(i)
                    } else {
                        InventoryData.push("§c槽id：" + i + " §r" + player.getComponent("minecraft:inventory").container.getItem(i).typeId)
                        HaveItemIndex.push(i)
                    }
                }
            }
            ShelfForm.dropdown("请选择要上架的物品",InventoryData)
            ShelfForm.textField("请输入商品名称","尽量不要太长，3-6字为合理长度")
            ShelfForm.textField("请输入商品描述","8-10字为合理长度")
            ShelfForm.show(player).then((response) => {
                if (response.canceled) {
                    this.Main(player);
                } else if (response.formValues[0] == 0 || response.formValues[1] == "" || response.formValues[2] == "") {
                    this.Error(player,"§c错误的数据格式，请重新填写！","101","ShelfForm");
                } else {
                    let item = player.getComponent("minecraft:inventory").container.getItem(HaveItemIndex[response.formValues[0] - 1]);
                    let itemData = {};
                    itemData.state = true;
                    itemData.slot = HaveItemIndex[response.formValues[0] - 1];
                    if (item.nameTag == "") {
                        itemData.nameTag = "";
                    } else {
                        itemData.nameTag = item.nameTag;
                    }
                    itemData.typeid = item.typeId;
                    itemData.Lores = item.getLore();
                    itemData.amount = item.amount;
                    itemData.keepOnDeath = item.keepOnDeath;
                    itemData.maxAmount = item.maxAmount;
                    //判断是否有耐久
                    if (item.hasComponent("minecraft:durability")) {
                        itemData.Hasdamage = true;
                        itemData.damage = item.getComponent("minecraft:durability").damage;
                    } else {
                        itemData.Hasdamage = false;
                    }
                    //判断是否有附魔组件
                    if (item.hasComponent("minecraft:enchantments")) {
                        itemData.Hasench = true;
                        let ench = item.getComponent('enchantments');
                        itemData.ench = [...ench.enchantments].reduce(
                            (obj, { type: { id }, level }) => Object.assign(obj, { [id]: level }),
                            {}
                        )
                    } else {
                        itemData.Hasench = false;
                    }
                    itemData.name = response.formValues[1];
                    itemData.description = response.formValues[2];
                    //判断物品是否上锁
                    if (item.lockMode != "none") {
                        this.Error(player,"已经上锁的物品无法上架市场！\n请在解锁物品之后再次尝试上架物品！","200","ShelfForm");
                    } else if (BanItems.indexOf(item.typeId) != -1) {
                        //player.sendMessage(JSON.stringify(itemData, null, 2))
                        this.Error(player,"违禁物品 (" + item.typeId + ") 无法上架市场！\n请尝试上架其他非违禁物品！","201","ShelfForm");
                    } else {
                        this.ShelfSub(player,itemData);
                    }
                }
            })
    },


    ShelfSub(player,itemData) {
        const ShelfSubForm = new ModalFormData()
            .title("请选择你要上架的物品数量")
            .slider("请选择你要上架的物品数量",1,itemData.amount,1,itemData.amount)
            .textField("请输入物品单价","请注意，这里输入的是物品单价！")
        ShelfSubForm.show(player).then((response) => {
            if (response.canceled) {
                this.Shelf(player)
            } else if (response.formValues[1] == "" || parseInt(response.formValues[1]) <= 0 || isNaN(parseInt(Number(response.formValues[1])))) {
                this.Error(player,"§c错误的数据格式，只能填写正数！","102","ShelfForm")
            } else {
                //再给物品加一个价格属性
                itemData.price = parseInt(response.formValues[1])
                //再给物品加一个id属性
                let id = adler32(player.id + itemData.name + GetTime())
                itemData.id = id.substring(1,10)
                itemData.playerid = player.id
                itemData.playerName = player.nameTag
                itemData.addedTime = GetTime()
                if (itemData.amount == response.formValues[0]) {
                    //首先更新缓存中MarketData的值，然后直接覆写market.json
                    let temp_MarketData = MarketData;
                    temp_MarketData.push(itemData);
                    fs.OverwriteJsonFile("market.json",temp_MarketData).then((result) => {
                        if (result === 0) {
                            this.Error(player,"§c未找到玩家交易市场文件，请联系腐竹处理！","105","ShelfForm");
                        } else if (result === -1) {
                            this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","ShelfForm");
                        } else {
                            //覆写成功
                            MarketData = temp_MarketData;
                            let receipt = new ItemStack("minecraft:paper");
                            receipt.nameTag = "§c§l上架凭证";
                            receipt.setLore(["服务器官方交易市场", "§e上架商品凭证","上架商品名称:§b" + itemData.name, "上架人:§b" + player.nameTag,"流水号:§b" + id.substring(1,10),"§7要想查看上架商品更详细信息","§7请将凭证拿在手中后聊天栏发送+info即可"]);
                            player.getComponent("minecraft:inventory").container.setItem(itemData.slot,receipt);
                            this.Success(player,`\n[商品上架成功]\n商品名称: ${itemData.name} (${itemData.typeid}) \n商品简介: ${itemData.description} \n商品单价: ${itemData.price}\n商品剩余库存: ${itemData.amount}\n商品流水号: ${itemData.id}`);
                            //查询玩家金币缓存是否存在
                            if (temp_player_money[player.id] == undefined) {
                                //不存在，创建
                                temp_player_money[player.id] = 0;
                            }

                        }
                    })

                } else {
                    //首先更新缓存中MarketData的值，然后直接覆写market.json
                    let temp_MarketData = MarketData;
                    temp_MarketData.push(itemData)
                    fs.OverwriteJsonFile("market.json",temp_MarketData).then((result) => {
                        if (result === 0) {
                            this.Error(player,"§c未找到玩家交易市场文件，请联系腐竹处理！","105","ShelfForm");
                        } else if (result === -1) {
                            this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","ShelfForm");
                        } else {
                            //覆写成功
                            MarketData = temp_MarketData;
                            let newItem = player.getComponent("minecraft:inventory").container.getItem(itemData.slot);
                            newItem.amount = newItem.amount - response.formValues[0];
                            itemData.amount = response.formValues[0];
                            player.getComponent("minecraft:inventory").container.setItem(itemData.slot,newItem);
                            let receipt = new ItemStack("minecraft:paper");
                            receipt.nameTag = "§c§l上架凭证";
                            receipt.setLore(["服务器官方交易市场", "§e上架商品凭证","上架商品名称:§b" + itemData.name, "上架人:§b" + player.nameTag,"流水号:§b" + id.substring(1,10),"§7要想查看上架商品更详细信息","§7请将凭证拿在手中后聊天栏发送+info即可"]);
                            player.getComponent("minecraft:inventory").container.addItem(receipt);
                            this.Success(player,`\n[商品上架成功]\n商品名称: ${itemData.name} (${itemData.typeid}) \n商品简介: ${itemData.description} \n商品单价: ${itemData.price}\n商品剩余库存: ${itemData.amount}\n商品流水号: ${itemData.id}`);
                            //查询玩家金币缓存是否存在
                            if (temp_player_money[player.id] == undefined) {
                                //不存在，创建
                                temp_player_money[player.id] = 0;
                            }
                        }
                    })
                }
            }
        })
    },

    //管理商品菜单
    Manage(player) {
        let ManageData = [];
        const ManageForm = new ActionFormData()
            .title("§e§l管理商品")
            .body("§c欢迎来到管理商品界面\n§c请注意，此处的操作将会直接影响到市场中的商品！")
            .button("返回上一级")
            for (let i = 0; i < MarketData.length; i++) {
                if (MarketData[i].playerid == player.id && MarketData[i].state) {
                    ManageForm.button(MarketData[i].name + "\n单价: " + MarketData[i].price + " 库存数量: " + MarketData[i].amount);
                    ManageData.push(MarketData[i]);
                } else {
                    ManageForm.button("§c[已被管理员下架] " + MarketData[i].name + "\n单价: " + MarketData[i].price + " 库存数量: " + MarketData[i].amount);
                    ManageData.push(MarketData[i]);
                }
            }
            ManageForm.show(player).then((response) => {
                if (response.canceled || response.selection == 0) {
                    this.Main(player);
                } else if (!ManageData[response.selection - 1].state) {
                    //商品状态为不可用状态直接下架
                    //首先检查玩家背包是否有空余空间
                    let has_empty_slot = false;
                    if (player.getComponent("minecraft:inventory").container.emptySlotsCount != 0) {
                        has_empty_slot = true;
                    }
                    //如果玩家背包有空间
                    if (has_empty_slot) {
                        //直接开始构建物品
                        let item_data = ManageData[response.selection - 1];
                        let item_lores = item_data.Lores;
                        let new_item = new ItemStack(item_data.typeid);
                        new_item.setLore(item_lores);
                        //物品名字()
                        new_item.nameTag = item_data.name;
                        //物品数量
                        new_item.amount = item_data.amount;
                        //物品附魔属性
                        if (item_data.Hasench) {
                            let newench = new_item.getComponent('enchantments');
                            let enchList = newench.enchantments;
                            for (let ench in item_data.ench) {
                                enchList.addEnchantment(new Enchantment(ench,item_data.ench[ench]));
                            }
                            newench.enchantments = enchList;
                        }
                        //物品耐久值
                        if (item_data.Hasdamage) {
                            new_item.getComponent("minecraft:durability").damage = item_data.damage;
                        }
                        //首先将旧的MarketData缓存起来
                        let old_MarketData = Object.assign({},MarketData);
                        //根据商品id寻找，然后删除相应的数据
                        for (let i = 0; i < MarketData.length; i++) {
                            if (MarketData[i].id == item_data.id) {
                                MarketData.splice(i,1);
                                break;
                            }
                        }
                        //开始连接服务器
                        fs.OverwriteJsonFile("market.json",MarketData).then((result) => {
                            if (result === "success") {
                                //覆写成功
                                this.Success(player,`[商品下架成功]\n商品名称: ${item_data.name} (${item_data.typeid}) \n商品简介: ${item_data.description} \n商品单价: ${item_data.price}\n商品剩余库存: ${item_data.amount}\n商品流水号: ${item_data.id}`);
                                //发送物品
                                player.getComponent("minecraft:inventory").container.addItem(new_item);
                            } else {
                                this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","ManageForm");
                                console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                                MarketData = old_MarketData;
                            }
                        })
                    } else {
                        //玩家背包没有空间，则直接报错提醒玩家
                        this.Error(player,"§c您的背包没有多余的空间来放置下架的商品，请清空后重试！","104","ManageForm");
                    }

                } else {
                    //商品状态为可用状态可以进行修改
                    let item_data = ManageData[response.selection - 1];
                    const ManageSubForm = new ModalFormData()
                        .title("请选择你要对 "+ item_data.id +" 的操作")
                        .slider("请选择你要下架该商品的数量",0,item_data.amount,1,0)
                        .textField("请输入新的商品名称","尽量不要太长，3-6字为合理长度",item_data.name)
                        .textField("请输入新的物品单价","请注意，这里输入的是物品单价！",item_data.price.toString())
                        .textField("请输入新的商品描述","8-10字为合理长度",item_data.description)
                        .show(player).then((response) => {
                            if (response.canceled) {
                                this.Manage(player);
                            } else if (response.formValues[1] == "" || response.formValues[2] == "" || parseInt(response.formValues[2]) <= 0 || isNaN(parseInt(Number(response.formValues[2])))) {
                                //填写的数据格式错误
                                this.Error(player,"§c错误的数据格式，请重新填写！","101","ManageForm");
                            } else {
                                //数据格式正确且没有被下架
                                //首先更新缓存中MarketData的值，然后修改相应的数据，最后覆写market.json
                                let old_MarketData = Object.assign({},MarketData);
                                //如果玩家下架一定数量的商品
                                if (response.formValues[0] != 0) {
                                    //开始构建预览商品
                                    let item_lores = item_data.Lores;
                                    let new_item = new ItemStack(item_data.typeid);
                                    new_item.setLore(item_lores);
                                    //物品名字()
                                    new_item.nameTag = item_data.name;
                                    //物品数量
                                    new_item.amount = response.formValues[0];
                                    //物品附魔属性
                                    if (item_data.Hasench) {
                                        let newench = new_item.getComponent('enchantments');
                                        let enchList = newench.enchantments;
                                        for (let ench in item_data.ench) {
                                            enchList.addEnchantment(new Enchantment(ench,item_data.ench[ench]));
                                        }
                                        newench.enchantments = enchList;
                                    }
                                    //物品耐久值
                                    if (item_data.Hasdamage) {
                                        new_item.getComponent("minecraft:durability").damage = item_data.damage;
                                    }
                                    //检查背包是否还有空余空间
                                    let has_empty_slot = false;
                                    if (player.getComponent("minecraft:inventory").container.emptySlotsCount != 0) {
                                        has_empty_slot = true;
                                    }
                                    //如果没有空间
                                    if (!has_empty_slot) {
                                        player.sendMessage("§c>> 本次对商品的所有操作失败！您背包没有多余的空间来放置商品，请清空后重试！");
                                    } else {
                                        //如果有足够空间
                                        //根据商品id寻找
                                        for (let i = 0; i < MarketData.length; i++) {
                                            if (MarketData[i].id == item_data.id) {
                                                MarketData[i].amount = MarketData[i].amount - response.formValues[0];
                                                MarketData[i].name = response.formValues[1];
                                                MarketData[i].price = parseInt(response.formValues[2]);
                                                MarketData[i].description = response.formValues[3];
                                                //判断商品数量是否为0，如果为0则删除相应物品数据
                                                if (MarketData[i].amount == 0) {
                                                    MarketData.splice(i,1);
                                                }
                                                break;
                                            }
                                        }
                                        //开始连接服务器
                                        fs.OverwriteJsonFile("market.json",MarketData).then((result) => {
                                            if (result === "success") {
                                                //覆写成功
                                                this.Success(player,`[商品修改成功]\n商品名称: ${response.formValues[1]} (${item_data.typeid}) \n商品简介: ${response.formValues[3]} \n商品单价: ${response.formValues[2]}\n商品剩余库存: ${item_data.amount - response.formValues[0]}\n商品流水号: ${item_data.id}`);
                                                //发送物品
                                                player.getComponent("minecraft:inventory").container.addItem(new_item);
                                            } else {
                                                this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","ManageForm");
                                                MarketData = old_MarketData;
                                            }
                                        })
                                    }
                                } else {
                                    //如果玩家没有下架商品
                                    //开始连接服务器
                                    for (let i = 0; i < MarketData.length; i++) {
                                        if (MarketData[i].id == item_data.id) {
                                            MarketData[i].name = response.formValues[1];
                                            MarketData[i].price = parseInt(response.formValues[2]);
                                            MarketData[i].description = response.formValues[3];
                                            break;
                                        }
                                    }
                                    fs.OverwriteJsonFile("market.json",MarketData).then((result) => {
                                        if (result === "success") {
                                            //覆写成功
                                            this.Success(player,`[商品修改成功]\n商品名称: ${response.formValues[1]} (${item_data.typeid}) \n商品简介: ${response.formValues[3]} \n商品单价: ${response.formValues[2]}\n商品剩余库存: ${item_data.amount}\n商品流水号: ${item_data.id}`);
                                        } else {
                                            this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","ManageForm");
                                            MarketData = old_MarketData;
                                        }
                                    })
                                }
                            }
                        })
                }
            })

    },

    Error(player,info,ErrorCode,Form) {
        const ErrorForm = new MessageFormData()
            .title("§c出错了！错误码(" + ErrorCode +")")
            .body("错误信息:\n" + info)
            .button1("确认")
            .button2("退出")
            .show(player).then((response) => {
                if (response.selection == 0) {
                    switch (Form) {
                        case "ShelfForm":
                            this.Shelf(player);
                            break;
                        case "MainForm":
                            this.Main(player);
                            break;
                        case "ManageForm":
                            this.Manage(player);
                            break;
                    }
                }
            })
    },

    Success(player,info) {
        const SuccessForm = new MessageFormData()
            .title("§a操作成功！")
            .body("操作信息:\n" + info)
            .button1("确认")
            .button2("退出")
            .show(player).then((response) => {
                if (response.selection == 0) {
                    this.Main(player)
                }
            })
    }
}




//玩家加入服务监听
world.afterEvents.playerSpawn.subscribe((event) => {
    if (event.initialSpawn) {
        //首先检查是否有预览商品
        for (let i = 9 ; i < 36; i++) {
            if (event.player.getComponent("minecraft:inventory").container.getItem(i) != undefined && event.player.getComponent("minecraft:inventory").container.getItem(i).getLore()[event.player.getComponent("minecraft:inventory").container.getItem(i).getLore().length - 2] == "§c预览商品请勿进行其他操作！") {
                event.player.getComponent("minecraft:inventory").container.setItem(i,new ItemStack("minecraft:air"));
                event.player.sendMessage("§c>> 未正常去除的预览商品已回收！");
                log("玩家未正常归还的预览商品已被自动回收！");
            }
        }
        //其次检查玩家金币缓存是否存在
        if (temp_player_money[event.player.id] != undefined) {
            let old_temp_player_money = Object.assign({},temp_player_money);
            //重置缓存
            temp_player_money[event.player.id] = 0;
            //连接服务器覆写文件
            fs.OverwriteJsonFile("temp_player_money.json",temp_player_money).then((result) => {
                if (result === "success") {
                    //存在，给钱
                    if (old_temp_player_money[event.player.id] != 0) {
                        world.scoreboard.getObjective("money").addScore(event.player,old_temp_player_money[event.player.id])
                        event.player.sendMessage("§e>> 您有一笔来自玩家交易市场的 " + old_temp_player_money[event.player.id] + " 金币已到账！请注意查收！");
                    }
                } else {
                    console.error("[NIA V4] 依赖服务器连接失败！请检查依赖服务器是否成功启动，以及端口是否设置正确！");
                    this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","MainForm");
                    temp_player_money = old_temp_player_money;
                }
            })
        }
    }

})

export const MarketGUI = GUI;
