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
            all: {
                expand: true,
                cwd: 'tmp',
                src: ['**/*.js'],
                dest: 'build'
            }
        },

        uglify: {
            concat: {
                options: {
                    preserveComments: 'all',
                    compress: false,
                    beautify: true
                },
                files: {
                    'cobalt.angular.js': [
                        'build/cbUtilities.js',
                        'build/cbDirectives.js',
                        'build/directives/**/*.js'
                    ]
                }
            },
            min: {
                options: {
                    preserveComments: false
                },
                files: {
                    'cobalt.angular.min.js': [
                        'build/cbUtilities.js',
                        'build/cbDirectives.js',
                        'build/directives/**/*.js'
                    ]
                }
            }
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Register tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean', 'copy', 'ngmin', 'uglify', 'clean']);
};
