import { world,system } from "@minecraft/server";

world.afterEvents.worldInitialize.subscribe((event) => {

    //检测服务器是否初始化
    if (world.getDynamicProperty("state") == null) {
        world.scoreboard.addObjective("side_bar","§b==§1N§2i§3aS§4e§5r§6v§7e§8r§b==")
        world.setDynamicProperty("state",true);
        world.scoreboard.setObjectiveAtDisplaySlot("Sidebar",{"objective": world.scoreboard.getObjective("side_bar")});
    } else if (world.getDynamicProperty("state") == true) {
        world.scoreboard.addObjective("side_bar","§b==§1N§2i§3aS§4e§5r§6v§7e§8r§b==")
        world.scoreboard.setObjectiveAtDisplaySlot("Sidebar",{"objective": world.scoreboard.getObjective("side_bar")});
    }

})

const side_bar = [
    {
        "type" : "text",
        "text" : "V8-海洋生存"
    }
]

let last_tick = system.currentTick;

let type_id = 0;
let now_time = Date.now();

system.runInterval(()=>{
    if (Date.now()-now_time<1000) return;
    world.scoreboard.removeObjective("side_bar");
    // Create an array of color sequences for the rainbow effect
    const colorPatterns = [
        "§4N§ci§6a§eS§2e§ar§bv§3e§1r",
        "§1N§4i§ca§6S§ee§2r§av§be§3r",
        "§3N§1i§4a§cS§6e§er§2v§ae§br",
        "§bN§3i§1a§4S§ce§6r§ev§2e§ar",
        "§aN§bi§3a§1S§4e§cr§6v§ee§2r",
        "§2N§ai§ba§3S§1e§4r§cv§6e§er",
        "§eN§2i§aa§bS§3e§1r§4v§ce§6r",
        "§6N§ei§2a§aS§be§3r§1v§4e§cr",
        "§cN§6i§ea§2S§ae§br§3v§1e§4r",

    ];

    world.scoreboard.addObjective("side_bar", `${colorPatterns[type_id]}`);

    type_id = (type_id + 1) % 9;
    world.scoreboard.setObjectiveAtDisplaySlot("Sidebar",{"objective": world.scoreboard.getObjective("side_bar"),"sortOrder": 0});
    world.scoreboard.getObjective("side_bar").setScore("   §c-§b----------§c-",0);
    world.scoreboard.getObjective("side_bar").setScore("§b      V8-海洋生存",1);
    world.scoreboard.getObjective("side_bar").setScore("§b   ------------",2);
    //时间
    let tick = system.currentTick;
    world.scoreboard.getObjective("side_bar").setScore("§e      TPS： §c"+((tick-last_tick)/((Date.now()-now_time)/1000)).toFixed(2),3);
    now_time = Date.now();
    last_tick = tick;

    //显示 当前几点几分几秒,形式如 00:00:00
    let now_date = new Date();
    let date = new Date(now_date.getTime() + 28800000);
    let hour = date.getHours();
    let minute = date.getMinutes();
    let second = date.getSeconds();
    let time = `${hour<10?"0"+hour:hour}:${minute<10?"0"+minute:minute}:${second<10?"0"+second:second}`;
    world.scoreboard.getObjective("side_bar").setScore("      §e时间： §c"+time,4);
    world.scoreboard.getObjective("side_bar").setScore("   §c--§b--------§c--",5);


},1)