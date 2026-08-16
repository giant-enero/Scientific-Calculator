let angleMode = "DEG";


function getDisplay() {
    return document.getElementById("display");
}



function appendNumber(number) {

    const display = getDisplay();

    display.value += number;
}



function appendOperator(operator) {
    const display = getDisplay();
    if (operator === "*") {
        display.value += "×";
    } else if (operator === "/") {
        display.value += "÷";
    } else {
        display.value += operator;
    }
}



function appendDecimal() {
    const display = getDisplay();
    const parts =
        display.value.split(/[+\-×÷^()]/);
    const currentNumber =
        parts[parts.length - 1];
    if (!currentNumber.includes(".")) {
        display.value += ".";
    }
}



function appendFunction(func) {
    const display = getDisplay();
    if (func === "square") {
        display.value += "^2";
        return;
    }
    if (func === "reciprocal") {
        display.value += "^-1";
        return;
    }

    display.value += func + "(";
}



function appendParenthesis(parenthesis) {
    const display = getDisplay();
    display.value += parenthesis;
}



function appendConstant(constant) {
    const display = getDisplay();
    display.value += constant;
}



function appendRoot() {
    const display = getDisplay();
    display.value += "√";
}



function appendNthRoot() {
    const display = getDisplay();
    
    let index = prompt("Enter the index of the root:");
    if (index === null) {
        return;
    }
    index = index.trim();
    if (index === "" || isNaN(index) || Number(index) < 2) {
        alert("Please enter an index of 2 or greater.");
        return;
    }


    let radicand = prompt("Enter the radicand:");
    if (radicand === null) {
        return;
    }
    
    radicand = radicand.trim();

    if (radicand === "" || isNaN(radicand)) {
        alert("Please enter a valid number.");
        return;
    }



    const superscriptIndex =
        toSuperscript(index);

    display.value += superscriptIndex + "√" + radicand;
}



function toSuperscript(number) {
    const normal =
        "0123456789+-()";
    const superScript =
        "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾";

    return String(number).split("").map(character => {
            const index =
                normal.indexOf(character);
            if (index !== -1) {
                return superScript[index];
            }
            return character;
        })
        .join("");
}



function convertNthRoots(expression) {
    const superscriptMap = {
        "⁰": "0",
        "¹": "1",
        "²": "2",
        "³": "3",
        "⁴": "4",
        "⁵": "5",
        "⁶": "6",
        "⁷": "7",
        "⁸": "8",
        "⁹": "9"
    };

    const pattern =
        /([⁰¹²³⁴⁵⁶⁷⁸⁹]+)√(\d+(?:\.\d+)?)/g;

    expression =
        expression.replace(pattern,function(match, index, radicand) {
                let normalIndex = "";
                
                for (let character of index) {
                    normalIndex += superscriptMap[character];
                }

                return ("(" + radicand +")**(1/" + normalIndex +")");
            }
        );

    return expression;
}



function convertSquareRoots(expression) {
    const pattern =
        /√(\d+(?:\.\d+)?)/g;
    return expression.replace(pattern,"Math.sqrt($1)");
}



function clearDisplay() {
    getDisplay().value = "";
    document.getElementById("history").textContent = "";
}



function deleteLast() {
    const display = getDisplay();
    display.value = display.value.slice(0, -1);
}



function percent() {
    const display = getDisplay();
    if (display.value === "") {
        return;
    }

    try {
        const value = evaluateExpression(display.value);
        display.value = value / 100;
    } 
    catch {
        display.value = "Error";
    }
}



function toggleSign() {
    const display = getDisplay();
    if (display.value === "") {
        return;
    }

    if (display.value.startsWith("-")) {
        display.value = display.value.slice(1);
    } 
    else {
        display.value ="-" + display.value;
    }
}



function toggleAngleMode() {

    if (angleMode === "DEG") {
        angleMode = "RAD";
    } 
    else {
        angleMode = "DEG";
    }

    document.getElementById("angleMode").textContent = angleMode;
}




function sin(x) {

    if (angleMode === "DEG") {
        return Math.sin(
            x * Math.PI / 180
        );
    }
    return Math.sin(x);
}


function cos(x) {

    if (angleMode === "DEG") {
        return Math.cos(
            x * Math.PI / 180
        );
    }
    return Math.cos(x);
}


function tan(x) {

    if (angleMode === "DEG") {
        return Math.tan(
            x * Math.PI / 180
        );
    }
    return Math.tan(x);
}



function evaluateExpression(expression) {


    expression =
        convertNthRoots(expression);


    expression =
        convertSquareRoots(expression);


    expression =
        expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/\^/g, "**")
            .replace(/π/g, "Math.PI")
            .replace(/\be\b/g, "Math.E");


    expression =
        expression
            .replace(/sin\(/g, "sin(")
            .replace(/cos\(/g, "cos(")
            .replace(/tan\(/g, "tan(")
            .replace(/log\(/g, "Math.log10(")
            .replace(/ln\(/g, "Math.log(");

    return eval(expression);
}



function calculate() {
    const display = getDisplay();
    const history =
        document.getElementById("history");
    if (display.value === "") {
        return;
    }


    try {

        const originalExpression =
            display.value;

        history.textContent =
            originalExpression;

        const result =
            evaluateExpression(
                display.value
            );

        if (!Number.isFinite(result)) {
            display.value = "Error";
            return;
        }

        display.value =
            Number(
                result.toFixed(12)
            );

    }


    catch (error) {
        console.error(error);
        display.value = "Error";
    }
}