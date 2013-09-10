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
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Register tasks
    //grunt.registerTask('default', ['']);
};
