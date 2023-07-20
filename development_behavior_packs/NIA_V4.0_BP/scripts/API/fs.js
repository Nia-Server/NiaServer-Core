import {world,system} from '@minecraft/server';
import {http,HttpRequestMethod,HttpRequest,HttpHeader} from '@minecraft/server-net';

const port = 10086
const url = "http://127.0.0.1"

function GetJsonFileData_init(filename) {
    const reqGetJsonFileData = new HttpRequest(`${url}:${port}/GetJsonFileData`);
        reqGetJsonFileData.body = filename;
        reqGetJsonFileData.method = HttpRequestMethod.POST;
        reqGetJsonFileData.headers = [
            new HttpHeader("Content-Type", "text/plain"),
        ];
    return new Promise((resolve) => {
        http.request(reqGetJsonFileData).then((response) => {
            if (response.status == 200 && response.body != "The target file does not exist") {
                resolve(response.body);
            } else if (response.status == 200 && response.body == "The target file does not exist") {
                resolve(0);
            } else {
                resolve(-1);
            }
        })
    })
}

export async function GetJsonFileData(filename) {
    let data = await GetJsonFileData_init(filename);
    return data;
}

