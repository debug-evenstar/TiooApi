const { CTProfile } = require("../database/connection");

class CTController {
  static async handleFormSubmission(req, res) {
    const user_id = req.userData.id;

    try {
      const {
        email,
        surname,
        first_name,
        other_name,
        gender,
        telegram_phone,
        whatsapp_number,
        parent_name,
        parent_phone,
        desired_course,
        institution,
        subject_combination,
        weak_subject,
        main_challenge,
        fear,
        payment_date,
        sender_name,
        bank_name,
        referral_source,
        reason_for_joining,
        birthday,
      } = req.body;

      const receipt_files = req.files?.receiptFiles; // Handle uploaded files (if using middleware like multer)
      const profile_picture = req.files?.profilePicture; // Handle profile picture upload

      let profile = await CTProfile.findOne({
        where: { account_id: user_id }
      })

      if (profile) {
        await profile.update({
          surname,
          first_name,
          other_name,
          gender,
          telegram_phone,
          whatsapp_number,
          parent_name,
          parent_phone,
          desired_course,
          institution,
          subject_combination,
          weak_subject,
          main_challenge,
          fear,
          payment_date,
          sender_name,
          bank_name,
          referral_source,
          reason_for_joining,
          birthday,
          receipt_files: JSON.stringify(receipt_files || []), // Convert file data to JSON string
        });
      } else {
        profile = await CTProfile.create({
          account_id: user_id,
          email,
          surname,
          first_name,
          other_name,
          gender,
          telegram_phone,
          whatsapp_number,
          parent_name,
          parent_phone,
          desired_course,
          institution,
          subject_combination,
          weak_subject,
          main_challenge,
          fear,
          payment_date,
          sender_name,
          bank_name,
          referral_source,
          reason_for_joining,
          birthday,
          receipt_files: JSON.stringify(receipt_files || []), // Convert file data to JSON string
        });
      }


      res.status(201).json({
        error: false,
        message: "Profile created successfully!",
        data: profile,
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      res.status(500).json({
        error: false,
        // message: "Failed to submit form. Please try again.",
        message: error.message,
      });
    }
  }
}

module.exports = CTController;