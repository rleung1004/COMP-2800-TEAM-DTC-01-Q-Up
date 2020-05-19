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