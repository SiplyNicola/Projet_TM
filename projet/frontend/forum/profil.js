$(document).ready(function () {
  // Chargement du profil
  const pseudo = getParameterByName('pseudo');
  
  if (pseudo === null) {
      $.ajax({
          url: '../../backend/forum/recupererInfoUtilisateur.php',
          method: 'POST',
          dataType: 'json',
          success: function (data) {
              if (data.connecte) {
                  $('#user-pseudo').text(data.pseudo);
                  afficherPublications(data.id)
              } else {
                  window.location.assign("../connexion/connexion.html"); // Redirection vers la page de connexion
              }
          },
          error: function (xhr, status, error) {
              console.error("Erreur de chargement du profil:", status, error);
              alert("Erreur de chargement du profil.");
          }
      });
  } else {
      $.ajax({
          url: '../../backend/forum/recupererUtilisateur.php', // Le fichier PHP qui récupère l'ID de l'utilisateur
          method: 'POST',
          data: {
              pseudo: pseudo // Envoi du pseudo dans les données
          },
          dataType: 'json',
          success: function (data) {
              if (data.success) {
                  $('#user-pseudo').text(pseudo);
                  afficherPublications(data.id_utilisateur);
              } else {
                window.location.assign("index.html"); // Redirection vers la page d'accueil
              }
          },
          error: function (xhr, status, error) {
              console.error("Erreur de récupération de l'ID de l'utilisateur:", status, error);
              alert("Erreur de récupération de l'ID.");
          }
      });
  }
});


function getParameterByName(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

