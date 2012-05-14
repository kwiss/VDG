((window, undefined_) ->
  Page = (->
    $container = $("#hs-container")
    $scroller = $container.find("div.hs-content-scroller")
    $articles = $container.find("div.hs-content-wrapper > article")
    scrollOptions =
      verticalGutter: 0
      hideFocus: true

    init = ->
      _initCustomScroll()
      _initEvents()

    _initCustomScroll = ->
      $articles.jScrollPane scrollOptions  if $(window).width() > 715

    _initEvents = ->
      _initWindowEvents()

    _initWindowEvents = ->
      $(window).on smartresize: (event) ->
        $("article.hs-content").each ->
          $article = $(this)
          aJSP = $article.data("jsp")
          if $(window).width() > 715
            (if (aJSP is `undefined`) then $article.jScrollPane(scrollOptions) else aJSP.reinitialise())
            _initArticleEvents()
          else
            aJSP.destroy()  if aJSP isnt `undefined`
            $container.off "click", "article.hs-content"

    init: init
  )()
  Page.init()
) window