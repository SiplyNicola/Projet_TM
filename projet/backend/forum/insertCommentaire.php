<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");

    $response = [
        "success" => true,
        "message" => "",
        "connecte" => true
    ];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        session_start();
        $id_utilisateur = $_SESSION["id"];
        
        $contenu = $_POST['contenu_commentaire'];
        $id_publication = $_POST['id_publication'];
        session_write_close();
        
        try {
            $conn = pdo_connectDB("localhost", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
        
            $stmt = $conn->prepare("
                INSERT INTO commentaire (id_publication, id_utilisateur, contenu, date_commentaire)
                VALUES (:id_publication, :id_utilisateur, :contenu, NOW())
            ");
            $stmt->bindParam(':id_publication', $id_publication);
            $stmt->bindParam(':id_utilisateur', $id_utilisateur);
            $stmt->bindParam(':contenu', $contenu);
            $stmt->execute();
        
            $response["message"] = "Commentaire inséré avec succès.";
            echo json_encode($response);
            exit;
        } catch (PDOException $e) {
            $response["success"] = false;
            $response["message"] = "Erreur lors de l'insertion.";
            $response["error"] = $e->getMessage(); // Pour debug uniquement
            echo json_encode($response);
            exit;
        }
        
    }
?>
