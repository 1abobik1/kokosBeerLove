export function extractNumbersFromUrl(url: string): {firstNumber: string; secondNumber: string} | null {
    let firstNumber = '';
    let secondNumber = '';
    let isFirstNumberFound = false;
    let isCollectingSecondNumber = false;

    for (let i = 0; i < url.length; i++) {
        const char = url[i];

        // Проверяем, является ли текущий символ цифрой
        if (/\d/.test(char)) {
            if (!isFirstNumberFound) {
                firstNumber += char; // Собираем первую строку цифр
            } else if (isCollectingSecondNumber) {
                secondNumber += char; // Собираем вторую строку цифр
            }
        } else if (char === '_') {
            // Если встретили '_', это значит, что первая строка цифр собрана
            isFirstNumberFound = true;
            isCollectingSecondNumber = true;
        } else if (isCollectingSecondNumber && (char === '%' || char === '/')) {
            // Заканчиваем сбор второй строки цифр
            break;
        }
    }

    if (firstNumber && secondNumber) {
        return {firstNumber, secondNumber};
    }

    return null; // Если числа не найдены
}

// // Пример использования
// const url = "https://vk.com/video/@littlebigband?z=video-55072656_456241065%2Fclub55072356";
// const result = extractNumbersFromUrl(url);

// if (result) {
//     console.log(`First number: ${result.firstNumber}`);
//     console.log(`Second number: ${result.secondNumber}`);
// } else {
//     console.log("Числа не найдены.");
// }
