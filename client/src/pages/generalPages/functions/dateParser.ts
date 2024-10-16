export function parseAndFormatDate(dateString: string): string {
    const date = new Date(dateString);

    const moscowOffset = 3 * 60;
    const localOffset = date.getTimezoneOffset();
    const moscowTime = new Date(date.getTime() + (localOffset + moscowOffset) * 60 * 1000);

    const day = String(moscowTime.getDate()).padStart(2, '0');
    const month = String(moscowTime.getMonth() + 1).padStart(2, '0');
    const year = moscowTime.getFullYear();
    const hours = String(moscowTime.getHours()).padStart(2, '0');
    const minutes = String(moscowTime.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year}, ${hours}:${minutes}`;
}
