(function() {

  $(function() {
    var post;
    post = $('#articles > .post');
    post.children('.body').fc2().eyecatch();
    post.find('> footer a[title]').tooltip();
    $('#pager').fc2().pager({
      'range': 9
    });
    return (function() {
      var elem, fmt, mon, str, year;
      elem = $('body.type-date #main > h1:eq(0)');
      if (elem.length < 1) return;
      str = $.trim(elem.text());
      year = str.substring(0, 4);
      mon = str.substring(4);
      fmt = year + '-' + mon;
      elem.text(fmt);
      return document.title = document.title.replace(str, fmt);
    })();
  });

  $.fc2().scroll();

}).call(this);
