$(document).ready(function() {
    $("#inscriptionForm").submit(function(event){
        event.preventDefault(); // Désactive l'envoi classique

        $(".erreur").html(""); // Nettoie les erreurs précédentes
        var form_data = $(this).serialize(); // Récupère tous les champs

        $.ajax({
            url: "../../backend/connexion/traitementInscription.php",
            method: "POST",
            data: form_data,
            dataType: "json",

            success: function(data_retour) {
                if (data_retour.reussi) {
                    alert("Vous avez été correctement inscrit !");
                    $.ajax({
                        url:"../../backend/connexion/insertInscription.php",
                        method:"POST",
                        data:form_data,
                        dataType:"text",
                        success:function(data)
                        {
                            $('#inscriptionForm')[0].reset();
                            alert("Inscription terminée !");
                        }
                       });
                } else {
                    $("#err_nom").html(data_retour.nom || "");
                    $("#err_prenom").html(data_retour.prenom || "");
                    $("#err_nom_utilisateur").html(data_retour.nom_utilisateur || "");
                    $("#err_adresse_email").html(data_retour.mail || "");
                    $("#err_mot_de_passe_incorrect").html(data_retour.mot_de_passe || "");
                }
            },

            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            },

            complete: function() {
                console.log("Requête terminée");
            }
        });
    });

    $("#connexionForm").submit(function(event){
        event.preventDefault(); // Désactive l'envoi classique

        $(".erreur").html(""); // Nettoie les erreurs précédentes
        var form_data = $(this).serialize(); // Récupère tous les champs

        console.log("Envoi des données :", form_data);

        $.ajax({
            url: "../../backend/connexion/connexion.php",
            method: "POST",
            data: form_data,
            dataType: "json",

            success: function(data_retour) {
                if(data_retour.reussi) {
                    alert("Vous vous êtes connecté avec succès !")
                } else {
                    $("#err_connexion").html(data_retour.message || "");
                }
            },

            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            },

            complete: function() {
                console.log("Requête terminée");
            }
        });
    });
});
