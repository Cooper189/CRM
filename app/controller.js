var log = angular.module('login', ['ui.router'])
log.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider
    	.state('reg', {
        	url: '/reg',
        	templateUrl: 'template/reg.html',
        })
    	.state('vol', {
        	abstract: true,
        	url: '/vol',
        	templateUrl: 'template/intro.html',
        })
        .state('vol.mains', {
          url: '/main',
          templateUrl: 'template/main.html'
        })
        .state('vol.task', {
        	url: '/task',
        	templateUrl: 'template/task.html'
        })
        .state('vol.clients', {
        	url: '/clients',
        	templateUrl: 'template/clients.html'
        })
        .state('vol.text', {
        	url: '/text/:id',
        	templateUrl: 'template/text.html',
        });
    $urlRouterProvider.otherwise('reg');
  });
log.run(['$rootScope', '$state', function ($rootScope, $state) {
	$rootScope.$on('$stateChangeStart', function (event, toState) {
		if(toState.name !== 'reg' && localStorage.pass != sessionStorage.getItem('pass') || localStorage.pass == 'undefined') {
			event.preventDefault();
			$state.go('reg', {})
		}
	})
}])
log.directive('reg', [function () {
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

var app = angular.module('app', ['ngResource', 'login']);
app.filter('startFrom', function(){
  return function(input, start){
    start = +start;
    return input.slice(start);
  }
})
app.directive('task', ['paginator', function (paginator) {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: null,
		bindToController: true,
		controllerAs: 'task',
		controller: function () {
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
			this.page = paginator
			this.page.currentPage = 0;
  			this.page.itemsPerPage = 5;
		},
	};
}])	
app.directive('main', ['getFactory', '$stateParams','paginator', function (getFactory, $stateParams, paginator) {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: null,
		bindToController: true,
		controllerAs: 'main',
		controller: function () {
			var self = this;
			this.short = {};
			this.massegId = (index) => {
				console.log(index);
				this.short = index;
			}
			self.paramsId = $stateParams.id;
			self.massage = [];
			getFactory.save({params: 'main'}, function (val) {
				self.massage = val.massages;
			})
			this.page = paginator
			this.page.currentPage = 0;
  			this.page.itemsPerPage = 5;
		}
	};
}])
app.directive('cards', [function () {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: null,
		bindToController: true,
		controllerAs: 'cards',
		controller: function () {
			this.contacts = localStorage.contacts ? JSON.parse(localStorage.contacts) : [];
			this.save = () => {
				localStorage.contacts = JSON.stringify(this.contacts);
			}
			this.createTask = (obj) => {
				var mainData = {
					title: obj.title,
					dis: obj.dis,
					com: obj.com,
					status: false
				}
				this.contacts.push(mainData);
				this.save();
			}
		}
	};
}])
app.directive('sidebar', [function () {
	return {
		restrict: 'E',
		link: function (element) {
		}
	};
}])
app.factory('getFactory', ['$resource', function ($resource) {
	return $resource('json/:params.json', {
			params: '@params'
		});
}])
app.service('paginator', [function () {
  this.firstPage = () => {
    return this.currentPage == 0;
  }
  this.lastPage = (arr) => {
    var lastPageNum = Math.ceil(arr.length / this.itemsPerPage - 1);
    return this.currentPage == lastPageNum;
  }
  this.numberOfPages = (arr) => {
    return Math.ceil(arr.length / this.itemsPerPage);
  }
  this.startingItem = () => {
    return this.currentPage * this.itemsPerPage;
  }
  this.pageBack = () => {
    this.currentPage = this.currentPage - 1;
  }
  this.pageForward = () => {
    this.currentPage = this.currentPage + 1;
  }
}])