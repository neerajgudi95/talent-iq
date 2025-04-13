const cloudinary = require("cloudinary").v2;

const resumeUpload = async (resume, user) => {
  if (resume.mimetype !== "application/pdf" || resume.size > 3 * 1024 * 1024) {
    throw new Error("Only pdf under 3MB is allowed as resume");
  } else {
    try {
      const secureResumeUrl = await cloudinary.uploader.upload(resume.filepath, {
        resource_type: "raw",
        folder: "resumes",
        public_id: user.resume?.publicId ?? `${user.firstName}-${user.lastName}_talenIQ_${Date.now()}`,
        use_filename: true,
      });
      return secureResumeUrl;
    } catch (error) {
      throw new Error(error.message);
      //   throw new Error("Something went wrong while uploading resume, please check with administrator");
    }
  }
};

module.exports = resumeUpload;
