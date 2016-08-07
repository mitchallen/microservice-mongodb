/**
    Module: @mitchallen/microservice-mongo
      Test: smoke-test
    Author: Mitch Allen
*/

"use strict";

var request = require('supertest'),
    should = require('should'),
    testName = require("../package").name,
    testVersion = require("../package").version,
    verbose = process.env.TEST_VERBOSE || false,
    testPort = process.env.TEST_SERVICE_PORT || 8200,
    testHost = "http://localhost:" + testPort,
    testMongo =  {
        uri: process.env.MONGO_SERVICE_DB || 'mongodb://localhost/test',
        options: {
            user: process.env.MONGO_SERVICE_USER || null,
            pass: process.env.MONGO_SERVICE_PASS || null
        }
    };

describe('mongo service smoke test', function() {

      it('should not throw an error', function(done) {
        var options = {
            name: testName,
            version: testVersion,
            verbose: verbose,
            port: testPort,
            apiVersion: "/admin",
            mongodb: testMongo,
            method: function(info) {
                var router = info.router;
                return router;
            }
        }
        var modulePath = '../index';
        // Needed for cleanup between tests
        delete require.cache[require.resolve(modulePath)];
        require(modulePath)(options, function(err,obj) {
            should.not.exist(err);
            should.exist(obj);
            var server = obj.server;
            should.exist(server);
            server.close(done)
        });
    });

    it('should get url', function(done) {

        let prefix = "/test1";
        let path = "/table/list";

        var options = {
            
            name: testName,
            version: testVersion,
            verbose: verbose,
            port: testPort,
            apiVersion: prefix,
            mongodb: testMongo,

            method: function(info) {
                var router = info.router,
                       db  = info.connection.mongodb.db;
                should.exist(db);
                router.get( path, function (req, res) {

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

                    /*
                    mongo.db.collectionNames.toArray((err, collections) => {
                        if( err ) {
                            console.error(err);
                            res
                                .status(500)
                                .send(err);
                        } else {
                            if( info.verbose ) {
                                console.log('listTables:', collections);
                            }
                            res.json(collections);
                        }
                    });
                    */

                    /* 
                    // 4.x
                    mongo.db.listCollections().toArray((err, collections) => {
                        if( err ) {
                            console.error(err);
                            res
                                .status(500)
                                .send(err);
                        } else {
                            if( info.verbose ) {
                                console.log('listTables:', collections);
                            }
                            res.json(collections);
                        }
                    });
                    */
                });

                return router;
            }
        }
        
        var modulePath = '../index';
        // Needed for cleanup between tests
        delete require.cache[require.resolve(modulePath)];
        require(modulePath)(options, function(err,obj) {
            should.not.exist(err);
            should.exist(obj);
            var server = obj.server;
            should.exist(server);
        
            var testUrl =  prefix + path;
            request(testHost)
                .get(testUrl)
                .expect(200)
                .end(function (err, res){
                    should.not.exist(err);
                    if(verbose) {
                        console.log("BODY: %s", JSON.stringify(res.body) );
                    }
                    should.exist(res.body);
                    server.close(done);
                });
        });
    });
});