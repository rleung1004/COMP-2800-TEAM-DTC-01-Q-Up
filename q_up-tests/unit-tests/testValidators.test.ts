import * as chai from "chai";
import {
    validateBusinessData,
    validateCustomerData,
    validateLoginData,
    validateSignUpData
} from "../../q_up-firebase/functions/src/util/helpers";

const assert = chai.assert;

/**
 * Tests the validators of our application api.
 * The Validator Functions that tests are:
 *                                           - validateSignUpData
 *                                           - validateLogInData
 *                                           - validateCustomerData
 *                                           - validateBusinessData
 */
describe("Validators", () => {
    describe("validateSignUpData", () => {
        it("should return invalid and error message of Email: Must not be empty", () => {
            const mockData = {
                email: "",
                password: "aVeryStrongPassword1",
                confirmPassword: "aVeryStrongPassword1",
                userType: "customer",
                businessName: "",
            };
            const actualData = validateSignUpData(mockData);
            console.log(actualData);
            assert.deepEqual(actualData, {
                errors: {email: "Must not be empty"},
                valid: false,
            });
        });
        it("should return invalid and error message of email: Must be valid email address", () => {
            const mockData = {
                email: "alalalal",
                password: "aVeryStrongPassword1",
                confirmPassword: "aVeryStrongPassword1",
                userType: "customer",
                businessName: "",
            };
            const actualData = validateSignUpData(mockData);
            assert.deepEqual(actualData, {
                errors: {email: "Must be a valid email address"},
                valid: false,
            });
        });
        it("should return invalid and error message of password: Must not be empty", () => {
            const mockData = {
                email: "ali@gmail.com",
                password: "",
                confirmPassword: "",
                userType: "customer",
                businessName: "",
            };
            const actualData = validateSignUpData(mockData);
            assert.deepEqual(actualData, {
                errors: {password: "Must not be empty"},
                valid: false,
            });
        });
        it("should return invalid and error message of confirmPassword: Passwords must match", () => {
            const mockData = {
                email: "ali.washangton.98@gmail.com",
                password: "aVeryStrongPassword1",
                confirmPassword: "aVeryStrongPassword",
                userType: "customer",
                businessName: "",
            };
            const actualData = validateSignUpData(mockData);
            assert.deepEqual(actualData, {
                errors: {confirmPassword: "Passwords must match"},
                valid: false,
            });
        });
        it("should return invalid and error message of userType: invalid type ", () => {
            const mockData = {
                email: "ali.washangton.98@gmail.com",
                password: "aVeryStrongPassword1",
                confirmPassword: "aVeryStrongPassword1",
                userType: "invalidType",
                businessName: "",
            };
            const actualData = validateSignUpData(mockData);
            assert.deepEqual(actualData, {
                errors: {userType: "Invalid user type"},
                valid: false,
            });
        });
        it("should return invalid and error message of password must include 1 uppercase, 1 lowercase or number and be 6 characters", () => {
            const mockData = {
                email: "ali@gmail.com",
                password: "weak",
                confirmPassword: "weak",
                userType: "customer",
                businessName: "",
            };
            const actualData = validateSignUpData(mockData);
            assert.deepEqual(actualData, {
                errors: {password: "must include 1 uppercase, 1 lowercase or 1 number, and be 6 characters"},
                valid: false
            })
        });
        it("should return valid with empty error if email password and confirm password are valid and userType is customer", () => {
            const mockData = {
                email: "ali@gmail.com",
                password: "aVeryStrongPassword1",
                confirmPassword: "aVeryStrongPassword1",
                userType: "customer",
                businessName: "",
            };
            const actualData = validateSignUpData(mockData);
            assert.deepEqual(actualData, {errors: {}, valid: true});
        });
        it("should return valid with empty error if email password and confirm password are valid and userType is business", () => {
            const mockData = {
                email: "ali@gmail.com",
                password: "aVeryStrongPassword1",
                confirmPassword: "aVeryStrongPassword1",
                userType: "customer",
                businessName: "",
            };
            const actualData = validateSignUpData(mockData);
            assert.deepEqual(actualData, {errors: {}, valid: true});
        });
        it("should return valid with empty error if email password and confirm password are valid and userType is employee", () => {
            const mockData = {
                email: "ali@gmail.com",
                password: "aVeryStrongPassword1",
                confirmPassword: "aVeryStrongPassword1",
                userType: "employee",
                businessName: "Ali Apple",
            };
            const actualData = validateSignUpData(mockData);
            assert.deepEqual(actualData, {errors: {}, valid: true});
        });
    });
    describe("validateLoginData", () => {
        it("should return invalid with error message of email: Must not be empty", function () {
            const mockData = {
                email: "",
                password: "1212",
            };
            const actualData = validateLoginData(mockData);
            assert.deepEqual(actualData, {
                errors: {email: "Must not be empty"},
                valid: false,
            });
        });
        it("should return invalid with error message of password: Must not be empty", function () {
            const mockData = {
                email: "ali.washangton.98@gmail.com",
                password: "",
            };
            const actualData = validateLoginData(mockData);
            assert.deepEqual(actualData, {
                errors: {password: "Must not be empty"},
                valid: false,
            });
        });
        it("should return valid with empty error", function () {
            const mockData = {
                email: "ali.washangton.98@gmail.com",
                password: "12312313",
            };
            const actualData = validateLoginData(mockData);
            assert.deepEqual(actualData, {errors: {}, valid: true});
        });
    });
    describe("validateCustomerData", () => {
        it("should return invalid and error message of phoneNumber: Must not be empty", () => {
            const mockData = {
                phoneNumber: "",
                postalCode: "m1m2m3",
            };
            const actualData = validateCustomerData(mockData);
            assert.deepEqual(actualData, {
                errors: {phoneNumber: "Must not be empty"},
                valid: false,
            })
        });
        it("should return invalid and error message of phoneNumber: Invalid phone number", () => {
            const mockData = {
                phoneNumber: "1232",
                postalCode: "m1m2m3",
            };
            const actualData = validateCustomerData(mockData);
            assert.deepEqual(actualData, {
                errors: {phoneNumber: "Invalid phone number"},
                valid: false,
            })
        });
        it("should return invalid and error message of postalCode: Must not be empty", () => {
            const mockData = {
                phoneNumber: "1234567845",
                postalCode: "",
            };
            const actualData = validateCustomerData(mockData);
            assert.deepEqual(actualData, {
                errors: {postalCode: "Must not be empty"},
                valid: false,
            })
        });
        it("should return invalid and error message of postalCode: Invalid postal code", () => {
            const mockData = {
                phoneNumber: "1234567845",
                postalCode: "m2m3",
            };
            const actualData = validateCustomerData(mockData);
            assert.deepEqual(actualData, {
                errors: {postalCode: "Invalid postal code"},
                valid: false,
            })
        });
        it("should return valid with empty error if phoneNumber and postalCode are valid", () => {
            const mockData = {
                phoneNumber: "6066666666",
                postalCode: "m1m2m3",
            };
            const actualData = validateCustomerData(mockData);
            assert.deepEqual(actualData, {
                errors: {},
                valid: true,
            })
        });
    });
    describe("validateBusinessData", () => {
        it("should return invalid and error message of name: Must not be empty", () => {
            const mockData = {
                name: "",
                phoneNumber: "6046045656",
                address: {
                    streetAddress: "mockAddress",
                    postalCode: "m1m1m1",
                    city: "vancouver",
                    province: "BC",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {name: "Must not be empty"},
                valid: false,
            })
        });
        it("should return invalid and error message of phoneNumber: Must not be empty", () => {
            const mockData = {
                name: "name",
                phoneNumber: "",
                address: {
                    streetAddress: "mockAddress",
                    postalCode: "m1m1m1",
                    city: "vancouver",
                    province: "BC",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {phoneNumber: "Must not be empty"},
                valid: false,
            })
        });
        it("should return invalid and error message of phoneNumber: Invalid phone number", () => {
            const mockData = {
                name: "name",
                phoneNumber: "6046046",
                address: {
                    streetAddress: "mockAddress",
                    postalCode: "m1m1m1",
                    city: "vancouver",
                    province: "BC",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {phoneNumber: "Invalid phone number"},
                valid: false,
            })
        });
        it("should return invalid and error message of city: Must not be empty", () => {
            const mockData = {
                name: "name",
                phoneNumber: "6046045656",
                address: {
                    streetAddress: "mockAddress",
                    postalCode: "m1m1m1",
                    city: "",
                    province: "BC",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {city: "Must not be empty"},
                valid: false,
            })
        });
        it("should return invalid and error message of streetAddress: Must not be empty", () => {
            const mockData = {
                name: "name",
                phoneNumber: "6046045656",
                address: {
                    streetAddress: "",
                    postalCode: "m1m1m1",
                    city: "vancouver",
                    province: "BC",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {streetAddress: "Must not be empty"},
                valid: false,
            })
        });
        it("should return invalid and error message of province: Must not be empty", () => {
            const mockData = {
                name: "name",
                phoneNumber: "6046045656",
                address: {
                    streetAddress: "mockAddress",
                    postalCode: "m1m1m1",
                    city: "vancouver",
                    province: "",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {province: "Must not be empty"},
                valid: false,
            })
        });
        it("should return invalid and error message of postalCode: Must not be empty", () => {
            const mockData = {
                name: "name",
                phoneNumber: "6046045656",
                address: {
                    streetAddress: "mockAddress",
                    postalCode: "",
                    city: "vancouver",
                    province: "BC",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {postalCode: "Must not be empty"},
                valid: false,
            })
        });
        it("should return invalid and error message of postalCode: Invalid postal code", () => {
            const mockData = {
                name: "name",
                phoneNumber: "6046045656",
                address: {
                    streetAddress: "mockAddress",
                    postalCode: "1mm1m",
                    city: "vancouver",
                    province: "BC",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {postalCode: "Invalid postal code"},
                valid: false,
            })
        });
        it("should return valid with empty error if all the fields are valid", () => {
            const mockData = {
                name: "name",
                phoneNumber: "6046045656",
                address: {
                    streetAddress: "mockAddress",
                    postalCode: "m1m1m1",
                    city: "vancouver",
                    province: "BC",
                    unit: "12",
                },
                description: "",
                email: "",
                website: "",
                category: [],
                hours: {
                    startTime: [],
                    endTime: [],
                },
            };
            const actualData = validateBusinessData(mockData);
            assert.deepEqual(actualData, {
                errors: {},
                valid: true,
            })
        });
    });
});