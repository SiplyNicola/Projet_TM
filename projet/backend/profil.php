<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

// Vérifie si l'utilisateur est connecté via la session
if (isset($_SESSION['id']) && isset($_SESSION['pseudo'])) {
    // Récupère les informations de la session
    $userInfo = [
        "id" => $_SESSION['id'],
        "pseudo" => $_SESSION['pseudo']
    ];
    // Renvoyer ces informations
    echo json_encode($userInfo);
} else {
    // Si la session n'est pas active, renvoyer une erreur
    echo json_encode([
        "error" => "Utilisateur non connecté"
    ]);
}
?>
