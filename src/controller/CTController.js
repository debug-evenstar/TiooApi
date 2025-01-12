class CTController {

  static async handleFormSubmission(req, res){

    const user_id = req.userData.id;

    try {
      const {
        email,
        registrationNo,
        surname,
        firstName,
        otherName,
        gender,
        telegramPhone,
        whatsappNumber,
        parentName,
        parentPhone,
        desiredCourse,
        desiredUtmeScore,
        institution,
        subjectCombination,
        weakSubject,
        mainChallenge,
        fear,
        paymentDate,
        senderName,
        bankName,
        referralSource,
        reasonForJoining,
        birthday,
      } = req.body;

      const receiptFiles = req.files?.receiptFiles; // Handle uploaded files (if using middleware like multer)
      const profilePicture = req.files?.profilePicture; // Handle profile picture upload

      const newProfile = await CTModel.create({
        account_id: user_id,
        email,
        registrationNo,
        surname,
        firstName,
        otherName,
        gender,
        telegramPhone,
        whatsappNumber,
        parentName,
        parentPhone,
        desiredCourse,
        desiredUtmeScore,
        institution,
        subjectCombination,
        weakSubject,
        mainChallenge,
        fear,
        paymentDate,
        senderName,
        bankName,
        referralSource,
        reasonForJoining,
        birthday,
        receiptFiles: JSON.stringify(receiptFiles || []), // Convert file data to JSON string
      });

      res.status(201).json({
        success: true,
        message: "Profile created successfully!",
        data: newProfile,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({
        success: false,
        message: "Failed to submit form. Please try again.",
        error: error.message,
      });
    }
  }
}

module.exports = CTController;