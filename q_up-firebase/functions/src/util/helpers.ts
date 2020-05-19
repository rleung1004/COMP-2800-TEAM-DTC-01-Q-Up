/**
 * Represents all the possible values for the queue slot passwords.
 */
const cities: Array<string> = [
    "moscow",
    "HonKong",
    "Singapore",
    "Bangkok",
    "London",
    "Macau",
    "Kuala",
    "Shenzhen",
    "New York City",
    "Antalya",
    "Paris",
    "Istanbul",
    "Rome",
    "Dubai",
    "Guangzhou",
    "Phuket",
    "Mecca",
    "Pattaya",
    "Taipei City",
    "Prague",
    "Shanghai",
    "Las Vegas",
    "Miami",
    "Barcelona",
    "Moscow",
    "Beijing",
    "Los Angeles",
    "Budapest",
    "Vienna",
    "Amsterdam",
    "Sofia",
    "Madrid",
    "Orlando",
    "Ho Chi Min City",
    "Lima",
    "Berlin",
    "Tokyo",
    "Warsaw",
    "Chennai",
    "Cairo",
    "Nairobi",
    "Hangzhou",
    "Milan",
    "San",
    "Buenos",
    "Venice",
    "Mexico",
    "Dublin",
    "Seoul",
    "Mugla",
    "Mumbai",
    "Denpasar",
    "Delhi",
    "Toronto",
    "Zhuhai",
    "St Petersburg",
    "Burgas",
    "Sydney",
    "Djerba",
    "Munich",
    "Johannesburg",
    "Cancun",
    "Edirne",
    "Suzhou",
    "Bucharest",
    "Punta",
    "Agra",
    "Jaipur",
    "Brussels",
    "Nice",
    "Chiang Mai",
    "Sharm elSheikh",
    "Lisbon",
    "East Province",
    "Marrakech",
    "Jakarta",
    "Manama",
    "Hanoi",
    "Honolulu",
    "Manila",
    "Guilin",
    "Auckland",
    "Siem Reap",
    "Sousse",
    "Amman",
    "Vancouver",
    "Abu Dhabi",
    "Kiev",
    "Doha",
    "Florence",
    "Rio de Janeir",
    "Melbourne",
    "Washington DC.",
    "Riyadh",
    "Christchurch",
    "Frankfurt",
    "Baku",
    "Sao Paulo",
    "Harare",
    "Kolkata",
    "Nanjing",
];

/**
 * Represents a queueSlot.
 */
export interface queueSlot {
    customer: string;
    password: string;
    ticketNumber: number;
}

/**
 * Represents a Queue.
 */
export interface queue {
    averageWaitTIme: number,
    isActive: boolean,
    queueName: string,
    queueSlots: Array<queueSlot>,
}

/**
 * Represents an image Object.
 */
export interface imageObject {
    filepath: string;
    mimeType: string;
}

/**
 * Represents the sign up data.
 */
interface signUpData {
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
 * Checks if the given string is empty or not
 *
 * @param string    a string
 * @return          Boolean true if string is empty otherwise false
 */
export const isEmpty = (string: string) => {
    return string.trim() === "";
};

/**
 * Checks if the string is an email.
 * checks the given parameter against a regex to determine the validity of the email.
 * The regex's source is: www.pastebin.com
 *
 * @param email     an string
 * @return          Boolean true if the string is an email otherwise false
 * @see             https://pastebin.com/f33g85pd
 */
export const isEmail = (email: string) => {
    const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return !!email.match(regEx);
};

/**
 * Checks if the string is a postal code.
 * checks the given parameter against a regex to determine the validity of the postal code.
 *
 * @param string     an string
 * @return          Boolean true if the string is a postal code otherwise false
 */
const isPostalCode = (string: string) => {
    const regEx = /^[A-Za-z]\d[A-Za-z] ?\d[A-Za-z]\d$/;
    return !!string.match(regEx);
};

/**
 * Checks if the string is a phone number.
 * checks the given parameter against a regex to determine the validity of the a phone number.
 *
 * @param string     an string
 * @return          Boolean true if the string is a phone number otherwise false
 */
const isPhoneNumber = (string: string) => {
    const regEx = /^\d{10}$/;
    return !!string.match(regEx);
};

/**
 * Validates the sign up data provided.
 *
 * @param data      an Object
 * @return          Object with two fields of Valid of type Boolean and errors of type Object
 */
export const validateSignUpData = (data: signUpData) => {
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
    if (data.userType === 'manager' && isEmpty(data.businessName)) {
        Object.assign(errors, {businessName: "Must not be empty"});
    }
    if (
        data.userType !== "customer" &&
        data.userType !== "manager" &&
        data.userType !== "employee" &&
        data.userType !== "booth" &&
        data.userType !== "display"
    ) {
        Object.assign(errors, {userType: "Invalid user type"});
    }


    return {
        errors,
        valid: Object.keys(errors).length === 0,
    };
};

/**
 * Validates the log in data provided.
 *
 * @param data      an Object
 * @return          Object with two fields of Valid of type Boolean and errors of type Object
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
 * Validates the customer data provided.
 *
 * @param data      an Object
 * @return          Object with two fields of Valid of type Boolean and errors of type Object
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
 * Validates the business data provided.
 *
 * @param data      an Object
 * @return          Object with two fields of Valid of type Boolean and errors of type Object
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

/**
 * Creates a VIP queue slot with a unique vip identifier.
 *
 * @return          Object with three fields of customer of type string, ticketNumber of type number, and password
 *                  of type string.
 */
export const createVIPSlot = (lastTicketNumber : number) => {
    return {
        customer: `VIP-${lastTicketNumber + 1}`,
        customerType: "VIP",
        ticketNumber: lastTicketNumber + 1,
        password: cities[Math.floor(Math.random() * cities.length)],
    };
};

/**
 * Creates a queue slot.
 *
 * @param customerIdentifier    a string
 * @param lastTicketNumber      a number
 * @returns                     Object with three fields of customer of type string, ticketNumber of type number, and
 *                              password of type string.
 */
export const createQueueSlot = (customerIdentifier: string, lastTicketNumber: number) => {
    if (lastTicketNumber < 100) {
        lastTicketNumber += 100;
    }
    return {
        customer: customerIdentifier,
        customerType: "nonVIP",
        ticketNumber: lastTicketNumber + 1,
        password: cities[Math.floor(Math.random() * cities.length)],
    }
};

/**
 * Gets the day of the week for today.
 *
 * @return      Number between 0 to 6 for sunday to saturday respectively.
 */
export const getTheDayOfTheWeekForArray = () => {
    return new Date().getDay();

};

/**
 * Gets the vip and nonVip Counts for the queue.
 *
 * @param queueSlots    an Object.
 */
export const getCounts = (queueSlots: any) => {
    let VIPCounts = 0;
    let nonVIPCounts = 0;
    queueSlots.forEach((queueSlot: any) => {
        if (queueSlot.customerType === "VIP") {
            VIPCounts++;
        } else {
            nonVIPCounts++;
        }
    });
    return {
        vipCounts: VIPCounts,
        nonVipCounts: nonVIPCounts,
    }
};

/**
 * Gets the highest ticket numbers for VIP and nonVIP customers in a queue.
 *
 * @param queueSlots    an Object
 */
export const getHighestTicketNumbers = (queueSlots: any) => {
    let highestVIPTicketNumber = 0;
    let highestNonVIPTicketNumber = 0;
    queueSlots.forEach((queueSlot: any) => {
        if (queueSlot.customerType === "VIP" && queueSlot.ticketNumber > highestVIPTicketNumber) {
            highestVIPTicketNumber = queueSlot.ticketNumber;
        } else if (queueSlot.customerType === "nonVIP" && queueSlot.ticketNumber > highestNonVIPTicketNumber) {
            highestNonVIPTicketNumber = queueSlot.ticketNumber;
        }
    });
    if (highestVIPTicketNumber > 100) {
        highestVIPTicketNumber %= 100;
    }
    if (highestNonVIPTicketNumber > 1000) {
        highestNonVIPTicketNumber %= 1000;
    }
    return {
        highestVIPTicketNumber: highestVIPTicketNumber,
        highestNonVIPTicketNumber: highestNonVIPTicketNumber,
    }
};