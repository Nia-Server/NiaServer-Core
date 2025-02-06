export function log(info) {
    console.log("\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m] " + info + "\x1b[0m")
}

export function warn(info) {
    console.warn("\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m]\x1b[37m " + info + "\x1b[0m")
}

export function error(info) {
    console.error("\x1b[33m[\x1b[36mNiaServer-Core\x1b[33m]\x1b[31m " + info + "\x1b[0m")
}