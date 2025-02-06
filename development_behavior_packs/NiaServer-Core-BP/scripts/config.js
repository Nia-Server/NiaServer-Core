const config = {
    "cfgVersion": "1.0.0",
    "MENUITEM": "minecraft:clock",
    "USERandomDATA": true,
    "MoneyScoreboardName": "money",
    "MoneyShowName": "金币",
    "TimeScoreboardName":"time",
    "OPTAG": "op",
    "OPMENUPassword": "123456",
    "USEQQBot": true,
    "USEEventLog": true,
    "HttpCfg": {
        "IPAddress": "http://127.0.0.1",
        "Port": 10086
    },
    "LandCfg": {
        "Distance": 100,
        "MaxSquare": 10000,
        "MinSquare": 100,
        "Price_2D": 300,
        "Price_3D": 3,
        "XRange": [-100000,100000],
        "ZRange": [-100000,100000],
        "YRange": [-64,256]
    },
    "MarketCfg": {
        "BanItems" : ["minecraft:paper","minecraft:clock"]
    },
    "QQBotCfg": {
        "QQGroup": "724360499",
        "TransferMessage": true
    }
}


export const cfg = config