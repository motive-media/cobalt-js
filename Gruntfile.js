module.exports = function (grunt) {
    grunt.initConfig({
        clean: {
            build: ['build/**/*'],
            tmp: ['tmp/**/*']
        }
    });

    // Load tasks
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    // Register tasks
    //grunt.registerTask('default', ['']);
};
