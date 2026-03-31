const Contact = require("../models/Contact.js");

const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user });
        res.json(contacts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching contacts" });
    }
};

const addContact = async (req, res) => {
    try {
        const contact = await Contact.create({
            ...req.body,
            user: req.user,
        });

        res.status(201).json(contact);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error creating contact" });
    }
};

const updateContact = async (req, res) => {
    try {
        const id = req.params.id;

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        if (contact.user.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const updated = await Contact.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );

        res.json(updated);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error updating contact" });
    }
};

// Delete contact
const deleteContact = async (req, res) => {
    try {
        const id = req.params.id;

        const contact = await Contact.findById(id);

        if (!contact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        if (contact.user.toString() !== req.user) {
            return res.status(401).json({ message: "Not authorized" });
        }

        await Contact.findByIdAndDelete(id);

        res.json({ message: "Contact deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error deleting contact" });
    }
};

module.exports = {
    getContacts,
    addContact,
    updateContact,
    deleteContact,
};