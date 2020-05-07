import { db, admin } from "../util/admin";
import { Request, Response } from "express";
import { validateBusinessData } from "../util/validators";
import * as BusBoy from "busboy";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import { firebaseConfig } from "../util/config";

const updateBusiness = async (req: Request, res: Response) => {
  const userType = req.body.userType;
  const noImg = "no-img.png";
  const businessInfo = {
    name: req.body.name,
    queue: [],
    category: req.body.category,
    description: req.body.description,
    email: req.body.email,
    employees: [],
    hours: req.body.hours,
    address: req.body.address,
    website: req.body.website,
    phoneNumber: req.body.phoneNumber,
    lastUpdated: new Date().toISOString(),
    imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
  };

  if (userType === "manager") {
    const { valid, errors } = validateBusinessData(businessInfo);

    if (!valid) {
      return res.status(400).json(errors);
    } else {
      const businessRef = db.collection("businesses").doc(businessInfo.name);
      await businessRef
        .get()
        .then((docSnapshot) => {
          if (docSnapshot.exists) {
            businessRef.update(businessInfo);
            return res.status(200).json({
              general: `Business ${businessInfo.name} has been successfully updated`,
            });
          } else {
            db.doc(`/businesses/${businessInfo.name}`)
              .set(businessInfo)
              .then(() => {
                return res.status(201).json({
                  general: `Business ${businessInfo.name} created successfully`,
                });
              });
            return res.status(201);
          }
        })
        .catch(() => {
          return res
            .status(500)
            .json({ general: "Something went wrong. Please try again" });
        });
      return res.status(200);
    }
  } else {
    return res.status(403).json({
      general: "Access forbidden. Please login as a customer to gain access.",
    });
  }
};

const uploadBusinessImage = (req: Request, res: Response) => {
  const busboy = new BusBoy({ headers: req.headers });
  interface imageObject {
    filepath: string;
    mimetype: string;
  }
  const businessName = req.body.businessName;
  const userType = req.body.userType;
  if (userType === "manager") {
    let imageFileName: string;
    let imageToBeUploaded: imageObject;
    busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
      // my.image.png => ['my', 'image', 'png']
      console.log(fieldname, file, filename, encoding, mimetype);
      const imageExtension = filename.split(".")[
        filename.split(".").length - 1
      ];
      imageFileName = `${Math.round(
        Math.random() * 1000000000000
      ).toString()}.${imageExtension}`;

      const filepath = path.join(os.tmpdir(), imageFileName);
      imageToBeUploaded = { filepath, mimetype };

      file.pipe(fs.createWriteStream(filepath));
    });
    busboy.on("finish", () => {
      admin
        .storage()
        .bucket()
        .upload(imageToBeUploaded.filepath, {
          resumable: false,
          metadata: {
            contentType: imageToBeUploaded.mimetype,
          },
        })
        .then(() => {
          const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
          return db.doc(`/businesses/${businessName}`).update({ imageUrl });
        })
        .then(() => {
          return res.json({ message: "Image uploaded successfully" });
        })
        .catch((err) => {
          console.error(err);
          return res
            .status(500)
            .json({ general: "Something went wrong, please try again" });
        });
    });
    busboy.end(req.body);
    return res.status(201);
  } else {
    return res.status(403).json({
      general: "Access forbidden. Please login as a business to gain access.",
    });
  }
};

export { updateBusiness, uploadBusinessImage };
