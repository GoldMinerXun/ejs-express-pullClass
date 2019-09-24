class CookieTools {
    constructor(objectid) {
        this.objectid = objectid.toString();
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
}
exports.CookieTools = CookieTools;