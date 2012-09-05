(function() {
  var listPager;

  listPager = (function() {
    var _build, _change;

    function listPager(target, range) {
      this.target = target;
      this.range = range != null ? range : 10;
      if (this.target.length < 1) return;
      _build.apply(this);
    }

    _build = function() {
      var c, i, self, wrap, _ref;
      self = this;
      wrap = $('<div class="pagination" />').insertAfter(this.target.parent());
      this.pager = $('<ul />').appendTo(wrap).off('click', 'a').on('click', 'a', function(event) {
        event.preventDefault();
        return _change.apply(self, [$(this).text() - 0]);
      });
      this.total = Math.ceil(this.target.length / this.range);
      this.current = -1;
      for (i = 1, _ref = this.total; 1 <= _ref ? i <= _ref : i >= _ref; 1 <= _ref ? i++ : i--) {
        c = i === 1 ? ' class="active"' : '';
        $('<li' + c + '><a href="javascript:;">' + i + '</a></li>').appendTo(this.pager);
      }
      return _change.apply(self, [1]);
    };

    _change = function(page) {
      var range;
      if (this.current === page) return;
      this.current = page;
      range = this.range;
      this.target.addClass('inv').fadeOut(200).filter(function(n) {
        if (n < page * range && n >= (page - 1) * range) return true;
        return false;
      }).removeClass('inv').fadeIn(200);
      this.pager.children('li.active').removeClass('active');
      this.pager.children('li').eq(page - 1).addClass('active');
      return this.target.parent().trigger('changed');
    };

    return listPager;

  })();

  $(function() {
    var articles, columnWidth, reaction;
    reaction = $('.reaction .articles');
    columnWidth = Math.floor(reaction.width() / 2) - 30;
    articles = reaction.children('article').css('width', columnWidth);
    reaction.masonry({
      'itemSelector': 'article:not(.inv)'
    }).on('changed', function() {
      $(this).masonry('reload');
      return articles.each(function() {
        var e;
        e = $(this);
        if (e.css('left') === '0px') {
          return e.addClass('left').removeClass('right');
        } else {
          return e.addClass('right').removeClass('left');
        }
      });
    });
    new listPager(articles);
    return $(window).on('resize', function() {
      if ($(window).width() > 767) {
        return reaction.addClass('timeline');
      } else {
        return reaction.removeClass('timeline');
      }
    });
  });

}).call(this);
