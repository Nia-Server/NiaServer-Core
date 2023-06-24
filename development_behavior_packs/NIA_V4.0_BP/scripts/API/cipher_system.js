
function __adler32(str) {  
    var P = 65521, a = 1, b = 0;  
    str = (new TextEncoder('utf8')).encode(str);
    for(var i=0;i < str.length; i++) a = (a+str[i])%P, b = (a+b)%P; 
    return ((BigInt(b) * BigInt(1<<16)) + BigInt(a));  
}
function adler32(str){
    str = __adler32(str);
    return str.toString(16).padStart(8, "0");
}






