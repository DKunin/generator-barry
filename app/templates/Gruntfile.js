module.exports = function(grunt) {

<% if (jadeModule) { %>
  function getFiles(srcdir, destdir, wildcard, newext) {
    var path = require('path');
        files = {}
      grunt.file.expand({cwd: srcdir}, wildcard).forEach(function(relpath) {
      var newName = path.join(relpath,destdir);
      files[path.join(destdir, relpath).split('.')[0]+'.'+ newext] = path.join(srcdir, relpath);
    });
    return files;
  };  
<%}%>  


var LIVERELOAD_PORT = 35729;
var lrSnippet = require('connect-livereload')({ port: LIVERELOAD_PORT });
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

  var globalConfig = {
    src: 'src',
    dist: 'dist'
  };

  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({  
    configger: globalConfig,
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%%= pkg.name %>  ' +
      '<%%= grunt.template.today("yyyy-mm-dd") %>\n' +
      'Author: <%%= pkg.author.name %> */\n',    
<% if (jadeModule) { %>
    jade: {
      compile: {
        options: {
          basedir:"src/jade/",
          pretty:true,
          data: {
            debug: false
          }
        },
        files: getFiles('<%%=configger.src%>/jade/', '<%%=configger.src%>/', '*.jade','html')
      }
    },<%}%>  
    clean: {
      build: {
        src: [""]
      }
    },  
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%%=configger.src%>',
          dest: '<%%=configger.dist%>',
          src: [
            '*.{ico,png,txt}',
            'images/{,*/}*.{gif,webp,png}',
            'css/font/*'
          ]
        }]
      }
    },        
  <% if (stylusModule) { %>
  stylus: {
    compile: {
      files: {
      'css/nstyle.css': 'css/nstyle.styl', 
      }
    }
    },
    <%}%>  
    watch: {
        scripts: {
          files: ['css/*.styl'],
          tasks:['stylus'],
          options: {
            livereload: false
          },
        },
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%%= configger.app %>/{,*/}*.jade',
          '{.tmp,<%%= configger.app %>}/styles/{,*/}*.css',
          '{.tmp,<%%= configger.app %>}/scripts/{,*/}*.js',
          '<%%= configger.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: ['jade']
      }
    },
    open: {
      file: {
        path: 'dist/index.html'
      },
      server: {
        url: 'http://localhost:<%%= connect.options.port %>'
      }
    }, 
    connect: {
      options: {
        port: 9001,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, '.tmp'),
              mountFolder(connect, configger.app)
            ];
          }
        }
      },
      test: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, '.tmp'),
              mountFolder(connect, 'test')
            ];
          }
        }
      },
      dist: {
        options: {
          middleware: function (connect) {
            return [
              mountFolder(connect, configger.dist)
            ];
          }
        }
      }
    },
    useminPrepare: {
      html: '<%%= configger.app %>/index.html',
      options: {
        dest: '<%%= configger.dist %>'
      }
    },
    usemin: {
      html: ['<%%= configger.dist %>/{,*/}*.html'],
      css: ['<%%= configger.dist %>/styles/{,*/}*.css'],
      options: {
        dirs: ['<%%= configger.dist %>']
      }
    },
    htmlmin: {
      dist: {
        options: {
          /*removeCommentsFromCDATA: true,
          // https://github.com/yeoman/grunt-usemin/issues/44
          //collapseWhitespace: true,
          collapseBooleanAttributes: true,
          removeAttributeQuotes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeEmptyAttributes: true,
          removeOptionalTags: true*/
        },
        files: [{
          expand: true,
          cwd: '<%%= configger.app %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%%= configger.dist %>'
        }]
      }
    },            
  });

  
  grunt.registerTask('default', ['watch']);

  grunt.registerTask('server', function (target) {
    grunt.task.run([
      'connect:livereload',
      'open',
      'watch'
    ]);
  });

};