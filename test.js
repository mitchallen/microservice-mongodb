
/*jslint es6 */

"use strict";

let Q = require('Q');

let mongoClient = require('mongodb').MongoClient;

let uri = 'mongodb://localhost/test';

function testCallback(err,db) {
    if(err) {

        console.log("ERROR: TEST CALLBACK")
        console.error(err);

    } else {

        console.log("TEST CALLBACK");

        var collection = db.collection('documents');
        // Insert some documents 
        collection.insertMany([
            {a : 1}, {a : 2}, {a : 3}
        ], function(err, result) {
            // assert.equal(err, null);
            // assert.equal(3, result.result.n);
            // assert.equal(3, result.ops.length);
            console.log("Inserted 3 documents into the document collection");
            // callback(result);
        });

        /*
        db.collectionNames(function(err, names) {
            if (err) {
                console.error(err);
                res
                    .status(500)
                    .send(err);
            } else {

                // str = JSON.stringify(names);
                console.log(names);
            }
        });
        */
    }
}

function getDB(uri) {

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

  getDB(uri).then(function(dbx) {

        console.log("THEN");

        testCallback( null, dbx );

    }).fail(function(err){

        console.log("ERROR");
        console.error(err);
        console.trace()
 
        testCallback(err);
    });