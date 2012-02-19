<?php
	// Made a custom HTML sanatizer so I could preserve tags
	// Make a quick fix to disable this because it was annoying me
	function browserfyText($text){
		/*return (str_replace("'", "&apos;", 
			str_replace('"', "&quot;", $text)));*/
		return $text;
	}
	
	function clearFloats($text){
		return $text  . '</div><div class="clear"></div>';
	}

	function leftContentBox($text){
		return clearFloats('<div class="content left">' . browserfyText($text));
	}
	
	/*function rightContentBox($text){
		return clearFloats('<div class="content right">' . browserfyText($text));
	}
	
	function contentBox($text){
		return clearFloats('<div class="content">' . browserfyText($text));
	}*/
	
	function controlledCanvas($id){
		return '<div id="' . $id . '-container" class="canvas-container">
					<canvas id="' . $id . '"></canvas>
					<div class="label">Canvas controls:</div>
					<ul id="' . $id . '-controls" class="canvas-controls">
						<li class="play-pause">Play/pause</li>
						<li class="profiler">Toggle profiler</li>
					</ul>
				</div>';
	}
?>

<!DOCTYPE html>
 
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="en" lang="en">    
 
    <head> 
 
	<meta http-equiv="Content-Type" content="text/html;charset=utf-8" /> 
 
	<!-- Title --> 
	<title>jQuery Canvas Kit</title> 
	
	<link rel = "stylesheet" type = "text/css" href = "css/style.css" />
	<link rel = "stylesheet" type = "text/css" href = "css/jquery-ui.css" />
	<link rel = "stylesheet" type = "text/css" href = "css/jckStyle.css" />
	<link href='http://fonts.googleapis.com/css?family=Josefin+Sans+Std+Light' rel='stylesheet' type='text/css'>
	
	<!-- JavaScript includes --> 
	
	<!--<script type="text/javascript" src="http://jqueryjs.googlecode.com/files/jquery-1.3.2.min.js"></script> -->
	<script type="text/javascript" src="js/jquery-1.4.2.min.js"></script>
	<script type="text/javascript" src="js/jquery-ui.min.js"></script>
	<script type="text/javascript" src="js/jck.js"></script>
	<script type="text/javascript" src="js/circleManager.js"></script>
	<script type="text/javascript" src="js/demoManager.js"></script>
	<script type="text/javascript" src="js/jckDemos.js"></script>
	
	<!-- favicon --> 
	<link rel="SHORTCUT ICON" href="http://www.jerbils.com//images/favicon.ico"/> 
    
	<!-- Meta tags --> 
	<meta name="description" content="" /> 
	<meta name="keywords" content="" /> 
	<meta name="author" content="" /> 

	<script type="text/javascript">
		// This is a small Mac-only adjustment for the Google Font used in the masthead, Windows doesn't seem to complain.
		$(document).ready(function(){
			if (navigator.userAgent.search('Macintosh') != -1){
				$('.main-container .masthead').css({'padding-top' : '36px'});
			}
		});
	</script>
 
    </head> 

    <body> 
    
    	<div class="main-container">
		
			<div class="masthead">
				<h1>jQuery <span class="spicy">Canvas</span> Kit</h1>
				<h2>The future of the web, simplified</h2>
			</div>
			
			<?php  
			
				echo(leftContentBox('<h3>What is the jQuery Canvas Kit?</h3>
				<p>The jQuery Canvas Kit (JCK for short) is a toolkit designed to extend the capabilities of the HTML 5 Canvas element.  It provides a streamlined solution for a number of common needs, such as a run loop, live performance analysis, the ability to utilize the entire content area of the browser for the canvas (with dynamic resizing), and much more.</p>
				<p>The JCK is geared for performance and ease of implementation.  To extend any canvas on the <code>document</code>, simply pass the canvas as an object into the <code>jck()</code> function:</p>
				<pre>jck(document.getElementById("myCanvas"));</pre>
				<p>If <code>myCanvas</code> is the ID of one of the <code>canvas</code> elements in the <code>document</code>.</p>'));
			
				echo(leftContentBox('<h3>So, what does it do for me?</h3>' . controlledCanvas('demoCanvas1') . '<p>One of the core functions of the JCK is run loop and frame management.  Using this toolkit, you will no longer have to worry about callbacks and clearing of the canvas - it&apos;s all taken care of for you.</p>
				<p>In this example, the looping functionality is being managed completely by the JCK.  The core logic of the demonstration deals with the animation of the little teal balls, not with tedious frame management and callbacks.</p>'));
			
			
				echo(leftContentBox('<h3>Live performance metrics.</h3> ' . controlledCanvas("demoCanvas2") . ' <p>The JCK provides a profiler, a tool that will help you determine how well your application is performing.  While the browser tries it&apos;s best to achieve a certain framerate, there are sometimes circumstances that prevent this.  By outputting how many frames are actually being rendered per second, you can easily identify where CPU utilization may be too high.  The profiler is also extensible; you can have it keep track of propreties specific to your application.  To see it in action, start the demo above by clicking "Play/pause" and then click "Toggle profiler" to see its actual framerate.  "Dusts" is a custom value that was added using the JCK API.</p>
				<p>The JCK is being actively developed.  More technical documentation can be found on the <a href="http://code.google.com/p/jquerycanvaskit/w/list" target="_blank">Google Code wiki.</a></p>'));
				
				echo(leftContentBox("<h3>It's also a game platform.</h3><p>The JCK is geared towards providing a general platform for interactive applications, but it also serves well as a game platform.  It's not a game <span class=\"italic\">engine</span>, so it doesn't bog developers down with functionality they might not need.  However, for developers wanting a simple run loop - a clean slate - it's an ideal choice.</p><p>Here's an example of a <a href=\"spacegame\" target=\"_blank\">game built using the JCK</a>.</p>"));
			
			?>
			
			<div class="footer">
			
				<ul>
				
					<li>Download the <a href="http://jquerycanvaskit.googlecode.com/files/jquerycanvaskit.zip">latest version</a></li>
					<li>View the <a href="http://code.google.com/p/jquerycanvaskit/source/browse/" target="_blank">source</a>, <a href="http://code.google.com/p/jquerycanvaskit/w/list" target="_blank">wiki</a>, and <a href="http://code.google.com/p/jquerycanvaskit/issues/list" target="_blank">issue tracker</a> on Google Code</li>
					<li class="last">The jQuery Canvas Kit is a free and open source project by <a href="http://www.jerbils.com/" target="_blank">Jeremy Kahn</a>.  All are welcomed to contribute and distribute.</li>
				</ul>
			
			</div>
			
		</div>
 
 	<div class="clear"></div>
 
	<!-- Google Analytics --> 
	<script type="text/javascript"> 
		var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
		document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
	</script> 
	<script type="text/javascript"> 
		try 
		{
			var pageTracker = _gat._getTracker("UA-10592695-2");
			pageTracker._trackPageview();
		} 
		catch(err) 
		{
			
		}
	    </script>
 
 
 
    </body> 
 
</html>