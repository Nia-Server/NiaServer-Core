import {system, world, ItemStack, Enchantment, MinecraftEnchantmentTypes} from '@minecraft/server';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'
import { Broadcast, RunCmd } from './customFunction';


const MarketGUI = {
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
                if (response.formValues[0] == 0 || response.formValues[1] == null || response.formValues[2] == null) {
                    this.Error(player,"§c错误的数据格式，请重新填写！","101","ShelfForm")
                } else {
                    let item = player.getComponent("minecraft:inventory").container.getItem(HaveItemIndex[response.formValues[0] - 1])
                    let itemData = {}
                    itemData.slot = HaveItemIndex[response.formValues[0] - 1]
                    itemData.nameTag = item.nameTag
                    itemData.id = item.typeId
                    itemData.amount = item.amount
                    itemData.keepOnDeath = item.keepOnDeath
                    itemData.lockMode = item.lockMode
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
                    player.sendMessage(JSON.stringify(itemData, null, 2))
                    this.ShelfSub(player,itemData)
                }
            })
    },

    ShelfSub(player,itemData) {
        const ShelfSubForm = new ModalFormData()
            .title("请选择你要上架的物品数量")
            .slider("请选择你要上架的物品数量",1,itemData.amount,1,itemData.amount)
            .textField("请输入物品单价","请注意，这里输入的是物品单价！")
        ShelfSubForm.show(player).then((response) => {
            if (parseInt(response.formValues[1]) <= 0 || isNaN(parseInt(Number(response.formValues[1])))) {
                this.Error(player,"错误的数据格式，只能填写正数！","102","ShelfForm")
            } else {
                //itemData.amount = response.formValues[0]
                //RunCmd(`clear @a[name=${player.nameTag}] ${itemData.id} -1 ${itemData.id}`)
                if (itemData.amount == response.formValues[0]) {
                    let receipt = new ItemStack("minecraft:paper")
                    receipt.nameTag = "§c§l上架凭证"
                    receipt.setLore(["服务器官方交易市场", "§e上架商品凭证", "§cID:56324617235"]);
                    player.getComponent("minecraft:inventory").container.setItem(itemData.slot,receipt)
                } else {
                    let newItem = player.getComponent("minecraft:inventory").container.getItem(itemData.slot)
                    newItem.amount = newItem.amount - response.formValues[0]
                    itemData.amount = response.formValues[0]
                    player.getComponent("minecraft:inventory").container.setItem(itemData.slot,newItem)
                }

            }
        })
    },

    Error(player,info,ErrorCode,Form) {
        const ErrorForm = new MessageFormData()
            .title("出错了！错误码(" + ErrorCode +")")
            .body("错误信息:/n" + info)
            .button1("确认")
            .button2("退出")
            .show(player).then((response) => {
                if (response.selection == 1) {
                    switch (Form) {
                        case "ShelfForm":
                            this.Shelf(player)
                            break;
                    }
                }
            })
    }
}

// for (let i = 0; i < 35; i++) {
//     if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined && player.getComponent("minecraft:inventory").container.getItem(i).typeId == RecycleData[index1].content[index2].type) {
//         ItemNum = ItemNum + player.getComponent("minecraft:inventory").container.getItem(i).amount
//     }
// }


//对于物品使用的检测
world.events.beforeItemUse.subscribe(event => {
    if (event.item.typeId == "minecraft:stick") {
        let player = event.source;
        MarketGUI.Main(player)
    }
    // if (event.item.typeId == "minecraft:diamond_sword") {
    //     let player = event.source;
    //     player.sendMessage("test")
    //     player.getComponent("minecraft:inventory").container.setItem(3,new ItemStack("minecraft:paper"))
    //     player.sendMessage("jjj1")
    // }

})

//调试语句
// system.events.scriptEventReceive.subscribe((event) => {
//     // let {
//     //     id,           // returns string (wiki:test)
//     //     nitiator,    // returns Entity
//     //     message,      // returns string (Hello World)
//     //     sourceBlock,  // returns Block
//     //     sourceEntity, // returns Entity
//     //     sourceType,   // returns MessageSourceType
//     // } = event;
//     Broadcast("§c[scriptEventReceive] §eEventid:" + event.id + " selectedSlot:" + event.sourceEntity.selectedSlot)
//     let item = event.sourceEntity.getComponent("minecraft:inventory").container.getItem(event.sourceEntity.selectedSlot)
//     if (item != undefined) {
//         Broadcast("id：" + item.typeId)
//         Broadcast("amount：" + item.amount)
//         Broadcast("keepOnDeath：" + item.keepOnDeath)
//         Broadcast("lockMode：" + item.lockMode)
//         Broadcast("maxAmount：" + item.maxAmount)
//         Broadcast("nameTag：" + item.nameTag)
//         Broadcast("type：" + item.type.id)
//         //判断耐久值
//         Broadcast("damage：" + item.getComponent("minecraft:durability").damage)
//         //判断附魔
//         let ench = item.getComponent('enchantments')
//         //Broadcast(ench.slot)
//         let object = [...ench.enchantments].reduce(
//                 (obj, { type: { id }, level }) => Object.assign(obj, { [id]: level }),
//                 {}
//             )
//         let text = JSON.stringify(object, null, 2)
//         Broadcast("enchantments：" + text)
//         // Broadcast("neeeew" )
//         let newItem = new ItemStack("minecraft:diamond_sword")
//         // Broadcast("olllllld" )
//         newItem.setLore(["服务器官方交易市场", "§e交易商品认证"]);
//         newItem.nameTag = "钻石剑"
//         newItem.getComponent("minecraft:durability").damage = 10
//         Broadcast("newid：" + newItem.typeId)
//         Broadcast("old" )
//         let newench = newItem.getComponent('enchantments')
//         Broadcast("olld" )
//         let enchList = newench.enchantments
//         Broadcast("ollld" )
//         //enchList.addEnchantment(new Enchantment("unbreaking",1))
//         //在未来的版本可以直接用字符串进行构建，当前版本还不行
//         enchList.addEnchantment(new Enchantment(MinecraftEnchantmentTypes.unbreaking,1))
//         Broadcast("olllld" )
//         newench.enchantments = enchList
//         //newench.addEnchantment()
//         // newItem.getComponent('enchantments').addEnchantment(newench)
//         event.sourceEntity.getComponent("minecraft:inventory").container.addItem(newItem)
//     }
//     // for (let i = 0; i < 35; i++) {
//     //     if (event.sourceEntity.getComponent("minecraft:inventory").container.getItem(i) != undefined) {
//     //         Broadcast(event.sourceEntity.getComponent("minecraft:inventory").container.getItem(i).typeId)
//     //     }
//     // }
// });