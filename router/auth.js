const express = require("express");
const { body } = require("express-validator/check");

const router = express.Router();
const authController = require("../controllers/auth");

router.get("/inscription", authController.getInscription);
router.post(
  "/inscription",
  [
    body("email", "Votre email n'est pas valide").isEmail(),
    body(
      "pseudo",
      "Entrez un Pseudo Valabe (Minimun 5 lettres avec des chiffres )"
    )
      .isLength({ min: 5 })
      .isAlphanumeric(),

    body(
      "password",
      "Mot de passe trop court (lettre et chiffre mininum 5 caractere)"
    )
      .isAlphanumeric()
      .isLength({ min: 5 }),

    body("confirm_pass").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("les deux mot de passe ne corespondent pas");
      }
      return true;
    })
  ],
  authController.postInscription
);

router.get("/connexion", authController.getConnexion);
router.post(
  "/connexion",
  body("email", "Entrer un mail valide").isEmail(),
  authController.postConnexion
);
router.get("/deconnexion", authController.getDeconnexion);
router.get("/admin-connect", authController.getAdmin);
router.post("/admin-connect", authController.postAdmin);

router.get("/admin/dashboard", authController.getDashboard);
router.get("/admin/mod/:id", authController.getModArticle);
router.post("/admin/mod/:id", authController.postModArticle);
router.get("/admin/cfremove/:id", authController.pageRemoveArticle);
router.get("/admin/remove/:id", authController.removeArticle);
router.get("/admin/add", authController.getaddArticle);
router.post("/admin/add", authController.postaddArticle);

module.exports = router;
