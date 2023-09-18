import { world } from "@minecraft/server";
import { ExternalFS } from "./API/filesystem";
import { log,GetTime } from "./customFunction";

const fs = new ExternalFS();

// world.afterEvents.blockBreak.subscribe(event => {
//     log(GetTime() + " " + event.block.typeId + " " + event.block.x);
// })
