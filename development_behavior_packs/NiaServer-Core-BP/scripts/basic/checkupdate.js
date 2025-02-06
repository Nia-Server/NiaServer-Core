import { world } from '@minecraft/server';
import { http } from '@minecraft/server-net';
import { log, warn, error } from '../API/logger.js';
import { VERSION } from '../main.js';


//服务器启动监听
world.afterEvents.worldInitialize.subscribe(() => {

    const start = Date.now();

    //检查更新
    const reqCheckUpdate = http.get(`http://api.github.com/repos/Nia-Server/NiaServer-Core/releases`)
    reqCheckUpdate.then((response) => {
        if (response.status == 200) {
            if (JSON.parse(response.body)[0].tag_name > VERSION) {
                warn(`当前NiaServer-core不是最新版本： ${VERSION}, Github上release最新的版本为： ${JSON.parse(response.body)[0].tag_name}。 下载链接为: https://github.com/Nia-Server/NiaServer-Core/releases/tag/${JSON.parse(response.body)[0].tag_name}`);
                log("本次自动检查更新用时 " + (Date.now() - start) + " ms");
            } else {
                log("自动检查更新成功，当前使用版本为最新版本");
                log("本次自动检查更新用时 " + (Date.now() - start) + " ms");
            }
        } else {
            warn("自动检查更新失败，无法连接到Github服务器");
            log("本次自动检查更新用时 " + (Date.now() - start) + " ms");
        }
    })
})
