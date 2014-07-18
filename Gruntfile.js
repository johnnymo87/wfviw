module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      ng: {
        src: [
          'bower_components/moment/min/moment.min.js',
          'bower_components/jquery/jquery.js',
          'bower_components/underscore/underscore.js',
          'bower_components/backbone/backbone.js',
          'bower_components/backbone-relational/backbone-relational.js',
          'bower_components/react/react.js',
        ],
        dest: 'public/js/vendor.js',
        nonull: true
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask("build", ["concat"]);
};
