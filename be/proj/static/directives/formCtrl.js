app.directive('signupform', function () {
  return {
    restrict: 'E',
    templateUrl: '/static/directives/form.html',
    replace: true,
    scope: {
      visible: '='
    },
    controller: function ($scope, $http, util_svc, $document, $timeout, $window) {

      $scope.email = null;
      $scope.username = null;
      $scope.debts = [];
      $scope.amount = null;
      $scope.showForm = false;
      $scope.formSubmitted = false;
      $scope.location = null;
      $scope.focused = false;
      $scope.corinthian = false;

      $http.get('/debt_choices').then(function (resp) {
        $scope.debt_choices = resp.data
      });

      $http.get('/points').then(function (resp) {
        $scope.cities = resp.data
      });

      $scope.addDebt = function () {
        $scope.debts.push({
          debtType: 5,
          amount: null
        })
      }
      $scope.addDebt()

      $scope.formValid = function () {
        return $scope.location != null && $scope.email != null
            && $scope.amount != null;
      }

      $scope.formVisible = function () {
        if ($scope.visible) {
          visible = true
        } else {
          visible = $scope.showForm && !$scope.forceClose && !$scope.formSubmitted;
        }

        if (visible) {
          showForm();
        }
        return visible
      }

      function showForm() {
        $scope.showForm = true;
        $scope.forceClose = false;
        el = document.getElementById("email");
        el.placeholder =  'enter your email...';
      }

      $scope.emailFocus = function () {
        showForm();
        $scope.focused = true;
      }

      $scope.onSubmitClick = function ($event) {
        // temporarily, email is the password
        // so that we can protect anonymity of our users.
        // campaign monitor handles mailing lists
        $scope.username = util_svc.generateUUID();

        // just store one debt type for now.
        var debt = $scope.debts[0]
        data = {
            'username': $scope.username,
            'password': $scope.email,
            'point': $scope.location.id,
            'kind': debt.debtType.id,
            'amount': parseFloat(debt.amount.replace(',', ''))
        }
        console.log(data)
        $http.post('/signup/', data).then(function (resp) {
          if ($scope.corinthian) {
            $window.location.href = '/corinthiansignup'
            $event.preventDefault()
          }
        });

        $scope.formSubmitted = true;
        $scope.showForm = true;
      }
    }
  }
})