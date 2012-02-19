var select = {
	hitCount		: '.gameStats .hit .count',
	enemiesKilled	: '.gameStats .enemies-killed .count',
	gameTimer		: '.gameStats .time .count',
	deathAlert		: '.lower-section .game-over-container',
	pause			: '#pause-container'
};

var global = {
	keysdown		: new Array(),
	canvas			: "",
	enemies			: new Array(),
	enemySpawnTime 	: 1.5 * 1000,
	minEnemySpawnTime 	: 250,
	spawnAccelerator	: 50,
	maxEnemies		: 100,
	timeSinceSpawn	: now(),
	gameStartTime	: 0,
	enemiesKilled	: 0,
	hitsToLose		: 10,
	gameOver		: false,
	gameTimeString	: '0:0.0',
	frameCount		: 0,
	suspendControl	: false,
	fireDelay		: 100,
	fireDelayLocked : false
};

var debug = {
	autofire	: false,
	eToSpawn	: false,
	showProfiler: true
};

var snapshot = {};

$(document).ready(function(){
	snapshot.canvas = $("#spaceGame").get();
	snapshot.ship = spaceship;
	snapshot.global = global;
	
	initGame();	
	
	$("#spaceGame").each(function(){
			
		jck(this,{
			framerate			: 30,
			autoUpdate			: true,
			autoClear			: true,
			autoUpdateProfiler	: false,
			sampleFrames		: true
		});
		
		this.setHeight(400);
		this.setWidth(300);
		
		if (debug.showProfiler){
			this.createProfiler();
			this.addProfilerValue(profilerOutputs());
		}
			
		this.runloop = function(){
			spaceship.draw();
			spawnEnemies();
			drawEnemies();
			keyHandler();
			collisionManager()
			garbageCollector();
			outputManager();
			
			global.frameCount++;
			
			if (debug.showProfiler)
				this.updateProfiler(profilerOutputs());
		};
		
		global.canvas = this;
		
	});
	
	$(document).keyup(function(evt){
		global.keysdown.remove(evt.which);
		
		switch(evt.which){
				
			case 32: // Space
				global.fireDelayLocked = false;
				break;	
				
			case 68:
				global.canvas.toggleProfiler();
				break;
		}
	});
	
	$(document).keydown(function(evt){
		if (global.suspendControl)
			return;	
		
		// Broke the keyHandler pattern for the enter and D keys, as they need to operate 
		// outside the runloop.  This approach will keep the enter directly bound to the document.
		if (evt.which == 80){
			global.canvas.togglePause();
			
			// A little messy here, will by made cleaner by future JCK functionality hooks
			if (global.canvas.options.autoUpdate){
				$(select.pause).css({'display' : 'none'});
			}
			else{
				$(select.pause).css({'display' : 'block'});
			}	
		}
		
		//console.log(evt.which)
		global.keysdown.addUnique(evt.which);
	});
});

function initGame(){
	spaceship = snapshot.ship;
	global = snapshot.global;
}

function keyHandler(){
	if (global.suspendControl)
		return;
	
	for (i = 0; i < global.keysdown.length; i++){
		switch(global.keysdown[i]){
			case 32: // Space
				spaceship.fire();
				break;
				
			case 37: // Left
				spaceship.moveLeft();
				break;
				
			case 39: // Right
				spaceship.moveRight();
				break;
				
			case 69: // "E" key
				if (!debug.eToSpawn)
					break;
				
				global.enemies.push(spawn());
					break;
		}
	}
};

function outputManager(){
	$(select.hitCount).html((spaceship.hitCount > global.hitsToLose) ? global.hitsToLose : spaceship.hitCount);
	$(select.enemiesKilled).html(global.enemiesKilled);
	
	// Format and output the game time
	if (!spaceship.dead){		
		diff = global.frameCount - global.gameStartTime;
		hundredths = parseInt((diff % global.canvas.options.framerate) / (global.canvas.options.framerate/10))
		sec = parseInt(diff / global.canvas.options.framerate);
		min = parseInt(sec / 60)
		sec = sec % 60
		sec = sec < 10 ? '0' + sec : sec;
		global.gameTimeString = min + ':' + sec + "." + hundredths;
	}
	
	$(select.gameTimer).html(global.gameTimeString);
}

function collisionManager(){
	for (this.b = 0; this.b < spaceship.bullets.length; this.b++){
		for (this.e = 0; this.e < global.enemies.length; this.e++){
			if (areColliding(spaceship.bullets[this.b], global.enemies[this.e])){
				global.enemies[this.e].kill();
				spaceship.bullets[this.b].use();
			}
		}
	}
	
	for (this.e = 0; this.e < global.enemies.length; this.e++){
		for (this.b = 0; this.b < global.enemies[this.e].bullets.length; this.b++){
			if (areColliding(global.enemies[this.e].bullets[this.b], spaceship)){
				global.enemies[this.e].bullets[this.b].use();
			}
		}
	}
}

function garbageCollector(){
	// Remove the bullets from the game
	for (this.i = 0; this.i < spaceship.bullets.length; this.i++){
		if (spaceship.bullets[this.i].y < 0
			|| spaceship.bullets[this.i].used)
			spaceship.bullets.splice(this.i, 1);
	}
	
	for (this.e = 0; this.e < global.enemies.length; this.e++){
		for (this.b = 0; this.b < global.enemies[this.e].bullets.length; this.b++){
			if (global.enemies[this.e].bullets[this.b].used
				|| global.enemies[this.e].bullets[this.b].y > global.canvas.getHeight()){
				global.enemies[this.e].bullets.splice(this.b, 1);
			}
		
		}
	}
	
	// Remove dead enemies from the game
	for (this.e = 0; this.e < global.enemies.length; this.e++){
		if (global.enemies[this.e].dead && global.enemies[this.e].bullets.length == 0)
			global.enemies.splice(this.e, 1);
	}
}



function areColliding(entity1, entity2){	
	entity1Right = entity1.width + entity1.x;
	entity1Left = entity1.x;
	entity1Top = entity1.y;
	entity1Bottom = entity1.y + entity1.height;
	entity2Right = entity2.width + entity2.x;
	entity2Left = entity2.x;
	entity2Top = entity2.y;
	entity2Bottom = entity2.y + entity2.height;
	
	function isBetween(point, start, end){
		return (point > start && point < end) ? true : false;
	}
	
	if ((isBetween(entity1Left, entity2Left, entity2Right) || isBetween(entity1Right, entity2Left, entity2Right))
		&& (isBetween(entity1Top, entity2Top, entity2Bottom) || isBetween(entity1Bottom, entity2Top, entity2Bottom))){
		return true;		
	}
		
	return false;
}

function totalBullets(){
	this.sum = spaceship.bullets.length;
	
	for (this.e = 0; this.e < global.enemies.length; this.e++){
		this.sum += global.enemies[this.e].bullets.length;
	}
	
	return this.sum;
}

function drawEnemies(){
	for (this.en = 0; this.en < global.enemies.length; this.en++){
		global.enemies[this.en].draw();
	}
}

function spawnEnemies(){
	if ((now() - global.timeSinceSpawn) > global.enemySpawnTime
		&& global.enemies.length < global.maxEnemies){
		global.enemies.push(spawn());
		
		global.timeSinceSpawn = now();
	}
}

function spawn(){
	return new enemy({
		x 		: 10, 
		y 		: random(10, 300), 
		height	: 8, 
		width	: 8, 
		speed 	: 4,
		color	: '#1F75FF',
		rechargeTime	: random(20, 40)
	})
}

function profilerOutputs(){
	return debugOutputs().concat([
		{	
			label : "bullets",
			value : totalBullets()
		},
		{	
			label : "enemies",
			value : global.enemies.length
		}
	]);
}

function debugOutputs(){
	this.retVal = new Array();
	
	for (prop in debug){
		this.retVal.push({label : 'Debug - ' + prop, value : debug[prop]});
	}
	
	return this.retVal;
}

Array.prototype.addUnique = function(val){
	for (i = 0; i < this.length; i++){
		if (this[i] == val)
			return;	
	}
	
	this.push(val);
};

Array.prototype.remove = function(val){
	for (i = 0; i < this.length; i++){
		if (this[i] == val){
			this.splice(i, 1);
		}
	}
}