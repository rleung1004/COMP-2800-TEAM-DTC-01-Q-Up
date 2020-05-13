import {admin, db } from "../util/admin";
import { Request, Response } from "express";
import {signup} from "./users";


/**
 * Creates a new Employee
 */
const createNewEmployee = async (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
        password: req.body.password,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({
            general: "unauthorized!",
        });
    }
    Object.assign(req.body, { userType: "employee" });
    Object.assign(req.body, { confirmPassword: requestData.password });
    return await signup(req, res);
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
    const isEmployeeOfBusiness: boolean =
        await db
            .collection('businesses')
            .where('businessName', '==', requestData.businessName)
            .get()
            .then((data) => {
                const employeeList: Array<string> = data.docs[0].data().employees;
                return employeeList.includes(requestData.employeePreviousCredentials.email)
            })
            .catch(()=> false);
    if (!isEmployeeOfBusiness) {
        return res.status(401).json({
            general:'the employee is not enrolled in your the business',
        })
    }
    const employeeUID: string =
        await db
            .collection('users')
            .where('userType', '==', 'employee')
            .where('email', '==', requestData.employeePreviousCredentials.email)
            .get()
            .then(data => {
                return data.docs[0].data().userId;
            })
            .catch(()=> null);
    if (employeeUID === null) {
        return res.status(404).json({
            general:'did not find the employee to update',
        })
    }
    return db
        .collection('users')
        .doc(requestData.employeePreviousCredentials.email)
        .update(requestData.employeeNewCredentials)
        .then(()=> {
            return admin
                .auth()
                .updateUser(employeeUID, requestData.employeeNewCredentials)
                .then(()=> res.status(200).json({general: 'updated the employee successfully'}))
        })
        .catch((err)=> {
            return res.status(400).json({
                general: 'Something went wrong',
                error: err,
            })
        })
};

/**
 *
 */
//const deleteEmployee ;

// const removeFromQueue;


export {
    createNewEmployee,
    updateEmployee,
}