module.exports = function(grunt) {

  grunt.initConfig({
    distroDir: 'dist/',
    sourceDir: 'src/',
    deployDir: '/var/www/html/semprebeta.gal/',
    clean: {
      dist: ['<%=distroDir%>'],
      deploy: ['<%=deployDir%>**']
    },
    browserify: {
      dist: {
        '<%=distroDir%>semprebeta-client-side.js': ['<%=sourceDir%>semprebeta-client-side.js']
      }
    },
    copy: {
      all: {
        expand: true,
        filter: 'isFile',
        cwd: '<%=sourceDir%>',
        src: ['base.html', 'semprebeta-client-side.css', 'imgs/**'],
        dest: '<%=distroDir%>'
      },
      finalRelease: {
        src: ['<%=distroDir%>base.html'],
        dest: '<%=distroDir%>index.html'
      },
      deployToApache: {
        expand: true,
        cwd: '<%=distroDir%>',
        src: ['**'],
        dest: '<%=deployDir%>'
      }
    },
    uglify: {
      js: {
        files: {
          '<%=distroDir%>semprebeta-client-side.js': ['<%=distroDir%>semprebeta-client-side.js']
        }
      }
    },
    cssmin: {
      css: {
        files: {
          '<%=distroDir%>semprebeta-client-side.css': ['<%=distroDir%>semprebeta-client-side.css']
        }
      }
    },
    processhtml: {
      inline: {
        files: {
          '<%=distroDir%>base.html': ['<%=distroDir%>base.html']
        }
      }
    },
    htmlmin: {
      dist: {
        options: {
          removeComments: true,
          collapseWhitespace: true
        },
        files: {
          'dist/base.html': 'dist/base.html'
        }
      }
    }
  });


  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-processhtml');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');

  grunt.registerTask('minifyAssets', ['uglify', 'cssmin']);
  grunt.registerTask('minify', ['minifyAssets', 'processhtml', 'htmlmin']);
  grunt.registerTask('default', ['clean:dist', 'browserify:dist', 'copy:all', 'copy:finalRelease']);
  grunt.registerTask('doDeploy', ['clean:deploy', 'copy:deployToApache']);
  grunt.registerTask('deployToApache', ['default', 'doDeploy']);
};
