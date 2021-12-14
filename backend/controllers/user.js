const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = (req, res, next) => {
    User.findOne({email: req.body.email})// Vérification de la présence de l'utilisateur dans la base de donnée
        .then(user => {
            if (user) { //Inscription refusée si utilisateur déjà inscrit
                return res.status(401).json({error: "Utilisateur déjà inscrit"}) 
            } 
            bcrypt.hash(req.body.password, 10)
                    .then(hash => {//hashage du mot de passe
                        const user = new User({// Création du nouvelle utilisateur
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(() => res.status(201).json({message: "Utilisateur créé !"}))
                            .catch(error => res.status(400).json({ error }))
                    })
        })
        .catch(error => res.status(500).json({ error }))
};

exports.login = (req, res, next) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) {
                return res.status(401).json({error: "Utilisateur non trouvé !"});
            }
            bcrypt.compare(req.body.password, user.password)// Comparaison du mot de passe envoyé avec celui de la base de donnée pour l'utilisateur correspondant
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({error: "Mot de passe incorrect !"});
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'RANDOM_TOKEN_SECRET',
                            { expiresIn: '24h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};