/**
 * An Array of all cities as passwords.
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
 * Creates a customer queueSlot.
 */
export const createQueueSlotCredentials = (userEmail: string, lastTicketNumber: number) => {
    return {
        customer: userEmail,
        ticketNumber: lastTicketNumber + 1,
        password: cities[Math.floor(Math.random() * cities.length)],
    };
};

/**
 * Creates a VIP queueSlot.
 */
export const createVIPSlotCredentials = () => {
    return {
        customer: `VIP-${Math.floor(Math.random() * 1000)}`,
        ticketNumber: Math.floor(Math.random() * 10000),
        password: cities[Math.floor(Math.random() * cities.length)],
    };
};

/**
 * Creates a Booth QueueSlot.
 */
export const createBoothQueueSlot = (customerIdentifier: string, lastTicketNumber: number) => {
    return {
        customer: customerIdentifier,
        ticketNumber: lastTicketNumber + 1,
        password: cities[Math.floor(Math.random() * cities.length)],
    }
};

/**
 * Gets the day of the week for today.
 */
export const getTheDayOfTheWeekForArray = () => {
    return new Date().getDay() - 1;

};

