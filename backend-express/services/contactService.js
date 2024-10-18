const Contact = require("../models/contact");

exports.createContact = async (data) => {
  const contact = new Contact(data);
  return await contact.save();
};

exports.getAllContacts = async (page, limit) => {
  const skip = (page - 1) * limit;

  const contacts = await Contact.find().skip(skip).limit(limit).exec();

  const totalContacts = await Contact.countDocuments().exec();

  return { contacts, totalContacts };
};

exports.getContactById = async (id) => {
  return await Contact.findById(id);
};

exports.updateContact = async (id, data) => {
  return await Contact.findByIdAndUpdate(id, data, { new: true });
};

exports.deleteContact = async (id) => {
  return await Contact.findByIdAndDelete(id);
};

exports.lockContact = async (id, username) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { locked: true, lockedBy: username },
    { new: true }
  );
  return contact;
};

exports.unlockContact = async (id) => {
  const contact = await Contact.findByIdAndUpdate(
    id,
    { locked: false, lockedBy: null },
    { new: true }
  );
  return contact;
};
