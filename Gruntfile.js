module.exports = function (grunt) {
    require('load-grunt-tasks')(grunt);

    grunt.initConfig({
        buildPath: 'public',
        pkg: grunt.file.readJSON('package.json'),

         ts: {
            default: {
                src: ["typings/**/*.ts", "src/script/**/*.ts", "!node_modules/**"],
                dest: "src/script/script.js"
            }
        },

        sass: {
            options: {
                sourceMap: false
            },
            dist: {
                files: {
                    'src/style/style.css': 'src/style/scss/style.scss'
                }
            }
        },

        watch: {
            sass: {
                files: ['**/*.scss', '**/**/*.scss'],
                tasks: ['sass'],
                options: {
                    spawn: false,
                },
            },
            ts: {
                files: ['src/script/**/*.ts'],
                tasks: ['ts'],
                options: {
                    spawn: false,
                },
            },
            handlebars: {
                files: ['**/*.hbs'],
                tasks: ['handlebars'],
                options: {
                    spawn: false,
                },
            }
        },
        handlebars: {
            compile: {
                options: {
                    namespace: function (filename) {
                        var names = filename.split('/')//filename.replace(/src\/script\/templates\/(.*)\/(.*)\.hbs/, '$1');
                        names = names.slice(2, names.length - 1)
                        return "app." + names.join('.');
                    },
                    processName: function (filename) { // input: templates/_header.hbs
                        //return filename.replace(/src\/script\/templates\/(.*)\.hbs/, '$1')
                        var pieces = filename.split('/');
                        var name = pieces[pieces.length - 1];
                        return name.replace('.hbs', '');
                    }
                },
                files: {
                    'src/script/template.js': ['src/script/**/*.hbs']
                }
            }
        },
        inline: {
            dist: {
                options: {
                    inlineTagAttributes: {
                        js: 'data-inlined="true"',
                        css: 'data-inlined="true"'
                    },
                    uglify: true,
                    cssmin: true,
                },
                src: "src/index.html",
                dest: "src/PokeEase.html"
            }
        },

        copy: {
            html: {
                files: [{
                    //cwd: "src/",
                    expand: true,
                    flatten: true,
                    src: ['src/*.html'],
                    dest: 'public',
                    filter: 'isFile'
                },
                ]
            },
            images: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: "src/images/",
                        src: ['**'],
                        dest: '<%= buildPath %>/images/',
                        filter: 'isFile'
                    },

                    // includes files within path and its sub-directories
                    //{expand: true, src: ['path/**'], dest: 'dest/'},

                    // makes all src relative to cwd
                    //{expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},
                    { expand: true, flatten: true, src: ['bower_components/jsoneditor/dist/img/*'], dest: '<%= buildPath %>/styles/img', filter: 'isFile' },
                
                    // flattens results to a single level
                    { expand: true, flatten: true, src: ['bower_components/ion.rangeSlider/img/*'], dest: '<%= buildPath %>/img/', filter: 'isFile' },
                ],
            },
			audio: {
                files: [
                    // includes files within path
                    {
                        expand: true,
                        cwd: "src/audio/",
                        src: ['**'],
                        dest: '<%= buildPath %>/audio/',
                        filter: 'isFile'
                    }
                ]
            }
        },
        concat: {
            generated: {
                files: [
                {
                    dest: '.tmp/script/app.js',
                    src: ['src/script/*.js']
                },
                {
                    dest: '.tmp/script/vendor.js',
                    src: [
                          'bower_components/jquery/dist/jquery.js',
                          'bower_components/lodash/dist/lodash.js',
                          'src/external/localStoragePolyfill.js',
                          'bower_components/leaflet/dist/leaflet-src.js',
                          'bower_components/google-map-infobubble/src/infobubble.js',
                          'bower_components/jquery-animateNumber/jquery.animateNumber.js',
                          'bower_components/qtip2/dist/jquery.qtip.js',
                          'bower_components/moment/moment.js',
                          'bower_components/jquery-circle-progress/dist/circle-progress.min.js',
                          'bower_components/jquery.easing/js/jquery.easing.js',
                          'bower_components/handlebars/handlebars.js',
                          'bower_components/ion.rangeSlider/js/ion.rangeSlider.js',
                          'bower_components/jquery.easing/js/jquery.easing.compatibility.js',
                          'bower_components/jsoneditor/dist/jsoneditor.js'
                    ]
                },
                {
                    dest: '.tmp/css/site.css',
                    src: ['src/style/*.css']
                },
                {
                    dest: '.tmp/css/vendor.css',
                    src: [
                            'bower_components/leaflet/dist/leaflet.css',
                            'bower_components/qtip2/dist/jquery.qtip.css',
                            'bower_components/ion.rangeSlider/css/ion.rangeSlider.css',
                            'bower_components/ion.rangeSlider/css/ion.rangeSlider.skinFlat.css',
                            'bower_components/jsoneditor/dist/jsoneditor.css'
                    ]
                }
                ]
            }
        },

        uglify: {
            generated: {
                files: [{
                    dest: 'public/script/app.js',
                    src: ['.tmp/script/app.js']
                },
                {
                    dest: 'public/script/vendor.js',
                    src: ['.tmp/script/vendor.js']
                }]
            }
        },

        cssmin: {
            generated: {
                files: [{
                    dest: 'public/styles/site.min.css',
                    src: ['.tmp/css/site.css']
                },
                {
                    dest: 'public/styles/vendor.min.css',
                    src: ['.tmp/css/vendor.css']
                }]
            }
        },
        useminPrepare: {
            html: 'public/index.html',
            options: {
                dest: 'dist'
            }
        },
        bower_main: {
            copy: {
                options: {
                    dest: 'src/external'
                }
            }
        },
        typings: {
            install: {

            }
        },
        usemin: {
            html: 'public/index.html',
        }
    });
   
    grunt.registerTask('build', [
        'typings',
        'ts',
        'sass',
        'handlebars',
        //'bower_main',
        'copy:html',
        'copy:images',
		'copy:audio',
        'useminPrepare',
        'concat:generated',
        'cssmin:generated',
        'uglify:generated',
       // 'filerev',
        'usemin'
    ]);
    grunt.registerTask('default', ['bower_main', 'ts', 'sass', 'handlebars', 'watch']);
};
