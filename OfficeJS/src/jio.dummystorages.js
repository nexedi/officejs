
// Adds 3 dummy storages to JIO
// type:
//     - dummyallok
//     - dummyallfail
//     - dummyallnotfound
//     - dummyall3tries
(function () { var jioDummyStorageLoader = function ( Jio ) {

    ////////////////////////////////////////////////////////////////////////////
    // Dummy Storage 1 : all ok
    var newDummyStorageAllOk = function ( spec, my ) {
        var that = Jio.storage( {type:'base'}, my );

        that.setType('dummyallok');

        that.saveDocument = function (command) {
            // Tells us that the document is saved.

            setTimeout (function () {
                command.done();
            }, 100);
        }; // end saveDocument

        that.loadDocument = function (command) {
            // Returns a document object containing all information of the
            // document and its content.

            setTimeout(function () {
                var doc = {
                    'name': 'file',
                    'content': 'content',
                    'creation_date': 10000,
                    'last_modified': 15000};
                command.done(doc);
            }, 100);
        }; // end loadDocument

        that.getDocumentList = function (command) {
            // It returns a document array containing all the user documents
            // with/but their content.

            setTimeout(function () {
                var list = [
                    {'name':'file',
                     'content':'filecontent',
                     'creation_date':10000,
                     'last_modified':15000},
                    {'name':'memo',
                     'content':'memocontent',
                     'creation_date':20000,
                     'last_modified':25000
                    }];
                if (command.getOption('metadata_only')) {
                    delete list[0].content;
                    delete list[1].content;
                }
                command.done(list);
            }, 100);
        }; // end getDocumentList

        that.removeDocument = function (command) {
            // Remove a document from the storage.

            setTimeout (function () {
                command.done();
            }, 100);
        };
        return that;
    },
    // end Dummy Storage All Ok
    ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Dummy Storage 2 : all fail
    newDummyStorageAllFail = function ( spec, my ) {
        var that = Jio.storage( {type:'base'}, my );

        that.setType('dummyallfail');

        that.saveDocument = function (command) {
            // Tells us that the document is not saved.

            setTimeout (function () {
                command.fail({status:0,statusText:'Unknown Error',
                              message:'Unknown error.'});
            }, 100);
        }; // end saveDocument

        that.loadDocument = function (command) {
            // Returns a document object containing nothing.

            setTimeout(function () {
                command.fail({status:0,statusText:'Unknown Error',
                              message:'Unknown error.'});
            }, 100);
        }; // end loadDocument

        that.getDocumentList = function (command) {
            // It returns nothing.

            setTimeout(function () {
                command.fail({status:0,statusText:'Unknown Error',
                              message:'Unknown error.'});
            }, 100);
        }; // end getDocumentList

        that.removeDocument = function (command) {
            // Remove a document from the storage.

            setTimeout (function () {
                command.fail({status:0,statusText:'Unknown Error',
                              message:'Unknown error.'});
            }, 100);
        };
        return that;
    },
    // end Dummy Storage All Fail
    ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Dummy Storage 3 : all not found
    newDummyStorageAllNotFound = function ( spec, my ) {
        var that = Jio.storage( {type:'base'}, my );

        that.setType('dummyallnotfound');

        that.saveDocument = function (command) {
            // Document does not exists yet, create it.

            setTimeout (function () {
                command.done();
            }, 100);
        }; // end saveDocument

        that.loadDocument = function (command) {
            // Returns a document object containing nothing.

            setTimeout(function () {
                command.fail({status:404,statusText:'Not Found',
                              message:'Document "'+ command.getPath() +
                              '" not found.'});
            }, 100);
        }; // end loadDocument

        that.getDocumentList = function (command) {
            // It returns nothing.

            setTimeout(function () {
                command.fail({status:404,statusText:'Not Found',
                              message:'User list not found.'});
            }, 100);
        }; // end getDocumentList

        that.removeDocument = function (command) {
            // Remove a document from the storage.

            setTimeout (function () {
                command.done();
            }, 100);
        };
        return that;
    },
    // end Dummy Storage All Not Found
    ////////////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////
    // Dummy Storage 4 : all 3 tries
    newDummyStorageAll3Tries = function ( spec, my ) {
        var that = Jio.storage( {type:'base'}, my ), priv = {};

        that.setType('dummyall3tries');

        priv.doJob = function (if_ok_return) {
            // wait a little in order to simulate asynchronous operation
            setTimeout(function () {
                priv.Try3OKElseFail (priv.command.getTried(),if_ok_return);
            }, 100);
        };
        priv.Try3OKElseFail = function (tries,if_ok_return) {
            if ( tries === 3 ) {
                return priv.command.done(if_ok_return);
            }
            if ( tries < 3 ) {
                return priv.command.fail(
                    {message:'' + (3 - tries) + ' tries left.'});
            }
            if ( tries > 3 ) {
                return priv.command.fail({message:'Too much tries.'});
            }
        };

        that.saveDocument = function (command) {
            priv.command = command;
            priv.doJob ();
        }; // end saveDocument

        that.loadDocument = function (command) {
            priv.command = command;
            priv.doJob ({
                'content': 'content2',
                'name': 'file',
                'creation_date': 11000,
                'last_modified': 17000
            });
        }; // end loadDocument

        that.getDocumentList = function (command) {
            priv.command = command;
            priv.doJob([{'name':'file',
                         'creation_date':10000,
                         'last_modified':15000},
                        {'name':'memo',
                         'creation_date':20000,
                         'last_modified':25000}
                       ]);
        }; // end getDocumentList

        that.removeDocument = function (command) {
            priv.command = command;
            priv.doJob();
        }; // end removeDocument

        return that;
    };
    // end Dummy Storage All 3 Tries
    ////////////////////////////////////////////////////////////////////////////

    // add key to storageObjectType of global jio
    Jio.addStorageType('dummyallok', newDummyStorageAllOk);
    Jio.addStorageType('dummyallfail', newDummyStorageAllFail);
    Jio.addStorageType('dummyallnotfound', newDummyStorageAllNotFound);
    Jio.addStorageType('dummyall3tries', newDummyStorageAll3Tries);

};

if (window.requirejs) {
    define ('JIODummyStorages',['JIO'], jioDummyStorageLoader);
} else {
    jioDummyStorageLoader ( jio );
}

}());
