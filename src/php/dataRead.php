<?php
require('config.php');
require('database.php');
$link = db_connect();

$incoming = file_get_contents('php://input');
$userMail = substr($incoming, 1, -1);

$query = "SELECT * FROM `users` WHERE `mail` = '" . $userMail . "'";

if ( $result = mysqli_query($link, $query) ) {
	$row = mysqli_fetch_array($result);
	echo json_encode($row['data']);

};
mysqli_close($link);

?>