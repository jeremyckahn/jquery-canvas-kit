<?php

$DEBUG = false;

function connect(){
	$conn=mysql_connect ("mysql.jeremyckahn.com", "jck_spacegame",
	"") or die('Cannot connect to the database because: ' . mysql_error());
	mysql_select_db ("jeremyckahn_spacegame");

	return $conn;
}

function sanitize($data){
	return urlencode($data);
}

function desanitizeArray($data){
	foreach($data as $key => $value){
		$data[$key] = desanitize($value);
	}

	return $data;
}

function desanitize($data){
	return urldecode($data);
}

if (isset($_POST['intent'])){

	switch($_POST['intent']){
		case 'makeEntry':
			if(isset($_POST['name'])
				&& isset($_POST['killed'])
				&& isset($_POST['time'])){
					$sql ='INSERT into leaderboard (leader_name, leader_enemies_killed, leader_game_time) VALUES('
					. '"' . sanitize($_POST['name']) . '", '
					. '"' . sanitize($_POST['killed']) . '", '
					. '"' . sanitize($_POST['time']) .'")';

				connect();
				$result = mysql_query($sql);

				if (mysql_affected_rows() != 0)
					echo 'Record created!';
				else
					echo 'Error!';
				}

		break;

		case 'getRecords':
			connect();
			$sql = 'SELECT * FROM leaderboard ORDER BY leader_enemies_killed DESC LIMIT 10';
			$result = mysql_query($sql);

			$resultArr = array();

			while($row = mysql_fetch_assoc($result)){
				$resultArr[] = desanitizeArray($row);
			}

			print json_encode($resultArr);
		break;
	}
}
else{

	if (!$DEBUG)
		exit();
?>

<html>
<head>

<script type="text/javascript" src="http://code.jquery.com/jquery-1.4.2.min.js"></script>
<script type="text/javascript">

$(function(){
	$('#send').click(function(){
		send({
			intent	: 'makeEntry',
			name	: 'test',
			killed	: 0,
			time	: '1:00.00'
		});
	});

	$('#get').click(function(){
		send({intent : 'getRecords'});
	});
});

function send(dataToSend){
	$.post('#',
		dataToSend,
		function(dataReturned) {
			//setOutputSuccess();
			//$(select.output).html(dataReturned);
			alert(dataReturned)
		}
	);
}

</script>

</head>
<body>
	<button id="get">Get the data</button>
	<button id="send">Send test data</button>
</body>
</html>

<?php } ?>
