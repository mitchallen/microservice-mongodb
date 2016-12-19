/**
    Module: @mitchallen/microservice-mongodb-delete
      Test: status-404-test
    Author: Mitch Allen
*/

"use strict";

var request = require('supertest'),
    should = require('should'),
    modulePath = '../../index',
    testName = require("../../package").name,
    testVersion = require("../../package").version,
    verbose = process.env.TEST_VERBOSE || false,
    testPort = process.env.TEST_SERVICE_PORT || 8030,
    postPort = process.env.TEST_SERVICE_POST_PORT || 8031,
    cleanPort = process.env.TEST_SERVICE_CLEAN_PORT || 8032,
    testCollectionName = "test-qa",
    testPrefix = "/v1",
    testUrl = testPrefix + "/" + testCollectionName,
    postUrl = testPrefix + "/" + testCollectionName,
    testHost = "http://localhost:" + testPort,
    postHost = "http://localhost:" + postPort,
    testMongo =  {
        // NOTE: if for localhost you change '/test' to '/test2', a test2 DB will be created in Mongo.
        // Then all operations will go to test2.
        uri: process.env.TEST_MONGO_URI || 'mongodb://localhost/test'
    },
    testObject = {
        email : "foo@foo.com",
        username: "foo",
        status: "active",
        age: 21
    };

describe('mongodb microservice smoke test', function() {

    var _module = null;

    beforeEach(function(done) {
        delete require.cache[require.resolve(modulePath)];
        _module = require(modulePath);
        done();
    });

    afterEach(function(done) {
        // Cleanup
        done();
    });

    it('delete should return 404 for missing id', function(done) {

        var options = {
            name: testName,
            version: testVersion,
            verbose: verbose,
            port: testPort,
            prefix: testPrefix,
            mongodb: testMongo,
            collectionName: testCollectionName
        };
        
        _module.Delete(options, function(err,obj) {
            should.not.exist(err);
            should.exist(obj);
            var server = obj.server;
            should.exist(server);

            // DELETE
            request(testHost)
                .del(testUrl + "/57ab5062af95fa02b54f1c61" )
                // MUST USE DOUBLE QUOTES - or JSON.parse bombs in GET.
                // .query('filter={"email":"' + testEmail + '"}')
                // .expect('Content-Type', /json/)
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err);
                    server.close(done);
                });
        });
    });

    it('delete should return 404 for invalid id', function(done) {

        var options = {
            name: testName,
            version: testVersion,
            verbose: verbose,
            port: testPort,
            prefix: testPrefix,
            mongodb: testMongo,
            collectionName: testCollectionName
        };
        
        _module.Delete(options, function(err,obj) {
            should.not.exist(err);
            should.exist(obj);
            var server = obj.server;
            should.exist(server);

            // DELETE
            request(testHost)
                .del(testUrl + "/bogus" )
                .expect(404)
                .end(function (err, res) {
                    should.not.exist(err);
                    server.close(done);
                });
        });
    });
});