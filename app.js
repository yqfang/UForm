;(function() {

	angular.module("myApp", ["uForm", 'ngSanitize', "ui.select", 'ui.bootstrap', 'ui.router', 'ngPrettyJson'])
		.run(function ($rootScope, $state, $stateParams) {
			   $rootScope.monitor = {};
			   $rootScope.monitor.$state = $state;
			   $rootScope.monitor.$stateParams = $stateParams;
			   $rootScope.$state = $state;
			   $rootScope.$stateParams = $stateParams;
		    })
		.config(function(datepickerConfig, $translateProvider, dialogsProvider) {
			datepickerConfig.showWeeks = false;
			dialogsProvider.setSize("md");
			dialogsProvider.useBackdrop("static");
			$translateProvider.translations('zh-CN',{
				DIALOGS_ERROR: "错误",
				DIALOGS_ERROR_MSG: "出现未知错误。",
				DIALOGS_CLOSE: "关闭",
				DIALOGS_PLEASE_WAIT: "请稍候",
				DIALOGS_PLEASE_WAIT_ELIPS: "请稍候...",
				DIALOGS_PLEASE_WAIT_MSG: "请等待操作完成。",
				DIALOGS_PERCENT_COMPLETE: "% 已完成",
				DIALOGS_NOTIFICATION: "通知",
				DIALOGS_NOTIFICATION_MSG: "未知应用程序的通知。",
				DIALOGS_CONFIRMATION: "确认",
				DIALOGS_CONFIRMATION_MSG: "确认要求。",
				DIALOGS_OK: "确定",
				DIALOGS_YES: "确认",
				DIALOGS_NO: "取消"
			});
		})
		.config(function($stateProvider, $urlRouterProvider) {
			
			$urlRouterProvider
				.when('/', '/form/common/horizontal')
				.otherwise('/form/common/horizontal');
			$stateProvider
				.state('form', {
					url: '/form',
					abstract: true,
					templateUrl: 'demo.html',
					resolve: {
						json: function($q, jsonHelper) {
							var defer = $q.defer();
							$q.all([
								jsonHelper.loadHorizontal(),
								jsonHelper.loadInline()
								]).then(function(datas) {
									defer.resolve({
										horizontal: datas[0].data,
										inline: datas[1].data
									});
								});
							return defer.promise;
						}
					}
				})
				.state('form.horizontal', {
					url: '/common/horizontal',
					views: {
				        'horizontal@form': {
				            templateUrl: 'demo/form-common.html',
							controller: 'formHorizontalController',
							controllerAs: 'vm'
				        }
					}
					
				})
				.state('form.inline', {
					url: '/common/inline',
					views: {
				        'inline@form': {
				        	templateUrl: 'demo/form-common.html',
				        	controller: 'formInlineController',
				        	controllerAs: 'vm'
				        }
					}

				})
				.state('form.group', {
					url: '/group',
					views: {
				        'group@form': {
							templateUrl: 'demo/form-group.html',
							controller: 'formGroupController',
							controllerAs: 'vm'
				        }
					}

				})
				
		})

		.factory('jsonHelper', function($http) {
			return ({
				loadHorizontal: loadHorizontal,
				loadInline: loadInline
			});
			function loadHorizontal() {
				return $http.get("demo/form-horizontal.json")
			};
			function loadInline() {
				return $http.get("demo/form-inline.json")
			}
					
		})

		.controller("formHorizontalController", function($timeout, $interval, json, $scope, $rootScope, $stateParams) {
			var vm = this;
			$rootScope.monitor.form = json["horizontal"];
			this.fields = json["horizontal"].fields;
			
			this.option = json["horizontal"].option;
			this.result = {
				username: "方宇卿",
				datetime: new Date(),
				datefor: new Date()
			};
			
			$scope.$watch(function() {
				return vm.result["username"];
				
			}, function(newv, oldv) {
				if(oldv != newv) {
					if(newv === 'hello') {
						vm.fields["password"].hide = false;
					}else {
						vm.fields["password"].hide = true;
						delete vm.result["password"]
					}
				}
			});
			
			$rootScope.monitor.result = this.result;
			$timeout(function() {
				$rootScope.monitor.uform = $scope.uform;
			}, 1);
			

			this.submit = function(form, result) {
				$rootScope.monitor.uform = {};
				$timeout(function() {
				$rootScope.monitor.uform = $scope.uform;
				console.info($scope.uform);
			}, 1000);
				if(form.$valid){
					
					console.info(result);
				}
			}
		})
		.controller("formInlineController", function($timeout, $scope, json, $rootScope, $stateParams) {
			var vm = this;
			$rootScope.monitor.form = json["inline"];
			this.fields = json["inline"].fields;
			this.option = json["inline"].option;
			this.result = {};
			$rootScope.monitor.result = this.result;
			$timeout(function() {
				$rootScope.monitor.uform = $scope.uform;
			}, 500)
			this.submit = function(form, result) {
				console.info($scope.uform);
				if(form.$valid){
					console.info(result);
				}
			}
		})
		.controller("formGroupController", function($timeout, $scope, json, $rootScope) {
			var vm = this;
			$rootScope.monitor.form = {
				group1: json["inline"],
				group2: json["horizontal"]
			} 
			
			this.group1 = {
				fields: json['inline'].fields,
				option: json['inline'].option,
				result: {
					startDate: new Date(),
					endDate: new Date()
				}
			};
			this.group2 = {
				fields: json['horizontal'].fields,
				option: json['horizontal'].option,
				result: {
					datefor: new Date(),
					datetime: new Date()
				}
			};
			$rootScope.monitor.result = {
				result1: this.group1.result,
				result2: this.group2.result
			};
			$timeout(function() {
				$rootScope.monitor.uform = $scope.uform;
			}, 500)
			this.submit = function(grouped, result) {
				console.info($scope.uform);
				if(grouped.$valid){
					console.info(result);
				}
			}
			
		})
		.controller("selectController", function($scope) {
			var vm = this;
			this.result = [];
			this.itemArray = [
				{id: 1, name: 'first'},
				{id: 2, name: 'second'},
				{id: 3, name: 'third'},
				{id: 4, name: 'fourth'},
				{id: 5, name: 'fifth'},
			];
			this.tagTransform = function (newTag) {
				var item = {
					id: newTag,
					name: newTag,
				};
				return item;
			};
		})


})()