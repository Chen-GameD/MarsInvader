
// screen size variables
var SCREEN_WIDTH = window.innerWidth,
	SCREEN_HEIGHT = window.innerHeight,
	HALF_WIDTH = window.innerWidth / 2,
	HALF_HEIGHT = window.innerHeight / 2, 
	touchable = "ontouchstart" in window, 
	touchThrustTop = 0.25, 
	touchThrustBottom = 0.9,
	touchRotateRange = 0.2,
	touchRotateStartAngle = 0, 
	touchRotate = false, 
	rotateDialBrightness= 0,
	fps = 60, 
	mpf = 1000/fps, 
	counter = 0, 
	gameStartTime = Date.now(), 
	skippedFrames, 
	leftKey = KeyTracker.LEFT, 
	rightKey = KeyTracker.RIGHT, 
	startKey = ' ',
	selectKey = '', 
	abortKey = '',
	startMessage = "Welcome to Mars Invader<br><br>CLICK TO PLAY<br>ARROW KEYS TO MOVE", 
	singlePlayMode = false, // for arcade machine  
	lastMouseMove = Date.now(), 
	lastMouseHide =0, 
	mouseHidden = false; 
	var pic1 = new Image();
	pic1.src = "assets/Portrait/elonmusk.png";
	var pic2 = new Image();
	pic2.src = "assets/Portrait/jeff bezos.png";
    var bg = new Image();
	bg.src = "assets/Portrait/Start.png";
// game states
var	WAITING = 0, 
	PLAYING = 1, 
	LANDED = 2, 
	CRASHED = 3, 
	GAMEOVER = 4,
	STARTING = 5,
	gameState = STARTING, 
	mouseThrust = false, 
	mouseTop = 0, 
	mouseBottom = 0,
	
	score = 0, 
	shootConsumption = 50,
	time = 0, 
	startTime = 0,
	lander = new Lander(),
	landscape = new Landscape(), 
	testPoints = [],
	//missiles
	missiles = [],
	boomEffects = [],
	boomLength = 0,
// canvas element and 2D context
	canvas = document.createElement( 'canvas' ),
	context = canvas.getContext( '2d' ),

// to store the current x and y mouse position
	mouseX = 0, mouseY = 0, 

// to convert from degrees to radians, 
// multiply by this number!
	TO_RADIANS = Math.PI / 180, 
	
	view = {x:0,
			y:0, 
			scale :1, 
			left :0, 
			right : 0, 
			top :0, 
			bottom:0}, 
	zoomedIn = false, 
	zoomFactor = 4;


window.addEventListener("load", init);


function init() 
{
	// CANVAS SET UP
	
	document.body.appendChild(canvas); 
	
	infoDisplay = new UIDisplay(SCREEN_WIDTH, SCREEN_HEIGHT); 
	document.body.appendChild(infoDisplay.domElement); 
	
	canvas.width = SCREEN_WIDTH; 
	canvas.height = SCREEN_HEIGHT;

	
	document.body.addEventListener('mousedown', onMouseDown);
	document.body.addEventListener('mousemove', onMouseMove);
	document.body.addEventListener('touchstart', onTouchStart);
	
	KeyTracker.addKeyDownListener(KeyTracker.UP, function() { if(gameState==PLAYING) {lander.isthrusting = true;lander.thrust(1);}});
	KeyTracker.addKeyUpListener(KeyTracker.UP, function() {lander.isthrusting = false; lander.thrust(0);});
	
	KeyTracker.addKeyDownListener(KeyTracker.DOWN, function() {
		 if(gameState==PLAYING && score >= shootConsumption) 
		 {
			 lander.shoot();
			 score -= shootConsumption;
		 }
		});
	
	

	window.addEventListener('resize', resizeGame);
	window.addEventListener('orientationchange', resizeGame);
	
	resizeGame();
	//restartLevel(); 
	startTime = Date.now();
	loop();
	
}
	

function loop() {
	requestAnimationFrame(loop);

	if(gameState==STARTING){
		infoDisplay.hideAll();
		
		renderStart();
		
		if(Date.now() - startTime >= 7000){
			gameState = GAMEOVER;
			restartLevel();
		}
	}
	else{
	skippedFrames = 0; 
		
	counter++; 
	var c = context; 
	
	var elapsedTime = Date.now() - gameStartTime; 
	var elapsedFrames = Math.floor(elapsedTime/mpf); 
	var renderedTime = counter*mpf; 
		
	if(elapsedFrames<counter) {
			// c.fillStyle = 'green'; 
			// 		c.fillRect(0,0,10,10);
		counter--;
		return; 
	}
	
	while(elapsedFrames > counter) {
		lander.update(); 

		for(q = 0; q < missiles.length; q++){
		
			if(missiles[q].active){
				missiles[q].update();
			
			}
		}
		
		counter++; 
	
		skippedFrames ++; 
		if (skippedFrames>30) {
			//set to paused
			counter = elapsedFrames; 
		} 
		
		

	}
	
	if(gameState == PLAYING) { 
		checkKeys(); 
	}

	lander.update(); 

	for(q = 0; q < missiles.length; q++){
	
		if(missiles[q].active){
			missiles[q].update();
		}
		
	}
	
	if((gameState == WAITING) && (lander.altitude<100) ) {
		gameState=GAMEOVER;
		restartLevel();
	}

	if((gameState== PLAYING) || (gameState == WAITING)) 	
		checkCollisions(); 
	
	updateView(); 
	render(); 
	if((!mouseHidden) && (Date.now() - lastMouseMove >1000)){
		 document.body.style.cursor = "none"; 
		lastMouseHide = Date.now();
		mouseHidden = true; 
	}
}
}
function renderStart() { 

	var c = context; 
	SCREEN_WIDTH = window.innerWidth; 
	SCREEN_HEIGHT = window.innerHeight; 
	c.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	c.save(); 
	c.translate(view.x, view.y); 
	c.scale(1, 1); 

    c.drawImage(bg, SCREEN_WIDTH/2-500,SCREEN_HEIGHT/2-400,1000,800);
    c.drawImage(pic1,  SCREEN_WIDTH/2-600,SCREEN_HEIGHT/2, 300,300);
	c.drawImage(pic2,  SCREEN_WIDTH/2+300,SCREEN_HEIGHT/2, 300,300);
	c.restore();
}

function render() { 

	var c = context; 

	c.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
	
	c.save(); 
	c.translate(view.x, view.y); 
	c.scale(view.scale, view.scale); 
 
	landscape.render(context, view, lander.pos);
	if(lander.active)
	lander.render(context, view.scale);

	for(i = 0; i < missiles.length; i++){
		if(missiles[i].active){
			missiles[i].render(context, view.scale);
		}
	}	

	for(i = 0; i < boomLength; i++){
		
		if(boomEffects[i].active){
			boomEffects[i].render(context);
		}
	}
	if(counter%4==0) updateTextInfo(); 
	
	c.restore();
}

function checkKeys() { 
	
	if((KeyTracker.isKeyDown(leftKey))||(KeyTracker.isKeyDown(KeyTracker.LEFT))) {
		lander.rotate(-1);	
	} else if((KeyTracker.isKeyDown(rightKey))||(KeyTracker.isKeyDown(KeyTracker.RIGHT))) {	
		lander.rotate(1); 
	}
	if(KeyTracker.isKeyDown(abortKey)) { 
		lander.abort();
	}
	//Kill all enemy
	if(KeyTracker.isKeyDown('Q')){
		for (var i = 0; i < landscape.enemy.length; i++)
		{
			landscape.enemy[i].active = false;
		}
	}
	
	// SPEED MODE! 
	if(KeyTracker.isKeyDown('S')) { 
		//for(var i=0; i<3;i++){
			lander.update(20);
		//} 
	}
	
}


function updateView() 
{
	var zoomamount  = 0,
	 	marginx  = SCREEN_WIDTH *0.2,
		margintop = SCREEN_HEIGHT * 0.2,
		marginbottom = SCREEN_HEIGHT * 0.3;
	
	if((!zoomedIn) && (lander.altitude < 70)) {
		setZoom(true);
	} else if((zoomedIn) && (lander.altitude > 160)) {
		setZoom(false);	
	}
		
	zoomamount = view.scale;
	
	
	if(((lander.pos.x * zoomamount) + view.x < marginx)){
		view.x = -(lander.pos.x * zoomamount) + marginx;
	} else if (((lander.pos.x * zoomamount) + view.x > SCREEN_WIDTH - marginx)) {
		view.x = -(lander.pos.x * zoomamount) + SCREEN_WIDTH - marginx;
	}
	
	if((lander.pos.y * zoomamount) + view.y < margintop) {
		view.y = -(lander.pos.y * zoomamount) + margintop;
	} else if ((lander.pos.y * zoomamount) + view.y > SCREEN_HEIGHT - marginbottom) {
		view.y = -(lander.pos.y * zoomamount) + SCREEN_HEIGHT - marginbottom;
	}
	
	
	view.left = -view.x/view.scale; 
	view.top = -view.y/view.scale; 
	view.right = view.left + (SCREEN_WIDTH/view.scale); 
	view.bottom = view.top + (SCREEN_HEIGHT/view.scale); 
	
}



function setLanded(line) { 
	
	var audio = new Audio("assets/Music/Success.mp3");
	audio.volume = 0.3;
	audio.play();
	multiplier = line.multiplier; 

	lander.land(); 
	
	var points = 0; 
	if(lander.vel.y<0.75) { 
		points = 50 * multiplier; 
		// show message - "a perfect landing"; 
		infoDisplay.showGameInfo("CONGRATULATIONS<br>A PERFECT LANDING\n" + points + " POINTS");
		lander.fuel+=50;
	} else {
		points = 15 * multiplier; 
		// YOU LANDED HARD
		infoDisplay.showGameInfo("YOU LANDED HARD<br>YOU ARE HOPELESSLY MAROONED<br>" + points + " POINTS");
		lander.makeBounce(); 
	}
	
	score+=points; 

	// TODO Show score
	gameState = LANDED; 
	//ARCADE AMENDMENT
	if(singlePlayMode) {
		setGameOver();
	}
	scheduleRestart(); 
}

function setCrashed(packageCrash = false) { 
	lander.crash(); 
	
	// show crashed message
	// subtract fuel
	
	var fuellost = Math.round(((Math.random() * 200) + 200));
	lander.fuel -= fuellost;
	if (!packageCrash)
	{
		if(lander.fuel<1) { 
		setGameOver(); 
		msg = "OUT OF FUEL<br><br>GAME OVER";
		
		} else {
			var rnd  = Math.random();
			var msg ='';
			if(rnd < 0.3){
				msg = "YOU JUST DESTROYED A 100 MEGABUCK LANDER";
			} else  if(rnd < 0.6){
				msg = "DESTROYED";
			} else {
				msg = "YOU CREATED A TWO MILE CRATER";
			}
		
			msg = "AUXILIARY FUEL TANKS DESTROYED<br>" + fuellost + " FUEL UNITS LOST<br><br>" + msg;
		
			gameState = CRASHED;
			//ARCADE AMENDMENT
			if(singlePlayMode) {
				setGameOver()
			}
	
		
		
		}
	}
	else
	{
		setGameOver(); 
		msg = "YOU WERE SMASHED TO DEATH BY AN AMAZON PACKAGE<br><br>GAME OVER";
	}
	
	
	infoDisplay.showGameInfo(msg);
	
	scheduleRestart(); 
}


function setGameOver() { 
	
		gameState = GAMEOVER; 
}

function onMouseDown(e) {
	e.preventDefault(); 
	if(gameState==WAITING) newGame(); 
}

function onTouchStart(e) { 
	e.preventDefault(); 
	if(gameState==WAITING) newGame();

}

function newGame() { 
	
	lander.fuel = 1000;

	time = 0;
	score = 1000;
	
	gameStartTime = Date.now(); 
	counter = 0; 

	restartLevel();
	
}

function scheduleRestart() { 
	setTimeout(restartLevel,4000); 
	
}
function restartLevel() { 
	lander.reset(); 
	missiles = [];
	landscape.setZones(); 
	setZoom(false); 
	
	if(gameState==GAMEOVER) { 
		gameState = WAITING; 
		showStartMessage(); 
		lander.vel.x = 2; 
		
		//initGame(); 
	} else {
		gameState = PLAYING; 
		infoDisplay.hideGameInfo();
	}
	
	
}
function checkCollisions() { 
	
	var lines = landscape.lines, 
		right = lander.right%landscape.tileWidth, 
		left = lander.left%landscape.tileWidth;
		
		while(right<0){ 
			right+=landscape.tileWidth; 
			left += landscape.tileWidth; 
		}

		
	for(var i=0; i<lines.length; i++ ) { 
		line = lines[i]; 
		
		// if the ship overlaps this line
		if(!((right<line.p1.x) || (left>line.p2.x))){ 
		
			lander.altitude = line.p1.y-lander.bottom; 
			
			
			// if the line's horizontal 
			if(line.landable) { 
				// and the lander's bottom is overlapping the line
				if(lander.bottom>=line.p1.y) { 
					//console.log('lander overlapping ground'); 
					// and the lander is completely within the line
					if((left>line.p1.x) && (right<line.p2.x)) {
						//console.log('lander within line', lander.rotation, lander.vel.y);
						// and we're horizontal and moving slowly
						console.log("velocity:"+lander.vel.y);	
						if((lander.rotation==0) && (lander.vel.y<1.5)) {
							
							//console.log('horizontal and slow');
							setLanded(line);
						} else {
							console.log(2);
							setCrashed(); 
						} 
					} else {
						// if we're not within the line
						console.log(3);
						setCrashed(); 
					}
				}
				// if lander's bottom is below either of the two y positions
			} else if(( lander.bottom > line.p2.y) || (lander.bottom > line.p1.y)) {
				lander.bottomRight.x = right; 
				lander.bottomLeft.x = left; 
			
				if( pointIsLessThanLine(lander.bottomLeft, line.p1, line.p2) || 	
						pointIsLessThanLine(lander.bottomRight, line.p1, line.p2)) {
							console.log(4);
					setCrashed(); 
				}
			}

			
			
			
			
		}

		//missile boom
		for(j = 0; j < missiles.length; j++){
			var missile = missiles[j];
			if(missile.active){
				
				if(missile.pos.x+0>line.p1.x && missile.pos.x+0 < line.p2.x){
					if(missile.pos.y > line.p1.y || missile.pos.y> line.p2.y){
						//boom
						missile.crash();
					}
				}
			}
		}
	}
	
	//check package
	for (var i = 0; i < landscape.enemy.length; i++)
	{
		if (landscape.enemy[i].active)
		{
			var _enm = landscape.enemy[i];
			for (var j = 0; j < landscape.enemy[i].packages.length; j++)
			{
				
				
				if (Math.sqrt(Math.pow((lander.centerPos.x - _enm.packages[j].centerPos.x), 2) + Math.pow((lander.centerPos.y - _enm.packages[j].centerPos.y), 2)) <= (lander.width + _enm.packages[j].width))
				{
					_enm.packages[j].active = false;
					console.log(5);
					
					setCrashed();

				}
			}
		}
		
	}
	
};


function pointIsLessThanLine(point, linepoint1, linepoint2) {

	// so where is the y of the line at the point of the corner? 
	// first of all find out how far along the xaxis the point is
	var dist = (point.x - linepoint1.x) / (linepoint2.x - linepoint1.x);
	var yhitpoint  = linepoint1.y + ((linepoint2.y - linepoint1.y) * dist);
//	addTestPoint(point.x, yhitpoint); 
	return ((dist > 0) && (dist < 1) && (yhitpoint <= point.y)) ;
}
// 
// function addTestPoint(x, y) { 
// 	
// 	testPoints.push(new Vector2(x,y)); 
// 	if(testPoints.length>2) testPoints.shift();
// 	
// }
function updateTextInfo() {
	
	infoDisplay.updateBoxInt('score', score, 4); 
	infoDisplay.updateBoxInt('fuel', lander.fuel, 4); 
	if(gameState == PLAYING) infoDisplay.updateBoxTime('time', counter*mpf); 
	
	infoDisplay.updateBoxInt('alt', (lander.altitude<0) ? 0 : lander.altitude, 4); 
	infoDisplay.updateBoxInt('horizSpeed', (lander.vel.x*200)); 	
	infoDisplay.updateBoxInt('vertSpeed', (lander.vel.y*200)); 	
	
	// +(lander.vel.x<0)?' ‹':' ›'
	// +(lander.vel.y<0)?' ˆ':' >'

	if((lander.fuel < 300) && (gameState == PLAYING)) {
		if((counter%50)<30) { 
			var playBeep; 
			if(lander.fuel <= 0) {
				playBeep = infoDisplay.showGameInfo("Out of fuel"); 
			} else {
				playBeep = infoDisplay.showGameInfo("Low on fuel");
			} 
		} else {
			infoDisplay.hideGameInfo(); 
		}
		
		
	}

}

function showStartMessage() {
	infoDisplay.showGameInfo(startMessage);
}

function setZoom(zoom ) 
{
	if(zoom){
		view.scale = SCREEN_HEIGHT/700*5;				
		zoomedIn = true;
		view.x = -lander.pos.x * view.scale + (SCREEN_WIDTH / 2);
		view.y = -lander.pos.y * view.scale + (SCREEN_HEIGHT * 0.25);
		lander.scale = 0.25;
		for(i = 0; i < missiles.length; i++){
			missiles[i].scale = 0.25;
		}
	
	} 
	else {
		
		view.scale = SCREEN_HEIGHT/700;
		zoomedIn = false;
		lander.scale = 0.6;
		for(i = 0; i < missiles.length; i++){
			missiles[i].scale = 0.6;
		}
		view.x = 0;
		view.y = 0;
	}
	/*
	for (var id in players) { 
		var player = players[id]; 
		player.scale = lander.scale; 
	}*/
	
	
}

// returns a random number between the two limits provided 
function randomRange(min, max){
	return ((Math.random()*(max-min)) + min); 
}

function clamp(value, min, max) { 
	return (value<min) ? min : (value>max) ? max : value; 
}

function map(value, min1, max1, min2, max2, clamp) { 
	clamp = typeof clamp !== 'undefined' ? clamp : false;
	
	
	if(clamp) {
		if(min1>max1) { 
			var tmp = min1; 
			min1 = max1;
			max1 = tmp; 
			tmp = min2; 
			min2 = max2; 
			max2 = tmp;  
			
		}
		if (value<=min1) return min2; 
		else if(value>=max1) return max2; 
	}
	
	
	return (((value-min1)/(max1-min1)) * (max2-min2))+min2;
}


function onMouseMove( event ) 
{
	mouseX = ( event.clientX - HALF_WIDTH );
	mouseY = ( event.clientY - HALF_HEIGHT );
	if((mouseHidden) && (Date.now() - lastMouseHide> 400)){
		document.body.style.cursor = "default"; 
		
		mouseHidden = false; 
	//	console.log("mouse move "+ canvas.style.cursor); 
	}
	lastMouseMove = Date.now(); 
}
	
function resizeGame (event) { 
	
	var newWidth = window.innerWidth; 
	var newHeight = window.innerHeight; 
	
	if((SCREEN_WIDTH== newWidth) && (SCREEN_HEIGHT==newHeight)) return; 
	if(touchable) window.scrollTo(0,-10); 
	
	SCREEN_WIDTH = canvas.width = newWidth; 
	SCREEN_HEIGHT = canvas.height = newHeight; 
	
	setZoom(zoomedIn) ;
	infoDisplay.arrangeBoxes(SCREEN_WIDTH, SCREEN_HEIGHT); 

}
