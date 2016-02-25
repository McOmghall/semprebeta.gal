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
        },
        options: {
          transform: ['envify']
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
    jasmine: {
      test: {
        options: {
          specs: 'test/spec-bundle.js'
        }
      }
    }
  })
  grunt.config('node-env', grunt.option('env') || process.env.NODE_ENV || 'development')
  grunt.config('inProd', grunt.config('node-env') === 'production')
  grunt.log.writeln('Node env: |' + grunt.config('node-env') + '|')
  grunt.log.writeln('In prod?: |' + grunt.config('inProd') + '| of type ' + typeof grunt.config('inProd'))
  grunt.log.writeln('Comp-pool root env: |' + JSON.stringify(process.env.COMP_POOL_ROOT) + '|')

  grunt.loadNpmTasks('grunt-contrib-clean')
  grunt.loadNpmTasks('grunt-contrib-copy')
  grunt.loadNpmTasks('grunt-browserify')
  grunt.loadNpmTasks('grunt-contrib-uglify')
  grunt.loadNpmTasks('grunt-contrib-cssmin')
  grunt.loadNpmTasks('grunt-processhtml')
  grunt.loadNpmTasks('grunt-contrib-htmlmin')
  grunt.loadNpmTasks('grunt-contrib-jasmine')

  grunt.registerTask('minify', ['uglify', 'cssmin', 'processhtml', 'htmlmin'])
  grunt.registerTask('test', ['browserify:test', 'jasmine:test'])
  grunt.registerTask('preprocess', 'Build all', ['clean:dist', 'browserify:dist', 'copy:all', 'copy:css'])
  grunt.registerTask('development', ['preprocess', 'copy:finalRelease'])
  grunt.registerTask('production', ['preprocess', 'minify', 'copy:finalRelease'])

  if (grunt.config('inProd')) {
    grunt.log.writeln('Loading production build as default')
    grunt.registerTask('default', ['production'])
  } else {
    grunt.log.writeln('Loading development build as default')
    grunt.registerTask('default', ['development'])
  }
}
