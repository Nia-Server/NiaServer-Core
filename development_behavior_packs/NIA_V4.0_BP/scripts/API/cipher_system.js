function __2UTF8(str) {
    var back = [], byteSize = 0;
    for (var i = 0; i < str.length; i++) {
        var code = str.charCodeAt(i);
        if (0x00 <= code && code <= 0x7f) {
            byteSize += 1, back.push(code);
        } else if (0x80 <= code && code <= 0x7ff) {
            byteSize += 2;
            back.push((192 | (31 & (code >> 6))));
            back.push((128 | (63 & code)));
        } else if ((0x800 <= code && code <= 0xd7ff) 
                || (0xe000 <= code && code <= 0xffff)) {
            byteSize += 3;
            back.push((224 | (15 & (code >> 12))));
            back.push((128 | (63 & (code >> 6))));
            back.push((128 | (63 & code)));
        }
    }
    for (i = 0; i < back.length; i++) back[i] &= 0xff;
    return back;
}

function __adler32(str) {
    var P = 65521, a = 1, b = 0;
    str = __2UTF8(str);
    for(var i=0;i < str.length; i++) a = (a+str[i])%P, b = (a+b)%P;
    return (b>>>0)*((1<<16)>>>0)+(a>>>0);
}

export function adler32(str){
    str = __adler32(str);
    return str.toString(16).padStart(8, "0");
}






