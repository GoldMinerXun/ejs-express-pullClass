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
        $('.back-stage-loading').css({
            display: 'flex'
        })
        $('.back-stage-wrap').css({
            filter: 'blur(1px)'
        });
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
                if (response) {
                    $('.tips-text').text('delete success').css({
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
                    resolve(true)
                } else {
                    $('.tips').text('delete fail').css({
                        display: 'flex'
                    })
                    setTimeout(function () {
                        $('.tips').css({
                            display: 'none'
                        })
                    }, 3000);
                }
            }).catch((e) => { })

        });
    })
}

var modifyajax = function (_id,username, password) {
    return new Promise((resolve, reject) => {
        $.ajax({
            type: "get",
            url: "/back/modify",
            data: {
                _id:_id,
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
    var cur = $(this).parent().parent().parent().find('tr').index($(this).parent().parent());
    var username = $('table').find('tr').eq(cur + 1).find('td').eq(2).text();
    var password = $('table').find('tr').eq(cur + 1).find('td').eq(3).text();
    var _id=$('table').find('tr').eq(cur + 1).find('td').eq(1).text();
    $('.back-stage-loading').css({
        display: 'none'
    })
    $('.back-stage-wrap').css({
        filter: 'blur(0px)'
    });
    modifyajax(_id,username, password).then((result) => {
        return new Promise((resolve, reject) => {
            if (result) {
                $('.tips-text').text('modify success').css({
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
                resolve(true)
            }else{
                $('.tips-text').text('modify success').css({
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
            }
        })

    })
})