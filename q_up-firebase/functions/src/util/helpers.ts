interface queueSlot {
    customer: string;
    password: string;
    ticketNumber: number
}


const cities: Array<string> = [
    'moscow', 'HonKong', 'Singapore', 'Bangkok', 'London', 'Macau', 'Kuala', 'Shenzhen', 'New York City'
    , 'Antalya', 'Paris', 'Istanbul', 'Rome', 'Dubai', 'Guangzhou', 'Phuket', 'Mecca', 'Pattaya', 'Taipei City'
    , 'Prague', 'Shanghai', 'Las Vegas', 'Miami', 'Barcelona', 'Moscow', 'Beijing', 'Los Angeles',
    'Budapest', 'Vienna', 'Amsterdam', 'Sofia', 'Madrid', 'Orlando', 'Ho Chi Min City', 'Lima', 'Berlin', 'Tokyo',
    'Warsaw', 'Chennai', 'Cairo', 'Nairobi', 'Hangzhou', 'Milan', 'San', 'Buenos', 'Venice', 'Mexico', 'Dublin',
    'Seoul', 'Mugla', 'Mumbai', 'Denpasar', 'Delhi', 'Toronto', 'Zhuhai', 'St Petersburg', 'Burgas', 'Sydney', 'Djerba',
    'Munich', 'Johannesburg', 'Cancun', 'Edirne', 'Suzhou', 'Bucharest', 'Punta', 'Agra', 'Jaipur', 'Brussels', 'Nice',
    'Chiang Mai', 'Sharm elSheikh', 'Lisbon', 'East Province', 'Marrakech', 'Jakarta', 'Manama', 'Hanoi', 'Honolulu',
    'Manila', 'Guilin', 'Auckland', 'Siem Reap', 'Sousse', 'Amman', 'Vancouver', 'Abu Dhabi', 'Kiev', 'Doha',
    'Florence', 'Rio de Janeir', 'Melbourne', 'Washington DC.', 'Riyadh', 'Christchurch', 'Frankfurt', 'Baku',
    'Sao Paulo', 'Harare', 'Kolkata', 'Nanjing'
];


const createQueueSlot = (data: any) => {
    let returnData: queueSlot = {
        customer: data.customer,
        password: data.password,
        ticketNumber: data.ticketNumber
    };
    return returnData;

};

const createQueueSlotCredentials = (data: any) => {
    return {
        queue: data.queue,
        customer: data.customer,
        ticketNumber: Math.floor(Math.random() * 10000),
        password: cities[Math.floor(Math.random() * cities.length)],
    }
};


export {
    createQueueSlot,
    createQueueSlotCredentials,
}