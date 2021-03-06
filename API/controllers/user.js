/* ------------------------- Requirements ------------------------- */

/* -------------------- Security -------------------- */

const dotenv = require('dotenv');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sanitize = require('sanitize');
//const helmet = require('helmet');
require('dotenv').config();

/* -------------------- Libraries and connection -------------------- */

const mysql = require('mysql');
const Sequelize = require('sequelize');
const User = require('../models/user');
const { param } = require('../routes/user');

const connection = mysql.createPool({ // createPool pour éviter les handshake errors de createConnection permet plusieurs connections, ici 10
    connectionLimit: 10,
    host: 'localhost',
    user: 'root',
    password: process.env.MySQLPassword,
    database: 'groupomania'
});

/*const connection = new Sequelize('groupomania', 'root', process.env.MySQLPassword, {
    host: 'localhost',
    dialect: 'mysql'
}); //connecting with 3 arguments : db_name/user/password*/


/* ------------------------- Masking mail in Database ------------------------- */

function maskEmail(email) {
    // function used with signUp and signIn in order to replace characters with '*'
    function mask(str) {
        if (str.length > 4) { // if mail is longer than 4 characters, replaces all but the first one
            return (
                str.substr(0, 1) +
                str.substr(1, str.length - 1).replace(/\w/g, "*") +
                str.substr(-1, 1)
            );
        }
        return str.replace(/\w/g, "*"); // else, replaces all by stars (*)
    }
    return email.replace(/([\w.]+)@([\w.]+)(\.[\w.]+)/g, function (
        m,
        p1,
        p2,
        p3
    ) {
        return mask(p1) + "@" + mask(p2) + p3;
    });
    return email;
}

/* ------------------------- Controllers ------------------------- */

/* ------------------------- Signing Up User ------------------------- */

exports.signup = (req, res, next) => {
    connection.getConnection(function (error) {
        bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
                const name = req.body.name;
                const surname = req.body.surname;
                const pseudonym = req.body.pseudonym;
                const password = hash;
                const email = maskEmail(req.body.email); //email masqué en BDD. Fonction MaskEmail au-dessus
                const description = req.body.description;
                const user = `
                ('${name}',
                 '${surname}',
                  '${pseudonym}',
                   '${password}',
                     '${email}',
                      '${description}')`;
                const sql =
                    `INSERT INTO Users (name, surname, pseudonym, password, email, description) VALUES ${user}`;
                connection.query(sql, function (error, result) {
                    if (error) {
                        return res.status(403).json({
                            error: `Veillez à créer un utilisateur qui n'existe pas déjà et en remplissant tous les champs.`
                        })
                    };
                    return res.status(201).json({
                        message: `L'utilisateur ${pseudonym} vient d'être ajouté aux profils.`
                    })
                    console.log(`${pseudonym} vient d\'être ajouté aux profils`);
                });
            })
            .catch((error) => res.status(403).json({
                error: `Veillez à créer un utilisateur qui n'existe pas déjà et en remplissant tous les champs.`
            }))
    });
};

/* ------------------------- Signing In User ------------------------- */

exports.login = (req, res, next) => {
    connection.getConnection(function (error) {
        const email = maskEmail(req.body.email);
        const password = req.body.password;

        connection.query(
            `SELECT * FROM Users WHERE email='${email}';`,
            function (error, response, fields) {
                if (error) {
                    throw error;
                }
                bcrypt
                    .compare(password, response[0].password)
                    .then((valid) => {
                        if (!valid) {
                            return res.status(401).json({
                                error: 'Mot de passe incorrect.'
                            });
                        }
                        res.status(200).json({
                            userPseudonym: response[0].pseudonym,
                            userId: response[0].id,
                            token: jwt.sign({
                                userId: response[0].id
                            }, process.env.token, {
                                expiresIn: '24h'
                            })
                        })
                    })
                    .catch(error => res.status(401).json({
                        error: 'Remplissez correctement tous les champs.'
                    }))
            });
    })
}

/* ------------------------- Retrieving Account Informations ------------------------- */

exports.getUser = (req, res, next) => {
    connection.getConnection(function (error) {
        console.log(req.params.id)
        connection.query(
            'SELECT * FROM Users WHERE id=?', req.params.id, (error, results) => {
                if (error) {
                    return res.status(400).json(error)
                }
                return res.status(200).json(results)
            }
        )
    })
}

/* ------------------------- Delete Account ------------------------- */

exports.deleteUser = (req, res, next) => {
    connection.getConnection(function (error) {
        const userId = req.params.id;
        connection.query(
            `DELETE FROM Users WHERE id=${userId}`
        );
        if (error) {
            res.status(404).json({
                error: `L'utilisateur que vous cherchez n'existe pas, tentez de vous reconnecter pour résoudre ce problème.`
            })
        }
        return res.status(204).json({
            message: `vient d'être supprimé des profils existants` //pseudonym
        })
    })
}

/* ------------------------- Update Account ------------------------- */

exports.updateUser = (req, res, next) => {
    connection.getConnection(function (error) {
        bcrypt
            .hash(req.body.password, 10)
            .then((hash) => {
                const name = req.body.name;
                const surname = req.body.surname;
                const pseudonym = req.body.pseudonym;
                const password = hash;
                const email = maskEmail(req.body.email);
                const description = req.body.description;
                const id = req.params.id;

                const sql =
                    `UPDATE Users SET name='${name}', surname='${surname}', pseudonym='${pseudonym}', password='${password}', email='${email}', description='${description}' WHERE id=${id};`

                connection.query(sql, function (error, result) {
                    if (error) {
                        return res.status(403).json({
                            error: `Veillez à modifier un utilisateur existant.`
                        })
                    };
                    return res.status(201).json({
                        message: `L'utilisateur a été modifié.`
                    })
                });
            })
            .catch((error) => res.status(500).json({ error }));
    })
}