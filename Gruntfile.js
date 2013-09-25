'use strict';

module.exports = function (grunt) {
    // Load all grunt tasks
    require('matchdep').filter('grunt-*').forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        // Setup the package details
        pkg: grunt.file.readJSON('bower.json'),

        // Clean up folders to remove any build or tmp files
        clean: {
            build: ['build/**/*'],
            tmp: ['tmp/**/*']
        },

        // Copy dev files to tmp folder
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

        // Run through ngmin to prevent bad dependency injection
        ngmin: {
            all: {
                expand: true,
                cwd: 'tmp',
                src: ['**/*.js'],
                dest: 'tmp'
            }
        },

        // Minify the build files
        uglify: {
            dev: {
                options: {
                    preserveComments: 'all',
                    compress: false,
                    beautify: true
                },
                files: {
                    'build/cobalt.angular.js': ['build/cobalt.angular.js']
                }
            },
            min: {
                options: {
                    preserveComments: false
                },
                files: {
                    'build/cobalt.angular.min.js': ['build/cobalt.angular.js']
                }
            }
        },

        concat: {
            options: {
                banner: '(function () {\n"use strict";\n\n',
                footer: '\n})();'
            },
            dev: {
                files: {
                    'build/cobalt.angular.js': [
                        'tmp/*.js',
                        'tmp/directives/**/*.js'
                    ]
                }
            },
            build: {
                options: {
                    banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                    footer: ''
                },
                files: {
                    'cobalt.angular.js': ['build/cobalt.angular.js'],
                    'cobalt.angular.min.js': ['build/cobalt.angular.min.js']
                }
            }
        },

        // Run a linter through files to test for errors
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

    // Register tasks
    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', [
        'clean',
        'jshint',
        'copy',
        'ngmin',
        'concat:dev',
        'uglify',
        'concat:build',
        'clean'
    ]);
};
