const cheerio = require('cheerio');
const querystring = require('querystring')
class HandleClassTable {
    constructor(html) {
        this.html = html;
    }
    handleres(arrayobj){
        var str='';
        for(let i=0;i<arrayobj.length;i++){
            for(let obj in arrayobj[i]){
                var temp=obj+'='+arrayobj[i][obj]+'&';
                str+=temp;
                // console.log(temp)
            }
            str+=';'
        }
        // console.log(str)
        return str;
    }
    handlehtml() {

        var $ = cheerio.load(this.html, { decodeEntities: false });
        var arr = [];
        $('.infolist_tab').find('a').each(function (index, element) {
            var text = $(this).text();
            text = text.replace(/[\r\n]/g, "");
            text = text.replace(/\ +/g, "");
            if (text.length > 0) {
                arr.push(text)
            }
            // console.log(text)
        })
        var classnamestr = '';
        $('.none').find('tbody').each(function (index, element) {
            var text = $(this)
            var trlength = text.toArray().length;
            // console.log(index)

            text.find('tr').each(function (index, element) {
                var tr = $(this);
                if (index == trlength - 1) {
                    classnamestr += '/'
                }
                tr.find('td').each(function (index, element) {
                    var item = $(this).text();
                    // console.log(item)
                    item = item.replace(/[\r\n]/g, "");
                    item = item.replace(/[\ ]+/g, "");
                    
                    if (item.length > 2) {

                        item+=','
                        classnamestr += item
                    }
                })
            })
        })
        var arr2 = classnamestr.split('/');
        arr2.shift();
        var k = 0;
        var res = [];
        for (let i = 0; i < arr.length; i++) {
            var obj = {}
            if (i % 2 == 0) {
                var obj = {
                    classname: arr[i],
                    teacher: arr[i + 1],
                    classtime: arr2[k++]
                }
                res.push({ ...obj });
            }
        }
        var result=this.handleres(res)
        // console.log(result)
        return result;
    }
    handlemongoclasstime(str){
        var handleonce=str.split(';');
        handleonce.pop();
        var handleres=[];
        handleonce.map((item,index)=>{
            item.slice(item.length-1,item.length);
            item=querystring.parse(item);
            handleres.push({...item})
        })
        handleres.map((item,index)=>{
            // console.log(item)
            item.classtime.slice(item.length-1,item.length);
            item.classtime=item.classtime.split(',');
            item.classtime.pop();
        })
        return handleres;
    }
}
// 
exports.HandleClassTable = HandleClassTable;