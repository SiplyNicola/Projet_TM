$(function() {
    $.ajax({
        url: "../../backend/forum/recupererInfoUtilisateur.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            if (!response.connecte) {
                alert("Vous devez être connecté pour accéder à cette page.");
                window.location.assign("../forum/index.html"); // Redirection vers la page de connexion
            }
        },
        error: function () {
            console.error("Erreur lors de la vérification de session");
        }
    });
})