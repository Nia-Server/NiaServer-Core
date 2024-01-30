////////////////////////////////////////////////////////////////////////////
//您必须接受 Minecraft 的最终用户许可协议(EULA).
//它意味着请勿将任何违反 EULA 的内容用于商业用途
//接受这个许可证意味着您也接受了[Minecraft EULA](https://account.mojang.com/terms)
//如果您违反了 EULA，任何法律责任都与开发者无关
//开发者不对您负责，开发者没有义务为你编写代码、为你使用造成的任何后果负责
//另外，您需要遵守本项目的AGPL-3.0(https://github.com/NIANIANKNIA/NIASERVER-V4/blob/main/LICENSE)开源许可证条款, 以及本项目所有子项目使用的相关开源协议
//如果您不接受这些条款，请立即删除本项目
////////////////////////////////////////////////////////////////////////////
//You must accept Minecraft's End User Licence Agreement (EULA).
//It means please do not use any content that violates the EULA for commercial purposes!
//Accepting this licence means you also accept the [Minecraft EULA](https://account.mojang.com/terms)
//If you violate the EULA, the developer is not liable for any damages.
//The developer is not responsible for you, and the developer is not obliged to write code for you, and is not liable for any consequences of your use.
//In addition, you are required to comply with the terms of the AGPL-3.0 (https://github.com/NIANIANKNIA/NIASERVER-V4/blob/main/LICENSE) open source licence for this project, and the related open source agreements used by all sub-projects of this project.
//If you do not accept these terms, please delete this project immediately.
////////////////////////////////////////////////////////////////////////////
//作者： NIANIANKNIA
//email: nianianknia@163.com
//项目地址：https://github.com/NIANIANKNIA/NIASERVER-V4/
//如果您在使用本项目时遇到任何问题，请联系作者
////////////////////////////////////////////////////////////////////////////
//author: NIANIANKNIA
//email: nianianknia@163.com
//Project address: https://github.com/NIANIANKNIA/NIASERVER-V4/
///If you have any problems with this project, please contact the authors
////////////////////////////////////////////////////////////////////////////

import './chat.js'
import './menu/main.js'
import './checkupdate.js'
import './market.js'
import './land.js'
import './basic.js'
import './newFunction.js'
import './log.js'

export const VERSION = "v1.5.0-pre-1";
export const BDS_VERSION = "1.20.51.01";
export const LAST_UPGRATE = "2024/01/29";
export const CODE_BRANCH = "dev";


console.log(`\x1b[33m[\x1b[36mNIA V4.5\x1b[33m] NIA V4.5 has been successfully started on this server!\x1b[0m\n
    _   __ ____ ___         _    __ __ __      ______
   / | / //  _//   |       | |  / // // /     / ____/
  /  |/ / / / / /| | ______| | / // // /_    /___ \\
 / /|  /_/ / / ___ |/_____/| |/ //__  __/_  ____/ /
/_/ |_//___//_/  |_|       |___/   /_/  (_)/_____/
`);
console.log(`\x1b[33m[\x1b[36mNIA V4.5\x1b[33m] version: \x1b[32m${VERSION}\x1b[33m based on \x1b[32m${BDS_VERSION}\x1b[33m(last update:\x1b[32m${LAST_UPGRATE}\x1b[33m)\x1b[0m`);
console.log(`\x1b[33m[\x1b[36mNIA V4.5\x1b[33m] author: @NIANIANKNIA(https://github.com/NIANIANKNIA) @jiansyuan(https://github.com/jiansyuan)\x1b[0m`);
console.log(`\x1b[33m[\x1b[36mNIA V4.5\x1b[33m] Don't know how to deploy? Head over to the documentation site for detailed deployment procedures==>(\x1b[36mhttps://docs.mcnia.com/dev/\x1b[33m)\x1b[0m`);
console.log(`\x1b[33m[\x1b[36mNIA V4.5\x1b[33m] \x1b[31mThis project is based on the AGPL-3.0 open source protocol , note that to comply with the open source agreement !\x1b[0m`);
