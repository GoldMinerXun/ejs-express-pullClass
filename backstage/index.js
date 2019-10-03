$('.back-stage-down-btn').mouseenter(function () {
    $('.down-list').css({
        display: 'block'
    });
});
$('.back-stage-down-btn').mouseleave(function () {
    $('.down-list').css({
        display: 'none'
    });
});

$('.down-list').click(function (e) {
    var selectid = e.toElement.id;
    var text = $('#' + selectid).text();
    if ($('.selected-li').length > 0) {
        $('.selected-li').text(text + ':');
        if (text != 'auto recognize') {
            $('.back-stage-search-input').attr('placeholder', 'please input ' + text + '.').attr('name', text);
        } else {
            $('.back-stage-search-input').attr('placeholder', 'Fuzzy query, please input any words.').attr('name', 'auto');

        }

    } else {
        var newspan = $('<span class="selected-li"></span>').text(text + ":")
        $('.back-stage-search-input').before(newspan)
    }

})

$('.update-btn').click(function () {
    location.href = '/back'
})
$('table td').click(function () {
    console.log()
    if ((!$(this).is('.input')) && $(this).attr('class') != "checkbox" &&  $(this).attr('class') != "btn"&& $(this).attr('class') != "_id") {
        $(this).addClass('input').html('<input type="text" class="td-input" value="' + $(this).text() + '" />').find('input').focus().blur(function () {
            $(this).parent().removeClass('input').html($(this).val() || 0);
        });
    }
})
