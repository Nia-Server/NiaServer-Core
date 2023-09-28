import { system, world } from "@minecraft/server";
import { ExternalFS } from "./API/filesystem";
import { log,GetTime } from "./customFunction";

const fs = new ExternalFS();

// let a = [];
// let b = 1;

// let start = Date.now();

// system.runInterval(() => {
//     start = Date.now();
//     fs.GetJSONFileData("test.json").then(() => {
//         a.push(Date.now() - start);
//         log(`本次读取用时: ${Date.now() - start} ms,这是第${b}次读取,平均用时: ${avg(a).toFixed(2)} ms`);
//         b++;
//         fs.WriteLineToFile("log.txt",`[${GetTime()}] 本次1MB Json 文件读取用时: ${Date.now() - start} ms,这是第 ${b} 次读取,平均用时: ${avg(a).toFixed(2)} ms\n`)
//     })
// },10)


// function avg(array) {//封装求平均值函数
//     var len = array.length;
//     var sum = 0;
//     for(var i = 0;i<len;i++){
//         sum +=array[i];
//     }
//     return sum/len;
// }

