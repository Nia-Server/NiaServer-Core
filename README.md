# NiaServer-Core

[![wakatime](https://wakatime.com/badge/user/a2d785d3-a26c-467b-9112-333ba2bee9e8/project/9ae0abd5-b1ad-4199-bd66-0fba1a96ac45.svg?style=for-the-badge)](https://wakatime.com/@NIANIANKNIA)
[![status](https://img.shields.io/github/actions/workflow/status/Nia-Server/NiaServer-Core/main.yml?style=for-the-badge)](https://github.com/Nia-Server/NiaServer-Core/actions)
[![GitHub Release Date](https://img.shields.io/github/release-date-pre/Nia-Server/NiaServer-Core?style=for-the-badge)](https://github.com/Nia-Server/NiaServer-Core/releases)
[![Latest Release](https://img.shields.io/github/v/release/Nia-Server/NiaServer-Core?include_prereleases&style=for-the-badge)](https://github.com/Nia-Server/NiaServer-Core/releases/latest)
[![GitHub last commit](https://img.shields.io/github/last-commit/Nia-Server/NiaServer-Core?style=for-the-badge)](https://github.com/Nia-Server/NiaServer-Core/commits)
[![QQ GROUNP](https://img.shields.io/badge/QQ%20GROUNP-724360499-blue?style=for-the-badge)](https://jq.qq.com/?_wv=1027&k=uk57fVr0)
[![website](https://img.shields.io/badge/website-docs.mcnia.com-blue?style=for-the-badge)](https://docs.mcnia.com)

![NiaServer-Core](https://socialify.git.ci/Nia-Server/NiaServer-Core/image?description=1&descriptionEditable=NIA%E6%9C%8D%E5%8A%A1%E5%99%A8%E6%A0%B8%E5%BF%83%E7%B3%BB%E7%BB%9F&font=Source%20Code%20Pro&forks=1&issues=1&logo=https%3A%2F%2Fdocs.mcnia.com%2Flogo.png&name=1&pattern=Floating%20Cogs&pulls=1&stargazers=1&theme=Auto)


**语言: 简体中文 | [English](README-EN.md)**

> [!IMPORTANT]
> 一般而言如果你想看到最新的开发进度，请前往[dev分支](https://github.com/Nia-Server/NiaServer-Core/tree/dev)查看，但是由于我们的开发进度并不是很稳定，所以我们并不推荐您直接使用dev分支的代码!

## 写在前面

> [!WARNING]
> 当前服务器addons包仍处于开发状态，暂时没有对其他类型服务器做适配，所以我们并不推荐您直接使用！

> [!TIP]
>为了实现更多功能，服务器使用了@minecraft/server-net模块，所以本插件包不能在个人存档中正常运行，只能在BDS上运行！

一个基于BDS的基岩版服务器，这里开源了由服务器开发团队制作的addons（包括基于script-api的脚本）

**以下插件由于部分原因不再进更新维护：** 运行于LiteLoader的插件（部分LiteLoader插件源码可以点击前往 [NIAServerPlugin@jiansyuan](https://github.com/jiansyuan/NIAServerPlugin) 查看）

我们并不是专业的开发人员，所以难免会出现部分bug、代码不规范、逻辑混乱等错误，也欢迎各位大佬pr，我们也一定会仔细查看、学习、回复每一条pr

虽然可能你并不能立马上手使用这个addons（由于每个服务器游戏机制不同，我们服务器的玩法设定可能不满足您的要求），但我们也希望这个addons也可以给您带来某些方面的启发，或者您自行修改来适配自己的服务器

**最后，希望这个项目&&服务器在大家的共同推进下发展的越来越好，如果本项目确实对您有所帮助，不妨点个star吧！**

## 关于资源包内资源使用说明

> [!IMPORTANT]
> 只限于您要使用资源包内的素材时看一下这个条款即可，使用行为包内的源码遵守[开源协议](https://github.com/Nia-Server/NiaServer-Core/blob/main/LICENSE)即可，无需通知我们

如果您要使用资源包内的资源（包括但不限于结构、贴图等资源），**请务必在使用前向`server@mcnia.com`发送邮件**，获得相关贴图的使用授权（包括但不限于个人、组织等**商业或非商业**用途），以避免不必要的麻烦！

## 开发计划

**v1.5.0** 上线NIAHttpBOT的QQ机器人版本，支持QQ机器人的一系列操作

**v1.5.1** 行为包添加QQ机器人联动功能

**v1.6.0** 从NiaServer-Core主项目分离出NIAHttpBOT，NiaServer-ExtraFeatures作为子项目进行更新

更多详细新特性开发计划&&bug修复请前往[NIA服务器开发计划](https://github.com/orgs/Nia-Server/projects/1/views/1?layout=board)查看...

## Addons功能&&特性

- [x] 钟表菜单
- [x] 商店系统
- [x] 转账系统
- [x] 兑换码系统
- [x] 回收系统
- [x] 传送系统
- [x] 支持修改配置文件
- [x] 玩家交易市场
- [x] 圈地系统
- [ ] 支持自定义
- [ ] 多语言支持

## 关于NIAHttpBOT

> [!IMPORTANT]
> 自v1.5.0版本开始，NIAHttpBOT将作为[子项目](https://github.com/Nia-Server/NIAHttpBOT)分离主项目进行更新，主项目将不再包含NIAHttpBOT的相关源码

新版机器人基于c++制作（特别感谢[**@jiansyuan**](https://github.com/jiansyuan)），使用HTTP实现对文件的一系列操作，并基于[LLoneBOT](https://github.com/LLOneBot/LLOneBot)为NIAHttpBOT新增部分QQ机器人功能，具体使用示例，请前往[NIA服务器文档站](https://docs.mcnia.com/dev/Http-Bot.html)查看使用说明！

**NIAHttpBOT**可以在windows/Linux环境下运行，windows环境下请下载**NIAHttpBOT.exe**,双击**NIAHttpBOT.exe**即可运行；Linux环境下请下载**NIAHttpBOT**然后使用`./NIAHttpBOT`命令运行即可！

为了本Addons更好的发展，自**v1.4.0**开始，部分功能将依赖**NIAHttpBOT**，目前为止以下功能依赖于**NIAHttpBOT**：

- 商店系统（`shop_data.json`）
- 玩家交易系统（`market.json`、`market_temp_player_money.json`）
- 圈地系统（`land.json`、`land_temp_player_money.json`）

更多功能正在逐步接入...

## 部分文件夹说明

- `NIAHttpBOT`文件夹 存储了全新的NIAHttpBOT的源码
- `development_behavior_packs`文件夹 存储了服务器所使用的行为包的相关文件
- `development_resource_packs`文件夹 存储了服务器所使用的资源包的相关文件
- `NiaServerPlugin`文件夹 指向了服务器自主开发的dll格式插件开源项目地址[NIAServerPlugin@jiansyuan](https://github.com/jiansyuan/NIAServerPlugin)。
- `plugins`文件夹 存储了服务器所使用的部分脚本插件

> [!TIP]
> 但是我并不推荐您直接下载里面的文件，因为里面的文件很可能仍处于开发状态中！您可以前往release界面下载经过测试的资源包、行为包、插件等

## 使用说明

为了更加稳定的运行，推荐您直接前往[release](https://github.com/Nia-Server/NiaServer-Core/releases)页面下载打包好的资源包、行为包

其中`BP`代表行为包，`RP`代表资源包

您可以根据您自己的需求下载相应的文件

在完成配置之后将行为包以及资源包分别解压至`development_behavior_packs`文件夹、`development_resource_packs`！

> [!IMPORTANT]
> 别忘记根据自己下的addons包修改版本号!

然后在`worlds/[Map name]`目录下添加`world_behavior_packs.json`

```json
[
    {
        "pack_id": "cab0bbe3-eb10-465e-b1de-b09facc076c8",
        "version": [
            1,0,0
        ]
    }
]
```

与`world_resource_packs.json`文件

```json
[
    {
        "pack_id": "981f1ce2-370b-4f58-99d9-9c504a118ec0",
        "version": [
            1,0,0
        ]
    }
]
```

然后将`config/default/permissions.json`内容改为

```json
{
    "allowed_modules": [
        "@minecraft/server-gametest",
        "@minecraft/server",
        "@minecraft/server-ui",
        "@minecraft/server-admin",
        "@minecraft/server-editor",
        "@minecraft/server-net"
    ]
}

```

然后修改完配置文件即可使用！

启动服务器时应当先启动**NIAHttpBOT**，待看到成功启动的字样再启动BDS服务器！

**更加具体的配置教程请前往[NIA服务器文档站](https://docs.mcnia.com/dev)查看！**


## Bug反馈/提建议

如果您在使用过程中遇到了问题、bug，或者拥有好的建议您都可以前往[issues](https://github.com/Nia-Server/NiaServer-Core/issues)反馈，我会在看到后第一时间回复！

## 特别鸣谢

[@Dave](https://abcdavk.github.io/) 服务器的空岛生成受他的行为包所启发！


## 第三方开源引用

#### [rapidjson](https://github.com/Tencent/rapidjson) - [MIT License](https://github.com/Tencent/rapidjson?tab=License-1-ov-file#readme)

#### [cpp-httplib](https://github.com/yhirose/cpp-httplib) - [MIT License](https://github.com/yhirose/cpp-httplib?tab=MIT-1-ov-file#readme)

## 服务器开发者名单 （排名不分先后）

@NIANIANKNIA

@jiansyuan

@lonely

@sliverplus

@mitulang

@AiLaZuiKeAi

@JunFish2722

@DoorCarey

@stsx686868

@Samcrybut

@Songs001

...


## 许可证

您必须接受 Minecraft 的最终用户许可协议(EULA).

- 它意味着**请勿将任何违反 EULA 的内容用于商业用途**
- 接受这个**许可证**意味着您也**接受了**[Minecraft EULA](https://account.mojang.com/terms)
- 如果您违反了 **EULA**，任何法律责任都与开发者**无关**
- **开发者不对您负责，开发者没有义务为你编写代码、为你使用造成的任何后果负责**

另外，您需要遵守本项目的[`AGPL-3.0`](https://github.com/Nia-Server/NiaServer-Core/blob/main/LICENSE)开源许可证条款, 以及本项目所有子项目使用的相关开源协议

## 关于商业化

**由于项目的特殊性，我们并不是很赞成您运用本项目进行商业化，但是并不反对您将本项目进行商业化**

