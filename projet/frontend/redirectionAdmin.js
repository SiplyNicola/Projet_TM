$(function() {
    $.ajax({
        url: "../../backend/forum/recupererInfoUtilisateur.php",
        type: "POST",
        dataType: "json",
        success: function (response) {
            console.log(response);
            if (!response.connecte && response.role !== "admin") {
                alert("Vous ne faites pas partie de l'équipe d'administrateur.");
                window.location.assign("../forum/index.html"); // Redirection vers la page de connexion
            }
        },
        error: function () {
            console.error("Erreur lors de la vérification de session");
        }
    });
})