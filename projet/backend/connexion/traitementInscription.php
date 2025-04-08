<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");
    
    $erreur = [
        "nom" => "",
        "prenom" => "",
        "nom_utilisateur" => "",
        "mail" => "",
        "mot_de_passe" => "",
        "reussi" => true
    ];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Vérifie si le nom est vide ou contient des caractères invalides
        if (empty($_POST["registerNom"])) {
            $erreur["nom"] = "Votre nom est nécessaire";
            $erreur["reussi"] = false;
        } else {
            $nom = test_input($_POST["registerNom"]);
            if (!preg_match("/^[\p{L}\s'-]+$/u", $nom)) {
                $erreur["nom"] = "Seuls les lettres et les espaces sont autorisés";
                $erreur["reussi"] = false;
            }
        }

        // Vérifie si le prénom est vide ou contient des caractères invalides
        if (empty($_POST["registerPrenom"])) {
            $erreur["prenom"] = "Votre prénom est nécessaire";
            $erreur["reussi"] = false;
        } else {
            $prenom = test_input($_POST["registerPrenom"]);
            if (!preg_match("/^[\p{L}\s'-]+$/u", $prenom)) {
                $erreur["prenom"] = "Seuls les lettres et les espaces sont autorisés";
                $erreur["reussi"] = false;
            }
        }

        // Vérifie si le nom d'utilisateur est valide
        if (empty($_POST["registerUsername"])) {
            $erreur["nom_utilisateur"] = "Vous avez besoin d'un nom d'utilisateur";
            $erreur["reussi"] = false;
        } else {
            $nomUtilisateur = test_input($_POST["registerUsername"]);
            if (!preg_match("/^[a-zA-Z0-9_]+$/", $nomUtilisateur)) {
                $erreur["nom_utilisateur"] = "Seuls les lettres, chiffres et underscore sont autorisés";
                $erreur["reussi"] = false;
            }
        }

        // Vérifie si l'adresse email est valide
        if (empty($_POST["registerEmail"])) {
            $erreur["mail"] = "Votre adresse email est nécessaire";
            $erreur["reussi"] = false;
        } else {
            $adresseEmail = test_input($_POST["registerEmail"]);
            if (!filter_var($adresseEmail, FILTER_VALIDATE_EMAIL)) {
                $erreur["mail"] = "Adresse email invalide";
                $erreur["reussi"] = false;
            }
        }

        // Vérifie si les mots de passe sont identiques et valides
        if (empty($_POST["registerPassword"])) {
            $erreur["mot_de_passe"] = "Le mot de passe est requis";
            $erreur["reussi"] = false;
        } elseif (empty($_POST["registerConfirmPassword"])) {
            $erreur["mot_de_passe"] = "Veuillez confirmer votre mot de passe";
            $erreur["reussi"] = false;
        } else {
            $motDePasse = test_input($_POST["registerPassword"]);
            $confirmMotDePasse = test_input($_POST["registerConfirmPassword"]);

            if ($motDePasse !== $confirmMotDePasse) {
                $erreur["mot_de_passe"] = "Les mots de passe ne correspondent pas";
                $erreur["reussi"] = false;
            } elseif (strlen($motDePasse) < 8) {
                $erreur["mot_de_passe"] = "Le mot de passe doit contenir au moins 8 caractères";
                $erreur["reussi"] = false;
            }
        }

        // Si aucune erreur n'est présente, on vérifie le pseudo et l'email dans la base de données
        if ($erreur["reussi"]) {
            try {
                $pdo = pdo_connectDB("127.0.0.1","3308", "db_projet_tm", "userProjet", "wNcEaRvH3OlAZkzY");
                $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
                // Préparation de la requête pour vérifier le pseudo et l'email
                $stmt = $pdo->prepare("SELECT pseudo, adresse_email FROM utilisateur WHERE pseudo = :pseudo OR adresse_email = :email");
                $stmt->execute([
                    'pseudo' => $nomUtilisateur,
                    'email' => $adresseEmail
                ]);
    
                // Vérifier les résultats
                $utilisateur = $stmt->fetch(PDO::FETCH_ASSOC);
    
                if ($utilisateur) {
                    // Si le pseudo existe déjà
                    if ($utilisateur['pseudo'] === $nomUtilisateur) {
                        $erreur["nom_utilisateur"] = "Ce nom d'utilisateur est déjà pris";
                        $erreur["reussi"] = false;
                    }
    
                    // Si l'email existe déjà
                    if ($utilisateur['adresse_email'] === $adresseEmail) {
                        $erreur["mail"] = "Cette adresse email est déjà utilisée";
                        $erreur["reussi"] = false;
                    }
                }
            } catch (PDOException $e) {
                $erreur["reussi"] = false;
                $erreur["message"] = "Erreur serveur lors de la vérification : " . $e->getMessage();
            }
        }

        // Retour des erreurs ou réussite
        echo json_encode($erreur);
    }

    // Fonction permettant de transformer les caractères spéciaux pour éviter les attaques
    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
?>
