module.exports = function(grunt) {
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);
  grunt.initConfig({  
    bumpup:'package.json'
  });
  grunt.registerTask('default', ['watch']);
};