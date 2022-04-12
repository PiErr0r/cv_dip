function generateUUID() { // Public Domain/MIT
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if(d > 0){//Use timestamp until depleted
            r = (d + r)%16 | 0;
            d = Math.floor(d/16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r)%16 | 0;
            d2 = Math.floor(d2/16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

function capitalize(s) {
    if (!s) throw new Error(`Can't capitalizes string ${s}`);
    if (typeof s !== 'string') throw new Error(`Not a string: ${s}`);
    return s[0].toUpperCase() + s.slice(1);
}

function getColorFromRGB(r, g, b) {
    const f = Math.floor;
    const map = {10:'a',11:'b',12:'c',13:'d',14:'e',15:'f'};
    const handler = {get(t, p){return p < 10 ? f(p) : t[f(p)]}};
    const M = new Proxy(map, handler);
    return `#${M[r/16]}${M[r%16]}${M[g/16]}${M[g%16]}${M[b/16]}${M[b%16]}`;
}
