import { world } from '@minecraft/server';
import { log } from './customFunction.js'
import { http } from '@minecraft/server-net';
import { VERSION } from './main.js';


//服务器启动监听
world.afterEvents.worldInitialize.subscribe(() => {

    const start = Date.now();

    //检查更新
    const reqCheckUpdate = http.get(`http://api.github.com/repos/NIANIANKNIA/NIASERVER-V4/releases`)
    reqCheckUpdate.then((response) => {
        if (response.status == 200) {
            if (JSON.parse(response.body)[0].tag_name > VERSION) {
                console.warn(`[NIA V4.5] The current plugin package is not the latest version, the current version is: ${VERSION}, Github on the release of the latest version is: ${JSON.parse(response.body)[0].tag_name}. link: https://github.com/NIANIANKNIA/NIASERVER-V4/releases/tag/${JSON.parse(response.body)[0].tag_name}`);
                log("Total time spent on this inspection update:" + (Date.now() - start) + " ms");
            } else {
                log("Automatic check for updates was successful! The current version is the latest version!");
                log("Total time spent on this inspection update:" + (Date.now() - start) + " ms");
            }
        } else {
            console.warn("[NIA V4.5] Automatically checking for updates failed! Github server connection failed!");
            log("Total time spent on this inspection update:" + (Date.now() - start) + " ms");
        }
    })
})
