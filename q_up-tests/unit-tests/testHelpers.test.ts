import * as chai from "chai";
import {
    cities, createQueueSlot,
    createVIPSlot, getCounts, getHighestTicketNumbers,
    isEmail,
    isEmpty,
    isPhoneNumber,
    isPostalCode,
    isStrongPassword
} from "../../q_up-firebase/functions/src/util/helpers";

const assert = chai.assert;

/**
 * Tests the helper fu nctions of our application api.
 * The helper Functions that are tested are:
 *                                           - isEmpty
 *                                           - isEmail
 *                                           - isPostalCode
 *                                           - isPhoneNumber
 *                                           - isStrongPassword
 *                                           - createVIPSlot
 *                                           - createQueueSlot
 *                                           - getTheDayOfTheWeekForArray
 *                                           - getCounts
 *                                           - getHighestTicketNumbers
 */
describe("helpers", () => {
    describe("isEmpty", () => {
        it("should return false for non-empty strings", () => {
            const mockObject: string = "nonEmptyString";
            assert.isFalse(isEmpty(mockObject));
        });
        it("should return true for empty strings", () => {
            const mockObject: string = "";
            assert.isTrue(isEmpty(mockObject));
        });
    });
    describe("isEmail", () => {
        it("should return false for if not an email", () => {
            const mockObject: string = "nonEmail";
            assert.isFalse(isEmail(mockObject));
        });
        it("should return true if email", () => {
            const mockObject: string = "ali@gmail.com";
            assert.isTrue(isEmail(mockObject));
        });
    });
    describe("isPostalCode", () => {
        it("should return false for non-postalCode strings", () => {
            const mockObject: string = "1m2m";
            assert.isFalse(isPostalCode(mockObject));
        });
        it("should return true for postalCode strings", () => {
            const mockObject: string = "m2m2m2";
            assert.isTrue(isPostalCode(mockObject));
        });
    });
    describe("isPhoneNumber", () => {
        it("should return false for non-PhoneNumber strings", () => {
            const mockObject: string = "10202";
            assert.isFalse(isPhoneNumber(mockObject));
        });
        it("should return true for PhoneNumber strings", () => {
            const mockObject: string = "6046665544";
            assert.isTrue(isPhoneNumber(mockObject));
        });
    });
    describe("isStrongPassword", () => {
        it("should return false for non-strongPassword strings", () => {
            const mockObject: string = "1233";
            assert.isFalse(isStrongPassword(mockObject))
        });
        it("should return true for password with 6 characters, 1 uppercase 1 lowercase strings", () => {
            const mockObject: string = "Uuulll";
            assert.isTrue(isStrongPassword(mockObject))
        });
        it("should return true for password with 6 characters, 1 uppercase 1 number strings", () => {
            const mockObject: string = "UUUU123";
            assert.isTrue(isStrongPassword(mockObject))
        });
        it("should return true for password with 6 characters, 1 lowercase 1 number strings", () => {
            const mockObject: string = "uu1lll";
            assert.isTrue(isStrongPassword(mockObject))
        });
    });
    describe("createVIPSlot", () => {
        it("should return a VIP slot number with the ticket number of 1 + the last ticketNumber", () => {
            const mockNumber = 1;
            const actualData = createVIPSlot(mockNumber);
            assert.equal(actualData.ticketNumber, mockNumber + 1);
        });
        it("should return a VIP slot number with the password that is of elements in the cities array", () => {
            const mockNumber = 1;
            const actualData = createVIPSlot(mockNumber);
            assert.include(cities, actualData.password);
        });
        it("should return a VIP slot number with the name VIP- and the ticket number", () => {
            const mockNumber = 1;
            const actualData = createVIPSlot(mockNumber);
            assert.match(actualData.customer, /^VIP-(100|[1-9][0-9]?)$/);
        });
        it("should return a VIP slot number with the customerType VIP", () => {
            const mockNumber = 1;
            const actualData = createVIPSlot(mockNumber);
            assert.equal(actualData.customerType, 'VIP');
        });
    });
    describe("createQueueSlot", () => {
        it("should return a queue slot with the ticket number of 1 + the last ticketNumber", () => {
            const mockNumber = 100;
            const mockName = "name";
            const actualData = createQueueSlot(mockName, mockNumber);
            assert.equal(actualData.ticketNumber, mockNumber + 1);
        });
        it("should return a queue slot with the ticket number of 101 + the last ticketNumber if ticketNumber less than 100", () => {
            const mockNumber = 1;
            const mockName = "name";
            const actualData = createQueueSlot(mockName, mockNumber);
            assert.equal(actualData.ticketNumber, mockNumber + 101);
        });
        it("should return a queue slot with the password that is of elements in the cities array", () => {
            const mockNumber = 1;
            const mockName = "name";
            const actualData = createQueueSlot(mockName, mockNumber);
            assert.include(cities, actualData.password);
        });
        it("should return a queue slot with the name of the customerIdentifier", () => {
            const mockNumber = 1;
            const mockName = "name";
            const actualData = createQueueSlot(mockName, mockNumber);
            assert.equal(actualData.customer, mockName);
        });
        it("should return a queue slot with the customerType NonVIP", () => {
            const mockNumber = 1;
            const mockName = "name";
            const actualData = createQueueSlot(mockName, mockNumber);
            assert.equal(actualData.customerType, "nonVIP");
        });
    });
    describe("getCounts", () => {
        it("should properly count the VIP customers of a queue", () => {
            const mockQueueSlots = [
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
            ];
            const actualData = getCounts(mockQueueSlots);
            assert.equal(actualData.vipCounts, 4);
        });
        it("should properly count the NonVIP customers of a queue", () => {
            const mockQueueSlots = [
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
            ];
            const actualData = getCounts(mockQueueSlots);
            assert.equal(actualData.nonVipCounts, 3);
        });
        it("should return an object with fields vipCounts and nonVipCounts", () => {
            const mockQueueSlots = [
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
                {customerType: "nonVIP"},
                {customerType: "VIP"},
            ];
            const actualData = getCounts(mockQueueSlots);
            assert.hasAllKeys(actualData, ['vipCounts', 'nonVipCounts']);
        });

    });
    describe("getHighestTicketNumbers", () => {
        it("should properly obtain the highest ticketNumber for VIPs", () => {
            const mockQueueSlots = [
                {customerType: "VIP", ticketNumber: 1},
                {customerType: "nonVIP", ticketNumber: 4},
                {customerType: "VIP", ticketNumber: 3},
                {customerType: "nonVIP", ticketNumber: 2},
                {customerType: "VIP", ticketNumber: 9},
                {customerType: "nonVIP", ticketNumber: 7},
                {customerType: "nonVIP", ticketNumber: 10},
            ];
            const actualData = getHighestTicketNumbers(mockQueueSlots);
            assert.equal(actualData.highestVIPTicketNumber, 9);
        });
        it("should properly obtain the highest ticketNumber for NonVIPs", () => {
            const mockQueueSlots = [
                {customerType: "VIP", ticketNumber: 1},
                {customerType: "nonVIP", ticketNumber: 4},
                {customerType: "VIP", ticketNumber: 3},
                {customerType: "nonVIP", ticketNumber: 2},
                {customerType: "VIP", ticketNumber: 9},
                {customerType: "nonVIP", ticketNumber: 7},
                {customerType: "nonVIP", ticketNumber: 10},
            ];
            const actualData = getHighestTicketNumbers(mockQueueSlots);
            assert.equal(actualData.highestNonVIPTicketNumber, 10);
        });
        it("should properly reset the highestVIPTicketNumber to modulus 100 when greater than 100", () => {
            const mockQueueSlots = [
                {customerType: "VIP", ticketNumber: 1},
                {customerType: "nonVIP", ticketNumber: 4},
                {customerType: "VIP", ticketNumber: 101},
                {customerType: "nonVIP", ticketNumber: 2},
                {customerType: "VIP", ticketNumber: 9},
                {customerType: "nonVIP", ticketNumber: 7},
                {customerType: "nonVIP", ticketNumber: 10},
            ];
            const actualData = getHighestTicketNumbers(mockQueueSlots);
            assert.equal(actualData.highestVIPTicketNumber, 1);
        });
        it("should properly reset the highestVIPTicketNumber to modulus 1000 when greater than 1000", () => {
            const mockQueueSlots = [
                {customerType: "VIP", ticketNumber: 1},
                {customerType: "nonVIP", ticketNumber: 4},
                {customerType: "VIP", ticketNumber: 3},
                {customerType: "nonVIP", ticketNumber: 2},
                {customerType: "VIP", ticketNumber: 9},
                {customerType: "nonVIP", ticketNumber: 7},
                {customerType: "nonVIP", ticketNumber: 1002},
            ];
            const actualData = getHighestTicketNumbers(mockQueueSlots);
            assert.equal(actualData.highestNonVIPTicketNumber, 2);
        });
        it("should return an object with fields highestVIPTicketNumber and highestNonVIPTicketNumber", () => {
            const mockQueueSlots = [
                {customerType: "VIP", ticketNumber: 1},
                {customerType: "nonVIP", ticketNumber: 4},
                {customerType: "VIP", ticketNumber: 3},
                {customerType: "nonVIP", ticketNumber: 2},
                {customerType: "VIP", ticketNumber: 9},
                {customerType: "nonVIP", ticketNumber: 7},
                {customerType: "nonVIP", ticketNumber: 10},
            ];
            const actualData = getHighestTicketNumbers(mockQueueSlots);
            assert.hasAllKeys(actualData, ['highestVIPTicketNumber', 'highestNonVIPTicketNumber']);
        });
    });
});