<?php
require_once '../connect.php';
$pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
$id = $_POST['id'] ?? 0;
$titre = $_POST['titre'] ?? '';
if ($id && $titre) {
  $stmt = $pdo->prepare("UPDATE categorie SET titre = :titre WHERE id = :id");
  $stmt->execute(['id' => $id, 'titre' => $titre]);
}
echo json_encode(['success' => true]);
