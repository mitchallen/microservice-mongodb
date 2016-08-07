@mitchallen/microservice-mongodb
=================================

A microservice module for connecting to MongoDB
----------------------------------------------------
This module extends the [@mitchallen/microservice-core](https://www.npmjs.com/package/@mitchallen/microservice-core) module to create microservice endpoints to connect with MongoDB.

For a background on the core and microservices, visit the core npm page.

* * *

## Installation

You must use __npm__ __2.7.0__ or higher because of the scoped package name.

    $ npm init
    $ npm install @mitchallen/microservice-mongodb --save
  
* * *

## Usage

Provides MongoDB access to a microservice.

### Connection Info

By default the module will attempt to connect with a local MongoDB on port 8000. To specify different connection info update these environment variable (*never* check sensitive connection info into source!):

    export TBD=TBD

### Define a Service Object

For MongoDB and other database support the original core service object was extended to return connection info (__info.connect__).  The info.connect object contains and item: __mongo__ to access the dabase.

    var service = {
    	name: ...,
    	version: ...,
    	verbose: ...,
    	apiVersion: ...,
    	port: ...,
    	method: function (info) {
    	
    		var router = info.router,
                conn = info.connection.mongodb.conn;
    		
    		router.[get,post,put,patch,delete] ... { 
    		   
				// Call a MongDB API method
				conn.[method](function(err,...) {
				})
    		};
    		
			return router;
    	}

    };
    
    
### Pass the Service Object to the microservice-mongodb module:

Pass the __service__ object that you define to the module:

    require('@mitchallen/microservice-mongodb')(service, callback);
        
#### Return Value

## TODO - this section needs revision

The object returned by the module contains a __server__ field:

    { server: server }

It's a pointer to the express modules server. If you are familiar with express, it's the value returned by __app.listen__. You don't need to actually return anything. 

It was handy for me to use the __close__ method in the unit tests so I wouldn't get port-in-use errors. It's also used internally when the module unexpectedly terminates.

Here is an example of how to create it, then use the server return value to close it (checking for null omitted for brevity):

    require('@mitchallen/microservice-mongodb')(options, function(err,obj) {
        if(err) {
        	// ...
        }
        var server = obj.server;
        server.close()
    });


### Example

You can find working examples in the examples folder of the git repo.

* __examples / table-list__ - demos how to read a list of tables in MongoDB
* __examples / music-post__ - demos how to post a record to the Mongo (see music-post README for script to create Music table)


* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/microservice-mongodb.git](https://bitbucket.org/mitchallen/microservice-mongodb.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.1.0 release notes

* Initial release