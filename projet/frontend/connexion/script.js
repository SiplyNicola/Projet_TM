$(document).ready(function() {
    // Lance l'inscription de la personne depuis le formulaire d'inscription
    $("#inscriptionForm").submit(function(event){
        event.preventDefault();

        // Efface les éventuels messages d'erreur précédents
        $(".erreur").html("");
        var form_data = $(this).serialize(); // Récupère toutes les données du formulaire

        // Envoie une requête AJAX pour valider les données côté serveur (Vérifier les entrées de l'utilisateur)
        $.ajax({
            url: "../../backend/connexion/traitementInscription.php", // Script de traitement des erreurs
            method: "POST",
            data: form_data,
            dataType: "json",

            // Si les données sont valides (aucune erreur côté serveur)
            success: function(data_retour) {
                if (data_retour.reussi) {
                    // Deuxième requête AJAX : on insère les données dans la base de données si tout est bon
                    $.ajax({
                        url: "../../backend/connexion/insertInscription.php",
                        method: "POST",
                        data: form_data,
                        dataType: "text",
                        success: function(data) {
                            // Réinitialise le formulaire après inscription réussie
                            $('#inscriptionForm')[0].reset();

                            // Permets de repasser automatiquement sur le menu de connexion
                            $('#login-tab').addClass('active');
                            $('#register-tab').removeClass('active');

                            $('#login').addClass('show active');
                            $('#register').removeClass('show active');

                            $('#register').removeClass('active');
                            $('#login').addClass('active');

                            // Met à jour les attributs ARIA
                            $('#login-tab').attr('aria-selected', 'true');
                            $('#register-tab').attr('aria-selected', 'false');
                            
                        }
                    });
                } else {
                    // Affichage des erreurs spécifiques pour chaque champ (si présentes)
                    $("#err_nom").html(data_retour.nom || "");
                    $("#err_prenom").html(data_retour.prenom || "");
                    $("#err_nom_utilisateur").html(data_retour.nom_utilisateur || "");
                    $("#err_adresse_email").html(data_retour.mail || "");
                    $("#err_mot_de_passe_incorrect").html(data_retour.mot_de_passe || "");
                }
            },

            // En cas d'erreur technique lors de l'envoi AJAX
            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            },
        });
    });

    // Lance la connexion de l'utilisateur depuis le formulaire de connexion
    $("#connexionForm").submit(function(event){
        event.preventDefault();
        // Efface les messages d'erreur précédents
        $(".erreur").html("");
        var form_data = $(this).serialize(); // Récupère les champs du formulaire

        // Requête AJAX vers le script de connexion
        $.ajax({
            url: "../../backend/connexion/connexion.php", // Script backend pour la connexion
            method: "POST",
            data: form_data,
            dataType: "json",

            success: function(data_retour) {
                // Si les identifiants sont valides
                if (data_retour.reussi) {
                    window.location.assign("../forum/index.html"); // Redirection vers la page d'accueil
                } else {
                    // Affiche le message d'erreur renvoyé par le serveur
                    $("#err_connexion").html(data_retour.message || "");
                    console.log(data_retour);
                }
            },

            // En cas de problème avec la requête
            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            },
        });
    });
});
