# NIA服务器v4.0--基岩版空岛服务器

[![wakatime](https://wakatime.com/badge/user/a2d785d3-a26c-467b-9112-333ba2bee9e8/project/9ae0abd5-b1ad-4199-bd66-0fba1a96ac45.svg?style=for-the-badge)](https://wakatime.com/badge/user/a2d785d3-a26c-467b-9112-333ba2bee9e8/project/9ae0abd5-b1ad-4199-bd66-0fba1a96ac45)
[![status](https://img.shields.io/github/actions/workflow/status/NIANIANKNIA/NIASERVER-V4/main.yml?style=for-the-badge)](https://github.com/NIANIANKNIA/NIASERVER-V4/actions)
[![GitHub Release Date](https://img.shields.io/github/release-date/NIANIANKNIA/NIASERVER-V4?style=for-the-badge)](https://github.com/NIANIANKNIA/NIASERVER-V4/releases)
[![Latest Release](https://img.shields.io/github/v/release/NIANIANKNIA/NIASERVER-V4?style=for-the-badge)](https://github.com/NIANIANKNIA/NIASERVER-V4/releases/latest)
[![GitHub last commit](https://img.shields.io/github/last-commit/NIANIANKNIA/NIASERVER-V4?style=for-the-badge)](https://github.com/NIANIANKNIA/NIASERVER-V4/commits)
[![QQ GROUNP](https://img.shields.io/badge/QQ%20GROUNP-724360499-blue?style=for-the-badge)](https://jq.qq.com/?_wv=1027&k=uk57fVr0)
[![website](https://img.shields.io/badge/website-docs.mcnia.top-blue?style=for-the-badge)](https://docs.mcnia.top)

![NIASERVER-V4](https://socialify.git.ci/NIANIANKNIA/NIASERVER-V4/image?description=1&descriptionEditable=%E4%B8%80%E4%B8%AA%E5%9F%BA%E4%BA%8EBDS%E7%9A%84Minecraft%E6%9C%8D%E5%8A%A1%E5%99%A8%EF%BC%81&font=KoHo&forks=1&issues=1&logo=https%3A%2F%2Fdocs.mcnia.top%2Flogo.png&name=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Auto)

**语言: 简体中文 | [English](README-EN.md)**

## 写在前面

一个基于BDS的基岩版服务器，这里开源了由服务器开发团队制作的addons（包括基于script-api的脚本）、大部分运行于LiteLoader的插件（部分LiteLoader插件源码可以点击前往 [NIAServerPlugin@jiansyuan](https://github.com/jiansyuan/NIAServerPlugin) 查看）

我们并不是专业的开发人员，所以难免会出现部分bug、代码不规范、逻辑混乱等错误，也欢迎各位大佬pr，我们也一定会仔细查看、学习、回复每一条pr

虽然可能你并不能立马上手使用这个addons（由于每个服务器游戏机制不同，我们服务器的玩法设定可能不满足您的要求），但我们也希望这个addons也可以给您带来某些方面的启发，或者您自行修改来适配自己的服务器

**最后，希望这个项目&&服务器在大家的共同推进下发展的越来越好，如果本项目确实对您有所帮助，不妨点个star吧！**


## 部分文件夹说明

- development_behavior_packs文件夹 存储了服务器所使用的行为包的相关文件
- development_resource_packs文件夹 存储了服务器所使用的资源包的相关文件
- CppDll文件夹 指向了服务器自主开发的dll格式插件开源项目地址[NIAServerPlugin@jiansyuan](https://github.com/jiansyuan/NIAServerPlugin)。
- plugins文件夹 存储了服务器所使用的插件(将于近期上线)

**但是我并不推荐您直接下载里面的文件，因为里面的文件很可能仍处于开发状态中！您可以前往release界面下载经过测试的资源包、行为包、插件等**

## 使用说明

为了更加稳定的运行，推荐您直接前往[release](https://github.com/NIANIANKNIA/NIASERVER-V4/releases/latest)页面下载打包好的资源包、行为包

其中`BP`代表行为包，`RP`代表资源包

您可以根据您自己的需求下载相应的zip文件

在完成配置之后将行为包以及资源包分别解压至`development_behavior_packs`文件夹、`development_resource_packs`文件夹即可使用！

**具体的配置教程将在近期上线**

## Bug反馈/提建议

如果您在使用过程中遇到了问题、bug，或者拥有好的建议您都可以前往[issues](https://github.com/NIANIANKNIA/NIASERVER-V4/issues)反馈，我会在看到后第一时间回复！

## 服务器开发者名单 （排名不分先后）

@NIANIANKNIA

@jiansyuan

@sliverplus

@mitulang

@AiLaZuiKeAi

@JunFish2722

@DoorCarey

@lonely

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

另外，您需要遵守本项目的[`AGPL-3.0`](https://github.com/NIANIANKNIA/NIASERVER-V4/blob/main/LICENSE)开源许可证条款, 以及本项目所有子项目使用的相关开源协议

