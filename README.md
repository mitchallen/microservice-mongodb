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

Provides MongoDB access through a microservice.

* [Post method](POST-README.md)
* [GetOne method](GET-ONE-README.md)
* [Delete method](DEL-README.md)
* [Put method](PUT-README.md)


### Define a Service Object

Each method requires a service object.

The example shows one way of getting connection info from an environment variable.

    var service = {
    	name: ...,
    	version: ...,
    	verbose: ...,
    	apiVersion: ...,
    	port: ...,
    	collectionName: ...,
    	
    	mongodb: {
            uri: process.env.TEST_MONGO_URI || 'mongodb://localhost/test',
        },
        
    	method: function (info) {
    	
    		var router = info.router,
                db = info.connection.mongodb.db;
    		
    		router.[get,post,put,patch,delete] ... { 
    		   
				// Call a MongDB API method
				db.[method](function(err,...) {
				})
    		};
    		
			return router;
    	}

    };
  
To login with a username and password, you would need a __uri__ like this example for [mlab.com](http://mlab.com):

    export TEST_MONGO_URI='mongodb://foo:fooword@ds12345.mlab.com:12345/dbnode01'  
    
You would replace __foo__ with your __mlab__ username and __fooword__ with your password. 

You don't have to use your mlab login info. They let you add other users, such as a test user.

The __12345__ portion of the string would change to match the uri that mlabs gives you. 
    
### Pass the Service Object to the microservice-mongodb module:

Pass the __service__ object that you define to the a module method:

	var core = require('@mitchallen/microservice-mongodb');

    core.Post(service, function(err,obj) {});

The object returned by the callback contains a __server__ field:

    { server: server }

It's a pointer to the express modules server. If you are familiar with express, it's the value returned by __app.listen__. You don't need to actually return anything. 

It was handy for me to use the __close__ method in the unit tests so I wouldn't get port-in-use errors. It's also used internally when the module unexpectedly terminates.

Here is how it should be used:

    core.Post(options, function(err,obj) {
        if(err) {
        	// ...
        }
        var server = obj.server;
        server.close()
    });

* * *

## Testing

To test, go to the root folder and type (sans __$__):

    $ npm test
   
* * *
 
## Repo(s)

* [bitbucket.org/mitchallen/microservice-mongodb.git](https://bitbucket.org/mitchallen/microservice-mongodb.git)
* [github.com/mitchallen/microservice-mongodb.git](https://github.com/mitchallen/microservice-mongodb.git)

* * *

## Contributing

In lieu of a formal style guide, take care to maintain the existing coding style.
Add unit tests for any new or changed functionality. Lint and test your code.

* * *

## Version History

#### Version 0.3.1 release notes

* Bumped version because breaks backward compatibility
* Removed Service method
* Added __Post__, __GetOne__, __Put__ and __Delete__ methods
* Removed outdated examples (will update later)


#### Version 0.2.2 release notes

* Updated examples

#### Version 0.2.1 release notes

* Updated @mitchallen/microservice-core to 0.3.1
* Now uses __Service__ method 
* Bumped version because breaks backward compatibility

#### Version 0.1.3 release notes

* Updated package info in example

#### Version 0.1.2 release notes

* Updated example pseudo code in readme

#### Version 0.1.1 release notes

* Cleaned up examples/music-post

#### Version 0.1.0 release notes

* Initial release