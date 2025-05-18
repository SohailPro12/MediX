const express   = require('express');
const multer    = require('multer');
const auth      = require('../middleware/auth');
const ctl       = require('../controllers/conversationController');

const storage = multer.diskStorage({
  destination: 'uploads/',
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Preserve original filename
  }
});
const upload = multer({ storage });
const router = express.Router();


router.get("/", auth, ctl.getConversations);
router.get("/:patientId/:medecinId", auth, ctl.getConversation);

// textuel
router.post(
  '/:patientId/:medecinId/message/text',
  auth,
  ctl.sendMessageText
);

// image
router.post(
  '/:patientId/:medecinId/message/image',
  auth,
  upload.single('image'),
  ctl.sendMessageImage
);

// document
router.post(
  '/:patientId/:medecinId/message/document',
  auth,
  upload.single('document'),
  ctl.sendMessageDocument
);

// audio
router.post(
  '/:patientId/:medecinId/message/audio',
  auth,
  upload.single('audio'),
  ctl.sendMessageVocal
);

// édition et suppression
router.patch(
  '/:patientId/:medecinId/message/:messageId',
  auth,
  ctl.editMessage
);
router.delete(
  '/:patientId/:medecinId/message/:messageId',
  auth,
  ctl.deleteMessage
);

module.exports = router;