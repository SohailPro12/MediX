const express = require("express");
const { login } = require("../controllers/LoginAuthentification.js");
const { deleteAccount } = require("../controllers/deletecompteAdmin.js");
const authMiddleware = require('../middleware/auth.js');
const { forgotPassword } = require("../controllers/forgotPassword.js");
const { resetPassword } = require("../controllers/ResetPassword.js");
const { ssoLogin } = require("../controllers/SSO.js");



const router = express.Router();

router.post("/login", login);

router.get('/profile', authMiddleware, (req, res) => {
    res.json({ message: 'Bienvenue sur ton profil sécurisé', user: req.user });
  });

router.delete('/delete-account', authMiddleware, deleteAccount);


router.post("/forgot-password", forgotPassword);

router.post("/SSO", ssoLogin);

router.get("/reset-password/:token", resetPassword);
 

module.exports = router;
