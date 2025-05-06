<?php
    header('Content-Type: application/json; charset=utf-8');
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);

    // S'assurer que la requête est bien en POST
    if ($_SERVER['REQUEST_METHOD'] === 'POST') {
        // Récupération et nettoyage des données
        $nom     = $_POST['nom'];
        $email   = $_POST['email'];
        $message = $_POST['message'];


        // Sujet et contenu de l'email
        $sujet = "Confirmation de votre message - 4UM";
        $contenu = "Bonjour $nom,\n\n";
        $contenu .= "Merci pour votre message envoyé via notre site 4UM.\n\n";
        $contenu .= "Voici un récapitulatif de votre demande :\n";
        $contenu .= "-----------------------------------------\n";
        $contenu .= "Nom : $nom\n";
        $contenu .= "Email : $email\n";
        $contenu .= "Message :\n$message\n";
        $contenu .= "-----------------------------------------\n\n";
        $contenu .= "Nous reviendrons vers vous dès que possible.\n\n";
        $contenu .= "Cordialement,\nL'équipe 4UM";

        // En-têtes de l'e-mail
        $headers = "From: noreply@student.helha.be\r\n";
        $headers .= "Reply-To: la228910@student.helha.be\r\n";
        $headers .= "Content-Type: text/plain; charset=UTF-8";

        // Envoi de l'e-mail
        $success = mail($email, $sujet, $contenu, $headers);

        if ($success) {
            echo json_encode([
                "status" => "success",
                "message" => "Message envoyé avec succès."
            ]);
        } else {
            http_response_code(500); // Erreur serveur
            echo json_encode([
                "status" => "error",
                "message" => "Échec de l'envoi du message."
            ]);
        }
    }
?>
