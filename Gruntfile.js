module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        browserify: {
            test: {
                files: {
                    "test/browser/browser.generated.js": ["test/browser/browser.js"]
                }
            },
            options: {
                browserifyOptions: {
                    debug: true
                }
            }
        },

        mochaTest: {
            src: ["test/*.js"]
        },

        mocha_phantomjs: {
            all: ["test/browser/test.html"]
        },

        jshint: {
            all: ["lib/*.js", "bin/*"],
            options: {
                futurehostile: true,
                freeze: true,
                latedef: true,
                noarg: true,
                nocomma: true,
                nonbsp: true,
                nonew: true,
                undef: true,
                browser: true,
                browserify: true,
                node: true,
                curly: true
            }
        }
    });

    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-mocha-phantomjs");
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.registerTask("default", ["test"]);
    grunt.registerTask("test", "Run all code check and tests", ["jshint", "test-node", "test-browser"]);
    grunt.registerTask("test-node", "Run test on Node.js", ["mochaTest"]);
    grunt.registerTask("test-browser", "Run tests in a web browser", ["browserify:test", "mocha_phantomjs"]);

};
