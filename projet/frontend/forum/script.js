$(document).ready(function() {
    $("#connexion").click(function(event) {
        event.preventDefault();

        if ($("#connexion").text() === "Se déconnecter") {
            window.location.href = "../../backend/connexion/deconnexion.php"; // Redirection vers le script de déconnexion
        } else {
            // Sinon, on redirige vers la page de connexion
            window.location.href = "../connexion/connexion.html"; // Redirection vers la page de connexion
        }
    });
});
