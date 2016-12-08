var app = angular.module('app', ['ui.router', 'ngResource']);

app.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    	.state('reg', {
        	// abstract: true,
        	url: '/reg',
        	templateUrl: 'template/reg.html',
        })
    	.state('vol', {
        	abstract: true,
        	url: '/vol',
        	template: '<ui-view></ui-view>',
        })
        .state('vol.mains', {
          url: '/main',
          templateUrl: 'template/main.html'
        })
        .state('vol.task', {
        	url: '/task',
        	templateUrl: 'template/task.html'
        })
        .state('vol.text', {
        	url: '/text/:id',
        	templateUrl: 'template/text.html',
        });
    // $urlRouterProvider.otherwise('reg');
  });
app.run(['$rootScope', '$state', function ($rootScope, $state) {
	$rootScope.$on('$stateChangeStart', function (event, toState) {
		console.log(toState.name)
		if(toState.name !== 'reg' && localStorage.pass != sessionStorage.getItem('pass')) {

			event.preventDefault();
			$state.go('reg', {})
			console.log('f')
		}
	})
}])
app.directive('task', [function () {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: null,
		bindToController: true,
		controllerAs: 'task',
		controller: function ($scope) {
			this.tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
			this.save = () => {
				localStorage.tasks = JSON.stringify(this.tasks);
			}
			this.createTask = (obj) => {
				var mainData = {
					title: obj.title,
					dis: obj.dis,
					com: obj.com,
					status: false
				}
				this.tasks.push(mainData);
				this.save();
			}
			this.complit = (comp) => {
				comp.status = !comp.status;
				this.save();
			}
		},
	};
}])	
app.directive('main', ['getFactory', '$stateParams', function (getFactory, $stateParams) {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: null,
		bindToController: true,
		controllerAs: 'main',
		controller: function () {
			var self = this;
			self.paramsId = $stateParams.id;
			getFactory.save({params: 'main'}, function (val) {
				self.massage = val.massages;
				console.log(val)
			})
		}
	};
}])
app.directive('reg', [function () {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: null,
		bindToController: true,
		controllerAs: 'reg',
		controller: function () {
			this.login = (log, pass) => {
				localStorage.log = log;
				localStorage.pass = pass;
				sessionStorage.setItem('log',log);
				sessionStorage.setItem('pass',pass);
			}
		}
	};
}])
app.factory('getFactory', ['$resource', function ($resource) {
	return $resource('json/:params.json', {
			params: '@params'
		});
}])