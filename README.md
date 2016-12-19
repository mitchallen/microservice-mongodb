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

* [Post method](https://github.com/mitchallen/microservice-mongodb/blob/master/POST-README.md)
* [GetOne method](https://github.com/mitchallen/microservice-mongodb/blob/master/GET-ONE-README.md)
* [Delete method](https://github.com/mitchallen/microservice-mongodb/blob/master/DEL-README.md)
* [Put method](https://github.com/mitchallen/microservice-mongodb/blob/master/PUT-README.md)

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

#### Version 0.3.3 release notes

* Updated README

#### Version 0.3.2 release notes

* Hard coded child README links to GitHub

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