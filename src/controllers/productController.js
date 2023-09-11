import asyncHandler from "express-async-handler";
import Email from "../Models/emailModel.js";
import Template from "../Models/templateModel.js";
import cloudinary from "../utils/cloudinary.js";
import { incrementEmailOpenedCount } from "./employeeController.js";

/// fetching all template
/// public route
/// api/template
export const getAllTemplates =
  ("/",
  asyncHandler(async (req, res) => {
    try {
      const templates = await Template.find();

      res.json(templates);
    } catch (error) {
      res.json(error.message);
    }
  }));
  
/// fetching all sent email
/// private route
/// api/template/sentemail
export const getSentEmail =
  ("/sentemail",
  asyncHandler(async (req, res) => {
    if (req.user.role === "admin") {
      try {
        const emails = await Email.find();

        res.json(emails);
      } catch (error) {
        res.status(404);
        throw new Error("email Not Found....");
      }
    } else {
      try {
        const emails = await Email.find({ businessid: req.user._id });

        res.json(emails);
      } catch (error) {
        res.status(404);
        throw new Error("email Not Found....");
      }
    }
  }));

/// add new Template
/// private route
/// api/template/add
export const createTemplate =
  ("/add",
  asyncHandler(async (req, res) => {
    // console.log(req.body.image[1]);

    let { title, subject, emailfrom, image, body,publicAccess } = req.body;

    if (image) {
      // image.push('https://via.placeholder.com/600x800')

      let uploadedImagePublicId = [];
      try {
        const result = await cloudinary.uploader.upload(image, {
          folder: "email-management/template",
        });
        uploadedImagePublicId.push({
          url: result.secure_url,
          publicId: result.public_id,
        });

        // uploadedImage.push(uploadResult)

        try {
          const template = new Template({
            business: {id:req.user._id,name:req.user.name},
            title,
            subject,
            emailfrom,
            image: result.secure_url,
            imagePublicId: uploadedImagePublicId,
            body,
            publicAccess,
          });

          const productAddDone = await template.save();
          if (productAddDone) {
            res.json(productAddDone);
          }
        } catch (error) {
          console.log(error);
          throw new Error("server error");
        }
      } catch (error) {
        console.log(error);
        throw new Error("problem with image upload");
      }
    } else {
      try {
        const template = new Template({
          business: {id:req.user._id,name:req.user.name},
          title,
          subject,
          emailfrom,
          body,
          publicAccess
        });

        const productAddDone = await template.save();
        if (productAddDone) {
          res.json(productAddDone);
        }
      } catch (error) {
        console.log(error);
        throw new Error("server error");
      }
    }
  }));

/// update Template
/// private route
/// api/template/update/:id
export const updateTemplate =
  ("/update/:id",
  asyncHandler(async (req, res) => {
    try {
      const template = await Template.findOneAndUpdate(
        { _id: req.params.id },
        req.body.changedField
      );
      if (template) {
        res.json({ success: true, message: "template updated successfully" });
      } else {
        res.status(500);
        throw new Error("Internal error");
      }
    } catch (error) {
      res.status(404);
      res.json({ success: false, message: "template not found" });
    }
  }));

export const makeEmailRead =
  ("/readmail",
  asyncHandler(async (req, res) => {
    // return
    try {
      const template = await Email.findOneAndUpdate(
        { templateid: req.body.templateid, employeeid: req.body.empid },
        { seen: true }
      );
      incrementEmailOpenedCount(req.body.empid);
      if (template) {
        res.json({ success: true, message: "template updated successfully" });
      } else {
        res.status(200);
        // throw new Error("Internal error");
      }
    } catch (error) {
      res.status(200);
      console.log("error");
      res.json({ success: false, message: "template not found" });
    }
  }));

/// delete Template
/// private route
/// api/template/delete/:id
export const deleteTemplate =
  ("/delete/:id",
  asyncHandler(async (req, res) => {
    const template = await Template.deleteOne({ _id: req.params.id });
    if (template) {
      res.json({ success: true, message: "Template deleted successfully" });
    } else {
      res.status(404);
      throw new Error("template Not Found...");
    }
  }));

export const getTemplateDetails = async (id) => {
  try {
    const template = await Template.find({ _id: id });

    return template;
  } catch (error) {
    res.json(error.message);
  }
};

export const addEmailHistoryToDatabase = async (
  efrom,
  templateid,
  businessid,
  employeeid,
  employeename
) => {
  const email = new Email({
    from: efrom,
    templateid,
    businessid,
    employeeid,
    employeename,
  });

  const emailDone = await email.save();

  if (emailDone) {
    return true;
  } else {
  }
};

export const deleteEmail = async () => {
  const template = await Email.deleteMany({
    employeeid: { $ne: "632843d6411feadb43557395" },
  });
  if (template) {
    console.log("done");
  } else {
    console.log("problem with delete");
  }
};
