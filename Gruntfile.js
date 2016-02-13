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
      '<%=distroDir%>semprebeta-client-side.js': ['<%=sourceDir%>semprebeta-client-side.js']
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
        src: ['<%=distroDir%>inlined.html'],
        dest: '<%=distroDir%>index.html'
      },
      deploy: {
        expand: true,
	cwd: '<%=distroDir%>', 
        src: ['index.html', 'imgs/**'],
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
          '<%=distroDir%>inlined.html': ['<%=distroDir%>base.html']
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

  grunt.registerTask('makeJs', ['browserify', 'uglify'];
  grunt.registerTask('default', ['clean:dist', 'makeJs', 'copy:all', 'cssmin', 'processhtml', 'copy:finalRelease']);
  grunt.registerTask('doDeploy', ['clean:deploy', 'copy:deploy']);
  grunt.registerTask('deploy', ['default', 'doDeploy']);
};
