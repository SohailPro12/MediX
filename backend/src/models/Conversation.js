// models/Conversation.js
const mongoose = require("mongoose");

const messageSubSchema = new mongoose.Schema({
  sender:      { type: mongoose.Schema.Types.ObjectId, refPath: "senderRole", required: true },
  receiver:    { type: mongoose.Schema.Types.ObjectId, refPath: "receiverRole", required: true },
  senderRole:  { type: String, enum: ["patient","medecin"], required: true },
  receiverRole:{ type: String, enum: ["patient","medecin"], required: true },
  type:        { type: String, enum: ["text","image","document","audio"], default: "text" },
  text:        { type: String },
  url:         { type: String },      // pour image, file, audio
  originalName:{ type: String },      // pour document
  seen:        { type: Boolean, default: false },
  seenAt:      { type: Date },
  createdAt:   { type: Date, default: Date.now }
}, { _id: true });

const conversationSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: "Patient", required: true },
  medecinId: { type: mongoose.Schema.Types.ObjectId, ref: "Medecin", required: true },
  messages:  [messageSubSchema]
}, { timestamps: true });

module.exports = mongoose.model("Conversation", conversationSchema);
