#NIA战争服function指令包——展示（show.mcfunction）
#检测是否注册
tag @r add show
tag @a[tag=show,tag=!shown] add showing
tag @a remove show
tellraw @a[tag=showing,scores={time=10..}] {"rawtext":[{"text":"§c§l>> 就在刚刚，发生了一次错误，如果您看到本行字请截图发给服主！"}]}
scoreboard players set @a[tag=showing,scores={time=10..}] show_time 0
tag @a[tag=showing,scores={time=10..}] add shown
tag @a[tag=showing,scores={time=10..}] remove showing
tp @a[tag=showing]702 90 554 facing 718 98 554
gamemode a @a[tag=showing,m=!a]

scoreboard players add @a[tag=showing] oxygen 0
scoreboard players add @a[tag=showing] equLevel 0
scoreboard players add @a[tag=showing] actionbar 0
scoreboard players add @a[tag=showing] time 0
scoreboard players add @a[tag=showing] money 0
scoreboard players add @a[tag=showing] AnoxicTime 0
scoreboard players add @a[tag=showing] posX 0
scoreboard players add @a[tag=showing] posY 0
scoreboard players add @a[tag=showing] posZ 0

scoreboard players add @e[tag=showing,type=player] show_time 1
tag @a[scores={show_time=1651..}] add shown
tag @a[scores={show_time=1650..}] remove showing
scoreboard players set @a[scores={show_time=1651..}] show_time 0
playsound record.otherside @a[scores={show_time=60}] 702 90 554
clear @a[tag=showing,scores={show_time=100}]
effect @a[scores={show_time=1}] blindness 82 1 true
scoreboard players set @a[scores={show_time=1}] oxygen 6000
title @a[scores={show_time=1}] title §eWelcome
title @a[scores={show_time=20}] title §bWelcome to
title @a[scores={show_time=40}] title §CWelcome to NIA Server
title @a[scores={show_time=60}] subtitle §aNIA服务器
title @a[scores={show_time=70}] subtitle §bNIA服务器——
title @a[scores={show_time=80}] subtitle §cNIA服务器——4
title @a[scores={show_time=90}] subtitle §dNIA服务器——4.
title @a[scores={show_time=100}] subtitle §eNIA服务器——4.0
title @a[scores={show_time=120}] title §e特别鸣谢
title @a[scores={show_time=120}] subtitle 排名不分先后
title @a[scores={show_time=150}] title §esliverplus
title @a[scores={show_time=150}] subtitle §7建筑/地形 制作
title @a[scores={show_time=180}] title §eNIANIANKNIA
title @a[scores={show_time=180}] subtitle §7addons/插件 制作
title @a[scores={show_time=210}] title §eJiansyuan
title @a[scores={show_time=210}] subtitle §7插件 制作
title @a[scores={show_time=240}] title §emitulang
title @a[scores={show_time=240}] subtitle §7建筑 制作
title @a[scores={show_time=270}] title §e孤独lonely
title @a[scores={show_time=270}] subtitle §7建筑/addons 制作
title @a[scores={show_time=300}] title §e正在加载
title @a[scores={show_time=300}] subtitle §7请稍候.
title @a[scores={show_time=320}] subtitle §7请稍候..
title @a[scores={show_time=340}] subtitle §7请稍候...
tellraw @a[scores={show_time=360}] {"rawtext":[{"text":"§e特别鸣谢以下玩家在NIA V4建设中做出巨大贡献："}]}
tellraw @a[scores={show_time=380}] {"rawtext":[{"text":"§e§l@JunFish2722 @DoorCarey @stsx686868 @LikedxiaoU233 @Samcrybut @Songs001 @wangerxiao250"}]}
tellraw @a[scores={show_time=400}] {"rawtext":[{"text":"§c如果在测试中发现bug，麻烦您请向腐竹反馈，对您的反馈我们将尽量在第一时间修复。"}]}
tellraw @a[scores={show_time=420}] {"rawtext":[{"text":"§e最后祝您游玩愉快！"}]}
tellraw @a[scores={show_time=440}] {"rawtext":[{"text":"§c "}]}
tellraw @a[scores={show_time=460}] {"rawtext":[{"text":"§c§l本服务器为测试服，并不代表最终质量，具体请以正式服为准！！！"}]}
title @a[scores={show_time=480}] title §e§lNIA SERVER V4
title @a[scores={show_time=500}] subtitle §c空岛生存服
title @a[scores={show_time=520}] subtitle §6空岛生存服
title @a[scores={show_time=540}] subtitle §6原创·公益·非凡
title @a[scores={show_time=560}] subtitle §c原创·公益·非凡
title @a[scores={show_time=580}] title §e§lNIA SERVER V4
title @a[scores={show_time=580}] subtitle §6感谢您的选择！
title @a[scores={show_time=610}] title §6§l下面介绍游戏详细玩法
title @a[scores={show_time=610}] subtitle §b§l请务必仔细观看哦！
title @a[scores={show_time=640}] title §6§l服务器是空岛生存服
title @a[scores={show_time=640}] subtitle §b§l我们需要利用生存技巧在空岛上活下去！
title @a[scores={show_time=670}] title §6§l一个重要机制
title @a[scores={show_time=670}] subtitle §b§l氧气值机制！
title @a[scores={show_time=710}] title §6§l在游玩过程中
title @a[scores={show_time=710}] subtitle §b§l我们的氧气值会不断减少
title @a[scores={show_time=750}] title §6§l我们需要获取能源币
title @a[scores={show_time=750}] subtitle §b§l来购买氧气值、升级装备！
title @a[scores={show_time=790}] title §6§l一旦没有了氧气
title @a[scores={show_time=790}] subtitle §b§l甚至会发生一些...不好的事情！
title @a[scores={show_time=790}] title §6§l所以我们需要
title @a[scores={show_time=790}] subtitle §b§l一直关注我们的氧气值哦！
title @a[scores={show_time=830}] title §6§l现在我们看向屏幕中央
title @a[scores={show_time=830}] subtitle §b§l这里就会显示我们的氧气值剩余啦！
tag @a[scores={show_time=830}] add ShowActionbar
tag @a[scores={show_time=830}] add ShowOxygenName
tag @a[scores={show_time=830}] add ShowOxygen1
title @a[scores={show_time=870}] title §6§l氧气值显示方式
title @a[scores={show_time=870}] subtitle §b§l还有多种样式供我们选择呢！
tag @a[scores={show_time=870}] remove ShowOxygen1
tag @a[scores={show_time=870}] add ShowOxygen2
title @a[scores={show_time=910}] subtitle §a§l还有多种样式供我们选择呢！
tag @a[scores={show_time=910}] remove ShowOxygen2
tag @a[scores={show_time=910}] add ShowOxygen3
title @a[scores={show_time=910}] title §6§l氧气值显示方式
title @a[scores={show_time=950}] subtitle §c§l还有多种样式供我们选择呢！
tag @a[scores={show_time=950}] remove ShowOxygen3
tag @a[scores={show_time=950}] add ShowOxygen4
tag @a[scores={show_time=990}] remove ShowOxygen4
tag @a[scores={show_time=990}] add ShowOxygen1
title @a[scores={show_time=990}] title §6§l与此同时我们还可以显示
title @a[scores={show_time=990}] subtitle §b§l能源币余额
tag @a[scores={show_time=990}] add ShowMoney
title @a[scores={show_time=1030}] subtitle §a§l能源币余额、在线时间
title @a[scores={show_time=1030}] title §6§l与此同时我们还可以显示
tag @a[scores={show_time=1030}] add ShowTime
title @a[scores={show_time=1070}] subtitle §c§l能源币余额、在线时间、物价指数
tag @a[scores={show_time=1070}] add ShowRN
title @a[scores={show_time=1110}] title §6§l那么问题来了
title @a[scores={show_time=1110}] subtitle §c§l什么是物价指数呢？
title @a[scores={show_time=1150}] title §6§l物价指数每个小时变动一次
title @a[scores={show_time=1150}] subtitle §c§l在0.20-1.80之间波动！！！
title @a[scores={show_time=1190}] title §6§l服务器商店中的所有价格
title @a[scores={show_time=1190}] subtitle §c§l均是基础价格*物价指数的价格
title @a[scores={show_time=1230}] title §6§l掌握好物价指数的变动
title @a[scores={show_time=1230}] subtitle §c§l说不定就可以一夜暴富呢╰(*°▽°*)╯
title @a[scores={show_time=1270}] title §6§l总之咱服务器
title @a[scores={show_time=1270}] subtitle §c§l就是空岛生存卖出物品
title @a[scores={show_time=1310}] title §6§l获得能源币
title @a[scores={show_time=1310}] subtitle §c§l购买氧气值等物品生存下去！
title @a[scores={show_time=1350}] title §6§l说了那么多
title @a[scores={show_time=1350}] subtitle §c§l我们应该如何开始呢？
title @a[scores={show_time=1390}] title §6§l在完成新手引导后
title @a[scores={show_time=1390}] subtitle §c§l我们会被传送到主城...
title @a[scores={show_time=1430}] title §6§l找一个叫“领取空岛”的npc
title @a[scores={show_time=1430}] subtitle §c§l根据引导选择我们想要的空岛就可以开始愉快的生存辣！
title @a[scores={show_time=1470}] title §6§l唉...对了
title @a[scores={show_time=1470}] subtitle §c§l服务器主要菜单是钟菜单哦！
title @a[scores={show_time=1510}] title §6§l就是使用钟表点击地面
title @a[scores={show_time=1510}] subtitle §c§l就可以打开菜单了！！！！
title @a[scores={show_time=1550}] title §6§l怎样获取钟表?
title @a[scores={show_time=1550}] subtitle §c§l在聊天栏输入+clock即可（等下再试嘛...
title @a[scores={show_time=1590}] title §6§l这里我也送你个钟表！
title @a[scores={show_time=1590}] subtitle §c§l玩得愉快哦（等下再试嘛...
give @a[scores={show_time=1630}] clock
give @a[scores={show_time=1630}] minecraft:grass
give @a[scores={show_time=1630}] water_bucket
give @a[scores={show_time=1630}] lava_bucket
give @a[scores={show_time=1630}] sapling
give @a[scores={show_time=1630}] wheat_seeds 6
give @a[scores={show_time=1630}] apple 16
title @a[scores={show_time=1630}] title §6§l最后的最后
title @a[scores={show_time=1630}] subtitle §c§l有bug及时反馈哦！！！
scoreboard players add @a[scores={show_time=1649}] oxygen 5000
scoreboard players add @a[scores={show_time=1649}] money 1000
tellraw @a[scores={show_time=1649}] {"rawtext":[{"text":"§e最后氧气我再给你充满！送你1000能源币！祝你在接下来的旅程玩的开心喵~\n---未知的引导者"}]}
tp @a[scores={show_time=1640}] 702 90 554 facing 718 98 554
effect @a[scores={show_time=1645}] slow_falling 10 2 true

























