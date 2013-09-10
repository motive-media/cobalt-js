module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: ['build/**/*'],
            tmp: ['tmp/**/*']
        },

        copy: {
            tmp: {
                files: [
                    {
                        expand: true,
                        cwd: 'angularjs/',
                        src: ['**'],
                        dest: 'tmp/'
                    }
                ]
            }
        },

        ngmin: {
            base_files: {
                expand: true,
                cwd: 'tmp',
                src: ['*.js'],
                dest: 'build'
            },
            directives: {
                expand: true,
                cwd: 'tmp',
                src: ['directives/**/*.js'],
                dest: 'build'
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ngmin');

    // Register tasks
    grunt.registerTask('default', ['clean', 'copy', 'ngmin', 'clean:tmp']);
};
