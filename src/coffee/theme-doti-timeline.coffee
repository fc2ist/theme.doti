class listPager
  constructor:(@target, @range = 10)->
    if @target.length < 1 then return
    _build.apply(this)
  
  _build = ->
    self = this
    wrap = $('<div class="pagination" />').insertAfter(@target.parent())
    @pager = $('<ul />').appendTo(wrap)
    .off('click', 'a')
    .on('click', 'a', (event)->
      event.preventDefault()
      _change.apply(self, [$(this).text()-0])
    )
    @total = Math.ceil(@target.length/@range)
    @current = -1
    for i in [1..@total]
      c = if i == 1 then ' class="active"' else ''
      $('<li'+c+'><a href="javascript:;">'+i+'</a></li>').appendTo(@pager)
    _change.apply(self, [1])

  _change = (page)->
    if @current == page then return
    @current = page
    range = @range
    @target.addClass('inv').fadeOut(200).filter((n)->
      if n < page * range && n >= (page-1) * range
        return true
      return false
    ).removeClass('inv').fadeIn(200)
    @pager.children('li.active').removeClass('active')
    @pager.children('li').eq(page-1).addClass('active')
    @target.parent().trigger('changed');

$(->
  reaction = $('.reaction .articles').addClass('timeline')
  columnWidth = Math.floor(reaction.width()/2) - 30
  articles = reaction.children('article').css('width', columnWidth)
  reaction.masonry({
    'itemSelector': 'article:not(.inv)'
  })
  .on('changed', ->
    $(this).masonry('reload')
    articles.each(->
      e = $(this)
      if e.css('left') == '0px'
        e.addClass('left').removeClass('right')
      else
        e.addClass('right').removeClass('left')
    )
  )
  new listPager(articles)
)