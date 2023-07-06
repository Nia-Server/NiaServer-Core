const http = require('http');
const fs = require('fs');
const os = require('os-utils');
//端口不要更换！
const port = 10086;
//const { createClient } = require("icqq");
//const PLAYERCMDS = ["list","申请白名单","查"]
const serverInfo = {cpuUsage: 0}

//初始化变量
var AccountOnline = true;
var ServerStarted = false;

//初始化配置文件格式，请勿更改！！！！
var config = {"account": 123456,"password": "","QQGroup": 123456789,"owners": [123456],"botconfig":{"platform": 6}}
var account = config.account
var password = config.password

//配置文件地址
const cfg_path = "./config.json";


const log = {
  error(message) {
    console.log("[NIA-Server-BOT] \x1b[31m[ERROR]\x1b[0m [" + new Date().toLocaleString('zh', { hour12: false }).replaceAll('/', '-') + "] " + message)
  },
  info(message) {
    console.log("[NIA-Server-BOT] \x1b[32m[INFO]\x1b[0m [" + new Date().toLocaleString('zh', { hour12: false }).replaceAll('/', '-') + "] " + message)
  },
  warn(message) {
    console.log("[NIA-Server-BOT] \x1b[33m[WARN]\x1b[0m [" + new Date().toLocaleString('zh', { hour12: false }).replaceAll('/', '-') + "] " + message)
  }
}

//判断配置文件是否存在
// fs.access(cfg_path, (err) => {
//   //不存在
//   if (err) {
//     fs.writeFile(cfg_path, JSON.stringify(config,null,4), 'utf-8', (err) => {
//       if (err) {
//         return log.error('该文件不存在，重新创建失败！')
//       }
//     });
//     log.warn("配置文件不存在，已重新创建，请修改配置文件后再运行！");
//     //直接结束本次进程
//     process.exit(1)
//   } else {
//     //存在，读取配置文件
//     fs.readFile(cfg_path,(err,data) => {
//       if (err) {
//         return log.error("配置文件读取错误！")
//       }
//       config = JSON.parse(data.toString())
//       //再次读取配置文件中的数据
//       account = config.account
//       password = config.password
//       group = client.pickGroup(config.QQGroup)
//       log.info("配置文件数据读取成功，正在启动机器人！");
//       //登录qq机器人
//       client = createClient(config.botconfig)
//       client.on('system.login.slider', (e) => {
//           console.log('输入滑块地址获取的ticket后继续。\n滑块地址:    ' + e.url)
//           process.stdin.once('data', (data) => {
//               client.submitSlider(data.toString().trim())
//           })
//       })
//       client.on('system.login.qrcode', (e) => {
//           console.log('扫码完成后回车继续:    ')
//           process.stdin.once('data', () => {
//               client.login()
//           })
//       })
//       client.on('system.login.device', (e) => {
//           console.log('请选择验证方式:(1：短信验证   其他：扫码验证)')
//           process.stdin.once('data', (data) => {
//               if (data.toString().trim() === '1') {
//                   client.sendSmsCode()
//                   console.log('请输入手机收到的短信验证码:')
//                   process.stdin.once('data', (res) => {
//                       client.submitSmsCode(res.toString().trim())
//                   })
//               } else {
//                   console.log('扫码完成后回车继续：' + e.url)
//                   process.stdin.once('data', () => {
//                       client.login()
//                   })
//               }
//           })
//       })
//       client.login(account,password)
//       //判断机器人是否登录成功
//       client.on('system.online', (e) => {
//         AccountOnline = true
//         group = client.pickGroup(config.QQGroup)
//         group.sendMsg("机器人登陆成功！")
//         log.info("机器人登陆成功！")
//       })

//       //监听群聊消息
//       client.on('message.group', (e) => {
//         //等适配
//           if (e.group_id == config.QQGroup && e.sender.user_id != 3467371607) {
//               if (e.message[0].text.toString().slice(0,1) == "#") {
//                 let message = e.message[0].text.toString().slice(1).split(" ")
//                 switch (message[0]) {
//                   default:
//                     e.group.sendMsg("未知的指令，请重新检查后再次发送!")
//                     break;
//                   case "申请白名单":
//                     if (message[1] == undefined) {
//                       e.group.sendMsg("未知的XboxID，请发送形如 #申请白名单 Steve 来获取白名单！")
//                     } else {
//                       e.group.sendMsg("你已成功将XboxID <" + message[1] + "> 与qq <" + e.sender.user_id + "> 成功绑定！如需解绑/换绑请联系管理员！")
//                     }
//                     break;
//                   case "查市场":
//                     fs.readFile("./market.json",(err,data) => {
//                       if (err) {
//                         return log.error("market文件读取错误！")
//                       }
//                       commodities = JSON.parse(data.toString())
//                       let marketStr = ""
//                       if (message[1] == undefined) {
//                         for (let i = 0; i < commodities.length; i++) {
//                           marketStr = "商品名称:" + commodities[i].name + " 商品单价:" + commodities[i].price + "\n" + marketStr
//                         }
//                         e.group.sendMsg("已成功获取玩家市场数据:\n" + marketStr)
//                       }
//                     })
//                     break;
//                 }
//                   // if (PLAYERCMDS.indexOf(e.message[0].text.toString().slice(1)) != -1) {
//                   //     e.group.sendMsg("开发中功能！")
//                   // } else if (e.sender.role == "owner" || e.sender.role == "admin") {
//                   //     e.group.sendMsg("开发中功能！")
//                   // } else {
//                   //     e.group.sendMsg("您不是管理员，无法执行相关指令！")
//                   // }
//               } else {
//                   if (e.sender.card == "") {
//                     repData.msgboxs.push([e.sender.nickname,e.message[0].text.toString()])
//                   } else {
//                     repData.msgboxs.push([e.sender.card,e.message[0].text.toString()])
//                   }
//               }
//           }
//       })

//     })
//   }
// })

var commodities = []

//判断有没有market文件，没有直接初始化
fs.access("./market.json", (err) => {
  //不存在
  if (err) {
    //没有文件直接创建
    fs.writeFile("./market.json", "[]", 'utf-8', (err) => {
      if (err) {
        log.error('该文件不存在且重新创建失败！')
        process.exit(1)
      }
    });
  } else {
    fs.readFile("./market.json",(err,data) => {
      if (err) {
        return log.error("market文件读取错误！")
      }
      commodities = JSON.parse(data.toString())
    })
    log.info("market.json已成功读取！")
  }
})



//process.on('unhandledRejection', error => {});

//初始化一些变量便于下方的调用
var msgboxs= {}
var repData = {}
repData.msgboxs = []

//定义监听服务器
var server = http.createServer()

//如果页面生成失败则调用该函数
function hadErrer(err,res){
  console.log(err)
  res.end('server err')
}

server.on("request", (req, res) => {
  let arr = [];
  switch (req.url) {
    //监听直接访问
    case "/":
      fs.readFile('./index.html', (err, data) => {
        if (err) {
          return hadErrer(err,res)
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/html');
        res.end(data.toString());
      })
      break;
    //与mc服务器进行通讯，接受其请求
    case "/Check":
      if (!ServerStarted) {
        ServerStarted = true;
        log.info("已经与MC服务器成功连接！")
      }
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      res.end(JSON.stringify(repData));
      repData = {}
      repData.msgboxs = []
      break;
    case '/MarketInitialize':
      fs.readFile("./market.json",(err,data) => {
        if (err) {
          return log.error("market文件读取错误！")
        }
        commodities = JSON.parse(data.toString())
        //开始读取文件
        res.statusCode = 200;
        ServerStarted = true;
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end(JSON.stringify(commodities));
        log.info("market.json已成功读取！")
      })
      break;
    //监听服务器开服
    case '/ServerStarted':
      log.info("已经与MC服务器成功连接！")
      res.statusCode = 200;
      ServerStarted = true;
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      res.end("Server Started");
      log.info("服务器已启动！")
      break;
    //监听玩家说话并转发
    case '/PlayerChat':
      req.on("data", (data) => {
        arr.push(data)
      })
      req.on("end", () => {
        let msgData = JSON.parse(Buffer.concat(arr).toString())
        if (AccountOnline) {
          group.sendMsg("<" + msgData.name + "> " + msgData.message)
        }
      })
      res.statusCode = 200;
      break;
    //监听玩家加入服务器
    case '/PlayerJoin':
      req.on("data", (data) => {
        arr.push(data)
      })
      req.on("end", () => {
        let playerjoinData = Buffer.concat(arr).toString()
        if (AccountOnline) {
            log.info(playerjoinData + " 加入了服务器!")
        }
      })
      break;
    //监听玩家退出服务器
    case '/PlayerLeave':
      req.on("data", (data) => {
        arr.push(data)
      })
      req.on("end", () => {
        let playerleaveData = Buffer.concat(arr).toString()
        if (AccountOnline) {
            log.info(playerleaveData + " 离开了服务器!")
        }
      })
      break;
    case '/Shelf':
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      res.end("success")
      req.on("data", (data) => {
        arr.push(data)
      })
      req.on("end", () => {
        let itemData = JSON.parse(Buffer.concat(arr).toString())
        if (AccountOnline) {
            log.info(`【玩家市场上新提醒】\n玩家 ${itemData.playerName} 在市场中上架了全新的商品!\n商品名称: ${itemData.name} (${itemData.typeid}) \n商品简介: ${itemData.description} \n商品单价: ${itemData.price}\n商品剩余库存: ${itemData.amount}\n商品流水号: ${itemData.id} \n想要的玩家赶快上线购买吧！`)
          //group.sendMsg(JSON.stringify(itemData,null,2))
          fs.readFile("./market.json",(err,data) => {
            if (err) {
              //
              return console.log("market文件读取错误！")
            }
            marketData = JSON.parse(data.toString())
            marketData.push(itemData)
            fs.writeFile("./market.json",JSON.stringify(marketData,null,4),function(err){
                if(err){
                    console.error(err);
                }
                errInfo = {}
                errInfo.info = "shelf"
                repData.errData = marketData
            })
          })
        }
      })
      break;
  }
})

//监听服务器开启成功提醒
server.listen(port,'127.0.0.1', () => {
  log.info("NIA服务器监听服务器已经成功在 http://127.0.0.1:" + port + " 启动！");
});


//获得系统cou占用率
async function getCPUUsage() {
	let promise = new Promise((resolve) => {
		os.cpuUsage(function(v){
			resolve(v)
		});
	});
	serverInfo.cpuUsage = await promise
}

//周期运作
setInterval(() => {
    if (AccountOnline) {
      //等后续获取自己的qq号
        getCPUUsage()
        // if (serverInfo.cpuUsage <= 0.6) {
        //     group.setCard(3374574180,"🟢流畅 | CPU占用率：" + (serverInfo.cpuUsage*100).toFixed(2) + "%")
        // } else if (serverInfo.cpuUsage <= 0.8) {
        //     group.setCard(3374574180,"🟡一般 | CPU占用率：" + (serverInfo.cpuUsage*100).toFixed(2) + "%")
        // } else if (serverInfo.cpuUsage >= 0.9) {
        //     group.setCard(3374574180,"🔴卡死 | CPU占用率：" + (serverInfo.cpuUsage*100).toFixed(2) + "%")
        // }
    }
    if (!ServerStarted && AccountOnline) {
      log.error("暂未连接到MC服务器！")
    }
}, 10000)
