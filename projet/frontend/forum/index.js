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
    afficherPublications(); // Appel de la fonction pour afficher les publications

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

async function afficherPublications() {
    $('#zone-publications').empty();
    $idCategorie = $("#nav-categorie").attr("categorie-clique"); 
    //Récupère toutes les publications de la base de données et les affiche sur la page d'accueil du forum
    $.ajax({
        url: "../../backend/forum/recupererPublications.php",
        type: "POST",
        dataType: "json",
        success: async function (publications) {
            moment.locale('fr'); // Définit la locale à 'fr'
            if (!publications || !publications.publication || publications.publication.length === 0) {
                return;
            }
            

            for (let reponse of publications.publication) {
                let ville = null;

                if (reponse.latitude && reponse.longitude) {
                    try {
                        ville = await getCityNameFromCoords(reponse.latitude, reponse.longitude);
                    } catch (e) {
                        console.warn("Erreur de localisation pour la publication ID", reponse.id, e);
                    }
                }

                // Ajout de la publication dans le DOM
                $('#zone-publications').append(
                    $('<div>', { class: "publication-card", id_categorie:reponse.id_categorie}).append(
                        $('<div>', { class: 'card shadow-sm border-0' }).append(
                            $('<div>', { class: 'card-body' }).append(
                                $('<h5>', { class: 'card-title fw-bold', text: reponse.titre }),
                                $('<h6>', {
                                    class: 'card-subtitle mb-2',
                                    text: moment(reponse.date_publication).format("D MMMM YYYY, HH[h]mm") + (ville ? " - " + ville : "")
                                }),
                                $('<p>', { class: 'card-text mt-3', text: reponse.contenu }),
                                $('<footer>', { class: 'blockquote-footer mt-2', text: 'Publié par : ' + reponse.pseudo }),

                                // Zone commentaires
                                $('<div>', { class: 'zone-commentaires mt-4' }).append(
                                    $('<p>', {
                                        class: 'fw-bold mb-2',
                                        text: reponse.commentaires.length + ' commentaire' + (reponse.commentaires.length > 1 ? 's' : '')
                                    }),
                                    reponse.commentaires && reponse.commentaires.length > 0
                                        ? $.map(reponse.commentaires, function (commentaire) {
                                            return $('<div>', { class: 'card border-0 shadow-sm mb-2' }).append(
                                                $('<div>', { class: 'card-body py-2 px-3' }).append(
                                                    $('<p>', { class: 'card-text mb-1', text: commentaire.contenu }),
                                                    $('<footer>', {
                                                        class: 'blockquote-footer mt-2',
                                                        text: 'Par ' + commentaire.pseudo + ' le ' +
                                                            moment(commentaire.date_commentaire).format("D MMM YYYY à HH:mm")
                                                    })
                                                )
                                            );
                                        })
                                        : $('<p>', { class: 'fst-italic', text: 'Aucun commentaire pour cette publication.' })
                                ),

                                $('<form>', {
                                    class: 'form-reponse',
                                    method: 'post',
                                }).append(
                                    $('<div>', { class: 'input-group mt-4' }).append(
                                        $('<input>', {
                                            type: 'text',
                                            class: 'form-control',
                                            name: 'contenu_commentaire',
                                            placeholder: 'Répondre à cette publication',
                                            'aria-label': 'Répondre',
                                        }),
                                        $('<input>', {
                                            type: 'hidden',
                                            name: 'id_publication',
                                            value: reponse.id
                                        }),
                                        $('<button>', {
                                            class: 'btn btn-outline-secondary reponse-btn',
                                            type: 'submit',
                                            text: 'Répondre'
                                        })
                                    ),
                                    $('<span>', {
                                        class: 'text-danger mt-1 d-block erreur-commentaire',
                                        text: '',
                                        css: "color: red;"
                                    })
                                )
                            )
                        )
                    )
                );

                // Ajout d'un petit délai pour éviter un trop grand nombre de requêtes simultanées
                await new Promise(resolve => setTimeout(resolve, 100)); // délai de 100ms entre chaque publication
            }
        },
        error: function () {
            console.error("Erreur lors de la vérification de session");
        }
    });
}


// Fonction pour obtenir la position actuelle de l'utilisateur
function getCurrentPositionAsync() {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
}

// Fonction pour obtenir le nom de la ville à partir des coordonnées
async function getCityNameFromCoords(latitude, longitude) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`;

    const response = await fetch(url, {
        headers: {
            'User-Agent': '4umForum/1.0 (la228910@student.helha.be)'
        }
    });

    if (!response.ok) {
        throw new Error("Erreur lors de la récupération de la localisation");
    }

    const data = await response.json();

    // Affiche la ville si elle est disponible
    return data.address.village || data.address.town || data.address.city || data.address.country || null;
}
