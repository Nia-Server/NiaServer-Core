import {world,system} from '@minecraft/server';
import { ActionFormData,ModalFormData,MessageFormData } from '@minecraft/server-ui'

const can_cr_id = ["mcnia:op_sword","mcnia:dark_sword","mcnia:fire_sword","mcnia:rock_sword","mcnia:spirit_sword","mcnia:thunder_sword","mcnia:water_sword","mcnia:wind_sword"]
const can_cr_data = {"mcnia:op_sword": "op之剑","mcnia:dark_sword": "暗·剑","mcnia:fire_sword": "火·剑","mcnia:rock_sword": "岩·剑","mcnia:spirit_sword": "灵·剑","mcnia:thunder_sword": "雷·剑","mcnia:water_sword": "水·剑","mcnia:wind_sword": "空·剑"}
const Upgrade_event = [
    {}
]


world.afterEvents.entityHurt.subscribe((event) => {
    //判断是不是玩家使用攻击
    if (event.damageSource.cause == "entityAttack" && event.damageSource.damagingEntity.typeId == "minecraft:player") {
        //判断玩家拿的武器
        let selectedItem = event.damageSource.damagingEntity.getComponent("minecraft:inventory").container.getItem(event.damageSource.damagingEntity.selectedSlot)
        if (can_cr_id.includes(selectedItem.typeId) && selectedItem.getLore().length != 0 && selectedItem.getLore()[0].slice(0,3) == "§c+") {
            //开始计算暴击率
            let cr = Number(selectedItem.getLore()[1].split("：")[1].slice(2, -1));
            let cd = Number(selectedItem.getLore()[2].split("：")[1].slice(2, -1));
            let random = Math.floor(Math.random() * 100);
            //event.damageSource.damagingEntity.sendMessage("hh"+ cr + " " + cd + " " + random)
            if (random <= cr) {
                //暴击了
                //首先先减血
                event.hurtEntity.getComponent("minecraft:health").setCurrentValue(event.hurtEntity.getComponent("minecraft:health").currentValue - event.damage * cd * 0.01)
                //判断怪物血量是否小于0
                if (event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2) <= 0) {
                    //判断怪物有没有名称标签
                    if (event.hurtEntity.nameTag != "") {
                        event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §c§l" + (event.damage*(1 + cd * 0.01)).toFixed(2) + " §r§7暴击伤害,对目标生物造成致命一击！");
                        event.hurtEntity.runCommand("particle mcnia:crit ~ ~1 ~");
                        event.hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~ ~1 ~");
                    } else {
                        let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                        let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §c§l" + (event.damage*(1 + cd * 0.01)).toFixed(2) + " §r§7暴击伤害,对目标生物造成致命一击！"}]
                        event.damageSource.damagingEntity.sendMessage(rawText);
                        event.hurtEntity.runCommand("particle mcnia:crit ~ ~1 ~");
                        event.hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~ ~1 ~");
                    }
                } else {
                    if (event.hurtEntity.nameTag != "") {
                        event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §c§l" + (event.damage*(1 + cd * 0.01)).toFixed(2) + " §r§7暴击伤害,目标当前血量剩余：§c§l " + event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2));
                        event.hurtEntity.runCommand("particle mcnia:crit ~ ~1 ~");
                        event.hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~ ~1 ~");
                    } else {
                        let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                        let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §c§l" + (event.damage*(1 + cd * 0.01)).toFixed(2) + " §r§7暴击伤害,目标当前血量剩余：§c§l " + event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2)}]
                        event.damageSource.damagingEntity.sendMessage(rawText);
                        event.hurtEntity.runCommand("particle mcnia:crit ~ ~1 ~");
                        event.hurtEntity.runCommand("particle minecraft:critical_hit_emitter ~ ~1 ~");
                    }
                }
            } else {
                if (event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2) <= 0) {
                    if (event.hurtEntity.nameTag != "") {
                        event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,对目标生物造成致命一击！");
                    } else {
                        let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                        let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,对目标生物造成致命一击！"}]
                        event.damageSource.damagingEntity.sendMessage(rawText);
                    }
                } else {
                    if (event.hurtEntity.nameTag != "") {
                        event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,目标当前血量剩余：§e§l " + event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2));
                    } else {
                        let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                        let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,目标当前血量剩余：§e§l " + event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2)}]
                        event.damageSource.damagingEntity.sendMessage(rawText);
                    }
                }
            }
        } else {
            if (event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2) <= 0) {
                if (event.hurtEntity.nameTag != "") {
                    event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,对目标生物造成致命一击！");
                } else {
                    let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                    let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,对目标生物造成致命一击！"}]
                    event.damageSource.damagingEntity.sendMessage(rawText);
                }
            } else {
                if (event.hurtEntity.nameTag != "") {
                    event.damageSource.damagingEntity.sendMessage("§7你对 §r" + event.hurtEntity.nameTag + " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,目标当前血量剩余：§e§l " + event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2));
                } else {
                    let target_entity = "entity." + event.hurtEntity.typeId.split(":")[1] + ".name"
                    let rawText = [{"text": "§7你对 §r"},{"translate": target_entity},{"text": " §7造成了 §e§l" + event.damage.toFixed(2) + " §r§7伤害,目标当前血量剩余：§e§l " + event.hurtEntity.getComponent("minecraft:health").currentValue.toFixed(2)}]
                    event.damageSource.damagingEntity.sendMessage(rawText);
                }
            }
        }
    }
})

const EQGUI = {
    Main(player) {
        const MainForm = new ActionFormData()
            .title("§e§l武器铺")
            .body("仅有部分武器可以进阶哦！")
            .button("进阶武器")
            .button("升级武器")
            .button("重置武器")
            .button("修复武器")
        MainForm.show(player).then((response) => {
            switch (response.selection) {
                case 0:
                this.Init(player)
                    break;
                case 1:
                this.Upgrade(player)
                    break;
                case 2:
                    break;
                case 3:
                    break;
            }
        })

    },

    Init(player) {
        let InventoryData = ["-无-"]
        const InitForm = new ModalFormData()
            .title("请选择要进阶的武器")
            let HaveItemIndex = []
            for (let i = 0; i < 35; i++) {
                if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined && can_cr_id.includes(player.getComponent("minecraft:inventory").container.getItem(i).typeId) && player.getComponent("minecraft:inventory").container.getItem(i).getLore().length == 0) {
                    if (player.getComponent("minecraft:inventory").container.getItem(i).nameTag != undefined) {
                        InventoryData.push("§c槽id：" + i + " §r" + player.getComponent("minecraft:inventory").container.getItem(i).nameTag);
                        HaveItemIndex.push(i)
                    } else {
                        InventoryData.push("§c槽id：" + i + " §r" + can_cr_data[player.getComponent("minecraft:inventory").container.getItem(i).typeId]);
                        HaveItemIndex.push(i)
                    }
                }
            }
            InitForm.dropdown("请选择要进阶的武器",InventoryData)
            InitForm.show(player).then((response) => {
                if (response.canceled) {
                    this.Main(player)
                } else if (response.formValues[0] == 0) {
                    //错误
                } else {
                    let item = player.getComponent("minecraft:inventory").container.getItem(HaveItemIndex[response.formValues[0] - 1])
                    item.setLore(["§c+0","暴击率：§c20%","暴击伤害：§c50%"])
                    player.getComponent("minecraft:inventory").container.setItem(HaveItemIndex[response.formValues[0] - 1],item)
                    player.sendMessage("§7武器进阶成功！")
                }
            })
    },

    Upgrade(player) {
        let InventoryData = ["-无-"]
        const UpgradeForm = new ModalFormData()
            .title("请选择要升级的武器")
            let HaveItemIndex = []
            let sword_lev = 0;
            for (let i = 0; i < 35; i++) {
                if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined && can_cr_id.includes(player.getComponent("minecraft:inventory").container.getItem(i).typeId) && player.getComponent("minecraft:inventory").container.getItem(i).getLore().length != 0 && Number(player.getComponent("minecraft:inventory").container.getItem(i).getLore()[0].slice(2)) < 12) {
                    if (player.getComponent("minecraft:inventory").container.getItem(i).nameTag != undefined) {
                        InventoryData.push("§c槽id：" + i + " §r" + player.getComponent("minecraft:inventory").container.getItem(i).nameTag)
                        HaveItemIndex.push(i)
                    } else {
                        InventoryData.push("§c槽id：" + i + " §r" + can_cr_data[player.getComponent("minecraft:inventory").container.getItem(i).typeId] + " §r§c等级：§r " + player.getComponent("minecraft:inventory").container.getItem(i).getLore()[0].slice(2))
                        HaveItemIndex.push(i)
                    }
                }
            }
            UpgradeForm.dropdown("请选择要进阶的武器",InventoryData)
            UpgradeForm.show(player).then((response) => {
                if (response.canceled) {
                    this.Main(player)
                } else if (response.formValues[0] == 0) {
                    //错误
                } else {
                    let sword_data = player.getComponent("minecraft:inventory").container.getItem(HaveItemIndex[response.formValues[0] - 1])
                    this.UpgradeSub(player, sword_data, Number(sword_data.getLore()[0].slice(2)))
                    // item.getLore()[0]
                    // item.setLore(["§c+12","暴击率：§c80%","暴击伤害：§c500%"])
                    // player.getComponent("minecraft:inventory").container.setItem(HaveItemIndex[response.formValues[0] - 1],item)
                    // player.sendMessage("§7武器进阶成功！")
                }
            })
    },

    UpgradeSub(player, sword_data, sword_level) {
        let num = 0;
        for (let i = 0; i < 35; i++) {
            //计算钻石数量
            if (player.getComponent("minecraft:inventory").container.getItem(i) != undefined && player.getComponent("minecraft:inventory").container.getItem(i).typeId == "minecraft:diamond") {
                num = num + player.getComponent("minecraft:inventory").container.getItem(i).amount
            }
        }
        if (num == 0) {
            this.Info(player,"突破失败！\n原因是您背包内的突破素材不够！", "突破失败","UpgradeForm");
        } else {
            if (12 - sword_level <= num) {
                num = 12 - sword_level;
            }
            const UpgradeSubForm = new ModalFormData()
            .title("突破武器" + can_cr_data[sword_data.typeId])
            .slider("请选择要进阶武器要使用的素材数量",1,num,1);
            UpgradeSubForm.show(player).then((response) => {
                let eventProb = [0.1283, 0.1596, 0.1896, 0.5225];
                for (let i = 0; i < response.formValues[0]; i++) {
                    console.log("强化一次")
                }
            })
        }

    },

    Info(player,info,title,Form) {
        const InfoForm = new MessageFormData()
            .title(title)
            .body(info)
            .button1("确认")
            .button2("退出")
            .show(player).then((response) => {
                if (response.selection == 0) {
                    switch (Form) {
                        case "UpgradeForm":
                            this.Upgrade(player)
                            break;
                    }
                }
            })
    },
}

//对于物品使用的检测
world.afterEvents.itemUse.subscribe(event => {
    if (event.itemStack.typeId == "minecraft:stick") {
        let player = event.source;

        EQGUI.Main(player)


    }
})

