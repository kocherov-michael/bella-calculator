<?php
require('config.php');
require('database.php');
$link = db_connect();
$form_from = "info@michaelkocherov.ru";
$project_name = "Bella-calculator";

// получаем почту пользователя
$incoming = file_get_contents('php://input');

// декодируем почту
$user = json_decode($incoming);
$userEmail = $user -> {'userEmail'};


$query = "SELECT * FROM `users` WHERE `mail` = '" . mysqli_real_escape_string($link, $userEmail) . "'";

if ( $result = mysqli_query($link, $query) ) {
	$row = mysqli_fetch_array($result);

	// если в данной почте есть пароль отправляем письмо
	if ($row['password']) {
	
	$password = $row['password'];
	
	// создаём письмо
	$recovery_message = "<p>Пароль: <b>$password</b></p>";
	$headers = 	"MIME-Version: 1.0" . PHP_EOL . 
						"Content-Type: text/html; charset=utf-8" . PHP_EOL .
						"From:" . $project_name . "<" . $form_from . " >" . PHP_EOL .
						"Reply-To:" . $form_from;
	mail($userEmail, 'Восстановление доступа', $recovery_message, $headers);
	
	echo json_encode("$userEmail");
	
	}
	else if (!$row['mail']) {
		// если не нашли такую почту
		echo json_encode('wrong email');
	}
	else {
		echo json_encode('error');
	};
}

mysqli_close($link);

?>