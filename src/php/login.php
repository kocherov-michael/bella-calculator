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


$query = "SELECT * FROM `users` WHERE `mail` = '".mysqli_real_escape_string($link, $userEmail)."'";

if ( $result = mysqli_query($link, $query) ) {
	$row = mysqli_fetch_array($result);

	if ($row['password'] == $userPassword) {
		// если логин и пароль совпадают, то возвращаем данные пользователя
		echo json_encode($row['data']);
	}
	else if (!$row['mail']) {
		echo json_encode('wrong email');
	}
	else {
		echo json_encode('wrong password');
	}

}
else {
	echo json_encode('wrong email');
	
};
mysqli_close($link);


?>