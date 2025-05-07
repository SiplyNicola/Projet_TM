<?php
header('Content-Type: application/json; charset=utf-8');
include("../connect.php");
session_start();

$retour = [
    "connecte" => false,
    "id" => "",
    "pseudo" => "",
    "role" => "",
    "banni" => 0,
    "raison_bannissement" => ""
];

// Vérifie si l'utilisateur est connecté
if (isset($_SESSION["id"])) {
    $retour["connecte"] = true;
    $retour["id"] = $_SESSION["id"];
    $retour["pseudo"] = $_SESSION["pseudo"];
    $retour["role"] = $_SESSION["role"];
    
    try {
        $pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "root", "");

        // Récupère le statut de bannissement et la raison
        $stmtBan = $pdo->prepare("SELECT banni, raison_bannissement FROM utilisateur WHERE id = ?");
        $stmtBan->execute([$_SESSION["id"]]);
        $infosBan = $stmtBan->fetch(PDO::FETCH_ASSOC);

        if ($infosBan) {
            $retour["banni"] = (int)$infosBan["banni"];
            $retour["raison_bannissement"] = $infosBan["raison_bannissement"];
        }

        // Nombre d'abonnés (ceux qui suivent l'utilisateur)
        $stmt1 = $pdo->prepare("SELECT COUNT(*) FROM abonnements WHERE id_suivi = ?");
        $stmt1->execute([$_SESSION["id"]]);
        $retour["abonnes"] = $stmt1->fetchColumn();

        // Nombre d'abonnements (ceux que l'utilisateur suit)
        $stmt2 = $pdo->prepare("SELECT COUNT(*) FROM abonnements WHERE id_abonne = ?");
        $stmt2->execute([$_SESSION["id"]]);
        $retour["abonnements"] = $stmt2->fetchColumn();

    } catch (Exception $e) {
        error_log("Erreur de connexion à la base de données: " . $e->getMessage());
    }
}

session_write_close();
echo json_encode($retour);
?>
