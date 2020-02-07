<?php
require('config.php');
require('database.php');
$link = db_connect();

// получаем логи и пароль нового пользователя
$incoming = file_get_contents('php://input');

// преобразуем из json
$user = json_decode($incoming);
$userEmail = $user -> {'userEmail'};
$userPassword = $user -> {'userPassword'};
// хеширование пароля
// $userPassword = password_hash($user -> {'userPassword'}, PASSWORD_DEFAULT);

// проверяем есть ли уже такой пользователь
$query = "SELECT * FROM `users` WHERE `mail` = '".mysqli_real_escape_string($link, $userEmail)."'";

if ( $result = mysqli_query($link, $query) ) {
	$row = mysqli_fetch_array($result);

	// если пользователь с таким адресом найден, то ошибка
	if ($row['mail']) {
		
		echo json_encode('exist');
	}
	// если такого результата нет, то регистрируем нового
	else  {

		$query = "INSERT INTO `users` (`mail`, `password`) VALUES ('".mysqli_real_escape_string($link, $userEmail)."', '".mysqli_real_escape_string($link, $userPassword)."')";
		$result = mysqli_query($link, $query);
		
		echo json_encode('success');

	}

}
else {
	echo json_encode('error');
	
};
mysqli_close($link);

?>