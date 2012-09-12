module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-coffee');
  grunt.loadNpmTasks('grunt-less');

  // Project configuration.
  grunt.initConfig({
    pkg: '<json:package.json>',
    meta: {
      banner: '/*! <%= pkg.title || pkg.name %> - v<%= pkg.version %> - ' +
        '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
        '* Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author.name %>;' +
        ' Licensed <%= _.pluck(pkg.licenses, "type").join(", ") %> */'
      ,bootstrap: '/*!\n * Bootstrap v2.1.1\n *\n * Copyright 2012 Twitter, Inc\n * Licensed under the Apache License v2.0\n * http://www.apache.org/licenses/LICENSE-2.0\n *\n * Designed and built with all the love in the world @twitter by @mdo and @fat.\n */'
    },
    concat: {
      less_dist: {
        src: ['<banner:meta.banner>', '<banner:meta.bootstrap>', 'css/theme-doti.css'],
        dest: 'css/theme-doti.css'
      },
      less_min: {
        src: ['<banner:meta.banner>', '<banner:meta.bootstrap>', 'css/theme-doti-min.css'],
        dest: 'css/theme-doti-min.css'
      },
      js_dist: {
        src: ['<banner:meta.banner>', 'js/theme-doti.js'],
        dest: 'js/theme-doti.js'
      },
      js_min: {
        src: ['<banner:meta.banner>', 'js/theme-doti-min.js'],
        dest: 'js/theme-doti-min.js'
      }
    },
    less: {
      dist: {
        src: ['src/less/theme.less'],
        dest: 'css/theme-doti.css'
      },
      min: {
        src: ['src/less/theme.less'],
        dest: 'css/theme-doti-min.css',
        options: {
          yuicompress: true
        }
      }
    },
    coffee: {
      dist: {
        src: ['src/coffee/*.coffee'],
        dest: 'js/'
      }
    },
    min: {
      dist: {
        src: ['js/theme-doti.js'],
        dest: 'js/theme-doti-min.js'
      }
    },
    watch: {
      files: ['package.json', 'src/less/*.less', 'src/less/bootstrap/*.less', 'src/coffee/*.coffee'],
      tasks: 'less coffee min concat'
    }
  });

  // Default task.
  grunt.registerTask('default', 'watch');

};