<?php
header('Content-Type: application/json');
include("../connect.php");

$retour = ["success" => false];

if (isset($_POST["pseudo"])) {
    try {
        $pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "root", "");
        $stmt = $pdo->prepare("SELECT id, pseudo, banni, raison_bannissement FROM utilisateur WHERE pseudo = ?");
        $stmt->execute([$_POST["pseudo"]]);
        $utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($utilisateur) {
            $retour["success"] = true;
            $retour["utilisateur"] = $utilisateur;
        } else {
            $retour["message"] = "Utilisateur non trouvé.";
        }
    } catch (Exception $e) {
        $retour["message"] = "Erreur : " . $e->getMessage();
    }
} else {
    $retour["message"] = "Pseudo manquant.";
}

echo json_encode($retour);
