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
    app: 'app',
    dist: 'dist'
  };
  try {
    globalConfig.app = require('./bower.json').appPath || globalConfig.app;
  } catch (e) {}
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);
  
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
          basedir:"app/views/",
          pretty:true,
          data: {
            debug: false
          }
        },
        files: getFiles('app/views/', 'app/', '*.jade','html')
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
          cwd: '<%%= configger.app %>',
          dest: '<%%= configger.dist %>',
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
      '<%%= configger.app %>/styles/style.css': '<%%= configger.app %>/styles/style.styl', 
      }
    }
    },
    <%}%>  
    watch: {
      livereload: {
        options: {
          livereload: LIVERELOAD_PORT
        },
        files: [
          '<%%= configger.app %>/{,*/}*.jade',
          '{.tmp,<%%= configger.app %>}/styles/{,*/}*.styl',
          '{.tmp,<%%= configger.app %>}/js/{,*/}*.js',
          '<%%= configger.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        tasks: [
        <% if (stylusModule) { %>'stylus',<%}%>
        
        <% if (jadeModule) { %>'jade'<%}%>
        ]
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
              mountFolder(connect, globalConfig.app)
            ];
          }
        }
      }
    },
    <% if (minify) { %>
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
        files: [{
          expand: true,
          cwd: '<%%= configger.app %>',
          src: ['*.html', 'views/*.html'],
          dest: '<%%= configger.dist %>'
        }]
      }
    },
    uglify: {
      options: {
        banner: '<%%= banner %>'
      },
      dist: {
        files: {}
      }
    },
    <%}%>    
    size_report: {
        html: {
            files: {
                list: [
                '<%%= configger.app %>/*.html', 
                '<%%= configger.app %>/views/**/*.jade',
                ]
            },
        },        
        styles: {
            files: {
                list: [
                '<%%= configger.app %>/styles/*.styl',
                '<%%= configger.app %>/styles/*.css'
                ]
            },
        }, 
        assets: {
            files: {
                list: [
                '<%%= configger.app %>/assets/*.*'
                ]
            },
        }
    }          
  });

  
  grunt.registerTask('default', 'watch');

  grunt.registerTask('serve', [
    <% if (stylusModule) { %>'stylus',<%}%>      
    <% if (jadeModule) { %>'jade',<%}%>
      'connect:livereload',
      'open:server',
      'watch'
    ]
  );

};