<?php
function pdo_connectDB($host, $port, $bdname, $user, $pass){
	try {
		$bdd = new PDO('mysql:host=' . $host . ';port=' . $port . ';dbname=' . $bdname . ';charset=utf8', $user, $pass, array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
	} 
	catch(Exception $e){
		die('Erreur : '.$e->getMessage());
	}
	return $bdd;
}
?>