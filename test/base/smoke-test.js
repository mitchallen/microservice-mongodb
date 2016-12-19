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
    modulePath = "../../index",
    testName = require("../../package").name,
    testVersion = require("../../package").version,
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

    it('should exist after being required', function(done) {
        should.exist(_module);
        done();
    });


});