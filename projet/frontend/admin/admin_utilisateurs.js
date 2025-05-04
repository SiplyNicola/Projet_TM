$(document).ready(function () {
    function chargerUtilisateurs() {
      $.get("../../backend/admin/get_users.php", function (data) {
        $("#user-list").html(data);
      });
    }
  
    // Suppression utilisateur
    $(document).on("click", ".btn-supprimer", function () {
      const id = $(this).data("id");
      if (confirm("Supprimer cet utilisateur ?")) {
        $.post("../../backend/admin/delete_user.php", { id: id }, function (reponse) {
          alert(reponse);
          chargerUtilisateurs();
        });
      }
    });
  
    chargerUtilisateurs();
  });
  