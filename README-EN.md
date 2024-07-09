# NiaServer-Core

[![wakatime](https://wakatime.com/badge/user/a2d785d3-a26c-467b-9112-333ba2bee9e8/project/9ae0abd5-b1ad-4199-bd66-0fba1a96ac45.svg?style=for-the-badge)](https://wakatime.com/badge/user/a2d785d3-a26c-467b-9112-333ba2bee9e8/project/9ae0abd5-b1ad-4199-bd66-0fba1a96ac45)
[![status](https://img.shields.io/github/actions/workflow/status/Nia-Server/NiaServer-Core/main.yml?style=for-the-badge)](https://github.com/Nia-Server/NiaServer-Core/actions)
[![GitHub Release Date](https://img.shields.io/github/release-date/Nia-Server/NiaServer-Core?style=for-the-badge)](https://github.com/Nia-Server/NiaServer-Core/releases)
[![Latest Release](https://img.shields.io/github/v/release/Nia-Server/NiaServer-Core?style=for-the-badge)](https://github.com/Nia-Server/NiaServer-Core/releases/latest)
[![GitHub last commit](https://img.shields.io/github/last-commit/Nia-Server/NiaServer-Core?style=for-the-badge)](https://github.com/Nia-Server/NiaServer-Core/commits)
[![QQ GROUNP](https://img.shields.io/badge/QQ%20GROUNP-724360499-blue?style=for-the-badge)](https://jq.qq.com/?_wv=1027&k=uk57fVr0)
[![website](https://img.shields.io/badge/website-docs.mcnia.top-blue?style=for-the-badge)](https://docs.mcnia.top)

![NiaServer-Core](https://socialify.git.ci/Nia-Server/NiaServer-Core/image?description=1&descriptionEditable=A%20BDS-based%20Minecraft%20server!&font=KoHo&forks=1&issues=1&logo=https%3A%2F%2Fdocs.mcnia.com%2Flogo.png&name=1&pattern=Circuit%20Board&pulls=1&stargazers=1&theme=Light)

**language: [简体中文](README.md) | English**

> **Due to changes in the NIA server development plan since 2023/8/1, the v1.4.0 version adapted to 1.20.10 has been postponed. The final v1.4.0 version will have extensive changes (including but not limited to gameplay , mechanism, etc.)**

## Introduction

**Since the NIA server currently only provides game servers in China, the addons language are all Chinese at the moment. But you don't have to worry too much, a version with multi-language support is already in the making, so stay tuned!**


The bedrock version server based on BDS, open source of the addons R&D by NIA Group (including some codes using script-api) & almost our plugins running on LiteLoader.

We arenot professional extremely, some problems may be here like bug, none standard & logical confusion. We are glad to welcome everyone PR., and we will also carefully review, study & reply to each PR.

Though you may not use this addons right away on your local system without revising (due to the different game mechanics of each server) , but we hope that the addons & plugins may inspirate you, or be revised by yourself to adapt own server.

**Hope the project & server in the common development of the better & better. If the project does help you, CLICK A STAR PLZ!**

## About the use of resources in the resource package

> Just read this clause when you want to use the materials in the resource package. Use the source code in the behavior package to comply with the [Open Source Agreement](https://github.com/Nia-Server/NiaServer-Core/blob/main/LICENSE ) without notifying us

If you want to use the resources in the resource package (including but not limited to structures, textures and other resources), **please be sure to send an email to `server@mcnia.com` before use** to obtain the authorization to use the relevant textures (including but not limited to Not limited to **commercial or non-commercial** use by individuals, organizations, etc.) to avoid unnecessary trouble!


## Folder Description

- `development_behavior_packs` Folder:  Stores the behavior packs used by the server.
- `development_resource_packs` Folder: Stores the resource packs used by the server.
- `NiaServerPlugin` Folder: Points to the open source project address og the dll format plugin:[NIAServerPlugin@jiansyuan](https://github.com/jiansyuan/NIAServerPlugin) independently developed by the server.
- `plugins` Folder: Stores all plugins the server using.

**But I don't recommend downloading the files directly, because they are probably still in development! You can go to the release to download tested resource packs, behavior packs, plugins, etc.**

## About NIAHttpBOT

The new version of the robot is based on C++ (special thanks to [**@jiansyuan**](https://github.com/jiansyuan)), and uses HTTP to implement a series of operations on files. For specific usage examples, please go to [NIA Server Documentation Station ](https://docs.mcnia.com/en-US/develop/Http-Bot.html)View the instructions for use!

For the better development of this Addons, starting from **v1.4.0**, some functions will depend on **NIAHttpBOT**. So far, the following functions depend on **NIAHttpBOT**:

- Shop system (`shop_data.json`)
- Player trading system (`trade_data.json`)
- Enclosure system (`land_data.json`)

More functions are being gradually added...

## Instruction

For more stable operation, we recommend you to go directly to the [release](https://github.com/Nia-Server/NiaServer-Core/releases/latest) page to download the packaged resource package and behavior package

Where `BP` stands for Behavior Package and `RP` stands for Resource Package

You can download the zip file according to your own needs

After completing the configuration, extract the behavior packs and resource packs to the `development_behavior_packs` and `development_resource_packs` folders respectively and you're ready to go!

## Bug feedback&&suggestions!

If you encounter problems, bugs, or have good suggestions in the use of the process can go to [issues](https://github.com/Nia-Server/NiaServer-Core/issues) feedback, I will see the first time to reply!

## Special thanks

[@Dave](https://abcdavk.github.io/) The server's sky island generation inspired by his behavioural package!

## Third party open source references

#### [rapidjson](https://github.com/Tencent/rapidjson) - [MIT License](https://github.com/Tencent/rapidjson?tab=License-1-ov-file#readme)

#### [cpp-httplib](https://github.com/yhirose/cpp-httplib) - [MIT License](https://github.com/yhirose/cpp-httplib?tab=MIT-1-ov-file#readme)

## Server Developer List

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

## License

You must accept the End User License Agreement (EULA) for Minecraft.

- It means **please do not use any content that violates the EULA for commercial purposes**
- Accepting this **license** means that you also **accept** the **[Minecraft EULA](https://account.mojang.com/terms)**
- If you violate the **EULA**, any legal liability **is not the developer's responsibility**
- **Developers are not responsible for you, and developers are not obligated to write code for you or be responsible for any consequences of your use**

In addition, you are required to abide by the terms of the [`AGPL-3.0`](https://github.com/Nia-Server/NiaServer-Core/blob/main/LICENSE) open source license for this project, and the relevant open source agreements used by all subprojects of this project
