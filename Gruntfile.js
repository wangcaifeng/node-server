module.exports = function (grunt) {
  // 项目配置
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      dist: {
        src: ['demo/src/zepto.js', 'demo/src/underscore.js'],
        dest: 'demo/dest/libs.js'
      }
    },
    uglify: {
      build: {
        src: 'demo/dest/libs.js',
        dest: 'demo/dest/libs.min.js'
      }
    },
    less: {  
      development: {
                files: [{
                    expand: true,
                    cwd: 'demo/css',
                    src: '**/***/*.less',
                    dest: 'demo/css',
                    ext: '.css'
                }]
            }
    }
  });
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-less');
  // 默认任务
  grunt.registerTask('default', ['concat', 'uglify','less']);
}