const contactService = require("../services/contactService");

exports.createContact = async (req, res) => {
  const contact = await contactService.createContact(req.body);
  res.status(201).json(contact);
};

exports.getAllContacts = async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;

  try {
    const { contacts, totalContacts } = await contactService.getAllContacts(
      page,
      limit
    );
    res.json({ contacts, totalContacts });
  } catch (error) {
    res.status(500).json({ message: "Error fetching contacts" });
  }
};

exports.getContactById = async (req, res) => {
  const contact = await contactService.getContactById(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.json(contact);
};

exports.updateContact = async (req, res) => {
  const contact = await contactService.updateContact(req.params.id, req.body);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.json(contact);
};

exports.deleteContact = async (req, res) => {
  const contact = await contactService.deleteContact(req.params.id);
  if (!contact) {
    return res.status(404).json({ message: "Contact not found" });
  }
  res.json({ message: "Contact deleted" });
};

exports.lockContact = async (req, res) => {
  const contactId = req.params.id;
  const username = req.username;
  const contact = await contactService.lockContact(contactId, username);

  req.io.emit("contactLocked", { contactId, username });

  res.json(contact);
};

exports.unlockContact = async (req, res) => {
  const contactId = req.params.id;
  const contact = await contactService.unlockContact(contactId);

  req.io.emit("contactUnlocked", { contactId });

  res.json(contact);
};
