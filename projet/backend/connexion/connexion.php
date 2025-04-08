<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");

    $erreur = [
        "reussi" => true,
        "message" => ""
    ];

    $adresseEmail = $_POST["loginEmail"];
    $motDePasse = $_POST["loginMotDePasse"];
    // Variable qui contiendra le mot de passe hashé récupéré de la base
    $motDePasseStocker = ""; 

    try {
        // Connexion à la base de données 
        $conn = pdo_connectDB("127.0.0.1","3306", "db_projet_tm", "utilisateurProjet", "wNcEaRvH3OlAZkzY");
    
        // Préparation de la requête SQL pour récupérer le mot de passe hashé de l'utilisateur
        $query = "SELECT mot_de_passe FROM utilisateur WHERE adresse_email = :adresse_email";
        $statement = $conn->prepare($query);
        $statement->bindParam(':adresse_email', $adresseEmail, PDO::PARAM_STR);
        $statement->execute();
    
        // Vérifie si un utilisateur a été trouvé avec cette adresse e-mail
        if ($statement->rowCount() > 0) {
            // Récupération du mot de passe hashé stocké dans la base
            $motDePasseStocker = $statement->fetchColumn();
            error_log("Mot de passe stocké : " . $motDePasseStocker); // Log (pour debug)
    
            // Vérifie si le mot de passe saisi correspond au mot de passe hashé
            if (password_verify($motDePasse, $motDePasseStocker)) {
                // Mot de passe correct
                $erreur["reussi"] = true;
            } else {
                // Mot de passe incorrect
                $erreur["reussi"] = false;
                $erreur["message"] = "Mot de passe incorrect";
            }
        } else {
            // Aucun utilisateur trouvé avec cette adresse e-mail
            $erreur["reussi"] = false;
            $erreur["message"] = "Aucun utilisateur trouvé avec cette adresse email";
        }
    } catch (PDOException $e) {
        error_log("Erreur de connexion à la base de données : " . $e->getMessage());
        $erreur["reussi"] = false;
        $erreur["message"] = "Erreur de connexion à la base de données : " . $e->getMessage();
    }

    echo json_encode($erreur);
?>
