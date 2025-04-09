$(function () {
    $.ajax({
        url: "../../backend/forum/verifierConnexion.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.connecte) {
                $("#connexion").text("Se déconnecter");
            } else {
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
            url: "../../backend/forum/verifierConnexion.php",
            method: "POST",
            dataType: "json",
            success: function(data_retour) {
                if (data_retour.connecte) {
                    $.ajax({
                        url: "../../backend/forum/deconnexion.php",
                        method: "POST",
                        dataType: "json",
                        success: function(data) {
                            console.log(data.message);
                            window.location.href = "./index.html"; // Redirection vers la page d'accueil
                        },
                        error: function(xhr, status, error) {
                            console.error("Erreur AJAX :", status, error);
                        }
                    });
                } else {
                    window.location.href = "../connexion/connexion.html";
                }
            },
            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            }
        });
    });
});
