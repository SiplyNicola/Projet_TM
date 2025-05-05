<?php
    header('Content-Type: application/json; charset=utf-8');
    include("../connect.php");

    $response = [
        "message" => "",
        "success" => true,
        "connecte" => true
    ];

    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        session_start();
        if (!isset($_SESSION["id"])) {
            $response["connecte"] = false;
            $response["success"] = false;
            echo json_encode($response);
            return;
        }
        session_write_close();

        if (empty($_POST["contenu"])) {
            $response["success"] = false;
            $response["message"] = "Le commentaire est vide.";
            echo json_encode($response);
            return;
        }

        $contenu = test_input($_POST["contenu"]);

        // Ajoute une vérification de caractères valides
        if (!preg_match('/^[\p{L}\p{N}\s.,!?\'"-]+$/u', $contenu)) {
            $response["success"] = false;
            $response["message"] = "Caractères invalides dans le commentaire.";
            echo json_encode($response);
            return;
        }

        echo json_encode($response);
    }

    function test_input($data) {
        $data = trim($data);
        $data = stripslashes($data);
        $data = htmlspecialchars($data);
        return $data;
    }
?>
