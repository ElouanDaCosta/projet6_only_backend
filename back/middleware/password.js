const passwordValidator = require('password-validator');

const passwordSchema = new passwordValidator();

passwordSchema
    .is().min(8) // Longueur minimale de 8 caractères
    .is().max(40) // Longueur maximale de 40 caractères
    .has().uppercase() // Doit contenir au moins une lettre en majuscule
    .has().lowercase() // Doit contenir au moins une lettre en majuscule
    .has().digits(2) // Doit contenir au moins deux chiffres
    .has().not().spaces() // Ne doit pas contenir d'espace

module.exports = (req, res, next) => {
    if (passwordSchema.validate(req.body.password)) {
        next();
    } else {
        return res.status(401).json({ message: "Le mot de passe n'est pas assez fort!" });
    }
};