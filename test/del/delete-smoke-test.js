/**
    Module: @mitchallen/microservice-mongodb/lib/
      Test: delete-smoke-test
    Author: Mitch Allen
*/

"use strict";

var request = require('supertest'),
    should = require('should'),
    modulePath = '../../index',
    testName = require("../../package").name,
    testVersion = require("../../package").version,
    verbose = process.env.TEST_VERBOSE || false,
    testPort = process.env.TEST_SERVICE_PORT || 8022,
    postPort = process.env.TEST_SERVICE_POST_PORT || 8023,
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

describe('Delete microservice smoke test', function() {

    var docId = null,   // Set by before method
    _module = null,
    _postModule = null;

    beforeEach(function(done) {

        delete require.cache[require.resolve(modulePath)];
        _module = require(modulePath);
        
        var postOptions = {
            name: testName,
            version: testVersion,
            verbose: verbose,
            port: postPort,
            prefix: testPrefix,
            mongodb: testMongo,
            collectionName: testCollectionName
        };

        _module.Post(postOptions, function(err,postObj) {
            
            should.not.exist(err);
            should.exist(postObj);
            var postServer = postObj.server;
            should.exist(postServer);

            request(postHost)
                .post(postUrl)
                .send(testObject)
                .set('Content-Type', 'application/json')
                .expect(201)
                .end(function (err, res) {
                    should.not.exist(err);
                    if(verbose) {
                        console.log("BODY: %s", JSON.stringify(res.body) );
                        console.log("DOC ID: %s", JSON.stringify(res.body.insertedIds[0]) );
                    }
                    should.exist(res.body);
                    should.exist(res.body.result);
                    should.exist(res.body.result.ok);
                    res.body.result.ok.should.eql(1);
                    should.exist(res.body.result.n);
                    res.body.result.n.should.eql(1);
                    should.exist(res.body.insertedIds[0]);
                    docId = res.body.insertedIds[0];
                    should.exist(docId);
                    postServer.close(done);
                });

            });
    });

    afterEach(function(done) {
        // Cleanup
        done();
    });

    it('should delete from url', function(done) {

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
                .del(testUrl + "/" + docId)
                // MUST USE DOUBLE QUOTES - or JSON.parse bombs in GET.
                // .query('filter={"email":"' + testEmail + '"}')
                .expect('Content-Type', /json/)
                .expect(200)
                .end(function (err, res) {
                    should.not.exist(err);
                    should.exist(res.body);
                    if(verbose) {
                        console.log(JSON.stringify(res.body));
                    }
                    should.exist(res.body);
                    should.exist(res.body.status);
                    res.body.status.should.eql("OK");
                    server.close(done);
                });
        });
    });
});