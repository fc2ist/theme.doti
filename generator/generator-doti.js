(function() {
  var Generator;

  Generator = (function() {
    var _defaults, _display, _generate, _generate_css, _generate_html, _generate_sns, _loadImage, _render;

    function Generator() {
      _generate();
    }

    _generate = function() {
      var html;
      $('[id^=output]').parent().parent().removeClass('in');
      html = _generate_html();
      return _generate_css().then(function(css) {
        return _display(html, css);
      }, function() {});
    };

    _generate_sns = function() {
      var input, list, loopEnd, loopPos, output, template;
      output = '';
      input = $('[id^=input-sns]').not('[value=""]');
      if (input.length < 1) return '';
      template = $.trim($('#template-sns').text());
      loopPos = template.indexOf('{{loop}}');
      loopEnd = template.indexOf('{{/loop}}', loopPos);
      list = template.substring(loopPos, loopEnd).replace('{{loop}}', '').replace('{{/loop}}', '');
      input.each(function() {
        var elem, id, val;
        elem = $(this);
        val = $.trim(elem.val());
        id = elem.attr('id').match(/\[([^\]]+)\]/)[1];
        return output += _render(list, {
          'icon': id,
          'url': _defaults.sns[id].url.replace('{{:id}}', val),
          'name': _defaults.sns[id].name
        });
      });
      return template.replace('{{loop}}' + list + '{{/loop}}', output);
    };

    _generate_html = function() {
      var input, obj, template;
      obj = {
        'sns': _generate_sns()
      };
      input = $('[id^=input-html]').each(function() {
        var elem, id, val;
        elem = $(this);
        val = elem.val();
        id = elem.attr('id').match(/\[([^\]]+)\]/)[1];
        if (id.indexOf('_check') !== -1) return;
        if (val !== '' && $('[id="input-html[' + id + '_check]"]').attr('checked')) {
          val = '<!--permanent_area-->' + val + '<!--/permanent_area-->';
        }
        return obj[id] = val;
      });
      template = $('#template-html').text();
      return _render(template, obj);
    };

    _generate_css = function() {
      var add, cnt, dfd, input, obj, template;
      dfd = new $.Deferred();
      template = $.trim($('#template-css').text());
      obj = {};
      add = '';
      cnt = 0;
      input = $('[id^=input-css]');
      input.each(function() {
        var elem, id, partTemplate, val;
        elem = $(this);
        val = $.trim(elem.val());
        id = elem.attr('id').match(/\[([^\]]+)\]/)[1];
        if (_defaults[id]) {
          obj[id] = val || _defaults[id];
          if (cnt++ >= input.length) {
            return dfd.resolve(_render(template, obj) + add);
          }
        } else if (id === 'backgroundImage') {
          obj[id] = val !== '' ? 'background-image: url(' + val + ');\n' : '';
          return cnt++;
        } else if (id === 'titleImage') {
          if (val) {
            partTemplate = $.trim($('#template-titleImage').text());
            return _loadImage(val).then(function(data) {
              add += '\n\n' + _render(partTemplate, {
                'url': val,
                'width': data.width,
                'height': data.height
              });
              if (++cnt >= input.length) {
                return dfd.resolve(_render(template, obj) + add);
              }
            }, function() {
              return dfd.reject();
            });
          } else {
            return cnt++;
          }
        } else if (id === 'layout') {
          if (val !== 'right') {
            add += '\n\n' + $.trim($('#template-layout-' + val).text());
          }
          return cnt++;
        }
      });
      if (cnt >= input.length) dfd.resolve(_render(template, obj) + add);
      return dfd.promise();
    };

    _loadImage = function(url) {
      var dfd, img;
      dfd = new $.Deferred();
      img = new Image();
      $(img).on('load', function() {
        return dfd.resolve({
          'width': img.width,
          'height': img.height
        });
      }).on('error', function() {
        return dfd.reject();
      });
      img.src = url;
      return dfd.promise();
    };

    _render = function(str, obj) {
      var k, regexp, v;
      for (k in obj) {
        v = obj[k];
        regexp = new RegExp('{{:' + k + '}}', 'g');
        str = str.replace(regexp, v);
      }
      return str;
    };

    _display = function(html, css) {
      $('[id="output[html]"]').val($.trim(html)).parent().parent().addClass('in');
      return $('[id="output[css]"]').val($.trim(css)).parent().parent().addClass('in');
    };

    _defaults = {
      'color': '#555555',
      'linkColor': '#f89406',
      'linkColorHover': '#555555',
      'backgroundColor': 'white',
      'sns': {
        'twitter': {
          'name': 'Twitter',
          'url': 'https://twitter.com/{{:id}}'
        },
        'facebook': {
          'name': 'Facebook',
          'url': 'http://www.facebook.com/{{:id}}'
        },
        'google_plus': {
          'name': 'Google+',
          'url': 'https://plus.google.com/{{:id}}'
        },
        'flickr': {
          'name': 'Flickr',
          'url': 'http://www.flickr.com/{{:id}}'
        },
        'instagram': {
          'name': 'Instagram',
          'url': 'http://web.stagram.com/n/{{:id}}'
        },
        'youtube': {
          'name': 'YouTube',
          'url': 'http://www.youtube.com/{{:id}}'
        },
        'pinterest': {
          'name': 'Pinterest',
          'url': 'http://pinterest.com/{{:id}}'
        },
        'github': {
          'name': 'Github',
          'url': 'https://github.com/{{:id}}'
        }
      }
    };

    return Generator;

  })();

  $(function() {
    $('[rel=generate]').on('click', function(event) {
      event.preventDefault();
      return new Generator();
    });
    return $('[id^=output]').on('focus', function() {
      return $(this).select();
    }).on('mouseup', function(event) {
      return event.preventDefault();
    });
  });

}).call(this);
