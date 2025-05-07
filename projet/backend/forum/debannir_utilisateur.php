<?php
header('Content-Type: application/json');
include("../connect.php");
session_start();

$retour = ["success" => false];

if (isset($_SESSION["role"]) && $_SESSION["role"] === "admin") {
    if (!empty($_POST["pseudo"])) {
        try {
            $pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "root", "");
            $stmt = $pdo->prepare("UPDATE utilisateur SET banni = 0, raison_bannissement = NULL WHERE pseudo = ?");
            $stmt->execute([$_POST["pseudo"]]);
            $retour["success"] = true;
            $retour["message"] = "Utilisateur débanni avec succès.";
        } catch (Exception $e) {
            $retour["message"] = "Erreur : " . $e->getMessage();
        }
    } else {
        $retour["message"] = "Paramètre pseudo manquant.";
    }
} else {
    $retour["message"] = "Accès refusé.";
}

echo json_encode($retour);
