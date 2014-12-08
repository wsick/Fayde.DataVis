var version = require('./build/version'),
    setup = require('./build/setup'),
    path = require('path'),
    connect_livereload = require('connect-livereload');

module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-qunit');
    grunt.loadNpmTasks('grunt-contrib-symlink');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-open');

    var ports = {
        server: 8001,
        livereload: 15151
    };
    var meta = {
        name: 'Fayde.DataVis'
    };

    var dirs = {
        test: {
            root: 'test',
            build: 'test/.build',
            lib: 'test/lib'
        },
        testsite: {
            root: 'testsite',
            build: 'testsite/.build',
            lib: 'testsite/lib'
        }
    };

    function mount(connect, dir) {
        return connect.static(path.resolve(dir));
    }

    grunt.initConfig({
        ports: ports,
        meta: meta,
        dirs: dirs,
        pkg: grunt.file.readJSON('./package.json'),
        clean: {
            bower: ['./lib'],
            testsite: [dirs.testsite.lib],
            test: [dirs.test.lib]
        },
        setup: {
            base: {
                cwd: '.'
            }
        },
        symlink: {
            options: {
                overwrite: true
            },
            test: {
                files: [
                    { src: './lib/nullstone', dest: '<%= dirs.test.lib %>/nullstone' },
                    { src: './lib/minerva', dest: '<%= dirs.test.lib %>/minerva' },
                    { src: './lib/fayde', dest: '<%= dirs.test.lib %>/fayde' },
                    { src: './lib/qunit', dest: '<%= dirs.test.lib %>/qunit' },
                    { src: './lib/requirejs', dest: '<%= dirs.test.lib %>/requirejs' },
                    { src: './lib/requirejs-text', dest: '<%= dirs.test.lib %>/requirejs-text' },
                    { src: './themes', dest: '<%= dirs.test.lib %>/<%= meta.name %>/themes' },
                    { src: './dist', dest: '<%= dirs.test.lib %>/<%= meta.name %>/dist' },
                    { src: './src', dest: '<%= dirs.test.lib %>/<%= meta.name %>/src' }
                ]
            },
            testsite: {
                files: [
                    { src: './lib/nullstone', dest: '<%= dirs.testsite.lib %>/nullstone' },
                    { src: './lib/minerva', dest: '<%= dirs.testsite.lib %>/minerva' },
                    { src: './lib/fayde', dest: '<%= dirs.testsite.lib %>/fayde' },
                    { src: './lib/requirejs', dest: '<%= dirs.testsite.lib %>/requirejs' },
                    { src: './lib/requirejs-text', dest: '<%= dirs.testsite.lib %>/requirejs-text' },
                    { src: './themes', dest: '<%= dirs.testsite.lib %>/<%= meta.name %>/themes' },
                    { src: './dist', dest: '<%= dirs.testsite.lib %>/<%= meta.name %>/dist' },
                    { src: './src', dest: '<%= dirs.testsite.lib %>/<%= meta.name %>/src' }
                ]
            }
        },
        typescript: {
            build: {
                src: [
                    'typings/*.d.ts',
                    'lib/nullstone/dist/nullstone.d.ts',
                    'lib/minerva/dist/minerva.d.ts',
                    'lib/fayde/dist/fayde.d.ts',
                    './src/_Version.ts',
                    './src/_Library.ts',
                    './src/*.ts',
                    './src/**/*.ts'
                ],
                dest: './dist/<%= meta.name %>.js',
                options: {
                    target: 'es5',
                    declaration: true,
                    sourceMap: true
                }
            },
            test: {
                src: [
                    'typings/*.d.ts',
                    '<%= dirs.test.root %>/**/*.ts',
                    '!<%= dirs.test.lib %>/**/*.ts',
                    'lib/nullstone/dist/nullstone.d.ts',
                    'lib/minerva/dist/minerva.d.ts',
                    'lib/fayde/dist/fayde.d.ts',
                    'dist/<%= meta.name %>.d.ts'
                ],
                dest: dirs.test.build,
                options: {
                    target: 'es5',
                    basePath: dirs.test.root,
                    module: 'amd',
                    sourceMap: true
                }
            },
            testsite: {
                src: [
                    'typings/*.d.ts',
                    '<%= dirs.testsite.root %>/**/*.ts',
                    '!<%= dirs.testsite.lib %>/**/*.ts',
                    'lib/nullstone/dist/nullstone.d.ts',
                    'lib/minerva/dist/minerva.d.ts',
                    'lib/fayde/dist/fayde.d.ts',
                    'dist/<%= meta.name %>.d.ts'
                ],
                dest: dirs.testsite.build,
                options: {
                    target: 'es5',
                    basePath: dirs.testsite.root,
                    module: 'amd',
                    sourceMap: true
                }
            }
        },
        qunit: {
            all: ['<%= dirs.test.root %>/*.html']
        },
        connect: {
            server: {
                options: {
                    port: ports.server,
                    base: dirs.testsite.root,
                    middleware: function (connect) {
                        return [
                            connect_livereload({ port: ports.livereload }),
                            mount(connect, dirs.testsite.build),
                            mount(connect, dirs.testsite.root)
                        ];
                    }
                }
            }
        },
        watch: {
            src: {
                files: ['src/**/*.ts'],
                tasks: ['typescript:build']
            },
            testsitets: {
                files: [
                    '<%= dirs.testsite.root %>/**/*.ts',
                    '!<%= dirs.testsite.lib %>/**/*.ts'
                ],
                tasks: ['typescript:testsite']
            },
            testsitejs: {
                files: [
                    '<%= dirs.testsite.build %>/**/*.js'
                ],
                options: {
                    livereload: ports.livereload
                }
            },
            testsitefay: {
                files: [
                    '<%= dirs.testsite.root %>/**/*.fap',
                    '<%= dirs.testsite.root %>/**/*.fayde'
                ],
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
        }
    });

    grunt.registerTask('default', ['typescript:build']);
    grunt.registerTask('test', ['typescript:build', 'typescript:test', 'qunit']);
    grunt.registerTask('testsite', ['typescript:build', 'typescript:testsite', 'connect', 'open', 'watch']);
    setup(grunt);
    version(grunt);
    grunt.registerTask('lib:reset', ['clean', 'setup', 'symlink:test', 'symlink:testsite']);
    grunt.registerTask('dist:upbuild', ['version:bump', 'version:apply', 'typescript:build']);
    grunt.registerTask('dist:upminor', ['version:bump:minor', 'version:apply', 'typescript:build']);
    grunt.registerTask('dist:upmajor', ['version:bump:major', 'version:apply', 'typescript:build']);
};