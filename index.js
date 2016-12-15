/**
    Module: @mitchallen/microservice-mongodb
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

"use strict";

let demand = require('@mitchallen/demand'),
    mongoClient = require('mongodb').MongoClient,
    core = require('@mitchallen/microservice-core');

module.exports.Service = function (spec, modCallback) {

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

            let options = {
                service: spec,
                connection: {
                    mongodb: {
                        db: db
                    }
                }
            };

            modCallback( null, core.Service(options) );
        }
    });
};