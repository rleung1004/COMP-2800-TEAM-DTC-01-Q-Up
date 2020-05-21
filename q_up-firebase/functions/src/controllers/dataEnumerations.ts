import {businessCategories, provinces} from "../util/helpers";
import {Response, Request} from "express";

/**
 * Gets the data enumeration needed for the managers.
 *
 * @param req:              express Request Object
 * @param res:              express Response Object
 * @returns Response        the response data with the status code:
 *                          - 401 if unauthorized
 *                          - 200 if successful.
 */
export const getDataEnum = (req: Request, res: Response) => {
    const requestData = {
        userType: req.body.userType,
    };
    if (requestData.userType !== "manager") {
        return res.status(401).json({general:"unauthorized!. Login as a manager"});
    }
    return res.status(200).json({
        businessCategories,
        provinces,
    });
};

