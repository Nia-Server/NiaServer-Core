# v1.4.0 更新日志

[![BDS VERSION](https://img.shields.io/badge/BDS-1.20.31.01-green?style=for-the-badge&logo=appveyor)](https://www.minecraft.net/en-us/download/server/bedrock)
[![LiteLoader VERSION](https://img.shields.io/badge/LiteLoader-2.16.1-green?style=for-the-badge&logo=appveyor)](https://github.com/LiteLDev/LiteLoaderBDS/releases/)

**版本说明：v4.5 更新第一阶段，共三阶段**

> 受开发计划影响，本版本完善了基本的游戏系统，并没有上线全部的游戏内容，具体请前往[开发计划](README.md#开发计划)查看

## 适配

BDS && Minecraft BedRock-1.20.31.01

Liteloader 2.16.1

## 新增

1.NIAHttpBOT新增部分API(具体使用方法请前往**NIA服务器官方文档站**查看) @jiansyuan

- `/GetFileData`
- `/CopyFolder`
- `/CopyFolderOverwrite`
- `/CopyFile`
- `/CopyFileOverwrite`

2.NIAHttpBOT解耦合 @jiansyuan

3.NIAHttpBOT多语言支持的语言文件 @jiansyuan

4.玩家交易市场 @NIANIANKNIA

5.玩家圈地系统 @NIANIANKNIA

6.初步上线七种武器&&武器强化系统&&暴击/暴伤机制 @NIANIANKNIA

7.初步上线空岛生成逻辑 @NIANIANKNIA

## 调整

1.去除部分仅适用于v4玩法的操作逻辑

2.去除标题栏（actionbar）常驻显示功能，并简化相关设置

3.主菜单玩家飞行系统按钮更改为玩家交易系统按钮


## 优化

1.NIAHttpBOT优化部分http请求的body接受规则

2.在商店系统回收物品时无法回收处于上锁在状态的物品

3.文件读取时间计算方式

## 修复

NIAHttpBOT输出信息错位的bug

**配置说明：您可以前往[NIA服务器官方文档站](https://docs.mcnia.com/zh-CN/deploy.html)查看具体部署过程！**

