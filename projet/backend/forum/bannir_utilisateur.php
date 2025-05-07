<?php
header('Content-Type: application/json');
include("../connect.php");
session_start();

$retour = ["success" => false, "message" => ""];

if (isset($_SESSION["role"]) && $_SESSION["role"] === "admin") {
    if (!empty($_POST["pseudo"]) && isset($_POST["raison"])) {
        try {
            $pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "root", "");
            $stmt = $pdo->prepare("UPDATE utilisateur SET banni = 1, raison_bannissement = ? WHERE pseudo = ?");
            $stmt->execute([$_POST["raison"], $_POST["pseudo"]]);
            $retour["success"] = true;
            $retour["message"] = "Utilisateur banni avec succès.";
        } catch (Exception $e) {
            $retour["message"] = "Erreur : " . $e->getMessage();
        }
    } else {
        $retour["message"] = "Paramètres manquants.";
    }
} else {
    $retour["message"] = "Accès refusé.";
}

echo json_encode($retour);
