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

    $("#close").click ->
    if pane_state is 1
      $("#side_pannel").animate
        marginLeft: "0"
        easing: "easeInQuad"
      , 500
      pane_state = 2
    else if pane_state is 2
      $("#side_pannel").animate
        marginLeft: "381px"
        easing: "easeInQuad"
      , 500
      pane_state = 1

    $(document).bind "startslide", ->
      if $.event.moveFrom.id == "div3"
        $("#side_pannel").animate
          marginLeft: "0"
          easing: "easeInQuad"
        , 500
        pane_state = 2
    $(document).bind "endslide", ->
      if $.event.moveTo.id == "div3"
       $("#side_pannel").animate
          marginLeft: "381px"
          easing: "easeInQuad"
        , 500
        pane_state = 1