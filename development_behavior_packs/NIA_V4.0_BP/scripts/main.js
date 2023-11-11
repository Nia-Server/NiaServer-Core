////////////////////////////////////////////////////////////////////////////
//您必须接受 Minecraft 的最终用户许可协议(EULA).
//它意味着请勿将任何违反 EULA 的内容用于商业用途
//接受这个许可证意味着您也接受了[Minecraft EULA](https://account.mojang.com/terms)
//如果您违反了 EULA，任何法律责任都与开发者无关
//开发者不对您负责，开发者没有义务为你编写代码、为你使用造成的任何后果负责
//另外，您需要遵守本项目的AGPL-3.0(https://github.com/NIANIANKNIA/NIASERVER-V4/blob/main/LICENSE)开源许可证条款, 以及本项目所有子项目使用的相关开源协议
//如果您不接受这些条款，请立即删除本项目
////////////////////////////////////////////////////////////////////////////
//作者： NIANIANKNIA
//email: nianianknia@163.com
//项目地址：https://github.com/NIANIANKNIA/NIASERVER-V4/
//如果您在使用本项目时遇到任何问题，请联系作者
////////////////////////////////////////////////////////////////////////////

import './chat.js'
import './menu/main.js'
import './net.js'
import './market.js'
import './land.js'
import './basic.js'
import './newFunction.js'
import './log.js'

export const VERSION = "v1.4.1";
export const BDS_VERSION = "1.20.31.01";
export const LAST_UPGRATE = "2023/11/12";
export const CODE_BRANCH = "dev";


console.log(`\x1b[33m[NIA V4] NIA V4 已经成功在本服务器上启动！\x1b[0m`);
console.log(`\x1b[33m[NIA V4] 版本: ${VERSION} based on ${BDS_VERSION}(last upgrate:${LAST_UPGRATE})\x1b[0m`);
console.log(`\x1b[33m[NIA V4] 作者: @NIANIANKNIA(https://github.com/NIANIANKNIA) @jiansyuan(https://github.com/jiansyuan)\x1b[0m`);
console.log(`\x1b[33m[NIA V4] 不会部署？前往文档站查看详细的部署过程==>(https://docs.mcnia.com/zh-CN/deploy.html)\x1b[0m`);
console.log(`\x1b[33m[NIA V4] 本项目基于AGPL-3.0开源协议，注意遵守开源协议！\x1b[0m`);