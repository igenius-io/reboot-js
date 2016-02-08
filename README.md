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

If you want to create a new route to '/test/test2', just create a test2.handlebars file in the 'apps/test/views' directory
and reboot-js will wire up all the rest for you.