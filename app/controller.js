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
		controller: function () {
			this.tasks = localStorage.tasks ? JSON.parse(localStorage.tasks) : [];
			this.save = () => {
				localStorage.tasks = JSON.stringify(this.tasks);
			}
			this.createTask = () => {
				this.singel.status = false;
				this.tasks.push(this.singel);
				this.save();
			}
			this.complit = (comp) => {
				comp.status = !comp.status;
				this.save();
			}
		}
	};
}])	