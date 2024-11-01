jQuery(document).ready(function($)
{
    $("#filter").keyup(function(){
 
        // Retrieve the input field text and reset the count to zero
        var filter = $(this).val(), count = 0;
 
        // Loop through the comment list
        $("#opd-list-holder ul li").each(function(){
 
            // If the list item does not contain the text phrase fade it out
            if ($(this).text().search(new RegExp(filter, "i")) < 0) {
                $(this).fadeOut();
 
            // Show the list item if the phrase matches and increase the count by 1
            } else {
                $(this).show();
                count++;
            }
        });
 
    });

    
        //UpvoteCount
    $(".upvote-btn").on("click", function(event){
        
        event.preventDefault();
        

        var data_id = $(this).attr("data-post-id");
        var data_title = $(this).attr("data-item-title");
        var data_link = $(this).attr("data-item-link");

        var parentLI = $(this).closest('li').attr("id");

        var selectorBody = $('.qc-grid-item span[data-post-id="'+data_id+'"][data-item-title="'+data_title+'"][data-item-link="'+data_link+'"]');

        var selectorWidget = $('.widget span[data-post-id="'+data_id+'"][data-item-title="'+data_title+'"][data-item-link="'+data_link+'"]');

        var bodyLiId = $(".qc-grid-item").find(selectorBody).closest('li').attr("id");
        var WidgetLiId = $(selectorWidget).closest('li').attr("id");

        //alert( bodyLiId );

        $.post(ajaxurl, {            
            action: 'qcopd_upvote_action', 
            post_id: data_id,
            meta_title: data_title,
            meta_link: data_link,
            li_id: parentLI,
            security: qc_sld_get_ajax_nonce
                
        }, function(data) {
            // console.log(data);
            var json = $.parseJSON(data);
            
            //console.log(json.cookies);
            //console.log(json.exists);
            if( json.vote_status == 'success' )
            {
                $('#'+parentLI+' .upvote-section .upvote-count').html(json.votes);
                $('#'+parentLI+' .upvote-section .upvote-btn').css("color", "green");
                $('#'+parentLI+' .upvote-section .upvote-count').css("color", "green");

                $('#'+bodyLiId+' .upvote-section .upvote-count').html(json.votes);
                $('#'+bodyLiId+' .upvote-section .upvote-btn').css("color", "green");
                $('#'+bodyLiId+' .upvote-section .upvote-count').css("color", "green");

                $('#'+WidgetLiId+' .upvote-section .upvote-count').html(json.votes);
                $('#'+WidgetLiId+' .upvote-section .upvote-btn').css("color", "green");
                $('#'+WidgetLiId+' .upvote-section .upvote-count').css("color", "green");
            }
        });
       
    });


    /* live search feature added 10-15-24 */


    jQuery('.sld_search_filter').keypress(function(e) {
       var code = (e.keyCode ? e.keyCode : e.which);
  
        if ( (code==13) || (code==10)){

            jQuery(this).trigger('blur');
            return false;
       }
    });




    $(".sld_search_filter").keyup(function(){
        jQuery('#opd-list-holder').find('.qc_sld_not_item_found').remove();

        // Retrieve the input field text and reset the count to zero
        var filter = $(this).val().trim(), count = 0;
        filter = filter.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
        var filter_multi_string = $(this).val();

        var checkDomWrap = $(this).closest('form');
        var sld_search_filter_clear = checkDomWrap.find('.sld_search_filter_clear');
        checkDomWrap.removeClass('sld_search_filter_clear_wrap');
        sld_search_filter_clear.remove();
        if ( filter != '' ) {
            checkDomWrap.addClass('sld_search_filter_clear_wrap');
            $(this).after('<i class="fa fa-times sld_search_filter_clear"></i>');
        }

        if ( filter != '' && filter.length < 2 ) {
            return;
        }
        
        //console.log( filter );
        var selector = $('#opd-list-holder ul li');
        if($('.qcld_sld_tabcontent').length>0){
            selector = $('.qcld_sld_tabcontent:visible #opd-list-holder ul li');
        }
 
        // Loop through the comment list
        selector.each(function(){

            //console.log( filter_multi_string );

            $(this).removeClass('jp-hidden');

            var dataTitleTxt = $(this).children('a').attr('data-title');
            var dataSubtitle = $(this).children('a').attr('data-subtitle') ? $(this).children('a').attr('data-subtitle') : $(this).find('a').attr('data-subtitle');
            var datatag = $(this).children('a').attr('data-tag');
            var dataurl = $(this).find('a').attr('href');


            if( typeof(dataurl) == 'undefined' ){
                dataurl = "-----";
            }
            if( typeof(dataSubtitle) == 'undefined' ){
                dataSubtitle = "-----";
            }
            if( typeof(datatag) == 'undefined' ){
                datatag = "-----";
            }


            if( typeof(dataTitleTxt) == 'undefined' ){
                dataTitleTxt = "-----";
            }

            var parentH3 = $(this).parentsUntil('.qc-grid-item').children('h3').text();
            
            //var pattern = filter_multi_string.trim().match(/[a-zA-Z]+|[0-9]+/g) || ""; 
            var pattern = filter_multi_string.trim().match(/[a-zA-Z0-9-’/`~!#*$@_%+=.,^&(){}[\]|;:”<>?\\]+/g) || ""; 
            if(pattern) {
                pattern = pattern.map(function(el) { 
                  return '(?=.*' + el.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&") + ')';
                });
                pattern = pattern.join("");
            }
 
            // If the list item does not contain the text phrase fade it out
            if ($(this).text().search(new RegExp(pattern, "i")) < 0 && dataurl.search(new RegExp(filter, "i")) < 0 && dataTitleTxt.search(new RegExp(filter, "i")) < 0 && parentH3.search(new RegExp(filter, "i")) < 0 && dataSubtitle.search(new RegExp(filter, "i")) < 0 && datatag.search(new RegExp(filter, "i")) < 0 ) {
                //$(this).fadeOut();
                $(this).hide();
                $(this).removeClass("showMe");      
 
            // Show the list item if the phrase matches and increase the count by 1
            }
            else {
                $(this).show();
                $(this).addClass("showMe");
                count++;
            }

        });
        
        var listholder = $(".qcopd-single-list, .qcopd-single-list-1, .opd-list-style-8, .opd-list-style-9, .opd-list-style-12, .sld-container");
        if($('.qcld_sld_tabcontent').length>0){
            var listholder = $(".qcld_sld_tabcontent:visible .qcopd-single-list, .qcld_sld_tabcontent:visible .qcopd-single-list-1, .qcld_sld_tabcontent:visible .opd-list-style-8, .qcld_sld_tabcontent:visible .opd-list-style-9, .qcld_sld_tabcontent:visible .opd-list-style-12, .qcld_sld_tabcontent:visible .sld-container");
        }

        listholder.each(function(){
            
            var visibleItems = $(this).find("li.showMe").length;
            
            // console.log(visibleItems);
            
            if(visibleItems==0){
                $(this).hide();
                $(this).parent('.qcopd-list-column').hide();
            }else{
                $(this).show();
                $(this).parent('.qcopd-list-column').show();
            }

        });
        setTimeout(function(e){
            var grid = $('.qc-grid');
            
            if( sld_ajax_object_rtl == 'on' ){

                grid.packery('destroy').packery({
                  itemSelector: '.qc-grid-item',
                  gutter: 10,
                  originLeft: false
                });

            }else{
                
                grid.packery('destroy').packery({
                  itemSelector: '.qc-grid-item',
                  gutter: 10,
                  
                });
            }
            
        },100);

        //console.log(jQuery('#opd-list-holder').find('.qc-grid-item:visible').length)

        if(jQuery('#opd-list-holder').find('.qc-grid-item:visible').length < 1){
            jQuery('#opd-list-holder').prepend('<div class="qc_sld_not_item_found">'+sld_no_results_found+'</div>')
        }

    });

      
    $(document).on('click', '.sld_search_filter_clear', function(){
        var checkDom = $(this);
        var checkDomWrap = checkDom.closest('form');
        var sld_search_filter = checkDomWrap.find('.sld_search_filter');
        sld_search_filter.val('');
        var sld_search_filter_clear_wrap = checkDomWrap.find('input[type="text"]');
        jQuery(sld_search_filter_clear_wrap).trigger('keyup');
        //$(this).remove();
    });
    

    $('#live-search').on('submit',function(e){
        e.preventDefault();
    })
    
    
    
    
});


