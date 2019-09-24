var getClassBtn = document.getElementsByClassName('user-home-getclass')[0];
var checkcodeimg=document.getElementsByClassName('pull-checkcode-img')[0];
var submitPullBtn=document.getElementsByClassName('pull-submit-btn')[0];
var username=document.getElementById('user-home-username');

getClassBtn.addEventListener('click', function () {
    var promise = new Promise((resolve, reject) => {
        $(document).ready(function () {
            $.ajax({
                type: "get",
                url: "/pullClass",
                async: true,
                success: function (result) {
                    console.log(result)
                    if (result) {
                        console.log(result)
                        resolve(result)
                    }
                },
                error: function (error) {
                    alert(error.status + "" + error.statusText);
                }
            });
        });
    })
    promise.then((result)=>{
        if(result){
           return new Promise((resolve,reject)=>{
            setTimeout(function(){
                console.log(111)
                checkcodeimg.src='../checkcodeimg/name.jpg'
            },100);
           }) 
        }
    })
})

