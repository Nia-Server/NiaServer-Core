# v1.3.0 更新日志

[![BDS VERSION](https://img.shields.io/badge/BDS-1.20.10.02-green?style=for-the-badge&logo=appveyor)](https://www.minecraft.net/en-us/download/server/bedrock)
[![LiteLoader VERSION](https://img.shields.io/badge/LiteLoader-2.14.1-green?style=for-the-badge&logo=appveyor)](https://github.com/LiteLDev/LiteLoaderBDS/releases/)

**版本说明：本次script-api出现部分变动，与老版本不相兼容，请及时更新本版本！**

## 适配

BDS && Minecraft BedRock-1.20.10.02

Liteloader 2.14.1

## 新增

1.全新的NIAHttpBOT！基于c++编写，相比旧方案内存占用更小，性能更好！（特别感谢[**@jiansyuan**](https://github.com/jiansyuan)在编写中给予的帮助！）

2.玩家交易市场部分功能（制作中，预计将在v1.4.0发布正式版）

已完成模块：

- 玩家上线市场逻辑（服务器本地）
- 玩家上线物品依赖服务器存储数据
- 玩家可以初步查看市场商品

## 优化

1.由于qq机器人暂时不稳定，在找到稳定的解决方案前暂时停止qq机器人的使用

2.自本版本之后，**停止对NIA-Server-BOT的更新与维护**，转而使用全新的**NIAHttpBOT**实现对原有功能的替代。

3.飞行系统授权码算法优化 [**@jiansyuan**](https://github.com/jiansyuan)

4.优化商城id生成逻辑

## 修复

1.商店系统&&回收系统无法正常购买&&回收的bug

2.传送系统无法正常同意的bug

3.转账系统无法正常使用的bug

4.飞行系统无法正常验证的bug

5.玩家上架物品时不填写详细项目仍可以正常上架的bug

6.玩家上架物品不为物品最大数量时显示仍为最大数量的bug

7.在部分情况下无法正常上架商品的bug

8.每晚12点更新时传送指令的错误

9.(llse)扫地机插件无法正常恢复被扫物品的bug

**配置说明：您可以前往[NIA服务器官方文档站](https://docs.mcnia.top/zh-CN/deploy.html)查看具体部署过程！**

