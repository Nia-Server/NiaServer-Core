const http = require('http');
const fs = require('fs');
const os = require('os-utils');
//端口不要更换！
const port = 3000;
const { createClient } = require("icqq");
const { fail } = require('assert');
const PLAYERCMDS = ["list","申请白名单"]
const serverInfo = {cpuUsage: 0}

//初始化变量
var AccountOnline = false;
var ServerStarted = false;

//初始化配置文件格式，请勿更改！！！！
var config = {"platform": 6,"account": 123456,"password": "","QQGroup": 123456789,"owner": [123456]}
var client = createClient({platform:config.platform})
var account = config.account
var password = config.password
var group = client.pickGroup(config.QQGroup)

//配置文件地址
const cfg_path = "./config.json";

const ERROR = "[NIA-Server-BOT] \x1b[31m[ERROR]\x1b[0m [" + new Date().toLocaleString('zh', { hour12: false }).replaceAll('/', '-') + "] "
const INFO = "[NIA-Server-BOT] \x1b[32m[INFO]\x1b[0m [" + new Date().toLocaleString('zh', { hour12: false }).replaceAll('/', '-') + "] "
const WARN = "[NIA-Server-BOT] \x1b[33m[WARN]\x1b[0m [" + new Date().toLocaleString('zh', { hour12: false }).replaceAll('/', '-') + "] "

//判断配置文件是否存在
fs.access(cfg_path, (err) => {
  //不存在
  if (err) {
    fs.writeFile(cfg_path, JSON.stringify(config,null,4), 'utf-8', (err) => {
      if (err) {
        return console.log(ERROR + '该文件不存在，重新创建失败！')
      }
    });
    console.log(WARN + "配置文件不存在，已重新创建，请修改配置文件后再运行！");
    //直接结束本次进程
    process.exit(1)
  } else {
    //存在，读取配置文件
    fs.readFile(cfg_path,(err,data) => {
      if (err) {
        return console.log(ERROR + "配置文件读取错误！")
      }
      config = JSON.parse(data.toString())
      //再次读取配置文件中的数据
      account = config.account
      password = config.password
      group = client.pickGroup(config.QQGroup)
      console.log(INFO + "配置文件数据读取成功，正在启动机器人！");
      //登录qq机器人
      client = createClient({platform:config.platform})
      client.on('system.login.slider', (e) => {
          console.log('输入滑块地址获取的ticket后继续。\n滑块地址:    ' + e.url)
          process.stdin.once('data', (data) => {
              client.submitSlider(data.toString().trim())
          })
      })
      client.on('system.login.qrcode', (e) => {
          console.log('扫码完成后回车继续:    ')
          process.stdin.once('data', () => {
              client.login()
          })
      })
      client.on('system.login.device', (e) => {
          console.log('请选择验证方式:(1：短信验证   其他：扫码验证)')
          process.stdin.once('data', (data) => {
              if (data.toString().trim() === '1') {
                  client.sendSmsCode()
                  console.log('请输入手机收到的短信验证码:')
                  process.stdin.once('data', (res) => {
                      client.submitSmsCode(res.toString().trim())
                  })
              } else {
                  console.log('扫码完成后回车继续：' + e.url)
                  process.stdin.once('data', () => {
                      client.login()
                  })
              }
          })
      })
      client.login(account,password)
      //判断机器人是否登录成功
      client.on('system.online', (e) => {
        AccountOnline = true
        group.sendMsg("机器人登陆成功！")
        console.log(INFO + "机器人登陆成功！")
        group = client.pickGroup(config.QQGroup)
      })
    })
  }
})

var commodities = []

//判断有没有market文件，没有直接初始化
fs.access("./market.json", (err) => {
  //不存在
  if (err) {
    //没有文件直接创建
    fs.writeFile("./market.json", "[]", 'utf-8', (err) => {
      if (err) {
        return console.log(ERROR + '该文件不存在且重新创建失败！')
        process.exit(1)
      }
    });
  } else {
    fs.readFile("./market.json",(err,data) => {
      if (err) {
        return console.log(ERROR + "market文件读取错误！")
      }
      commodities = JSON.parse(data.toString())
    })
    console.log(INFO + "market.json已成功读取！")
  }
})





process.on('unhandledRejection', error => {});

//初始化一些变量便于下方的调用
var msgboxs= {}
var repData = {}
repData.msgboxs = []

//定义监听服务器
const server = http.createServer()

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
        console.log(INFO + "已经与MC服务器成功连接！")
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
          return console.log(ERROR + "market文件读取错误！")
        }
        commodities = JSON.parse(data.toString())
        //开始读取文件
        res.statusCode = 200;
        ServerStarted = true;
        res.setHeader('Content-Type', 'text/plain;charset=utf-8');
        res.end(JSON.stringify(commodities));
        group.sendMsg("交易市场数据获得成功")
        console.log(INFO + "market.json已成功读取！")
      })
      break;
    //监听服务器开服
    case '/ServerStarted':
      res.statusCode = 200;
      ServerStarted = true;
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      res.end("Server Started");
      group.sendMsg("服务器已启动！")
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
          group.sendMsg(playerjoinData + " 加入了服务器!")
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
          group.sendMsg(playerleaveData + " 离开了服务器!")
        }
      })
      break;
    case '/Market':
      //开始读取文件
      // let commodities = {}
      // fs.readFileSync("./market.json",(err,data) => {
      //   if (err) {
      //     //
      //     return console.log("market文件读取错误！")
      //   }
      //   commodities = JSON.parse(data.toString())
      // })
      // res.statusCode = 200;
      // res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      // res.end(JSON.stringify(commodities));
      break;
    //监听玩家市场上架物品
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
          group.sendMsg(`【玩家市场上新提醒】\n玩家 ${itemData.playerName} 在市场中上架了全新的商品!\n商品名称: ${itemData.name} (${itemData.typeid}) \n商品简介: ${itemData.description} \n商品单价: ${itemData.price}\n商品剩余库存: ${itemData.amount}\n商品流水号: ${itemData.id} \n想要的玩家赶快上线购买吧！`)
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
          // fs.access("./market.json", (err) => {
          //   //不存在
          //   if (err) {
          //     //没有文件直接创建
          //     fs.writeFile("./market.json", "[]", 'utf-8', (err) => {
          //       if (err) {
          //         return console.log('该文件不存在且重新创建失败！')
          //         process.exit(1)
          //       }
          //     });
          //     //创建成功后直接读取
          //     marketData = []
          //     marketData.push(itemData)
          //     fs.writeFile("./market.json",JSON.stringify(marketData,null,4),function(err){
          //         if(err){
          //           res.statusCode = 201;
          //           return console.error(err);
          //         }
          //         console.log('新增成功');
          //         res.statusCode = 200;
          //     })
          //   } else {
          //     //存在，读取配置文件
          //     fs.readFile("./market.json",(err,data) => {
          //       if (err) {
          //         res.statusCode = 201;
          //         return console.log("配置文件读取错误！")
          //       }
          //       marketData = JSON.parse(data.toString())
          //       marketData.push(itemData)
          //       fs.writeFile("./market.json",JSON.stringify(marketData,null,4),function(err){
          //           if(err){
          //               console.error(err);
          //           }
          //           res.statusCode = 200;
          //       })
          //     })
          //   }
          // })
        }
      })
      // if (result) {
      //   res.statusCode = 200;
      //   console.log("123")
      // } else {
      //   res.statusCode = 201;
      //   console.log("456")
      // }
      break;
  }
})

//监听服务器开启成功提醒
server.listen(port,'127.0.0.1', () => {
  console.info(INFO + "NIA服务器监听服务器已经成功在 http://127.0.0.1:" + port + " 启动！");
});

//监听群聊消息
client.on('message.group', (e) => {
  //等适配
    if (e.group_id == config.QQGroup && e.sender.user_id != 3467371607) {
        if (e.message[0].text.toString().slice(0,1) == "-") {
            if (PLAYERCMDS.indexOf(e.message[0].text.toString().slice(1)) != -1) {
                e.group.sendMsg("开发中功能！")
            } else if (e.sender.role == "owner" || e.sender.role == "admin") {
                e.group.sendMsg("开发中功能！")
            } else {
                e.group.sendMsg("您不是管理员，无法执行相关指令！")
            }
        } else {
            if (e.sender.card == "") {
              repData.msgboxs.push([e.sender.nickname,e.message[0].text.toString()])
            } else {
              repData.msgboxs.push([e.sender.card,e.message[0].text.toString()])
            }
        }
    }
})

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
        getCPUUsage()
        if (serverInfo.cpuUsage <= 0.6) {
            group.setCard(3374574180,"🟢流畅 | CPU占用率：" + (serverInfo.cpuUsage*100).toFixed(2) + "%")
        } else if (serverInfo.cpuUsage <= 0.8) {
            group.setCard(3374574180,"🟡一般 | CPU占用率：" + (serverInfo.cpuUsage*100).toFixed(2) + "%")
        } else if (serverInfo.cpuUsage >= 0.9) {
            group.setCard(3374574180,"🔴卡死 | CPU占用率：" + (serverInfo.cpuUsage*100).toFixed(2) + "%")
        }
    }
    if (!ServerStarted && AccountOnline) {
      console.log(ERROR + "暂未连接到MC服务器！")
    }
}, 10000)
