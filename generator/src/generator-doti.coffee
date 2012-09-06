class Generator
  constructor:->
    _generate()
  
  _generate = ->
    $('[id^=output]').parent().parent().removeClass('in')
    html = _generate_html()
    _generate_css().then((css)->
      _display(html, css)
    , ->
      return
    )
    
  _generate_sns = ->
    output = ''
    input = $('[id^=input-sns]').not('[value=""]')
    if input.length < 1 then return ''
    template = $.trim( $('#template-sns').text() )
    loopPos = template.indexOf('{{loop}}')
    loopEnd = template.indexOf('{{/loop}}', loopPos)
    list = template.substring(loopPos, loopEnd).replace('{{loop}}', '').replace('{{/loop}}', '')
    input.each(->
      elem = $(this)
      val = $.trim( elem.val() )
      id = elem.attr('id').match(/\[([^\]]+)\]/)[1]
      output += _render(list,
        'icon': id,
        'url': _defaults.sns[id].url.replace('{{:id}}', val),
        'name': _defaults.sns[id].name
      )
    )
    return template.replace('{{loop}}' + list + '{{/loop}}', output)
  
  _generate_html = ->
    obj =
      'sns': _generate_sns()
    input = $('[id^=input-html]').each(->
      elem = $(this)
      val = elem.val()
      id = elem.attr('id').match(/\[([^\]]+)\]/)[1]
      if id.indexOf('_check') != -1 then return
      if val != '' && $('[id="input-html[' + id + '_check]"]').attr('checked')
        val = '<!--permanent_area-->' + val + '<!--/permanent_area-->';
      obj[id] = val
    )
    template = $('#template-html').text()
    return _render(template, obj)
  
  _generate_css = ->
    dfd = new $.Deferred()
    template = $.trim( $('#template-css').text() )
    obj = {}
    add = ''
    cnt = 0
    input = $('[id^=input-css]')
    input.each(->
      elem = $(this)
      val = $.trim( elem.val() )
      id = elem.attr('id').match(/\[([^\]]+)\]/)[1]
      if _defaults[id]
        obj[id] = val || _defaults[id]
        if cnt++ >= input.length
          dfd.resolve(_render(template, obj) + add)
      else if id == 'backgroundImage'
        obj[id] = if val != '' then 'background-image: url(' + val + ');\n' else ''
        cnt++
      else if id == 'titleImage'
        if val
          partTemplate = $.trim( $('#template-titleImage').text() )
          _loadImage(val).then((data)->
            add += '\n\n' + _render(partTemplate,
              'url': val,
              'width': data.width,
              'height': data.height
            )
            if ++cnt >= input.length
              dfd.resolve(_render(template, obj) + add)
          , ->
            dfd.reject()
          )
        else
          cnt++
      else if id == 'layout'
        if val != 'right'
          add += '\n\n' + $.trim( $('#template-layout-' + val).text() )
        cnt++
    )
    if cnt >= input.length
      dfd.resolve(_render(template, obj) + add)
    return dfd.promise()
  
  _loadImage = (url)->
    dfd = new $.Deferred()
    img = new Image()
    $(img).on('load', ->
      dfd.resolve(
        'width': img.width,
        'height': img.height
      )
    ).on('error', ->
      dfd.reject()
    )
    img.src = url
    return dfd.promise()
  
  _render = (str, obj)->
    for k, v of obj
      regexp = new RegExp( '{{:' + k + '}}', 'g' )
      str = str.replace(regexp, v)
    return str
  
  _display = (html, css)->
    $('[id="output[html]"]').val($.trim(html)).parent().parent().addClass('in')
    $('[id="output[css]"]').val($.trim(css)).parent().parent().addClass('in')
  
  _defaults =
    'color': '#555555',
    'linkColor': '#f89406',
    'linkColorHover': '#555555',
    'backgroundColor': 'white',
    'sns':
      'twitter':
        'name': 'Twitter',
        'url': 'https://twitter.com/{{:id}}'
      ,'facebook':
        'name': 'Facebook',
        'url': 'http://www.facebook.com/{{:id}}'
      ,'google_plus':
        'name': 'Google+',
        'url': 'https://plus.google.com/{{:id}}'
      ,'flickr':
        'name': 'Flickr',
        'url': 'http://www.flickr.com/{{:id}}'
      ,'instagram':
        'name': 'Instagram',
        'url': 'http://web.stagram.com/n/{{:id}}'
      ,'youtube':
        'name': 'YouTube',
        'url': 'http://www.youtube.com/{{:id}}'
      ,'pinterest':
        'name': 'Pinterest',
        'url': 'http://pinterest.com/{{:id}}'
      ,'github':
        'name': 'Github',
        'url': 'https://github.com/{{:id}}'

$(->
  $('[rel=generate]').on('click', (event)->
    event.preventDefault()
    new Generator()
  )
  $('[id^=output]').on('focus', ->
    $(this).select()
  ).on('mouseup', (event)->
    event.preventDefault()
  )
)