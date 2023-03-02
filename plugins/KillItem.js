////////////////////////////////////////////////////////////////
//关于本插件的一些基本信息
//作者：NIANIANKNIA
//联系方式：邮箱：admin@mcnia.top QQ：1020317403
//bug可以直接在minebbs评论反馈，也可以加群630507266反馈！
////////////////////////////////////////////////////////////////

//基本文件定义

const date_dir = "./plugins/NiaServer/KillItem/"

//基本文件的生成

//每天一个存储数据的地方
var FileName = `${date_dir}${system.getTimeObj().Y}_${system.getTimeObj().M}_${system.getTimeObj().D}.json`;
if (!file.exists(FileName)) {
    let a = {"ID":1};
    File.writeTo(FileName,JSON.stringify(a, null, 2));
    log("自动生成相关文件！");
}

//插件基本信息
const PLUGIN_NAME = "KillItem";
const PLUGIN_DESCRIPTION = "KillItem -- 服务器扫地机";
const VERSION = [1,0,0];
const AUTHOR = "NIANIANKNIA";

//插件日志消息标头
logger.setTitle(`${PLUGIN_NAME}`);
logger.setConsole(true, 4);
log("KillItem 加载成功！")

//注册插件
ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESCRIPTION, VERSION, {"作者":AUTHOR});


//统一的GUI API
const guiAPI = {

    /**
     * 给玩家对象player发送恢复掉落物主菜单
     * @param {object} player
     */
    Main(player) {
        let MainMenu = mc.newCustomForm();
            MainMenu.setTitle("恢复掉落物");
            MainMenu.addDropdown("选择要进行操作的物品日期文件",File.getFilesList(date_dir));
            player.sendForm(MainMenu,function(player,dates) {
                if (dates == null) {
                    player.tell("§c>> 您已取消本次操作！");
                    return false;
                } else {
                    guiAPI.Sub(player,`${date_dir}${File.getFilesList(date_dir)[dates[0]]}`);
                }
            })
    },

    /**
     * 给玩家对象player发送恢复掉落物选择编号菜单
     * @param {object} player
     * @param {string} FileName
     */
     Sub(player,FileName) {
        if (FileName) {
            let Dates = JSON.parse(File.readFrom(FileName));
            let IDs = [];
            for (let id in Dates) {
                if (id != "ID") {
                    IDs.push(id);
                }
            }
            let SubMenu = mc.newSimpleForm();
                SubMenu.setTitle("恢复掉落物");
                SubMenu.addButton("§c返回上一页");
                for(let i = 0 ; i < IDs.length; i++) {
                    SubMenu.addButton("ID: " + IDs[i]);
                }
                player.sendForm(SubMenu,function(player,id) {
                    if (id == null || id == 0) {
                        guiAPI.Main(player);
                    } else {
                        guiAPI.Choose(player,id,FileName);
                    }
                })
        } else {
            player.tell("§c>> 未能正确读取相应文件数据！")
        }
    },

    /**
     * 给玩家对象player发送恢复掉落物选择菜单
     * @param {object} player
     * @param {number} id
     * @param {string} FileName
     */
     Choose(player,id,FileName) {
        let Dates = JSON.parse(File.readFrom(FileName));
        let ChooseMenu = mc.newSimpleForm();
            ChooseMenu.setTitle("恢复掉落物");
            ChooseMenu.addButton("§c返回上一页");
            let num = 0
            for(let i in Dates) {
                if (num == id) {
                    for(let m = 0 ; m < Dates[i].length ; m++) {
                        item = mc.newItem(NBT.parseSNBT(Dates[i][m]));
                        ChooseMenu.addButton("§c" + item.name + " §ecount: §c" + item.count);
                    }
                }
                num++;
            }
            player.sendForm(ChooseMenu,function(player,date) {
                if (date == null || date == 0) {
                    guiAPI.Sub(player,FileName);
                } else {
                    let num = 0
                    for(let i in Dates) {
                        if (num == id) {
                            for(let m = 0 ; m < Dates[i].length ; m++) {
                                item = mc.newItem(NBT.parseSNBT(Dates[i][date - 1]));
                            }
                            player.giveItem(item);
                            player.tell(`§e>> 物品 ${item.name} 已经恢复至您的背包！`);
                        }
                        num++;
                    }
                }
            })
    }

}

function KillItem() {
    mc.broadcast("§e扫地完成！如果你东西被扫了，请及时截图！",5);
    let Items = [];
    let ItemsName = "";
    let entity = mc.getAllEntities();
    let result = false;
    for (let i = 0; i < entity.length; i++) {
        if (entity[i].isItemEntity()) {
            if (entity[i].toItem().name) {
                Items.push(entity[i].toItem().getNbt().toSNBT());
            }
            ItemsName = entity[i].toItem().name + "§r " + ItemsName
            result = true;
        }
    };
    if(result) {
        let FileName = `${date_dir}${system.getTimeObj().Y}_${system.getTimeObj().M}_${system.getTimeObj().D}.json`;
        let ID = JSON.parse(File.readFrom(FileName)).ID + "\n" +system.getTimeStr();
        let Date = JSON.parse(File.readFrom(FileName));
        Date[ID] = Items;
        mc.broadcast("§c>> 本次清理的物品名称为：§r" + ItemsName);
        mc.runcmd("kill @e[type=item]");
        mc.broadcast("§c>> 本次清理的ID为： §l【§r§l" + Date.ID + "§c§l】 §r§c如果您发现自己的物品被扫，请将本句话截图发给服主处理！");
        Date.ID = Date.ID + 1;
        File.writeTo(FileName,JSON.stringify(Date, null, 2));
    } else {
        mc.broadcast("§e>> 本次没有清理任何物品！");
    }
}

//扫地函数
function Main() {
    let online = mc.getOnlinePlayers();
    for (let i = 0; i < online.length; i++) {
        online[i].sendToast("§e扫地提醒","还有15s就要扫地了！请及时捡起地上的物品哦！")
    }
    setTimeout(`mc.broadcast("§e还有§c5s§e就要扫地了！请及时捡起地上的物品哦！",5);`,10000);
    setTimeout(`mc.broadcast("§e还有§c4s§e就要扫地了！请及时捡起地上的物品哦！",5);`,11000);
    setTimeout(`mc.broadcast("§e还有§c3s§e就要扫地了！请及时捡起地上的物品哦！",5);`,12000);
    setTimeout(`mc.broadcast("§e还有§c2s§e就要扫地了！请及时捡起地上的物品哦！",5);`,13000);
    setTimeout(`mc.broadcast("§e还有§c1s§e就要扫地了！请及时捡起地上的物品哦！",5);`,14000);
    setTimeout(() => {
        KillItem()
    },15000);
}

//设置周期扫地程序
setInterval(() => {
    Main()
},300000);

//定时更新文件
let lastDay = system.getTimeObj().D;
setInterval(function () {
    if (lastDay != system.getTimeObj().D) {
        log("更新！")
        //新的一天
        lastDay = system.getTimeObj().D;
        let a = {"ID":1};
        File.writeTo(`${date_dir}${system.getTimeObj().Y}_${system.getTimeObj().M}_${system.getTimeObj().D}.json`,JSON.stringify(a, null, 2));
    }
}, 30000);

//注册相关指令
mc.listen("onServerStarted",function () {
    let cmd = mc.newCommand("recoveritem", "恢复已经被扫掉的掉落物", PermType.GameMasters);
        cmd.setAlias("ri");
        cmd.overload([]);
    cmd.setCallback((cmd, origin, out, res) => {
        guiAPI.Main(origin.player);
    })
    cmd.setup();
})