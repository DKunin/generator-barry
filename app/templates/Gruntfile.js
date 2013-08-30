module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.initConfig({  
<% if (stylusModule) { %>
  jade: {
    compile: {
      options: {
        data: {
          debug: false
        }
      },
      files: {
        "path/to/dest.html": ["path/to/templates/*.jade", "another/path/tmpl.jade"]
      }
    }
  },<%}%>  
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
    }
  });

  
  grunt.registerTask('default', ['watch']);
};