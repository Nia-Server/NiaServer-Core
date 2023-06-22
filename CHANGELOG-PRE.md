# v1.3.0-pre-1 更新日志

[![BDS VERSION](https://img.shields.io/badge/BDS-1.20.10.02-green?style=for-the-badge&logo=appveyor)](https://www.minecraft.net/en-us/download/server/bedrock)
[![LiteLoader VERSION](https://img.shields.io/badge/LiteLoader-2.14.1-green?style=for-the-badge&logo=appveyor)](https://github.com/LiteLDev/LiteLoaderBDS/releases/)

**版本说明：本次script-api出现部分变动，与老版本不相兼容，请及时更新本版本！**

> 预发布版本提醒：这是一个预览版本，可能存在一些bug，仅供测试，请勿在正式生产环境使用本版本！

## 适配

BDS && Minecraft BedRock-1.20.10.02

Liteloader 2.14.1


## 新增

1.玩家交易市场（制作中，由于部分api需求，预计将与**BDS1.20.10.02**一同发布）

已完成模块：

- 玩家上线市场逻辑（服务器本地）
- 玩家上架物品qq机器人群聊提醒
- 玩家上线物品依赖服务器存储数据

2.qq机器人新增自动检查是否存在配置文件，并按需生成。
## 优化

qq机器人升级至oicp0.4.1

## 修复

部分情况下qq群机器人登录失败的情况（再出现该情况请尝试将机器人config.json文件中的platform选项数字改为6）

**配置说明：您可以前往[NIA服务器官方文档站](https://docs.mcnia.top/zh-CN/deploy.html)查看具体部署过程！**

