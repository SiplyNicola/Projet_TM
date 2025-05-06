<?php
header('Content-Type: application/json; charset=utf-8');
include("../connect.php");

try {
    // Connexion à la base de données
    $conn = pdo_connectDB("localhost", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
    $conn->beginTransaction();

    session_start();
    session_write_close();

    // Récupérer le pseudo passé par la requête POST
    if (isset($_POST['pseudo']) && !empty($_POST['pseudo'])) {
        $pseudo = $_POST['pseudo'];

        // Requête pour récupérer l'ID de l'utilisateur
        $sql = "
            SELECT id
            FROM utilisateur
            WHERE pseudo = :pseudo
        ";
        $statement = $conn->prepare($sql);
        $statement->bindParam(':pseudo', $pseudo);
        $statement->execute();

        // Vérifier si l'utilisateur existe
        $utilisateur = $statement->fetch(PDO::FETCH_ASSOC);
        
        if ($utilisateur) {
            echo json_encode(["success" => true, "id_utilisateur" => $utilisateur['id']], JSON_UNESCAPED_UNICODE);
        } else {
            echo json_encode(["success" => false, "message" => "Utilisateur introuvable."], JSON_UNESCAPED_UNICODE);
        }
    } else {
        echo json_encode(["success" => false, "message" => "Pseudo non fourni."], JSON_UNESCAPED_UNICODE);
    }

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
