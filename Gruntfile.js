module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jade: {
      compile: {
        options: {
          pretty : true,
          data: {
            debug: false,
          }
        },
        files: {
          "views_html/index.html": ["views/index.jade"]
        }
      }
    },
    injector: {
      options: {
        template : 'views_html/index.html',
      },
      bower_dependencies: {
        files: {
          'views_html/index.html': ['client/bower.json'],
        },
      }
    },
    watch : {
      jade: {
        files : ["views/**/*.jade"],
        tasks : ['jade', 'injector'],
        options : {
          spawn : false
        }
     }, 
     js : {
        files : ['Gruntfile.js', 'client/js/app.js', 'server/*.js'],
        tasks : ['jshint'],
        options : {
          spaws : false
        }
     },
      uglify: {
        files : ['client/js/app.js'],
        tasks : ['uglify'],
        options : {
          spawns : false
        }
      },
    },
    jshint: {
      all: ['Gruntfile.js', 'client/js/app.js', 'server/*.js']
    },
    jasmine: {
      pivotal: {
        src: 'server/**/*.js',
        options: {
          specs: 'server/spec/*-spec.js',
        }
      }
    },
    uglify: {
        options: {
          mangle: false
        },
        my_target: {
          files: {
            'client/js/app.min.js': ['client/js/app.js']
          }
        }
      },
  });

  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-injector');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
 
  grunt.registerTask('default', ['jade','injector', 'jshint', 'uglify']);

};
