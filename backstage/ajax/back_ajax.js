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

