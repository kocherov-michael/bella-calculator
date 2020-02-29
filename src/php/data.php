<?php
require('config.php');
require('database.php');
$link = db_connect();

// чтение
// $query = "SELECT * FROM users";

// запись
// $query = "INSERT INTO `users` (`mail`, `password`, `data`) VALUES ('kocherov@mail.ru', '12345', '{532}') ";

// Обновление
// $query = "UPDATE `users` SET `data` = $var WHERE `mail` = 'kocherov@mail.ru' LIMIT 1 ";

// $result = mysqli_query($link, $query);


$incoming = file_get_contents('php://input');

$data = json_decode($incoming);
$userEmail = $data -> {'userEmail'};
$userData = $data -> {'userData'};


$query = "UPDATE `users` SET `data` = '" . mysqli_real_escape_string($link, $userData) . "' WHERE `mail` = '" . $userEmail . "' LIMIT 1 ";
$result = mysqli_query($link, $query);
// если запрос удачный, отправляем ответ
if ($result) {
	echo json_encode($userEmail);
}
mysqli_close($link);
?>