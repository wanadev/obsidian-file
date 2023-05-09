module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),

        clean: {
            tests: ["build/test/"]
        },

        copy: {
            tests: {
                files: [
                    {expand: true, cwd: "test/browser", src: ["test.html"], dest: "build/test/browser"},
                    {expand: true, cwd: "node_modules/mocha/", src: ["mocha.js", "mocha.css"], dest: "build/test/browser"}
                ]
            }
        },

        browserify: {
            test: {
                files: {
                    "build/test/browser/browser.generated.js": ["test/browser/browser.js"]
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

        shell: {
            mocha_headless_chrome: {
                command: "npx mocha-headless-chrome -f build/test/browser/test.html",
            }
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

    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-browserify");
    grunt.loadNpmTasks("grunt-mocha-test");
    grunt.loadNpmTasks("grunt-shell");
    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.registerTask("default", ["test"]);
    grunt.registerTask("test", "Run all code check and tests", ["jshint", "test-node", "test-browser"]);
    grunt.registerTask("test-node", "Run test on Node.js", ["mochaTest"]);
    grunt.registerTask("test-browser", "Run tests in a web browser", ["clean:tests", "copy:tests", "browserify:test", "shell:mocha_headless_chrome"]);

};
