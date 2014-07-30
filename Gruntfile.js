var version = require('./build/version'),
    setup = require('./build/setup');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');
    grunt.loadNpmTasks('grunt-nuget');

    var ports = {
        server: 8001,
        livereload: 15151
    };
    var meta = {
        name: 'Fayde.DataVis'
    };

    grunt.initConfig({
        ports: ports,
        meta: meta,
        pkg: grunt.file.readJSON('./package.json'),
        setup: {
            test: {
                cwd: './test'
            },
            testsite: {
                cwd: './testsite'
            }
        },
        typescript: {
            build: {
                src: ['src/_Version.ts', 'src/*.ts', 'src/**/*.ts'],
                dest: '<%= meta.name %>.js',
                options: {
                    target: 'es5',
                    declaration: true,
                    sourceMap: true
                }
            },
            test: {
                src: ['test/**/*.ts'],
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourceMap: true
                }
            },
            testsite: {
                src: ['testsite/**/*.ts', '!testsite/lib/**/*.ts'],
                options: {
                    target: 'es5',
                    module: 'amd',
                    sourceMap: true
                }
            }
        },
        copy: {
            pretest: {
                files: [
                    { expand: true, flatten: true, src: ['Themes/*'], dest: 'test/lib/<%= meta.name %>/Themes', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['<%= meta.name %>.js'], dest: 'test/lib/<%= meta.name %>', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['<%= meta.name %>.d.ts'], dest: 'test/lib/<%= meta.name %>', filter: 'isFile' }
                ]
            },
            pretestsite: {
                files: [
                    { expand: true, flatten: true, src: ['Themes/*'], dest: 'testsite/lib/<%= meta.name %>/Themes', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['<%= meta.name %>.js'], dest: 'testsite/lib/<%= meta.name %>', filter: 'isFile' },
                    { expand: true, flatten: true, src: ['<%= meta.name %>.d.ts'], dest: 'testsite/lib/<%= meta.name %>', filter: 'isFile' }
                ]
            }
        },
        qunit: {
            all: ['test/**/*.html']
        },
        connect: {
            server: {
                options: {
                    port: ports.server,
                    base: './testsite/'
                }
            }
        },
        watch: {
            src: {
                files: ['src/**/*.ts'],
                tasks: ['typescript:build']
            },
            dist: {
                files: ['<%= meta.name %>.js'],
                tasks: ['copy:pretestsite']
            },
            testsitets: {
                files: ['testsite/**/*.ts'],
                tasks: ['typescript:testsite']
            },
            testsitejs: {
                files: ['testsite/**/*.js'],
                options: {
                    livereload: ports.livereload
                }
            },
            testsitefay: {
                files: ['testsite/**/*.fap', 'testsite/**/*.fayde'],
                options: {
                    livereload: ports.livereload
                }
            }
        },
        open: {
            testsite: {
                path: 'http://localhost:<%= ports.server %>/default.html'
            }
        },
        version: {
            bump: {
            },
            apply: {
                src: './build/_VersionTemplate._ts',
                dest: './src/_Version.ts'
            }
        },
        nugetpack: {
            dist: {
                src: './nuget/<%= meta.name %>.nuspec',
                dest: './nuget/',
                options: {
                    version: '<%= pkg.version %>'
                }
            }
        },
        nugetpush: {
            dist: {
                src: './nuget/<%= meta.name %>.<%= pkg.version %>.nupkg'
            }
        }
    });

    grunt.registerTask('default', ['version:apply', 'typescript:build']);
    grunt.registerTask('test', ['setup:test', 'version:apply', 'typescript:build', 'copy:pretest', 'typescript:test', 'qunit']);
    grunt.registerTask('testsite', ['setup:testsite', 'version:apply', 'typescript:build', 'copy:pretestsite', 'typescript:testsite', 'connect', 'open', 'watch']);
    setup(grunt);
    version(grunt);
    grunt.registerTask('package', ['nugetpack:dist']);
    grunt.registerTask('publish', ['nugetpack:dist', 'nugetpush:dist']);
};