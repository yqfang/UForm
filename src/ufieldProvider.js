uf.provider('ufield', [function() {
    var _tp = 'input'; // type
    var _vo = 'dirty'; // validateOn
    var _setOpts = function(opts){
        var _opts = {};
        opts = opts || {};
        _opts.type = (angular.isDefined(opts.type)) ? opts.type : _tp; // type
        _opts.validateOn = (angular.isDefined(opts.validateOn) && ((opts.validateOn === 'dirty') || (opts.validateOn === 'blur'))) ? opts.validateOn : _vo; // validate_on
        return _opts;
    }; // end _setOpts
    this.useType = function(val) {
        if(angular.isDefined(val))
        _tp = val;
    }
    this.useValidateOn = function(val) {
        if(angular.isDefined(val))
        _vo = val;
    }
    this.$get = [function() {
        return {
            create : function (opts) {
                opts = _setOpts(opts);
                return opts;
            }
        }
    }]
}])