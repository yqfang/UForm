;(function() {
	angular.module("myApp", ["uForm", 'ui.bootstrap', 'ui.router'])
		.run(function ($rootScope, $state, $stateParams) {
			   $rootScope.monitor = {};
			   $rootScope.monitor.$state = $state;
			   $rootScope.monitor.$stateParams = $stateParams;
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
					abstract: true,
					url: '/form',
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
				.state('form.common', {
					url: '/common/{type}',
					templateUrl: 'demo/form-common.html',
					controller: 'formCommonController',
					controllerAs: 'vm'
				})
				.state('form.group', {
					url: '/group',
					templateUrl: 'demo/form-group.html',
					controller: 'formGroupController',
					controllerAs: 'vm'
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

		.controller("formCommonController", function(json, $rootScope, $stateParams) {
			var vm = this;
			$rootScope.monitor.form = json[$stateParams.type];
			this.fields = json[$stateParams.type].fields;
			this.option = json[$stateParams.type].option;
			this.result = 'inline' === $stateParams.type 
			? {startDate: new Date(), endDate: new Date()}
			:{datefor: new Date(), datetime: new Date()};
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