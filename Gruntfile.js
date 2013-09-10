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
        },

        jshint: {
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                trailing: true,
                strict: true,
                forin: true,
                loopfunc: true,
                globals: {
                    angular: true
                },
                ignores: ['angularjs/**/*.min.js']
            },
            files: ['angularjs/**/*.js']
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-ngmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Register tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['clean', 'jshint', 'copy', 'ngmin', 'uglify', 'clean']);
};
