<?php
    header('Content-Type: application/json; charset=utf-8');
    session_start();

    $retour = [
        "connecte" => false
    ];
    if(isset($_SESSION["id"])) {
        $retour["connecte"] = true;
    } else {
        $retour["connecte"] = false;
    }

    session_write_close();
    echo json_encode($retour);
?>