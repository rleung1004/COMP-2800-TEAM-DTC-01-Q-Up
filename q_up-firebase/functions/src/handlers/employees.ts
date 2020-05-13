import {admin, db} from "../util/admin";
import {Request, Response} from "express";
import {signup} from "./users";
import * as firebase from "firebase-admin";

/**
 * Creates a new Employee
 */
const createNewEmployee = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        password: req.body.password,
        businessName: req.body.businessName,
        email: req.body.email,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    Object.assign(req.body, {userType: "employee"});
    Object.assign(req.body, {confirmPassword: requestData.password});
    await signup(req, res);
    return await db
        .collection('businesses')
        .where('name', '==', requestData.businessName)
        .get()
        .then(data => {
            const employeeList: Array<string> = data.docs[0].data().employees;
            employeeList.push(requestData.email);
            db.collection('businesses').doc(requestData.businessName).update({employees: employeeList});
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).json({
                general: "Something went wrong",
                error: err,
            });
        });
};

/**
 * Updates the employee credentials.
 */
const updateEmployee = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        employeePreviousCredentials: req.body.employeePreviousCredentials,
        employeeNewCredentials: req.body.employeeNewCredentials,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    const isEmployeeOfBusiness: boolean = await db
        .collection("businesses")
        .where("name", "==", requestData.businessName)
        .get()
        .then((data) => {
            let employeeList: Array<string> = data.docs[0].data().employees;
            const result: boolean = employeeList.includes(requestData.employeePreviousCredentials.email);
            if (result) {
                db.collection('businesses').doc(requestData.businessName).update({
                    employees: firebase.firestore.FieldValue.arrayRemove(requestData.employeePreviousCredentials.email)
                });
            }
            return result
        })
        .catch(() => {
            console.error("Error in the employee lookup for the business!");
            return false;
        });
    if (!isEmployeeOfBusiness) {
        return res.status(401).json({
            general: "the employee is not enrolled in your the business",
        });
    }
    const employeeUID: string = await db
        .collection("users")
        .where("userType", "==", "employee")
        .where("email", "==", requestData.employeePreviousCredentials.email)
        .get()
        .then((data) => {
            return data.docs[0].data().userId;
        })
        .catch(() => null);
    if (employeeUID === null) {
        return res.status(404).json({
            general: "did not find the employee to update",
        });
    }
    return await db
        .collection('users')
        .doc(requestData.employeePreviousCredentials.email)
        .delete()
        .then(() => {
            db
                .collection('users')
                .doc(requestData.employeeNewCredentials.email)
                .set({
                    userType: 'employee',
                    businessName: requestData.businessName,
                    email: requestData.employeeNewCredentials.email,
                    isOnline: false,
                    queueName: requestData.businessName,
                    userID: employeeUID,
                })
                .then(() => {
                    return admin
                        .auth()
                        .updateUser(employeeUID, requestData.employeeNewCredentials)
                        .then(() =>
                            res.status(200).json({general: "updated the employee successfully"})
                        );
                })
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).json({
                general: "Something went wrong",
                error: err,
            });
        });
};

/**
 * deletes the employee
 */
const deleteEmployee = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        employeeEmail: req.body.employeeEmail,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    const isEmployeeOfBusiness: boolean = await db
        .collection("businesses")
        .where("name", "==", requestData.businessName)
        .get()
        .then((data) => {
            let employeeList: Array<string> = data.docs[0].data().employees;
            const result = employeeList.includes(requestData.employeeEmail);
            employeeList = employeeList.filter((employee) => employee !== requestData.employeeEmail);
            db.collection("businesses")
                .doc(requestData.businessName)
                .update({employees: employeeList});
            console.log(result);
            return result;
        })
        .catch((err) => {
            console.error(err);
            return false;
        });
    if (!isEmployeeOfBusiness) {
        return res.status(401).json({
            general: "the employee is not enrolled in your the business",
        });
    }
    const employeeUID: string = await db
        .collection("users")
        .where("userType", "==", "employee")
        .where("email", "==", requestData.employeeEmail)
        .get()
        .then((data) => {
            return data.docs[0].data().userId;
        })
        .catch(() => null);
    if (employeeUID === null) {
        return res.status(404).json({
            general: "did not find the employee to delete",
        });
    }
    return await db
        .collection("users")
        .doc(requestData.employeeEmail)
        .delete()
        .then(() => {
            return admin
                .auth()
                .deleteUser(employeeUID)
                .then(() =>
                    res.status(200).json({general: "deleted the employee successfully"})
                );
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).json({
                general: "Something went wrong",
                error: err,
            });
        });
};

/**
 * Remove the users from the queue by the employee
 */
const checkInQueue = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
        queueName: req.body.queueName,
        ticketNumber: req.body.ticketNumber,
    };
    if (requestData.userType !== "employee") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    const isAuthorized: boolean = await db
        .collection("businesses")
        .where("name", "==", requestData.queueName)
        .get()
        .then((data) => {
            let employeeList: Array<string> = data.docs[0].data().employees;
            return employeeList.includes(requestData.userEmail);
        })
        .catch(() => false);
    if (!isAuthorized) {
        return res.status(401).json({
            general:
                "the employee is unauthorized to change the queue of another business",
        });
    }
    const customerLookUp: any = await db
        .collection("queues")
        .where("queueName", "==", requestData.queueName)
        .get()
        .then((data) => {
            let queueSlots: Array<any> = data.docs[0].data().queueSlots;
            const result: boolean = queueSlots.find(
                (queueSlot) => queueSlot.ticketNumber === requestData.ticketNumber
            );
            queueSlots.splice(queueSlots.indexOf(result), 1);
            db.collection("queues")
                .doc(requestData.queueName)
                .update({queueSlots: queueSlots});
            return result;
        })
        .catch(() => null);
    if (customerLookUp === null) {
        return res
            .status(404)
            .json({general: "Did not find the customer to checkIn!"});
    }
    return await db
        .collection("users")
        .doc(customerLookUp.customer)
        .get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                db.collection("users")
                    .doc(customerLookUp.customer)
                    .update({currentQueue: null});
            }
            return res.status(200).json({
                general: "Removed the customer from the queue Successfully",
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).json({
                general: "Something went wrong",
                error: err,
            });
        });
};

/**
 * Gets the list of all employees for a business.
 */
const getListOfAllEmployees = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    let employeeInfoList: any = {};
    return await db
        .collection("users")
        .where("userType", "==", "employee")
        .where("businessName", "==", requestData.businessName)
        .get()
        .then((dataList) => {
            console.log(dataList.docs[0]);
            if (dataList.empty) {
                return res.status(404).json({general: "did not find any employees!"});
            }
            dataList.docs.forEach((data) => {
                employeeInfoList[data.data().email] = data.data();
            });
            return res.status(200).json({
                general: "successful",
                resData: employeeInfoList,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).json({
                general: "Something went wrong",
                error: err,
            });
        });
};

/**
 * Gets the number of online employees in a business.
 */
const getOnlineEmployees = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    return await db
        .collection("users")
        .where("userType", "==", "employee")
        .where("businessName", "==", requestData.businessName)
        .get()
        .then((dataList) => {
            if (dataList.empty) {
                return res.status(404).json({general: "did not find any employees!"});
            }
            let onlineEmployeeCount: number = 0;
            dataList.docs.forEach((data) => {
                if (data.data().isOnline) {
                    onlineEmployeeCount++;
                }
            });
            return res.status(200).json({
                general: "successful",
                onlineEmployees: onlineEmployeeCount,
            });
        })
        .catch((err) => {
            console.error(err);
            return res.status(400).json({
                general: "Something went wrong",
                error: err,
            });
        });
};

export {
    createNewEmployee,
    updateEmployee,
    deleteEmployee,
    checkInQueue,
    getListOfAllEmployees,
    getOnlineEmployees,
};
