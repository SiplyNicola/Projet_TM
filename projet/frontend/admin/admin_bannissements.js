$(document).ready(function () {
    function chargerUtilisateurs() {
      $.get("../../backend/admin/get_bans.php", function (data) {
        $("#user-list").html(data);
      });
    }
  
    // Débannir un utilisateur
    $(document).on("click", ".btn-supprimer", function () {
      const pseudo = $(this).data("pseudo"); // On récupère le pseudo (à adapter dans ton HTML aussi)
      if (confirm("Débannir cet utilisateur ?")) {
        $.ajax({
          url: "../../backend/forum/debannir_utilisateur.php",
          type: "POST",
          dataType: "json",
          data: { pseudo: pseudo },
          success: function (reponse) {
            alert(reponse.message);
            if (reponse.success) {
              chargerUtilisateurs();
            }
          },
          error: function () {
            alert("Erreur lors de la requête AJAX.");
          }
        });
      }
    });
  
    chargerUtilisateurs();
  });
  