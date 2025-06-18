import { world } from "@minecraft/server";
import { ActionFormData, ModalFormData, MessageFormData } from "@minecraft/server-ui";
import { log, warn, error } from "../API/logger.js";
import { cfg } from "../config.js";

const CheckBagGUI = {
    Main(player) {
        const CheckBagForm = new ActionFormData()
        .title("检查玩家背包")
        .body("选择要检查的玩家")
        for (const player of world.getPlayers()) {
            CheckBagForm.button(player.nameTag, player.nameTag)
        }
        
    }
}

