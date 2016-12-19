/**
    Module: @mitchallen/microservice-mongodb/lib/base
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";


let demand = require('@mitchallen/demand'),
    mongoClient = require('mongodb').MongoClient,
    core = require('@mitchallen/microservice-core');

module.exports = function (spec, modCallback) {

    spec = spec || {};

    let mongodb = spec.mongodb;

    let verbose = spec.verbose;

    demand.notNull(mongodb, "missing mongodb information");
    demand.notNull(mongodb.uri, "missing mongodb.uri information");

    let uri = mongodb.uri;
    
    mongoClient.connect(uri, function (err, db) {

        if (err) {

            console.error('ERROR: connecting to MongoDB');
            console.error(err);
            modCallback(err);

        } else {

            if( verbose ) {
                console.log('mongodb connected. ');
            }

            // Setup Microservice

            let options = Object.assign(spec, {
                connection: {
                    mongodb: {
                        db: db
                        }
                    }
                });

            modCallback( null, core.Service(options) );
        }
    });
};