Put Method
========================================

A microservice REST PUT module for update a record in MongoDB
---------------------------------------------------------------------------

For a background on the core and microservices, visit the core npm page.

* * *

## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/microservice-mongodb --save
  
* * *

## Usage

Provides a way to update a record in MongoDB via REST PUT.

__PUT__ is similar to __POST__ where you have to pass in data. But since you are updating a record that already exists, you need to also append a record id to the URL.

    $ curl -i -X PUT -H "Content-Type: application/json" -d '{"email":"test@put.com","password":"foo","status":"UPDATED"}' http://localhost:3030/api/mytest/54ce6eca470103ca057b0097
  
The general philosophy with __PUT__ is that you should use it to replace the entire record, and you should use __PATCH__ to do partial updates. If you only pass in an incomplete set of fields, this component does a merge. Technically that isn't very RESTful. If you want to be more strict, simply make sure to pass in all fields.

### Non-Secure Only

Please note that this module is for NON-SECURE put requests only. For ideas on how to create an SSL version see: [@mitchallen/microservice-ssl](https://www.npmjs.com/package/@mitchallen/microservice-ssl). You may also want to checkout [RichmondJS](https://www.npmjs.com/package/richmond).

### Define a Service Object

Define a service object with the following fields:

* __name__: the name of your service (see example to use package name)
* __version__: the version of your service (see example to use package version)
* __verbose__: true or false, whether or not to echo info to the console
* __prefix__: example: if prefix = "/v1", urls will begin with that (/v1/music)
* __port__: HTTP port to listen on
* __mongodb__: MongoDB connection info 
  * __mongodb.uri__: MongoDB uri (example: mongodb://localhost/test)
* __collectionName__: name of the MongoDB collection for inserting records into

### Put Example

Here is the code from the example folder: __examples/music-put/index.js__

    "use strict";
    
    let demand = require('@mitchallen/demand'),
    	dbCore = require('@mitchallen/microservice-mongodb',
       prefix = process.env.MUSIC_PUT_API_VERSION || '/v1';
    
    var service = {
    
        name: require("./package").name,
        version: require("./package").version,
        verbose: true,
        prefix: prefix,
        port: process.env.MUSIC_PUT_PORT || 8008,
        mongodb: {
            uri: process.env.TEST_MONGO_URI || 'mongodb://localhost/test',
        },
        collectionName: "music",
    };
    
    dbCore.Put(service, function(err,obj) {
        if( err ) {
            console.log(err);
            throw new Error( err.message );
        }
    });

1. Create a file with the contents above called __index.js__
2. Execute the following at the command line:

        npm install
        npm install @mitchallen/microservice-mongodb --save
        npm install @mitchallen/demand --save
3. Run the app and leave it running:

        node index.js
        
4. Execute the following in the second terminal window (all on one line) (assumes a Mac or Linux and that the port is not busy). Substitute __{id}__ with an id from a music collection in your database. If you want to see a way to create data for testing, see the __examples/music-post__ folder in the git repo:
       
        curl -i -X PUT -H "Content-Type: application/json" -d @data.json http://localhost:8008/v1/music/{id}
       
* * *

## MongoDB with Username and Password

To login with a username and password, you would need a __uri__ like this example for [mlab.com](http://mlab.com):

    export TEST_MONGO_URI='mongodb://foo:fooword@ds12345.mlab.com:12345/dbnode01'  
    
You would replace __foo__ with your __mlab__ username and __fooword__ with your password. 

You don't have to use your mlab login info. They let you add other users, such as a test user.

The __12345__ portion of the string would change to match the uri that mlabs gives you. 
 
* * *

## Callback

You pass the __service__ object to the module along with a callback:

    require('@mitchallen/microservice-mongodb-get-one')(service, function(err,obj) {});

The object returned by the callback contains a __server__ field:

    { server: server }

It's a pointer to the express modules server. If you are familiar with express, it's the value returned by __app.listen__. You don't need to actually return anything. 

It was handy for me to use the __close__ method in the unit tests so I wouldn't get port-in-use errors.

Here is an example of how to create it, then use the server return value to close it (checking for null omitted for brevity):

    dbCore.Put(options, function(err,obj) {
        if(err) {
        	// ...
        }
        var server = obj.server;
        server.close()
    }); 
 
* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm run test-put
   