$(function() {
    // Vérifie si l'utilisateur est connecté et ajuste le visuel si c'est le cas ou non
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
    // Lance la connexion de l'utilisateur depuis le formulaire de connexion
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

    //Ajoute les classes active sur les catégories qui ont été cliquées
    $(document).on("click", ".categorie", function(event) {
        event.preventDefault();
    
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(".categorie").removeClass("active");
            $(this).addClass("active");
        }
    });

    // Lance la publication d'un post sur le forum
    $("#publicationForm").submit(function(event) {
        event.preventDefault(); // Empêche le rechargement de la page
        $(".erreur").html(""); // Efface les messages d'erreur précédents
        var form_data = $(this).serialize(); // Récupère les champs du formulaire

        // Requête AJAX vers le script de publication
        $.ajax({
            url: "../../backend/forum/traitementPublication.php", // Script backend pour la publication
            method: "POST",
            data: form_data,
            dataType: "json",
            success: function(data_retour) {
                if(!data_retour.connecte) {
                    window.location.assign("../connexion/connexion.html"); // Redirection vers la page de connexion
                } else {
                    if (data_retour.reussi) {
                        // Requête AJAX pour ajouter la publication dans la base de données
                        $.ajax({
                            url: "../../backend/forum/insertPublication.php",
                            method: "POST",
                            data: form_data,
                            dataType: "json",
                            success: function(data) {
                                console.log(data);
                                // Vide les inputs du formulaire
                                $(".erreur").html(data.message || "");
                                $('#publicationForm')[0].reset();
                                
                            },
                            error: function(xhr, status, error) {
                                console.error("Erreur AJAX :", status, error, xhr);
                            }
                        });
                    } else {
                        console.log(data_retour);
                        // Affichage des erreurs spécifiques pour chaque champ (si présentes)
                        $("#err_titre").html(data_retour.titre || "");
                        $("#err_contenu").html(data_retour.contenu || "");
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            },
        });
    });

    // Affiche une alerte lorsque l'utilisateur coche la case d'acceptation de la charte
    $('#acceptCharter').change(function () {
        if ($(this).is(':checked')) {
          alert("Merci pour votre engagement ! Vous contribuez à faire de 4UM un espace respectueux pour tous.");
        }
      });

      $('#contactForm').submit(function(e) {
        e.preventDefault();
        $('#confirmationMessage').show();
        this.reset();
      });
});