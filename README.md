# reboot-js
reboot-js is an express plugin to create quick applications hosted out of an "apps" directory without wiring up each individual route.

Eg.
Create a default server.js file in your node app and paste in the code below.

```
var rebootjs = require('reboot-js');
rebootjs.go();
```

Browse to http://localhost:3001/test and voila! **Your first app has been created.**

But wait, there's more!


### Generic Routes
If you want to create a new route to '/test/test2', just create a test2.handlebars file in the 'apps/test/views' directory and reboot-js will wire up all the rest for you.

### Automatic Loading of Controllers
Want to create a controller for custom routes with logic inside? Reboot loads these easily.

1. Create a controller in '/apps/test/**code**/testController.js'
2. Create a new view file '/apps/test/views/hello.handlebars' with content ```<h1>Hello {{ message }}</h1>```
3. Paste in the code below to the 'testController.js' file and reboot-js will handle the rest
```
var testController = function(app) {
    // Generic Catch All SPA Views (put in last)
    app.get('/test/hello', function(req, res) {
        var viewParams = {
            layout : __dirname + '/../views/layouts/layout',
            viewFile : __dirname + '/../views/hello',
            message : 'NPM World'
        };

    });
}
module.exports = testController;
```

**Test this out**
Browse to http://localhost:3001/test/hello and snap dog! You have just run an express route that links to a custom layout file, customer view file and imported a variable that displays when called in the hello.handlebars file

Note - The **app** variable in the function(**app**) is the express object, giving you access to use express in controllers.
