<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");

    $categorie = [];

    try {
        // Connexion à la base de données 
        $conn = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "utilisateurProjet", "wNcEaRvH3OlAZkzY");

        // Préparation et exécution de la requête
        $stmt = $conn->prepare("SELECT * FROM categorie ORDER BY id ASC");
        $stmt->execute();

        // Récupération des résultats
        $categorie = $stmt->fetchAll(PDO::FETCH_ASSOC);

    } catch (PDOException $e) {
        // En cas d'erreur, on retourne un message d'erreur
        echo json_encode(['error' => 'Erreur : ' . $e->getMessage()]);
        exit;
    }

    // Envoi des résultats en JSON
    echo json_encode($categorie);
?>
