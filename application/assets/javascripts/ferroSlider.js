/*
  Ferro Slider version 1.2
  Requires jQuery (tested on 1.6.1, but no new features used).
  Requires (optional) jQuery easing (tested on 1.3, but no new features used).

  Copyright 2012 Ferro
  
  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at
  
  http://www.apache.org/licenses/LICENSE-2.0
  
  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

(function( $ ){
    var methods = {
        //desktop or laptop
        ferroSliderDesktop : function(options) { 
          
              var defaults = {
                  ajaxLoading       : false,
                  ajaxScript        : '',
                  autoSlide       : false,
                  autoSlideTime     : 5000,
              axis          : '',
              backGroundImageClass  : '',
              container         : 'none',
              createLinks       : false,
              createMap       : false,
              createPlayer      : false,
              createSensibleAreas   : false,
              createTimeBar     : false,
              displace        : 'row',
              easing          : 'linear',
              feedbackArrows      : false,
              fullScreenBackground  : false,
              linkClass         : '',
              mapPosition       : 'bottom_right',
              playerPosition      : 'bottom_center',
              playerTheme       : 'light',
              preloadBackgroundImages : false,
              preventArrowNavigation  : false,
              time          : 300,
              tips          : false,
              tipsPosition      : 'top'
            };
          
          var opts = $.extend({},defaults, options);
          var matrix = new Array();
          var matrixOrder = new Array();
          var displayWidth = 0;
          var displayHeight = 0;
          var offsetX = 0;
          var offsetY = 0;
          var initialPositionX = 0;
          var initialPositionY = 0;
          var actualCol = 0;
          var actualRow = 0;
          var elementToScroll = "html,body";
          var elementToTrigger = "html";
          var zIndex = -1000;
          var zIndexDecrement = 0;
          var matrixRows = 0;
          var matrixColumns = 0;
          var actualOffsetX = 0;
          var actualOffsetY = 0;
          var scrollStartX= null;
          var scrollStartY= null;
          var min_move_x = 20;
          var min_move_y = 20;
          var isMoving = false;
          var initialMobileHeight = 0;
          var initialMobileWidth = 0;
          var previousOrientation = 0;
          var isMobile = isMobile();
          var sliderClass = this.selector.replace(".",""); 
          var internalCounter = 0;
          var distance = null;
          var parentId = null;  
          var scrollTimeStart = null;
          var actualElementObject = null;
          var play = false;
          var autoPlayStartTime = 0;
          var timeLeft = opts.autoSlideTime;
          var t = null;
          
          if(isMobile){
            $("head").append('<meta name="viewport" id="vpFerroSlider" content="width=device-width, height=device-height, user-scalable=no, initial-scale='+(1/window.devicePixelRatio)+', minimum-scale = '+(Math.round((1/window.devicePixelRatio)*100)/100)+', maximum-scale = '+(Math.round((1/window.devicePixelRatio)*100)/100)+';"/>');
            if(screen.width > 780 || screen.height > 1030){
                window.location.reload();
            }
          }
          
          initializeWorkspace(this);
          
          if(isMobile){
            $(elementToScroll).css("overflow","auto");
                }
          
          actualOffsetY = initialPositionY;
        actualOffsetX = initialPositionX;
        
        window.scrollTo(0,0);
        window.scrollTo(initialPositionX,initialPositionY);
          
          $(document.body).append("<div id='slidingSpacesNavigationFeedback'></div>");
          $("#slidingSpacesNavigationFeedback").hide();
          $("#slidingSpacesNavigationFeedback").width(displayWidth);
          $("#slidingSpacesNavigationFeedback").height(displayHeight);
          $("#slidingSpacesNavigationFeedback").css({
            marginLeft:offsetX,
            marginTop:offsetY
          });
          
          var anchor = window.location.hash;
          
          if ($.trim(anchor) != "") {
            anchor = anchor.replace("#","");
            anchor = anchor.replace("!","");
            var actualEl = findElementById(anchor);
            actualCol = actualEl.column;
            actualRow = actualEl.row;
            actualElementObject = findElementById(anchor.replace("#",""));
            actualOffsetY = actualElementObject.row*(displayHeight);
            actualOffsetX = actualElementObject.column*(displayWidth);
            
            window.location.hash = anchor;
            
          }else{
            actualElementObject = matrixOrder[0];
          }
          
          if(opts.createLinks){
            $(".slidingSpacesOuterDiv").each(function(index) {
              var $el = $(this);
              $el.append("<div id='slidingSpacesNavigation_"+$el.attr("id")+"' class='slidingSpacesNavigation'><ul></ul></div>");
              for(var i=0;i<matrixOrder.length;i++){
                if(index != i){
                  if($("#"+matrixOrder[i].id).attr("title") != "" && $("#"+matrixOrder[i].id).attr("title") != null){
                    var linkTitle = $("#"+matrixOrder[i].id).attr("title");
                  }else{
                    var linkTitle = "Page "+i;
                  }
                  $("#slidingSpacesNavigation_"+$el.attr("id")+" ul").append("<li><a href='#"+matrixOrder[i].id+"' class='slidingSpacesNavigationLink' >"+linkTitle+"</a></li>");
                }
              }
            });
          }
          
          if(opts.createMap){
            createMap();
          }
          
          if(opts.autoSlide){
            play = true;
            
            if(opts.createPlayer){
              createPlayer(true);
            }
            if(opts.createTimeBar){
              createTimeBar();
            }
            $("#slidingSpacesPlayerTimerIn").width("0%");
            refreshTimerBar(opts.autoSlideTime);
            autoPlayStartTime = new Date().getTime();
            t = setTimeout(autoPlay,opts.autoSlideTime);
            
          }
          
          if(opts.createSensibleAreas){
            createSensibleAreas();
          }
          
          if(!opts.preventArrowNavigation){
            $(document).keydown(function(e){
              if($("*:focus").is("textarea, input, option, select")){}
              else{
                var keyCode = e.keyCode || e.which;
                  var arrow = {left: 37, up: 38, right: 39, down: 40 };
                var go = false;
                var direction = null;
                var iCol = actualCol;
                var iRow = actualRow;
                
                switch (keyCode) {
                  case arrow.left:
                    e.preventDefault();
                    if(actualCol > 0){
                      var toMove = findElementByPosition(actualRow,(actualCol-1));
                      if(toMove.id != null){
                        actualCol--;
                        go = true;
                      }
                    }
                  
                    break;
                    case arrow.up:
                      e.preventDefault();
                      if(actualRow > 0){
                        var toMove = findElementByPosition((actualRow-1),actualCol);
                      if(toMove.id != null){
                        actualRow--;
                        go = true;
                      }
                    }
                      
                      break;
                    case arrow.right:
                      e.preventDefault();
                      if(actualCol < matrixColumns){
                      var toMove = findElementByPosition(actualRow,(actualCol+1));
                      if(toMove.id != null){
                        actualCol++;
                        go = true;
                      }
                    }
                      break;
                    case arrow.down:
                      e.preventDefault();
                      if(actualRow < matrixRows){
                        var toMove = findElementByPosition((actualRow+1),actualCol);
                        if(toMove.id != null){
                          actualRow++;
                          go = true;
                      }
                    }
                      break;
                }
                
                if(go){
                  var leftShift = toMove.column*(displayWidth);
                  var topShift = toMove.row*(displayHeight);
                  
                  destroyEvent('startslide');
                triggerEvent('startslide',actualElementObject,toMove);
                  
                  fireNavigationFeedback(iCol,iRow,actualCol,actualRow);
                  $(elementToScroll).stop();
                  $(elementToScroll).animate({
                    scrollTop: topShift,
                    scrollLeft: leftShift
                  },opts.time,opts.easing,function(){
                    $(elementToScroll).stop();
                    actualOffsetY = topShift;
                    actualOffsetX = leftShift;
                    loadContent(toMove);
                    $(elementToScroll).animate({
                        scrollTop: topShift,
                        scrollLeft: leftShift
                      },0);
                    window.location.hash = "#!"+toMove.id;
                    actualElementObject = toMove;
                    
                    destroyEvent('endslide');
                  triggerEvent('endslide',actualElementObject,toMove);
                  });
                  if(opts.createMap){
                    refreshMap(toMove.id);
                  }
                  
                }
              }
            });
          }
          
          var linksClasses = ".slidingSpacesNavigationLink, .slidingSpacesNavigationDot";
          
          if($.trim(opts.linkClass) != ""){
            var linksClasses = linksClasses+", ."+opts.linkClass;
          }
          
          $(linksClasses).each(function(index){
            var $el = $(this);  
            
            $el.bind("click",function(event){
              clickEvent(event,$el);
              });
            
            $el.bind("touchstart",function(event){
              clickEvent(event,$el);
              });
          });
          
          revMob = function(){
            var oldWidth = displayWidth;
            var oldHeight = displayHeight;
            setMagicNumbers();
            refreshPositionMobile(oldWidth,oldHeight);
            if(opts.createMap){
              positionMap();
            }
            
          };
          
          if(!isMobile){
            $(window).resize(function(){
              revalidate();
            });
          }
            
            
          if("onorientationchange" in window){
            window.addEventListener("orientationchange", function() {
              if(window.orientation !== previousOrientation){
                      previousOrientation = window.orientation;
                      setTimeout(revMob,100);
                  }
              }, false);
          }
          
          function autoPlay(){
            if(play){
              clearTimeout(t);
              $("#slidingSpacesPlayerTimerIn").width("0%");
              refreshTimerBar(opts.autoSlideTime);
              $("#slidingSpacesPlayerPlayPause").attr("href","#"+findElementInStack(actualElementObject.id,"+").id);    
              autoPlayStartTime = new Date().getTime();
              clickEvent(null,$("#slidingSpacesPlayerPlayPause"));
              $("#slidingSpacesPlayerPlayPause").removeAttr("href");  
              t = setTimeout(autoPlay,opts.autoSlideTime);
            }
          }
                  
          function cancelTouch() {
            this.removeEventListener('touchmove', onTouchMove);
                  scrollStartX = null;
                  scrollStartY = null;
                  isMoving = false;
              }
          
          function clickEvent(event,$el){
            if(event != null){
              event.preventDefault();
            }
            
            $(elementToScroll).stop();
              
          var toMove = findElementById($el.attr("href").replace("#",""));
          var direction = null;
          var directionX = null;
          var directionY = null;
          var iRow = actualRow;
          var iColumn = actualCol;
          var axis = findElementByOffset(displayWidth,displayHeight).axis;
          
          var leftShift = toMove.column*(displayWidth);
          var topShift = toMove.row*(displayHeight);
          
          destroyEvent('startslide');
          triggerEvent('startslide',actualElementObject,toMove);
          
          if(axis == 'xy'){
            fireNavigationFeedback(actualCol,null,toMove.column,null);
            $(elementToScroll).animate({
              scrollLeft: leftShift
            },opts.time,opts.easing,function(){
              fireNavigationFeedback(null,iRow,null,toMove.row);
              $(elementToScroll).animate({
                scrollTop: topShift
              },opts.time,opts.easing,function(){
                initialPositionY = topShift;
                initialPositionX = leftShift;
                loadContent(toMove);
                
                destroyEvent('endslide');
                triggerEvent('endslide',actualElementObject,toMove);
                
                actualElementObject = toMove;
              });
              
            });
          }else if(axis == 'yx'){
            fireNavigationFeedback(null,iRow,null,toMove.row);
            $(elementToScroll).animate({
              scrollTop: topShift
            },opts.time,opts.easing,function(){
              fireNavigationFeedback(iColumn,null,toMove.column,null);
              $(elementToScroll).animate({
                scrollLeft: leftShift
              },opts.time,opts.easing,function(){
                initialPositionY = topShift;
                initialPositionX = leftShift;
                loadContent(toMove);
                
                destroyEvent('endslide');
                triggerEvent('endslide',actualElementObject,toMove);
                
                actualElementObject = toMove;
                
              });
            });
          }else{
            
            fireNavigationFeedback(iColumn,iRow,toMove.column,toMove.row);
            $(elementToScroll).animate({
              scrollTop: topShift,
              scrollLeft: leftShift
            },opts.time,opts.easing,function(){
              initialPositionY = topShift;
              initialPositionX = leftShift;
              loadContent(toMove);
              
              destroyEvent('endslide');
              triggerEvent('endslide',actualElementObject,toMove);
              
              actualElementObject = toMove;
            });
          }
          
          window.location.hash = "#!"+toMove.id;
          
          actualCol = toMove.column;
          actualRow = toMove.row;
          actualOffsetX = leftShift;
          actualOffsetY = topShift;
          
          if(opts.createMap){
            refreshMap($el.attr("href").replace("#",""));
          }
          }
          
          function createMap(){

            $(elementToScroll).append("<div id='slidingSpacesNavigationMap'></div>");
            var actualElementId = findElementByOffset(displayWidth,displayHeight).id;
                        
            if ($.trim(anchor) != "") {
              anchor2 = anchor.replace("#","");
              anchor2 = anchor2.replace("!","");
                var actualEl = findElementById(anchor2);
                actualElementId = actualEl.id;
              }
            
            for(var r=0;r<matrix.length;r++){
            for(var c=0;c<matrix[r].length;c++){
              var href = "";
              var id = "";
              var title = "";
              var rightClass = "slidingSpacesNavigationDot";
              
              if(matrix[r][c].full != 1){
                rightClass = "slidingSpacesNavigationDotEmpty";
              }else{
                if(matrix[r][c].id == actualElementId){
                  var rightClass = "slidingSpacesNavigationDotActual";
                }else{
                  if(!isMobile){
                    var href= "href='#"+matrix[r][c].id+"'";
                  }
                }
              }
              
              if(typeof(matrix[r][c].id) != "undefined"){
                id = "id='slidingSpacesNavigationDot_"+matrix[r][c].id+"'";
              }
              if(typeof($("#"+matrix[r][c].id).attr("title")) != "undefined"){
                title = "title='"+$("#"+matrix[r][c].id).attr("title")+"'";
              }
              $("#slidingSpacesNavigationMap").append("<a "+id+" class='"+rightClass+"' "+href+" "+title+"></a>");
            }
            
            $("#slidingSpacesNavigationMap").append("<br clear='all'/>");
          }
            
            if(opts.tips){
              var tipOuter = $('<div id="slidingSpacesTipOuter"></div>');
            var tipContent = $('<div id="slidingSpacesTipContent"></div>');
            var tipArrow = $('<div id="slidingSpacesTipArrow"></div>');
            var tipArrowInner = $('<div id="slidingSpacesTipArrowInner"></div>');
            tipArrow.append(tipContent).append(tipArrowInner);
            tipOuter.append(tipContent).append(tipArrow);
            $("#slidingSpacesNavigationMap").append(tipOuter);
            //var tipTitle = null;
            
              $(".slidingSpacesNavigationDot, .slidingSpacesNavigationDotActual").hover(function(event){
                $(this).data('tipTitle', '');
                var tipTitle = $(this).attr('title');
                $(this).data('tipTitle', tipTitle);
                $(this).removeAttr('title');
                var xDot = $(this).position().left;
                var yDot = $(this).position().top;
                var xDotAbsolute = $(this).offset().left;
                var yDotAbsolute = $(this).offset().top;
                var widthDot = $(this).outerWidth(true);
                var heightDot = $(this).outerHeight(true);
                var mapPositionArray = opts.mapPosition.split("_");
                
                
                $("#slidingSpacesTipOuter").animate({
                  opacity:0
                },0);
                $("#slidingSpacesTipOuter").show();
                $("#slidingSpacesTipContent").html(tipTitle);
                
                
                if(opts.tipsPosition == "top"){
                  var outerMLeft = xDot+(widthDot/2) - ($("#slidingSpacesTipContent").outerWidth(true)/2);
                  var outerMTop = yDot-(heightDot/2) - ($("#slidingSpacesTipContent").outerHeight(true))-5;
                  var arrowL = ($("#slidingSpacesTipContent").outerWidth(true)/2)-($("#slidingSpacesTipArrow").outerWidth(true)/2);
                  
                  $("#slidingSpacesTipOuter").addClass("tipTop");
        
                  $("#slidingSpacesTipOuter").css({
                    marginLeft: outerMLeft,
                    marginTop:  outerMTop     
                  });
                  
                  $("#slidingSpacesTipArrow").css({
                    left: arrowL      
                  });

                }else if(opts.tipsPosition == "right"){
                  var outerMLeft = xDot+widthDot+5;
                  var outerMTop = yDot+(heightDot/2)-($("#slidingSpacesTipContent").outerHeight(true)/2);
                  var arrowL = -$("#slidingSpacesTipArrow").outerWidth(true)+5;
                  var arrowT = ($("#slidingSpacesTipContent").outerHeight(true)/2)-($("#slidingSpacesTipArrow").outerHeight(true)/2);
                  
                  $("#slidingSpacesTipOuter").addClass("tipRight");
        
                  $("#slidingSpacesTipOuter").css({
                    marginLeft: outerMLeft,
                    marginTop:  outerMTop     
                  });
                  
                  $("#slidingSpacesTipArrow").css({
                    left: arrowL,
                    top:arrowT    
                  });

                  
                }else if(opts.tipsPosition == "left"){
                  var outerMLeft = -($("#slidingSpacesTipContent").outerWidth(true))-5;
                  var outerMTop = yDot+(heightDot/2)-($("#slidingSpacesTipContent").outerHeight(true)/2);
                  var arrowL = $("#slidingSpacesTipContent").outerWidth(true);
                  var arrowT = ($("#slidingSpacesTipContent").outerHeight(true)/2)-($("#slidingSpacesTipArrow").outerHeight(true)/2);
                  
                  $("#slidingSpacesTipOuter").addClass("tipLeft");
        
                  $("#slidingSpacesTipOuter").css({
                    marginLeft: outerMLeft,
                    marginTop:  outerMTop     
                  });
                  
                  $("#slidingSpacesTipArrow").css({
                    left: arrowL,
                    top:arrowT    
                  });
                  
                }else if(opts.tipsPosition == "bottom"){
                  var outerMLeft = xDot+(widthDot/2) - ($("#slidingSpacesTipContent").outerWidth(true)/2);
                  var outerMTop = yDot+(heightDot/2) + ($("#slidingSpacesTipContent").position().top)+10;
                  var arrowL = ($("#slidingSpacesTipContent").outerWidth(true)/2)-($("#slidingSpacesTipArrow").outerWidth(true)/2);
                  var arrowT = -($("#slidingSpacesTipArrow").outerHeight(true))+5;
                  
                  $("#slidingSpacesTipOuter").addClass("tipBottom");
        
                  $("#slidingSpacesTipOuter").css({
                    marginLeft: outerMLeft,
                    marginTop:  outerMTop     
                  });
                  
                  $("#slidingSpacesTipArrow").css({
                    left: arrowL,
                    top:arrowT      
                  });
                }
                
                if($(this).hasClass("slidingSpacesNavigationDot")){
                  $("#slidingSpacesTipOuter").animate({
                    opacity:1
                  },400);
                }
                
    
                },function(event){
              $("#slidingSpacesTipContent").html("");
              $("#slidingSpacesTipOuter").hide();
                $(this).attr('title',$(this).data('tipTitle'));
              
              });

            }
            
            $("#slidingSpacesNavigationMap").bind("mouseover",function(event){
                $("#slidingSpacesNavigationMap").stop();
                $("#slidingSpacesNavigationMap").animate({
                    opacity:1
                  },200);
                });
          $("#slidingSpacesNavigationMap").bind("mouseleave",function(event){
            $("#slidingSpacesNavigationMap").stop();
            $("#slidingSpacesNavigationMap").animate({
                opacity:0.5
              },0);
            });
            
            positionMap();
          }
          
          function createPlayer(dspPlayer){
            var autoPlayClass = "Play";
            if(opts.autoSlide){
              autoPlayClass = "Pause";
            }
            
            var suffixPlayer = "light";
            
            if(opts.playerTheme == "dark"){
              suffixPlayer = opts.playerTheme;
            }
            
            $(elementToTrigger).append("<div id='slidingSpacesPlayer'><div id='slidingSpacesPlayerPrev'><img src='img/prev_"+suffixPlayer+".png' alt=''/></div><div id='slidingSpacesPlayerPlayPause' class='"+autoPlayClass+"'><img src='img/pause_"+suffixPlayer+".png' alt=''/></div><div id='slidingSpacesPlayerNext'><img src='img/next_"+suffixPlayer+".png' alt=''/></div></div>");
            
            if(!dspPlayer){
              $("#slidingSpacesPlayerPrev").css("display","none");
              $("#slidingSpacesPlayerPlayPause").css("display","none");
              $("#slidingSpacesPlayerNext").css("display","none");
              $("#slidingSpacesPlayer").height(0);
            }
            
            $("#slidingSpacesPlayerPlayPause img").bind("click",function(event){
              event.preventDefault();
              if($("#slidingSpacesPlayerPlayPause").attr("class") == "playerPlay"){
                  $("#slidingSpacesPlayerPlayPause").attr("class","playerPause");
                  $("#slidingSpacesPlayerPlayPause img").attr("src","img/pause_"+suffixPlayer+".png");
                  play = true;
                  
                  
                  if(opts.createTimeBar){
                    refreshTimerBar(timeLeft);
                  }
                  autoPlayStartTime = new Date().getTime();
                  t = setTimeout(autoPlay,timeLeft);
                  
                  timeLeft = opts.autoSlideTime;
                  
                }else{
                  $("#slidingSpacesPlayerPlayPause").attr("class","playerPlay");
                  $("#slidingSpacesPlayerPlayPause img").attr("src","img/play_"+suffixPlayer+".png");
                  play = false;
                  
                  clearTimeout(t);
                  if(opts.createTimeBar){
                    refreshTimerBar(null);
                  }
                  timeLeft = opts.autoSlideTime-(new Date().getTime()-autoPlayStartTime);
                  
                }
            });
            
            $("#slidingSpacesPlayerPrev").bind("click",function(event){
              $("#slidingSpacesPlayerPrev").attr("href","#"+findElementInStack(actualElementObject.id,"-").id);
              clearTimeout(t);
              if(opts.createTimeBar){
                refreshTimerBar(opts.autoSlideTime);
              }
              if(play){
                t = setTimeout(autoPlay,0);
                $("#slidingSpacesPlayerPrev").removeAttr("href");
              }else{    
                  autoPlayStartTime = new Date().getTime();
                  clickEvent(null,$("#slidingSpacesPlayerPrev"));
                  $("#slidingSpacesPlayerPrev").removeAttr("href"); 
              }
            });
            
            $("#slidingSpacesPlayerNext").bind("click",function(event){
              $("#slidingSpacesPlayerNext").attr("href","#"+findElementInStack(actualElementObject.id,"+").id);
              if(opts.createTimeBar){
                refreshTimerBar(opts.autoSlideTime);
              }
              clearTimeout(t);
              if(play){
                t = setTimeout(autoPlay,0);
                $("#slidingSpacesPlayerNext").removeAttr("href");
              }else{
                autoPlayStartTime = new Date().getTime();
                  clickEvent(null,$("#slidingSpacesPlayerNext"));
                  $("#slidingSpacesPlayerNext").removeAttr("href"); 
              }
            });
            
            positionPlayer();
          }
          
          function createSensibleAreas(){
            
            $(elementToScroll).append("<div id='slidingSpacesSensibleArea_up' class='slidingSpacesSensibleArea'><a href='javascript:void(0);'></a></div>");
            $(elementToScroll).append("<div id='slidingSpacesSensibleArea_right' class='slidingSpacesSensibleArea'><a href='javascript:void(0);'></a></div>");
            $(elementToScroll).append("<div id='slidingSpacesSensibleArea_down' class='slidingSpacesSensibleArea'><a href='javascript:void(0);'></a></div>");
            $(elementToScroll).append("<div id='slidingSpacesSensibleArea_left' class='slidingSpacesSensibleArea'><a href='javascript:void(0);'></a></div>");
            
            if(elementToScroll != "html,body"){
              $("#slidingSpacesSensibleArea_up").width($(elementToScroll).width());
              $("#slidingSpacesSensibleArea_up").offset({
                top:$(elementToScroll).offset().top+
                eval($(elementToScroll).css("border-top-width").replace("px",""))
              });
              
              $("#slidingSpacesSensibleArea_right").height($(elementToScroll).height());
              $("#slidingSpacesSensibleArea_right").offset({
                left:$(elementToScroll).width()+
                    $(elementToScroll).offset().left-
                    $("#slidingSpacesSensibleArea_right").width()+
                    eval($(elementToScroll).css("border-right-width").replace("px",""))
              });
              
              $("#slidingSpacesSensibleArea_down").width($(elementToScroll).width());
              $("#slidingSpacesSensibleArea_down").offset({
                top:$(elementToScroll).height()+
                  $(elementToScroll).offset().top-
                  $("#slidingSpacesSensibleArea_down").height()+
                eval($(elementToScroll).css("border-bottom-width").replace("px",""))
                });
              
              $("#slidingSpacesSensibleArea_left").height($(elementToScroll).height());
              $("#slidingSpacesSensibleArea_left").offset({
                left:$(elementToScroll).offset().left+
                eval($(elementToScroll).css("border-left-width").replace("px",""))
                
              });
            }
            
            $(".slidingSpacesSensibleArea").css("z-index",1);
            $(".slidingSpacesSensibleArea").fadeTo(0,0);
            
            $(".slidingSpacesSensibleArea").mouseover(function(){
              $(this).stop();
              var actualEl = findElementByOffset(displayWidth,displayHeight);
              var directionArray = $(this).attr("id").split("_");
              var nextSensRow = actualEl.row;
              var nextSensColumn = actualEl.column;
              
              if(directionArray[1] == "up"){
                nextSensRow--;
              }else if(directionArray[1] == "right"){
                nextSensColumn++;
              }else if(directionArray[1] == "down"){
                nextSensRow++;
              }else if(directionArray[1] == "left"){
                nextSensColumn--;
              }
              
              var toMoveSens = findElementByPosition(nextSensRow,nextSensColumn);
              if(toMoveSens.id != null){
                $(this).fadeTo(200,0.4);
                $(this).children("a").attr("href","#"+toMoveSens.id);
                
                $sens = $(this).children("a");
                $(this).bind("click",function(event){
                    clickEvent(event,$sens);
                    $(this).fadeTo(0,0);
                    });
              }             
            });
            
            $(".slidingSpacesSensibleArea").mouseout(function(){
              $(this).stop();
              $(this).fadeTo(200,0);
            });
          }
          
          function createTimeBar(){
            if($("#slidingSpacesPlayer").length > 0){
              $("#slidingSpacesPlayer").append("<br/><div id='slidingSpacesPlayerTimerOut'><div id='slidingSpacesPlayerTimerIn'></div></div>");
            }else{
              createPlayer(false);
              $("#slidingSpacesPlayer").append("<div id='slidingSpacesPlayerTimerOut'><div id='slidingSpacesPlayerTimerIn'></div></div>");
            }
          }
          
          function destroyEvent(eventName){
            $(elementToTrigger).unbind(eventName);
          }
           
          
          function findElementById(clicked){
            var found = false;
            var toReturn = {id:null,column:-1,row:-1};
            $.each(matrixOrder,function(index){
              if(!found){
                if(matrixOrder[index].id == clicked){
                  toReturn = matrixOrder[index];
                  found = true;
                }
              }
            });
            return toReturn;
          }
          
          function findElementByOffset(oldWidth,oldHeight){
            var found = false;
            var toReturn = {id:null,row:-1,column:-1};
            
            $.each(matrixOrder,function(index){
              if(!found){
                var topShift = matrixOrder[index].row*oldHeight;
                var leftShift = matrixOrder[index].column*oldWidth;
                
                if(topShift == actualOffsetY && leftShift == actualOffsetX){
                  toReturn = matrixOrder[index];            
                  found = true;
                }
              }
            });
            
            return toReturn;
          }
          
          function findElementByPosition(row,column){
            var found = false;
            var toReturn = {id:null,column:-1,row:-1};
            $.each(matrixOrder,function(index){
              if(!found){
                if(matrixOrder[index].column == column && matrixOrder[index].row == row){
                  toReturn = matrixOrder[index];
                  found = true;
                }
              }
            });
            
            return toReturn;
          }
          
          function findElementInStack(clicked,direction){
            var found = false;
            var toReturn = {id:null,column:-1,row:-1};
            var foundIndex = -1;
            $.each(matrixOrder,function(index){
              if(!found){
                if(matrixOrder[index].id == clicked){
                  foundIndex = index;
                  found = true;
                }
              }
            });
            
            if(direction == "+"){
              if(foundIndex+1 >= matrixOrder.length){
                foundIndex = 0;
              }else{
                foundIndex++;
              }
            }else{
              if(foundIndex-1 < 0){
                foundIndex = matrixOrder.length-1;
              }else{
                foundIndex--;
              }
            }
            
            return matrixOrder[foundIndex];
          }
          
          function fireNavigationFeedback(sColumn,sRow,eColumn,eRow){
            if(opts.feedbackArrows){
              var direction = null;
              var directionX = null;
              var directionY = null;

              if(sColumn > eColumn){
                directionX = "left";
                
              }else if(sColumn < eColumn){
                directionX = "right";
              }
              
              if(sRow > eRow){
                directionY = "up";
                
              }else if(sRow < eRow){
                directionY = "down";
              }
              
              if(directionY != null){
                direction = directionY;
              }
              if(directionX != null){
                if(direction != null){
                  direction += "_"+directionX;
                }else{
                  direction = directionX;
                }
              }
              
              if(direction != null){
                
                var iconName = "img/"+direction+"_arrow.png";
                
                $("#slidingSpacesNavigationFeedback").stop();
                $("#slidingSpacesNavigationFeedback").css({
                    backgroundImage: "url("+iconName+")",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center center",
                    opacity : "1",
                    "z-index" : 1000
                });
                
                $("#slidingSpacesNavigationFeedback").show();
                
                $("#slidingSpacesNavigationFeedback").animate({ 
                    opacity: "0",
                    "z-index" : "-100"
                  },1000,function(){
                    $("#slidingSpacesNavigationFeedback").hide();
                  }
                );
              }
            }
          }
          
          function getParentContainerId(elId){
            if(typeof($('#'+elId).parent().attr("class")) != "undefined" && $('#'+elId).parent().attr("class").indexOf(sliderClass) > -1){
              if(typeof($('#'+elId).parent().attr("id")) == "undefined"){
                $('#'+elId).parent().attr("id", "internal_"+(internalCounter++));
              }
              parentId = $('#'+elId).parent().attr("id");
            }else{
              if(typeof($('#'+elId).parent().attr("id")) == "undefined"){
                $('#'+elId).parent().attr("id", "internal_"+(internalCounter++));
              }
              getParentContainerId($('#'+elId).parent().attr("id"));
            }
          }
          
          function initializeWorkspace(els){
            
            if(opts.container == "none"){
              if(!isMobile){
                initialMobileHeight = document.documentElement.clientHeight;
                initialMobileWidth = document.documentElement.clientWidth;
              }else{
                var real_height = window.outerHeight; // the real, "physical" height of the device
                var real_width = window.outerWidth;
                var pixel_ratio = window.devicePixelRatio; // the pixel ratio
                initialMobileHeight = (real_height * pixel_ratio ); // the total height of a fullscreen page without adress
                initialMobileWidth = (real_width * pixel_ratio ); // the total width of a fullscreen page without adress
              }
            }
            
            setMagicNumbers();
                                
            var firstFound = false;
            var fi = false;
      
            if(typeof(opts.displace) == "object"){
              //display a mappa
              //primo giro per prendere il primo elemento
              matrix = opts.displace;
              var orderIndex = 0;
              for(var r=0 ; r<opts.displace.length ; r++){
                for(var c=0 ; c<opts.displace[r].length ; c++){
                  if(opts.displace[r][c].full == 1 && typeof(opts.displace[r][c].first) != "undefined"){
                    var ajax = false;
                    var loadC = true;
                    var direction = opts.axis;
                    
                    if(typeof(opts.displace[r][c].ajaxLoading) != "undefined"){
                      if(opts.displace[r][c].ajaxLoading){
                        ajax = true;
                        loadC = false;
                      }
                    }else{
                      if(opts.ajaxLoading){
                        ajax = true;
                        loadC = false;
                      }
                    }
                    
                    if($.trim(opts.displace[r][c].moveDirection) != ""){
                      direction = opts.displace[r][c].moveDirection;
                    }
                    
                    if(!firstFound){
                        fi = true;
                        firstFound = true;
                      }else{
                        fi = false;
                      }
                    
                    matrixOrder.push({
                      id : els[orderIndex].id,
                      first : fi,
                      row : r,
                      column : c,
                      ajaxLoading : ajax,
                      loadedContent : loadC,
                      axis : direction
                    });
                    
                    
                    
                    matrix[r][c].id = els[orderIndex].id;
                    initialPositionX = c*(displayWidth);
                    initialPositionY = r*(displayHeight);
                    actualCol = c;
                    actualRow = r;
                    orderIndex++;
                    if(matrixRows < r){
                      matrixRows = r;
                    }
                    if(matrixColumns < c){
                      matrixColumns = c;
                    }
                  }
                }
              }
              
              for(var r=0 ; r<opts.displace.length ; r++){
                for(var c=0 ; c<opts.displace[r].length ; c++){
                  if(opts.displace[r][c].full == 1 && typeof(opts.displace[r][c].first) == "undefined"){
                    if(orderIndex < els.length){
                      var ajax = false;
                      var loadC = true;
                      var direction = opts.axis;
                        
                        if(typeof(opts.displace[r][c].ajaxLoading) != "undefined"){
                          if(opts.displace[r][c].ajaxLoading){
                            ajax = true;
                            loadC = false;
                          }
                        }else{
                          if(opts.ajaxLoading){
                            ajax = true;
                            loadC = false;
                          }
                        }
                        
                        if($.trim(opts.displace[r][c].moveDirection) != ""){
                          direction = opts.displace[r][c].moveDirection;
                        }
                        
                        if(!firstFound){
                          fi = true;
                          firstFound = true;
                        }else{
                          fi = false;
                        }
                      
                      matrixOrder.push({
                        id : els[orderIndex].id,
                        first : fi,
                        row : r,
                        column : c,
                        ajaxLoading : ajax,
                        loadedContent : loadC,
                        axis : direction
                      });
                      if(matrixRows < r){
                        matrixRows = r;
                      }
                      if(matrixColumns < c){
                        matrixColumns = c;
                      }
                      matrix[r][c].id = els[orderIndex].id;
                      orderIndex++;
                    }
                  }
                }
              }
            }else{
              if(opts.displace == 'row'){
                //display a riga
                matrix[0] = new Array();
                for(f=0;f<els.length;f++){
                  var ajax = false;
                  var loadC = true;
                  
                if(opts.ajaxLoading){
                  ajax = true;
                  loadC = false;
                }
                
                if(!firstFound){
                  fi = true;
                  firstFound = true;
                }else{
                  fi = false;
                }
                
                  matrixOrder.push({
                    id : els[f].id,
                    first : fi,
                    row : 0,
                    column : f,
                    ajaxLoading : ajax,
                  loadedContent : loadC,
                  axis : opts.axis
                  });
                  
                  matrix[0].push({
                    id    : els[f].id,
                    full  : 1
                  });
                  matrixColumns++;
                }
              }else if(opts.displace == 'column'){
                //display a colonna
                matrix = new Array();
                for(var f=0;f<els.length;f++){
                  var ajax = false;
                  var loadC = true;
                  
                if(opts.ajaxLoading){
                  ajax = true;
                  loadC = false;
                }
                
                if(!firstFound){
                  fi = true;
                  firstFound = true;
                }else{
                  fi = false;
                }
                
                  matrixOrder.push({
                    id : els[f].id,
                    first : fi,
                    row : f,
                    column : 0,
                    ajaxLoading : ajax,
                  loadedContent : loadC,
                  axis : opts.axis
                  });
                  matrix[matrixRows] = new Array();
                  matrix[matrixRows][0] = {
                    id    : els[f].id,
                    full : 1
                  };
                  matrixRows++;
                }
              }
              
              
            }
            
            //swipe
                    if ('ontouchstart' in document.documentElement) {
                      if(elementToScroll == "html,body"){
                        document.addEventListener('touchstart', onTouchStart, false);
                      }else{
                        document.getElementById(elementToScroll.replace("#","")).addEventListener('touchstart', onTouchStart, false);
                      }
                    }
                    placeElements();
            }
          
          function isMobile(){
            if(( navigator.userAgent.toLowerCase().indexOf("android") >-1)
                || ( navigator.userAgent.toLowerCase().indexOf("blackberry9500")>-1) || ( navigator.userAgent.toLowerCase().indexOf("blackberry9530")>-1) || ( navigator.userAgent.toLowerCase().indexOf("cupcake") >-1) || ( navigator.userAgent.toLowerCase().indexOf("dream") >-1) || ( navigator.userAgent.toLowerCase().indexOf("incognito") >-1) || ( navigator.userAgent.toLowerCase().indexOf("iphone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ipod") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ipad") >-1) || ( navigator.userAgent.toLowerCase().indexOf("mini") >-1) || ( navigator.userAgent.toLowerCase().indexOf("webos") >-1) || ( navigator.userAgent.toLowerCase().indexOf("webmate") >-1) || ( navigator.userAgent.toLowerCase().indexOf("2.0 mmp") >-1) || ( navigator.userAgent.toLowerCase().indexOf("240×320") >-1) || ( navigator.userAgent.toLowerCase().indexOf("asus") >-1) || ( navigator.userAgent.toLowerCase().indexOf("au-mic") >-1) || ( navigator.userAgent.toLowerCase().indexOf("alcatel") >-1) || ( navigator.userAgent.toLowerCase().indexOf("amoi") >-1) || ( navigator.userAgent.toLowerCase().indexOf("audiovox") >-1) || ( navigator.userAgent.toLowerCase().indexOf("avantgo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("benq") >-1) || ( navigator.userAgent.toLowerCase().indexOf("bird") >-1) || ( navigator.userAgent.toLowerCase().indexOf("blackberry") >-1) || ( navigator.userAgent.toLowerCase().indexOf("blazer") >-1) || ( navigator.userAgent.toLowerCase().indexOf("cdm") >-1) || ( navigator.userAgent.toLowerCase().indexOf("cellphone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ddipocket") >-1) || ( navigator.userAgent.toLowerCase().indexOf("danger") >-1) || ( navigator.userAgent.toLowerCase().indexOf("docomo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("elaine/3.0") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ericsson") >-1) || ( navigator.userAgent.toLowerCase().indexOf("eudoraweb") >-1) || ( navigator.userAgent.toLowerCase().indexOf("fly") >-1) || ( navigator.userAgent.toLowerCase().indexOf("hp.ipaq") >-1) || ( navigator.userAgent.toLowerCase().indexOf("haier") >-1) || ( navigator.userAgent.toLowerCase().indexOf("huawei") >-1) || ( navigator.userAgent.toLowerCase().indexOf("iemobile") >-1) || ( navigator.userAgent.toLowerCase().indexOf("j-phone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("kddi") >-1) || ( navigator.userAgent.toLowerCase().indexOf("konka") >-1) || ( navigator.userAgent.toLowerCase().indexOf("kwc") >-1) || ( navigator.userAgent.toLowerCase().indexOf("kyocera/wx310k") >-1) || ( navigator.userAgent.toLowerCase().indexOf("lg") >-1) || ( navigator.userAgent.toLowerCase().indexOf("lg/u990") >-1) || ( navigator.userAgent.toLowerCase().indexOf("lenovo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("midp-2.0") >-1) || ( navigator.userAgent.toLowerCase().indexOf("mmef20") >-1) || ( navigator.userAgent.toLowerCase().indexOf("mot-v") >-1) || ( navigator.userAgent.toLowerCase().indexOf("mobilephone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("motorola") >-1) || ( navigator.userAgent.toLowerCase().indexOf("newgen") >-1) || ( navigator.userAgent.toLowerCase().indexOf("netfront") >-1) || ( navigator.userAgent.toLowerCase().indexOf("newt") >-1) || ( navigator.userAgent.toLowerCase().indexOf("nintendo wii") >-1) || ( navigator.userAgent.toLowerCase().indexOf("nitro") >-1) || ( navigator.userAgent.toLowerCase().indexOf("nokia") >-1) || ( navigator.userAgent.toLowerCase().indexOf("novarra") >-1) || ( navigator.userAgent.toLowerCase().indexOf("o2") >-1) || ( navigator.userAgent.toLowerCase().indexOf("opera mini") >-1) || ( navigator.userAgent.toLowerCase().indexOf("opera.mobi") >-1) || ( navigator.userAgent.toLowerCase().indexOf("pantech") >-1) || ( navigator.userAgent.toLowerCase().indexOf("pdxgw") >-1) || ( navigator.userAgent.toLowerCase().indexOf("pg") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ppc") >-1) || ( navigator.userAgent.toLowerCase().indexOf("pt") >-1) || ( navigator.userAgent.toLowerCase().indexOf("palm") >-1) || ( navigator.userAgent.toLowerCase().indexOf("panasonic") >-1) || ( navigator.userAgent.toLowerCase().indexOf("philips") >-1) || ( navigator.userAgent.toLowerCase().indexOf("playstation portable") >-1) || ( navigator.userAgent.toLowerCase().indexOf("proxinet") >-1) || ( navigator.userAgent.toLowerCase().indexOf("proxinet") >-1) || ( navigator.userAgent.toLowerCase().indexOf("qtek") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sch") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sec") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sgh") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sharp-tq-gx10") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sie") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sph") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sagem") >-1) || ( navigator.userAgent.toLowerCase().indexOf("samsung") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sanyo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sendo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sharp") >-1) || ( navigator.userAgent.toLowerCase().indexOf("small") >-1) || ( navigator.userAgent.toLowerCase().indexOf("smartphone") >-1) || ( navigator.userAgent.toLowerCase().indexOf("softbank") >-1) || ( navigator.userAgent.toLowerCase().indexOf("sonyericsson") >-1) || ( navigator.userAgent.toLowerCase().indexOf("symbian") >-1) || ( navigator.userAgent.toLowerCase().indexOf("symbian os") >-1) || ( navigator.userAgent.toLowerCase().indexOf("symbianos") >-1) || ( navigator.userAgent.toLowerCase().indexOf("ts21i-10") >-1) || ( navigator.userAgent.toLowerCase().indexOf("toshiba") >-1) || ( navigator.userAgent.toLowerCase().indexOf("treo") >-1) || ( navigator.userAgent.toLowerCase().indexOf("up.browser") >-1) || ( navigator.userAgent.toLowerCase().indexOf("up.link") >-1) || ( navigator.userAgent.toLowerCase().indexOf("uts") >-1) || ( navigator.userAgent.toLowerCase().indexOf("vertu") >-1) || ( navigator.userAgent.toLowerCase().indexOf("willcome") >-1) || ( navigator.userAgent.toLowerCase().indexOf("winwap") >-1) || ( navigator.userAgent.toLowerCase().indexOf("windows ce") >-1) || ( navigator.userAgent.toLowerCase().indexOf("windows.ce") >-1) || ( navigator.userAgent.toLowerCase().indexOf("xda") >-1) || ( navigator.userAgent.toLowerCase().indexOf("zte") >-1) || ( navigator.userAgent.toLowerCase().indexOf("dopod") >-1) || ( navigator.userAgent.toLowerCase().indexOf("hiptop") >-1) || ( navigator.userAgent.toLowerCase().indexOf("htc") >-1) || ( navigator.userAgent.toLowerCase().indexOf("i-mobile") >-1) || ( navigator.userAgent.toLowerCase().indexOf("nokia") >-1) || ( navigator.userAgent.toLowerCase().indexOf("portalmmm") >-1)){
              
              if(navigator.platform.toLowerCase().indexOf("win32") == -1 && navigator.platform.toLowerCase().indexOf("win64") == -1){
                return true;
              }else{
                return false;
              }
            }else{
              return false;
            }
          }
          
          function loadContent(element){
            if(element.ajaxLoading && !element.loadedContent){
              $("#slidingSpacesNavigationFeedback").stop();
            $("#slidingSpacesNavigationFeedback").css({
                backgroundColor: "#000000",
                backgroundImage: "url(img/throbber.gif)",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center center",
                opacity : "0.7",
                "z-index" : 1000
            });
            
            $("#slidingSpacesNavigationFeedback").show();
              $.ajax({
                url: opts.ajaxScript,
                data: "id="+element.id,
                success: function(data){
                  element.loadedContent = true;
                  $("#"+element.id).html("");
                    $("#"+element.id).append(data);
                    $("#slidingSpacesNavigationFeedback").css({ 
                    opacity: "0",
                    backgroundColor: 'transparent',
                    "z-index" : "-100"
                  });
                },
                error: function(err) {
                  
                }
              });
            }
          }
          
          function onTouchMove(e) {
                  if (isMoving) {
                    var x = e.touches[0].pageX,
                    dx = scrollStartX - x,
                    y = e.touches[0].pageY,
                    up = scrollStartY - y;
                    
                    var scrollTimeEnd = new Date().getTime();
                
                    var direction = null;
                    var swipeOk = false;
                    
                    if(e.touches[0].target.id == ""){
                    e.touches[0].target.id = "internal_"+(internalCounter++);
                  }
                    
                    var scrolledId = e.touches[0].target.id;
                    
                  getParentContainerId(scrolledId);
                  
                  if(Math.abs(dx) > Math.abs(up) && (Math.abs(dx) >= min_move_x)){
                      if(dx>=0){
                        direction = "right";
                        if($("#"+parentId).width() > displayWidth ) {
                          if($("#"+parentId).scrollLeft()>= $("#"+parentId).width()){
                            swipeOk = true;
                          }else{
                            swipeOk = false;
                          }
                        }else{
                          swipeOk = true;
                        }
                      }else{
                        direction = "left";
                        if($("#"+parentId).width() > displayWidth) {
                          if($("#"+parentId).scrollLeft() <= 0 ){
                            swipeOk = true;
                          }else{
                            swipeOk = false;
                          }
                        }else{
                          swipeOk = true;
                        }
                      }
                    }else if(Math.abs(dx) <= Math.abs(up) && (Math.abs(up) >= min_move_y)){
                      
                      if(up>=0){
                        direction = "down";
                        if($("#"+parentId).height() > displayHeight ) {
                          if($("#"+parentId).scrollTop()>= $("#"+parentId).height()){
                            swipeOk = true;
                          }else{
                            swipeOk = false;
                          }
                        }else{
                          swipeOk = true;
                        }
                        
                      }else{
                        direction = "up";
                        if($("#"+parentId).height() > displayHeight) {
                          if($("#"+parentId).scrollTop() <= 0 ){
                            swipeOk = true;
                          }else{
                            swipeOk = false;
                          }
                        }else{
                          swipeOk = true;
                        }
                      }
                    }
                    
                  
                    if(swipeOk) {
                      
                      //sleeps for 1/10 second to avoid android browser issues
                      var start = new Date().getTime();
                for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > 100){
                    break;
                }
              }
                      
                      cancelTouch();
                      $(elementToScroll).stop();

                  var p = findElementByOffset(displayWidth,displayHeight);
                  var toFindColumn = p.column;
                  var toFindRow = p.row;
                  if(direction == "right"){
                    toFindColumn++;
                  }else if(direction == "left"){
                    toFindColumn--;
                  }else if(direction == "up"){
                    toFindRow--;
                  }else if(direction == "down"){
                    toFindRow++;
                  }
                  
                  var toMove = findElementByPosition(toFindRow,toFindColumn);
                  
                  destroyEvent('startslide');
              triggerEvent('startslide',actualElementObject,toMove);
                  
                  var leftShift = toMove.column*(displayWidth);
                var topShift = toMove.row*(displayHeight);
                
                if(toMove.id != null){
                  loadContent(toMove);
                  
                  if(direction == "left" || direction == "right"){
                    $(elementToScroll).animate({
                      scrollLeft: leftShift
                    },opts.time,opts.easing,function(){
                      if(( navigator.userAgent.toLowerCase().indexOf("iphone") >-1) || 
                          ( navigator.userAgent.toLowerCase().indexOf("ipod") >-1) || 
                          ( navigator.userAgent.toLowerCase().indexOf("ipad") >-1)){
                        window.scrollTo(leftShift,topShift);
                      }
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    });
                  }else{
                    $(elementToScroll).animate({
                      scrollTop: topShift
                    },opts.time,opts.easing,function(){
                      if(( navigator.userAgent.toLowerCase().indexOf("iphone") >-1) || 
                          ( navigator.userAgent.toLowerCase().indexOf("ipod") >-1)|| 
                          ( navigator.userAgent.toLowerCase().indexOf("ipad") >-1)){
                        window.scrollTo(leftShift,topShift);
                      }
                      e.preventDefault();
                      e.stopPropagation();
                      return false;
                    });
                  }
                  refreshMap(toMove.id);
                  
                  destroyEvent('endslide');
                triggerEvent('endslide',actualElementObject,toMove);
                  
                  actualElementObject = toMove;
                  
                  actualCol = toMove.column;
                  actualRow = toMove.row;
                  actualOffsetX = leftShift;
                  actualOffsetY = topShift;
                  
                  window.location.hash = "#!"+toMove.id;
                  
                  var start = new Date().getTime();
                for (var i = 0; i < 1e7; i++) {
                  if ((new Date().getTime() - start) > 100){
                      break;
                  }
                }
                }
                    }else{
                    //sleeps for 1/10 second to avoid android browser issues
                      var start = new Date().getTime();
                for (var i = 0; i < 1e7; i++) {
                if ((new Date().getTime() - start) > 100){
                    break;
                }
              }
              //cancelTouch();
                      //$(elementToScroll).stop();
                      
                      $("#"+parentId).stop();
                      if(direction == "up" || direction == "down"){
                      distance = $("#"+parentId).scrollTop()+up;
                      $("#"+parentId).animate({
                    scrollTop: distance
                  },(scrollTimeEnd-scrollTimeStart));
                    }else{
                      distance = $("#"+parentId).scrollLeft()+dx;
                      $("#"+parentId).animate({
                    scrollLeft: distance
                  },(scrollTimeEnd-scrollTimeStart));
                    }
                    }
                  }
              }
              
              function onTouchStart(e) {  
              if(! $(e.target).is("input, textarea, a, select, button, img")){
                e.preventDefault();
                  e.stopPropagation();
                  
                  if (e.touches.length == 1) {
                    scrollTimeStart = new Date().getTime();
                    scrollStartX = e.touches[0].pageX;
                    scrollStartY = e.touches[0].pageY;
                    isMoving = true;
                    
                    document.addEventListener('touchmove', onTouchMove, false);
                  }
                  
                }else{
                  
                  document.addEventListener('touchmove', function(e){e.preventDefault();}, false);
                }
                
              }
          
          function placeElements(){
            if(elementToScroll == "html,body"){
              var elementToPlace = "body";
              elementToTrigger = "body";
            }else{
              var elementToPlace = elementToScroll;
              elementToTrigger = elementToScroll;
            }
            
            for(var m=0;m<matrixOrder.length;m++){
              elId = matrixOrder[m].id;
              var outerDivId = "slidingSpacesOuterDiv_"+elId;
              $(elementToPlace).append("<div id='"+outerDivId+"' class='slidingSpacesOuterDiv' data-role='content'></div>");
              
              $("#"+outerDivId).css("position","absolute");
              $("#"+outerDivId).css("overflow","hidden");
              $("#"+outerDivId).width(displayWidth);
              $("#"+outerDivId).height(displayHeight);
              $("#"+elId).appendTo("#"+outerDivId);
              
              $("#"+outerDivId).offset({
                top:(matrixOrder[m].row)*displayHeight+offsetY,
                left:(matrixOrder[m].column)*displayWidth+offsetX
              });
              
              if(opts.fullScreenBackground){
                if(opts.preloadBackgroundImages){
                  //preloadBackgroundImages();
                }
                setFullScreenBackground(matrixOrder[m]);
              }
                            
              //eventually load content via ajax if first element
              if(m == 0 && matrixOrder[m].ajaxLoading){
                loadContent(matrixOrder[m]);
              }
            }
          }
          
          function preloadBackgroundImages(){
            var cache = [];
            $(" ."+opts.backGroundImageClass).each(function(){
              var $img = $(this);
              var cacheImage = document.createElement('img');
                  cacheImage.src = $img.attr("src");
                  cache.push(cacheImage); 
            });
          }
          
          function positionMap(){
            //position the map
            $("#slidingSpacesNavigationMap").css("z-index",1000);
          var mapWidth = $("#slidingSpacesNavigationMap").outerWidth(true);
          var mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
          var mapInnerX = mapWidth-$("#slidingSpacesNavigationMap").width();
          var mapInnerY = mapHeight-$("#slidingSpacesNavigationMap").height();
          var elementToScrollTop = 0;
          var elementToScrollLeft = 0;
          var borderTop = 0;
          var borderRight = 0;
          var borderBottom = 0;
          var borderLeft = 0;
          
          if(opts.container != "none"){
            elementToScrollTop = $(elementToScroll).offset().top;
            elementToScrollLeft = $(elementToScroll).offset().left;
            borderTop = eval($(elementToScroll).css("border-top-width").replace("px",""));
            borderRight = eval($(elementToScroll).css("border-right-width").replace("px",""));
            borderBottom = eval($(elementToScroll).css("border-bottom-width").replace("px",""));
            borderLeft = eval($(elementToScroll).css("border-left-width").replace("px",""));
          }
                        
          if(opts.mapPosition.toLowerCase() == "top_left"){
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + borderTop,
              left  : elementToScrollLeft + borderLeft
            });
          }else if(opts.mapPosition.toLowerCase() == "top_center"){
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + borderTop,
              left  : elementToScrollLeft + ((displayWidth/2) - (mapWidth/2))
            });

          }else if(opts.mapPosition.toLowerCase() == "top_right"){
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + borderTop,
              left  : elementToScrollLeft + (displayWidth - mapWidth) - borderRight
            });
          }else if(opts.mapPosition.toLowerCase() == "center_right"){
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + ((displayHeight/2) - (mapHeight/2)),
              left  : elementToScrollLeft + (displayWidth - mapWidth) - borderRight
            });
          }else if(opts.mapPosition.toLowerCase() == "bottom_center"){
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + displayHeight - mapHeight - borderBottom,
              left  : elementToScrollLeft + ((displayWidth/2) - (mapWidth/2))
            });
          }else if(opts.mapPosition.toLowerCase() == "bottom_left"){
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + displayHeight - mapHeight - borderBottom,
              left  : elementToScrollLeft + borderLeft
            });
          }else if(opts.mapPosition.toLowerCase() == "center_left"){
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + ((displayHeight/2) - (mapHeight/2)),
              left  : elementToScrollLeft + borderLeft
            });
          }else if(opts.mapPosition.toLowerCase() == "center_center"){
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + ((displayHeight/2) - (mapHeight/2)),
              left  : elementToScrollLeft + ((displayWidth/2) - (mapWidth/2))
            });
          }else{
            $("#slidingSpacesNavigationMap").css({
              top   : elementToScrollTop + displayHeight - mapHeight - borderBottom,
              left  : elementToScrollLeft + displayWidth - mapWidth - borderRight
            });
          }
          $("#slidingSpacesNavigationMap").width(mapWidth-mapInnerX);
          $("#slidingSpacesNavigationMap").height(mapHeight-mapInnerY);
          }
          
          function positionPlayer(){
            $("#slidingSpacesPlayer").css("z-index",100);
            var playerWidth = $("#slidingSpacesPlayer").outerWidth(true);
          var playerHeight = $("#slidingSpacesPlayer").outerHeight(true);
          var mapHeight = 0;
          var mapWidth = 0;
          var playerTop = 0;
          var playerLeft = 0;
          var elementToScrollTop = 0;
          var elementToScrollLeft = 0;
          var elementToScrollBottom = $(elementToScroll).height();
          var elementToScrollRight = $(elementToScroll).width();
          var borderTop = 0;
          var borderRight = 0;
          var borderBottom = 0;
          var borderLeft = 0;
          var timeBarHeight = $("#slidingSpacesPlayerTimerOut").outerHeight(true);
          
          if(opts.container != "none"){
            var elementToScrollTop = $(elementToScroll).offset().top;
            var elementToScrollLeft = $(elementToScroll).offset().left;
            var elementToScrollBottom = $(elementToScroll).height();
            var elementToScrollRight = $(elementToScroll).width();
            borderTop = eval($(elementToScroll).css("border-top-width").replace("px",""));
            borderRight = eval($(elementToScroll).css("border-right-width").replace("px",""));
            borderBottom = eval($(elementToScroll).css("border-bottom-width").replace("px",""));
            borderLeft = eval($(elementToScroll).css("border-left-width").replace("px",""));
          }
          
          if(opts.createPlayer && opts.playerPosition == "bottom_center"){
            mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
            playerTop = elementToScrollTop + displayHeight - mapHeight - playerHeight - 10 - borderBottom;
            playerLeft = elementToScrollLeft + ((displayWidth/2) - (playerWidth/2));
          }else if(opts.createPlayer && opts.playerPosition == "bottom_left"){
            mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
            playerTop = elementToScrollTop + displayHeight - mapHeight - playerHeight - 10 - borderBottom;
            playerLeft = elementToScrollLeft + 0 + borderLeft;
          }else if(opts.createPlayer && opts.playerPosition == "bottom_right"){
            mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
            mapWidth = $("#slidingSpacesNavigationMap").outerWidth(true);
            playerTop = elementToScrollTop + displayHeight - mapHeight - playerHeight - 10 - borderBottom;
            playerLeft = elementToScrollRight - playerWidth - borderRight;
          }else if(opts.createPlayer && opts.playerPosition == "top_center"){
            mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
            playerTop =  elementToScrollTop + mapHeight + 10 + borderTop;
            playerLeft = elementToScrollLeft + ((displayWidth/2) - (playerWidth/2));
          }else if(opts.createPlayer && opts.playerPosition == "top_left"){
            mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
            playerTop =  elementToScrollTop + mapHeight + 10 + borderTop;
            playerLeft = elementToScrollLeft + 0 + borderLeft;
          }else if(opts.createPlayer && opts.playerPosition == "top_right"){
            mapHeight = $("#slidingSpacesNavigationMap").outerHeight(true);
            mapWidth = $("#slidingSpacesNavigationMap").outerWidth(true);
            playerTop = elementToScrollTop + mapHeight + 10 + borderTop;
            playerLeft = elementToScrollRight - playerWidth - borderRight;
          }
          
          $("#slidingSpacesPlayer").css({
            top   : playerTop,
            left  : playerLeft
          });
          
          }
          
          function positionSensibleAreas(){
            if(elementToScroll != "html,body"){
              $("#slidingSpacesSensibleArea_up").width($(elementToScroll).width());
              $("#slidingSpacesSensibleArea_up").offset({
                top:$(elementToScroll).offset().top+
                eval($(elementToScroll).css("border-top-width").replace("px",""))
              });
              
              $("#slidingSpacesSensibleArea_right").height($(elementToScroll).height());
              $("#slidingSpacesSensibleArea_right").offset({
                left:$(elementToScroll).width()+
                    $(elementToScroll).offset().left-
                    $("#slidingSpacesSensibleArea_right").width()+
                    eval($(elementToScroll).css("border-right-width").replace("px",""))
              });
              
              $("#slidingSpacesSensibleArea_down").width($(elementToScroll).width());
              $("#slidingSpacesSensibleArea_down").offset({
                top:$(elementToScroll).height()+
                  $(elementToScroll).offset().top-
                  $("#slidingSpacesSensibleArea_down").height()+
                eval($(elementToScroll).css("border-bottom-width").replace("px",""))
                });
              
              $("#slidingSpacesSensibleArea_left").height($(elementToScroll).height());
              $("#slidingSpacesSensibleArea_left").offset({
                left:$(elementToScroll).offset().left+
                eval($(elementToScroll).css("border-left-width").replace("px",""))
                
              });
            }
          }
          
          function refreshMap(actualElementId){
            $("#slidingSpacesNavigationMap a").each(function(index) {
              $dot = $(this); 
              var id = ""; 
              if(typeof($dot.attr("id")) != "undefined"){
                id = $dot.attr("id").split("_");
              }
            if(id.length == 2){
                if(id[1] == actualElementId){
                $dot.attr("class","slidingSpacesNavigationDotActual");
                $dot.attr("href","");
              }else{
                $dot.attr("class","slidingSpacesNavigationDot");
                $dot.attr("href","#"+id[1]);
              }
            }
            });
            
            $(".slidingSpacesNavigationDot").each(function(index){
              var $el2 = $(this); 
              $el2.unbind("click");
              $el2.unbind("touchstart");
              $el2.bind("touchstart",function(event){
                  clickEvent(event,$el);
                  });
              if(!isMobile){
                $el2.bind("click",function(event){
                  clickEvent(event,$el2);
                });
              }else{
                $el2.removeAttr("href");
              }
            });
            
            $(".slidingSpacesNavigationDotActual").each(function(index){
              
              var $el2 = $(this);
              
              $el2.unbind("click");
              $el2.unbind("touchstart");
              $el2.removeAttr("href");
            });
            
          }
          
          function refreshPosition(oldWidth,oldHeight){
            zIndex = -1000;
            var actualElement = findElementByOffset(oldWidth,oldHeight);
            
            for(i=0;i<matrixOrder.length;i++){
              var shiftX = matrixOrder[i].column*(displayWidth);
              var shiftY = matrixOrder[i].row*(displayHeight);
              var actualId = matrixOrder[i].id;
              var outerDivId = "slidingSpacesOuterDiv_"+actualId;
              $("#"+outerDivId).stop();
              $("#"+outerDivId).width(displayWidth);
              $("#"+outerDivId).height(displayHeight);

              if(shiftY > 0){
                var topS = shiftY+((displayHeight-oldHeight))*(matrixOrder[i].row);
                if(elementToScroll != "html,body"){
                  topS = $("#"+outerDivId).offset().top+((displayHeight-oldHeight)*(matrixOrder[i].row));
                }
                /*$("#"+outerDivId).offset({
                  top:topS
                });*/
                $("#"+outerDivId).animate({
                  top:topS
                },100,'linear');
              }
              
              if(shiftX > 0){
                var leftS = shiftX+((displayWidth-oldWidth))*(matrixOrder[i].column);
                if(elementToScroll != "html,body"){
                  leftS = $("#"+outerDivId).offset().left+((displayWidth-oldWidth)*(matrixOrder[i].column));
                }
                $("#"+outerDivId).offset({
                  left:leftS
                });
              }
              if(opts.fullScreenBackground){
                scaleBackground($("#"+matrixOrder[i].id+" ."+opts.backGroundImageClass));
              }
            }
            
            $("#slidingSpacesNavigationFeedback").width(displayWidth);
            $("#slidingSpacesNavigationFeedback").height(displayHeight);
            
            if(actualElement.id != null){
              var reActualElement = findElementById(actualElement.id);
              
              $(elementToScroll).animate({
                scrollTop: reActualElement.row*displayHeight,
                scrollLeft: reActualElement.column*displayWidth
              },0);
              actualOffsetX = reActualElement.column*displayWidth;
              actualOffsetY = reActualElement.row*displayHeight;
            }
          }
          
          function refreshPositionMobile(oldWidth,oldHeight){
            zIndex = -1000;
            var actualElement = findElementByPosition(actualRow,actualCol);
            
            for(i=0;i<matrixOrder.length;i++){
              var shiftX = matrixOrder[i].column*(displayWidth);
              var shiftY = matrixOrder[i].row*(displayHeight);
              var actualId = matrixOrder[i].id;
              var outerDivId = "slidingSpacesOuterDiv_"+actualId;
              
              $("#"+outerDivId).width(displayWidth);
              $("#"+outerDivId).height(displayHeight);
              
              if(shiftY > 0){
                var topS = shiftY;
                if(elementToScroll != "html,body"){
                  topS += $(elementToScroll).offset().top;
                }
                $("#"+outerDivId).offset({
                  top:topS
                });
              }
              
              if(shiftX > 0){
                var leftS = shiftX;
                if(elementToScroll != "html,body"){
                  leftS += $(elementToScroll).offset().left;
                }
                $("#"+outerDivId).offset({
                  left:leftS
                });
              }
              if(opts.fullScreenBackground){
                scaleBackground($("#"+matrixOrder[i].id+" ."+opts.backGroundImageClass));
              }
            }
            
            $("#slidingSpacesNavigationFeedback").width(displayWidth);
            $("#slidingSpacesNavigationFeedback").height(displayHeight);
            
            if(actualElement.id != null){
              var reActualElement = findElementById(actualElement.id);
              
              window.scrollTo(reActualElement.column*displayWidth,reActualElement.row*displayHeight);
              
              actualOffsetX = reActualElement.column*displayWidth;
              actualOffsetY = reActualElement.row*displayHeight;
            }
          }
          
          function refreshTimerBar(time){
            $("#slidingSpacesPlayerTimerIn").stop();
            if(play){
              $("#slidingSpacesPlayerTimerIn").animate({
                width:"100%"
              },time,'linear');
            }
          }
          
          function revalidate(){
            var oldWidth = displayWidth;
            var oldHeight = displayHeight;
            setMagicNumbers();
            refreshPosition(oldWidth,oldHeight);
            if(opts.createMap){
              positionMap();
            }
            
            if(opts.createSensibleAreas){
              positionSensibleAreas();
            }
            
            if(opts.createPlayer && opts.autoSlide){
              positionPlayer();
            }else if(opts.createTimeBar){
              positionPlayer();
            }
          }
          
          
                  
          function scaleBackground(element){
            w = element.width();
            h = element.height();
            var ratio = h / w;            
            
            if ((displayHeight/displayWidth) > ratio){
              element.height(displayHeight);
              element.width(displayHeight / ratio);
            } else {
              element.width(displayWidth);
              element.height(displayWidth * ratio);
            }
          
            // Center the image
            zIndex += zIndexDecrement;
            zIndexDecrement--;
            element.css('position','absolute');
            element.css('float','left');
            element.css('z-index',zIndex);
            element.css('left', (displayWidth - element.width())/2);
            element.css('top', (displayHeight - element.height())/2);
          }
          
          function setFullScreenBackground(element){
            var backgroundImage = $("#"+element.id+" ."+opts.backGroundImageClass);
            var w = 0;
            var h = 0;
            
            $(backgroundImage).load(function(){
                scaleBackground($(this));
              }).error(function (){
                 $(this).remove();
            });
          } 
          
          function setMagicNumbers(){
            if(opts.container == "none"){
              if(isMobile){
                if(( navigator.userAgent.toLowerCase().indexOf("iphone") >-1) || 
                    ( navigator.userAgent.toLowerCase().indexOf("ipod") >-1)){
                    if(window.orientation == 0 || window.orientation == 180){
                      var real_width = (screen.width*window.devicePixelRatio);
                        var real_height =  (screen.height-64)*window.devicePixelRatio;
                    }else{
                      //542
                      var real_height = ((screen.width-49)*window.devicePixelRatio);
                        var real_width =  (screen.height*window.devicePixelRatio);
                    }
                    
                }else{
                  var real_height = window.outerHeight/window.devicePixelRatio;
                var real_width = window.outerWidth/window.devicePixelRatio;
                }
                
                displayHeight = Math.round((real_height)); // the total height of a fullscreen page without adress
                displayWidth = Math.round((real_width)); // the total width of a fullscreen page without adress 
              }else{
                displayWidth = $(window).width();
                displayHeight = $(window).height();
              }
              
              offsetX = 0;
              offsetY = 0;
              elementToScroll = "html,body";
            }else{
              if(isMobile){
                var real_height = $(opts.container).outerHeight(true); // the real, "physical" height of the device
                var real_width = $(opts.container).outerWidth(true);
                var pixel_ratio = window.devicePixelRatio; // the pixel ratio
                
                displayHeight = Math.round((real_height)); // the total height of a fullscreen page without adress
                displayWidth = Math.round((real_width)); // the total width of a fullscreen page without adress
                offsetX = $(opts.container).offset().left;
                  offsetY = $(opts.container).offset().top;
                  elementToScroll = opts.container;
              }else{
                displayWidth = $(opts.container).outerWidth(true);
                  displayHeight = $(opts.container).outerHeight(true);
                  offsetX = $(opts.container).offset().left;
                  offsetY = $(opts.container).offset().top;
                  elementToScroll = opts.container;
              }
            }
          }
          
          function shiftAllButFirst(xShift,yShift){
            for(i=1;i<matrixOrder.length;i++){
              var outerDivId = "slidingSpacesOuterDiv_"+matrixOrder[i].id;
              if(yShift != null){
                $("#"+outerDivId).offset({
                  top:yShift+(displayHeight)*(matrixOrder[i].row)
                });
              }
              if(opts.fullScreenBackground){
                scaleBackground($("#"+matrixOrder[i].id+" ."+opts.backGroundImageClass));
              }
            }
          }
          
          function triggerEvent(eventName,toStart,toMove){
            $.event.moveTo = toMove;
            $.event.moveFrom = toStart;
            $(elementToTrigger).trigger(eventName);
          }

            } 
    };

    $.fn.ferroSlider = function(arguments) {
      return methods.ferroSliderDesktop.call(this,arguments);
    };
})( jQuery );