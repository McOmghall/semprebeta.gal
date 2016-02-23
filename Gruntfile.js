module.exports = function (grunt) {
  grunt.initConfig({
    distroDir: 'dist/',
    sourceDir: 'src/',
    deployDir: '/var/www/html/semprebeta.gal/',
    clean: {
      dist: ['<%=distroDir%>']
    },
    browserify: {
      dist: {
        files: {
          '<%=distroDir%>semprebeta-client-side.js': ['<%=sourceDir%>semprebeta-client-side.js']
        }
      },
      test: {
        src: ['./**/*.test.js', '!./node_modules/**', '!./test/**'],
        dest: 'test/spec-bundle.js'
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
      css: {
        src: ['./node_modules/bootstrap/dist/css/bootstrap.min.css'],
        dest: '<%=distroDir%>bootstrap.css'
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
    },
    envify: {
      prod: {
        files: {
          '<%=distroDir%>semprebeta-client-side.js': ['<%=distroDir%>semprebeta-client-side.js']
        }
      }
    },
    jasmine: {
      test: {
        options: {
          specs: 'test/spec-bundle.js'
        }
      }
    }
  })

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-envify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-processhtml')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-jasmine')

  grunt.registerTask('minify', ['uglify', 'cssmin', 'processhtml', 'htmlmin', 'envify:prod'])
  grunt.registerTask('test', ['browserify:test', 'jasmine:test'])
  grunt.registerTask('default', 'Build all', [
    'clean:dist', 'browserify:dist', 'copy:all', 'copy:css', 'copy:finalRelease'
  ])
}
