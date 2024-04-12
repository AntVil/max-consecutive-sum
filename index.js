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

    if (sum === BigInt(0)) {
        clearHighlight();
        return;
    }

    updateHighlight(highlight, cleanText, index1, index2);
}

function extractData(rawText) {
    let cleanText = "";

    let numbers = [];

    let numberString = "";

    for (let char of rawText) {
        switch (char) {
            case " ":
                if (numberString !== "-" && numberString !== "") {
                    numbers.push(BigInt(numberString));
                    cleanText += `${numberString} `;
                    numberString = "";
                } else {
                    cleanText += `${numberString} `;
                    numberString = "";
                }
                break
            case "-":
                if (numberString === "") {
                    numberString = "-";
                } else if (numberString === "-") {
                    cleanText += "- ";
                } else {
                    numbers.push(BigInt(numberString));
                    cleanText += `${numberString} `;
                    numberString = "-";
                }
                break
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
            case "8":
            case "9":
                numberString += char;
        }
    }

    if (numberString !== "" && numberString !== "-") {
        numbers.push(BigInt(numberString));
        cleanText += numberString;
    } else {
        cleanText += numberString;
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
    console.log(numbers)
    let maxSum = BigInt(0);
    let chainSum = BigInt(0);

    let index1 = 0;
    let index2 = 0;
    let bestIndex1 = 0;
    let bestIndex2 = 0;
    for (let i = 0; i < numbers.length; i++) {
        let number = numbers[i];

        let nextVale = chainSum + number;
        if (nextVale <= 0) {
            // start new chain
            chainSum = BigInt(0);
            index1 = i + 1;
        } else {
            // extend chain
            index2 = i;
            chainSum = nextVale;
        }

        // compare among best current chain
        if (chainSum > maxSum) {
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
    if (index1 === 0) {
        modifyingElement = highlightContent;
    } else {
        modifyingElement = preContent;
    }
    for (let char of cleanText) {
        switch (char) {
            case " ":
                if (!encounteredMinus && !encounteredSpace) {
                    index += 1;

                    if (index > index2) {
                        modifyingElement = postContent;
                    } else if (index >= index1) {
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

        if (index === index1 && char === " ") {
            preContent.innerText += char;
        } else {
            modifyingElement.innerText += char;
        }
    }

    highlight.replaceChildren(preContent, highlightContent, postContent);
}

function scrollHighlight(textArea) {
    highlight.scrollTop = textArea.scrollTop;
}
