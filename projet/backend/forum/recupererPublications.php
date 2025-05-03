<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");

    try {
        // Connexion à la base de données
        $conn = pdo_connectDB("localhost", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
        $conn->beginTransaction();

        // Protection XSS (et contre les scripts <script>)
        session_start();
        session_write_close();

        // Préparation de la requête
        $sql = "SELECT * FROM publication";
        $statement = $conn->prepare($sql);


        $statement->execute();

        $publication = $statement->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode(["publication" => $publication]);

    } catch (Exception $e) {
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }