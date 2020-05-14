/**
 * Represents the sign up data.
 */
interface signupData {
    email: string;
    password: string;
    confirmPassword: string;
    userType: string;
    businessName: string;
}

/**
 * Represents the login data.
 */
interface loginData {
    email: string;
    password: string;
}

/**
 * Represents the business data.
 */
interface businessData {
    name: string;
    category: Array<string>;
    description: string;
    email: string;
    hours: {
        startTime: Array<string>;
        endTime: Array<string>;
    };
    address: {
        streetAddress: string;
        postalCode: string;
        city: string;
        province: string;
        unit: string;
    };
    website: string;
    phoneNumber: string;
}

/**
 * Represents the customer data.
 */
interface customerData {
    phoneNumber: string;
    postalCode: string;
}

/**
 * Checks if the string is empty.
 */
export const isEmpty = (string: string) => {
    return string.trim() === "";
};

/**
 * Checks if the string is an email.
 */
export const isEmail = (email: string) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!email.match(regEx);
};

/**
 * Checks if the string is a postalCode.
 */
const isPostalCode = (string: string) => {
    const regEx = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
    return !!string.match(regEx);
};

/**
 * Checks if the string is a phoneNumber.
 */
const isPhoneNumber = (string: string) => {
    const regEx = /^\d{10}$/;
    return !!string.match(regEx);
};

/**
 * Validates the sign-up data.
 */
export const validateSignUpData = (data: signupData) => {
    let errors = {};

    if (isEmpty(data.email)) {
        Object.assign(errors, {email: "Must not be empty"});
    } else if (!isEmail(data.email)) {
        Object.assign(errors, {email: "Must be a valid email address"});
    }

    if (isEmpty(data.password)) {
        Object.assign(errors, {password: "Must not be empty"});
    }

    if (data.password !== data.confirmPassword) {
        Object.assign(errors, {confirmPassword: "Passwords must match"});
    }

    if (
        data.userType !== "customer" &&
        data.userType !== "manager" &&
        data.userType !== "employee" &&
        data.userType !== "booth"
    ) {
        Object.assign(errors, {userType: "Invalid user type"});
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

/**
 * Validates the log-in data
 */
export const validateLoginData = (data: loginData) => {
    let errors = {};

    if (isEmpty(data.email)) {
        Object.assign(errors, {email: "Must not be empty"});
    }

    if (isEmpty(data.password)) {
        Object.assign(errors, {password: "Must not be empty"});
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

/**
 * Validates the customer data.
 */
export const validateCustomerData = (data: customerData) => {
    let errors = {};

    if (isEmpty(data.phoneNumber)) {
        Object.assign(errors, {phoneNumber: "Must not be empty"});
    } else if (!isPhoneNumber(data.phoneNumber)) {
        Object.assign(errors, {phoneNumber: "Invalid phone number"});
    }
    if (isEmpty(data.postalCode)) {
        Object.assign(errors, {postalCode: "Must not be empty"});
    } else if (!isPostalCode(data.postalCode)) {
        Object.assign(errors, {postalCode: "Invalid postal code"});
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

/**
 * Validates the business data.
 */
export const validateBusinessData = (data: businessData) => {
    let errors = {};

    if (isEmpty(data.name)) {
        Object.assign(errors, {name: "Must not be empty"});
    }
    if (isEmpty(data.phoneNumber)) {
        Object.assign(errors, {phoneNumber: "Must not be empty"});
    } else if (!isPhoneNumber(data.phoneNumber)) {
        Object.assign(errors, {phoneNumber: "Invalid phone number"});
    }
    if (isEmpty(data.address.city)) {
        Object.assign(errors, {city: "Must not be empty"});
    }
    if (isEmpty(data.address.streetAddress)) {
        Object.assign(errors, {streetAddress: "Must not be empty"});
    }
    if (isEmpty(data.address.province)) {
        Object.assign(errors, {province: "Must not be empty"});
    }
    if (isEmpty(data.address.postalCode)) {
        Object.assign(errors, {postalCode: "Must not be empty"});
    } else if (!isPostalCode(data.address.postalCode)) {
        Object.assign(errors, {postalCode: "Invalid postal code"});
    }

    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

