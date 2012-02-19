//var theCanvas;
var frameCount = 0;
var randCircSizeMin = 10;
var randCircSizeMax = 50;
var goCrazy = false;

var select = {
	canvas		: "canvas",
	canvasContainer	: ".canvas-container",
	canvas1		: "#demoCanvas1",
	canvas2		: "#demoCanvas2",
	playPauseToggle	: ".play-pause",
	profilerToggle	: ".profiler"
};

$(document).ready(function(){
	/* 	INITIALIZATION AREA - BEGIN
	*	Canvas setup and run loop are defined here.
	*/
	$(select.canvas).each(function(){
		jck(this,
		{
			framerate 			: 20,
			autoUpdate 			: false,
			autoClear 			: false,
			sampleFrames 		: true,
			autoUpdateProfiler 	: false
		});
		
		this.setHeight(300);
		this.setWidth(400);
		
		this.createProfiler();
		this.hideProfiler();
	});
	
    $(select.canvas1).each(function(){
        this.options.autoClear = true;
        demo1(this);
    });
    
    $(select.canvas2).each(function(){
        this.options.autoClear = true;
        demo2(this);
    });
	
	/* 	INITIALIZATION AREA - END */
	
	/* Set click events to the buttons - BEGIN */
	
	$(select.playPauseToggle).click(function(){
		($(this).parents(select.canvasContainer).find("canvas").get(0).togglePause());
		
	});
	
	$(select.profilerToggle).click(function(){
		($(this).parents(select.canvasContainer).find("canvas").get(0).toggleProfiler())
	});	
	/* Set click events to the buttons - END */
});