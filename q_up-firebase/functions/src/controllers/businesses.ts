import {admin, db, firebaseConfig} from "../util/firebaseConfig";
import {Request, Response} from "express";
import * as BusBoy from "busboy";
import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import {imageObject, validateBusinessData} from "../util/helpers";
import {registerNewBooth, registerNewDisplay} from "./boothsAndDisplays";

/**
 * Registers a business.
 * first Checks if the accessing user has the authority, then checks the validity of the provided info, then registers
 * the user and creates a queue for it. Registers a default booth and a default display for the business as well.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 403 if provided information are not valid
 *                  - 404 if can not register booth properly
 *                  - 404 if can not register display properly
 *                  - 409 if the business already exists
 *                  - 500 if an error occurs in the midst of the query
 *                  - 201 if created the business successfully
 *                  - null if its getting called from updateBusiness
 */
export const registerBusiness = async (req: Request, res: Response) => {
    const noImg = "no-img.png";
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
        businessName: req.body.businessName,
        isUpdating: req.body?.isUpdating,
        gadgetPassword: req.body.gadgetPassword,
        gadgetConfirmPassword: req.body.gadgetConfirmPassword,
    };
    const businessInfo = {
        name: requestData.businessName,
        category: req.body.category,
        description: req.body.description,
        email: req.body.email,
        employees: [],
        queue: {
            averageWaitTime: req.body.averageWaitTime,
            currentWaitTime: 0,
            highestVipTicketNumber: 0,
            highestNonVipTicketNumber: 0,
            queueSlots: [],
            isActive: false,
        },
        hours: req.body.hours,
        address: req.body.address,
        website: req.body.website,
        phoneNumber: req.body.phoneNumber,
        lastUpdated: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${noImg}?alt=media`,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    const {valid, errors} = validateBusinessData(businessInfo);
    if (!valid) {
        return res.status(403).json(errors);
    }
    if (requestData.gadgetPassword !== requestData.gadgetConfirmPassword) {
        return res.status(403).json({gadgetConfirmPassword: "Passwords must match"});
    }
    const doesExist = await db
        .collection('businesses')
        .doc(requestData.businessName)
        .get()
        .then(data => data.exists);
    if (doesExist) {
        return res.status(409).json({general: "The business already exists!"});
    }
    return await db
        .collection('businesses')
        .doc(businessInfo.name)
        .set(businessInfo)
        .then(async () => {
            await db
                .collection("users")
                .doc(req.body.userEmail)
                .update({businessName: businessInfo.name})
                .catch(err => console.error(err));
            const [registeredBooth] = await Promise.all([registerNewBooth(req)]);
            console.log(`registeredBooth value is: ${registeredBooth}`);
            if (!registeredBooth) {
                return res.status(404).json({general: "did not register the booth properly!"})
            }
            Object.assign(req.body, {userType: 'manager'});
            const [registeredDisplay] = await Promise.all([registerNewDisplay(req)]);
            console.log(`registeredDisplay value is: ${registeredDisplay}`);
            if (!registeredDisplay) {
                return res.status(404).json({general: "did not register the display properly!"})
            }
            if (requestData.isUpdating) {
                return null;
            }
            return res.status(201).json({general: "registered the business successfully"})
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};

/**
 * Updates the business info.
 * first Checks if the accessing user has the authority, then checks the validity of the provided info, then gets the
 * necessary information from the old business and queue, then deletes the business and queue, then creates a new
 * business and queue and then upates the new information with the old necessary info.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 403 if provided information are not valid
 *                  - 404 if the business can not be found
 *                  - 500 if an error occurs in the midst of the query
 *                  - 202 if updated the business successfully
 */
export const updateBusiness = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    const businessInfo = {
        name: req.body.name,
        category: req.body.category,
        description: req.body.description,
        email: req.body.email,
        hours: req.body.hours,
        address: req.body.address,
        website: req.body.website,
        phoneNumber: req.body.phoneNumber,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    const {valid, errors} = validateBusinessData(businessInfo);
    if (!valid) {
        return res.status(403).json(errors);
    }
    const oldBusinessInfo: any = await db
        .collection('businesses')
        .where('name', '==', requestData.businessName)
        .get()
        .then(data => {
            return {
                employees: data.docs[0].data().employees,
                imageUrl: data.docs[0].data().imageUrl,
                queue: data.docs[0].data().queue,
            }
        })
        .catch(err => {
            console.error(err);
            return null;
        });
    if (oldBusinessInfo === null) {
        return res.status(404).json({general: 'did not find the old business information before updating!'});
    }
    for (const employee of oldBusinessInfo.employees) {
        await db.collection('users')
            .doc(employee)
            .update({businessName: businessInfo.name})
            .catch(err => console.error(err));
    }
    if (oldBusinessInfo.queue.queueSlots.length !== 0) {
        const customers: Array<string> = oldBusinessInfo.queue.queueSlots.map((queueSlot: any) => queueSlot.customer);
        for (const customer of customers) {
            await db.collection('users').doc(customer).update({currentQueue: businessInfo.name});
        }
    }
    await db
        .collection('users')
        .where('businessName', '==', requestData.businessName)
        .where('userType', '==', 'booth')
        .get()
        .then(dataList => {
            dataList.forEach(async (data) => {
                await db
                    .collection('users')
                    .doc(data.data().businessName)
                    .update({businessName: businessInfo.name})
            })
        })
        .catch(err => console.error(err));
    await db
        .collection('users')
        .where('businessName', '==', requestData.businessName)
        .where('userType', '==', 'display')
        .get()
        .then(dataList => {
            dataList.forEach(async (data) => {
                await db
                    .collection('users')
                    .doc(data.data().businessName)
                    .update({businessName: businessInfo.name})
            })
        })
        .catch(err => console.error(err));
    await db
        .collection('businesses')
        .doc(requestData.businessName)
        .delete()
        .catch(err => console.error(err));
    Object.assign(req.body, {
        businessName: businessInfo.name,
        averageWaitTime: oldBusinessInfo.queue.averageWaitTime,
        isUpdating: true,
    });
    await registerBusiness(req, res);
    return await db
        .collection('businesses')
        .doc(businessInfo.name)
        .update({
            employees: oldBusinessInfo.employees,
            imageUrl: oldBusinessInfo.imageUrl,
            queue: oldBusinessInfo.queue,
        })
        .then(async () => {
            return await db
                .collection('users')
                .doc(requestData.userEmail)
                .update({businessName: businessInfo.name})
                .then(() => res.status(202).json({
                    general: `Business ${businessInfo.name} has been successfully updated`,
                }))
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};

/**
 * Uploads the business image.
 * first, checks if the user uploading an image is a manager, then it uploads the image to our storage, and update the
 * business url in the database.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 500 if an error occurs in the midst of the query
 *                  - 201 if successful
 */
export const uploadBusinessImage = (req: Request, res: Response) => {
    const busboy = new BusBoy({headers: req.headers});
    const businessName = req.body.businessName;
    const userType = req.body.userType;
    if (userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    let imageFileName: string;
    let imageToBeUploaded: imageObject;
    busboy.on("file", (fieldName, file, filename, encoding, mimeType) => {
        console.log(fieldName, file, filename, encoding, mimeType);
        const imageExtension = filename.split(".")[filename.split(".").length - 1];
        imageFileName = `${Math.round(Math.random() * 1000000000000).toString()}.${imageExtension}`;
        const filepath = path.join(os.tmpdir(), imageFileName);
        imageToBeUploaded = {filepath, mimeType: mimeType};
        file.pipe(fs.createWriteStream(filepath));
    });
    const message: any = busboy.on("finish", () => {
        return admin
            .storage()
            .bucket()
            .upload(imageToBeUploaded.filepath, {
                resumable: false,
                metadata: {contentType: imageToBeUploaded.mimeType,}
            })
            .then(async () => {
                const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseConfig.storageBucket}/o/${imageFileName}?alt=media`;
                return await db
                    .collection('businesses')
                    .doc(businessName)
                    .update({imageUrl: imageUrl})
                    .then(() => res.status(201).json({message: "Image uploaded successfully!"}))
            })
            .catch(async (err) => {
                console.error(err);
                return res.status(500).json({
                    general: "Internal Error. Something went wrong!",
                    error: await err.toString(),
                });
            });
    });
    busboy.end(req.body);
    return message;
};

/**
 * Gets the business info.
 * first, checks if the user uploading an image is a manager, then checks if the business exists, then it will get the
 * information of the business.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 404 if the business is not registered
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const getBusiness = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    return await db
        .collection("businesses")
        .where('name', '==', requestData.businessName)
        .get()
        .then((data) => {
            if (!data.docs[0].data()) {
                return res.status(404).json({
                    general: "Your business is not registered. Please register your business.",
                });
            }
            const businessData = data.docs[0].data();
            return res.status(200).json({
                general: 'obtained business information successfully',
                businessData: {
                    averageWaitTime: businessData.averageWaitTime,
                    category: businessData.category,
                    description: businessData.description,
                    email: businessData.email,
                    hours: businessData.hours,
                    address: businessData.address,
                    name: businessData.name,
                    website: businessData.website,
                    phoneNumber: businessData.phoneNumber,
                }
            })
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};

/**
 * Deletes the employee for the specific business.
 * first gets the employee user id, then deletes it from the database and authentication.
 *
 * @param employeeEmail     a string.
 */
const deleteEmployeeFromBusiness = async (employeeEmail: string) => {
    const employeeUID: string = await db
        .collection("users")
        .where("userType", "==", "employee")
        .where("email", "==", employeeEmail)
        .get()
        .then((data) => data.docs[0].data().userId)
        .catch((err) => {
            console.error(err);
            return null;
        });
    await db
        .collection("users")
        .doc(employeeEmail)
        .delete()
        .then(() => admin.auth().deleteUser(employeeUID))
        .catch((err) => console.error(err));
    await admin
        .auth()
        .deleteUser(employeeUID)
        .catch(err => console.error(err));
};

/**
 * Deletes the booth for the specific business.
 * first gets the booth user id, then deletes it from the database and authentication.
 *
 * @param boothEmail    a string
 */
const deleteBoothFromBusiness = async (boothEmail: string) => {
    const boothUID: string = await db
        .collection("users")
        .where("userType", "==", "booth")
        .where("email", "==", boothEmail)
        .get()
        .then((data) => data.docs[0].data().userId)
        .catch((err) => {
            console.error(err);
            return null;
        });
    await db
        .collection('users')
        .doc(boothEmail)
        .delete()
        .then(async () => await admin.auth().deleteUser(boothUID))
        .catch(err => console.error(err))
};


/**
 * Deletes the display for the specific business.
 * first gets the display user id, then deletes it from the database and authentication.
 *
 * @param displayEmail    a string
 */
const deleteDisplayFromBusiness = async (displayEmail: string) => {
    const boothUID: string = await db
        .collection("users")
        .where("userType", "==", "display")
        .where("email", "==", displayEmail)
        .get()
        .then((data) => data.docs[0].data().userId)
        .catch((err) => {
            console.error(err);
            return null;
        });
    await db
        .collection('users')
        .doc(displayEmail)
        .delete()
        .then(async () => await admin.auth().deleteUser(boothUID))
        .catch(err => console.error(err))
};

/**
 * Deletes a business.
 * first, checks if the user uploading an image is a manager, then deletes the business and the queue, then deletes the
 * user from database and the authentication. finally, deletes the employees and the booths of that business
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 404 if the manger id is not found
 *                  - 500 if an error occurs in the midst of the query
 *                  - 202 if successful
 */
export const deleteBusiness = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    const managerID: string = await db
        .collection('users')
        .where('email', '==', requestData.userEmail)
        .get()
        .then(data => data.docs[0].data().userId)
        .catch((err) => {
            console.error(err);
            return null;
        });
    if (!managerID) {
        return res.status(404).json({general: 'did not find the manger id!'})
    }
    await db
        .collection('businesses')
        .where('name', '==', requestData.businessName)
        .get()
        .then(data => {
            data.docs[0]
                .data().employees
                .forEach(async (employeeEmail: string) => await deleteEmployeeFromBusiness(employeeEmail));
        })
        .catch(err => console.error(err));
    await db
        .collection('users')
        .where('userType', '==', 'booth')
        .where('businessName', '==', requestData.businessName)
        .get()
        .then((dataList) => {
            if (!dataList.empty) {
                dataList.forEach((data => {
                    deleteBoothFromBusiness(data.data().email);
                }))
            }
        })
        .catch(err => console.error(err));
    await db
        .collection('users')
        .where('userType', '==', 'display')
        .where('businessName', '==', requestData.businessName)
        .get()
        .then((dataList) => {
            if (!dataList.empty) {
                dataList.forEach((data => {
                    deleteDisplayFromBusiness(data.data().email);
                }))
            }
        })
        .catch(err => console.error(err));
    return await db
        .collection('businesses')
        .doc(requestData.businessName)
        .delete()
        .then(async () => {
            return await db
                .collection('users')
                .doc(requestData.userEmail)
                .delete()
                .then(async () => {
                    return await admin
                        .auth()
                        .deleteUser(managerID)
                        .then(() => res.status(202).json({
                            general: 'deleted the business and its queue successfully'
                        }))
                })
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};

