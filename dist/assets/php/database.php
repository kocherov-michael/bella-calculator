<?php 
function db_connect(){
	$link = mysqli_connect(MYSQL_SERVER, MYSQL_USER, MYSQL_PASSWORD, MYSQL_BD);
	if (mysqli_connect_error()) {
		die ("Ошибка подключения к базе данных");
	} 
	
	if (!mysqli_set_charset($link, "utf8") ) {
		print("Error: " . mysqli_error($link));
	}
	return $link;
}
?>