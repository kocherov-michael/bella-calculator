<?php
require('config.php');
require('database.php');
$link = db_connect();

$incoming = file_get_contents('php://input');
$user = json_decode($incoming);
$userEmail = $user -> {'userEmail'};

$query = "SELECT * FROM `users` WHERE `mail` = '" . mysqli_real_escape_string($link, $userEmail) . "'";

if ( $result = mysqli_query($link, $query) ) {
	$row = mysqli_fetch_array($result);
	// данные хранятся уже в JSON формате, поэтому сразу передаём не кодируя повторно
	echo $row['data'];

};
mysqli_close($link);

?>