import { http,HttpRequestMethod,HttpRequest } from '@minecraft/server-net';
import { world } from '@minecraft/server';

const port = 10086
const server_url = "http://127.0.0.1"

export class ExternalFS {

    /**
     * @function 执行DOS命令
     * @param {String} cmd
     * @return {String | Number} 获取成功返回success，服务器连接失败返回-1
     */
    RunCmd(cmd) {
        const reqRunCmd = new HttpRequest(`${server_url}:${port}/RunCmd`)
        .setBody(cmd)
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = await http.request(reqRunCmd);
            if (response.status == 200) {
                resolve(response.body);
            } else {
                resolve(-1);
            }
        })
    }

    /**
     * @function 检测特定文件是否存在
     * @param {String} filename
     * @return {String | Number} 获取成功返回true,文件不存在返回0，服务器连接失败返回-1
     */
    CheckFile(filename) {
        const reqCheckFile = new HttpRequest(`${server_url}:${port}/CheckFile`)
        .setBody(filename)
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = await http.request(reqCheckFile);
            if (response.status == 200) {
                resolve(response.body);
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    }

    /**
     * @function 获取文件内容
     * @param {String} filename
     * @return {String | Number} 获取成功返回文件数据，文件不存在返回0，服务器连接失败返回-1
     */
    GetFileData(filename) {
        const reqGetFileData = new HttpRequest(`${server_url}:${port}/GetFileData`)
        .setBody(filename)
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = await http.request(reqGetFileData);
            if (response.status == 200) {
                resolve(JSON.parse(response.body));
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    }

    /**
     * @function 获取json文件内容
     * @param {String} filename
     * @return {Object | Number} 获取成功返回json数据，文件不存在返回0，服务器连接失败返回-1
     */
    GetJSONFileData(filename) {
        const reqGetJsonFileData = new HttpRequest(`${server_url}:${port}/GetJsonFileData`)
        .setBody(filename)
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = await http.request(reqGetJsonFileData);
            if (response.status == 200) {
                resolve(JSON.parse(response.body));
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    }

    /**
     * @function 创建新文件
     * @param {String} filename
     * @param {String} filecontent
     * @return {String | Number} 创建成功返回success，创建失败返回0，服务器连接失败返回-1
     */
    CreateNewFile(filename,filecontent) {
        const reqCreateNewFile = new HttpRequest(`${server_url}:${port}/CreateNewFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain")
        return new Promise(async (resolve) => {
            const response = await http.request(reqCreateNewFile);
            if (response.status == 200) {
                resolve(response.body);
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        });
    }

    /**
     * @function 创建json文件
     * @param {String} filename
     * @param {Object} filecontent
     * @return {String | Number} 创建成功返回success，创建失败返回0，服务器连接失败返回-1
     */
    CreateNewJsonFile(filename,filecontent) {
        const reqCreateNewJsonFile = new HttpRequest(`${server_url}:${port}/CreateNewJsonFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain")
        return new Promise(async (resolve) => {
            const response = await http.request(reqCreateNewJsonFile);
            if (response.status == 200) {
                resolve(response.body);
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        });
    }

    /**
     * 覆写文件
     * @param {String} filename
     * @param {String} filecontent
     * @return {String | Number} 覆写成功返回success，覆写失败返回0，服务器连接失败返回-1
     */
    OverwriteFile(filename,filecontent) {
        const reqOverwriteFile = new HttpRequest(`${server_url}:${port}/OverwriteFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = await http.request(reqOverwriteFile);
            if (response.status == 200) {
                resolve(response.body);
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    }

    /**
     * 覆写json文件
     * @param {String} filename
     * @param {Object} filecontent
     * @return {String | Number} 覆写成功返回success，覆写失败返回0，服务器连接失败返回-1
     */
    OverwriteJsonFile(filename,filecontent) {
        const reqOverwriteJsonFile = new HttpRequest(`${server_url}:${port}/OverwriteJsonFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = await http.request(reqOverwriteJsonFile);
            if (response.status == 200) {
                resolve(response.body);
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    }

    /**
     * 向特定文件写入一行内容
     * @param {String} filename
     * @param {String} filecontent
     * @return {String | Number} 覆写成功返回success，覆写失败返回0，服务器连接失败返回-1
     */
    WriteLineToFile(filename,filecontent) {
        const reqWriteLineToFile = new HttpRequest(`${server_url}:${port}/WriteLineToFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = await http.request(reqWriteLineToFile);
            if (response.status == 200) {
                resolve(response.body);
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    }

    /**
     * 复制文件夹
     * @param {String} From
     * @param {String} To
     * @return {String | Number} 备份成功返回success，备份失败返回0，服务器连接失败返回-1
     */
    CopyFolder(From, To) {
        const reqCopyFolder = new HttpRequest(`${server_url}:${port}/CopyFolder`)
        .setBody(JSON.stringify({"Folder":From,"To":To}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = await http.request(reqCopyFolder);
            if (response.status == 200) {
                resolve(response.body);
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    }

    /**
     * 备份服务器存档
     * @param {String} From
     * @param {String} To
     * @return {String | Number} 备份成功返回success，备份失败返回0，服务器连接失败返回-1
     */
    Backup(From,To) {
        world.getDimension("overworld").runCommandAsync("save hold");
        return new Promise(async (resolve) => {
            this.RunCmd(`mkdir ${To}`).then((result) => {
                if (result === "success") {
                    this.CopyFolder(From, To).then((result) => {
                        world.getDimension("overworld").runCommandAsync("save resume");
                        resolve(result);
                    })
                } else {
                    world.getDimension("overworld").runCommandAsync("save resume");
                    resolve(result)
                }
            })
        })
    }
}

export class QQBotSystem {

    /**
     * @function 向特定qq群发送消息
     * @param {String} message
     * @param {String} qq_group_id
     * @return {String | Number}
     */
    send_group_msg(message,qq_group_id) {
        const req_send_group_msg = new HttpRequest(`${server_url}:10023/send_group_msg`)
            .setBody(JSON.stringify({"group_id":qq_group_id,"message":message,"auto_escape":false}))
            .setMethod(HttpRequestMethod.Post)
            .addHeader("Content-Type", "text/plain")
        return new Promise(async (resolve) => {
            const response = await http.request(req_send_group_msg);
            if (response.status == 200) {
                resolve(response.body);
            } else {
                resolve(-1);
            }
        });
    }
}


