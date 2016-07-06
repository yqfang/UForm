uf.provider('ufield', [function() {
    var _tp = 'input'; // type
    var _vo = 'dirty'; // validateOn
    var _pt = /^.*$/; // defaut pattern
    var _setOpts = function(opts){
        var _opts = {};
        opts = opts || {};
        _opts.type = (angular.isDefined(opts.type)) ? opts.type : _tp; // type
        _opts.validateOn = (angular.isDefined(opts.validateOn) && ((opts.validateOn === 'dirty') || (opts.validateOn === 'blur'))) ? opts.validateOn : _vo; // validate_on
        _opts.pattern = (angular.isDefined(opts.pattern)) ? opts.pattern : _pt;
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
    this.usePattern = function(val) {
        if(angular.isDefined(val))
        _pt = val;
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
