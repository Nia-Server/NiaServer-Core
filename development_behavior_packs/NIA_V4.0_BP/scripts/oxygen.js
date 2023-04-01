import {world,system} from '@minecraft/server';
import {ActionFormData,ModalFormData,MessageFormData} from '@minecraft/server-ui'
import {Tell,RunCmd,GetScore} from './customFunction.js'
import {ShopGUI} from './shop.js'

//呼吸装备等级
const equLevelData = {
    "0": {
        "name": "初级呼吸装备Ⅰ",
        "max": 5000,
        "consume": 20,
        "price": 0
    },
    "1": {
        "name": "初级呼吸装备Ⅱ",
        "max": 5300,
        "consume": 19,
        "price": 100
    },
    "2": {
        "name": "初级呼吸装备Ⅲ",
        "max": 5500,
        "consume": 18,
        "price": 300
    },
    "3": {
        "name": "中级呼吸装备Ⅰ",
        "max": 5800,
        "consume": 18,
        "price": 500
    },
    "4": {
        "name": "中级呼吸装备Ⅱ",
        "max": 6000,
        "consume": 17,
        "price": 1000
    },
    "5": {
        "name": "中级呼吸装备Ⅲ",
        "max": 6000,
        "consume": 16,
        "price": 1200
    },
    "6": {
        "name": "高级呼吸装备Ⅰ",
        "max": 6300,
        "consume": 16,
        "price": 1500
    },
    "7": {
        "name": "高级呼吸装备Ⅱ",
        "max": 6500,
        "consume": 15,
        "price": 2000
    },
    "8": {
        "name": "高级呼吸装备Ⅲ",
        "max": 6500,
        "consume": 14,
        "price": 2500
    },
    "9": {
        "name": "X级呼吸装备Ⅰ",
        "max": 7000,
        "consume": 13,
        "price": 5000
    },
    "10": {
        "name": "X级呼吸装备Ⅱ",
        "max": 8000,
        "consume": 13,
        "price": 8000
    },
    "11": {
        "name": "X级呼吸装备Ⅲ",
        "max": 9000,
        "consume": 12,
        "price": 10000
    },
    "12": {
        "name": "X级呼吸装备Ⅳ",
        "max": 10000,
        "consume": 11,
        "price": 10000
    },
    "13": {
        "name": "X级呼吸装备Ⅴ",
        "max": 15000,
        "consume": 10,
        "price": 15000
    },
    "14": {
        "name": "S级呼吸装备Ⅰ",
        "max": 15000,
        "consume": 5,
        "price": 20000
    },
    "15": {
        "name": "S级呼吸装备Ⅱ",
        "max": 15000,
        "consume": 3,
        "price": 30000
    },
    "16": {
        "name": "S级呼吸装备Ⅲ",
        "max": 15000,
        "consume": 2,
        "price": 40000
    },
    "17": {
        "name": "V级呼吸装备",
        "max": 15000,
        "consume": 1,
        "price": 50000
    }
}

// system.runInternal(() => {

// },20)