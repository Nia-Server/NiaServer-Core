/*

Copyright (C) 2024 Nia-Server

You must accept Minecraft's End User Licence Agreement (EULA).

It means please do not use any content that violates the EULA for commercial purposes!

Accepting this licence means you also accept the Minecraft EULA(https://account.mojang.com/terms)

If you violate the EULA, the developer is not liable for any damages.

The developer is not responsible for you, and the developer is not obliged to write code for you, and is not liable for any consequences of your use.

In addition, you are required to comply with the terms of the AGPL-3.0 (https://github.com/Nia-Server/NiaServer-Core/blob/main/LICENSE) open source licence for this project, and the related open source agreements used by all sub-projects of this project.

If you do not accept these terms, please delete this project immediately.

authors: NIANIANKNIA && jiansyuan

contact us: dev@mcnia.com

Project address: https://github.com/Nia-Server/NiaServer-Core/

If you have any problems with this project, please contact the authors.

*/

import './chat.js'
import './menu/main.js'
import './checkupdate.js'
import './market.js'
import './land.js'
import './basic.js'
import './newFunction.js'
import './log.js'
import './qqBot.js'
//import './AntiCheats.js'

export const VERSION = "v1.5.0-pre-3";
export const BDS_VERSION = "1.21.1.03";
export const LAST_UPGRATE = "2024/07/09";
export const CODE_BRANCH = "dev";


console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] NiaServer-Core has been successfully started on this server!\x1b[36m\n
    _   ___       _____                                 ______
   / | / (_)___ _/ ___/___  ______   _____  _____      / ____/___  ________
  /  |/ / / __ \`/\\__ \\/ _ \\/ ___/ | / / _ \\/ ___/_____/ /   / __ \\/ ___/ _ \\
 / /|  / / /_/ /___/ /  __/ /   | |/ /  __/ /  /_____/ /___/ /_/ / /  /  __/
/_/ |_/_/\\__,_//____/\\___/_/    |___/\\___/_/         \\____/\\____/_/   \\___/\x1b[0m

    \x1b[33mversion: \x1b[32m${VERSION}\x1b[33m based on \x1b[32m${BDS_VERSION}\x1b[33m(last update:\x1b[32m${LAST_UPGRATE}\x1b[33m)\x1b[0m\n
    \x1b[33mgithub: \x1b[32mhttps://github.com/Nia-Server/NiaServer-Core/\n`);
console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] authors: @NIANIANKNIA(https://github.com/NIANIANKNIA) @jiansyuan(https://github.com/jiansyuan)\x1b[0m`);
console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] Don't know how to deploy? Head over to the documentation site for detailed deployment procedures==>(\x1b[36mhttps://docs.mcnia.com/dev/\x1b[33m)\x1b[0m`);
console.log(`\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] This project is based on the \x1b[31mAGPL-3.0\x1b[33m license !\x1b[0m`);
