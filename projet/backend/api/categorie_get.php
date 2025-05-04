<?php
require_once '../connect.php';
$pdo = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
$stmt = $pdo->query("SELECT * FROM categorie ORDER BY id ASC");
echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
?>