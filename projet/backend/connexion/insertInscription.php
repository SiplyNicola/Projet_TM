<?php
header('Content-Type: text/html; charset=utf-8');
include("../connect.php");

$nom = test_input($_POST["inscriptionNom"]);
$prenom = test_input($_POST["inscriptionPrenom"]);
$pseudo = test_input($_POST["inscriptionNomUtilisateur"]);
$adresseEmail = test_input($_POST["inscriptionAdresseMail"]);
// Hash du mot de passe pour l'insérer dans la db
$motDePasse = password_hash($_POST["inscriptionMotDePasse"], PASSWORD_BCRYPT);
$role = "utilisateur";

try {
    // Connexion à la base de données
    $conn = pdo_connectDB("127.0.0.1", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");

    // Démarre une transaction
    $conn->beginTransaction();

    // Préparation de la requête
    $query = "INSERT INTO utilisateur(nom, prenom, pseudo, adresse_email, mot_de_passe, role) 
              VALUES (:nom, :prenom, :pseudo, :adresse_email, :mot_de_passe, :role)";
    
    $statement = $conn->prepare($query);

    // Liaison des paramètres avec les données 
    $statement->bindParam(':nom', $nom, PDO::PARAM_STR);
    $statement->bindParam(':prenom', $prenom, PDO::PARAM_STR);
    $statement->bindParam(':pseudo', $pseudo, PDO::PARAM_STR);
    $statement->bindParam(':adresse_email', $adresseEmail, PDO::PARAM_STR);
    $statement->bindParam(':mot_de_passe', $motDePasse, PDO::PARAM_STR);
    $statement->bindParam(':role', $role, PDO::PARAM_STR);

    // Exécution de la requête d'insertion
    $statement->execute();

    // Si tout s'est bien passé, on valide la transaction
    $conn->commit();
} 
catch (PDOException $e) {
    // En cas d'erreur, on annule la transaction
    $conn->rollBack();
    echo "Erreur : " . $e->getMessage();
}

// Fonction de nettoyage des données utilisateur pour éviter les injections XSS
function test_input($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}
?>
