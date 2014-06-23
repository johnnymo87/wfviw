module.exports = function(grunt) {

  grunt.initConfig({
    concat: {
      ng: {
        src: [
          'bower_components/moment/min/moment.min.js',
          'bower_components/jquery/jquery.min.js',
          'bower_components/underscore/underscore-min.js',
          'bower_components/backbone/backbone-min.js',
          'bower_components/backbone-relational/backbone-relational.js',
        ],
        dest: 'public/js/vendor.min.js',
      },
    },
  });

  grunt.loadNpmTasks('grunt-contrib-concat');

  grunt.registerTask("build", ["concat"]);
};
