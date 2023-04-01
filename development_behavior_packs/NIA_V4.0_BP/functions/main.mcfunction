scoreboard players add @a[tag=CringIsland] c_time 1
effect @a[tag=CringIsland] slow_falling 20 0 true
effect @a[tag=CringIsland] blindness 10 0 true
title @a[tag=CringIsland,scores={c_time=5}] title §e正在自动生成空岛中！
title @a[tag=CringIsland,scores={c_time=5}] subtitle §7请稍等，如果生成失败请联系服主！
title @a[tag=CringIsland,scores={c_time=100}] title §e正在检查是否有阻挡...
title @a[tag=CringIsland,scores={c_time=100}] subtitle §7请稍等，如果生成失败请联系服主！
tag @a[scores={c_time=200..}] remove CringIsland
scoreboard players set @a[scores={c_time=200..}] c_time 0

scoreboard players add @a miningTime 0
tellraw @a[tag=enterMine,scores={miningTime=1..}] {"rawtext":[{"text":"§e>> 欢迎回来！本次进入不消耗体力哦！"}]}
tp @a[tag=enterMine,scores={miningTime=1..}] 769 73 553
tag @a[tag=enterMine,scores={miningTime=1..}] remove enterMine

tellraw @a[tag=enterMine,scores={stamina=..39}] {"rawtext":[{"text":"§c>> 您的体力值不足！暂时无法进入矿场！"}]}
tag @a[tag=enterMine,scores={stamina=..39}] remove enterMine

scoreboard players set @a[tag=enterMine,scores={stamina=40..}] miningTime 18000
tp @a[tag=enterMine,scores={stamina=40..}] 769 73 553
tellraw @a[tag=enterMine,scores={stamina=40..}] {"rawtext":[{"text":"§a§l>> 欢迎进入服务器官方矿场！15分钟挖矿时间！请自行调整生存模式！"}]}
scoreboard players add @a[tag=enterMine,scores={stamina=40..}] stamina -40
tag @a[tag=enterMine,scores={stamina=40..}] remove enterMine
