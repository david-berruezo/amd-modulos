module.exports = function (grunt) {
    'use strict';

    // Obtener el ejemplo a servir (por defecto example1-dom)
    var example = grunt.option('example') || 'example1-dom';

    grunt.initConfig({
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: example,
                    livereload: true,
                    open: true,
                    hostname: 'localhost'
                }
            }
        },
        watch: {
            files: [example + '/**/*'],
            options: {
                livereload: true
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('serve', ['connect', 'watch']);
    grunt.registerTask('default', ['serve']);
};
