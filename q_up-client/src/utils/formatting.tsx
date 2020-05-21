
/**
 * Format a phone into (###)###-#### format.
 * @param number a string, must contain 10 digits
 * @returns a string, a formatted phone number
 */
export function formatPhone(number:string) {
    if (number.length !== 10) {
        console.error("Phone number does not have 10 digits");        
    }
    return `(${number.slice(0, 4)})${number.slice(4, 7)}-${number.slice(7)}`;
}

/**
 * Format an address obj into an address literal.
 * @param address an object such as:
 * {
 *  unit:string, <- optional
 *  streetAddress, <- bldg. # + street name + street type
 *  city: string,
 *  province: string,
 *  postalCode: string
 * }
 * 
 * @returns a string, an address
 */
export function formatAddress(address:any) {
    const {
      unit,
      streetAddress,
      city,
      province,
      postalCode,
    } = address;
    return `${unit ? unit : ""} ${streetAddress},\n ${city}, ${province}\n ${postalCode}`;
}
 
/**
 * Format address into URI form.
 * 
 * Meant to be used for sending requests to google maps.
 * Reference: https://developers.google.com/maps/documentation/urls/url-encoding
 * 
 * @param formattedAddress a string, an address literal
 * @returns a string, a URI compliant parameter
 */
export function formatURL(formattedAddress:string) {
    let newString = "";
    for (const char of formattedAddress) {
        switch (char) {
            case ' ':
                newString += '%20';
                break;
            case '"':
                newString += '%22';
                break;
            case '<':
                newString += '%3C';
                break;
            case '>':
                newString += '%3E';
                break;
            case '#':
                newString += '%23';
                break;
            case '%':
                newString += '%25';
                break;
            case '|':
                newString += '%7C';
                break;
            case ',':
                newString += '%2C';
                break;
            default:    
                newString += char;  
        }
    }
    return newString;
  };

/**
 * Format 24h time into 12h time.
 * 
 * Will include AM/PM.
 * @param time24h a string, a 24h time literal
 * @returns a string, a 12h time literal
 */
export function formatTimeInto12h(time24h: string) {
    const [hours, mins] = time24h.split(":");
    const intHours = parseInt(hours);
    return (intHours % 12 || 12) + ":" + mins + (intHours >= 12 ? "PM" : "AM");
  }