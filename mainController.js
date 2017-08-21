
var app = angular.module('nEnLinea', []);

app.controller('boardController', function($scope){
    
    $scope.rowSize = 8;
    $scope.steps2Win = 4;
    $scope.tableManager;
    $scope.boardVisible = false;
    $scope.openModal = false;
    $scope.rowSize;

    // Matriz de referencia para crear el tablero en la vista
    $scope.cells;
    
    
    // Se inicializa el administrador del tablero
    $(document).ready(function(){
        var layout = $("#table");
        $scope.tableManager = new TableManager(layout); 
    })

    // Muestra el form con la configuracion del juego
    $scope.setUpGame = function(){
        $scope.openModal = true;
    }

    $scope.newGame = function(){
        
        $scope.tableManager.createNewGame($scope.rowSize, $scope.steps2Win);
    
        $scope.boardVisible = true;
        // Se crea la matriz de referencia
        $scope.cells = new Array($scope.rowSize);

        for (var i = 0; i < $scope.cells.length; i++) {
            $scope.cells[i] = new Array($scope.cells.length);
            for (var j = 0; j < $scope.cells.length; j++) {
                $scope.cells[i][j] = $scope.tableManager.transformCoordToPlainPosition(i, j);
            }
        }
    }

});