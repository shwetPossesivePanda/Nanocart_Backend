const TBYB = require("../../models/User/UserTBYB");
const uploadImageToS3 = require("../../utils/s3Upload");

exports.uploadImage = async (req, res) => {
  try {
    const { userId } = req.user;

    let tbybDoc = await TBYB.findOne({ userId });

    if (!tbybDoc) {
      tbybDoc = new TBYB({ userId, images: [] });
    }

    // Check how many images the user has uploaded today
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0)); // Start of the day (00:00:00)
    const endOfDay = new Date(today.setHours(23, 59, 59, 999)); // End of the day (23:59:59)

    // Filter images uploaded today
    const imagesToday = tbybDoc.images.filter(
      (img) => new Date(img.uploadedAt) >= startOfDay && new Date(img.uploadedAt) <= endOfDay
    );

    // If the user has already uploaded 5 images today, restrict further uploads
    if (imagesToday.length >= 5) {
      return res.status(400).json({
        success: false,
        message: "You can upload a maximum of 5 images per day.",
      });
    }

    // Upload the image to AWS S3
    if (!req.file) {
      return res.status(400).json({ success: false, message: "No image file uploaded." });
    }

    const folderName = `User/${userId}/TBYB/${Date.now()}-${req.file.originalname}`;
    const imageUrl = await uploadImageToS3(req.file, folderName);

    // Add the new image URL to the user's TBYB document
    tbybDoc.images.push({
      imageUrl,
      uploadedAt: new Date(), // Save the current date and time
    });

    // Save the document
    await tbybDoc.save();

    return res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      imageUrl: imageUrl,
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    return res.status(500).json({
      success: false,
      message: "Error uploading image",
      error: error.message,
    });
  }
};





exports.getTBYBImages = async (req, res) => {
  try {
    const userId = req.user._id;

    const tbybDoc = await TBYB.findOne({ userId });

    if (!tbybDoc || tbybDoc.images.length === 0) {
      return res.status(200).json(apiResponse(200, true, "No images found", []));
    }

    return res.status(200).json(
      apiResponse(200, true, "Images fetched successfully", tbybDoc.images)
    );
  } catch (error) {
    console.error("Error fetching TBYB images:", error);
    return res.status(500).json(
      apiResponse(500, false, "Internal server error", error.message)
    );
  }
};
