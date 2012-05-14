window.log = ->
  log.history = log.history or []
  log.history.push arguments
  if @console
    arguments.callee = arguments.callee.caller
    console.log Array::slice.call(arguments)

jQuery ($) ->
  $(".slidingSpaces").ferroSlider
    easing: "easeInQuad"
    container: "#wrapper"
    fullScreenBackground: true
    autoSlide: true
    autoSlideTime: '5000'
    displace: 'column'
    backGroundImageClass: "bg"
    linkClass: "nav"

    pane_state = 2
    
    $("#close").click ->
      if pane_state is 1
        $(".hs-content-scroller").animate
          marginLeft: "-386px"
          easing: "easeInQuad"
        , 500
        pane_state = 2
      else if pane_state is 2
        $(".hs-content-scroller").animate
          marginLeft: "0"
          easing: "easeInQuad"
        , 500
        pane_state = 1

    $(document).bind "startslide", ->
      if $.event.moveFrom.id == "div3"
        $(".hs-content-scroller").animate
          marginLeft: "-386px"
          easing: "easeInQuad"
        , 500
        pane_state = 2
    $(document).bind "endslide", ->
      if $.event.moveTo.id == "div3"
       $(".hs-content-scroller").animate
          marginLeft: "0px"
          easing: "easeInQuad"
        , 500
        pane_state = 1