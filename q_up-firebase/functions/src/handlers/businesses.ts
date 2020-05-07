import { db } from "../util/admin";
import { Request, Response } from "express";
import { validateBusinessData } from "../util/validators";

const updateBusiness = async (req: Request, res: Response) => {
  const userType = req.body.userType;
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

export { updateBusiness };
