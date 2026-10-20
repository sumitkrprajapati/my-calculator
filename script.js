const display = document.getElementById("display");
const buttons = document.querySelector(".buttons");
let historyList = JSON.parse(
    localStorage.getItem("calculatorHistory") || "[]"
);
const historyDisplay = document.getElementById("history");
const clearHistoryButton = document.getElementById("clear-history");
let expression = "";
let justCalculated = false;

function updateDisplay() {
    display.value = expression;
}

function renderHistory() {
    const historyDisplay =
        document.getElementById("history-list");

    if (!historyDisplay) {
        console.log("History HTML element nahi mila!");
        return;
    }

    historyDisplay.innerHTML = "";

    historyList.slice().reverse().forEach(function(item) {
       const li = document.createElement("li");
li.textContent = item.expression + " = " + item.result;

li.style.cursor = "pointer";

li.addEventListener("click", function() {
    expression = item.expression;
    justCalculated = false;
    updateDisplay();
});

historyDisplay.appendChild(li);
    });
}
function saveHistory() {
    localStorage.setItem(
        "calculatorHistory",
        JSON.stringify(historyList)
    );
}
function calculate() {
    if (!expression) return;

    try {
        if (!/^[0-9+\-*/%.() ]+$/.test(expression)) {
            throw new Error("Invalid expression");
        }

       
       const originalExpression = expression;

        const result = Function(
            '"use strict"; return (' + expression + ')'
        )();

        if (typeof result !== "number" || !Number.isFinite(result)) {
            throw new Error("Invalid result");
        }


expression = String(
    Math.round((result + Number.EPSILON) * 1e10) / 1e10
);

historyList.push({
    expression: originalExpression,
    result: expression
});
saveHistory();
renderHistory();

console.log(historyList);

updateDisplay();
justCalculated = true;
    } catch {
        display.value = "Error";
        expression = "";
        justCalculated = false;
    }
}

buttons.addEventListener("click", function (event) {
    const button = event.target.closest("button");
    if (!button) return;

    const action = button.dataset.action;
    const value = button.dataset.value;

    if (action === "clear") {
        expression = "";
        display.value = "";
        justCalculated = false;
        return;
    }

    if (action === "delete") {
        if (justCalculated) {
            expression = "";
            justCalculated = false;
        } else {
            expression = expression.slice(0, -1);
        }
        updateDisplay();
        return;
    }

    if (action === "calculate") {
        calculate();
        return;
    }

    if (justCalculated) {
        expression = "";
        justCalculated = false;
    }

    expression += value;
    updateDisplay();
});
document.addEventListener("keydown", function (event) {
    const key = event.key;

    if (/^[0-9.]$/.test(key)) {
        if (justCalculated) {
            expression = "";
            justCalculated = false;
        }
        expression += key;
        updateDisplay();
    } else if (["+", "-", "*", "/", "%"].includes(key)) {
        expression += key;
        justCalculated = false;
        updateDisplay();
    } else if (key === "Enter" || key === "=") {
        calculate();
    } else if (key === "Backspace") {
        expression = expression.slice(0, -1);
        justCalculated = false;
        updateDisplay();
    } else if (key === "Escape") {
        expression = "";
        justCalculated = false;
        updateDisplay();
    }
});
clearHistoryButton.addEventListener("click", function () {
    historyList.length = 0;
    saveHistory();
    renderHistory();
});
document.getElementById("clear-history")
    .addEventListener("click", function() {
        historyList.length = 0;
        renderHistory();
    });