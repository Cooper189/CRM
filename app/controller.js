var app = angular.module('app', ['ui.router']);

app.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('main', {
          url: '/main',
          templateUrl: 'template/main.html'
        })
    $urlRouterProvider.otherwise('main');
  });

app.directive('task', [function () {
	return {
		scope: {},
		restrict: 'E',
		templateUrl: null,
		bindToController: true,
		controllerAs: 'task',
		controller: function ($scope) {
			var self = this;
			self.tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
			self.save = function () {
				localStorage.tasks = JSON.stringify(self.tasks);
			}
			self.createTask = function (x, y, z, p) {
				var singel = {};
					singel.id = x;
					singel.title = y;
					singel.dis = z;
					singel.status = false;
					singel.com = p;
				self.tasks.push(singel);
				self.save();
			}
			self.complit = function (comp) {
				comp.status = !comp.status;
				self.save();
			}
		}
	};
}])	