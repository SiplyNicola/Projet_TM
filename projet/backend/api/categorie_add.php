<?php
require_once '../connect.php';
$pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
$titre = $_POST['titre'] ?? '';
if ($titre) {
  $stmt = $pdo->prepare("INSERT INTO categorie (titre) VALUES (:titre)");
  $stmt->execute(['titre' => $titre]);
}
echo json_encode(['success' => true]);
?>