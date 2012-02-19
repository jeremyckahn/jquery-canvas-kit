var spaceship = {
	x 				: 0,
	y				: 300,
	height			: 30,
	width			: 19,
	horizontalSpeed	: 9,
	alpha			: 1.0,
	distFromBottom	: 15,
	canFire			: true,
	bullets			: new Array(),
	hitCount		: 0,
	dead			: false,
	deathAnimSpeed	: 8,
	draw			: function(){
		
		if (this.hitCount >= global.hitsToLose){
			this.dead = true;
			this.height += 2 * this.deathAnimSpeed;
			this.width += 2 * this.deathAnimSpeed;
			this.x -= 1 * this.deathAnimSpeed;
			this.y -= 1 * this.deathAnimSpeed;
			this.alpha -= 0.05;
			
			if (this.alpha <= 0.1 ){
				$(select.pause).css({'z-index' : '-1000'});
				global.gameOver = true;
				$(select.deathAlert).fadeIn(1000);
				
				return;	
			}
		}
		else{
			this.y = global.canvas.getHeight() - this.height - this.distFromBottom;
		}
			
			global.canvas.polygon(
				[0, this.width / 2, this.width], // pointsX
				[this.height, 0, this.height], // pointsY
				this.x, // offsetX
				this.y, // offsetY
				'rgba(48, 255, 48, ' + this.alpha + ')' // color
			);
			
		for (this.i = 0; this.i < this.bullets.length; this.i++){
			this.bullets[this.i].draw();
		}
		
	},
	
	moveLeft		: function(){
		if (this.dead)
			return;
		
		if ((this.x - this.horizontalSpeed) <= 0)
			this.x = 0;
		else
			this.x -= this.horizontalSpeed;
	},
	
	moveRight		: function(){
		if (this.dead)
			return;
		
		if (((this.x + this.width) + this.horizontalSpeed) >= global.canvas.getWidth())
			this.x = global.canvas.getWidth() - this.width;
		else
			this.x += this.horizontalSpeed;
	},
	
	fire			: function(){
		if (!this.canFire || global.fireDelayLocked)
			return;
			
		this.bullets.push(new bullet({
			x 		: this.x + (this.width/2), 
			y 		: this.y, 
			height	: 3, 
			width 	: 3, 
			speed 	: 5, 
			color 	: '#FFB01F'
		}));
		
		if (!debug.autofire){
			this.canFire = false;
			global.fireDelayLocked = true;
			
			// This timeout acts as a delay between player fires.  People were cheating so I had to stop them.  :(
			setTimeout(function(){
				spaceship.canFire = true;		
			}, global.fireDelay);
		}
	}
};

function bullet(options){
	// Set the bullet's properties, or a default if one is not given.
	this.x = !!options.x ? options.x 							: 0;
	this.y = !!options.y ? options.y 							: 0;
	this.height = !!options.height ? options.height 			: 5;
	this.width = !!options.width ? options.width 				: 5;
	this.speed = !!options.speed ? options.speed 				: 3;
	this.color = !!options.color ? options.color 				: '#f0f';
	this.belongsTo = !!options.belongsTo ? options.belongsTo 	: 'player';
	
	this.used = false;
	
	this.draw = function(){
		if (this.used)
			return;
		
		this.move();
		
		global.canvas.polygon(
			[0, this.width, this.width, 0], // pointsX
			[0, 0, this.height, this.height], // pointsY
			this.x, // offsetX
			this.y, // offsetY
			this.color // color
		);
	}
	
	this.move = function(){
		switch(this.belongsTo){
			case 'player':
				this.y -= this.speed;
				break;
			case 'enemy':
				this.y += this.speed;
				break;
				
			default:
				this.y -= this.speed;
		}
	}
	
	this.use = function(){
		this.used = true;
			
		switch(this.belongsTo){
			case 'enemy':
				spaceship.hitCount++;
				
				if (spaceship.dead == true)
					this.used = false;
				
				break;
				
			case 'player':
				// Hack fix - sometimes the global.enemiesKilled count would increment after the bullets were offscreen post-gomeOver.
				if (!global.gameOver)
					global.enemiesKilled++;
					
				global.enemySpawnTime -= global.spawnAccelerator;
				global.enemySpawnTime = global.enemySpawnTime < global.minEnemySpawnTime ? global.minEnemySpawnTime : global.enemySpawnTime;
				break;
		}
	}
}

function enemy(options){
	this.dead = false;
	this.framesSinceFire = 0;
	this.bullets = new Array();
	
	this.x = !!options.x ? options.x 					: 0;
	this.y = !!options.y ? options.y 					: 0;
	this.height = !!options.height ? options.height 	: 10;
	this.width = !!options.width ? options.width 		: 10;
	this.speed = !!options.speed ? options.speed 		: 4;
	this.color = !!options.color ? options.color 		: '#f0f';
	this.rechargeTime = !!options.rechargeTime ? options.rechargeTime : 2 * 1000;
	
	this.draw = function(){
		if (this.dead){
			this.moveBullets();
			return;
		}
		
		this.move();
		
		global.canvas.polygon(
			[0, this.width, this.width, 0], // pointsX
			[0, 0, this.height, this.height], // pointsY
			this.x, // offsetX
			this.y, // offsetY
			this.color // color
		);
	}
	
	this.move = function(){
		if ((this.x + this.speed) > global.canvas.getWidth() ||
			this.x + this.width + this.speed < 0){
			this.speed *= -1;	
		}
		
		this.x += this.speed;
		
		if ((global.frameCount - this.framesSinceFire) >= this.rechargeTime){
			this.fire();
		}
			
		this.moveBullets();
	}
	
	this.moveBullets = function(){
		for (this.b = 0; this.b < this.bullets.length; this.b++){
			this.bullets[this.b].draw();
		}
	}
	
	this.kill = function(){
		this.dead = true;	
	}
	
	this.fire = function(){
		this.bullets.push(new bullet({
			x : this.x,
			y : this.y,
			height : 5,
			width : 2,
			speed : 6,
			color: '#51E8E0',
			belongsTo : 'enemy'
		}));
		
		this.framesSinceFire = global.frameCount;
	};
}