export function formatPhone(number:string) {
    return `(${number.slice(0, 4)})${number.slice(4, 7)}-${number.slice(7)}`;
}