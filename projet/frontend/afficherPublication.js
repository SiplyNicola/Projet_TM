async function afficherPublications(id) {
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

                if(id === reponse.id_utilisateur || id === null) {
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
                                    $('<footer>', { 
                                        class: 'blockquote-footer mt-2', 
                                        html: 'Publié par : <a href="profil.html?pseudo=' + reponse.pseudo + '" class="text-decoration-none">' + reponse.pseudo + '</a>' 
                                    }),
                                    
                                    

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
            }
        },
        error: function () {
            console.error("Erreur lors de la vérification de session");
        }
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