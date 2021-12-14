const Sauce = require('../models/Sauce');
const fs = require('fs');
const app = require('../app');

exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete req.body._id;
    const sauce = new Sauce({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({message: 'Sauce added'}))
        .catch(error => res.status(401).json({ error }))
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    { ...JSON.parse(req.body.sauce),
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : {...req.body};
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (!sauce) {
                res.status(400).json({
                    error: new Error('No such thing !')
                });
            }
            if (sauce.userId !== req.auth.userId) {
                res.status(400).json({
                    error: new Error('Request unauthorized !')
                });
            }
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({_id: req.params.id})
                    .then(() => res.status(200).json({message: 'Sauce deleted !'}))
                    .catch(error => res.status(400).json({ error }))
            });
        })
        .catch(error => res.status(500).json({ error }));
    
};

exports.likeSauce = (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
        .then(sauce => {
            if (!sauce) {
                res.status(400).json({
                    error: new Error('No such thing !')
                });
            }
            const sauceObject = {...sauce.toObject()};
            let message;
            let usersLiked = [...new Set(sauceObject.usersLiked)];
            let usersDisliked = [...new Set(sauceObject.usersDisliked)];
            
            if (req.body.like === 1 && usersLiked.indexOf(req.body.userId) < 0) {
                usersLiked.push(req.body.userId);
                message = 'Sauce liked !';
            } else if (req.body.like === 0 && usersLiked.indexOf(req.body.userId) >= 0) {
                const idxLiked = usersLiked.indexOf(req.body.userId);
                usersLiked.splice(idxLiked, 1);
                message = 'Sauce unliked !'
            } else if (req.body.like === -1 && usersDisliked.indexOf(req.body.userId) < 0) {
                usersDisliked.push(req.body.userId);
                message = 'Sauce disliked !';
            } else if (req.body.like === 0 && usersDisliked.indexOf(req.body.userId) >= 0) {
                const idxDisliked = usersDisliked.indexOf(req.body.userId);
                usersDisliked.splice(idxDisliked, 1);
                message = 'Sauce undisliked !';
            }
            sauceObject.usersLiked = usersLiked;
            sauceObject.likes = usersLiked.length;
            sauceObject.usersDisliked = usersDisliked;
            sauceObject.dislikes = usersDisliked.length;
            console.log(sauceObject);
            Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
                .then(() => res.status(200).json({ message }))
                .catch(error => res.status(400).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};