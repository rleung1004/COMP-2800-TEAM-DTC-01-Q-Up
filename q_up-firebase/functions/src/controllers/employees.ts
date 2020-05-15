import {admin, db} from "../util/firebaseConfig";
import {Request, Response} from "express";
import {signUp} from "./users";
import * as firebase from "firebase-admin";

/**
 * Creates a new Employee.
 * first, checks if the user is a manager, then signs up the new employee and finally adds the new employee to the
 * employee array in the business.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 409 if the employee already exists
 *                  - 500 if an error occurs in the midst of the query
 *                  - 201 if successful
 */
export const registerEmployee = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
        employeeEmail: req.body.employeeEmail,
        password: req.body.password,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    Object.assign(req.body, {userType: "employee"});
    Object.assign(req.body, {confirmPassword: requestData.password});
    const signedUpSuccessfully: boolean = await db
        .collection("users")
        .doc(requestData.employeeEmail)
        .get()
        .then(async data => {
            if (!data.exists) {
                await signUp(req, res);
                return true
            }
            return false
        })
        .catch(err => {
            console.log(err);
            return false;
        });
    if (!signedUpSuccessfully) {
        return res.status(409).json({general: "The employee already exists!"});
    }
    return await db
        .collection("businesses")
        .where("name", "==", requestData.businessName)
        .get()
        .then((data) => {
            const employeeList: Array<string> = data.docs[0].data().employees;
            employeeList.push(requestData.employeeEmail);
            db.collection("businesses").doc(requestData.businessName).update({employees: employeeList});
            return res.status(201).json({general: 'created the employee successfully!'})
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
 * Updates the employee credentials.
 * first, checks if the user is a manager, then checks if the employee belongs to the business, and then updates the
 * employee information in the users collection and businesses collection in the database.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 404 if the employee is not enrolled in the business
 *                  - 404 if the employee is not found
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const updateEmployee = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
        employeePreviousEmail: req.body.employeeEmail,
        employeeNewEmail: req.body.employeeNewEmail,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    const isEmployeeOfBusiness: boolean = await db
        .collection("businesses")
        .where("name", "==", requestData.businessName)
        .get()
        .then((data) => {
            let employeeList: Array<string> = data.docs[0].data().employees;
            const result: boolean = employeeList.includes(requestData.employeePreviousEmail);
            if (result) {
                db.collection("businesses").doc(requestData.businessName).update({
                        employees: firebase.firestore.FieldValue.arrayRemove(requestData.employeePreviousEmail),
                    });
                db.collection("businesses").doc(requestData.businessName).update({
                        employees: firebase.firestore.FieldValue.arrayUnion(requestData.employeeNewEmail),
                    });
            }
            return result;
        })
        .catch(() => {
            console.error("Error in the employee lookup for the business!");
            return false;
        });
    if (!isEmployeeOfBusiness) {
        return res.status(404).json({general: "the employee is not enrolled in your the business"});
    }
    const oldEmployeeInfo: any = await db
        .collection("users")
        .where("userType", "==", "employee")
        .where("email", "==", requestData.employeePreviousEmail)
        .get()
        .then((data) => {
            return {
                userId: data.docs[0].data().userId,
                isOnline: data.docs[0].data().isOnline,
            }
        })
        .catch(() => null);
    if (oldEmployeeInfo === null) {
        return res.status(404).json({general: "did not find the employee to update"});
    }
    return await db
        .collection("users")
        .doc(requestData.employeePreviousEmail)
        .delete()
        .then(() => {
            db
                .collection("users")
                .doc(requestData.employeeNewEmail)
                .set({
                    userType: "employee",
                    businessName: requestData.businessName,
                    email: requestData.employeeNewEmail,
                    isOnline: oldEmployeeInfo.isOnline,
                    queueName: requestData.businessName,
                    userId: oldEmployeeInfo.userId,
                })
                .then(async () => {
                    return await admin
                        .auth()
                        .updateUser(oldEmployeeInfo.userId, {email: requestData.employeeNewEmail})
                        .then(() => res.status(200).json({general: "updated the employee successfully"}));
                });
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
 * Deletes the employee.
 * first, checks if the user is a manager, then checks if the employee belongs to the business, and then deletes the
 * employee from the database and authentication. Also deletes the employee from the businesses collection.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 404 if the employee is not enrolled in the business
 *                  - 404 if the employee is not found
 *                  - 500 if an error occurs in the midst of the query
 *                  - 202 if successful
 */
export const deleteEmployee = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        employeeEmail: req.body.employeeEmail,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
    }
    const isEmployeeOfBusiness: boolean = await db
        .collection("businesses")
        .where("name", "==", requestData.businessName)
        .get()
        .then((data) => {
            let employeeList: Array<string> = data.docs[0].data().employees;
            const result = employeeList.includes(requestData.employeeEmail);
            employeeList = employeeList.filter((employee) => employee !== requestData.employeeEmail);
            db.collection("businesses").doc(requestData.businessName).update({employees: employeeList});
            return result;
        })
        .catch((err) => {
            console.error(err);
            return false;
        });
    if (!isEmployeeOfBusiness) {
        return res.status(404).json({general: "the employee is not enrolled in your the business"});
    }
    const employeeUID: string = await db
        .collection("users")
        .where("userType", "==", "employee")
        .where("email", "==", requestData.employeeEmail)
        .get()
        .then((data) => data.docs[0].data().userId)
        .catch(err => {
            console.error(err);
            return null;
        });
    if (employeeUID === null) {
        return res.status(404).json({general: "did not find the employee to delete",});
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
                    res.status(202).json({general: "deleted the employee successfully"})
                );
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
 * Remove the users from the queue by the employee.
 * first, checks if the user is an employee, then checks if the employee belongs to the business, and then deletes the
 * customer (queueSlot belonging to the customer) from the queue of the business. If the deleted queue slot is a
 * singed-in customer, changes the currentQueue of them as well.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type employee
 *                  - 404 if the employee is not enrolled in the business
 *                  - 404 if the employee is not found
 *                  - 500 if an error occurs in the midst of the query
 *                  - 202 if successful
 */
export const checkInQueue = async (req: Request, res: Response) => {
    const requestData = {
        userEmail: req.body.userEmail,
        userType: req.body.userType,
        businessName: req.body.businessName,
        ticketNumber: req.body.ticketNumber,
    };
    if (requestData.userType !== "employee") {
        return res.status(401).json({general: "unauthorized. Login as an employee of the business!"});
    }
    const isAuthorized: boolean = await db
        .collection("businesses")
        .where("name", "==", requestData.businessName)
        .get()
        .then((data) => {
            let employeeList: Array<string> = data.docs[0].data().employees;
            return employeeList.includes(requestData.userEmail);
        })
        .catch(err => {
            console.error(err);
            return false;
        });
    if (!isAuthorized) {
        return res.status(401).json({
            general: "the employee is unauthorized to change the queue of another business"
        });
    }
    const customerLookUp: any = await db
        .collection("businesses")
        .where("name", "==", requestData.businessName)
        .get()
        .then((data) => {
            const queue = data.docs[0].data().queue;
            let queueSlots: Array<any> = queue.queueSlots;
            const result: any = queueSlots.find((queueSlot) => queueSlot.ticketNumber === requestData.ticketNumber);
            queueSlots.splice(queueSlots.indexOf(result), 1);
            queue.queueSlots = queueSlots;
            db.collection("businesses").doc(requestData.businessName).update({queue: queue});
            return result;
        })
        .catch(err => {
            console.error(err);
            return null;
        });
    if (customerLookUp === null) {
        return res.status(404).json({general: "Did not find the customer to checkIn!"});
    }
    return await db
        .collection("users")
        .doc(customerLookUp.customer)
        .get()
        .then((docSnapshot) => {
            if (docSnapshot.exists) {
                db.collection("users").doc(customerLookUp.customer).update({currentQueue: null});
            }
            return res.status(202).json({general: "Removed the customer from the queue Successfully",});
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
 * Gets the list of all employees for a business.
 * first, checks if the user is a manager, then queries all the employees of the business, and for each one of them,
 * gets their appropriate information.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 404 if the employee is not found
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const getListOfAllEmployees = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
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
                general: "obtained employees information successfully",
                employees: employeeInfoList
            });
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
 * Gets the number of online employees in a business.
 * first, checks if the user is a manager, then queries all the employees of the business, and counts the number of
 * online employees for that business.
 *
 * @param req:      express Request Object
 * @param res:      express Response Object
 * @returns         Response the response data with the status code:
 *
 *                  - 401 if the user is not of type manager
 *                  - 404 if the employee is not found
 *                  - 500 if an error occurs in the midst of the query
 *                  - 200 if successful
 */
export const getOnlineEmployees = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        businessName: req.body.businessName,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general: "unauthorized. Login as a manager of the business!"});
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
                general: "obtained online employees successfully",
                onlineEmployees: onlineEmployeeCount,
            });
        })
        .catch(async (err) => {
            console.error(err);
            return res.status(500).json({
                general: "Internal Error. Something went wrong!",
                error: await err.toString(),
            });
        });
};
