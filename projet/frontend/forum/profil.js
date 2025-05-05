$(document).ready(function () {
    // Chargement du profil
    $.ajax({
      url: '../../backend/forum/recupererInfoUtilisateur.php',
      method: 'POST',
      dataType: 'json',
      success: function (data) {
        if (data.connecte) {
          $('#user-pseudo').text(data.pseudo);
          $('#nb-abonnes').text(data.abonnes);
          $('#nb-abonnements').text(data.abonnements);
        }
      },
      error: function (xhr, status, error) {
        console.error("Erreur de chargement du profil:", status, error);
        alert("Erreur de chargement du profil.");
      }
    });
  });