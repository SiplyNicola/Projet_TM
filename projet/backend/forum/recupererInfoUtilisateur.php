<?php
header('Content-Type: application/json; charset=utf-8');
include("../connect.php");
session_start();

$retour = [
    "connecte" => false,
    "id" => "",
    "pseudo" => "",
    "role" => "",
];

// Vérifie si l'utilisateur est connecté
if (isset($_SESSION["id"])) {
    $retour["connecte"] = true;
    $retour["id"] = $_SESSION["id"];
    $retour["pseudo"] = $_SESSION["pseudo"];
    $retour["role"] = $_SESSION["role"];
} else {
    $retour["connecte"] = false;
}

session_write_close();
echo json_encode($retour);
?>
