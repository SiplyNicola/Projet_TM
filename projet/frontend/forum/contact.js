$(document).ready(function() {
    // Lance l'envoi du message depuis le formulaire de contact
    $("#contactForm").submit(function(event){
        event.preventDefault();

        // Efface les éventuels messages d'erreur précédents
        $(".erreur").html("");
        var form_data = $(this).serialize(); // Récupère toutes les données du formulaire

        // Envoie une requête AJAX pour valider les données côté serveur (Vérifier les entrées de l'utilisateur)
        $.ajax({
            url: "../../backend/forum/traitementContact.php", // Script de traitement des erreurs
            method: "POST",
            data: form_data,
            dataType: "json",

            // Si les données sont valides (aucune erreur côté serveur)
            success: function(data_retour) {
                console.log(data_retour); // Affiche la réponse du serveur dans la console pour le débogage
                if (data_retour.reussi) {
                    // Deuxième requête AJAX : on insère les données dans la base de données si tout est bon
                    $.ajax({
                        url: "../../backend/forum/sendmail.php",
                        method: "POST",
                        data: form_data,
                        dataType: "json",
                        success: function(data) {
                            // Réinitialise le formulaire après envoi réussi
                            $('#contactForm')[0].reset();
                            $('#confirmationMessage').show();
                        },
                        error: function (xhr, status, error) {
                            console.error("Erreur AJAX :", status, error);
                            console.log("Réponse serveur :", xhr.responseText);
                        }
                    });
                } else {
                    // Affichage des erreurs spécifiques pour chaque champ (si présentes)
                    $("#err_nom").html(data_retour.nom || "");
                    $("#err_mail").html(data_retour.mail || "");
                    $("#err_message").html(data_retour.message || "");
                    $("#err_consentement").html(data_retour.consentement || "");
                }
            },

            // En cas d'erreur technique lors de l'envoi AJAX
            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            },
        });
    });
});