/**
 * Author: Henrique Lopes
 * Email:  <riquellopes@gmail.com, riquellopes@yahoo.com.br> 
 *
 * Version: 0.1
 * Date:	2010-08-25
 * 
 * Generates the pop with its defaults configurations.
 * $("#element").pop();
 * 
 * Or customer.
 * $("#element").pop({
 *		position:{
 *			align:"center",
 *			valign:"middle"
 *		}
 *		param:{
 *			width:600,
 *			height:200
 *			name_pop:"my_name_favorite"
 *		}
 *   });
 */
(function($){
	
	$.fn.pop = function(options){
		
		var setting = $.extend({
							afterclose:null,
							beforeopen:null,
							msg:"Disable your anti-popup!",
							justopen:null,
							print:false,
							position:{
								align:"center",
								valign:"middle"
							},
							param:{
								   name_pop:"pop",
								   width:window.screen.availWidth,
								   height:window.screen.availHeight,
								   resizable:false,
								   toolbar:false,
								   status:false,
								   system:false,
								   menubar:false,
								   scrollbars:true,
								   modal:false
							}
		}, options),
		
		
		position = function(type)
		{
			var screen_height = window.screen.availHeight,
				screen_width  = window.screen.availWidth,
				width  = setting.param.width,
				height = setting.param.height,
				left   = parseInt(screen_width / 2) - parseInt(width / 2),
				top    = parseInt(screen_height / 2)  - parseInt(height / 2);
				
				switch( setting.position.align )
				{
					case "left":
						left = 0;
					break;
					case "right":
						left = parseInt( screen_width - width );
					break;
				}
				
				switch( setting.position.valign )
				{
					case "top":
						top = 0;
					break;
					case "bottom":
						top = parseInt( screen_height - height );
					break;
				}
				
				return ( type == 'string' ) ? ",left="+left+",top="+top : {left:left,top:top};
		},//function
		
		
		to_string = function()
		{
			var  query = new Array(),
				 param = setting.param;
			
			for(k in param)
			{
				var p = param[k];
				
				if( typeof p == 'boolean' )
				{
					var value = p ? "yes" : "no";
						query.push( k+"="+value );
				}
				else
				{
					query.push( k+"="+p );
				}
			}
						
			return query.join(",");
		},//function
		
		to_string = to_string().concat(position('string'));
		
		$(this).live("click", function(){
			
			if( typeof setting.beforeopen == 'function' )
			{
				var func = setting.beforeopen.call(this);
				
				if( func == false )
					return func;
			}//if
			
			var url  = $(this).attr('nodeName') == 'A' ? this.href : $(this).attr('url');
				
			if(window.showModalDialog && setting.param.modal)
			{
				window.showModalDialog(url, setting.param.name_pop, "dialogWidth:"+setting.param.width+"px;dialogHeight:"+setting.param.height+"px");
			}
			else
			{
				var pop  = window.open(url, setting.param.name_pop, to_string);
					pop.focus();
					
					if( !pop )
					{
						alert(setting.msg);
					}	
					else if( typeof setting.afterclose == 'function' )
					{	
						var close = window.setInterval(function(){
							if( pop == null || pop.closed )
							{
								setting.afterclose.call(this, pop);
								window.clearInterval(close);
							}
						}, 1000);
					}
					else if( typeof setting.justopen == 'function' )
					{
						setting.justopen.call(this, pop);
					}
					else if( setting.print )
					{
						setTimeout('pop.print()', 1000);
					}//if	
			}//if
						
			return false;
			
		});//method
		
	};//function

})(jQuery);
