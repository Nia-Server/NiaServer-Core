
function __adler32(str) {  
    var P = 65521, a = 1, b = 0;  
    str = eval('\''+encodeURI(str).replace(/%/gm, '\\x')+'\'');
    for(var i=0;i < str.length; i++) a = (a+str.charCodeAt(i))%P, b = (a+b)%P; 
    return (b>>>0)*((1<<16)>>>0)+(a>>>0); 
}
function adler32(str){
    str = __adler32(str);
    return str.toString(16).padStart(8, "0");
}






