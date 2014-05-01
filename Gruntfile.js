module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),


        coffee: {
            glob_to_multiple: {
                expand: true,
                flatten: true,
                cwd: 'src/',
                src: ['*.coffee'],
                dest: 'lib/',
                ext: '.js'
            }
        },

        copy: {
            templates: {
                expand: true,
                cwd: 'src/templates/',
                src: '*',
                dest: 'lib/templates/'
            },
            hbs: {
                expand: true,
                cwd: 'src/',
                src: '*.hbs',
                dest: 'lib/'
            },
            js: {
                expand: true,
                cwd: 'src/',
                src: '*.js',
                dest: 'lib/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-coffee');

    grunt.registerTask('default', ['coffee', 'copy']);
};