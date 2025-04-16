$(function () {
    console.log(document);
    $.ajax({
        url: "../../backend/forum/recupererInfoUtilisateur.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.connecte) {
                $("#connexion").text("Se déconnecter");
                $("#profil").show();
                if(response.role === "admin"){
                    $("#admin").show();
                }
            } else {
                $("#profil").hide();
                $("#admin").hide();
                $("#connexion").text("Se connecter / S'inscrire");
            }
        },
        error: function () {
            console.error("Erreur lors de la vérification de session");
        }
    });
});

$(document).ready(function() {
    $("#connexion").click(function(event) {
        event.preventDefault();

        $.ajax({
            url: "../../backend/forum/recupererInfoUtilisateur.php",
            method: "POST",
            dataType: "json",
            success: function(data_retour) {
                if (data_retour.connecte) {
                    $.ajax({
                        url: "../../backend/forum/deconnexion.php",
                        method: "POST",
                        dataType: "json",
                        success: function(data) {
                            window.location.assign("./index.html"); // Redirection vers la page d'accueil
                        },
                        error: function(xhr, status, error) {
                            console.error("Erreur AJAX :", status, error);
                        }
                    });
                } else {
                    window.location.assign("../connexion/connexion.html");
                }
            },
            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            }
        });
    });
});
