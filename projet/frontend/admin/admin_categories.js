$(document).ready(function () {
    chargerCategories();

    function chargerCategories() {
      $.get('../../backend/api/categorie_get.php', function (data) {
        let rows = '';
        data.forEach(cat => {
          rows += `
            <tr>
              <td>${cat.id}</td>
              <td><input class="form-control form-control-sm titreInput" data-id="${cat.id}" value="${cat.titre}"></td>
              <td>
                <button class="btn btn-sm btn-primary modifierBtn" data-id="${cat.id}">Modifier</button>
                <button class="btn btn-sm btn-danger supprimerBtn" data-id="${cat.id}">Supprimer</button>
              </td>
            </tr>`;
        });
        $('#tableCategories tbody').html(rows);
      }, 'json');
    }

    $('#formAddCategorie').on('submit', function (e) {
      e.preventDefault();
      $.post('../../backend/api/categorie_add.php', $(this).serialize(), function () {
        chargerCategories();
        $('#formAddCategorie')[0].reset();
      });
    });

    $('#tableCategories').on('click', '.modifierBtn', function () {
      const id = $(this).data('id');
      const titre = $(this).closest('tr').find('.titreInput').val();
      $.post('../../backend/api/categorie_update.php', { id, titre }, function () {
        chargerCategories();
      });
    });

    $('#tableCategories').on('click', '.supprimerBtn', function () {
      const id = $(this).data('id');
      if (confirm('Supprimer cette catégorie ?')) {
        $.post('../../backend/api/categorie_delete.php', { id }, function () {
          chargerCategories();
        });
      }
    });
  });