module.exports = function(grunt) {
  grunt.initConfig({
    clean: {
      dist: ['dist/'],
      preRelease: ['dist/*', '!dist/index.html']
    },
    browserify: {
      'dist/semprebeta-client-side.js': ['src/semprebeta-client-side.js']
    },
    copy: {
      all: {
        expand: true,
        flatten: true,
        filter: 'isFile',
        cwd: 'src/',
        src: ['base.html', 'semprebeta-client-side.css', 'imgs/**'],
        dest: 'dist/'
      },
      finalRelease: {
        src: ['dist/inlined.html'],
        dest: 'dist/index.html'
      }
    },
    imageEmbed: {
      css: {
        src: ['dist/semprebeta-client-side.css'],
        dest: 'dist/semprebeta-client-side.css',
        options: {
          deleteAfterEncoding: true
        }
      },
      html: {
        src: ['dist/base.html'],
        dest: 'dist/base.html',
        options: {
          deleteAfterEncoding: true,
          typeSrc: true
        }
      }
    },
    uglify: {
      js: {
        files: {
          'dist/semprebeta-client-side.js': ['dist/semprebeta-client-side.js']
        }
      }
    },
    cssmin: {
      css: {
        files: {
          'dist/semprebeta-client-side.css': ['dist/semprebeta-client-side.css']
        }
      }
    }, 
    processhtml: {
      inline: {
        files: {
          'dist/inlined.html': ['dist/base.html']
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks("grunt-image-embed-src");
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('default', ['clean', 'browserify', 'copy:all', 'imageEmbed', 'uglify', 'cssmin', 'processhtml', 'copy:finalRelease', 'clean:preRelease']);
};
