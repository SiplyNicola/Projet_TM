$(document).ready(function () {
  // Chargement du profil
  const pseudo = getParameterByName('pseudo');
  
  if (pseudo === null) {
      $.ajax({
          url: '../../backend/forum/recupererInfoUtilisateur.php',
          method: 'POST',
          dataType: 'json',
          success: function (data) {
            console.log(data);  
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
            console.log(data);  
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

  $(document).on("click", "#btnActionBannissement", function (event) {
    event.preventDefault();
  
    $.ajax({
      url: "../../backend/forum/recupererInfoUtilisateur.php",
      type: "POST",
      dataType: "json",
      success: function (sessionData) {
        if (!sessionData.connecte || sessionData.role !== "admin") return;
  
        
  
        const urlParams = new URLSearchParams(window.location.search);
        const pseudoCible = urlParams.get("pseudo");

  
        if (!pseudoCible || sessionData.pseudo === pseudoCible) return;

        $.ajax({
          url: "../../backend/forum/get_utilisateur.php",
          type: "POST",
          data: { pseudo: pseudoCible },
          dataType: "json",
          success: function (userData) {
            if (!userData.success) return;
  
            const banni = userData.utilisateur.banni;
            const raison = userData.utilisateur.raison_bannissement;
  
            const bouton = $("#btnActionBannissement");
  
            if (banni === 1) {
              if (confirm("Confirmez-vous le débannissement ?")) {
                $.ajax({
                  url: "../../backend/forum/debannir_utilisateur.php",
                  type: "POST",
                  data: { pseudo: pseudoCible },
                  dataType: "json",
                  success: function (res) {
                    alert(res.message);
                    if (res.success) location.reload();
                  }
                });
              }
            } else {
              const motif = prompt("Indiquez la raison du bannissement :");
              if (motif && confirm("Confirmez-vous le bannissement ?")) {
                $.ajax({
                  url: "../../backend/forum/bannir_utilisateur.php",
                  type: "POST",
                  data: {
                    pseudo: pseudoCible,
                    raison: motif
                  },
                  dataType: "json",
                  success: function (res) {
                    alert(res.message);
                    if (res.success) location.reload();
                  }
                });
              }
            }
          }
        });
      },
      error: function (xhr, status, error) {
        console.error("Erreur lors de la vérification de l'admin :", status, error);
      }
    });
  });
});


function getParameterByName(name) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(name);
}

