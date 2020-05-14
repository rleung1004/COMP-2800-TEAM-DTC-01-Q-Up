import {db, admin} from "../util/admin";
import {Request, Response} from "express";
import {validateBusinessData} from "../util/validators";
import * as BusBoy from "busboy";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import {firebaseConfig} from "../util/config";
import {createQueue} from "./queues";

/**
 * Registers a business.
 */
export const registerBusiness = async (req: Request, res: Response) => {
    const noImg = "no-img.png";
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
    };
    const businessInfo = {
        averageWaitTime: req.body.averageWaitTime,
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        email: req.body.email,
        employees: [],
        queue: req.body.name,
        hours: req.body.hours,
        address: req.body.address,
        website: req.body.website,
        phoneNumber: req.body.phoneNumber,
        lastUpdated: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
    };

    if (requestData.userType == "manager") {
        return res.status(403).json({general: "Access forbidden. Please login as a customer to gain access."});
    }

    const {valid, errors} = validateBusinessData(businessInfo);
    if (!valid) {
        return res.status(400).json(errors);
    }

    return await db
        .collection('businesses')
        .doc(businessInfo.name)
        .set(businessInfo)
        .then(() => {
            db
                .collection("users")
                .doc(req.body.userEmail)
                .update({businessName: businessInfo.name});
            return createQueue(req, res);
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                general: "Something went wrong. Please try again",
                error: err,
            });
        });
};

/**
 * Updates the business info
 */
export const updateBusiness = async (req: Request, res: Response) => {
    const noImg = "no-img.png";
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
    };
    const businessInfo = {
        name: req.body.name,
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

    if (requestData.userType == "manager") {
        return res.status(403).json({general: "Access forbidden. Please login as a customer to gain access."});
    }

    const {valid, errors} = validateBusinessData(businessInfo);
    if (!valid) {
        return res.status(400).json(errors);
    }
    return await db
        .collection("businesses")
        .doc(businessInfo.name)
        .get()
        .then(() => {
            db.collection("users").doc(req.body.userEmail).update({businessName: businessInfo.name});
            return res.status(200).json({
                general: `Business ${businessInfo.name} has been successfully updated`
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                general: "Something went wrong. Please try again",
                error: err,
            });
        });
};

/**
 * Uploads the business image.
 */
export const uploadBusinessImage = (req: Request, res: Response) => {
    const busboy = new BusBoy({headers: req.headers});

    interface imageObject {
        filepath: string;
        mimeType: string;
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
            imageToBeUploaded = {filepath, mimeType: mimetype};

            file.pipe(fs.createWriteStream(filepath));
        });
        busboy.on("finish", () => {
            admin
                .storage()
                .bucket()
                .upload(imageToBeUploaded.filepath, {
                    resumable: false,
                    metadata: {
                        contentType: imageToBeUploaded.mimeType,
                    },
                })
                .then(() => {
                    const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
                    return db.doc(`/businesses/${businessName}`).update({imageUrl});
                })
                .then(() => {
                    return res.json({message: "Image uploaded successfully"});
                })
                .catch((err) => {
                    console.error(err);
                    return res
                        .status(500)
                        .json({general: "Something went wrong, please try again"});
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

/**
 * Gets the business info.
 */
export const getBusiness = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized",
        })
    }
    return await db
        .collection("businesses")
        .doc(requestData.businessName)
        .get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                const businessData = docSnapshot.data();
                return res.status(200).json({
                    general: 'successful',
                    businessData: businessData,
                })
            }
            return res.status(500).json({
                general: "Your business is not registered. Please register your business.",
            });

        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                general: "Something went wrong. Please try again",
                error: err,
            });
        });
};

/**
 * Deletes a business.
 */
export const deleteBusiness = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized",
        })
    }
    return await db
        .collection('businesses')
        .doc(requestData.businessName)
        .delete()
        .then(() => {
            return db
                .collection('queues')
                .doc(requestData.businessName)
                .delete()
                .then(()=> res.status(200).json({general:'deleted the business and its queue successfully'}))
        })
        .catch((err) => {
            console.error(err);
            return res.status(500).json({
                general: "Something went wrong. Please try again",
                error: err,
            });
        });
};
