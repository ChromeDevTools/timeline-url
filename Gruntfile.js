'use strict';
module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt);

	var config = {
		app: 'app',
		dist: 'dist'
	};

	grunt.initConfig({
		config: config,

		watch: {
			js: {
				files: ['<%= config.app %>/scripts/{,*/}*.js'],
				tasks: ['jshint'],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			gruntfile: {
				files: ['Gruntfile.js']
			},
			styles: {
				files: ['<%= config.app %>/styles/{,*/}*.css'],
				tasks: [],
				options: {
					livereload: '<%= connect.options.livereload %>'
				}
			},
			livereload: {
				options: {
					livereload: '<%= connect.options.livereload %>'
				},
				files: [
					'<%= config.app %>/*.html',
					'<%= config.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
					'<%= config.app %>/manifest.json',
					'<%= config.app %>/_locales/{,*/}*.json'
				]
			}
		},

		connect: {
			options: {
				port: 9000,
				livereload: 35729,
				hostname: 'localhost'
			},
			chrome: {
				options: {
					open: false,
					base: [
						'<%= config.app %>'
					]
				}
			}
		},

		clean: {
			chrome: {
			},
			dist: {
				files: [{
					dot: true,
					src: [
						'<%= config.dist %>/*',
						'!<%= config.dist %>/.git*'
					]
				}]
			}
		},

		jshint: {
			options: {
				jshintrc: '.jshintrc',
				reporter: require('jshint-stylish')
			},
			all: [
				'Gruntfile.js',
				'<%= config.app %>/scripts/{,*/}*.js',
				'!<%= config.app %>/scripts/vendor/*',
				'test/spec/{,*/}*.js'
			]
		},
		mocha: {
			all: {
				options: {
					run: true,
					urls: ['http://localhost:<%= connect.options.port %>/index.html']
				}
			}
		},

		useminPrepare: {
			options: {
				dest: '<%= config.dist %>'
			},
			html: [
				'<%= config.app %>/popup.html',
				'<%= config.app %>/options.html'
			]
		},

		usemin: {
			options: {
				assetsDirs: ['<%= config.dist %>', '<%= config.dist %>/images']
			},
			html: ['<%= config.dist %>/{,*/}*.html'],
			css: ['<%= config.dist %>/styles/{,*/}*.css']
		},

		imagemin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/images',
					src: '{,*/}*.{gif,jpeg,jpg,png}',
					dest: '<%= config.dist %>/images'
				}]
			}
		},

		svgmin: {
			dist: {
				files: [{
					expand: true,
					cwd: '<%= config.app %>/images',
					src: '{,*/}*.svg',
					dest: '<%= config.dist %>/images'
				}]
			}
		},

		htmlmin: {
			dist: {
				options: {
				},
				files: [{
					expand: true,
					cwd: '<%= config.app %>',
					src: '*.html',
					dest: '<%= config.dist %>'
				}]
			}
		},

		copy: {
			dist: {
			files: [{
				expand: true,
				dot: true,
				cwd: '<%= config.app %>',
				dest: '<%= config.dist %>',
				src: [
					'*.{ico,png,txt}',
					'images/{,*/}*.{webp,gif}',
					'{,*/}*.html',
					'styles/{,*/}*.css',
					'styles/fonts/{,*/}*.*',
					'_locales/{,*/}*.json',
				]
			}]
			}
		},

		concurrent: {
			chrome: [
			],
			dist: [
				'imagemin',
				'svgmin'
			],
			test: [
			]
		},

		chromeManifest: {
			dist: {
				options: {
					buildnumber: true,
					indentSize: 2,
					background: {
						target: [
							'scripts/clipboard.js', 'scripts/panel.js', 'scripts/timeline-url.js'
						],
						exclude: [
							'scripts/chromereload.js'
						]
					}
				},
				src: '<%= config.app %>',
				dest: '<%= config.dist %>'
			}
		},

		compress: {
			dist: {
				options: {
					archive: function() {
						var manifest = grunt.file.readJSON('app/manifest.json');
						return 'package/timeline-url-' + manifest.version + '.zip';
					}
				},
				files: [{
					expand: true,
					cwd: 'dist/',
					src: ['**'],
					dest: ''
				}]
			}
		}
	});

	grunt.registerTask('debug', function () {
		grunt.task.run([
			'jshint',
			'concurrent:chrome',
			'connect:chrome',
			'watch'
		]);
	});

	grunt.registerTask('test', [
		'connect:test',
		'mocha'
	]);

	grunt.registerTask('build', [
		'clean:dist',
		'chromeManifest:dist',
		'useminPrepare',
		'concurrent:dist',
		'concat',
		'uglify',
		'copy',
		'usemin',
		'compress'
	]);

	grunt.registerTask('default', [
		'jshint',
		'test',
		'build'
	]);
};
