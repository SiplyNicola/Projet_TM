<?php
header('Content-Type: text/html; charset=utf-8');
include("../connect.php");

// Récupération des données du formulaire
$nom = $_POST["registerNom"];
$prenom = $_POST["registerPrenom"];
$pseudo = $_POST["registerUsername"];
$adresseEmail = $_POST["registerEmail"];
$motDePasse = password_hash($_POST["registerPassword"], PASSWORD_BCRYPT);
$role = "utilisateur";

try {    
    // Connexion à la base de données via la fonction pdo_connectDB()
    $conn = pdo_connectDB("127.0.0.1","3308", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");

    // 1. Insertion dans la table `utilisateur`
    $query = "INSERT INTO utilisateur(nom, prenom, pseudo, adresse_email, mot_de_passe, role) 
              VALUES (:nom, :prenom, :pseudo, :adresse_email, :mot_de_passe, :role)";
    $statement = $conn->prepare($query);
    
    // Liaison des paramètres avec les variables
    $statement->bindParam(':nom', $nom, PDO::PARAM_STR);
    $statement->bindParam(':prenom', $prenom, PDO::PARAM_STR);
    $statement->bindParam(':pseudo', $pseudo, PDO::PARAM_STR);
    $statement->bindParam(':adresse_email', $adresseEmail, PDO::PARAM_STR);
    $statement->bindParam(':mot_de_passe', $motDePasse, PDO::PARAM_STR);
    $statement->bindParam(':role', $role, PDO::PARAM_STR);
    
    // Exécution de la requête
    $statement->execute();

    // Affichage du nombre de lignes insérées
    echo ($statement->rowCount() . " record(s) inséré(s)");
} 
catch (PDOException $e) {
    echo "Erreur : " . $e->getMessage();
}
?>
