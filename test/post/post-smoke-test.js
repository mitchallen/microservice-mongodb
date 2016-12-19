/**
    Module: @mitchallen/microservice-mongodb-post
      Test: smoke-test
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

"use strict";

var request = require('supertest'),
    should = require('should'),
    modulePath = "../../index",
    testName = require("../../package").name,
    testVersion = require("../../package").version,
    verbose = process.env.TEST_VERBOSE || false,
    testPort = process.env.TEST_SERVICE_PORT || 8200,
    testCollectionName = "test-qa",
    testPrefix = "/v1",
    testUrl = testPrefix + "/" + testCollectionName,
    testHost = "http://localhost:" + testPort,
    testMongo =  {
        // NOTE: if you change '/test' to '/test2', 
        // a test2 DB will be created in Mongo
        // Then all operations will go to test2.
        uri: process.env.TEST_MONGO_URI || 'mongodb://localhost/test',
    };

describe('post microservice smoke test', function() {

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
            prefix: testPrefix,
            mongodb: testMongo,
            collectionName: testCollectionName,
        };
        _module.Post(options, function(err,obj) {
            should.not.exist(err);
            should.exist(obj);
            var server = obj.server;
            should.exist(server);
            server.close(done)
        });
    });

    it('should post to url', function(done) {

        var options = {
            name: testName,
            version: testVersion,
            verbose: verbose,
            port: testPort,
            prefix: testPrefix,
            mongodb: testMongo,
            collectionName: testCollectionName
        };
        
        _module.Post(options, function(err,obj) {
            should.not.exist(err);
            should.exist(obj);
            var server = obj.server;
            should.exist(server);

            let testObject = {qa : 321};

            // console.log("TEST URL: " + testUrl);

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
});