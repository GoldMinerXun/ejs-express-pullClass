var logoutbtn = document.getElementsByClassName('back-stage-logout')[0];

logoutbtn.addEventListener('click', function () {
    $.ajax({
        type: "get",
        url: "/back/logout",
        success: function (response) {
            if (response) {
                location.href = '/back';
            }
        },
        error: function (err) {
            if (err) {
                console.log(err)
            }
        }
    });
})
var loading = function () {
    $('.back-stage-loading').css({
        display: 'flex'
    })
    $('.back-stage-wrap').css({
        filter: 'blur(2px)'
    });
}
var showmessage = function (result, message) {
    $('.back-stage-loading').css({
        display: 'none'
    })
    $('.back-stage-wrap').css({
        filter: 'blur(0px)'
    });
    if (result) {
        $('.tips-text').text(message + ' success').css({
            color: 'green',
            borderColor: 'green'
        })
        $('.tips').css({
            display: 'flex'
        })
        setTimeout(function () {
            $('.tips').css({
                display: 'none'
            })
        }, 3000);
        return true
    } else {
        $('.tips-text').text(message + ' success').css({
            color: 'red',
            borderColor: 'red'
        })
        $('.tips').text('mofidy fail').css({
            display: 'flex'
        })
        setTimeout(function () {
            $('.tips').css({
                display: 'none'
            })
        }, 3000);
        return true;
    }
}
var deletebtn = document.getElementsByClassName('delete');
// console.log(deletebtn.length)
var deleteajax = function (id) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            url: "/back/delete",
            data: { id: id },
            async: true,
            success: function (response) {
                console.log(response)
                resolve(response)
            },
            error: function (error) {
                // console.log(err)
                if (error) {
                    reject(error)
                }
            }
        });
    }).catch((e) => { })

}
for (let i = 0; i < deletebtn.length; i++) {
    deletebtn[i].addEventListener('click', function (e) {
        loading();

        var id = this.id;
        id = id.split('-')[1];
        deleteajax(id).then((response) => {
            return new Promise((resolve, reject) => {
                console.log(response)
                $('.back-stage-loading').css({
                    display: 'none'
                })
                $('.back-stage-wrap').css({
                    filter: 'blur(0px)'
                });
                var result = showmessage(response, 'delete');
                resolve(result)
            }).catch((e) => { })
        }).then((result) => {
            return new Promise((resolve, reject) => {
                console.log(111)
                location.href = '/back'
                location.reload();
            })

        })
    })
}

var modifyajax = function (_id, username, password) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            url: "/back/modify",
            data: {
                _id: _id,
                username: username,
                password: password
            },
            async: true,
            success: function (response) {
                console.log(response)
                resolve(response)
            },
            error: function (error) {
                // console.log(err)
                if (error) {
                    reject(error)
                }
            }
        })
    }).catch((e) => { })
}
$('.modify').click(function (e) {
    // 行号
    loading();
    var cur = $(this).parent().parent().parent().find('tr').index($(this).parent().parent());
    var username = $('table').find('tr').eq(cur + 1).find('td').eq(2).text();
    var password = $('table').find('tr').eq(cur + 1).find('td').eq(3).text();
    var _id = $('table').find('tr').eq(cur + 1).find('td').eq(1).text();
    modifyajax(_id, username, password).then((result) => {
        return new Promise((resolve, reject) => {
            var result1 = showmessage(result, 'modify');
            resolve(result1)
        })
    }).then((result) => {
        return new Promise((resolve, reject) => {
            console.log(111)
            location.href = '/back'
            location.reload();
        })
    })
})

var addnewuserajax = function (username, password) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "post",
            url: "/back/insert",
            data: { username: username, password: password },
            success: function (response) {
                if (response) {
                    resolve(true)
                } else {
                    resolve(false)
                }
            },
            error: function (error) {
                reject(error)
            }
        });
    })
}
$('.add-user-submit-btn').click(() => {
    var username = $('.add-new-user-username').val();
    var password = $('.add-new-user-password').val();
    loading();
    addnewuserajax(username, password).then((result) => {
        return new Promise((resolve, reject) => {
            var result1 = showmessage(result, 'create');
            resolve(result1)
        })
    }).then((result) => {
        return new Promise((resolve, reject) => {
            console.log(111)
            location.href = '/back'
            location.reload();
        })

    })
})
// var deleteallajax = function (selectedinfo) {
//     return new Promise((resolve,reject)=>{
//         $.ajax({
//             type:'get',
//             url:'/back/deleteselected',
//             data:{info:selectedinfo},
//             success:function(result){
//                 if(result){
//                     resolve(true)
//                 }else{
//                     resolve(false)
//                 }
     
//             },
//             error:function(){
//                 reject(err)
//             }
//         })
//     })
// }
// $('.selected-delete').click(() => {
//     loading();
//     var selectedinfo;
//     for(let i=0;i<$('.item-checked').length;i++){
//         if($('.item-checked').eq(i).prop('checked')){
//             var cur = $('.item-checked').eq(i).parent().parent().find('tr').index($(this).parent().parent());
//             var _id = $('table').find('tr').eq(cur + 1).find('td').eq(1).text();
//             var temp={
//                 _id:_id
//             }
//             selectedinfo.push({...temp});
//         }
//     }
//     deleteajax(selectedinfo).then((result)=>{
//         return new Promise((resolve,reject)=>{

//         })
//     })
// })