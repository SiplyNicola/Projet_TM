<?php
header('Content-Type: application/json; charset=utf-8');
include("../connect.php");
session_start();

$retour = [
    "connecte" => false,
    "id" => "",
    "pseudo" => "",
    "role" => "",
    "abonnes" => 0,
    "abonnements" => 0
];

// Vérifie si l'utilisateur est connecté
if (isset($_SESSION["id"])) {
    $retour["connecte"] = true;
    $retour["id"] = $_SESSION["id"];
    $retour["pseudo"] = $_SESSION["pseudo"];
    $retour["role"] = $_SESSION["role"];
    
    // Si l'utilisateur est connecté, récupère le nombre d'abonnés et d'abonnements
    try {
        $pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "root", "");
        // Nombre d'abonnés (ceux qui suivent l'utilisateur)
        $stmt1 = $pdo->prepare("SELECT COUNT(*) FROM abonnements WHERE id_suivi = ?");
        $stmt1->execute([$_SESSION["id"]]);
        $abonnes = $stmt1->fetchColumn();

        // Nombre d'abonnements (ceux que l'utilisateur suit)
        $stmt2 = $pdo->prepare("SELECT COUNT(*) FROM abonnements WHERE id_abonne = ?");
        $stmt2->execute([$_SESSION["id"]]);
        $abonnements = $stmt2->fetchColumn();

        // Ajoute les résultats au tableau de retour
        $retour["abonnes"] = $abonnes;
        $retour["abonnements"] = $abonnements;

    } catch (Exception $e) {
        error_log("Erreur de connexion à la base de données: " . $e->getMessage());
    }
} else {
    $retour["connecte"] = false;
}

session_write_close();
echo json_encode($retour);
?>
