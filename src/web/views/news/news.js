require('../../assets/css/style.css');
require('../../assets/css/news.css');
require('../../assets/js/public.js');
const myindex={
	init(){
		$(function(){
		    getHash();
		    if($.browser.msie && parseInt($.browser.version)<9){
		        $('.content .j_list').attr('id','radius');
		        $('.before').addClass('radius');
		        $('.after').addClass('radius');
		    }
		})

		$('.j_list a').click(function(){
		    getHash($(this));
		    return false;
		})

		function getHash(That){
		    var type='qinggu';
		    $('.j_img').attr('src','../../assets/img/load.gif').show();
		    $('.j_div').html("");
		    if(That){
		        type=That.attr('href').split('#')[1];
		        That.parent().addClass('active').siblings('p').removeClass('active');
		    }
		    login_post('/aboutUs.do','type='+type,'',function(data){
		        data=JSON.parse(data);
		        if(data.descs){
		            var src=handle_pic(data.imgurl)[0];
		            if(src){
		                $('.j_img').attr('src',src);
		            }else{
		                $('.j_img').hide();
		            }
		            $('.j_div').html(data.descs);
		        }else{
		            $('.j_img').hide();
		        }
		    })
		}
	}
}
export default myindex;