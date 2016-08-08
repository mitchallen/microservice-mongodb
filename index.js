/**
    Module: @mitchallen/microservice-mongodb
    Author: Mitch Allen
*/

/*jslint es6 */

"use strict";

module.exports = function (spec, modCallback) {

    let demand = require('@mitchallen/demand');

    let mongoClient = require('mongodb').MongoClient;

    let mongodb = spec.mongodb;

    let verbose = spec.verbose;

    demand.notNull(mongodb, "missing mongodb information");
    demand.notNull(mongodb.uri, "missing mongodb.uri information");

    let uri = mongodb.uri;

    // let dbOptions = mongodb.options;

    mongoClient.connect(uri, function (err, db) {

        if (err) {

            console.error('ERROR: connecting to : %s', uri);
            console.error(err);
            modCallback(err);

        } else {

            if( verbose ) {
                console.log('mongodb connected: ', uri);
            }

            // Setup Microservice

            let options = {
                service: spec,
                connection: {
                    mongodb: {
                        db: db
                    }
                }
            };

            modCallback( null, require('@mitchallen/microservice-core')(options) );
        }
    });
};