//玩家交易市场
//开发中功能，请勿使用！

import {system, world, ItemStack, Enchantment} from '@minecraft/server';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { Broadcast, RunCmd } from './customFunction';
import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';
import { GetTime } from './customFunction';
import { adler32 } from './API/cipher_system';

//违禁物品，等后期接入配置文件
const BanItems= ["minecraft:paper","minecraft:clock"]
const port = 10086
var MarketData = [-1]


//服务器启动监听&&获得玩家市场数据
world.afterEvents.worldInitialize.subscribe(() => {
    //首先检查文件是否存在
    const reqCheckMarket = new HttpRequest(`http://127.0.0.1:${port}/CheckFile`);
    reqCheckMarket.body = "market.json"
    reqCheckMarket.method = HttpRequestMethod.POST;
    reqCheckMarket.headers = [
        new HttpHeader("Content-Type", "text/plain"),
    ];
    http.request(reqCheckMarket).then((response) => {
        if (response.status == 200 && response.body == "true") {
            //文件存在开始读取数据
            const reqGetMarketData = new HttpRequest(`http://127.0.0.1:${port}/GetJsonFileData`);
            reqGetMarketData.body = "market.json"
            reqGetMarketData.method = HttpRequestMethod.POST;
            reqGetMarketData.headers = [
                new HttpHeader("Content-Type", "text/plain"),
            ];
            http.request(reqGetMarketData).then((response) => {
                if (response.status == 200 && response.body != "The market.json file does not exist") {
                    //读取成功
                    MarketData = JSON.parse(response.body)
                    console.log("Get file(market.json) data successfully!")
                } else if (response.status == 200 && response.body == "The target file does not exist") {
                    console.error("The market.json file does not exist")
                } else {
                    console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
                }
            })
        } else if (response.status == 200 && response.body == "false") {
            //文件不存在开始生成文件并初始化
            const reqCreateMarketFile = new HttpRequest(`http://127.0.0.1:${port}/CreateNewJsonFile`);
            reqCreateMarketFile.body = JSON.stringify({"fileName":"market.json","fileContent":[]})
            reqCreateMarketFile.method = HttpRequestMethod.POST;
            reqCreateMarketFile.headers = [
                new HttpHeader("Content-Type", "text/plain"),
            ];
            http.request(reqCreateMarketFile).then((response) => {
                if (response.status == 200 && response.body == "success") {
                    //初始化成功
                    MarketData = [];
                    console.log("File(market.json) created successfully!")
                } else if (response.status == 200 && response.body != "success") {
                    console.error(response.body)
                } else {
                    console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
                }
            })
        } else {
            console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
        }
    })
})


const MarketGUI = {
    //市场主菜单
    Main(player) {
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
                this.Market(player)
                    break;
                case 1:
                this.Shelf(player)
                    break;
                case 2:

                    break;
                case 3:

                    break;
            }
        })
    },

    //市场
    Market(player) {
        let CanBuyCommodities = []
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
            } else {
                const MarketSubForm = new ActionFormData()
                    .title("商品详情页")
                    if (CanBuyCommodities[response.selection - 1].Hasdamage == true || CanBuyCommodities[response.selection - 1].Hasench == false) {
                        MarketSubForm.body(`商品名称: ${CanBuyCommodities[response.selection - 1].name} (${CanBuyCommodities[response.selection - 1].typeid}) \n商品简介: ${CanBuyCommodities[response.selection - 1].description} \n商品单价: ${CanBuyCommodities[response.selection - 1].price}\n商品剩余库存: ${CanBuyCommodities[response.selection - 1].amount}\n商品上架人: ${CanBuyCommodities[response.selection - 1].playerName}\n商品流水号: ${CanBuyCommodities[response.selection - 1].id}\n已消耗耐久度:${CanBuyCommodities[response.selection - 1].damage}\n拥有的附魔：${JSON.stringify(CanBuyCommodities[response.selection - 1].ench)} `)
                    } else {
                        MarketSubForm.body(`商品名称: ${CanBuyCommodities[response.selection - 1].name} (${CanBuyCommodities[response.selection - 1].typeid}) \n商品简介: ${CanBuyCommodities[response.selection - 1].description} \n商品单价: ${CanBuyCommodities[response.selection - 1].price}\n商品剩余库存: ${CanBuyCommodities[response.selection - 1].amount}\n商品上架人: ${CanBuyCommodities[response.selection - 1].playerName}\n商品流水号: ${CanBuyCommodities[response.selection - 1].id}`)
                    }
                    MarketSubForm.button("预览商品")
                    MarketSubForm.button("购买商品")
                    MarketSubForm.show(player).then((response) => {
                        if (response.canceled) {
                            this.Market(player)
                        } else if (response.selection == 0) {
                            //预览商品
                            
                        } else if (response.selection == 1) {
                            //购买商品
                        }
                    })
            }
        })
    },

    Buy(player) {
        const BuyForm = new MessageFormData()


    },

    //上架商品菜单
    Shelf(player) {
        let InventoryData = ["-无-"]
        const ShelfForm = new ModalFormData()
            .title("请选择要上架的物品")
            let HaveItemIndex = []
            for (let i = 0; i < 35; i++) {
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
                    this.Main(player)
                } else if (response.formValues[0] == 0 || response.formValues[1] == "" || response.formValues[2] == "") {
                    this.Error(player,"§c错误的数据格式，请重新填写！","101","ShelfForm")
                } else {
                    //（暂时）不要忘记考虑羊毛
                    let item = player.getComponent("minecraft:inventory").container.getItem(HaveItemIndex[response.formValues[0] - 1])
                    let itemData = {}
                    itemData.state = true
                    itemData.slot = HaveItemIndex[response.formValues[0] - 1]
                    if (item.nameTag == "") {
                        itemData.nameTag = ""
                    } else {
                        itemData.nameTag = item.nameTag
                    }
                    itemData.typeid = item.typeId
                    itemData.amount = item.amount
                    itemData.keepOnDeath = item.keepOnDeath
                    //itemData.lockMode = item.lockMode
                    itemData.maxAmount = item.maxAmount
                    //判断是否有耐久
                    if (item.hasComponent("minecraft:durability")) {
                        itemData.Hasdamage = true
                        itemData.damage = item.getComponent("minecraft:durability").damage
                    } else {
                        itemData.Hasdamage = false
                    }
                    //判断是否有附魔组件
                    if (item.hasComponent("minecraft:enchantments")) {
                        itemData.Hasench = true
                        let ench = item.getComponent('enchantments')
                        itemData.ench = [...ench.enchantments].reduce(
                            (obj, { type: { id }, level }) => Object.assign(obj, { [id]: level }),
                            {}
                        )
                    } else {
                        itemData.Hasench = false
                    }
                    itemData.name = response.formValues[1]
                    itemData.description = response.formValues[2]
                    //判断物品是否上锁
                    if (item.lockMode != "none") {
                        this.Error(player,"已经上锁的物品无法上架市场！\n请在解锁物品之后再次尝试上架物品！","200","ShelfForm")
                    } else if (BanItems.indexOf(item.typeId) != -1) {
                        //player.sendMessage(JSON.stringify(itemData, null, 2))
                        this.Error(player,"违禁物品 (" + item.typeId + ") 无法上架市场！\n请尝试上架其他非违禁物品！","201","ShelfForm")
                    } else {
                        this.ShelfSub(player,itemData)
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
                    temp_MarketData.push(itemData)
                    const reqOverwriteMarket = new HttpRequest(`http://127.0.0.1:${port}/OverwriteJsonFile`);
                    reqOverwriteMarket.body = JSON.stringify({"fileName":"market.json","fileData":temp_MarketData})
                    reqOverwriteMarket.method = HttpRequestMethod.POST;
                    reqOverwriteMarket.headers = [
                        new HttpHeader("Content-Type", "text/plain"),
                    ];
                    http.request(reqOverwriteMarket).then((response) => {
                        if (response.status == 200 && response.body == "success") {
                            //覆写成功
                            MarketData = temp_MarketData;
                            let receipt = new ItemStack("minecraft:paper")
                            receipt.nameTag = "§c§l上架凭证"
                            receipt.setLore(["服务器官方交易市场", "§e上架商品凭证","上架商品名称:§b" + itemData.name, "上架人:§b" + player.nameTag,"流水号:§b" + id.substring(1,10),"§7要想查看上架商品更详细信息","§7请将凭证拿在手中后聊天栏发送+info即可"]);
                            player.getComponent("minecraft:inventory").container.setItem(itemData.slot,receipt)
                            this.Success(player,`\n[商品上架成功]\n商品名称: ${itemData.name} (${itemData.typeid}) \n商品简介: ${itemData.description} \n商品单价: ${itemData.price}\n商品剩余库存: ${itemData.amount}\n商品流水号: ${itemData.id}`)
                        } else if (response.status == 200 && response.body != "success") {
                            console.error(response.body)
                            this.Error(player,response.body,"105","ShelfForm")
                        } else {
                            console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
                            this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","ShelfForm")
                        }
                    })

                } else {
                    //首先更新缓存中MarketData的值，然后直接覆写market.json
                    let temp_MarketData = MarketData;
                    temp_MarketData.push(itemData)
                    const reqOverwriteMarket = new HttpRequest(`http://127.0.0.1:${port}/OverwriteJsonFile`);
                    reqOverwriteMarket.body = JSON.stringify({"fileName":"market.json","fileData":temp_MarketData})
                    reqOverwriteMarket.method = HttpRequestMethod.POST;
                    reqOverwriteMarket.headers = [
                        new HttpHeader("Content-Type", "text/plain"),
                    ];
                    http.request(reqOverwriteMarket).then((response) => {
                        if (response.status == 200 && response.body == "success") {
                            //覆写成功
                            MarketData = temp_MarketData;
                            let newItem = player.getComponent("minecraft:inventory").container.getItem(itemData.slot)
                            newItem.amount = newItem.amount - response.formValues[0]
                            itemData.amount = response.formValues[0]
                            player.getComponent("minecraft:inventory").container.setItem(itemData.slot,newItem)
                            let receipt = new ItemStack("minecraft:paper")
                            receipt.nameTag = "§c§l上架凭证"
                            receipt.setLore(["服务器官方交易市场", "§e上架商品凭证","上架商品名称:§b" + itemData.name, "上架人:§b" + player.nameTag,"流水号:§b" + id.substring(1,10),"§7要想查看上架商品更详细信息","§7请将凭证拿在手中后聊天栏发送+info即可"]);
                            player.getComponent("minecraft:inventory").container.addItem(receipt)
                            this.Success(player,`\n[商品上架成功]\n商品名称: ${itemData.name} (${itemData.typeid}) \n商品简介: ${itemData.description} \n商品单价: ${itemData.price}\n商品剩余库存: ${itemData.amount}\n商品流水号: ${itemData.id}`)
                        } else if (response.status == 200 && response.body != "success") {
                            console.error(response.body)
                            this.Error(player,response.body,"105","ShelfForm")
                        } else {
                            console.error("Dependent server connection failed! Check whether the dependent server started successfully.")
                            this.Error(player,"§c依赖服务器连接超时，如果你看到此提示请联系腐竹！","103","ShelfForm")
                        }
                    })
                }
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
                            this.Shelf(player)
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

//对于物品使用的检测
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == "minecraft:stick") {
        let player = event.source;
        if (player.nameTag == "NIANIANKNIA") {
            MarketGUI.Main(player)
        } else {
            player.sendMessage("§c>> 玩家交易市场正在开发中，敬请期待!")
        }

    }
})

//调试语句
system.events.scriptEventReceive.subscribe((event) => {
    // let {
    //     id,           // returns string (wiki:test)
    //     nitiator,    // returns Entity
    //     message,      // returns string (Hello World)
    //     sourceBlock,  // returns Block
    //     sourceEntity, // returns Entity
    //     sourceType,   // returns MessageSourceType
    // } = event;
    Broadcast("§c[scriptEventReceive] §eEventid:" + event.id + " selectedSlot:" + event.sourceEntity.selectedSlot)
    Broadcast("§c[scriptEventReceive] §eid:" + event.sourceEntity.id)
    let item = event.sourceEntity.getComponent("minecraft:inventory").container.getItem(event.sourceEntity.selectedSlot)
    if (item != undefined) {
        // Broadcast("id：" + item.typeId)
        // Broadcast("amount：" + item.amount)
        // Broadcast("keepOnDeath：" + item.keepOnDeath)
        // Broadcast("lockMode：" + item.lockMode)
        // Broadcast("maxAmount：" + item.maxAmount)
        // Broadcast("nameTag：" + item.nameTag)
        // Broadcast("type：" + item.type.id)
        // //判断耐久值
        // Broadcast("damage：" + item.getComponent("minecraft:durability").damage)
        // //判断附魔
        // let ench = item.getComponent('enchantments')
        // //Broadcast(ench.slot)
        // let object = [...ench.enchantments].reduce(
        //         (obj, { type: { id }, level }) => Object.assign(obj, { [id]: level }),
        //         {}
        //     )
        // let text = JSON.stringify(object, null, 2)
        // Broadcast("enchantments：" + text)
        // Broadcast("neeeew" )
        let newItem = new ItemStack("minecraft:wooden_sword")
        // Broadcast("olllllld" )
        newItem.setLore(["服务器官方交易市场", "§e交易商品预览模式","§c请在商城执行归还物品操作"]);
        newItem.nameTag = "木剑"
        newItem.getComponent("minecraft:durability").damage = 10
        //newItem.lockMode = "slot"
        let newench = newItem.getComponent('enchantments')
        let enchList = newench.enchantments
        enchList.addEnchantment(new Enchantment("unbreaking",32767))
        //在未来的版本可以直接用字符串进行构建，当前版本还不行
        //enchList.addEnchantment(new Enchantment(MinecraftEnchantmentTypes.unbreaking,1))
        newench.enchantments = enchList
        //newench.addEnchantment()
        // newItem.getComponent('enchantments').addEnchantment(newench)
        event.sourceEntity.getComponent("minecraft:inventory").container.addItem(newItem)
        Broadcast("newid：" + newItem.typeId)
    }
    // for (let i = 0; i < 35; i++) {
    //     if (event.sourceEntity.getComponent("minecraft:inventory").container.getItem(i) != undefined) {
    //         Broadcast(event.sourceEntity.getComponent("minecraft:inventory").container.getItem(i).typeId)
    //     }
    // }
});


// function __adler32(str) {
//     var P = 65521, a = 1, b = 0;
//     str = (new TextEncoder('utf8')).encode(str);
//     for(var i=0;i < str.length; i++) a = (a+str[i])%P, b = (a+b)%P;
//     return ((BigInt(b) * BigInt(1<<16)) + BigInt(a));
// }

// console.log(__adler32("English").toString(16));
// console.log(__adler32("中文测试").toString(16));
// console.log(__adler32("中文English").toString(16));
// console.log(__adler32("！长！中文long_English长中文long_English长中文long_English长中文long_English长中文long_English").toString(16));

// /*
// index = __adler32(str);
// display_code = __adler32(str).toString(16);
// */
