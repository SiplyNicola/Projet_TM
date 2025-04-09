<?php
header('Content-Type: application/json; charset=utf-8');

// Démarre la session si ce n'est pas déjà fait
session_start();

// Vide toutes les variables de session
$_SESSION = [];

// Si les cookies sont utilisés pour stocker l'ID de session, on peut aussi les supprimer
if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,  // Expire le cookie immédiatement
        $params["path"], $params["domain"],
        $params["secure"], $params["httponly"]
    );
}

// Détruit la session
session_destroy();

// Répond avec un message JSON de réussite
echo json_encode([
    "reussi" => true,
    "message" => "Déconnexion réussie"
]);
?>
