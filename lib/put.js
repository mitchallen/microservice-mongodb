/**
    Module: @mitchallen/microservice-mongodb-put
    Author: Mitch Allen
*/

/*jshint esversion: 6 */

var dbCore = require('./base'),
    demand = require('@mitchallen/demand'),
    ObjectId = require('mongodb').ObjectID;

module.exports = function (spec, modCallback) {

    let demand = require('@mitchallen/demand');
    let ObjectId = require('mongodb').ObjectID;

    demand.notNull(spec,'ERROR: service parameters not defined.');

    let name = spec.name;
    let version = spec.version;
    let verbose = spec.verbose || false;
    let prefix = spec.prefix;
    let collectionName = spec.collectionName;
    let port = spec.port;
    let mongodb = spec.mongodb;

    demand.notNull(name,'ERROR: service name not defined.');
    demand.notNull(version,'ERROR: service version not defined.');
    demand.notNull(prefix,'ERROR: service prefix not defined.');
    demand.notNull(collectionName,'ERROR: service collection name not defined.');
    demand.notNull(port,'ERROR: service port not defined.');
    demand.notNull(mongodb,'ERROR: service mongodb configuration not defined.');
    demand.notNull(mongodb.uri,'ERROR: service mongodb.uri not defined.');

    let path = "/" + collectionName + "/:id";

    var service = {

        name: name,
        version: version,
        verbose: verbose,
        apiVersion: prefix,
        port: port,
        mongodb: mongodb,
        collectionName: collectionName,

        method: function(info) {
            var router = info.router,
                   db  = info.connection.mongodb.db;
                   collectionName = info.collectionName;
            demand.notNull(db);
            // Reference: https://mongodb.github.io/node-mongodb-native/markdown-docs/insert.html
            // path does not include prefix (set elsewhere)
            router.put( path, function (req, res) {
                var docId = req.params.id;
                // Must be called before used as a constructor (which will throw an error if invalid)
                if( ! ObjectId.isValid(docId) ) 
                {
                    console.error("MongoID ObjectID is not valid: %s", docId);
                    return res
                            .status(404)
                            .send(new Error());
                }
                var collection = db.collection(collectionName);
                collection.findAndModify(
                    { "_id": new ObjectId(docId) }, // query
                    [['_id','asc']],  // sort order
                    { $set: req.body }, // replacement, replaces only the fields in object
                    {}, // options
                    function(err, doc) 
                    {
                        if (err || !doc) {
                            if( err ) {
                                console.error(err);
                            }
                            res
                                .status(404)
                                .send(err);
                        } else {
                            // If no change, may send 304 Not Modified (See: If-Modified-Since)
                            res
                                .sendStatus(204);   // 204 - not returning data
                        }
                    });
            });
            return router;
        }
    };

    var callback = modCallback || function(err,obj) {
        if( err ) {
            console.log(err);
            throw new Error( err.message );
        }
    };

    dbCore(service, callback);
};