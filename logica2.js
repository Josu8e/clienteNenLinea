var gameField = new Array();
// Arreglo para almacenar los discos
var allDiscs = new Array();
var board = document.getElementById("game-table");
var currentCol;
var currentRow;
var currentPlayer;
var id = 1;
var boardSize = 8;
var nsize = 4;


var WS = "http://nenlinea-rails.herokuapp.com/";

//newgame();

function newgame(){
  boardSize = parseInt(document.getElementById("tabla").value);
  nsize = parseInt(document.getElementById("tabla_n").value);
  console.log(14+boardSize*60);
  document.getElementById("game-table").style.height = 14+boardSize*60 + 'px';
  document.getElementById("game-table").style.width = 14+boardSize*60 + 'px';
  console.log(WS + "logica/new/"+boardSize+"/"+nsize);
  $.get(WS + "logica/new/"+boardSize+"/"+nsize, function(data){
        console.log(data);
      })
  prepareField();
  placeDisc(Math.floor(Math.random()*2)+1);
}



function Disc(player){
  this.player = player;
  this.color = player == 1 ? 'red' : 'yellow';
  this.id = id.toString();
  id++;
  
  this.addToScene = function(){
    board.innerHTML += '<div id="d'+this.id+'" class="disc '+this.color+'"></div>';
    //if(currentPlayer==2){
      //computer move
      //var possibleMoves = think();
      //var cpuMove = Math.floor( Math.random() * possibleMoves.length);
      //currentCol = possibleMoves[cpuMove];
      //document.getElementById('d'+this.id).style.left = (14+60*currentCol)+"px";
      //dropDisc(this.id,currentPlayer);
    //}
  }

  // Elimina el disco de la vista
  this.removeToScene = function(){
    var disc = document.getElementById("d" + this.id);
    board.removeChild(disc);
  }
  
  var $this = this;
  document.onmousemove = function(evt){
    //if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(currentCol<0){currentCol=0;}
    if(currentCol>boardSize){currentCol=boardSize;}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    //}
  }
  document.onload = function(evt){
    //if(currentPlayer == 1){
    currentCol = Math.floor((evt.clientX - board.offsetLeft)/60);
    if(currentCol<0){currentCol=0;}
    if(currentCol>boardSize){currentCol=boardSize;}
    document.getElementById('d'+$this.id).style.left = (14+60*currentCol)+"px";
    document.getElementById('d'+$this.id).style.top = "-55px";
    //}
  }
  
  document.onclick = function(evt){
       
        dropDisc($this.id, $this.player);
          // Consulta al ws
          verificarJugada();
        }
    
}

function verificarJugada(){
  $.get(WS + "logica/mover/" + currentCol, function(data){
    console.log(data['fichas_ganadoras']);
    if(data['game_state'] != 'Playing'){
      alert('Gano ' + data['turno']);
      // Se limpia el tablero
      removeDiscs();
      newgame();
      // Se crea una nueva partida del juego
      $.get(WS + "logica/new/"+boardSize+"/"+nsize, function(data){
        console.log(data);
      })
    }
  });

}

var click = document.onclick;

function setClick(state){
  if(!state){
    document.onclick = function(){return false;}
  }
  else{
    document.onclick = click;
  }
}

function dropDisc(cid,player){
  currentRow = firstFreeRow(currentCol,player);
  moveit(cid,(14+currentRow*60));
  
  //checkForMoveVictory();

  if (currentPlayer == 1){
  	player = 2;
  }
  else{
  	player = 1;
  }
  placeDisc(3-currentPlayer);
}

function placeDisc(player){
  currentPlayer = player;
  var disc = new Disc(player);
  disc.addToScene();
  allDiscs.push(disc);
}

// Quita todos los discos de la vista
function removeDiscs(){
  for(var i = allDiscs.length - 1; i >= 0; i--) {
    allDiscs[i].removeToScene()
    allDiscs.splice(i, 1);
  } 
}

function prepareField(){
  gameField = new Array();
  for(var i=0; i<boardSize; i++){
    gameField[i] = new Array();
    for(var j=0; j<boardSize; j++){
      gameField[i].push(0);
    }
  }
}

function possibleColumns(){
  var moves_array = new Array();
  for(var i=0; i<boardSize; i++){
    if(gameField[0][i] == 0){
      moves_array.push(i);
    }
  }
  return moves_array;
}

function moveit(who,where){
    document.getElementById('d'+who).style.top = where+'px';
}

function firstFreeRow(col,player){
  for(var i = 0; i<boardSize; i++){
    if(gameField[i][col]!=0){
      break;
    }
  }
  gameField[i-1][col] = player;
  return i-1;
}

function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  //console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  //console.log('Name: ' + profile.getName());
  //console.log('Image URL: ' + profile.getImageUrl());
  //console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
  
  var log = document.getElementById("login");
  log.innerHTML = "";
  log.innerHTML = '<img src="'+profile.getImageUrl+'" id = "imagen"><p id="imagen">'+profile.getName()+'</p>';
  console.log('<img src="'+profile.getImageUrl()+'" id = "imagen">');
}

