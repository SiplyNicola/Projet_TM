$(function() {
    $.ajax({
        url: "../../backend/forum/recupererInfoUtilisateur.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (response.banni === 1) {
                // window.location.assign("../forum/bannissement.html?raison="+response.raison_bannissement); // Redirection vers la page de connexion
            }
        },
        error: function () {
            console.error("Erreur lors de la vérification de session");
        }
    });
})