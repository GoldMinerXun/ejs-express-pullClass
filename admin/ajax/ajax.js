var getClassBtn = document.getElementsByClassName('user-home-getclass')[0];
var checkcodeimg = document.getElementsByClassName('pull-checkcode-img')[0];
var submitPullBtn = document.getElementsByClassName('pull-submit-btn')[0];
var username = document.getElementById('user-home-username');
var logoutbtn = document.getElementsByClassName('user-home-logout')[0];
var img=document.getElementsByClassName('pull-checkcode-img')[0];

img.addEventListener('click',function(){
    console.log('img-click')
    $.ajax({
        type:'get',
        url:'/pullClass',
        async:true,
        success:function(result){
            if(result){
                console.log('img-ok')
                checkcodeimg.src = '../checkcodeimg/name.jpg'
            }
        },
        error:function(error){
            alert(error.status + "" + error.statusText);
        }
    })
})
logoutbtn.addEventListener('click', function () {
    $.ajax({
        type: 'get',
        url: '/logout',
        async: true,
        success: function (result) {
            if (result) {
                console.log(result)
            }
        },
        error: function (error) {
            alert(error.status + "" + error.statusText);
        }
    })
})
getClassBtn.addEventListener('click', function () {
    var promise = new Promise((resolve, reject) => {
        $(document).ready(function () {
            $.ajax({
                type: "get",
                url: "/pullClass",
                async: true,
                success: function (result) {
                    // console.log(result)
                    if (result) {
                        // console.log(result)
                        resolve(result)
                    }
                },
                error: function (error) {
                    alert(error.status + "" + error.statusText);
                }
            });
        });
    })
    promise.then((result) => {
        if (result) {
            return new Promise((resolve, reject) => {
                setTimeout(function () {
                    // console.log(111)
                    checkcodeimg.src = '../checkcodeimg/name.jpg'
                }, 100);
            })
        }
    })
})

