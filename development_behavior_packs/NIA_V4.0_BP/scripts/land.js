//圈地系统
//开发中功能请勿使用！

import {system, world} from '@minecraft/server';
//初始化LandIndex
var LandIndex = {};

let LandData = {
    "123456":{
        "type": "3D",
        "pos1": [100,0,100],
        "pos2": [150,100,150],
        "dimid":"minecraft:nether",
        "landName": "NIANIANKNIA",
        "owner": 123456789,
        "allowList": [],
        "banlist": [],
        "teleport": []
    }
}


/**
 * 输入坐标范围信息，以及当前的索引值数据，添加索引值,并返回新的索引值
 * @param {Array} pos1
 * @param {Array} pos2
 * @param {number} dimid
 * @param {number} LandUUID
 * @param {object} LandIndex
 * @return {object} newLandIndex
 */
function calculateIndex(pos1, pos2, dimid, LandUUID, LandIndex) {
    let X1Index = parseInt(pos1[0] / 16);
    let Z1Index = parseInt(pos1[2] / 16);
    let X2Index = parseInt(pos2[0] / 16);
    let Z2Index = parseInt(pos2[2] / 16);
    //将最小的转化为相应索引值
    if (X1Index > X2Index) {
        let IndexXMIN = X1Index;
        X1Index = X2Index;
        X2Index = IndexXMIN;
    }
    if (Z1Index > Z2Index) {
        let IndexZMIN = Z1Index;
        Z1Index = Z2Index;
        Z2Index = IndexZMIN;
    }
    //开始写入索引值
    for (let XIndex = X1Index; XIndex <= X2Index; XIndex++) {
        for (let ZIndex = Z1Index; ZIndex <= Z2Index; ZIndex++) {
            if (!LandIndex[String(dimid)]) {
                LandIndex[String(dimid)] = {};
            }
            if (!LandIndex[String(dimid)][String(XIndex)]) {
                LandIndex[String(dimid)][String(XIndex)] = {}
            }
            if (!LandIndex[String(dimid)][String(XIndex)][String(ZIndex)]) {
                LandIndex[String(dimid)][String(XIndex)][String(ZIndex)] = [];
            }
            LandIndex[String(dimid)][String(XIndex)][String(ZIndex)].push(LandUUID);
        }
    }
    return LandIndex;
}

/**
 * 判断坐标对应的区块是否有地皮数据
 * @param {Array} pos
 * @param {number} dimid
 * @returns {object} 如果不在返回false，如果在则返回所在的地皮数据
 */
function PosInIndex(pos,dimid) {
    //根据传入的坐标计算出相应的区块编号
    let posX = parseInt(pos[0]);
    let posY = parseInt(pos[1]);
    let posZ = parseInt(pos[2]);
    let posDimid = dimid;
    let XIndex = parseInt(posX / 16);
    let ZIndex = parseInt(posZ / 16);
    //判断该区块内是否有地皮数据，根据数据层层判断
    if(!LandIndex[posDimid] || !LandIndex[posDimid][XIndex] || !LandIndex[posDimid][XIndex][ZIndex]) {
        return false;
    }
    //如果走到了这里说明，该区块编号下有相应的地皮数据存在，然后遍历该区块存在的地皮即可
    //let LandData = JSON.parse("");
    let IndexData = LandIndex[posDimid][XIndex][ZIndex]
    for (let key = 0;key < IndexData.length;key++) {
        //根据相应的地皮类型进行计算
        switch (LandData[IndexData[key]].type) {
            //这里判断的就是相应的坐标是否真在该区块所在的地皮之中
            case "3D":
                //就是一个简简单单的数据判断
                let resultX_3D = ((posX >= LandData[IndexData[key]].pos1[0] && posX <= LandData[IndexData[key]].pos2[0]) || (posX <= LandData[IndexData[key]].pos1[0] && posX >= LandData[IndexData[key]].pos2[0]));
                let resultY = ((posY >= LandData[IndexData[key]].pos1[1] && posY <= LandData[IndexData[key]].pos2[1]) || (posY <= LandData[IndexData[key]].pos1[1] && posY >= LandData[IndexData[key]].pos2[1]));
                let resultZ_3D = ((posZ >= LandData[IndexData[key]].pos1[2] && posZ <= LandData[IndexData[key]].pos2[2]) || (posZ <= LandData[IndexData[key]].pos1[2] && posZ >= LandData[IndexData[key]].pos2[2]));
                if (posDimid == LandData[IndexData[key]].dimid && resultX_3D && resultY && resultZ_3D) {
                    return LandData[IndexData[key]];
                }
            case "2D":
                let resultX = ((posX >= LandData[IndexData[key]].pos1[0] && posX <= LandData[IndexData[key]].pos2[0]) || (posX <= LandData[IndexData[key]].pos1[0] && posX >= LandData[IndexData[key]].pos2[0]));
                let resultZ = ((posZ >= LandData[IndexData[key]].pos1[2] && posZ <= LandData[IndexData[key]].pos2[2]) || (posZ <= LandData[IndexData[key]].pos1[2] && posZ >= LandData[IndexData[key]].pos2[2]));
                if (posDimid == LandData[IndexData[key]].dimid && resultX && resultZ) {
                    return LandData[IndexData[key]];
                }
            case "cylinder":
                //根据两点间的距离进行相应的判断操作
                let distance = Math.pow(posX - LandData[IndexData[key]].pos1[0],2) + Math.pow(posZ - LandData[IndexData[key]].pos1[2],2);
                if (Math.pow(IndexData[key].R,2) >= distance) {
                    return LandData[IndexData[key]];
                }
        }
    }
    return false;
}

calculateIndex([100,0,100],[150,100,150],"minecraft:nether",123456,LandIndex)
console.log(JSON.stringify(PosInIndex([100,0,151],"minecraft:nether")))
console.log(JSON.stringify(LandIndex))