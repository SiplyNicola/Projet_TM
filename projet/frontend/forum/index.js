$(function () {
    //Récupère toutes les catégories de la base de données et les affiche dans le menu de gauche sur la page d'accueil du forum
    $.ajax({
        url: "../../backend/api/categorie_get.php",
        type: "POST",
        dataType: "json",
        success: function (categorie) {
            $.each(categorie, function (index, reponse) {
                $('#choixCategorie').append(
                    $('<option>', {
                        value: reponse.id,
                        text: reponse.titre
                    })
                );
                $("#nav-categorie").append(
                    $("<a>")
                        .attr("href", "#")
                        .attr("id", reponse.id)
                        .addClass("list-group-item list-group-item-action categorie")
                        .text(reponse.titre)
                );
            });
        },
        error: function () {
            console.error("Erreur lors de la vérification de session");
        }
    });
});
$(document).ready(function () {
    afficherPublications(null); // Appel de la fonction pour afficher les publications

    // Lance la publication d'un post sur le forum
    $("#publicationForm").submit(async function(event) {
        // Désactiver le bouton de soumission pour éviter les soumissions multiples
        event.preventDefault(); // Empêche le rechargement de la page
        $('#btn_publication').prop('disabled', true);  // Désactive le bouton
        $(".erreur").html("");  // Efface les messages d'erreur précédents
    
        let latitude = null;
        let longitude = null;
    
        // Récupère les champs du formulaire
        var form_data = $(this).serialize();
        if ("geolocation" in navigator) {
			try {
				const position = await getCurrentPositionAsync(); // attend la géolocalisation
				latitude = position.coords.latitude;
				longitude = position.coords.longitude;
			} catch (error) {
				console.error("Erreur de géolocalisation :", error.message);
				// Tu peux aussi afficher une erreur à l'utilisateur ici si c'est bloquant
			}

			form_data += `&latitude=${encodeURIComponent(latitude)}&longitude=${encodeURIComponent(longitude)}`;
		}

    
        // Envoie AJAX
        $.ajax({
            url: "../../backend/forum/traitementPublication.php",
            method: "POST",
            data: form_data,
            dataType: "json",
            success: function(data_retour) {
                if (!data_retour.connecte) {
                    window.location.assign("../connexion/connexion.html");
                } else {
                    if (data_retour.reussi) {
                        $.ajax({
                            url: "../../backend/forum/insertPublication.php",
                            method: "POST",
                            data: form_data,
                            dataType: "json",
                            success: function(data) {
                                $(".erreur").html(data.message || "");
                                $('#publicationForm')[0].reset();
                                $('#btn_publication').prop('disabled', false);
                                location.reload();
                            },
                            error: function(xhr, status, error) {
                                console.error("Erreur AJAX :", status, error, xhr);
                            }
                        });
                    } else {
                        $('#btn_publication').prop('disabled', false);
                        $("#err_titre").html(data_retour.titre || "");
                        $("#err_contenu").html(data_retour.contenu || "");
                    }
                }
            },
            error: function(xhr, status, error) {
                console.error("Erreur AJAX :", status, error);
            }
        });
    });

    //Ajoute les classes active sur les catégories qui ont été cliquées
    $(document).on("click", ".categorie", function (event) {
        event.preventDefault();
    
        $(".categorie").removeClass("active");
        $(this).addClass("active");
    
        // Met à jour l'attribut personnalisé sur #nav-categorie
        let idCategorie = $(this).attr("id");
        $("#nav-categorie").attr("categorie-clique", idCategorie);

        let idCategorieClique = $("#nav-categorie").attr("categorie-clique");

        $("#zone-publications").children().each(function () {
            let idCategorieElement = $(this).attr("id_categorie");

            if (idCategorieClique == 0 || idCategorieElement == idCategorieClique) {
                $(this).removeClass("d-none");
            } else {
                $(this).addClass("d-none");
            }
        });

    });
    // Lance la publication d'un commentaire sur le forum
    $(document).on("submit", ".form-reponse", function (event) {
        event.preventDefault(); // Empêche l'envoi standard du formulaire

        const form = $(this);
        const contenu_commentaire = form.find("input[name='contenu_commentaire']").val();
        const id_publication = form.find("input[name='id_publication']").val();
        const erreur_span = form.find('.erreur-commentaire');
        
        $.ajax({
            url: "../../backend/forum/traitementCommentaire.php",
            type: "POST",
            dataType: "json",
            data: {
                contenu: contenu_commentaire,
            },
            success: function (response) {
                if(!response.connecte) {
                    window.location.assign("../connexion/connexion.html"); // Redirection vers la page de connexion
                } else {
                    if (response.success) {
                        // Requête AJAX pour ajouter le commentaire dans la base de données
                        $.ajax({
                            url: "../../backend/forum/insertCommentaire.php",
                            type: "POST",
                            dataType: "json",
                            data: {
                                contenu_commentaire: contenu_commentaire,
                                id_publication: id_publication
                            },
                            success: function (data) {
                                // Vide les inputs du formulaire
                                form[0].reset();
                                location.reload(); // Recharge la page pour afficher le nouveau commentaire
                            },
                            error: function (xhr, status, error) {
                                console.error("Erreur AJAX :", status, error);
                                console.log(xhr.responseText); // Affiche la réponse du serveur pour le débogage
                            }
                        });
                    } else {
                        erreur_span.text(response.message || "");
                    }
                }
            },
            error: function (xhr, status, error) {
                console.error("Erreur AJAX :", error);
            }
        });
    });
});


// Fonction pour obtenir la position actuelle de l'utilisateur
function getCurrentPositionAsync() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}
