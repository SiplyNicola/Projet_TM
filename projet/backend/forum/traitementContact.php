<?php
header('Content-Type: application/json; charset=utf-8');

$erreurs = [
    "nom" => "",
    "email" => "",
    "message" => "",
    "consentement" => "",
    "reussi" => true
];

// Fonction de nettoyage
function test_input($data) {
    $data = trim($data); // Supprime les espaces en début/fin
    $data = stripslashes($data); // Supprime les antislashs
    $data = htmlspecialchars($data, ENT_QUOTES, 'UTF-8'); // Encode les caractères HTML
    return $data;
}

// Vérifie que la requête est POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {

    // NOM
    if (empty($_POST["nom"])) {
        $erreurs["nom"] = "Le nom est requis.";
        $erreurs["reussi"] = false;
    } else {
        $nom = test_input($_POST["nom"]);
        if (!preg_match("/^[\p{L}\s'-]+$/u", $nom)) {
            $erreurs["nom"] = "Seules les lettres, espaces, tirets et apostrophes sont autorisés.";
            $erreurs["reussi"] = false;
        }
    }

    // EMAIL
    if (empty($_POST["email"])) {
        $erreurs["email"] = "L'adresse e-mail est requise.";
        $erreurs["reussi"] = false;
    } else {
        $email = test_input($_POST["email"]);
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $erreurs["email"] = "L'adresse e-mail n'est pas valide.";
            $erreurs["reussi"] = false;
        }
    }

    // MESSAGE
    if (empty($_POST["message"])) {
        $erreurs["message"] = "Le message ne peut pas être vide.";
        $erreurs["reussi"] = false;
    } else {
        $message = test_input($_POST["message"]);
    }

    // CONSENTEMENT
    if (!isset($_POST["consentement"]) || $_POST["consentement"] === false) {
        $erreurs["consentement"] = "Vous devez accepter le traitement de vos données.";
        $erreurs["reussi"] = false;
    }

    // Si aucune erreur, tu peux ici envoyer le mail (optionnel, je peux t'ajouter ça aussi)

    echo json_encode($erreurs);
}
?>
