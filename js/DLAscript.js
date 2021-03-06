	
	var points = 0;
	var ctx;  
	var panel;

	var drawingLoop;  
	var circleInterval;
	var level = 0; 
	var v = [1,2,4];
	var circleX = []; 
	var circleY = [];  
	var circleDX = [0,1,0,-1,0]; 
	var circleDY = [-1,0,1,0,0];
	var array;
	var circleRad = 1; 
	var sec;  
	var circlesNo = 0;
	var boardWidth = 600;
	var startX = 300; 
	var startY = 300;
	var destination = 0;
	var power = 0;
	var central=1, left=0, right=0, up=0, down=0;
	var numberOfMolecules = 1;

	var pause = 0;
	
	function startGame(){  
		document.getElementById("submit").onclick = drawCanvas();
	}  
	
	function drawCanvas(){ 
		setPower();	
		var canvas = document.getElementById("gameBoard");  
		canvas.addEventListener("mousedown", getPosition, false);
		if(canvas.getContext){ 
			ctx = canvas.getContext("2d");   
			initializeArray();
			circleInterval = setInterval(addNewCircle, 10); 	
			drawingLoop = setInterval(drawBoard, 5);  
			panel = canvas.getContext("2d"); 
		} 
	}  

	function getPosition(event){
  		var x = new Number();
  		var y = new Number();
  		var canvas = document.getElementById("gameBoard");

        if (event.x != undefined && event.y != undefined)
        {
          x = event.x;
          y = event.y;
        }
        else // Firefox method to get the position
        {
          x = event.clientX + document.body.scrollLeft +
              document.documentElement.scrollLeft;
          y = event.clientY + document.body.scrollTop +
              document.documentElement.scrollTop;
        }

        x -= canvas.offsetLeft;
        y -= canvas.offsetTop + 70;

		setPointIntoArray(x,y);  
	} 

	function drawBoard(){
		ctx.clearRect(0, 0,boardWidth, boardWidth); 
		//wypelnianie okna 
		ctx.fillStyle = "#e3e3e3";  
		ctx.beginPath();
        ctx.rect(0, 0, boardWidth, boardWidth);
        ctx.closePath();
		ctx.fill();
		drawCircles(); 
			
	}  

	function initializeArray(){
		array = new Array(boardWidth);
		for(var i=0; i<boardWidth; i++){
			array[i] = new Array(boardWidth);
		}
		
		for(var i=0; i<boardWidth; i++){
			for(var j=0; j<boardWidth; j++){
				array[i][j] = 0;
			}
		}
		setFirstPoint();
	}

	function setFirstPoint(){
		if(central){
			setPointIntoArray(startX, startY);
		} else if(up){
			for(var i=0; i<boardWidth; i++){
				setPointIntoArray(i, 0);
			}
		} else if(down){
			for(var i=0; i<boardWidth; i++){
				setPointIntoArray(i, boardWidth-1);
			}
		} else if(right){
			for(var i=0; i<boardWidth; i++){
				setPointIntoArray(boardWidth-1, i);
			}
		} else if(left){
			for(var i=0; i<boardWidth; i++){
				setPointIntoArray(0, i);
			}
		}
	}

	function setPointIntoArray(x,y){
		array[x][y] = 1;
		//mark positions for next points
		for(var i=x-1; i<x+2; i++){
			for(var j=y-1; j<y+2; j++){
				if(i>=0 && i<boardWidth && j>=0 && j<boardWidth && array[i][j]==0){
					array[i][j] = -1;
				}
			}
		}
		circleX[circlesNo] = x;
		circleY[circlesNo] = y;
		circlesNo++;
	}

	function drawCircles(){
		for(var i=0; i<circlesNo; i++){
			drawCircle(i);
		}
	}
	
	
	function drawCircle(no){  
		//rysowanie kolka 
		ctx.fillStyle = "black"; 
		ctx.beginPath();
        ctx.arc(circleX[no], circleY[no], circleRad, 0, Math.PI * 2);
        ctx.closePath(); 
		ctx.fill(); 	
	}  

	function addNewCircle(){

		var tempX = [];
		var tempY = [];
		var probability = [];

		for(var i=0; i<numberOfMolecules; i++){
			tempX[i] = Math.floor((Math.random()*boardWidth));
			tempY[i] = Math.floor((Math.random()*boardWidth));
			probability[i] = Math.floor((Math.random()*100));

			if(probability[i] < power){
			if(central){
				walkToCentralPoint(tempX[i],tempY[i]);
			} else {
				walkInDirection(tempX[i], tempY[i]);
			}
		} else {
			randomWalk(tempX[i], tempY[i]);
		}
		}

	} 

	function randomWalk(x,y){
		var found = 0;
		var tempX;
		var tempY;
		while(found!=1){
			var step = Math.floor((Math.random()*4));
			tempX = x + circleDX[step]; 
			tempY = y + circleDY[step]; 
			if(tempX>=0 && tempX<boardWidth && tempY>=0 && tempY<boardWidth){
				x = tempX; 
				y = tempY;
				if(array[x][y] == -1){
					setPointIntoArray(x,y);
					found = 1;
				}
			}
		}
	}

	function walkInDirection(x,y){
		var found = 0; 
		var tempX; 
		var tempY; 
		var direction;
		//setting direction
		if(left){
			direction = 1;
		}else if(right){
			direction = 3;
		} else if(up){
			direction = 2;
		} else if(down){
			direction = 0;
		}

		while(found!=1){
			countDestination(x,y);
			tempX = x + circleDX[direction]; 
			tempY = y + circleDY[direction]; 
			if(tempX>=0 && tempX<boardWidth && tempY>=0 && tempY<boardWidth){
				x = tempX; 
				y = tempY;
				if(array[x][y] == -1){
					setPointIntoArray(x,y);
					found = 1;
				}
			}else{
				found =1;
			}
		}
	}

	function walkToCentralPoint(x,y){
		var found = 0; 
		var tempX; 
		var tempY; 
		while(found!=1){
			countDestination(x,y);
			tempX = x + circleDX[destination]; 
			tempY = y + circleDY[destination]; 
			if(tempX>=0 && tempX<boardWidth && tempY>=0 && tempY<boardWidth){
				x = tempX; 
				y = tempY;
				if(array[x][y] != 0){
					setPointIntoArray(x,y);
					found = 1;
				} 
			}else{
				found =1;
			}
		}
	}

	function countDestination(x,y){
		var lenX = Math.sqrt(Math.pow(startX-x, 2)); 
		var lenY = Math.sqrt(Math.pow(startY-y, 2));

		if(x<startX && y<startY){
			if(lenX>lenY){
				destination = 1;
			} else {
				destination = 2;
			}
		} else if(x<startX && y>startY){
			if(lenX>lenY){
				destination = 1;
			} else {
				destination = 0;
			}
		} else if(x>startX && y<startY){
			if(lenX>lenY){
				destination = 3;
			} else {
				destination = 2;
			}
		} else if(x>startX && y>startY){
			if(lenX>lenY){
				destination = 3;
			} else {
				destination = 0;
			}
		} else if(x==startX && y!=startY){
			if(y<startY){
				destination = 2;
			} else{
				destination = 0;
			}
		} else if(y==startY && x!=startX){
			if(x<startX){
				destination = 1;
			} else {
				destination = 3;
			}
		} else {
			destination==0;
		}
	}

	function setPower(){
		power = parseInt(document.getElementById("powerInput").value);
	}

	function setMolecules(){
		numberOfMolecules = parseInt(document.getElementById("moleculesInput").value);
	}

	function setCentral(){
		central = 1;
		left=right=up=down=0;
	}

	function setUp(){
		up = 1;
		left=right=central=down=0;
	}

	function setDown(){
		down = 1;
		left=0, right=0, up=0, central=0;
	}

	function setLeft(){
		left = 1;
		central=0, right=0, up=0, down=0;
	}

	function setRight(){
		right = 1;
		left=0, central=0, up=0, down=0;
	}

	function modifyInterval(){
		if(pause == 0){
			clearInterval(circleInterval);
			pause =1;
		} else if(pause ==1){
			circleInterval = setInterval(addNewCircle, 10); 
			pause = 0;
		}
	}