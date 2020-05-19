export function formatPhone(number:string) {
    return `(${number.slice(0, 4)})${number.slice(4, 7)}-${number.slice(7)}`;
}

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
 
export function formatGoogleMapURL(formattedAddress:string) {
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
            default:    
                newString += char;  
        }
    }
    return newString;
  };

  // Format time string in order to appropriately 
export function formatTimeInto12h(time24h: string) {
    const [hours, mins] = time24h.split(":");
    const intHours = parseInt(hours);
    return (intHours % 12 || 12) + ":" + mins + (intHours >= 12 ? "PM" : "AM");
  }