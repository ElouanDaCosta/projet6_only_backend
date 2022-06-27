const sauces = require('../models/sauces');

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
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(400).json({ error }));
}

exports.getOneSauce = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then((sauce) => res.status(200).json(sauce))
        .catch(error => res.status(404).json({ error }));
}

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ? 
    {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    sauces.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce modifiée !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.deleteSauce = (req, res, next) => {
    sauces.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: 'Sauce supprimée !' }))
        .catch(error => res.status(400).json({ error }));
}

exports.likesDislikes = (req, res, next) => {
    sauces.findOne({ _id: req.params.id })
        .then(sauce => {
            switch (req.body.like) {
                case 1:
                    sauces.updateOne({ _id: req.params.id }, {$inc: { likes: +1 }, $push: { usersLiked: req.body.userId }})
                        .then(() => res.status(201).json({ message: 'Ajout du like !' }))
                        .catch(error => res.status(400).json({ error }));
                break;
                case -1:
                    sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId }})
                        .then(() => res.status(201).json({ message: "Ajout d'un dislike ! " }))
                        .catch(error => res.status(400).json({ error }));
                break;
                case 0:
                    if (sauce.usersLiked.includes(req.body.userId)) {
                        sauces.updateOne({ _id: req.params.id }, {
                            $inc: { likes: -1 },
                            $pull: { usersLiked: req.body.userId }
                        })
                            .then(() => res.status(201).json({ message: "Suppression du like !" }))
                            .catch((error) => res.status(400).json({ error }));
                    } else if (sauce.usersDisliked.includes(req.body.userId)) {
                        sauces.updateOne({ _id: req.params.id }, {
                            $inc: { dislikes: -1 },
                            $pull: { usersDisliked: req.body.userId }
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

/*exports.likesDislikes = (req, res, next) => {
    sauces.findOne({ _id: req.params.id, })
        .then((sauce) => {
            if (req.body.like === 0) {
                sauces.updateOne({ _id: req.params.id }, { $inc: { likes: -1 }, $pull: { usersLiked: req.body.userId }})
                    .then(() => res.status(200).json({ message: 'like !' }))
                    .catch(error => res.status(400).json({ error }));
            }
            if (req.body.like === 1) {
                sauces.updateOne({ _id: req.params.id }, { $inc: { likes: +1 }, $push: { usersLiked: req.body.userId } })
                    .then(() => res.status(200).json({ message: 'dislike !' }))
                    .catch(error => res.status(400).json({ error }));
            } 
            if (req.body.like === -1) {
                sauces.updateOne({ _id: req.params.id }, { $inc: { dislikes: +1 }, $push: { usersDisliked: req.body.userId } })
                    .then(() => res.status(200).json({ message: 'dislike !' }))
                    .catch(error => res.status(400).json({ error })); 
            }
    })
};*/

