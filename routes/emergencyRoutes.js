const express = require("express");
const router = express.Router();

const emergencyContactsModel = require("../models/emergencyContactModel");
const authMiddleware = require("../middleware/auth");
// route for adding emergency contacts

router.post("/addContacts", authMiddleware, async (req, res) => {
    try {
      const { contact } = req.body; // Accept contact as an array
      const user = req.user;
  

  
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
      if (!Array.isArray(contact) || contact.length === 0) {
        return res.status(400).json({
          message: "Invalid emergency contact details",
        });
      }
  
      const existingEmergencyContact = await emergencyContactsModel.findOne({
        userId: user.userId,
      });
  
      if (!existingEmergencyContact) {
        // Create a new document with all contacts
        const newEmergencyContact = await emergencyContactsModel.create({
          userId: user.userId,
          contacts: contact,
        });
  
        return res.status(200).json({
          message: "Emergency contacts added successfully",
          data: newEmergencyContact,
        });
      } else {
        // Check for duplicates and add only new contacts
        const existingNumbers = existingEmergencyContact.contacts.map(
          (c) => c.phoneNumber
        );
  
        const newContacts = contact.filter(
          (c) => !existingNumbers.includes(c.phoneNumber)
        );
  
        if (newContacts.length === 0) {
          return res.status(400).json({
            message: "All contacts already exist",
          });
        }
  
        existingEmergencyContact.contacts.push(...newContacts);
        await existingEmergencyContact.save();
  
        return res.status(200).json({
          message: "Emergency contacts added successfully",
          data: existingEmergencyContact,
        });
      }
    } catch (err) {
      console.error("Error:", err);
      return res.status(500).json({
        message: "Internal Server Error: Emergency contacts not added",
      });
    }
  });
  


// route for getting all emergency contacts

router.get("/getContacts", authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(400).json({
        message: "Username not found",
      });
    }

    const details = await emergencyContactsModel.findOne({
      userId: user.userId,
    });

    if (!details) {
      return res.status(400).json({
        message: "NO Emergency Contacts found",
      });
    }

    return res.status(200).json({
      contacts: details.contacts,
      message: "Emergency Contacts send successfully",
    });
  } catch (err) {
    console.log("Error = ", err);
    return res.status(500).json({
      message: "Internal Server Error: Emergency Contacts not added ",
    });
  }
});

// route for deleting an emergency contact

router.post("/deleteContact", authMiddleware, async (req, res) => {
  try {
    const { contactId } = req.body;
    const user = req.user;

    // if (!username) {
    //   return res.status(400).json({
    //     message: "Username not found",
    //   });
    // }

    if (!contactId) {
      return res.status(400).json({
        message: "Contact ID not found in the body of request",
      });
    }

    const emergencyDetails = await emergencyContactsModel.findOne({ userId: user.userId });
    if (!emergencyDetails) {
      return res.status(400).json({
        message: "No contacts to delete",
      });
    }

    const indexOfContactToDelete = emergencyDetails.contacts.findIndex(
      (contact) => contact.id === contactId
    );

    if (indexOfContactToDelete === -1) {
      return res.status(400).json({
        message: "Contact not found to delete",
      });
    }

    emergencyDetails.contacts.splice(indexOfContactToDelete, 1);
    await emergencyDetails.save();
    return res.status(200).json({
      message: "Emergency contact deleted successfully",
    });
  } catch (err) {
    console.log("Error = ", err);
    return res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
