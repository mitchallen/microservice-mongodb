/**
    Module: @mitchallen/microservice-mongodb
    Author: Mitch Allen
*/

/*jslint es6 */

"use strict";

let Q = require('Q');

module.exports = function (spec, modCallback) {

    let demand = require('./demand');

    let mongoClient = require('mongodb').MongoClient;

    let MDB = spec.mongodb;

    demand.notNull(MDB, "missing mongodb information");
    demand.notNull(MDB.uri, "missing mongodb.uri information");

    let uri = MDB.uri;

    console.log(uri);

    // let dbOptions = mongodb.options;

    function getDB() {

        var deferred = Q.defer();

        mongoClient.connect(uri, function (err, db) {
            console.log("connecting ...");
            if (err) {
                console.error('ERROR: connecting to : %s', uri);
                console.error(err);
                deferred.reject(new Error(err));
            } else {
                console.log('mongodb connected: ', uri);
                deferred.resolve(db);
            }
        });

        return deferred.promise;
    }

    var test = getDB().then(function(dbx) {

        console.log("THEN");

         // Setup Microservice
        let options = {
            service: spec,
            connection: {
                mongodb: {
                    db: dbx
                }
            }
        };

        modCallback( null, require('@mitchallen/microservice-core')(options) );

    }).fail(function(err){

        console.log("ERROR");
        console.error(err);
        console.trace()
 
        modCallback(err);
    });

   
};


