<<<<<<< HEAD
var nameInput = document.getElementsByClassName('name-input')[0];
var registerBtn = document.getElementsByClassName('login')[0];
var ajaxRequestMongo = function (name) {
    console.log(name)
    if (name != '') {
        $(document).ready(function () {
            $.ajax({
                type: "get",
                url: "/isNameExist?username=" + name,
                async: true,
                success: function (result) {
                    if (result) {
                        resolve(result)
                    }
                },
                error: function (error) {
                    alert(error.status + "" + error.statusText);
                }
            });
        });
    }

}


nameInput.addEventListener('blur', function () {
    var promise = new Promise((resolve, reject) => {
        var username = nameInput.value;
        resolve(username)
    })
    promise.then((username) => {
        return new Promise((resolve, reject) => {
            if (username != '') {
                // console.log(username)
                $(document).ready(function () {
                    $.ajax({
                        type: "get",
                        url: "/isNameExist?username=" + username,
                        async: true,
                        success: function (result) {
                            // console.log(result)
                            if (result) {
                               
                                resolve(result)
                            }else{
                                resolve(result)
                            }
                        },
                        error: function (error) {
                            alert(error.status + "" + error.statusText);
                        }
                    });
                });
            }
        })
    }).then((result) => {
        return new Promise((resolve, reject) => {
            // console.log(result)
            var warningspan = document.getElementsByClassName('exist-name')[0];
            if (result) {
                registerBtn.style.cursor = 'not-allowed';
                warningspan.style.opacity = 1
            } else {
                warningspan.style.opacity = 0;
                registerBtn.style.cursor = 'pointer';
            }
        })
    })
=======
var nameInput = document.getElementsByClassName('name-input')[0];
var registerBtn = document.getElementsByClassName('login')[0];
var ajaxRequestMongo = function (name) {
    console.log(name)
    if (name != '') {
        $(document).ready(function () {
            $.ajax({
                type: "get",
                url: "/isNameExist?username=" + name,
                async: true,
                success: function (result) {
                    if (result) {
                        resolve(result)
                    }
                },
                error: function (error) {
                    alert(error.status + "" + error.statusText);
                }
            });
        });
    }

}


nameInput.addEventListener('blur', function () {
    var promise = new Promise((resolve, reject) => {
        var username = nameInput.value;
        resolve(username)
    })
    promise.then((username) => {
        return new Promise((resolve, reject) => {
            if (username != '') {
                // console.log(username)
                $(document).ready(function () {
                    $.ajax({
                        type: "get",
                        url: "/isNameExist?username=" + username,
                        async: true,
                        success: function (result) {
                            // console.log(result)
                            if (result) {
                               
                                resolve(result)
                            }else{
                                resolve(result)
                            }
                        },
                        error: function (error) {
                            alert(error.status + "" + error.statusText);
                        }
                    });
                });
            }
        })
    }).then((result) => {
        return new Promise((resolve, reject) => {
            // console.log(result)
            var warningspan = document.getElementsByClassName('exist-name')[0];
            if (result) {
                registerBtn.style.cursor = 'not-allowed';
                warningspan.style.opacity = 1
            } else {
                warningspan.style.opacity = 0;
                registerBtn.style.cursor = 'pointer';
            }
        })
    })
>>>>>>> 0b0c8f7a921ef6c9dd2b2133a1b1a470b4453ce0
})