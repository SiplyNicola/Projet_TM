<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");

    $erreur = [
        "reussi" => true,
        "message" => ""
    ];

    $adresseEmail = $_POST["loginEmail"];
    $motDePasse = $_POST["loginPassword"];
    $motDePasseStocker = "";

    try {
        $conn = pdo_connectDB("127.0.0.1","3308", "db_projet_tm", "userProjet", "wNcEaRvH3OlAZkzY");
    
        // Récupération du mot de passe hashé dans la base de données
        $query = "SELECT mot_de_passe FROM utilisateur WHERE adresse_email = :adresse_email";
        $statement = $conn->prepare($query);
        $statement->bindParam(':adresse_email', $adresseEmail, PDO::PARAM_STR);
        $statement->execute();
    
        // Vérification si l'utilisateur existe
        if ($statement->rowCount() > 0) {
            // Récupérer le mot de passe hashé de l'utilisateur
            $motDePasseStocker = $statement->fetchColumn();
            error_log("Mot de passe stocké : " . $motDePasseStocker);
    
            // Vérification du mot de passe avec password_verify
            if (password_verify($motDePasse, $motDePasseStocker)) {
                $erreur["reussi"] = true;
            } else {
                $erreur["reussi"] = false;
                $erreur["message"] = "Mot de passe incorrect";
            }
        } else {
            $erreur["reussi"] = false;
            $erreur["message"] = "Aucun utilisateur trouvé avec cette adresse email";
        }
    } catch (PDOException $e) {
        // Log de l'erreur
        error_log("Erreur de connexion à la base de données : " . $e->getMessage());
        $erreur["reussi"] = false;
        $erreur["message"] = "Erreur de connexion à la base de données : " . $e->getMessage();
    }

    echo json_encode($erreur);

    
?>
