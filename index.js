/**
    Module: @mitchallen/microservice-mongodb
    Author: Mitch Allen
*/

/*jshint node: true */
/*jshint esversion: 6 */

var post = require('./lib/post'),
    getOne = require('./lib/get-one');

module.exports = {
    Post: post,
    GetOne: getOne,
};
