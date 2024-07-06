const globalRoute = require('./api.routes');
const adminRoute = require('./admin.routes');


class Routes {

        constructor(app) {
            this.app = app;
            const bodyParser = require("body-parser");
            const express = require("express");
            app.use(bodyParser.urlencoded({ extended: false }));
            app.use(bodyParser.json());
            app.use(express.static('public'));
        }

        applyRouteGroups(routerGroups) {
            routerGroups.forEach((routerGroup) => {
                routerGroup();
            });
        }

        register(){
            let instance = this;
            let routersToUse = [ adminRoute, globalRoute ];
            // Apply open route groups first, then authorized
            this.applyRouteGroups(routersToUse.map((router) => () => router.open(router.router)));
            this.applyRouteGroups(routersToUse.map((router) => () => router.authorized(router.router)));
            // Use routers
            routersToUse.forEach((router) => {
                instance.app.use(router.path, router.router);
            });
        }
}

module.exports = (args) => {return new Routes(args)};