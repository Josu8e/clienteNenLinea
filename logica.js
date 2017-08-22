/*
X es el color rojo y "O" es el amarillo.
por defecto se crea un tablero de 7x7.
falta hacer que el tablero se adapte a algún tamaño indicado
Utilizo JQUERY con CDN para que lo tome en cuenta.
Hay que validar que no se exceda el limite de fichas en una columna, que no se revalsen las fichas.
*/


function TableManager(layout){

	this.layout = layout;//El parametro layout es el elemento html(nodo div contenedor) que el objeto TableManager usará para crear el tablero.
	this.size = null; //tamaño de la fila.
	this.WS = "https://nenlinea-rails.herokuapp.com/";
	this.gameState = null;
	this.tableSize = null;
	this.actualPlayer = "X"; //Por defecto se asume que inicia el jugador "X".
	this.cells = []; //arrreglo donde se guardan las celdas o nodos que representan las celdas del tablero en el html.
	this.oldColor = "red"; //como por default esta "X" entonces por default inicia su color "red".
	var self = this;

	//Agrega escuchadores click a cada celda o nodo html.
	this.addEventListenersToCells = function(){
		for (i = 0; i<this.cells.length;i++){
			this.cells[i].on("click",function(){
				var position = parseInt($(this).attr('id'));
				var columna = self.getColumnOfPlainPosition(position);
				self.putVirtualCoin(columna);
			});

		}
	}

	//Borra todo el tablero de la vista(html) y solo deja el div que es el contenedor(layout).
	this.reset = function(){
		this.layout.empty();
		this.cells = [];
	}

	//Esta funcion crea el tablero del tamaño especificado en la vista(html).
	//Este metodo es utilizado por el metodo "createNewGame".
	this.createBoard = function(){

		if (this.size != null){
			for (i = 0; i<this.size;i++){
				var span = $('<span/>',{class:'fila'});
				for (j = 0; j<this.size;j++){
					var div = $('<div/>',{class:'cell',id:this.transformCoordToPlainPosition(i,j)});
					div.appendTo(span);
				
					this.cells.push(div);
				}
				var par = $('<p/>',{css:"clear:both"});
				par.appendTo(span);
				span.appendTo(this.layout);
			}

			//Se crean los pies del tablero.
			// $('<div/>',{class:'leftFoot'}).appendTo(this.layout);
			// $('<div/>',{class:'rightFoot'}).appendTo(this.layout);
		}
	}

	//rowSize es el tamaño que va a tener el tablero y nToWin es la cantidad de fichas que se necesitan para ganar.
	this.createNewGame = function(rowSize,nToWin){

		var s,gs,ts = null;

		$.ajax({
	        url: this.WS + "logica/new/"+ rowSize +"/"+nToWin,
	        success: function (jsonResponse) {
	            if (jsonResponse.isOk != false){ //si la respuesta del servidor fue un éxito....
	            	s = jsonResponse.tamFila;
	            	gs = jsonResponse.game_state;
	            	ts = jsonResponse.tamTablero;
	            }
	        },
	        async: false
    	});

		this.size = s;
		this.gameState = gs;
		this.tableSize = ts;
		this.actualPlayer = "X";

    	this.reset(); //se limpa el tablero en el html y en la parte logica de javascript(el arreglo cells).
    	this.createBoard(); //se crea el tablero de nuevo.
		this.addEventListenersToCells();
		
		document.getElementById('alert').style.display = 'none';
	}

	this.paintCell = function(plainPosition){
		var color = "";
		if (this.actualPlayer == "X"){
			color = "red";
		}
		else{
			color = "yellow";
		}
		this.cells[plainPosition].css("background-color",color);
	}

	this.resetPointer = function(){
		$(".cell").off();
	}

	//Esta funcion muestra las posiciones donde el jugador ganó, se recibe como argumento las posiciones(arreglo), no en coordenadas.
	this.showWinnerCoins = function(positions){
		for (i = 0; i< positions.length;i++){

			//{width: '300px', opacity: '0.8'}, "slow"
			this.cells[positions[i]].animate({opacity: '0.5'}, "slow");
			//this.cells[positions[i]].css("background-color", 'blue');

		}
	}
 
 	//Este metodo coloca una ficha en el tablero(se lo ordena al web service), luego pinta la posicion indicada por el web service.
	this.putVirtualCoin = function(column){ //WhoDidIt es relativo a quien hizo la jugada.

		if (this.gameState == "Playing"){
			var actPlayer,row,column,plainPosition,gState,winnerCoins = null;
			$.ajax({
		        url: this.WS + "logica/mover/"+ column,
		        success: function (jsonObject) {
		            if (jsonObject.isOk != false){
		            	row = jsonObject.fila;
		            	column = jsonObject.columna;
		            	actPlayer = jsonObject.turno;
		            	gState = jsonObject.game_state;
		            	winnerCoins = jsonObject.fichas_ganadoras;
		            }
		        },
		        async: false
    		});

    		plainPosition = this.transformCoordToPlainPosition(row,column);
    		//Se pinta el circulo en la vista(html) en la posicion indicada por el web service.
    		this.paintCell(plainPosition);

    		this.actualPlayer = actPlayer;

    		this.gameState = gState;

    		if (this.gameState != "Playing"){
    			this.showWinnerCoins(winnerCoins);
				this.resetPointer();
				document.getElementById('alert').style.display = 'inline';
				var alertWinner = document.getElementById('alert-winner');
				var winner = (actPlayer === 'X') ? 'Rojo' : 'Amarillo';
				var text = $('<strong>' + 'Gana ' + winner + '</strong>');
				text.appendTo(alertWinner);
    		}

		}
		else{
			alert("CREA UN TABLERO NUEVO PARA COMENZAR");
		}
	}

	//Trasforma coordenada a posicion plana de un arreglo unidimensional.
	this.transformCoordToPlainPosition = function(row,column){
		return this.size*row+column;
	}

	//Transforma desde una posicion de arreglo unidimensional a su columna correspondiente en una matriz.
	this.getColumnOfPlainPosition = function(plainPosition){
		return plainPosition % this.size;
	}

	this.getRowPosition = function(plainPosition){
		return parseInt(plainPosition / this.size);
	}
}


function onSignIn(googleUser) {
	var profile = googleUser.getBasicProfile();
	$('#user_foto').attr("src", profile.getImageUrl());
	var userName = $('<a href="">' + profile.getName() + '</a>');
	var linkName = document.getElementById('username');
	userName.appendTo(linkName);

	document.getElementById("login-btn").remove();
	console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
	console.log('Name: ' + profile.getName());
	console.log('Image URL: ' + profile.getImageUrl());
	console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
}

