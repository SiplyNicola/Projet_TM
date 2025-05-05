<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");


    try {
        // Connexion à la base de données
        $conn = pdo_connectDB("localhost", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
        $conn->beginTransaction();

        // Protection XSS (et contre les scripts <script>)
        $titre = htmlspecialchars(trim($_POST["titre"]), ENT_NOQUOTES, 'UTF-8');
        $contenu = htmlspecialchars(trim($_POST["contenu"]), ENT_NOQUOTES, 'UTF-8');

        $categorie_id = $_POST["choixCategorie"];
        session_start();
        $id_utilisateur = $_SESSION["id"];
        session_write_close();

        // Préparation de la requête
        $sql = "INSERT INTO publication (id_utilisateur, id_categorie, titre, contenu, date_publication) 
                VALUES (:id_utilisateur, :id_categorie, :titre, :contenu, NOW())";
        $statement = $conn->prepare($sql);

        // Liaison des paramètres
        $statement->bindParam(':titre', $titre, PDO::PARAM_STR);
        $statement->bindParam(':contenu', $contenu, PDO::PARAM_STR);
        $statement->bindParam(':id_categorie', $categorie_id, PDO::PARAM_INT);
        $statement->bindParam(':id_utilisateur', $id_utilisateur, PDO::PARAM_INT);

        $statement->execute();

        $conn->commit();

        echo json_encode(["success" => true, "message" => ""]);
    } catch (Exception $e) {
        $conn->rollBack();
        echo json_encode(["success" => false, "message" => $e->getMessage()]);
    }
?>
