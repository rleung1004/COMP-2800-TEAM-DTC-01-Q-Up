import * as chai from "chai";
import {isEmail, isEmpty, validateLoginData, validateSignUpData} from "../../util/helpers";
const assert = chai.assert;

/**
 * Tests the validators of our application api.
 */
describe("Validators", () => {
  describe("isEmpty", () => {
    it("should return false for non-empty strings", function () {
      const mockObject: string = "nonEmptyString";
      assert.isFalse(isEmpty(mockObject));
    });
    it("should return true for empty strings", function () {
      const mockObject: string = "";
      assert.isTrue(isEmpty(mockObject));
    });
  });
  describe("isEmail", () => {
    it("should return false for if not an email", function () {
      const mockObject: string = "nonEmail";
      assert.isFalse(isEmail(mockObject));
    });
    it("should return true if email", function () {
      const mockObject: string = "ali@gmail.com";
      assert.isTrue(isEmail(mockObject));
    });
  });
  describe("validateSignUpData", () => {
    it("should return invalid and error message of Email: Must not be empty", function () {
      const mockData = {
        email: "",
        password: "123123",
        confirmPassword: "123123",
        userType: "customer",
        businessName: "",
      };
      const actualData = validateSignUpData(mockData);
      console.log(actualData);
      assert.deepEqual(actualData, {
        errors: { email: "Must not be empty" },
        valid: false,
      });
    });
    it("should return invalid and error message of email: Must be valid email address", () => {
      const mockData = {
        email: "alalalal",
        password: "123123",
        confirmPassword: "123123",
        userType: "customer",
        businessName: "",
      };
      const actualData = validateSignUpData(mockData);
      assert.deepEqual(actualData, {
        errors: { email: "Must be a valid email address" },
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
        errors: { password: "Must not be empty" },
        valid: false,
      });
    });
    it("should return invalid and error message of confirmPassword: Passwords must match", () => {
      const mockData = {
        email: "ali.washangton.98@gmail.com",
        password: "123112",
        confirmPassword: "123111",
        userType: "customer",
        businessName: "",
      };
      const actualData = validateSignUpData(mockData);
      assert.deepEqual(actualData, {
        errors: { confirmPassword: "Passwords must match" },
        valid: false,
      });
    });
    it("should return invalid and error message of userType: invalid type ", () => {
      const mockData = {
        email: "ali.washangton.98@gmail.com",
        password: "123112",
        confirmPassword: "123112",
        userType: "invalidType",
        businessName: "",
      };
      const actualData = validateSignUpData(mockData);
      assert.deepEqual(actualData, {
        errors: { userType: "Invalid user type" },
        valid: false,
      });
    });
    it("should return valid with empty error if email password and confirm password are validand userType is customer", () => {
      const mockData = {
        email: "ali@gmail.com",
        password: "123123",
        confirmPassword: "123123",
        userType: "customer",
        businessName: "",
      };
      const actualData = validateSignUpData(mockData);
      assert.deepEqual(actualData, { errors: {}, valid: true });
    });
    it("should return valid with empty error if email password and confirm password are valid and userType is business", () => {
      const mockData = {
        email: "ali@gmail.com",
        password: "123123",
        confirmPassword: "123123",
        userType: "customer",
        businessName: "",
      };
      const actualData = validateSignUpData(mockData);
      assert.deepEqual(actualData, { errors: {}, valid: true });
    });
    it("should return valid with empty error if email password and confirm password are valid and userType is employee", () => {
      const mockData = {
        email: "ali@gmail.com",
        password: "123123",
        confirmPassword: "123123",
        userType: "employee",
        businessName: "Ali Apple",
      };
      const actualData = validateSignUpData(mockData);
      assert.deepEqual(actualData, { errors: {}, valid: true });
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
        errors: { email: "Must not be empty" },
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
        errors: { password: "Must not be empty" },
        valid: false,
      });
    });
    it("should return valid with empty error", function () {
      const mockData = {
        email: "ali.washangton.98@gmail.com",
        password: "12312313",
      };
      const actualData = validateLoginData(mockData);
      assert.deepEqual(actualData, { errors: {}, valid: true });
    });
  });
});
