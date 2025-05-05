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
});

function afficherPublications() {
    //Récupère toutes les publications de la base de données et les affiche sur la page d'accueil du forum
    $.ajax({
        url: "../../backend/forum/recupererPublications.php",
        type: "POST",
        dataType: "json",
        success: function (publications) {
            console.log(publications);
            $.each(publications.publication, function (index, reponse) {
                console.log(reponse)
                moment.locale('fr'); // Définit la locale à 'fr' pour le formatage de la date
                $('#zone-publications').append(
                    $('<div>').append(
                      $('<div>', { class: 'card shadow-sm border-0' }).append(
                        $('<div>', { class: 'card-body' }).append(
                          $('<h5>', { class: 'card-title fw-bold', text: reponse.titre }),
                          $('<h6>', { class: 'card-subtitle mb-2', text: moment(reponse.date_publication).format("D MMMM YYYY, HH[h]mm") }),
                          $('<p>', { class: 'card-text mt-3', text: reponse.contenu }),
                          $('<footer>', { class: 'blockquote-footer mt-2', text: 'Publié par : ' + reponse.pseudo }),
                  
                          // Zone commentaires avec id unique
                          $('<div>', {
                            class: 'zone-commentaires mt-4',
                            id: 'commentaires-' + reponse.id
                          }),
                  
                          // Zone de réponse
                          $('<div>', { class: 'input-group mt-4' }).append(
                            $('<input>', {
                              type: 'text',
                              class: 'form-control',
                              placeholder: 'Répondre à cette publication',
                              'aria-label': 'Répondre'
                            }),
                            $('<button>', {
                              class: 'btn btn-outline-secondary',
                              type: 'button',
                              text: 'Répondre'
                            })
                          )
                        )
                      )
                    )
                  );
                  
                  
                  
            });
        },
        error: function () {
            console.error("Erreur lors de la vérification de session");
        }
    });
}