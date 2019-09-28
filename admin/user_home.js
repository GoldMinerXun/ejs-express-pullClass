<<<<<<< HEAD
var global_now_item;
var addClassModal = document.getElementsByClassName('user-home-modal')[0];
var addClasswrap = document.getElementsByClassName('user-home-input-wrap')[0]
var closeModalBtn = document.getElementsByClassName('modal-close-btn')[0];
var pullClassBtn = document.getElementsByClassName('user-home-getclass')[0];
var closePullClassBtn = document.getElementsByClassName('pull-close-btn')[0];
var pullMask = document.getElementsByClassName('pull-mask')[0];
var class_item = document.getElementsByClassName('class-item');
var okBtn = document.getElementsByClassName('add-class-ok-btn')[0];
var cancleBtn=document.getElementsByClassName('cancel-btn')[0];


cancleBtn.addEventListener('click',function(){
    addClasswrap.style.display = 'none';
    addClassModal.classList.remove('modal-active'); 
})
var cleanalltable=function(){
    for(let i=0;i<class_item.length;i++){
        class_item[i].innerHTML=''
        class_item[i].style.backgroundColor='white';
    }
}
var renderaddclasses = function () {
    if (localStorage.getItem('addclass')) {
        var addclass = JSON.parse(localStorage.getItem('addclass'));
        for(let i=0;i<addclass.length;i++){
            // console.log(addclass[i])
            var idname = '#item-' + addclass[i].classtime[0] + '-' + addclass[i].classtime[1];
            // console.log(idname)
            // console.log($(idname).html())
            if ($(idname).html().length==0) {
                var html = `<span class="classname classcontent">` + addclass[i].classname + `</span>
                <span class="place classcontent">`+ addclass[i].classplace + `</span>
                <span class="classtime classcontent">`+ addclass[i].classweek + `</span>`
                $(idname).css('background-color', '#46cdcf')
                $(idname).html(html);
            }
        }
    }

}
var renderexistclasses = function () {
    if (localStorage.getItem('classtime')) {
        var classtimes = JSON.parse(localStorage.getItem('classtime'));
        var restemp = handlepullclass(classtimes)
        var res = handleclasstime(restemp);
        for(let i=0;i<res.length;i++){
            if(res[i].classtime[1]!=undefined&&res[i].classtime[2]!=undefined){
                var idname = '#item-' + res[i].classtime[1] + '-' + res[i].classtime[2];
                if ($(idname).html().length==0) {
                    // console.log(res[i])
                    var html = `<span class="classname classcontent">` + res[i].classname + `</span>
                    <span class="place classcontent">`+( res[i].place==undefined?``:res[i].place )+ `</span>
                    <span class="classtime classcontent">`+ handleweektostring(res[i].classtime[0])+ `</span>`
                    $(idname).css('background-color', '#3f72af');
                    $(idname).html(html);
                }
            }
           
        }
    }
}
var renderalltable = function () {
    cleanalltable();
    renderexistclasses();
    renderaddclasses();
   
}

var inittableaddclass = function () {
    var res = handleaddclass();
    // console.log(res)
    if (res) {
        renderaddclass(res);
    }
}

var getNowTimeActive = function () {
    var date = new Date();
    var now = date.getDay();
    var nowday = document.getElementsByClassName('row-day')[(now + 6) % 7];
    // console.log(nowday)


    // 自动识别课表时间
    nowday.classList.add('row-day-active')
    var hour = date.getHours();
    var minute = date.getMinutes();
    // console.log(hour,minute)
    var nowtime = hour * 60 + minute;
    // console.log(nowtime)
    // nowtime = 9 * 60 + 35;
    if (nowtime >= 8 * 60 + 10 && nowtime <= 9 * 60 + 55) {
        var nowtimediv = document.getElementsByClassName('class-one')[0];
        nowtimediv.classList.add('class-active');
    } else if (nowtime > 9 * 60 + 55 && nowtime <= 11 * 60 + 40) {
        var nowtimediv = document.getElementsByClassName('class-two')[0];
        nowtimediv.classList.add('class-active');
    } else if (nowtime > 13 * 60 && nowtime <= 15 * 60 + 5) {
        var nowtimediv = document.getElementsByClassName('class-three')[0];
        nowtimediv.classList.add('class-active');
    } else if (nowtime > 15 * 60 + 5 && nowtime <= 17 * 60) {
        var nowtimediv = document.getElementsByClassName('class-four')[0];
        nowtimediv.classList.add('class-active');
    } else if (nowtime >= 18 * 60 && nowtime <= 19 * 60 + 35) {
        var nowtimediv = document.getElementsByClassName('class-five')[0];
        // console.log(222)
        nowtimediv.classList.add('class-active');
    }
}
getNowTimeActive();

setInterval(function () {
    getNowTimeActive()
}, 1000 * 60)

closeModalBtn.addEventListener('click', function () {
    setTimeout(function () {
        addClasswrap.style.display = 'none';
        addClassModal.classList.remove('modal-active');     
    }, 1)
    renderalltable();
})

for (let i = 0; i < class_item.length; i++) {
    let nowindex = i;
    let row = parseInt(nowindex / 5);
    let colume = parseInt(nowindex % 5);
    let idname = 'item-' + row + '-' + colume;
    class_item[i].setAttribute('id', idname)
    class_item[i].addEventListener('click', function (e) {
        var itemid = this.id.split('-');
        itemid.shift();
        itemid.map((value, index) => {
            itemid[index] = parseInt(value)
        })
        global_now_item = itemid;
        if (this.innerHTML.length == 0) {
            setTimeout(function () {
                addClasswrap.style.display = 'flex';
                addClassModal.classList.add('modal-active');
            }, 1)
        } else {
            var pullMaskClass = document.getElementsByClassName('pull-mask-classes')[0];
            pullMaskClass.style.display = 'flex';
            var htmlstr = renderpullmask(global_now_item);
            renderpullclasswrap(htmlstr)
        }
      
    })
}



pullClassBtn.addEventListener('click', function () {
    pullMask.style.display = 'flex'
})

closePullClassBtn.addEventListener('click', function () {
    // pullMask.style.zIndex='-10';
    pullMask.style.display = 'none';
})

// 传入一个课程对象
// 处理课程时间，课程时间由四个元素构成["3-17周", "星期一", "第一大节", "西-新C104"];
// 或者由一个元素构成["1-2周"],或者是四的倍数的元素构成
// 返回拆分后的时间对应的课程对象
var handleclassobj = function (classobj) {
    let res = classobj.classtime.length;
    var classarr = [];
    var temp = {
        teacher: null,
        classname: null,
        classtime: [0, 0]
    };
    if (res == 1) {
        temp.teacher = classobj.teacher;
        temp.classname = classobj.classname;
        temp.classtime = classobj.classtime;
        classarr.push({ ...temp })
        return classarr;
    }
    if (res % 4 == 0) {
        for (let i = 0; i < res / 4; i++) {
            temp.teacher = classobj.teacher;
            temp.classname = classobj.classname;
            temp.classtime = classobj.classtime.splice(0, 4);
            classarr.push({ ...temp })
        }
        return classarr;
    }
}
// 传入一个数组，数组里面是对象，对象里面包含上课的老师，科目名称，时间。
// 处理上课时间，并返回每一时间对应的课程名称和老师。

var handlepullclass = function (classinfo) {
    var res = [];
    for (let i = 0; i < classinfo.length; i++) {
        var temp = handleclassobj(classinfo[i]);
        res = res.concat(temp);
    }
    return res;
}
// 处理周数
var handleweek = function (weektime) {
    var res = [];
    if (weektime.includes('单')) {
        var temp = weektime.split('-');
        for (let i = 0; i < temp.length; i++) {
            res.push(parseInt(temp[i]));
        }
        res.push(1);
    } else if (weektime.includes('双')) {
        var temp = weektime.split('-');
        for (let i = 0; i < temp.length; i++) {
            res.push(parseInt(temp[i]));
        }
        res.push(2);
    } else {
        var temp = weektime.split('-');
        for (let i = 0; i < temp.length; i++) {
            res.push(parseInt(temp[i]));
        }
        res.push(0);
    }
    return res;
}
// 处理具体时间
var handletime = function (classtime) {
    switch (classtime) {
        case '星期一':
            return 0;
        case '星期二':
            return 1;
        case '星期三':
            return 2;
        case '星期四':
            return 3;
        case '星期五':
            return 4;
        case '星期六':
            return 5;
        default:
            break;
    }
}
// 处理第几节课
var handlesequence = function (classtime) {
    switch (classtime) {
        case '第一大节':
            return 0;
        case '第二大节':
            return 1;
        case '第三大节':
            return 2;
        case '第四大节':
            return 3;
        case '第五大节':
            return 4;
        default:
            break;
    }
}
// classtime=[[1,2,0],0,0];
// [1,2,0] 12表示1-2周，0表示非单双周，第三个可选值为0，1，2；1表示单周，2表示双周；
// classtime[1]，classtime[2]表示星期一，第一大节;
var replacetime = function (classobj) {
    var classtime = [];
    if (classobj.classtime.length == 1) {
        var tempweek = handleweek(classobj.classtime[0]);
        classtime.push(tempweek);
        classobj.classtime = classtime;

    } else if (classobj.classtime.length > 1) {
        var tempweek = handleweek(classobj.classtime[0]);
        classtime.push(tempweek);
        var temptime = handletime(classobj.classtime[1]);
        classtime.push(temptime);
        var tempseq = handlesequence(classobj.classtime[2]);
        classtime.push(tempseq);
        classobj.place = classobj.classtime[3];
        var newarr = classobj.place.split('）');
        if (newarr.length > 1) {
            classobj.place = classobj.place.slice(0, classobj.place.length - 1);
        }
        classobj.classtime = classtime;

    }
    return classobj;
}
// 传入数组对象
// 处理数组里面每一个对象元素的上课时间
// 返回新数组，其中时间对应的下标 例：星期一 第一大节 [0,0];
var handleclasstime = function (classarr) {
    for (let i = 0; i < classarr.length; i++) {
        classarr[i] = replacetime(classarr[i]);
    }
    return classarr;
}

//解析周数
var handleweektostring = function (arr) {
    var str = '';
    str = arr[0] + '-' + arr[1];
    if (arr[2] == 0) {
        str += '周';
    } else if (arr[2] == 1) {
        str += '单周'
    } else if (arr[2] == 2) {
        str += '双周'
    }

    return str;
}
// 渲染课表
var rendertable = function (res) {
    for (let i = 0; i < res.length; i++) {
        if (res[i].classtime.length > 1) {
            var columetitlenum = res[i].classtime[1];
            var classitemnum = res[i].classtime[2];
            var idname = '#item-' + columetitlenum + '-' + classitemnum;
            var html = `<span class="classname classcontent">` + res[i].classname + `</span>
                <span class="place classcontent">`+ res[i].place + `</span>
                <span class="classtime classcontent">`+ handleweektostring(res[i].classtime[0]) + `</span>`
            $(idname).css('background-color', '#3f72af')
            $(idname).html(html);
        }
    }
}

// 添加课表内容

okBtn.addEventListener('click', function () {
    var classname = document.getElementsByClassName('user-home-input-classname')[0];
    var classplace = document.getElementsByClassName('user-home-input-classplace')[0];
    var classweek = document.getElementsByClassName('user-home-input-classtime')[0];
    if (classplace.value && classname.value && classweek.value) {
        var obj = {
            classname: classname.value,
            classplace: classplace.value,
            classweek: classweek.value
        }
        addclass(obj)
        var htmlstr = renderpullmask(global_now_item)
        renderpullclasswrap(htmlstr)
        console.log(localStorage)
        renderalltable();
        classplace.value='';
        classname.value='';
        classweek.value='';
    } else {
        var errorMessageWrap = document.getElementsByClassName('error-message-wrap')[0];
        var errorContent = document.getElementsByClassName('error-content')[0];
        errorContent.innerText = '请输入完整';
        errorMessageWrap.style.display = 'flex';
        setTimeout(function () {
            errorMessageWrap.style.display = 'none';
        }, 3000)
    }
})
var renderaddclass = function (res) {
    for (let i = 0; i < res.length; i++) {
        var columetitlenum = res[i].classtime[0];
        var classitemnum = res[i].classtime[1];
        var idname = '#item-' + columetitlenum + '-' + classitemnum;
        var html = `<span class="classname classcontent">` + res[i].classname + `</span>
                <span class="place classcontent">`+ res[i].classplace + `</span>
                <span class="classtime classcontent">`+ res[i].classweek + `</span>`
        $(idname).css('background-color', '#46cdcf')
        $(idname).html(html);
    }
}
var handleaddclass = function () {
    var addclassarr = JSON.parse(localStorage.getItem('addclass'));
    var res = addclassarr;
    return res;
}
var addclass = function (obj) {
    obj.classtime = global_now_item;
    var resobj = { ...obj };
    var addclassarr = [];
    addclassarr.push(resobj)
    var lastaddclassarr = [];
    if (localStorage.getItem('addclass')) {
        lastaddclassarr = JSON.parse(localStorage.getItem('addclass'))
        lastaddclassarr.push(resobj);
        localStorage.setItem('addclass', JSON.stringify(lastaddclassarr))
    } else {
        localStorage.setItem('addclass', JSON.stringify(addclassarr))
    }
}

inittableaddclass();
var renderpullmask = function (arr) {
    var html1 = '';
    var html2 = '';
    if (localStorage.getItem('classtime')) {
        var classtimes = JSON.parse(localStorage.getItem('classtime'));
        var restemp = handlepullclass(classtimes)
        var res = handleclasstime(restemp);

        for (let i = 0; i < res.length; i++) {
            // console.log(res[i].classtime[1],res[i].classtime[2])
            if (res[i].classtime[1] == arr[0] && res[i].classtime[2] == arr[1]) {
                var itemstr1 = `<div class="classes-item">
                <span class="remove-class-item" id="classtimes-`+ i + `">—</span>
                <span>`+ res[i].classname + `</span>
                <span>`+ res[i].teacher + `</span>
                <span>`+ handleweektostring(res[i].classtime[0]) + `</span>
                <span>`+ res[i].place + `</span>
            </div>`
                html1 += itemstr1;
            }
        }

    }
    if (localStorage.getItem('addclass')) {

        var addclass = JSON.parse(localStorage.getItem('addclass'));
        for (let i = 0; i < addclass.length; i++) {
            if (addclass[i].classtime[0] == arr[0] && addclass[i].classtime[1] == arr[1]) {
                var itemstr2 = `<div class="classes-item" id="addclass-item-` + i + `">
                <span class="remove-class-item" id="addclass-`+ i + `">—</span>
                <span>`+ addclass[i].classname + `</span>
                <span>`+ addclass[i].classweek + `</span>
                <span>`+ addclass[i].classplace + `</span>
            </div>`
                html2 += itemstr2;
            }
        }
        // console.log(html2)
    }
    var html = html1 + html2;
    return html;


}

var renderpullclasswrap = function (htmlstr) {
    var classesWrap = document.getElementsByClassName('classes-wrap')[0];
    var addmodalbtn = `
    <div class="classes-item" id='addclass-item-btn'>
        +
        </div>
    `
    htmlstr += addmodalbtn
    classesWrap.innerHTML = htmlstr;
    var pullmaskaddmodalbtn = document.getElementById('addclass-item-btn');
    pullmaskaddmodalbtn.addEventListener('click', function () {
        // console.log(111)
        setTimeout(function () {
            addClasswrap.style.display = 'flex';
            addClasswrap.style.zIndex = '10000'
            addClassModal.classList.add('modal-active');
        }, 1)
    })
    var closeaddmodalbtn = document.getElementsByClassName('classes-close-btn')[0];
    closeaddmodalbtn.addEventListener('click', function () {
        var pullMaskClass = document.getElementsByClassName('pull-mask-classes')[0];
        pullMaskClass.style.display = 'none';
        renderalltable(); 
    })
    addeventlistenerOnRemoveBtn();
}
var removeClassItem = function (arr) {
    var index = arr[1];
    var name = arr[0];
    // console.log(index, name);
    if (name == 'classtimes') {
        var classtime = JSON.parse(localStorage.getItem('classtime'));
        classtime.splice(index, 1);
        classtime = JSON.stringify(classtime);
        localStorage.setItem('classtime', classtime);

    } else if (name == 'addclass') {
        var addclass = JSON.parse(localStorage.getItem('addclass'));
        addclass.splice(index, 1);
        // console.log(addclass)
        addclass = JSON.stringify(addclass)
        localStorage.setItem('addclass', addclass);
    }

}
var addeventlistenerOnRemoveBtn = function () {
    var remove_class_item_btn = document.getElementsByClassName('remove-class-item');
    for (let i = 0; i < remove_class_item_btn.length; i++) {
        remove_class_item_btn[i].addEventListener('click', function () {
            // console.log(this.id)
            var itemid = this.id;
            var itemid = itemid.split('-');
            removeClassItem(itemid)
            var html = renderpullmask(global_now_item);
            renderpullclasswrap(html);
            renderalltable();
        })
    }
}


=======
var global_now_item;
var addClassModal = document.getElementsByClassName('user-home-modal')[0];
var addClasswrap = document.getElementsByClassName('user-home-input-wrap')[0]
var closeModalBtn = document.getElementsByClassName('modal-close-btn')[0];
var pullClassBtn = document.getElementsByClassName('user-home-getclass')[0];
var closePullClassBtn = document.getElementsByClassName('pull-close-btn')[0];
var pullMask = document.getElementsByClassName('pull-mask')[0];
var class_item = document.getElementsByClassName('class-item');
var okBtn = document.getElementsByClassName('add-class-ok-btn')[0];
var cancleBtn=document.getElementsByClassName('cancel-btn')[0];


cancleBtn.addEventListener('click',function(){
    addClasswrap.style.display = 'none';
    addClassModal.classList.remove('modal-active'); 
})
var cleanalltable=function(){
    for(let i=0;i<class_item.length;i++){
        class_item[i].innerHTML=''
        class_item[i].style.backgroundColor='white';
    }
}
var renderaddclasses = function () {
    if (localStorage.getItem('addclass')) {
        var addclass = JSON.parse(localStorage.getItem('addclass'));
        for(let i=0;i<addclass.length;i++){
            // console.log(addclass[i])
            var idname = '#item-' + addclass[i].classtime[0] + '-' + addclass[i].classtime[1];
            // console.log(idname)
            // console.log($(idname).html())
            if ($(idname).html().length==0) {
                var html = `<span class="classname classcontent">` + addclass[i].classname + `</span>
                <span class="place classcontent">`+ addclass[i].classplace + `</span>
                <span class="classtime classcontent">`+ addclass[i].classweek + `</span>`
                $(idname).css('background-color', '#46cdcf')
                $(idname).html(html);
            }
        }
    }

}
var renderexistclasses = function () {
    if (localStorage.getItem('classtime')) {
        var classtimes = JSON.parse(localStorage.getItem('classtime'));
        var restemp = handlepullclass(classtimes)
        var res = handleclasstime(restemp);
        for(let i=0;i<res.length;i++){
            if(res[i].classtime[1]!=undefined&&res[i].classtime[2]!=undefined){
                var idname = '#item-' + res[i].classtime[1] + '-' + res[i].classtime[2];
                if ($(idname).html().length==0) {
                    // console.log(res[i])
                    var html = `<span class="classname classcontent">` + res[i].classname + `</span>
                    <span class="place classcontent">`+( res[i].place==undefined?``:res[i].place )+ `</span>
                    <span class="classtime classcontent">`+ handleweektostring(res[i].classtime[0])+ `</span>`
                    $(idname).css('background-color', '#3f72af');
                    $(idname).html(html);
                }
            }
           
        }
    }
}
var renderalltable = function () {
    cleanalltable();
    renderexistclasses();
    renderaddclasses();
   
}

var inittableaddclass = function () {
    var res = handleaddclass();
    // console.log(res)
    if (res) {
        renderaddclass(res);
    }
}

var getNowTimeActive = function () {
    var date = new Date();
    var now = date.getDay();
    var nowday = document.getElementsByClassName('row-day')[(now + 6) % 7];
    // console.log(nowday)


    // 自动识别课表时间
    nowday.classList.add('row-day-active')
    var hour = date.getHours();
    var minute = date.getMinutes();
    // console.log(hour,minute)
    var nowtime = hour * 60 + minute;
    // console.log(nowtime)
    // nowtime = 9 * 60 + 35;
    if (nowtime >= 8 * 60 + 10 && nowtime <= 9 * 60 + 55) {
        var nowtimediv = document.getElementsByClassName('class-one')[0];
        nowtimediv.classList.add('class-active');
    } else if (nowtime > 9 * 60 + 55 && nowtime <= 11 * 60 + 40) {
        var nowtimediv = document.getElementsByClassName('class-two')[0];
        nowtimediv.classList.add('class-active');
    } else if (nowtime > 13 * 60 && nowtime <= 15 * 60 + 5) {
        var nowtimediv = document.getElementsByClassName('class-three')[0];
        nowtimediv.classList.add('class-active');
    } else if (nowtime > 15 * 60 + 5 && nowtime <= 17 * 60) {
        var nowtimediv = document.getElementsByClassName('class-four')[0];
        nowtimediv.classList.add('class-active');
    } else if (nowtime >= 18 * 60 && nowtime <= 19 * 60 + 35) {
        var nowtimediv = document.getElementsByClassName('class-five')[0];
        // console.log(222)
        nowtimediv.classList.add('class-active');
    }
}
getNowTimeActive();

setInterval(function () {
    getNowTimeActive()
}, 1000 * 60)

closeModalBtn.addEventListener('click', function () {
    setTimeout(function () {
        addClasswrap.style.display = 'none';
        addClassModal.classList.remove('modal-active');     
    }, 1)
    renderalltable();
})

for (let i = 0; i < class_item.length; i++) {
    let nowindex = i;
    let row = parseInt(nowindex / 5);
    let colume = parseInt(nowindex % 5);
    let idname = 'item-' + row + '-' + colume;
    class_item[i].setAttribute('id', idname)
    class_item[i].addEventListener('click', function (e) {
        var itemid = this.id.split('-');
        itemid.shift();
        itemid.map((value, index) => {
            itemid[index] = parseInt(value)
        })
        global_now_item = itemid;
        if (this.innerHTML.length == 0) {
            setTimeout(function () {
                addClasswrap.style.display = 'flex';
                addClassModal.classList.add('modal-active');
            }, 1)
        } else {
            var pullMaskClass = document.getElementsByClassName('pull-mask-classes')[0];
            pullMaskClass.style.display = 'flex';
            var htmlstr = renderpullmask(global_now_item);
            renderpullclasswrap(htmlstr)
        }
      
    })
}



pullClassBtn.addEventListener('click', function () {
    pullMask.style.display = 'flex'
})

closePullClassBtn.addEventListener('click', function () {
    // pullMask.style.zIndex='-10';
    pullMask.style.display = 'none';
})

// 传入一个课程对象
// 处理课程时间，课程时间由四个元素构成["3-17周", "星期一", "第一大节", "西-新C104"];
// 或者由一个元素构成["1-2周"],或者是四的倍数的元素构成
// 返回拆分后的时间对应的课程对象
var handleclassobj = function (classobj) {
    let res = classobj.classtime.length;
    var classarr = [];
    var temp = {
        teacher: null,
        classname: null,
        classtime: [0, 0]
    };
    if (res == 1) {
        temp.teacher = classobj.teacher;
        temp.classname = classobj.classname;
        temp.classtime = classobj.classtime;
        classarr.push({ ...temp })
        return classarr;
    }
    if (res % 4 == 0) {
        for (let i = 0; i < res / 4; i++) {
            temp.teacher = classobj.teacher;
            temp.classname = classobj.classname;
            temp.classtime = classobj.classtime.splice(0, 4);
            classarr.push({ ...temp })
        }
        return classarr;
    }
}
// 传入一个数组，数组里面是对象，对象里面包含上课的老师，科目名称，时间。
// 处理上课时间，并返回每一时间对应的课程名称和老师。

var handlepullclass = function (classinfo) {
    var res = [];
    for (let i = 0; i < classinfo.length; i++) {
        var temp = handleclassobj(classinfo[i]);
        res = res.concat(temp);
    }
    return res;
}
// 处理周数
var handleweek = function (weektime) {
    var res = [];
    if (weektime.includes('单')) {
        var temp = weektime.split('-');
        for (let i = 0; i < temp.length; i++) {
            res.push(parseInt(temp[i]));
        }
        res.push(1);
    } else if (weektime.includes('双')) {
        var temp = weektime.split('-');
        for (let i = 0; i < temp.length; i++) {
            res.push(parseInt(temp[i]));
        }
        res.push(2);
    } else {
        var temp = weektime.split('-');
        for (let i = 0; i < temp.length; i++) {
            res.push(parseInt(temp[i]));
        }
        res.push(0);
    }
    return res;
}
// 处理具体时间
var handletime = function (classtime) {
    switch (classtime) {
        case '星期一':
            return 0;
        case '星期二':
            return 1;
        case '星期三':
            return 2;
        case '星期四':
            return 3;
        case '星期五':
            return 4;
        case '星期六':
            return 5;
        default:
            break;
    }
}
// 处理第几节课
var handlesequence = function (classtime) {
    switch (classtime) {
        case '第一大节':
            return 0;
        case '第二大节':
            return 1;
        case '第三大节':
            return 2;
        case '第四大节':
            return 3;
        case '第五大节':
            return 4;
        default:
            break;
    }
}
// classtime=[[1,2,0],0,0];
// [1,2,0] 12表示1-2周，0表示非单双周，第三个可选值为0，1，2；1表示单周，2表示双周；
// classtime[1]，classtime[2]表示星期一，第一大节;
var replacetime = function (classobj) {
    var classtime = [];
    if (classobj.classtime.length == 1) {
        var tempweek = handleweek(classobj.classtime[0]);
        classtime.push(tempweek);
        classobj.classtime = classtime;

    } else if (classobj.classtime.length > 1) {
        var tempweek = handleweek(classobj.classtime[0]);
        classtime.push(tempweek);
        var temptime = handletime(classobj.classtime[1]);
        classtime.push(temptime);
        var tempseq = handlesequence(classobj.classtime[2]);
        classtime.push(tempseq);
        classobj.place = classobj.classtime[3];
        var newarr = classobj.place.split('）');
        if (newarr.length > 1) {
            classobj.place = classobj.place.slice(0, classobj.place.length - 1);
        }
        classobj.classtime = classtime;

    }
    return classobj;
}
// 传入数组对象
// 处理数组里面每一个对象元素的上课时间
// 返回新数组，其中时间对应的下标 例：星期一 第一大节 [0,0];
var handleclasstime = function (classarr) {
    for (let i = 0; i < classarr.length; i++) {
        classarr[i] = replacetime(classarr[i]);
    }
    return classarr;
}

//解析周数
var handleweektostring = function (arr) {
    var str = '';
    str = arr[0] + '-' + arr[1];
    if (arr[2] == 0) {
        str += '周';
    } else if (arr[2] == 1) {
        str += '单周'
    } else if (arr[2] == 2) {
        str += '双周'
    }

    return str;
}
// 渲染课表
var rendertable = function (res) {
    for (let i = 0; i < res.length; i++) {
        if (res[i].classtime.length > 1) {
            var columetitlenum = res[i].classtime[1];
            var classitemnum = res[i].classtime[2];
            var idname = '#item-' + columetitlenum + '-' + classitemnum;
            var html = `<span class="classname classcontent">` + res[i].classname + `</span>
                <span class="place classcontent">`+ res[i].place + `</span>
                <span class="classtime classcontent">`+ handleweektostring(res[i].classtime[0]) + `</span>`
            $(idname).css('background-color', '#3f72af')
            $(idname).html(html);
        }
    }
}

// 添加课表内容

okBtn.addEventListener('click', function () {
    var classname = document.getElementsByClassName('user-home-input-classname')[0];
    var classplace = document.getElementsByClassName('user-home-input-classplace')[0];
    var classweek = document.getElementsByClassName('user-home-input-classtime')[0];
    if (classplace.value && classname.value && classweek.value) {
        var obj = {
            classname: classname.value,
            classplace: classplace.value,
            classweek: classweek.value
        }
        addclass(obj)
        var htmlstr = renderpullmask(global_now_item)
        renderpullclasswrap(htmlstr)
        console.log(localStorage)
        renderalltable();
        classplace.value='';
        classname.value='';
        classweek.value='';
    } else {
        var errorMessageWrap = document.getElementsByClassName('error-message-wrap')[0];
        var errorContent = document.getElementsByClassName('error-content')[0];
        errorContent.innerText = '请输入完整';
        errorMessageWrap.style.display = 'flex';
        setTimeout(function () {
            errorMessageWrap.style.display = 'none';
        }, 3000)
    }
})
var renderaddclass = function (res) {
    for (let i = 0; i < res.length; i++) {
        var columetitlenum = res[i].classtime[0];
        var classitemnum = res[i].classtime[1];
        var idname = '#item-' + columetitlenum + '-' + classitemnum;
        var html = `<span class="classname classcontent">` + res[i].classname + `</span>
                <span class="place classcontent">`+ res[i].classplace + `</span>
                <span class="classtime classcontent">`+ res[i].classweek + `</span>`
        $(idname).css('background-color', '#46cdcf')
        $(idname).html(html);
    }
}
var handleaddclass = function () {
    var addclassarr = JSON.parse(localStorage.getItem('addclass'));
    var res = addclassarr;
    return res;
}
var addclass = function (obj) {
    obj.classtime = global_now_item;
    var resobj = { ...obj };
    var addclassarr = [];
    addclassarr.push(resobj)
    var lastaddclassarr = [];
    if (localStorage.getItem('addclass')) {
        lastaddclassarr = JSON.parse(localStorage.getItem('addclass'))
        lastaddclassarr.push(resobj);
        localStorage.setItem('addclass', JSON.stringify(lastaddclassarr))
    } else {
        localStorage.setItem('addclass', JSON.stringify(addclassarr))
    }
}

inittableaddclass();
var renderpullmask = function (arr) {
    var html1 = '';
    var html2 = '';
    if (localStorage.getItem('classtime')) {
        var classtimes = JSON.parse(localStorage.getItem('classtime'));
        var restemp = handlepullclass(classtimes)
        var res = handleclasstime(restemp);

        for (let i = 0; i < res.length; i++) {
            // console.log(res[i].classtime[1],res[i].classtime[2])
            if (res[i].classtime[1] == arr[0] && res[i].classtime[2] == arr[1]) {
                var itemstr1 = `<div class="classes-item">
                <span class="remove-class-item" id="classtimes-`+ i + `">—</span>
                <span>`+ res[i].classname + `</span>
                <span>`+ res[i].teacher + `</span>
                <span>`+ handleweektostring(res[i].classtime[0]) + `</span>
                <span>`+ res[i].place + `</span>
            </div>`
                html1 += itemstr1;
            }
        }

    }
    if (localStorage.getItem('addclass')) {

        var addclass = JSON.parse(localStorage.getItem('addclass'));
        for (let i = 0; i < addclass.length; i++) {
            if (addclass[i].classtime[0] == arr[0] && addclass[i].classtime[1] == arr[1]) {
                var itemstr2 = `<div class="classes-item" id="addclass-item-` + i + `">
                <span class="remove-class-item" id="addclass-`+ i + `">—</span>
                <span>`+ addclass[i].classname + `</span>
                <span>`+ addclass[i].classweek + `</span>
                <span>`+ addclass[i].classplace + `</span>
            </div>`
                html2 += itemstr2;
            }
        }
        // console.log(html2)
    }
    var html = html1 + html2;
    return html;


}

var renderpullclasswrap = function (htmlstr) {
    var classesWrap = document.getElementsByClassName('classes-wrap')[0];
    var addmodalbtn = `
    <div class="classes-item" id='addclass-item-btn'>
        +
        </div>
    `
    htmlstr += addmodalbtn
    classesWrap.innerHTML = htmlstr;
    var pullmaskaddmodalbtn = document.getElementById('addclass-item-btn');
    pullmaskaddmodalbtn.addEventListener('click', function () {
        // console.log(111)
        setTimeout(function () {
            addClasswrap.style.display = 'flex';
            addClasswrap.style.zIndex = '10000'
            addClassModal.classList.add('modal-active');
        }, 1)
    })
    var closeaddmodalbtn = document.getElementsByClassName('classes-close-btn')[0];
    closeaddmodalbtn.addEventListener('click', function () {
        var pullMaskClass = document.getElementsByClassName('pull-mask-classes')[0];
        pullMaskClass.style.display = 'none';
        renderalltable(); 
    })
    addeventlistenerOnRemoveBtn();
}
var removeClassItem = function (arr) {
    var index = arr[1];
    var name = arr[0];
    // console.log(index, name);
    if (name == 'classtimes') {
        var classtime = JSON.parse(localStorage.getItem('classtime'));
        classtime.splice(index, 1);
        classtime = JSON.stringify(classtime);
        localStorage.setItem('classtime', classtime);

    } else if (name == 'addclass') {
        var addclass = JSON.parse(localStorage.getItem('addclass'));
        addclass.splice(index, 1);
        // console.log(addclass)
        addclass = JSON.stringify(addclass)
        localStorage.setItem('addclass', addclass);
    }

}
var addeventlistenerOnRemoveBtn = function () {
    var remove_class_item_btn = document.getElementsByClassName('remove-class-item');
    for (let i = 0; i < remove_class_item_btn.length; i++) {
        remove_class_item_btn[i].addEventListener('click', function () {
            // console.log(this.id)
            var itemid = this.id;
            var itemid = itemid.split('-');
            removeClassItem(itemid)
            var html = renderpullmask(global_now_item);
            renderpullclasswrap(html);
            renderalltable();
        })
    }
}


>>>>>>> 0b0c8f7a921ef6c9dd2b2133a1b1a470b4453ce0
