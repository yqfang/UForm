;(function() {
	angular.module("myApp", ["uForm", 'ngSanitize', "ui.select", 'ui.bootstrap', 'ui.router','ct.ui.router.extras'])
		.run(function ($rootScope, $state, $stateParams) {
			   $rootScope.monitor = {};
			   $rootScope.monitor.$state = $state;
			   $rootScope.monitor.$stateParams = $stateParams;
			   $rootScope.$state = $state;
			   $rootScope.$stateParams = $stateParams;
		    })
		.config(function(datepickerConfig) {
			datepickerConfig.showWeeks = false;
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
				.state('form.select', {
					url: '/select',
					views: {
				        'select@form': {
							templateUrl: 'demo/select.html',
							controller: 'selectController',
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

		.controller("formHorizontalController", function(json, $rootScope, $stateParams) {
			var vm = this;
			$rootScope.monitor.form = json["horizontal"];
			this.fields = json["horizontal"].fields;
			this.option = json["horizontal"].option;
			this.result = {
				username: "方宇卿"
			};
			$rootScope.monitor.result = this.result;

			this.click = function(field) {
				vm.result[field.name] = "test";
			};
			this.submit = function(valid, result) {
				if(valid){
					console.info(result);
				}
			}
		})
		.controller("formInlineController", function(json, $rootScope, $stateParams) {
			var vm = this;
			$rootScope.monitor.form = json["inline"];
			this.fields = json["inline"].fields;
			this.option = json["inline"].option;
			this.result = {};
			$rootScope.monitor.result = this.result;
			this.click = function(field) {
				vm.result[field.name] = "test";
				console.info(field);
			};
			this.submit = function(valid, result) {
				if(valid){
					console.info(result);
				}
			}
		})
		.controller("formGroupController", function(json, $rootScope) {
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
				},
				click: 	function(field) {
					vm.group2.result[field.name] = "test";
					console.info(field);
				}
			};
			$rootScope.monitor.result = {
				result1: this.group1.result,
				result2: this.group2.result
			};
			this.submit = function(valid, result) {
				if(valid){
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