<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");
    
    $erreur = [
        "titre" => "",
        "contenu" => "",
        "reussi" => true,
        "connecte" => true
    ];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Vérifie si l'utilisateur est connecté
        session_start();
        if (!isset($_SESSION["id"])) {
            $erreur["connecte"] = false;
            $erreur["reussi"] = false;
            echo json_encode($erreur);
            return;
        }
        session_write_close();
        // Vérifie si le titre est vide ou contient des caractères invalides
        if (empty($_POST["titre"])) {
            $erreur["titre"] = "Le titre est nécessaire";
            $erreur["reussi"] = false;
        } else {
            $titre = test_input($_POST["titre"]);
            if (!preg_match('/^[\p{L}\p{N}\p{P}\p{S}\s]*$/u', $titre)) {
                $erreur["titre"] = "Caractères invalides dans le titre";
                $erreur["reussi"] = false;
            }
            
        }

        // Vérifie si le contenu est vide
        if (empty($_POST["contenu"])) {
            $erreur["contenu"] = "Le contenu est nécessaire";
            $erreur["reussi"] = false;
        } else {
            $contenu = test_input($_POST["contenu"]);
            if (!preg_match('/^[\p{L}\p{N}\p{P}\p{S}\s]*$/u', $titre)) {
                $erreur["contenu"] = "Caractères invalides dans le contenu";
                $erreur["reussi"] = false;
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
