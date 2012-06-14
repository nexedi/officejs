var storage = function(spec, my) {
    var that = {};
    spec = spec || {};
    my = my || {};
    // Attributes //
    var priv = {};
    priv.type = spec.type || '';

    // Methods //
    that.getType = function() {
        return priv.type;
    };
    that.setType = function(type) {
        priv.type = type;
    };

    /**
     * Execute the command on this storage.
     * @method execute
     * @param  {object} command The command
     */
    that.execute = function(command) {
        that.validate(command);
        that.done = command.done;
        that.fail = command.fail;
        command.executeOn(that);
    };

    /**
     * Override this function to validate specifications.
     * @method isValid
     * @return {boolean} true if ok, else false.
     */
    that.isValid = function() {
        return true;
    };

    that.validate = function(command) {
        var mess = that.validateState();
        if (mess) {
            throw invalidStorage({storage:that,message:mess});
        }
        command.validate(that);
    };

    /**
     * Returns a serialized version of this storage.
     * @method serialized
     * @return {object} The serialized storage.
     */
    that.serialized = function() {
        return {type:that.getType()};
    };

    that.saveDocument    = function(command) {
        throw invalidStorage({storage:that,message:'Unknown storage.'});
    };
    that.loadDocument    = function(command) {
        that.saveDocument();
    };
    that.removeDocument  = function(command) {
        that.saveDocument();
    };
    that.getDocumentList = function(command) {
        that.saveDocument();
    };

    that.validateState = function() {
        return '';
    };

    that.done = function() {};
    that.fail = function() {};

    return that;
};
