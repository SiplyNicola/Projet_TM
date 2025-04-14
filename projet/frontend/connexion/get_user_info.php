<?php
session_start();
header('Content-Type: application/json');
echo json_encode([
    "reussi" => true,
    "session_active" => isset($_SESSION['id']),
    "session" => $_SESSION
]);
if (!isset($_SESSION['id'])) {
    echo json_encode(["reussi" => false, "message" => "Non connecté"]);
    exit;
}
include(__DIR__ . "/../../backend/forum/connect.php");



try {
    $conn = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "utilisateurProjet", "wNcEaRvH3OlAZkzY");

    $stmt = $conn->prepare("SELECT nom, prenom, pseudo, adresse_email, role FROM utilisateur WHERE id = :id");
    $stmt->bindParam(':id', $_SESSION['id'], PDO::PARAM_INT);
    $stmt->execute();

    if ($user = $stmt->fetch(PDO::FETCH_ASSOC)) {
        echo json_encode(array_merge(["reussi" => true], $user));
    } else {
        echo json_encode(["reussi" => false, "message" => "Utilisateur introuvable"]);
    }
} catch (PDOException $e) {
    echo json_encode(["reussi" => false, "message" => $e->getMessage()]);
}
?>
