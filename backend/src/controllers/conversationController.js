const Conversation = require('../models/Conversation');
const fs           = require('fs');
const path         = require('path');
const cloudinary   = require('../config/cloudinary');
const url = require('url');

exports.getConversations = async (req, res) => {
  try {
    const userId   = req.user.id;
    const isMedecin = req.user.role === 'medecin';
    const filter   = isMedecin ? { medecinId: userId } : { patientId: userId };

    const convos = await Conversation.find(filter)
      .populate('patientId', 'nom prenom photo')
      .populate('medecinId', 'nom prenom Photo')
      .lean();

    res.json(convos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};

exports.getConversation = async (req, res) => {
  try {
    const { patientId, medecinId } = req.params;
    const currentUserId = req.user.id;

    const convo = await Conversation.findOne({ patientId, medecinId })
      .populate('patientId', 'nom prenom photo')
      .populate('medecinId', 'nom prenom Photo');
console.log("convo", convo);
    if (!convo) return res.status(404).json({ message: 'Conversation introuvable' });

    // 1️⃣ Marquer comme vu tous les messages où j’étais le receiver
    let updated = false;
    convo.messages.forEach(msg => {
      if (msg.receiver.toString() === currentUserId && !msg.seen) {
        msg.seen = true;
        msg.seenAt = new Date();
        updated = true;
      }
    });
    if (updated) await convo.save();

    res.json(convo);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur' });
  }
};



async function _upsertConversation(patientId, medecinId) {
  let convo = await Conversation.findOne({ patientId, medecinId });
  if (!convo) {
    convo = await Conversation.create({ patientId, medecinId, messages: [] });
  }
  return convo;
}

// 1️⃣ TEXTE
exports.sendMessageText = async (req, res) => {
  const { patientId, medecinId } = req.params;
  const { message }              = req.body;
  const sender                    = req.user.id;
  const role                      = req.user.role.toLowerCase();
console.log("message", message);
  try {
    const convo = await _upsertConversation(patientId, medecinId);
    const msg = {
      sender,
      receiver    : role === 'patient' ? medecinId : patientId,
      senderRole  : role,
      receiverRole: role === 'patient' ? 'medecin' : 'patient',
      type        : 'text',
      text        : message
    };
    convo.messages.push(msg);
    await convo.save();
    res.status(201).json({ newMessage: convo.messages.slice(-1)[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// envoi image
exports.sendMessageImage = async (req, res) => {
  const { patientId, medecinId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Image manquante' });

  // uploader sur cloudinary
  const folder = `medix/conversations/${patientId}_${medecinId}`;
  const result = await cloudinary.uploader.upload(file.path, {
    folder, resource_type: 'image'
  });
  fs.unlinkSync(file.path);

  let convo = await Conversation.findOne({ patientId, medecinId });
  if (!convo) convo = await Conversation.create({ patientId, medecinId, messages: [] });

  const msg = {
    sender: req.user.id,
    receiver: req.user.role==='medecin'? patientId : medecinId,
    senderRole: req.user.role,
    receiverRole: req.user.role==='medecin'?'patient':'medecin',
    type: 'image',
    url: result.secure_url
  };
  convo.messages.push(msg);
  await convo.save();
  res.status(201).json({ newMessage: convo.messages.at(-1) });
};

// Modify sendMessageDocument to preserve filename in Cloudinary
exports.sendMessageDocument = async (req, res) => {
  const { patientId, medecinId } = req.params;
  const file = req.file;
  console.log("file", file);
  if (!file) return res.status(400).json({ error: 'Document manquant' });

  // Upload with filename preservation
  const folder = `medix/conversations/${patientId}_${medecinId}/docs`;
  
  // Extract filename without extension and extension separately
  const originalName = file.originalname;
  const nameWithoutExt = path.parse(originalName).name;
  const extension = path.parse(originalName).ext;
  
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    resource_type: 'raw',
    public_id: nameWithoutExt, // Use original name as public_id
    use_filename: true,          // Preserve filename
    unique_filename: false,      // Don't add unique identifiers
    overwrite: false,            // Prevent overwrites - will add suffix if duplicate
  });

  fs.unlinkSync(file.path);

  let convo = await Conversation.findOne({ patientId, medecinId });
  if (!convo) convo = await Conversation.create({ patientId, medecinId, messages: [] });

  const msg = {
    sender: req.user.id,
    receiver: req.user.role === 'medecin' ? patientId : medecinId,
    senderRole: req.user.role,
    receiverRole: req.user.role === 'medecin' ? 'patient' : 'medecin',
    type: 'document',
    url: result.secure_url,
    originalName: file.originalname
  };
  
  convo.messages.push(msg);
  await convo.save();
  res.status(201).json({ newMessage: convo.messages.at(-1) });
};

// envoi vocal
// Modify the sendMessageVocal controller
exports.sendMessageVocal = async (req, res) => {
  const { patientId, medecinId } = req.params;
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'Audio manquant' });

  const folder = `medix/conversations/${patientId}_${medecinId}/audio`;
 const result = await cloudinary.uploader.upload(file.path, {
  folder,
  resource_type: 'raw',    // 👈 treat audio as “raw”
  use_filename:  true,
  unique_filename: false,
  overwrite: false,
});

fs.unlinkSync(file.path);

  let convo = await Conversation.findOne({ patientId, medecinId });
  if (!convo) convo = await Conversation.create({ patientId, medecinId, messages: [] });

  const msg = {
  sender:       req.user.id,
  receiver:     (req.user.role === 'medecin' ? patientId : medecinId),
  senderRole:   req.user.role,
  receiverRole: (req.user.role === 'medecin' ? 'patient' : 'medecin'),
  type:         'audio',
  url:          result.secure_url,               // now points to raw/audio.M4A
  originalName: file.originalname || `audio-${Date.now()}.m4a`
};

  convo.messages.push(msg);
  await convo.save();
  res.status(201).json({ newMessage: convo.messages.at(-1) });
};

// ÉDITION ET SUPPRESSION (inchangés)
exports.deleteMessage = async (req, res) => {
  const { patientId, medecinId, messageId } = req.params;
  try {
    // On cherche la conversation par patientId + medecinId
    const convo = await Conversation.findOne({ patientId, medecinId });
    if (!convo) {
      return res.status(404).json({ error: 'Conversation introuvable' });
    }

    const msg = convo.messages.id(messageId);
    if (!msg) {
      return res.status(404).json({ error: 'Message introuvable' });
    }
    if (msg.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // Si c'est un média, on supprime d'abord le fichier Cloudinary
    if (msg.type !== 'text' && msg.url) {
      const parsedUrl = url.parse(msg.url);
      const pathname = parsedUrl.pathname; 
      const uploadIndex = pathname.indexOf('/upload/');
      if (uploadIndex >= 0) {
        let publicIdWithVersion = pathname.substring(uploadIndex + 8);
        publicIdWithVersion = publicIdWithVersion.replace(/^v[0-9]+\//, '');
        const publicId = publicIdWithVersion.replace(/\.[^/.]+$/, '');

            let resourceType = 'image';
            if (msg.type === 'audio') {
              resourceType = 'video';
            } else if (msg.type === 'document') {
              resourceType = 'raw';
            } else {
              resourceType = msg.type;
          }

          await cloudinary.uploader.destroy(publicId, {
            resource_type: resourceType,
          });
      }
    }

    // On enlève le message et on sauve
    convo.messages.pull({ _id: messageId });
    await convo.save();
    res.json({ deleted: messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};



exports.editMessage = async (req, res) => {
  const { patientId, medecinId, messageId } = req.params;
   const { text } = req.body;
  try {
    const convo = await Conversation.findOne({ patientId, medecinId });
    if (!convo) {
      return res.status(404).json({ error: 'Conversation introuvable' });
    }

       const msg = convo.messages.id(messageId);
   if (!msg) {
     return res.status(404).json({ error: 'Message introuvable' });
   }
   if (msg.sender.toString() !== req.user.id) {
     return res.status(403).json({ error: 'Non autorisé' });
   }
   if (msg.type !== 'text') {
     return res.status(400).json({ error: 'Seuls les messages texte peuvent être modifiés' });
   }

   msg.text = text;
   await convo.save();
   res.json({ updated: msg });

  } catch (err) {
    console.error("Erreur editMessage:", err);
    res.status(500).json({ error: err.message });
  }
};
