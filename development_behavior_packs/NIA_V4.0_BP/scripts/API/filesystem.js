import {world,system} from '@minecraft/server';
import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';

const port = 10086
const server_url = "http://127.0.0.1"

export class ExternalFS {

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
     * @return {Object | Number} 创建成功返回success，创建失败返回0，服务器连接失败返回-1
     */
    CreateNewFile(filename,filecontent) {
        const reqCreateNewFile = new HttpRequest(`${server_url}:${port}/CreateNewFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain")
        return new Promise(async (resolve) => {
            const response = http.request(reqCreateNewFile);
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
     * @return {Object | Number} 创建成功返回success，创建失败返回0，服务器连接失败返回-1
     */
    CreateNewJsonFile(filename,filecontent) {
        const reqCreateNewJsonFile = new HttpRequest(`${server_url}:${port}/CreateNewJsonFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain")
        return new Promise(async (resolve) => {
            const response = http.request(reqCreateNewJsonFile);
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
     * @return {Object | Number} 覆写成功返回success，覆写失败返回0，服务器连接失败返回-1
     */
    OverwriteFile(filename,filecontent) {
        const reqOverwriteFile = new HttpRequest(`${server_url}:${port}/OverwriteFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = http.request(reqOverwriteFile);
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
     * @return {Object | Number} 覆写成功返回success，覆写失败返回0，服务器连接失败返回-1
     */
    OverwriteJsonFile(filename,filecontent) {
        const reqOverwriteJsonFile = new HttpRequest(`${server_url}:${port}/OverwriteJsonFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = http.request(reqOverwriteJsonFile);
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
     * @return {Object | Number} 覆写成功返回success，覆写失败返回0，服务器连接失败返回-1
     */
    WriteLineToFile(filename,filecontent) {
        const reqWriteLineToFile = new HttpRequest(`${server_url}:${port}/WriteLineToFile`)
        .setBody(JSON.stringify({"fileName":filename,"content":filecontent}))
        .setMethod(HttpRequestMethod.Post)
        .addHeader("Content-Type", "text/plain");
        return new Promise(async (resolve) => {
            const response = http.request(reqWriteLineToFile);
            if (response.status == 200) {
                resolve(response.body);
            } else if (response.status == 400) {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    }
}


