
const config = {
    "MENUITEM": "minecraft:clock",
    "USERandomDATA": true,
    "MoneyScoreboardName": "money",
    "MoneyShowName": "能源币",
    "TimeScoreboardName":"time",
    "OPTAG": "op",
    "OPMENUPassword": "123456",
    "MapFolder":"..\\..\\..\\worlds\\NEWTEST",
    "BackupFolder":"\\backup",
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
    }
}


export const cfg = config