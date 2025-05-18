const Conversation = require('../models/Conversation');
const fs           = require('fs');
const path         = require('path');
const cloudinary   = require('../config/cloudinary');

exports.getConversations = async (req, res) => {
  try {
    const userId   = req.user.id;
    const isMedecin = req.user.role === 'medecin';
    const filter   = isMedecin ? { medecinId: userId } : { patientId: userId };

    const convos = await Conversation.find(filter)
      .populate('patientId', 'nom prenom Photo')
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
    const convo = await Conversation.findOne({ patientId, medecinId })
      .populate('patientId', 'nom prenom Photo')
      .populate('medecinId', 'nom prenom Photo')
      .lean();

    if (!convo) return res.status(404).json({ message: 'Conversation introuvable' });
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
  const result = await cloudinary.uploader.upload(file.path, {
    folder,
    resource_type: 'raw',
    use_filename: true,          // Preserve filename
    unique_filename: false,      // Don't add unique identifiers
    overwrite: false,            // Prevent overwrites
    content_disposition: `attachment; filename="${path.parse(file.originalname).name}"` // Force download
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
  const { conversationId, messageId } = req.params;
  try {
    const convo = await Conversation.findById(conversationId);
    const msg   = convo.messages.id(messageId);
    if (!msg) return res.status(404).json({ error: 'Message introuvable' });
    if (msg.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }

    // If this was a media message, delete the Cloudinary file
    if (msg.type !== 'text' && msg.url) {
      // extract public_id from URL, e.g. .../upload/v1234/folder/abc.jpg
      const parsed = url.parse(msg.url).pathname; // /v1234/folder/abc.jpg
      // remove leading slash and extension
      const parts = parsed.split('/');
      const versionAndFolder = parts.slice(parts.indexOf('upload') + 1);
      const publicIdWithExt = versionAndFolder.join('/'); 
      const publicId = publicIdWithExt.replace(/\.[^/.]+$/, ''); 

      await cloudinary.uploader.destroy(publicId, {
        resource_type: msg.type === 'audio' ? 'video' : msg.type  // video for audio
      });
    }

    // Remove from DB
    msg.remove();
    await convo.save();
    res.json({ deleted: messageId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


exports.editMessage = async (req, res) => {
  const { conversationId, messageId } = req.params;
  const { text }                      = req.body;
  try {
    const convo = await Conversation.findById(conversationId);
    const msg   = convo.messages.id(messageId);
    if (!msg) return res.status(404).json({ error: 'Message introuvable' });
    if (msg.sender.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Non autorisé' });
    }
    // only text
    if (msg.type !== 'text') {
      return res.status(400).json({ error: 'Seuls les messages texte peuvent être modifiés' });
    }

    msg.text    = text;
    await convo.save();
    res.json({ updated: msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};