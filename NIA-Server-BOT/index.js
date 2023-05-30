const http = require('http');
const fs = require('fs');
const os = require('os-utils');
const config = require('./config.json')
const account = config.account
const password = config.password

const { createClient } = require("icqq")

const client = createClient()

const PLAYERCMDS = ["list","申请白名单"]

var AccountOnline = false;
var ServerStarted = false;

const port = 3000;

const serverInfo = {
	cpuUsage: 0
}


var msgboxs= {}
var repData = {}
repData.msgboxs = []

// isFileExisted("./config.json")

// // 检查文件是否存在于当前目录中。
// function isFileExisted(path_way) {
//   console.log("sss")
//   return new Promise((resolve, reject) => {
//     fs.access(path_way, (err) => {
//       if (err) {
//         fs.appendFileSync(path_way, '{"USEBOT": true,"account": 3374574180,"password": "","QQGroup": 595540532}', 'utf-8', (err) => {
//           if (err) {
//             return console.log('该文件不存在，重新创建失败！')
//           }
//           console.log("文件不存在，已新创建");
//         });
//         reject(false);
//       } else {
//         resolve(true);
//       }
//     })
//   })
// };


// //定义时间
// var date = new Date();

// // 年月日
// var year = date.getFullYear();
// var month = date.getMonth() + 1;
// var day = date.getDate();

// // 时分秒
// var hour = date.getHours();
// var minute = date.getMinutes();
// var second = date.getSeconds();

const server = http.createServer()

function hadErrer(err,res){
  console.log(err)
  res.end('server err')
}

server.on("request", (req, res) => {
  let arr = [];
  switch (req.url) {
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
    case "/Check":
      console.log("成功接收MC检查请求！")
      ServerStarted = true;
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      res.end(JSON.stringify(repData));
      //console.error(JSON.stringify(repData))
      repData = {}
      repData.msgboxs = []
      break;
    case '/ServerStarted':
      res.statusCode = 200;
      ServerStarted = true;
      res.setHeader('Content-Type', 'text/plain;charset=utf-8');
      res.end("Server Started");
      group.sendMsg("服务器已启动！")
      break;
    // case "/CheckGrounpChat":
    //   ServerStarted = true;
    //   console.log("成功接收MC群消息检查请求！")
    //   res.statusCode = 200;
    //   res.setHeader('Content-Type', 'text/plain;charset=utf-8');
    //   res.end(JSON.stringify(msgboxs));
    //   msgboxs= {}
    //   break;
    case '/PlayerChat':
      console.log("成功接收群消息！")
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
  }
  // res.statusCode = 200;
  // res.setHeader('Content-Type', 'text/plain')
  // res.end("hello minecraft!");
})

server.listen(port,'127.0.0.1', () => {
  console.info(`NIA服务器监听服务器已经成功在 http://127.0.0.1:${port} 启动！`);
});


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

client.on('system.online', (e) => {
    AccountOnline = true
    group.sendMsg("机器人登陆成功！")
    console.log("机器人登陆成功！")
})


client.on('message.group', (e) => {
    if (e.group_id == config.QQGroup && e.sender.user_id != 3467371607) {
        if (e.message[0].text.toString().slice(0,1) == "-") {
            if (PLAYERCMDS.indexOf(e.message[0].text.toString().slice(1)) != -1) {
                //mc.runcmd(e.message[0].text.toString().slice(1))
                e.group.sendMsg("开发中功能！")
            } else if (e.sender.role == "owner" || e.sender.role == "admin") {
                //mc.runcmd(e.message[0].text.toString().slice(1))
                e.group.sendMsg("开发中功能！")
            } else {
                e.group.sendMsg("您不是管理员，无法执行相关指令！")
            }
        } else {
            if (e.sender.card == "") {
              repData.msgboxs.push([e.sender.nickname,e.message[0].text.toString()])
              //msgboxs[e.sender.nickname] = e.message[0].text.toString()
                //mc.broadcast("§6[群聊]§r <" + e.sender.nickname + "> §r" + e.message[0].text.toString())
            } else {
              repData.msgboxs.push([e.sender.card,e.message[0].text.toString()])
              //msgboxs[e.sender.card] = e.message[0].text.toString()
                //mc.broadcast("§6[群聊]§r <" + e.sender.card + "> §r" + e.message[0].text.toString())
            }
        }
    }
})

const group = client.pickGroup(config.QQGroup)

/**
 * 获取系统cpu利用率
 */
async function getCPUUsage() {
	let promise = new Promise((resolve) => {
		os.cpuUsage(function(v){
			resolve(v)
		});
	});
	serverInfo.cpuUsage = await promise
}


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
    if (!ServerStarted) {
      console.log("[ERR] 暂未连接到MC服务器！")
    }
}, 10000)
