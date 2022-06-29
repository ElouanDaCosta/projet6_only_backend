const sauces = require('../models/sauces');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new sauces({
        ...sauceObject,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save()
        .then(() => res.status(201).json({ message: 'Sauce enregistrée !' }))
        .catch(error => res.status(400).json({ error }));
};

exports.getAllSauce = (req, res, next) => {
    sauces.find()
        .then((sauces) => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            const imageName = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${imageName}`, () => {
                const sauceObject = req.file ? 
                {
                    ...JSON.parse(req.body.sauce),
                    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                } : { ...req.body };
                sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
}

exports.deleteSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            const imageName = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${imageName}`, () => {
                sauces.deleteOne({ _id: req.params.id })
                    .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
                    .catch(error => res.status(400).json({ error }));
            })
        })
}

exports.likesDislikes = (req, res, next) => {
    const userId = req.body.userId;
    const sauceId = req.params.id;
    sauces.findOne({ _id: sauceId })
        .then(sauce => {
            switch (req.body.like) {
                case 1:
                    sauces.updateOne({ _id: sauceId }, {
                        $inc: { likes: +1 },
                        $push: { usersLiked: userId }
                    })
                        .then(() => res.status(201).json({ message: 'Ajout du like !' }))
                        .catch(error => res.status(400).json({ error }));
                break;
                case -1:
                    sauces.updateOne({ _id: sauceId }, {
                        $inc: { dislikes: +1 },
                        $push: { usersDisliked: userId }
                    })
                        .then(() => res.status(201).json({ message: "Ajout d'un dislike ! " }))
                        .catch(error => res.status(400).json({ error }));
                break;
                case 0:
                    if (sauce.usersLiked.includes(userId)) {
                        sauces.updateOne({ _id: sauceId }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: userId }
                        })
                            .then(() => res.status(201).json({ message: "Suppression du like !" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(userId)) {
                        sauces.updateOne({ _id: sauceId }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: userId }
                        })
                            .then(() => res.status(201).json({ message: "Suppression du dislike ! " }))
                            .catch((error) => res.status(400).json({ error }));
                    } else {
                        res.status(403).json({ error })
                    }
                break;
            }
        })
        .catch(() => res.status(404).json({ error }));
};