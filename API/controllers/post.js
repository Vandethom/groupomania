/* ------------------------- Requirements ------------------------- */

/* -------------------- Security -------------------- */

const dotenv = require('dotenv');
require('dotenv').config;
const sanitize = require('sanitize');

/* -------------------- Libraries and connection -------------------- */

const Post = require('../models/post');
const mysql = require('mysql');
const Sequelize = require('sequelize');
const { param } = require('../routes/post');

const connection = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: process.env.MySQLPassword,
    database: 'groupomania'
});

/* ------------------------- Controllers ------------------------- */

/* ------------------------- Create new post ------------------------- */

exports.createPost = (req, res, next) => {
    connection.getConnection(function (error) {
        const body = req.body.body;
        const userPseudonym = req.body.userPseudonym;
        const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        const post = `(
            "${body}",
            "${userPseudonym}",
            "${image}"
        )`;
        console.log(post)
        const sql =
            `INSERT INTO Posts (body, userPseudonym, image) VALUES ${post}`;

        connection.query(sql, function (error, response) {
            if (error) {
                return res.status(403).json({
                    error: `Remplissez correctement tous les champs avant d'envoyer votre requête.`
                });
            }
            return res.status(201).json({
                message: `Votre article a bien été enregistré.`
            });
        })
    })
};

/* ------------------------- Get all posts ------------------------- */

exports.getAllPosts = (req, res, next) => {
    connection.getConnection(function (error) {
        const postId = req.body.id;
        const userId = req.params.userId;

        connection.query(
            `SELECT * FROM Posts;`,
            function (error, response, fields) {
                if (error) {
                    res.status(404).json({
                        error: `Vous n'êtes pas au bon endroit, tentez de recharger la page avec le bon URL pour afficher ce contenu.`
                    })
                }
                res.status(200).json({
                    response
                })
            }
        )
    })
};

/* ------------------------- Get one post ------------------------- */

exports.getOnePost = (req, res, next) => {
    connection.getConnection(function (error) {
        const postId = req.params.id;
        const userId = req.params.userId;

        const mySQL = `SELECT * FROM Posts WHERE postId=${postId}`

        connection.query(
            mySQL, function (error, response, fields) {
                if (error) {
                    return res.status(404).json({
                        error: `La page que vous recherchez n'existe pas, tentez à nouveau avec une recherche correcte.`
                    })
                };
                return res.status(200).json({
                    response
                });
            }
        );
    });
};

/* ------------------------- Update a post ------------------------- */

exports.editPost = (req, res, next) => {

};

/* ------------------------- Delete a post ------------------------- */

exports.deletePost = (req, res, next) => {
    connection.getConnection(function (error) {
        const postId = req.params.id;

        connection.query(
            `DELETE FROM Posts WHERE postId=${postId}`,
            function (error, response, fields) {
                if (error) {
                    res.status(500).json({
                        error: `L'article que vous souhaitez supprimer n'existe pas.`
                    });
                }
                res.status(204).json({
                    message: `L'article souhaité a bien été supprimé.`
                });
            }
        );
    });
};

/* ------------------------- Create new comment ------------------------- */

exports.createComment = (req, res, next) => {
    connection.getConnection(function (error) {
        const postId = req.params.id;

        const body = req.body.body;
        const userPseudonym = req.body.userPseudonym;
        //const image = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`;
        const comment = `(
        "${body}",
        "${userPseudonym}",
        "${postId}"
        )`;
        console.log(comment)
        const sql =
            `INSERT INTO Comments (body, userPseudonym, postId) 
        VALUES ${comment};`

        connection.query(sql, function (error, response, fields) {
            if (error) {
                return res.status(403).json({
                    error: `Impossible de publier ce commentaire.`
                });
            }
            return res.status(201).json({
                message: `Votre commentaire vient d'être publié !`
            })
        }
        )
    })
}

/* ------------------------- Get Comments of a post ------------------------- */

exports.getComments = (req, res, next) => {
    connection.getConnection(function (error) {
        const postId = req.params.id;
        const sql =
            `SELECT * FROM Comments
        INNER JOIN Posts
        ON Comments.PostId = Posts.Postid
        WHERE Posts.PostId = ${postId};`

        connection.query(
            sql, function (error, response, fields) {
                if (error) {
                    res.status(500).json({
                        error: `Le commentaire que vous cherchez est introuvable.`
                    });
                }
                res.status(200).json({
                    response
                })
            }
        )
    })
}