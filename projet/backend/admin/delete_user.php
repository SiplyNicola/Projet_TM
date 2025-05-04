<?php
header('Content-Type: text/plain; charset=utf-8');

// Vérifie que l'ID est envoyé
if (!isset($_POST['id'])) {
    exit("ID utilisateur manquant.");
}

$id = intval($_POST['id']);

// Connexion à la base de données
$mysqli = new mysqli("127.0.0.1", "adminProjet", "Pv8gTpwzuBHokz4f", "db_projet_tm", 3306);

if ($mysqli->connect_errno) {
    die("Erreur de connexion : " . $mysqli->connect_error);
}

// Requête préparée pour éviter les injections
$stmt = $mysqli->prepare("DELETE FROM utilisateur WHERE id = ?");
$stmt->bind_param("i", $id);

// Exécution de la suppression
if ($stmt->execute()) {
    echo "Utilisateur supprimé avec succès.";
} else {
    echo "Erreur lors de la suppression.";
}

$stmt->close();
$mysqli->close();
?>
