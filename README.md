openapi-rim-app
===============

This package provides automatic generation of client source code for 
redux-immutable-model based applications. 

Core Concepts
-------------

The intent of this package is to greatly simplify the process of using Redux
to consume RESTful APIs that comply with the OpenAPI 3.0 specification. The
underlying idea is to work from a specially annotated OpenAPI specification 
document to generate a set of data model objects and data model containers
that act as services that you can leverage within a Redux application. This
approach layers on top of Redux and Immutable in ways that should be
interoperable.

In addition to generating the data model, this package also generates a set
of unit tests that validate / provide code coverage for the generated code.

Data Model Object
-----------------
Data model objects created by this package have the following characteristics:

* They have a known inheritance hierarchy:
  * immutable-inherit
    * BaseRimObject
      * Orim\<ModelObjectName>
        * \<ModelObject>

The immutable-inherit object provides a minimum set of key immutable attributes,
so that it and its subclasses can be contained in Immutable containers and
treated as Immutable objects.

The BaseRIMObject adds behaviors specific to a client representation of a data
model object whose persistent state resides within an OpenAPI server. It adds 
behavior to immutable-inherit to track object state relative to the server 
(e.g. new, dirty)

The Orim<ModelObjectName> class provides accessor methods for the data
properties of the model object as specified in the OpenAPI specification, as
well as methods to support API calls.

At the current time, there are some core assumptions about data model objects.
The most significant is that each data model object has a UUID that identifies
a unique instance of the object, and this object is the primary key for that
data model object.

Data Model Services
-------------------

The data model service class provides collection management for data model
objects, as well as action methods to trigger API calls on data model objects.

Some key methods of a data model service include:

* SaveNew - Save a new data model object
* SaveUpdate - Save changes to a data model object
* CreateNew - Return a new, initialized data model object
* SaveDelete - Delete a data model object

OpenAPI Attributes
------------------
The following attributes are used by OpenAPI RIM App to determine what the source
schema is.

- Schema Tags
    - **x-orim-create** - Identifies schema names for object creation. A synonym
    is **x-smoacks-create**.
    - **x-orim-test-data** - Flags whether to emit test data for this object. A
    synonym is **x-smoacks-test-data**
    - **x-orim-update** - Flags whether this schema should be used for object
    updates.
    - **x-orim-extended** - Not sure what this does either
- Property Tags
    - **x-orim-model-id** - Identifies the identifier(s) in a model object. A
    synonym is **x-smoacks-model-id**.
    - **x-orim-linked-object** - Not sure I recall what this does

Usage
-----

To use, edit the config.json file to point to the OpenAPI 3.0 specification 
document in your source tree, then run `npm run gen`.

Version History
---------------
* 0.1.6 - Generates app structure
* 0.1.5 - Added support for SMOACKS synonyms
* 0.1.4 - Added ability to create source directories if they don't exist
