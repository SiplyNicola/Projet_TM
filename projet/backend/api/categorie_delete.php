<?php
require_once '../connect.php';
$pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
$id = $_POST['id'] ?? 0;
if ($id) {
  $stmt = $pdo->prepare("DELETE FROM categorie WHERE id = :id");
  $stmt->execute(['id' => $id]);
}
echo json_encode(['success' => true]);
?>