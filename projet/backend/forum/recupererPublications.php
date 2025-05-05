<?php
header('Content-Type: application/json; charset=utf-8');
include("../connect.php");

try {
    $conn = pdo_connectDB("localhost", "3306", "db_projet_tm", "adminProjet", "Pv8gTpwzuBHokz4f");
    $conn->beginTransaction();

    session_start();
    session_write_close();

    // 1. Récupération des publications avec pseudo
    $sql = "
        SELECT p.id, p.id_utilisateur, p.id_categorie, p.titre, p.contenu, p.date_publication, p.longitude, p.latitude,
               u.pseudo
        FROM publication p
        JOIN utilisateur u ON p.id_utilisateur = u.id
        ORDER BY p.date_publication DESC
    ";
    $statement = $conn->prepare($sql);
    $statement->execute();
    $publications = $statement->fetchAll(PDO::FETCH_ASSOC);

    // 2. Pour chaque publication, on récupère les commentaires liés
    foreach ($publications as &$publication) {
        $sqlCommentaires = "
            SELECT c.id, c.contenu, c.date_commentaire, u.pseudo
            FROM commentaire c
            JOIN utilisateur u ON c.id_utilisateur = u.id
            WHERE c.id_publication = :id_publication
            ORDER BY c.date_commentaire ASC
        ";
        $stmtCommentaires = $conn->prepare($sqlCommentaires);
        $stmtCommentaires->bindParam(':id_publication', $publication['id']);
        $stmtCommentaires->execute();
        $commentaires = $stmtCommentaires->fetchAll(PDO::FETCH_ASSOC);
        
        $publication['commentaires'] = $commentaires;
        $publication['nombre_commentaires'] = count($commentaires); // 👈 Ajout du compteur
    }


    echo json_encode(["publication" => $publications], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => $e->getMessage()]);
}
