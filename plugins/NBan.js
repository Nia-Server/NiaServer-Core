//LiteLoaderScript Dev Helper
/// <reference path="e:\服务器本地测试/dts/llaids/src/index.d.ts"/>

//NBan

const PLUGIN_NAME = "NBan";
const PLUGIN_DESCRIPTION = "NBan -- 多功能玩家封禁插件";
const VERSION = [1,0,0];
const AUTHOR = "NIANIANKNIA";

//基本文件定义

const banlist_path = "./plugins/NiaServer/NBan.json"
const banlog_path = "./logs/banLog.csv"

var _VER = '1.9.1'
var _BLACKBE_ADDRESS_PREFIX = "https://api.blackbe.work/openapi/v3/check/?"

//插件日志消息标头

logger.setTitle(`${PLUGIN_NAME}`);
logger.setConsole(true, 4);
log("NBan--NIA服务器专用玩家封禁插件 加载成功！")

ll.registerPlugin(PLUGIN_NAME, PLUGIN_DESCRIPTION, VERSION, {"作者":AUTHOR});

if (!file.exists(banlist_path)) {
    log("首次运行，正在生成黑名单文件");
    File.writeTo(banlist_path,"{}");
}
if(!file.exists(banlog_path)) {
    File.writeLine(banlog_path, '\ufeff操作时间,封禁唯一识别码,封禁玩家昵称,封禁玩家xuid,封禁时长,封禁原因,解封时间,封禁玩家系统,封禁玩家ip,封禁玩家客户端ID,附加信息');
}

mc.listen("onJoin", player => {
    //云黑判断
    network.httpGet(_BLACKBE_ADDRESS_PREFIX + 'name=' + player.name + '&xuid=' + player.xuid, function (status, result) {
        if (status != 200)
            log('云黑检查失败！请检查你的网络连接。返回码：' + status);
        else {
            let res = JSON.parse(result);
            if (!res.success)
                log('云黑检查失败！错误码：' + res.status);
            else if (res.status == 2000) {
                setTimeout(function () {
                    player.kick("§c§l很显然您在云黑黑名单之中！/n所以您无法进入本服务器游玩！");
                }, 1);
                log('发现玩家' + player.realName + '在BlackBe云端黑名单上，已断开连接！');
                let record = res.data.info[0];
                if(record)
                {
                    log('玩家违规等级：' + record.level);
                    log('玩家违规原因：' + record.info);
                }
            }
            else {
                log('对玩家' + player.realName + '的云端黑名单检测通过。');
            }
        }
    });
    let banlist = JSON.parse(File.readFrom(banlist_path));
    let time = new Date();
    let endMonth = "";
    let endDate = "";
    let endHour = "";
    let endMinute = "";
    let endSecond = "";
    time.setTime(new Date(system.getTimeStr()).getTime());
    if (time.getMonth() < 9) {
        endMonth = 1 + time.getMonth();
        endMonth = "0" + endMonth;
    } else {
        endMonth = 1 + time.getMonth();
    }
    if (time.getDate() < 10) {
        endDate = "0" + time.getDate();
    } else {
        endDate = time.getDate();
    }
    if (time.getHours() < 10) {
        endHour = "0" + time.getHours();
    } else {
        endHour = time.getHours();
    }
    if (time.getMinutes() < 10) {
        endMinute = "0" + time.getMinutes();
    } else {
        endMinute = time.getMinutes();
    }
    if (time.getSeconds() < 10) {
        endSecond = "0" + time.getSeconds();
    } else {
        endSecond = time.getSeconds();
    }
    let NowTime = time.getFullYear() + "-" + endMonth + "-" + endDate + " " + endHour + ":" + endMinute + ":" + endSecond;
    let device = player.getDevice();
    for(let xuid in banlist) {
        //首先判断XUID,到时间就删
        if (xuid == player.xuid) {
            if (NowTime <= banlist[xuid].endTime) {
                //记录数据
                banlist[xuid].serverAddress = device.serverAddress;
                banlist[xuid].ip = device.ip;
                banlist[xuid].clientId = device.clientId;
                banlist[xuid].os = device.os;
                File.writeTo(banlist_path,JSON.stringify(banlist, null, 2));
                player.kick("§c封禁唯一识别码: [§e" + banlist[xuid].banid + "§c]\n§c您由于§e" + banlist[xuid].reason + "§r§c被暂时禁止进入本服务器\n您的帐号将于§e" + banlist[xuid].endTime + "§c由系统自动解封" + "\n如果对本次封禁有异议，请将封禁唯一识别码发给腐竹申诉！")
                // let device = player.getDevice();
                File.writeLine(banlog_path,`\ufeff${NowTime},${banlist[xuid].banid},${banlist[xuid].name},${xuid},,,,${device.os},${device.ip},${device.clientId},尝试进服被拦截`)
                break;
            } else {
                delete banlist[xuid]
                File.writeLine(banlog_path,`\ufeff${NowTime},${banlist[xuid].banid},${banlist[xuid].name},${xuid},,,,${device.os},${device.ip},${device.clientId},达到解封标准，允许进服`)
                File.writeTo(banlist_path,JSON.stringify(banlist, null, 2));
                break;
            }
        }
        //其次判断玩家名称，同时如果第一次进则记录数据
        if (banlist[xuid].name == player.realName) {
            if (NowTime <= banlist[xuid].endTime) {
                //记录数据
                banlist[xuid].serverAddress = device.serverAddress;
                banlist[xuid].ip = device.ip;
                banlist[xuid].clientId = device.clientId;
                banlist[xuid].os = device.os;
                banlist[xuid].xuid = player.xuid;
                banlist[player.xuid] = banlist[xuid]
                player.kick("§c封禁唯一识别码: [§e" + banlist[xuid].banid + "§c]\n§c您由于§e" + banlist[xuid].reason + "§r§c被暂时禁止进入本服务器\n您的帐号将于§e" + banlist[xuid].endTime + "§c由系统自动解封" + "\n如果对本次封禁有异议，请将封禁唯一识别码发给腐竹申诉！")
                File.writeLine(banlog_path,`\ufeff${NowTime},${banlist[xuid].banid},${banlist[xuid].name},${player.xuid},,,,${device.os},${device.ip},${device.clientId},封禁后第一次进服被拦截`)
                delete banlist[xuid]
                File.writeTo(banlist_path,JSON.stringify(banlist, null, 2));
                break;
            } else {
                delete banlist[xuid]
                File.writeLine(banlog_path,`\ufeff${NowTime},${banlist[xuid].banid},${banlist[xuid].name},${player.xuid},,,,${device.os},${device.ip},${device.clientId},达到解封标准，允许进服`)
                File.writeTo(banlist_path,JSON.stringify(banlist, null, 2));
                break;
            }
        }
        //判断玩家客户端ID以及ip段，两个符合一个就无法进入服务器并单独提示
        if (banlist[xuid].clientId == device.clientId || banlist[xuid].ip.slice(0,banlist[xuid].ip.lastIndexOf(".")) == device.ip.slice(0,device.ip.lastIndexOf("."))) {
            if (NowTime <= banlist[xuid].endTime) {
                let time = new Date();
                time.setTime(new Date(system.getTimeStr()).getTime());
                let endMonth = "";
                let endDate = "";
                let endHour = "";
                let endMinute = "";
                let endSecond = "";
                if (time.getMonth() < 9) {
                    endMonth = 1 + time.getMonth();
                    endMonth = "0" + endMonth;
                } else {
                    endMonth = 1 + time.getMonth();
                }
                if (time.getDate() < 10) {
                    endDate = "0" + time.getDate();
                } else {
                    endDate = time.getDate();
                }
                if (time.getHours() < 10) {
                    endHour = "0" + time.getHours();
                } else {
                    endHour = time.getHours();
                }
                if (time.getMinutes() < 10) {
                    endMinute = "0" + time.getMinutes();
                } else {
                    endMinute = time.getMinutes();
                }
                if (time.getSeconds() < 10) {
                    endSecond = "0" + time.getSeconds();
                } else {
                    endSecond = time.getSeconds();
                }
                let NowTime = time.getFullYear() + "-" + endMonth + "-" + endDate + " " + endHour + ":" + endMinute + ":" + endSecond;
                let banplayer = {};
                banplayer.banid = system.randomGuid();
                banplayer.name = player.name;
                banplayer.xuid = player.xuid;
                banplayer.serverAddress = device.serverAddress;
                banplayer.ip = device.ip;
                banplayer.clientId = device.clientId;
                banplayer.os = device.os;
                banplayer.reason = "NIA服务器风险账号控制"
                banplayer.startTime= NowTime
                banplayer.endTime= banlist[xuid].endTime
                banplayer.operator = "小号系统追封"
                banlist[banplayer.xuid] = banplayer;
                File.writeTo(banlist_path,JSON.stringify(banlist, null, 2));
                player.kick("§c封禁唯一识别码: [§e" + banlist[xuid].banid + "§c]\n§c虽然可能您在本账号没有任何违规项目\n但是根据NIA服务器数据分析，认为您的账号仍然对服务器安全仍然有一定威胁！\n所以您仍然进入不了服务器，您可以于§e" + banlist[xuid].endTime + "§c进入服务器" + "\n如果对本次封禁有异议，请将封禁唯一识别码发给腐竹申诉！")
                File.writeLine(banlog_path,`\ufeff${NowTime},${banlist[xuid].banid},${player.realName},${player.xuid},,,,${device.os},${device.ip},${device.clientId},疑似${banlist[xuid].name}小号进入服务器，已自动拦截!`)
            } else {
                delete banlist[xuid]
                File.writeLine(banlog_path,`\ufeff${NowTime},${banlist[xuid].banid},${banlist[xuid].name},${player.xuid},,,,${device.os},${device.ip},${device.clientId},达到解封标准，允许进服`)
                File.writeTo(banlist_path,JSON.stringify(banlist, null, 2));
                break;
            }
            break;
        }

    }
})

//注册指令
mc.listen("onServerStarted",function () {
    let cmdBan = mc.newCommand("ban", "封禁玩家", PermType.GameMasters);
        cmdBan.mandatory("playername",ParamType.RawText)
        cmdBan.optional("bantime", ParamType.Int);
        cmdBan.optional("reason", ParamType.RawText);
        cmdBan.overload(["playername", "bantime", "reason"]);
        cmdBan.setCallback((cmdBan, origin, out, res) => {
            //首先初始化一个列表
            let banplayer = {};
            //获取玩家对象
            banplayer.banid = system.randomGuid();
            let banlist = JSON.parse(File.readFrom(banlist_path));
            banplayer.name = res.playername;
            let banpl = mc.getPlayer(res.playername);
            if (banpl == null) {
                //不在线则直接从Xuid数据库获取玩家Xuid
                if (data.name2xuid(res.playername)) {
                    banplayer.xuid = data.name2xuid(res.playername);
                    banplayer.serverAddress = "";
                    banplayer.ip = "";
                    banplayer.clientId = "";
                    banplayer.os = "";
                } else {
                    banplayer.xuid = banplayer.banid
                    banplayer.serverAddress = "";
                    banplayer.ip = "";
                    banplayer.clientId = "";
                    banplayer.os = "";
                }
            } else {
                //在线直接获取Xuiduid
                banplayer.xuid = banpl.xuid;
                let device = banpl.getDevice();
                banplayer.serverAddress = device.serverAddress;
                banplayer.ip = device.ip;
                banplayer.clientId = device.clientId;
                banplayer.os = device.os;
            }
            if (res.reason) {
                banplayer.reason = res.reason;
            } else {
                banplayer.reason = "在服务器有不正当行为"
            }
            if (res.bantime) {
                let time = new Date();
                let endMonth = "";
                let endDate = "";
                let endHour = "";
                let endMinute = "";
                let endSecond = "";
                time.setTime(new Date(system.getTimeStr()).getTime());
                if (time.getMonth() < 9) {
                    endMonth = 1 + time.getMonth();
                    endMonth = "0" + endMonth;
                } else {
                    endMonth = 1 + time.getMonth();
                }
                if (time.getDate() < 10) {
                    endDate = "0" + time.getDate();
                } else {
                    endDate = time.getDate();
                }
                if (time.getHours() < 10) {
                    endHour = "0" + time.getHours();
                } else {
                    endHour = time.getHours();
                }
                if (time.getMinutes() < 10) {
                    endMinute = "0" + time.getMinutes();
                } else {
                    endMinute = time.getMinutes();
                }
                if (time.getSeconds() < 10) {
                    endSecond = "0" + time.getSeconds();
                } else {
                    endSecond = time.getSeconds();
                }
                banplayer.startTime = time.getFullYear() + "-" + endMonth + "-" + endDate + " " + endHour + ":" + endMinute + ":" + endSecond;
                time.setTime(new Date(system.getTimeStr()).getTime() + 3600000 * res.bantime);
                if (time.getMonth() < 9) {
                    endMonth = 1 + time.getMonth();
                    endMonth = "0" + endMonth;
                } else {
                    endMonth = 1 + time.getMonth();
                }
                if (time.getDate() < 10) {
                    endDate = "0" + time.getDate();
                } else {
                    endDate = time.getDate();
                }
                if (time.getHours() < 10) {
                    endHour = "0" + time.getHours();
                } else {
                    endHour = time.getHours();
                }
                if (time.getMinutes() < 10) {
                    endMinute = "0" + time.getMinutes();
                } else {
                    endMinute = time.getMinutes();
                }
                if (time.getSeconds() < 10) {
                    endSecond = "0" + time.getSeconds();
                } else {
                    endSecond = time.getSeconds();
                }
                banplayer.endTime = time.getFullYear() + "-" + endMonth + "-" + endDate + " " + endHour + ":" + endMinute + ":" + endSecond;
            } else {
                let time = new Date();
                time.setTime(new Date(system.getTimeStr()).getTime());
                let endMonth = "";
                let endDate = "";
                let endHour = "";
                let endMinute = "";
                let endSecond = "";
                if (time.getMonth() < 9) {
                    endMonth = 1 + time.getMonth();
                    endMonth = "0" + endMonth;
                } else {
                    endMonth = 1 + time.getMonth();
                }
                if (time.getDate() < 10) {
                    endDate = "0" + time.getDate();
                } else {
                    endDate = time.getDate();
                }
                if (time.getHours() < 10) {
                    endHour = "0" + time.getHours();
                } else {
                    endHour = time.getHours();
                }
                if (time.getMinutes() < 10) {
                    endMinute = "0" + time.getMinutes();
                } else {
                    endMinute = time.getMinutes();
                }
                if (time.getSeconds() < 10) {
                    endSecond = "0" + time.getSeconds();
                } else {
                    endSecond = time.getSeconds();
                }
                banplayer.startTime = time.getFullYear() + "-" + endMonth + "-" + endDate + " " + endHour + ":" + endMinute + ":" + endSecond;
                banplayer.endTime = "2099-12-31 12:00:00";
            }
            if (origin.type == 0) {
                banplayer.operator = origin.player.realName;
            } else if (origin.type == 7) {
                banplayer.operator = "后台执行"
            }
            banlist[banplayer.xuid] = banplayer;
            File.writeTo(banlist_path,JSON.stringify(banlist, null, 2));
            let now = system.getTimeStr();
            if (origin.type == "player") {
                origin.player.tell("§c>> 玩家 " + res.playername + " 已被成功封禁!他的账号将于 " + banplayer.endTime + " 由系统自动解封。如果封禁错误请使用/unban <name>指令进行解封！")
            } else {
                colorLog("yellow", "玩家 " + res.playername + " 已被成功封禁!他的账号将于 " + banplayer.endTime + " 由系统自动解封。如果封禁错误请使用/unban <name>指令进行解封！")
            }
            //File.writeLine(banlog_path, '\ufeff操作时间,封禁唯一识别码,封禁玩家昵称,封禁玩家xuid,封禁时长,封禁原因,解封时间,封禁玩家系统,封禁玩家ip,封禁玩家客户端ID,附加信息')
            if (banpl) {
                banpl.kick("§c封禁唯一识别码: [§e" + banplayer.banid + "§c]\n§c您由于§e" + banplayer.reason + "§r§c被暂时禁止进入本服务器\n您的帐号将于§e" + banplayer.endTime + "§c由系统自动解封" + "\n如果对本次封禁有异议，请将封禁唯一识别码发给腐竹申诉！\n§a§l这是第一次踢出的界面，要申诉请截图本界面！")
            }
            File.writeLine(banlog_path,`\ufeff${banplayer.startTime},${banplayer.banid},${banplayer.name},${banplayer.xuid},${res.bantime},${banplayer.reason},${banplayer.endTime},${banplayer.os},${banplayer.ip},${banplayer.clientId},封禁玩家`)
        })
        cmdBan.setup()

    //unban指令的注册以及相关功能的实现
    let cmdunban = mc.newCommand("unban", "解封封禁玩家", PermType.GameMasters);
    cmdunban.mandatory("playername", ParamType.RawText);
    cmdunban.overload(["playername"]);
    cmdunban.setCallback((cmdunban, origin, out, res) => {
        let banlist = JSON.parse(File.readFrom(banlist_path));
        let UNBANresult = false;
        for (let xuid in banlist) {
            if (banlist[xuid].name == res.playername) {
                if (origin.type == "player") {
                    origin.player.tell("§a>> 玩家 " + banlist[xuid].name + " §a解封成功！");
                } else {
                    colorLog("yellow", "玩家 " + banlist[xuid].name + " 解封成功！")
                }
                delete banlist[xuid];
                File.writeTo(banlist_path,JSON.stringify(banlist, null, 2));
                UNBANresult = true;
                break;
            }
        }
        if (!UNBANresult) {
            if (origin.type == "player") {
                origin.player.tell("§c>> 玩家 " + res.playername + " §c没有存在于封禁玩家数据文件中！");
            } else {
                colorLog("red", "玩家 " + res.playername + " 没有存在于封禁玩家数据文件中！")
            }
        }
    })
    cmdunban.setup();
})



