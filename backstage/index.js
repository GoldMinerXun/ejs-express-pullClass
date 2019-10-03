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
$('.down-list').click(function(e){
    var selectid=e.toElement.id;
    var text=$('#'+selectid).text();
    if($('.selected-li').length>0){
        $('.selected-li').text(text+':');
        if(text!='auto recognize'){
            $('.back-stage-search-input').attr('placeholder','please input '+text+'.')
        }else{
            $('.back-stage-search-input').attr('placeholder','Fuzzy query, please input any words.');
        }
      
    }else{
        var newspan=$('<span class="selected-li"></span>').text(text+":")
        $('.back-stage-search-input').before(newspan)
    }
    
})