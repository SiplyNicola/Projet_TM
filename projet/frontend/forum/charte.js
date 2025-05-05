$(document).ready(function() {
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