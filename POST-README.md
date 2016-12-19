Post method
====================================

A microservice REST POST method for inserting records into MongoDB
---------------------------------------------------------------------------



## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/microservice-mongodb --save
  
* * *

## Usage

Provides a way to insert records into MongoDB via REST POST.

### Non-Secure Only

Please note that this module is for NON-SECURE posts only. For ideas on how to create an SSL version see: [@mitchallen/microservice-ssl](https://www.npmjs.com/package/@mitchallen/microservice-ssl). You may also want to checkout [RichmondJS](https://www.npmjs.com/package/richmond).

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

### Music Post Example

Here is the code from the example folder: __examples/music-post/index.js__

    "use strict";
    
    let demand = require('@mitchallen/demand'),
    	dbCore = require('@mitchallen/microservice-mongodb',
        prefix = process.env.MUSIC_POST_API_VERSION || '/v1';
    
    var service = {
    
        name: require("./package").name,
        version: require("./package").version,
        verbose: true,
        prefix: prefix,
        port: process.env.MUSIC_POST_PORT || 8004,
        mongodb: {
            uri: process.env.TEST_MONGO_URI || 'mongodb://localhost/test',
        },
        collectionName: "music",
    };
    
    dbCore.Post(service, function(err,obj) {
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
        
4. Open up a second terminal window and create a file called __data.json__ with the following contents:

        { 
            "CatalogID": "b123",
            "Artist":"The Beatles",
            "SongTitle":"Abbey Road",
            "Album": "Octopus's Garden"
        }        

5. Execute the following in the second terminal window (all on one line) (assumes a Mac or Linux and that port 8004 is not busy):

        curl -i -X POST -H "Content-Type: application/json" -d @data.json http://localhost:8004/v1/music
        
6. Go to your MongoDB console at look at the contents of the music collection. In the MongoDB shell, verify with: 

        db.music.find()

* * *

## MongoDB with Username and Password

To login with a username and password, you would need a __uri__ like this example for [mlab.com](http://mlab.com):

    export TEST_MONGO_URI='mongodb://foo:fooword@ds12345.mlab.com:12345/dbnode01'  
    
You would replace __foo__ with your __mlab__ username and __fooword__ with your password. 

You don't have to use your mlab login info. They let you add other users, such as a test user.

The __12345__ portion of the string would change to match the uri that mlabs gives you. 
 
* * *

## Callback

You pass the __service__ object to the __Post__ method along with a callback:

    dbCore.Service(service, function(err,obj) {});

The object returned by the callback contains a __server__ field:

    { server: server }

It's a pointer to the express modules server. If you are familiar with express, it's the value returned by __app.listen__. You don't need to actually return anything. 

It was handy for me to use the __close__ method in the unit tests so I wouldn't get port-in-use errors.

Here is an example of how to create it, then use the server return value to close it (checking for null omitted for brevity):

    dbCore.Post(options, function(err,obj) {
        if(err) {
        	// ...
        }
        var server = obj.server;
        server.close()
    }); 
 
* * *
   
### Example

You can find working examples in the examples folder of the git repo.

* __examples / music-post__ - demos how to post a record to MongoDB. See that folders __README__ for more info.
  
* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm run test-post
   
 