//NodeJS Plugins
var fs = require('fs');
var path = require('path');

//Express Plugins
var express = require('express');
var compress = require('compression');
var exphbs = require('express-handlebars');
var bodyParser = require('body-parser');
var art = require('ascii-art');

//Reboot Plugins
var rebootUtilities = require('./reboot-utilities');
var rebootRoutes = require('./reboot-routes');

function setupReboot(jsonRebootConfig) {

    var rebootConfig = (jsonRebootConfig) ? jsonRebootConfig : rebootUtilities.rbJsonFileSync(__dirname + '/reboot-config.json');
    var appDir = path.dirname(require.main.filename) + '/' + rebootConfig['reboot-apps-directory'];

    var wwwDir = appDir + '/www/';
    var testAppDir = appDir + '/test/';
    var testAppLayoutsDir = testAppDir + '/views/layouts'

    //other dirs to create for reboot first-time-load
    var otherDirs = [
        wwwDir + 'code',
        wwwDir + 'css',
        wwwDir + 'js',
        testAppDir + 'code'
    ];

    try {
        var stats = fs.lstatSync(appDir);

        if (stats.isDirectory()) {
            //console.log('app dir exists, skipping setup');
        }
    }
    catch (e) {
        console.log('First time setup... Installing app directory and test app. Please test by browsing to http://localhost:xxxx/test/');
        var mkdirp = require('mkdirp');
        mkdirp(wwwDir, function(err) {
            if(!err) {
                console.log('Create "www" directory');
            }
        });

        mkdirp(testAppLayoutsDir, function(err) {
            if(!err) {

                fs.writeFile(testAppDir + '/views/index.handlebars', '<h1>This is a test</h1>', function(err) {});
                fs.writeFile(testAppDir + '/views/layouts/layout.handlebars', '<div>{{{ body }}}</div>', function(err) {});
            }
        });

        for(var d in otherDirs) {
            mkdirp(otherDirs[d]);
        }
    }
}

function go(jsonRebootConfig) {

    //Setup reboot first
    setupReboot(jsonRebootConfig);

    //init variables
    var appDir = path.dirname(require.main.filename);
    global.__base = appDir + '/';

    var rebootConfig = (jsonRebootConfig) ? jsonRebootConfig : rebootUtilities.rbJsonFileSync(__dirname + '/reboot-config.json');

    //Setup environment variable
    process.env.NODE_ENV = rebootConfig.env;

    //Create & Configure express app
    var app = express();

    //Used compression in the app
    app.use(compress());

    hbs = exphbs.create({
        extname: 'handlebars',
        defaultLayout: rebootConfig['default-layout'],
        partialsDir: [rebootConfig['partials-directory']],
        layoutsDir: rebootConfig['layouts-directory'],
        helpers: {
            block: function (name) {
                var blocks  = this._blocks,
                    content = blocks && blocks[name];

                return content ? content.join('\n') : null;
            },

            contentFor: function (name, options) {
                var blocks = this._blocks || (this._blocks = {}),
                    block  = blocks[name] || (blocks[name] = []);

                block.push(options.fn(this));
            }
        }
    });

    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
    app.use(bodyParser.urlencoded({ extended: true }));

    //Create server on configured port
    app.listen(rebootConfig.port, function() {
        art.font('reboot', 'Doom', function(rendered){

            loadAllRebootCodeFiles();
            rebootRoutes.init(app, rebootConfig);
            console.log(rendered);
            console.log('Port: '+ rebootConfig.port);
            console.log('Environment: ' + process.env.NODE_ENV);
        });
    });

    function loadAllRebootCodeFiles() {
        console.log('Booting files...');
        var rootDir = path.dirname(require.main.filename);
        var dir = rootDir + '/' + rebootConfig['reboot-apps-directory'];
        var apps = fs.readdirSync(dir);

        //cycle through apps
        for(var i in apps) {
            var appName = apps[i];
            var appDir = path.resolve(dir, appName);

            //Setup partials directory in 'found app directory'
            hbs.partialsDir.push(appDir + '/views/partials/');

            var appCodeDir = path.resolve(appDir, 'code');
            var codeFile = '';

            try {
                var files = fs.readdirSync(appCodeDir);

                for(var f in files) {
                    codeFile = path.resolve(appCodeDir, files[f]);

                    var stats = fs.statSync(codeFile);
                    if (stats.isFile()) {
                        require(codeFile)(app);
                        console.log(codeFile.replace(rootDir, ''));
                    }
                }
            }
            catch(ex) {
                console.log('Error booting: ' + codeFile + '. Error was - ' + ex);
            }
        }
    }
}

module.exports.go = go;
