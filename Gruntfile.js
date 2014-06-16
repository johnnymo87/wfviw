module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      ng: {
        src: [
          'bower_components/angular/angular.min.js',
          'bower_components/angular-resource/angular-resource.min.js',
          'bower_components/angular-route/angular-route.min.js'
        ],
        dest: 'public/js/angular.min.js',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask("build", ["concat"]);
};
