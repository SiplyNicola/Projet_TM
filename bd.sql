-- Supprimer la base si existante
drop database if exists db_projet_tm;

-- Création de la db
create database if not exists db_projet_tm;
use db_projet_tm;

-- Création de la table utilisateur
create table if not exists utilisateur(
    id int not null auto_increment,
    nom varchar(50) not null,
    prenom varchar(50) not null,
    pseudo varchar(50) not null,
    adresse_email varchar(255) not null,
    mot_de_passe varchar(255) not null,
    role ENUM('admin', 'utilisateur') not null,
    primary key(id)
)engine=innodb;

-- Création de la table catégorie
create table if not exists categorie(
    id int not null auto_increment,
    titre varchar(255) not null,
    primary key(id)
)engine=innodb;

-- Création de la table publication
create table if not exists publication(
    id int not null auto_increment,
    id_utilisateur int not null,
    id_categorie int not null,
    contenu text not null,
    date_publication datetime not null default CURRENT_TIMESTAMP,
    primary key(id)
)engine=innodb;

-- Création de la table commentaire
create table if not exists commentaire(
    id int not null auto_increment,
    id_publication int not null,
    id_utilisateur int not null,
    contenu text not null,
    date_commentaire datetime not null default CURRENT_TIMESTAMP,
    primary key(id)
)engine=innodb;

-- Création de la table des abonnements à des utilisateurs
create table if not exists abonneutilisateur(
    id int not null auto_increment,
    id_suivi int not null,
    id_suiveur int not null,
    primary key(id)
)engine=innodb;

-- Création de la table des abonnements à des catégories
create table if not exists abonnecategorie(
    id int not null auto_increment,
    id_suiveur int not null,
    id_categorie int not null,
    primary key(id)
)engine=innodb;

-- Gestion des clés étrangères
alter table publication add constraint fk_publication_utilisateur foreign key (id_utilisateur) references utilisateur(id) on delete cascade;
alter table publication add constraint fk_publication_categorie foreign key (id_categorie) references categorie(id) on delete cascade;
alter table commentaire add constraint fk_commentaire_publication foreign key (id_publication) references publication(id) on delete cascade;
alter table commentaire add constraint fk_commentaire_utilisateur foreign key (id_utilisateur) references utilisateur(id) on delete cascade;
alter table abonneutilisateur add constraint fk_abonneutilisateur_utilisateur foreign key (id_suivis) references utilisateur(id) on delete cascade;
alter table abonneutilisateur add constraint fk_abonneutilisateur_utilisateur2 foreign key (id_suiveur) references utilisateur(id) on delete cascade;
alter table abonnecategorie add constraint fk_abonnecategorie_utilisateur foreign key (id_suiveur) references utilisateur(id) on delete cascade;
alter table abonnecategorie add constraint fk_abonnecategorie_categorie foreign key (id_categorie) references categorie(id) on delete cascade;

-- Rendre unique le pseudo et l'adresse email
alter table utilisateur add constraint uq_pseudo unique (pseudo);
alter table utilisateur add constraint uq_adresse_email unique (adresse_email);

-- Créer les utilisateurs admin et utilisateur
create user 'userProjet'@'localhost' identified by 'wNcEaRvH3OlAZkzY';
grant select on db_projet_tm.* to 'userProjet'@'localhost';
grant all prileves on db_projet_tm.publication to 'userProjet'@'localhost';
grant all privileges on db_projet_tm.commentaire to 'userProjet'@'localhost';
grant all privileges on db_projet_tm.abonneutilisateur to 'userProjet'@'localhost';
grant all privileges on db_projet_tm.abonnecategorie to 'userProjet'@'localhost';


create user 'adminProjet'@'localhost' identified by 'Pv8gTpwzuBHokz4f';
grant all privileges on db_projet_tm.* to 'adminProjet'@'localhost';