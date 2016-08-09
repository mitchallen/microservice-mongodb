"use strict";

let demand = require('@mitchallen/demand');
let prefix = process.env.MUSIC_POST_API_VERSION || '/v1';
let tableName = "music";
let path = "/" + tableName;
let sLocation = prefix + path;

var service = {

    name: require("./package").name,
    version: require("./package").version,
    verbose: true,
    apiVersion: prefix,
    port: process.env.MUSIC_POST_PORT || 8003,
    mongodb: {
        uri: process.env.TEST_MONGO_URI || 'mongodb://localhost/test',
    },

    method: function(info) {
        var router = info.router,
               db  = info.connection.mongodb.db;
        demand.notNull(db);
        router.post( path, function (req, res) {
            var collection = db.collection(tableName);
            // Insert some documents 
            // In the mongo shell, verify with: db.music.find()
            collection.insert(
                req.body
            , function(err, result) {
                if( err ) {
                    console.error(err);
                    res
                        .status(500)
                        .send(err);
                } else {
                    let docId = result.insertedIds[0];
                    let location = prefix + path + "/" + docId;
                    console.log("New record created: %s", location )
                    res
                        .location(location)
                        .status(201)
                        .json(result);
                }
            });
        
        });
        return router;
    }
};

require('@mitchallen/microservice-mongodb')(service, function(err,obj) {
    if( err ) {
        console.log(err);
        throw new Error( err.message );
    }
});