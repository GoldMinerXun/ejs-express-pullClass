<<<<<<< HEAD
class CookieTools {
    constructor(objectid) {
        if(objectid){
            this.objectid = objectid.toString();
        }
      
    }
    randomString() {
        var sixRandomWords = '';
        for (let i = 0; i < 6; i++) {
            var lowOrup = Math.random() >= 0.5 ? true : false;
            if (lowOrup) {
                var letter = Math.random() * 26 + 65;

            } else {
                var letter = Math.random() * 26 + 97;
            }
            letter = parseInt(letter);
            letter = String.fromCharCode(letter);
            sixRandomWords += letter;
        }
        return sixRandomWords
    }
    produceCookie() {
        var cookiestr = 'CoolClassTable' + this.objectid + this.randomString();
        return cookiestr;
    }
    parserCookie(str){
        var cookiestr=str;
        if(str.length>0){
            var objectid=cookiestr.slice(14,38);
            return objectid;
        }else{
            return false;
        }
        
    }
}
=======
class CookieTools {
    constructor(objectid) {
        if(objectid){
            this.objectid = objectid.toString();
        }
      
    }
    randomString() {
        var sixRandomWords = '';
        for (let i = 0; i < 6; i++) {
            var lowOrup = Math.random() >= 0.5 ? true : false;
            if (lowOrup) {
                var letter = Math.random() * 26 + 65;

            } else {
                var letter = Math.random() * 26 + 97;
            }
            letter = parseInt(letter);
            letter = String.fromCharCode(letter);
            sixRandomWords += letter;
        }
        return sixRandomWords
    }
    produceCookie() {
        var cookiestr = 'CoolClassTable' + this.objectid + this.randomString();
        return cookiestr;
    }
    parserCookie(str){
        var cookiestr=str;
        if(str.length>0){
            var objectid=cookiestr.slice(14,38);
            return objectid;
        }else{
            return false;
        }
        
    }
}
>>>>>>> 0b0c8f7a921ef6c9dd2b2133a1b1a470b4453ce0
exports.CookieTools = CookieTools;