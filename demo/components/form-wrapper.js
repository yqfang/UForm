angular.module("up.uform")
    	.directive('formWrapper', function($timeout) {
		return {
			restrict: 'EA',
            transclude: true,
			templateUrl: 'components/form-wrapper.html',
			link: function(scope, elem, attr, ctrl, transclude) {
                // $timeout(function(){
                //                         transclude(function (clone) {

                //         angular.forEach(clone, function (cloneEl) {
                //              debugger;
                //             if (cloneEl.nodeName !== "#text") {
                //                 var targetName = cloneEl.attributes["transclude-to"].value;
                //                 var target = elem.find("[transclude-id='" + targetName + "']");
                //                 if (target.length) {
                //                     target.append(cloneEl);
                //                 } else {
                //                     cloneEl.remove();
                //                     throw new Error("Target not found. Please specify the correct transclude-to attribute.");
                //                 }
                //             }

                //         })
                //     })




                // }, 0)
		    }
		}
	})
