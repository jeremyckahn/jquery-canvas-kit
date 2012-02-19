function demo1(canvas){
    demo1Props = {
        numCircles          : 75,
        minCircleRadius     : 5,
        maxCircleRadius     : 7,
        movementVarianceMin : 2,
        movementVarianceMax : 20,
        wobbleDamperMin     : 10,
        wobbleDamperMax     : 20,
        xSpeedMin           : 1,
        xSpeedMax           : 3,
        incrementSize       : 20
    };
	
    canvas.circleArray = new Array();
    
    for (var i = 0; i < demo1Props.numCircles; i++){
       tempCircle = new circleManager(
            canvas, // canvas
			random(canvas.getWidth()), // x
            random(canvas.getHeight()), // y
            random(demo1Props.maxCircleRadius, demo1Props.minCircleRadius), // radius
            'rgb(' + parseInt(random(70, 40)) + ', ' + parseInt(random(255, 160)) + ', ' + parseInt(random(210, 120)) + ')' // color
        );
       
       // Give the circleManager instance some custom properties
       tempCircle.customProps = {
            originalY       : tempCircle.y,
            movementVariance: random(demo1Props.movementVarianceMax, demo1Props.movementVarianceMin),
            wobbleDamper    : random(demo1Props.wobbleDamperMax, demo1Props.wobbleDamperMin),
            xSpeed          : random(demo1Props.xSpeedMax, demo1Props.xSpeedMin)
        };
        
        // Determine where the circle appears horizontally in relation to it's x-coordinate    
        circleManager.prototype.calculateY = function(x){
            // Use double-negation to override this.x if the parameter was provided
            x = !!x ? x : this.x;
            
            // Perform some trignometry that I don't really know how to describe
            return this.customProps.originalY + (Math.sin((x / this.customProps.wobbleDamper)) * this.customProps.movementVariance);
        };
        
        // Define the custom behavior for the circle
        tempCircle.behavior = function(){
            // If the circle is off the screen to the right, bring it back to the left so it can start its journey again
            if (this.x - this.radius > canvas.getWidth()){
                this.x = -this.radius;
            }
            
            // Move the circle along to the right
            this.x += this.customProps.xSpeed;
            this.y = this.calculateY();
			
        };
       
        canvas.circleArray.push(tempCircle);
    }
	
    // Define the jck runloop
    canvas.runloop = function(){
        for(var i = 0; i < canvas.circleArray.length; i++){
            canvas.circleArray[i].draw();
        }
        this.updateProfiler();
    };
	
	// Update the canvas once and let the user choose to continue auto-running it.
	// Not calling canvas.update() due to a bug that will be addressed soon.
	canvas.update({manualFrameUpdate : true})
}


function demo2(canvas){
    demo2Props = {
        circleRadius        : 7,
		dustRadius			: 1
    };
	
    ball = new circleManager(
        canvas, // canvas
        random(canvas.getWidth()), // x
        random(canvas.getHeight()), // y
        demo2Props.circleRadius, // radius
		'rgb(55, 200, 170)' // color
    );
	
    ball.customProps = {
        speed               : 7,
		xVelocity           : 0,
		yVelocity           : 0,
		dust				: new Array(),
		dustFallSpeedMin	: 3,
		dustFallSpeedMax	: 6,
		dustIntensity		: 10 // Dusts created per frame
    };
    
    ball.customProps.xVelocity = ball.customProps.yVelocity = ball.customProps.speed;
    
	dustBehavior = function(){
		this.y += this.fallSpeed;
	}
	
    ball.behavior = function(){
			
		if ((this.x - this.radius) < 0 && this.customProps.xVelocity < 0)
			this.customProps.xVelocity *= -1;
			
		if ((this.x + this.radius) > canvas.getWidth() && this.customProps.xVelocity > 0)
			this.customProps.xVelocity *= -1;
			
		if ((this.y - this.radius) < 0 && this.customProps.yVelocity < 0)
			this.customProps.yVelocity *= -1;
			
		if ((this.y + this.radius) > canvas.getHeight() && this.customProps.yVelocity > 0)
			this.customProps.yVelocity *= -1;
        
        this.x += this.customProps.xVelocity;
        this.y += this.customProps.yVelocity;
		
		for(i = 0; i < this.customProps.dustIntensity; i++){
			tempDust = new circleManager(
				canvas, // canvas
				random(this.x + this.radius, this.x - this.radius),
				this.y, // y
				demo2Props.dustRadius, // radius
				'rgb(222, 183, 9)' // color
			);
			
			tempDust.fallSpeed = random(this.customProps.dustFallSpeedMax, this.customProps.dustFallSpeedMin);
			
			tempDust.behavior = dustBehavior;
			this.customProps.dust.push(tempDust);
		}
		
		// Sort the dust array based on y values
		this.customProps.dust.sort(function(first, second){
			return (second.y - first.y);
		});
		
		// Remove dusts at the beginning of the array until we are looking at one that is still on the canvas
		while (this.customProps.dust[0].y > canvas.getHeight()){
			this.customProps.dust.shift();
		}
		
		for(i = 0; i < ball.customProps.dust.length; i++)
			ball.customProps.dust[i].draw();
    }
	
	canvas.addProfilerValue([
		{
			label : "dusts",
			value : ball.customProps.dust.length
		}
	]);
	
    // Define the jck runloop
    canvas.runloop = function(){	
        ball.draw();
		
		this.updateProfiler([
			{
				label : "dusts",
				value : ball.customProps.dust.length
			}
		]);
    };
	
	canvas.update({manualFrameUpdate : true})
}