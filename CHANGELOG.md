# v1.5.0 更新日志

[![BDS VERSION](https://img.shields.io/badge/BDS-1.21.51.02-green?style=for-the-badge&logo=appveyor)](https://www.minecraft.net/en-us/download/server/bedrock)
[![NIAHttpBOT VERSION](https://img.shields.io/badge/NIAHttpBOT-1.0.0-BLUE?style=for-the-badge&logo=appveyor)](https://github.com/Nia-Server/NIAHttpBOT/releases/tag/v1.0.0)

> [!TIP]
> 本项目依赖于子项目 [NIAHttpBOT](https://github.com/Nia-Server/NIAHttpBOT/)，请确保正确部署 NIAHttpBOT 后再使用。

> [!IMPORTANT]
> 自 v1.5.0 版本开始，NIAHttpBOT 将作为子项目单独维护 [https://github.com/Nia-Server/NIAHttpBOT](https://github.com/Nia-Server/NIAHttpBOT/)。

## 适配

- BDS & Minecraft BedRock 1.21.51.02

## 优化

1. 圈地系统性能表现。
2. 现在在转移圈地时，会重新计算圈地的索引值。
3. 更改系统信息前缀。
4. 优化圈地系统 LandUUID 生成逻辑及领地转移逻辑。
5. 重构 OpenGUI 函数，可以使用 `/scriptevent mcnia:nc_opengui` 打开 GUI。
6. 优化代码文件结构。

## 新增

1. 屏蔽词系统，支持自定义屏蔽词，自动禁言发送屏蔽词的玩家。
2. 新增圈地系统配置文件，可以自定义圈地系统的一些参数。
3. 圈地系统管理面板上线，使管理员可以更方便地管理玩家圈地。
4. 圈地系统新增防爆系统，可以防止领地被爆炸破坏。
5. 圈地系统新增虚拟围墙系统，可以在领地周围生成虚拟围墙，防止玩家进入领地。
6. 圈地系统新增传送点增加功能。
7. 玩家行为日志系统（依赖于 NIAHttpBOT v1.0.0 实现）。
8. QQ群信息互通（依赖于 NIAHttpBOT v1.0.0 实现）。
9. 玩家称号系统，可以自由购买/设置称号。
10. 任务系统，自定义任务，完成任务可以获得奖励。
11. 传送点设置功能，玩家可以自由设置传送点。

## 修复

1. 修复圈地系统上架圈地时，输入价格为 0 时出现的 bug。
2. 修复在圈地数量过多时不会再出现 hang 报错（需要正确配置配置文件）。
3. 修复玩家无法正常回收领地的 bug。
4. 修复圈地系统管理在使用快捷传送时，部分情况下无法传送到指定领地的 bug。
5. 修复玩家交易市场无法正常回收预览物品的 bug。
6. 修复玩家交易市场上架附魔物品失效的 bug。
7. 修复商店系统部分 bug。

**配置说明：您可以前往 [NIA 服务器官方文档站](https://docs.mcnia.com/deploy.html) 查看具体部署过程！**
