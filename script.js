let angleMode = "DEG";


// Display helpers
function getDisplay() {
    return document.getElementById("display");
}

function getHistory() {
    return document.getElementById("history");
}


// Cursor helpers (Get the current cursor position.)
function getCursorPosition() {
    const display = getDisplay();
    const selection =
        window.getSelection();

    if (!selection.rangeCount) {
        return display.textContent.length;
    }
    const range =
        selection.getRangeAt(0);

    return range.startOffset;
}

// Cursor helpers (Place the cursor at a specific position in the display.)
function setCursorPosition(position) {
    const display = getDisplay();
    const selection = window.getSelection();
    const range = document.createRange();

    range.selectNodeContents(display);
    range.collapse(true);

    if (display.firstChild) {
        range.setStart(display.firstChild,Math.min(position,display.firstChild.length));
    } 
    else {
        range.setStart(display, 0);
    }

    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    display.focus();
}


// Cursor helpers (Insert text exactly where the cursor is.)

function insertText(text) {
    const display = getDisplay();
    const selection = window.getSelection();

    if (!selection.rangeCount) {
        display.textContent += text;
        return;
    }

    const range = selection.getRangeAt(0);

    range.deleteContents();

    const textNode = document.createTextNode(text);

    range.insertNode(textNode);
    range.setStartAfter(textNode);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);

    display.focus();
}


// Numbers
function appendNumber(number) {
    insertText(number);
}

// Operators
function appendOperator(operator) {
    const display = getDisplay();
    const value = display.textContent;

    if (/[+\-×÷^]$/.test(value)) {
        deleteLast();
    }


    const symbol =
        operator === "*"
            ? "×"
            : operator === "/"
            ? "÷"
            : operator;


    insertText(symbol);
}


// Decimal point
function appendDecimal() {
    insertText(".");
}


// Scientific functions
function appendFunction(func) {
    if (func === "square") {
        insertText("^2");
        return;
    }

    if (func === "cube") {
        insertText("^3");
        return;
    }

    if (func === "reciprocal") {
        insertText("^-1");
        return;
    }

    const functionText =
        func + "()";

    insertText(functionText);


// Cursor helpers (Move cursor inside the parentheses.)

    const display = getDisplay();
    const position = display.textContent.length - 1;

    setCursorPosition(position);
}


// Parentheses
function appendParenthesis(parenthesis) {
    insertText(parenthesis);
}


// Constants
function appendConstant(constant) {
    insertText(constant);
}


// Square root
function appendRoot() {
    insertText("√");
}


// Cube root
function appendCubeRoot() {
    insertText("³√");
}


// Nth root
function appendNthRoot() {
    const index = prompt("Enter the index of the root:");

    if (index === null) {
        return;
    }

    if (index.trim() === "" ||
        isNaN(index) ||
        Number(index) < 2) {

        alert("Please enter an index of 2 or greater.");
        return;
    }


    insertText(toSuperscript(index) + "√");
}


// Superscript conversion
function toSuperscript(number) {
    const normal = "0123456789+-()";
    const superscript = "⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁽⁾";


    return String(number)
        .split("")
        .map(character => {

            const index = normal.indexOf(character);


            return index >= 0
                ? superscript[index]
                : character;

        })
        .join("");
}


// Fraction insertion
function insertFraction() {
    const display = getDisplay();
    const selection = window.getSelection();
    const fraction = document.createElement("span");

    fraction.className = "fraction";

    const numerator = document.createElement("span");
    numerator.className = "numerator";
    numerator.textContent = " ";

    const denominator = document.createElement("span");
    denominator.className = "denominator";
    denominator.textContent = " ";

    fraction.appendChild(numerator);
    fraction.appendChild(denominator);

    if (!selection.rangeCount) {
        display.appendChild(fraction);
        return;
    }


    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(fraction);


// Cursor helpers (Put the cursor inside the numerator.)

    const newRange = document.createRange();
    newRange.selectNodeContents(numerator);
    newRange.collapse(true);

    selection.removeAllRanges();
    selection.addRange(newRange);

    display.focus();
}


// Factorial insertion
function factorial() {
    insertText("!");
}


// Plus/minus toggle
function toggleSign() {
    const display = getDisplay();
    const value = display.textContent;

    if (value === "") {
        return;
    }

    if (value.startsWith("-")) {
        display.textContent = value.slice(1);

    } else {
        display.textContent = "-" + value;
    }
}


// Percentage insertion
function percent() {
    insertText("%");
}


// Delete last character or selection
function deleteLast() {
    const display = getDisplay();
    const selection = window.getSelection();

    if (!selection.rangeCount) {
        return;
    }

    const range = selection.getRangeAt(0);


// Delete selected text if any
    if (!range.collapsed) {
        range.deleteContents();
        return;
    }


// Delete the character before the cursor if no selection
    if (range.startContainer.nodeType === Node.TEXT_NODE) {
        const node = range.startContainer;
        const position = range.startOffset;

        if (position > 0) {
            node.deleteData(
                position - 1,
                1
            );
        }
    }
}


// Clear display and history
function clearDisplay() {
    getDisplay().textContent = "";
    getHistory().textContent = "";
}


// Toggle angle mode between degrees(DEG) and radians(RAD)
function toggleAngleMode() {
    angleMode =
        angleMode === "DEG"
            ? "RAD" : "DEG";

    document.getElementById("angleMode").textContent = angleMode;
}


// Trigonometric functions
function sin(x) {
    return angleMode === "DEG"
        ? Math.sin(x * Math.PI / 180)
        : Math.sin(x);
}

function cos(x) {
    return angleMode === "DEG"
        ? Math.cos(x * Math.PI / 180)
        : Math.cos(x);
}

function tan(x) {
    return angleMode === "DEG"
        ? Math.tan(x * Math.PI / 180)
        : Math.tan(x);
}

// Factorial calculation
function factorialValue(number) {
    number = Number(number);

    if (!Number.isInteger(number) || number < 0) {
        throw new Error("Invalid factorial");
    }

    let result = 1;

    for (
        let i = 2;
        i <= number;
        i++
    ) {
        result *= i;
    }

    return result;
}


// Root conversion
function convertRoots(expression) {

// Cube root.
    expression = expression.replace(
            /³√(\d+(?:\.\d+)?)/g,
            "Math.cbrt($1)"
        );

// Square root.
    expression = expression.replace(
            /√(\d+(?:\.\d+)?)/g,
            "Math.sqrt($1)"
        );


// Nth root.
    const map = {
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


    expression = expression.replace(
            /([⁰¹²³⁴⁵⁶⁷⁸⁹]+)√(\d+(?:\.\d+)?)/g,

            function(match,index,radicand) {
                let normalIndex = "";

                for (const char of index) {
                    normalIndex += map[char];
                }

                return ("(" + radicand +")**(1/" +normalIndex +")");
            }
        );

    return expression;
}


// Factorial conversion
function convertFactorials(expression) {
    return expression.replace(
        /(\d+(?:\.\d+)?)!/g,
        "factorialValue($1)"
    );
}


// Evaluate the mathematical expression
function evaluateExpression(expression) {

// Roots.
    expression = convertRoots(expression);

// Factorials.
    expression = convertFactorials(expression);

// Calculator symbols (operators and constants)
    expression = expression
            .replace(/×/g, "*")
            .replace(/÷/g, "/")
            .replace(/\^/g, "**")
            .replace(/π/g, "Math.PI")
            .replace(/\be\b/g, "Math.E");


// Logarithims
    expression = expression
            .replace(/log\(/g,"Math.log10(")
            .replace(/ln\(/g,"Math.log(");


// Evaluate
    return eval(expression);
}


// Calculate the result and update the display and history
function calculate() {
    const display = getDisplay();
    const history = getHistory();
    const expression = display.textContent;

    if (expression.trim() === "") {
        return;
    }

// Save history before calculation
    try {
        history.textContent = expression;

// Calculate the result 
        const result = evaluateExpression(expression);

// Check for finite result
        if (!Number.isFinite(result)) {
            display.textContent = "Error";
            return;
        }


// Limit floating-point precision to 12 decimal places 
        display.textContent = Number(result.toFixed(12));
    } 
    catch (error) {
        console.error("Calculation error:",error);

        display.textContent = "Error";
    }
}
