<?php
header('Content-Type: text/html; charset=utf-8');

$mysqli = new mysqli("127.0.0.1", "adminProjet", "Pv8gTpwzuBHokz4f", "db_projet_tm", 3306);

if ($mysqli->connect_errno) {
    die("Erreur de connexion : " . $mysqli->connect_error);
}

$result = $mysqli->query("SELECT id, nom, prenom, pseudo, adresse_email, role FROM utilisateur");

if (!$result) {
    die("Erreur lors de la récupération : " . $mysqli->error);
}

while ($row = $result->fetch_assoc()) {
    echo "<tr>";
    echo "<td>" . htmlspecialchars($row['nom']) . "</td>";
    echo "<td>" . htmlspecialchars($row['prenom']) . "</td>";
    echo "<td>" . htmlspecialchars($row['pseudo']) . "</td>";
    echo "<td>" . htmlspecialchars($row['adresse_email']) . "</td>";
    echo "<td>" . htmlspecialchars($row['role']) . "</td>";
    echo '<td><button class="btn btn-danger btn-sm btn-supprimer" data-id="' . intval($row['id']) . '">Supprimer</button></td>';
    echo "</tr>";
}

$mysqli->close();
?>
