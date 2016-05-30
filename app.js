;(function() {
	angular.module("myApp", ["uForm", 'ui.bootstrap', 'ui.router','ct.ui.router.extras'])
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
				        'test1@form': {
				            templateUrl: 'demo/form-common.html',
							controller: 'formHorizontalController',
							controllerAs: 'vm'
				        }
					},
					sticky: true,
					deepStateRedirect: true
					
				})
				.state('form.inline', {
					url: '/common/inline',
					views: {
				        'test2@form': {
				        	templateUrl: 'demo/form-common.html',
				        	controller: 'formInlineController',
				        	controllerAs: 'vm'
				        }
					},
					sticky: true,
					deepStateRedirect: true

				})
				.state('form.group', {
					url: '/group',
					views: {
				        'test3@form': {
							templateUrl: 'demo/form-group.html',
							controller: 'formGroupController',
							controllerAs: 'vm'
				        }
					},
					sticky: true,
					deepStateRedirect: true

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
			console.info("formHorizontalController")
			var vm = this;
			$rootScope.monitor.form = json["horizontal"];
			this.fields = json["horizontal"].fields;
			this.option = json["horizontal"].option;

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
		.controller("formInlineController", function(json, $rootScope, $stateParams) {
			console.info("formInlineController")
			var vm = this;
			$rootScope.monitor.form = json["inline"];
			this.fields = json["inline"].fields;
			this.option = json["inline"].option;

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
			console.info("formGroupController")
			var vm = this;
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
			this.submit = function(valid, result) {
				if(valid){
					console.info(result);
				}
			}
		})


})()