/**
* Jquery Canvas Mouse Effects v1.0
* http://github.com/gaelbuchy/jQuery-canvas-mouse-effects
* Copyright 2013, Gael Buchy
* Date: Mar 19 2013
*
*/

(function( $ ){
  
	$.fn.cme = function(opts) {
  		
  		/* Initialize defaults options and elements */
	  	var defaults = {
		    	width: window.innerWidth,
		    	height: window.innerHeight,
			type: 'star',
			size: 3,
			opacity:1,
			number: 'auto',
			color: '#000',
			strokeColor: '#000',
			strokeSize: 0,
			action:'mousemove',
			src:'',
			shadow:{
				show:false,
				color:'#111',
				blur:3,
				offsetX:3,	
				offsetY:3
			}
		},
		_this = this,
		el = $(this);
		   	
		var options = $.extend( true, defaults, opts);
		
		/* Initialization function */
	  	function _init(){
			el.attr('width', options.width);
			el.attr('height', options.height);
			_this.ctx = el[0].getContext("2d");
			
			if(options.type == "image" && options.src != ""){
				_this.img = new Image();
				_this.img.src =  options.src;
			}
		};
	
		var drawn_objects = {
			star : function() {
				var p = 5, m = 0.5;
				_this.ctx.moveTo(0,0-options.size);
				for (var i = 0; i < p; i++)
				{
					_this.ctx.rotate(Math.PI / p);
					_this.ctx.lineTo(0, 0 - (options.size*m));
					_this.ctx.rotate(Math.PI / p);
					_this.ctx.lineTo(0, 0 - options.size);
				}
				_this.ctx.closePath();
				_this.ctx.fill();
			},
			circle : function(){
				_this.ctx.arc(0, 0, options.size, 0, 2 * Math.PI, false);
				_this.ctx.fill();
			},
			rect : function(){
				_this.ctx.rect(-options.size/2, -options.size/2, options.size, options.size);
				_this.ctx.fill();
			},
			image : function(){
				_this.ctx.drawImage(_this.img, -_this.img.width/2, -_this.img.height/2);
			}	
		};
		
		/* Drawn object class */
		function Obj(_id, _type, x, y){
			this.id = _id;
			this.type = _type;
			
			// Init object position
			this.x = x;
			this.y = y;
			
			/* Define extremums for distance to start point and speed */
			this.MIN_D = 15;
			this.MAX_D = 100;
			this.MIN_S = 0.4;
			this.MAX_S = 1;

			/* Randomly calcul object direction */
			this.dX = ( Math.random() > 0.5 ) ? -1 : 1;
			this.dY = ( Math.random() > 0.5 ) ? -1 : 1;
			/* Randomly calcul object deplacement speed */
			this.sX = this.MIN_S + (Math.random()*(this.MAX_S-this.MIN_S));
			this.sY = this.MIN_S + (Math.random()*(this.MAX_S-this.MIN_S));
						
			/* Boolean testing if movement is finished */
			this.end = false;
		}
		
		Obj.prototype = {
			getExt: function(s, e, d){ // start-end-direction
				var t1 = s+e*d;
				var t2 = s-e*d;
				return ((t1>t2) ? {max:t1,min:t2} : {max:t2,min:t1})
			},
			/* Set initial object position and destination */
			initPos: function(){
				
				var endX = Math.round(this.MIN_D + (Math.random()*(this.MAX_D-this.MIN_D)));
				var endY = Math.round(this.MIN_D + (Math.random()*(this.MAX_D-this.MIN_D)));
				
				this.xE = this.getExt(this.x, endX, this.dX);
				this.yE = this.getExt(this.y, endY, this.dY);
				
				return this;
			},
			draw: function(){
				_this.ctx.save();
				_this.ctx.fillStyle = options.color;
				_this.ctx.globalAlpha = options.opacity;
				
				if(options.shadow.show){
					_this.ctx.shadowColor = options.shadow.color;
					_this.ctx.shadowBlur = options.shadow.blur;
					_this.ctx.shadowOffsetX	= options.shadow.offsetX;
					_this.ctx.shadowOffsetY = options.shadow.offsetY;
				}

		      		_this.ctx.beginPath();
				_this.ctx.translate(this.x, this.y);
				    
				if (drawn_objects[this.type]) {
					drawn_objects[this.type].apply(this, Array.prototype.slice.call(arguments));
				} else {
					console.log( 'Error - Not object '+this.type+' to draw.' );
				}  			
				
				if(options.strokeSize > 0){
					_this.ctx.lineWidth = options.strokeSize;
					_this.ctx.strokeStyle = options.strokeColor;
					_this.ctx.stroke();
				}
				_this.ctx.restore();
			},
			nextPos: function(){
				if(this.x > this.xE.max || this.x < this.xE.min || this.y > this.yE.max || this.y < this.yE.min ){
					this.end = true;
				}else{
					this.x += this.sX*this.dX;
					this.y += this.sY*this.dY;
				}
			}
			
		}
			
		function ObjCloud(id, x, y){
			this.id = id;
			this.objs = new Array();
			this.end = false;
			// Set random number of objects if auto
			this.nb = (options.number == 'auto') ? Math.round(3 + Math.random()*10) : options.number ;
			
			for(i=0;i<this.nb;i++){
				this.objs.push(new Obj(i, options.type, x, y).initPos());
			}
		}
		
		ObjCloud.prototype = {
			draw: function(){
				var completed_objs = new Array();
				for(var i=0; i<this.objs.length;i++){
					this.objs[i].draw();
					this.objs[i].nextPos();
	
					if(this.objs[i].end)
						completed_objs.push(i);
				}
				
				for(var i in completed_objs)
					this.objs.splice(i, 1);
				
				if(this.objs.length == 0){
					this.end = true;
				}
			}
		}
		
		function Canvas(){
			_init();
		  	this.objs_clouds = new Array();
		  	this.m_pos = {x:0,y:0};
		  	this.i = 0;
			this.last_add = {x:0, y:0};
	  	}
		
		Canvas.prototype = {
			addCloud: function(evt){
		  		var rect = el[0].getBoundingClientRect();
				this.m_pos.x = evt.clientX - rect.left;
				this.m_pos.y = evt.clientY - rect.top;
				
				if ( options.action != "mousemove" || Math.sqrt(Math.pow(this.m_pos.x - this.last_add.x, 2) + Math.pow(this.m_pos.y - this.last_add.y, 2)) > 20) {
					this.objs_clouds.push(new ObjCloud(this.i, this.m_pos.x, this.m_pos.y));
					this.i++;
					this.last_add.x = this.m_pos.x;
					this.last_add.y = this.m_pos.y;
				}
		  	},
		  	draw: function(){
			  	var completed_clouds = new Array();
				for(var i=0; i<this.objs_clouds.length;i++){
					this.objs_clouds[i].draw();
					if(this.objs_clouds[i].end)
						completed_clouds.push(i);
				}
				
				for(var i in completed_clouds)
					this.objs_clouds.splice(i, 1);
		  	},
		  	render: function(){
				_this.ctx.clearRect(0, 0, options.width, options.height);
			  	this.draw();
		  	}
		}
		
		var canvas_obj = new Canvas();
		
		$('body').bind( options.action, function(evt) {
			canvas_obj.addCloud(evt);
		});
		
		$(window).resize(function() {
			el.attr('width', window.innerWidth);
			el.attr('height', window.innerHeight);		
		});

		window.requestAnimFrame = (function(){
			return  window.requestAnimationFrame       || 
			      	window.webkitRequestAnimationFrame || 
			      	window.mozRequestAnimationFrame    || 
			      	window.oRequestAnimationFrame      || 
			      	window.msRequestAnimationFrame     || 
			      	function( callback ){
				      	window.setTimeout(callback, 1000 / 60);
				};
		})();
 
		(function animate(){
			requestAnimFrame(animate);
			canvas_obj.render();
		})();
		
	//return this;
  };


  
})( jQuery );

