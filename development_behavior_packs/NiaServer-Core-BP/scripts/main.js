/*

Copyright (C) 2025 Nia-Server

您必须接受 Minecraft 的最终用户许可协议 (EULA)。
这意味着请勿将任何违反 EULA 的内容用于商业目的！
接受此许可意味着您也接受 Minecraft EULA(https://account.mojang.com/terms)
如果您违反了 EULA，开发者不承担任何损害赔偿责任。
开发者不对您负责，开发者没有义务为您编写代码，也不对您的使用造成的任何后果负责。
此外，您必须遵守本项目的 AGPL-3.0 (https://github.com/Nia-Server/NiaServer-Core/blob/main/LICENSE) 开放源码许可条款，以及本项目所有子项目使用的相关开放源码协议。
如果您不接受这些条款，请立即删除本项目。
作者： Nia-Server (http://github.com/Nia-Server)
联系我们: dev@mcnia.com
项目地址：https://github.com/Nia-Server/NiaServer-Core/
如果您在使用本项目时遇到任何问题，请联系作者。

Copyright (C) 2025 Nia-Server

You must accept Minecraft's End User Licence Agreement (EULA).
It means please do not use any content that violates the EULA for commercial purposes!
Accepting this licence means you also accept the Minecraft EULA(https://account.mojang.com/terms)
If you violate the EULA, the developer is not liable for any damages.
The developer is not responsible for you, and the developer is not obliged to write code for you, and is not liable for any consequences of your use.
In addition, you are required to comply with the terms of the AGPL-3.0 (https://github.com/Nia-Server/NiaServer-Core/blob/main/LICENSE) open source licence for this project, and the related open source agreements used by all sub-projects of this project.
If you do not accept these terms, please delete this project immediately.
authors: Nia-Server (http://github.com/Nia-Server)
contact us: dev@mcnia.com
Project address: https://github.com/Nia-Server/NiaServer-Core/
If you have any problems with this project, please contact the authors.

*/

//basic
import './basic/checkupdate.js'
import './basic/main.js'

//game
// import './game/anticheats.js'
import './game/cdk.js'
import './game/chat.js'
import './game/main_menu.js'
import './game/register.js'
import './game/ranking.js'
import './game/back.js'
import './game/bank.js'
// import './game/builder.js'

//qqBot
import './qqBot/main.js'


import { cfg } from './config.js'

export const VERSION = "v1.6.0";
export const BDS_VERSION = "1.21.60.10";
export const LAST_UPGRATE = "2025/03/01";
export const CODE_BRANCH = "main";


console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] NiaServer-Core 已经成功在本服务器上成功启动！\x1b[36m\n
    _   ___       _____                                 ______
   / | / (_)___ _/ ___/___  ______   _____  _____      / ____/___  ________
  /  |/ / / __ \`/\\__ \\/ _ \\/ ___/ | / / _ \\/ ___/_____/ /   / __ \\/ ___/ _ \\
 / /|  / / /_/ /___/ /  __/ /   | |/ /  __/ /  /_____/ /___/ /_/ / /  /  __/
/_/ |_/_/\\__,_//____/\\___/_/    |___/\\___/_/         \\____/\\____/_/   \\___/\x1b[0m

    \x1b[33mversion: \x1b[32m${VERSION}\x1b[33m based on \x1b[32m${BDS_VERSION}\x1b[33m(last update:\x1b[32m${LAST_UPGRATE}\x1b[33m)\x1b[0m\n
    \x1b[33mgithub: \x1b[32mhttps://github.com/Nia-Server/NiaServer-Core/\x1b[0m`);
console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] 作者: @Nia-Server(https://github.com/Nia-Server)\x1b[0m`);
console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] 不知道如何部署？点击链接立即查看部署教程==>(\x1b[36mhttps://docs.mcnia.com/dev/\x1b[33m)\x1b[0m`);
console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] 此项目基于 \x1b[31mAGPL-3.0\x1b[33m 开源协议\x1b[0m`);

if (cfg.USEEventLog) {
    import('./basic/event_log.js').catch(err => {
        // 模块加载失败后的处理
        console.error('\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] 【日志系统】加载失败：\x1b[0m' + err);
    });
}