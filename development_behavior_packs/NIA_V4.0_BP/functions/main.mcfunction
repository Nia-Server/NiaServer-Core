scoreboard players add @a[tag=CringIsland] c_time 1
effect @a[tag=CringIsland] slow_falling 20 0 true
effect @a[tag=CringIsland] blindness 10 0 true
title @a[tag=CringIsland,scores={c_time=5}] title §e正在自动生成空岛中！
title @a[tag=CringIsland,scores={c_time=5}] subtitle §7请稍等，如果生成失败请联系服主！
title @a[tag=CringIsland,scores={c_time=100}] title §e正在检查是否有阻挡...
title @a[tag=CringIsland,scores={c_time=100}] subtitle §7请稍等，如果生成失败请联系服主！
tag @a[scores={c_time=200..}] remove CringIsland
scoreboard players set @a[scores={c_time=200..}] c_time 0
