let result;
let highlight;

window.onload = () => {
    result = document.getElementById("result");
    highlight = document.getElementById("highlight");
}

function update(textArea) {
    let [cleanText, numbers] = extractData(textArea.value);

    updateText(textArea, cleanText);

    let [index1, index2, sum] = calculateMaxSum(numbers);

    result.innerText = sum;

    if(sum === 0) {
        clearHighlight();
        return;
    }

    updateHighlight(highlight, cleanText, index1, index2);
}

function extractData(rawText) {
    let cleanText = "";

    let numbers = [];

    let isNegative = false;
    let number = null;

    for (let char of rawText) {
        switch (char) {
            case " ":
                if (number !== null) {
                    if (isNegative) {
                        numbers.push(-number);
                        cleanText += `-${number} `;
                        isNegative = false;
                    } else {
                        numbers.push(number);
                        cleanText += `${number} `;
                    }
                    number = null;
                } else {
                    if (isNegative) {
                        isNegative = false;
                        cleanText += "- ";
                    } else {
                        cleanText += " ";
                    }
                }
                break
            case "-":
                if (number !== null) {
                    if (isNegative) {
                        numbers.push(-number);
                        cleanText += `-${number}`;
                        isNegative = false;
                    } else {
                        numbers.push(number);
                        cleanText += `${number}`;
                    }
                    cleanText += " ";
                    number = null;
                    isNegative = true;
                } else {
                    isNegative = true;
                }
                break
            case "0":
                if (number === null) { number = 0; } else { number = number * 10; }
                break
            case "1":
                if (number === null) { number = 1; } else { number = number * 10 + 1; }
                break
            case "2":
                if (number === null) { number = 2; } else { number = number * 10 + 2; }
                break
            case "3":
                if (number === null) { number = 3; } else { number = number * 10 + 3; }
                break
            case "4":
                if (number === null) { number = 4; } else { number = number * 10 + 4; }
                break
            case "5":
                if (number === null) { number = 5; } else { number = number * 10 + 5; }
                break
            case "6":
                if (number === null) { number = 6; } else { number = number * 10 + 6; }
                break
            case "7":
                if (number === null) { number = 7; } else { number = number * 10 + 7; }
                break
            case "8":
                if (number === null) { number = 8; } else { number = number * 10 + 8; }
                break
            case "9":
                if (number === null) { number = 9; } else { number = number * 10 + 9; }
                break
        }
    }

    if (number !== null) {
        if (isNegative) {
            numbers.push(-number)
            cleanText += `-${number}`;
        } else {
            numbers.push(number)
            cleanText += `${number}`;
        }
    } else if (isNegative) {
        cleanText += "-";
    }

    return [cleanText, numbers];
}

function updateText(textArea, cleanText) {
    let selectionStart = textArea.selectionStart;
    textArea.value = cleanText;
    textArea.selectionStart = selectionStart;
    textArea.selectionEnd = selectionStart;
}

function calculateMaxSum(numbers) {
    let maxSum = 0;
    let chainSum = 0;

    let index1 = 0;
    let index2 = 0;
    let bestIndex1 = 0;
    let bestIndex2 = 0;
    for (let i=0;i<numbers.length;i++) {
        let number = numbers[i];

        let nextVale = chainSum + number;
        if(nextVale < 0) {
            // start new chain
            chainSum = 0;
            index1 = i + 1;
        } else {
            // extend chain
            index2 = i;
            chainSum = nextVale;
        }

        // compare among best current chain
        if(chainSum > maxSum) {
            bestIndex1 = index1;
            bestIndex2 = index2;
            maxSum = chainSum;
        }
    }

    return [bestIndex1, bestIndex2, maxSum];
}

function clearHighlight() {
    highlight.replaceChildren();
}

function updateHighlight(highlight, cleanText, index1, index2) {
    let preContent = document.createElement("span");
    let highlightContent = document.createElement("span");
    let postContent = document.createElement("span");

    highlightContent.classList.add("highlight");

    let index = 0;
    let encounteredSpace = true;
    let encounteredMinus = false;

    let modifyingElement;
    if(index1 === 0) {
        modifyingElement = highlightContent;
    }else{
        modifyingElement = preContent;
    }
    for(let char of cleanText) {
        switch (char) {
            case " ":
                if(!encounteredMinus && !encounteredSpace) {
                    index += 1;

                    if(index > index2) {
                        modifyingElement = postContent;
                    } else if(index >= index1) {
                        modifyingElement = highlightContent;
                    }
                }
                encounteredSpace = true;
                encounteredMinus = false;
                break;
            case "-":
                encounteredMinus = true;
                encounteredSpace = false;
                break;
            default:
                encounteredSpace = false;
                encounteredMinus = false;
                break;
        }

        if(index === index1 && char === " ") {
            preContent.innerText += char;
        }else{
            modifyingElement.innerText += char;
        }
    }

    highlight.replaceChildren(preContent, highlightContent, postContent);
}

function scrollHighlight(textArea) {
    highlight.scrollTop = textArea.scrollTop;
}
