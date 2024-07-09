import { system, world } from "@minecraft/server";
import { ExternalFS } from "./API/filesystem";
import { log,GetTime, Broadcast } from "./customFunction";

const fs = new ExternalFS();


//启动检测特定文件是否存在
