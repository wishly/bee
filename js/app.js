$(document).ready(function() {
	var $oBtn = $("div.beeGame");
		$oBtn.on("click", function() {
			$(this).css("display", "none");
			Game.init($("div.content"));
		});
});

var Game = {
		oEnemy : { //敌人数据
				e1 : {style: "enemy1", blood: 1, speed: 5, score: 1 },
				e2 : {style: "enemy2", blood: 2, speed: 7, score: 2 },
				e3 : {style: "enemy3", blood: 3, speed: 10, score: 3}
		},
		gk : [	//关卡数据
			{
				eMap : [
					"e2","e2","e2","e2","e2","e2","e2","e2","e2","e2",
					"e2","e2","e2","e2","e2","e2","e2","e2","e2","e2",
					"e2","e2","e2","e2","e2","e2","e2","e2","e2","e2",
					"e1","e1","e1","e1","e1","e1","e1","e1","e1","e1",
					"e1","e1","e1","e1","e1","e1","e1","e1","e1","e1",
					"e1","e1","e1","e1","e1","e1","e1","e1","e1","e1"
				],
				colNum : 10,
				iSpeedX : 10,
				iSpeedY : 10,
				times : 3000
			},
			{
				eMap : [                                          
					"e3","e3","e3","e3","e3","e3","e3","e3","e3","e3",
					"e3","e3","e3","e3","e3","e3","e3","e3","e3","e3",
					"e3","e3","e3","e3","e3","e3","e3","e3","e3","e3",
					"e1","e1","e1","e1","e1","e1","e1","e1","e1","e1",
					"e1","e1","e1","e1","e1","e1","e1","e1","e1","e1",
					"e1","e1","e1","e1","e1","e1","e1","e1","e1","e1"
				],
				colNum : 10,
				iSpeedX : 20,
				iSpeedY : 20,
				times : 2000
			},
			
		],
		air: {//创建飞机数据
			style: {
				name: "air1",
				width: "46px",
				height: "60px",
				airUrl: "img/fj.png"
			},
			bulletStyle: {
				width: "1px",
				height: "10px",
				color: "white"
			}
		},
		
		init : function(target) {	//初始化
				this.oParent = target;
				this.createScore();
				this.createEnemy( 0 );
				this.createAir();
				
		},
		createScore : function() {	//积分的创建
			var $oS = $("<div id = 'score'>积分：<span>0</span></div>").appendTo(this.oParent);
			this.oSNum = $oS.find("span");
//			console.log($oS.children("span").html());
		},
		createEnemy: function( iNow ) { //敌人创建
			if( this.oUl ) {
				this.oUl.remove();
				clearInterval( this.oUl.timer );
			}
			var _this = this,
				gk = this.gk[ iNow ],
				$oUl = $("<ul></ul>").attr("id", "bee").css({
				width : gk.colNum * 40,
			});
			$oUl.css({
				left : ( this.oParent.width() - $oUl.width() ) / 2,
				position: "relative"
			});
			this.oUl = $oUl;
			this.aLi = null;
			
			$oUl.appendTo( this.oParent );
			
			$.each(gk.eMap, function( index, value ) {
				var $oLi = $("<li>");
				$oLi.attr({
					class : _this.oEnemy[ value ].style,
					blood : _this.oEnemy[ value ].blood,
					speed : _this.oEnemy[ value ].speed,
					score : _this.oEnemy[ value ].score
				});
				$oLi.appendTo($oUl);
			});
			$("li.enemy1").css("background", "url(img/mf1.png) no-repeat");
			$("li.enemy2").css("background", "url(img/mf2.png) no-repeat");
			$("li.enemy3").css("background", "url(img/mf3.png) no-repeat");
			
			this.aLi = $("#bee li");
			this.aLi.css({
					width : 40,
					height : 28,
					float : "left",
					listStyle : "none",
					zIndex: "2"
			});
			var arr = [];
			
			$.each(_this.aLi, function( index, value ) {
				arr.push( [ value.offsetLeft , value.offsetTop ] );
			});
			
			$.each(_this.aLi, function( index, value ) {
				value.style.position = "absolute";
				value.style.left = arr[index][0] + "px";
				value.style.top = arr[index][1] + "px";
			});
			
			this.moveEnemy( gk );
			this.iNow = iNow;
		},
		moveEnemy : function( gk ) {		//整体移动
			var _this = this,
				leftInstance = 0,
				rightInstance = $(document).width() - $("#bee").width(),
				speedX = 0,
				speedY = 0;
//				console.log( this.iNow );
				speedX = gk.iSpeedX;
				speedY = gk.iSpeedY;
//				console.log(speed);
//				console.log( _this.gk[ _this.iNow ].iSpeedX );
				_this.oUl.timer = setInterval(function(){
//					console.log(_this.gk[ _this.iNow ].iSpeedX);
//					console.log( $("#bee").position().left );
				var posLeft = $("#bee").position().left,
					posTop = $("#bee").position().top,
					instance = 0,
					instanceTop = 0;
//					console.log(posLeft);
					instanceTop = posTop + gk.iSpeedY;
					if( posLeft > rightInstance ) {
//						_this.stop(true, false);
						speedX *= -1;
						$("#bee").animate({top: instanceTop, left: rightInstance }, 100);
					} else if ( posLeft < leftInstance ){
						speedX *= -1;
						$("#bee").animate({top: instanceTop, left: leftInstance }, 100);
					}
						instance = posLeft + speedX;
						instance = Math.ceil( instance );
//						console.log(instance);
					$("#bee").animate({left: instance}, 100);
			}, 500);
			setInterval( function() {
				_this.oneMove();
			}, gk.times );
		},
		oneMove: function() {
			var _this = this,
				$oLi = $("#bee li"),
				nowLi = Math.floor( Math.random() * $oLi.length );
				$oLi[ nowLi ].timer = setInterval(function() {
					var a = ( _this.oAir.position().left + _this.oAir.width() / 2 ) - ( $oLi.eq( nowLi ).position().left + $oLi.eq( nowLi ).parent().position().left + $oLi.eq( nowLi ).width() / 2 );
					var b = ( _this.oAir.position().top + _this.oAir.height() / 2 ) - ( $oLi.eq( nowLi ).position().top + $oLi.eq( nowLi ).parent().position().top + $oLi.eq( nowLi ).height() / 2 );
					var c = Math.sqrt(a*a + b*b);
					
					var speedX = parseInt( $oLi.eq( nowLi ).attr("speed") ) * a/c;
					var speedY = parseInt( $oLi.eq( nowLi ).attr("speed") ) * b/c;
					
//					console.log( speedX );
//					console.log( speedY );
					$oLi.eq( nowLi ).animate({
						left: speedX + $oLi.eq( nowLi ).position().left,
						top: speedY + $oLi.eq( nowLi ).position().top
					}, 20);
					if( _this.attack( _this.oAir, $oLi[ nowLi ] ) ) {
						alert("游戏结束");
						location.reload();
					}
				}, 30);
		},
		createAir: function() {//飞机的创建
				var oAir = $("<div></div>").addClass(this.air.style.name).css({
					position: "absolute",
					width: this.air.style.width,
					height: this.air.style.height,
					background: "url( "+ this.air.style.airUrl +" ) no-repeat",
					left: ( $( this.oParent ).width() - parseInt( this.air.style.width ) ) / 2,
					top: ( $( this.oParent ).height() - parseInt( this.air.style.height ) ),
					cursor: "pointer",
					zIndex: "2"
				});
			this.oAir = oAir;
			this.oAir.appendTo( this.oParent );
			this.moveAir();
		},
		moveAir: function() {
			var _this = this,
				iNum = 0,
				timer = null,
				$air = $(" " + "." + _this.air.style.name + " ");
			$(document).on("keydown", function(event) {
				var e = event || window.event,
					keyNum = e.which;
				if( !timer ) {
					timer = setInterval( move, 50 );
				}
				if( keyNum === 39 ){ //向右
					iNum = 2;
				} else if( keyNum === 37 ) { //向左
					iNum = 1;
				}
				if( $air.position().left > ( $( _this.oParent ).width() - $air.width() ) ) {
					$air.css("left", $( _this.oParent ).width() - $air.width() );
				} else if( $air.position().left < 0 ) {
					$air.css("left", "0px");
				}
			});
			
			$(document).on("keyup", function(event){
				var e = event || window.event;
				clearInterval( timer );
				timer = null;
				iNum = 0;
				
			});
			
			function move() {//移动飞机
				if( iNum === 2 ) {
					$air.animate({left: "+=10px"}, 10);
				}
				if( iNum === 1 ) {
					$air.animate({left: "-=10px"}, 10);
				}
			}
			this.createBullet();
		},
		createBullet: function() { //创建子弹
			var _this = this,
				$air = $(" " + "." + _this.air.style.name + " ");
			setInterval(function(){
				$oB = $("<div class=bullet></div>").css({
					left: $air.position().left + $air.width() / 2,
					top: $air.position().top - 10,
				}).appendTo( _this.oParent );
				_this.runBullet( $oB );
			}, 300);
		},
		runBullet: function( $oB ) {  //子弹运动
			var _this = this,
				oUl = document.getElementById("bee"),
				oLi = oUl.getElementsByTagName("li"),
				oDiv = document.getElementById("score"),
				score = oDiv.getElementsByTagName("span")[0];
			$oB.timer = setInterval(function() {
				$oB.animate({top: "-=10px"}, 1);
				if( $oB.position().top < 0 ) {
					clearInterval( $oB.timer );
					$oB.timer = null;
					$oB.remove();
				}
				for(var i = 0; i < oLi.length; i++ ) {
//					console.log( _this.attack( $oB.get( 0 ), _this.aLi[ i ] ) );
					if ( _this.attack( $oB.get( 0 ), oLi[ i ] ) ) {
						var blood = parseInt( oLi[ i ].getAttribute("blood") );
						
						if( parseInt( oLi[ i ].getAttribute("blood") ) === 1 ){
//							console.log(oLi[i].getAttribute("blood"));
							clearInterval( $( oLi[ i ] ).timer );
							score.innerHTML = parseInt( score.innerHTML) + parseInt( oLi[ i ].getAttribute( "score" ) );
//							console.log( parseInt(score.innerHTML));
							oLi[ i ].parentNode.removeChild( oLi[ i ] );
						} else {
							blood--;
							oLi[ i ].setAttribute("blood", blood);
						}
						clearInterval( $oB.timer );
						$oB.timer = null;
						$oB.remove();
						if( !oLi.length ) {
							_this.createEnemy( 1 );
						}
					}
				}
				
			}, 30);
		},
		attack: function( obj1 , obj2 ) {
			if( obj1 instanceof jQuery) {
				obj1 = obj1.get( 0 );
			}
			if( obj2 instanceof jQuery ) {
				obj2 = obj2.get( 0 );
			}
			var left1 = obj1.offsetLeft;
			var right1 = obj1.offsetLeft + obj1.offsetWidth;
			var top1 = obj1.offsetTop;
			var bottom1 = obj1.offsetTop + obj1.offsetHeight;
			var left2 = obj2.offsetLeft + obj2.parentNode.offsetLeft;
			var right2 = obj2.offsetLeft + obj2.offsetWidth + obj2.parentNode.offsetLeft;
			var top2 = obj2.offsetTop + obj2.parentNode.offsetTop;
			var bottom2 = obj2.offsetTop + obj2.offsetHeight + obj2.parentNode.offsetTop;
			
//			console.log( left1 > right2 );
//			console.log( bottom2 );
			if( left1 > right2 || right1 < left2 || top1 > bottom2 || bottom1 < top2 ){
				return false;
			} else {
				return true;
			}
		}
	}

/*
moveAir: function() {
			var _this = this;
			var $Item = $(" " + "." + _this.air.style.name + " ");
			$(document).on("keydown", function(event) {
				var e = event || window.event,
					keyNum = e.which;
					
					if( $Item.position().left >= $( _this.oParent ).width() ) {
						$Item.css("left", "" + $( _this.oParent ).width() +"" + "px");
					}
					switch( keyNum ) {
						case 37: if ( $Item.position().left > 0 ) {
									$Item.animate({left: "-=5px"},10);
								} else {
									$Item.animate({left: "0px" },10);
								}
										 break;
//						case 38: $Item.animate({top: "-=10px"},10); break;
						case 39: if ( $Item.position().left < ( $( _this.oParent ).width() - parseInt( _this.air.style.width ) ) ){    //对右边限制，防止超出视图
										$Item.animate({left: "+=5px"},10);
								} else {
									$Item.animate({left: "" + $( _this.oParent ).width() - parseInt( _this.air.style.width ) + "px" + ""},10);
//									$Item.get( 0 ).style.left = $( _this.oParent ).width() - parseInt( _this.air.style.width ) + "px";
								}
									 break;
//						case 40: $Item.animate({top: "+=10px"},10); break;
						default: break;
					}
					
					
			});
			this.$Item = $Item;
			this.createBullet();
		},
		createBullet: function() {
			var _this = this;
			var createBulletTimer = setInterval(function(){
				$oB = $("<div class=bullet></div>");
				$oB.css({
					width: _this.air.bulletStyle.width,
					height: _this.air.bulletStyle.height,
					background: _this.air.bulletStyle.color,
					position: "absolute",
					overflow: "hidden",
					zIndex: "999",
					left: _this.$Item.position().left + _this.$Item.width() / 2,
					top: _this.$Item.position().top - 10
				});
				$oB.appendTo( _this.oParent );
				_this.runBullet( $oB );
			}, 5000);
				
		},
		runBullet: function( $oB ) {
			var _this = this;
			$oB.timer = setInterval( function() {
				var T = $oB.position().top - 10;
				$oB.animate({top: T}, 10);
				if( T < -10) {
					clearInterval($oB.timer);
					$oB.timer = null;
					$oB.remove();
				} else {
					$oB.css("top", T);
				}
				for(var i = 0; i < _this.aLi.length; i++ ){
					if( _this.attack ( $oB.get(0), _this.aLi[i] ) ) {
						alert();
					}
				};
			} ,30)
		},
		
*/