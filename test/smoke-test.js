/**
    Module: @mitchallen/microservice-mongodb
      Test: smoke-test
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

var request = require('supertest'),
    should = require('should'),
    modulePath = "../index",
    testName = require("../package").name,
    testVersion = require("../package").version,
    verbose = process.env.TEST_VERBOSE || false,
    testPort = process.env.TEST_SERVICE_PORT || 8200,
    testHost = "http://localhost:" + testPort,
    testMongo =  {
        // NOTE: if you change '/test' to '/test2', 
        // a test2 DB will be created in Mongo
        // Then all operations will go to test2.
        uri: process.env.TEST_MONGO_URI || 'mongodb://localhost/test',
    };

describe('mongodb microservice smoke test', function() {

    var _module = null;

    before(function(done) {
        // Call before all tests
        delete require.cache[require.resolve(modulePath)];
        _module = require(modulePath);
        done();
    });

    after(function(done) {
        // Call after all tests
        done();
    });

    beforeEach(function(done) {
        // Call before each test
        done();
    });

    afterEach(function(done) {
        // Call after eeach test
        done();
    });

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
        _module.Service(options, function(err,obj) {
            should.not.exist(err);
            should.exist(obj);
            var server = obj.server;
            should.exist(server);
            server.close(done)
        });
    });

    it('should post to url', function(done) {

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
                router.post( path, function (req, res) {

                    var collection = db.collection('test-qa');
                    
                    // Insert some documents 

                    // In the shell, verify with: db.test-qa.find()

                    collection.insert(
                        req.body
                    , function(err, result) {

                        // callback(result);
                        if( err ) {
                            console.error(err);
                            res
                                .status(500)
                                .send(err);
                        } else {

                            let docId = result.insertedIds[0];

                            res
                                .location( prefix + path + "/" + docId )
                                .status(201)
                                .json(result);
                        }
                    });
                
                });

                return router;
            }
        }
        
        _module.Service(options, function(err,obj) {
            should.not.exist(err);
            should.exist(obj);
            var server = obj.server;
            should.exist(server);

            let testObject = {qa : 321};

            var testUrl =  prefix + path;
            request(testHost)
                .post(testUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res){
                    should.not.exist(err);
                    if(verbose) {
                        console.log("BODY: %s", JSON.stringify(res.body) );
                    }
                    should.exist(res.body);
                    should.exist(res.body.result);
                    should.exist(res.body.result.ok);
                    res.body.result.ok.should.eql(1);
                    should.exist(res.body.result.n);
                    res.body.result.n.should.eql(1);
                    server.close(done);
                });
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

                    var collection = db.collection('test-qa');
                    
                    collection.find({}).limit(3).toArray(function(err, docs) {
                        
                        if( err ) {
                            console.error(err);
                            res
                                .status(500)
                                .send(err);
                        } else {
                            if( info.verbose ) {
                                console.dir(docs);
                            }
                            res.json(docs);
                        }
                    });
                });

                return router;
            }
        }
        
        _module.Service(options, function(err,obj) {
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