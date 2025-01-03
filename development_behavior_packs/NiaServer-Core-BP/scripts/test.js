// import { world } from '@minecraft/server';
// import { ExternalFS } from './API/filesystem';
// import { GetTime } from './customFunction';

// const fs = new ExternalFS();

// world.afterEvents.chatSend.subscribe((t) => {
//     if (t.message == "test") {
//         fs.GetJSONFileData("test.json").then((result) => {
//             if (result === 0) {
//                 fs.CreateNewJsonFile("test.json",{"test":"123"});
//                 t.sender.sendMessage("文件不存在，已自动创建!");
//             } else if (result === -1) {
//                 t.sender.sendMessage("服务器连接失败");
//             } else {
//                 t.sender.sendMessage(JSON.stringify(result));
//             }
//         })
//     }

//     if (t.message == "关机") {
//         fs.RunCmd("shutdown -s").then((result) => {
//             if (result === -1) {
//                 t.sender.sendMessage("服务器连接失败")
//             }
//         })
//     }
// })

// world.afterEvents.itemUse.subscribe((event) => {
//     let log_info ="[" + GetTime() +  "] " + event.source.nameTag + " 使用 " + event.itemStack.typeId +  "\n";
//     console.log(log_info);
//     fs.WriteLineToFile("log.txt",log_info).then((result) => {
//         if (result === 0) {
//             fs.CreateNewFile("log.txt",log_info);
//             event.source.sendMessage("文件不存在，已自动创建!");
//         } else if (result === -1) {
//             event.source.sendMessage("服务器连接失败");
//         } else {
//             event.source.sendMessage(log_info);
//         }
//     })
// })