const buttons = document.querySelectorAll("button");
const display = document.getElementById("display");
const historyDiv = document.getElementById("history");
let history = [];

// Function to show history
function updateHistory() {
  historyDiv.innerHTML = "";
  history.forEach(item => {
    const p = document.createElement("p");
    p.innerText = item;
    historyDiv.appendChild(p);
  });
}
buttons.forEach(button => {
  button.addEventListener("click", () => {
    const value = button.textContent;

    if (value === "AC") {
      display.value = "";
    }
    else if (value === "Del") {
      const lastFourChars = display.value.slice(-4);
      const lastFiveChars = display.value.slice(-5);
      if (lastFourChars === "cos(" || lastFourChars === "sin(" || lastFourChars === "tan(" || lastFourChars === "Eror") {
        display.value = display.value.slice(0, -4);
      }
      else if (lastFiveChars === "Error") {
        display.value = display.value.slice(0, -5);
      }
      else {
        display.value = display.value.slice(0, -1);
      }
    }
    else if (value == "History Clear") {
      history = [];
      historyDiv.innerHTML = "";
      display.value = "";
    }
    else if (value == "Restore") {
      if (history.length > 0) {
        let lastOperation = history[0];
        let parts = lastOperation.split(" = ");
        display.value = parts[0];
        history.shift();
        updateHistory();
      } else {
        alert("No history to restore!");
      }
    }
    else if (value === "=") {
      try {
        let userInput = display.value;
        let expression = display.value;

        if (!/^[0-9+\-*/^().πe√\sA-Za-z]+$/.test(expression)) {
          display.value = "Invalid Input";
          return;
        }
        expression = expression.replace(/sin/g, 'Math.sin');
        expression = expression.replace(/cos/g, 'Math.cos');
        expression = expression.replace(/tan/g, 'Math.tan');
        expression = expression.replace(/√/g, 'Math.sqrt');
        expression = expression.replace(/\^/g, '**');
        expression = expression.replace(/π/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');

        expression = expression.replace(/(\d+|\))(?=Math)/g, '$1*');
        expression = expression.replace(/(Math\.E)(Math\.E)/g, '$1*$2');
        expression = expression.replace(/(Math\.PI)(Math\.PI)/g, '$1*$2');
        expression = expression.replace(/(Math\.E)(Math\.PI)/g, '$1*$2');
        expression = expression.replace(/(Math\.PI)(Math\.E)/g, '$1*$2');
        expression = expression.replace(/(\d+)(Math\.)/g, '$1*$2');

        expression = expression.replace(/(\d+|\))(\()/g, '$1*$2');
        expression = expression.replace(/Math\.sqrt(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)');

        let openBrackets = (expression.match(/\(/g) || []).length;
        let closeBrackets = (expression.match(/\)/g) || []).length;
        if (openBrackets > closeBrackets) {
          expression += ')'.repeat(openBrackets - closeBrackets);
        }
        let result = new Function('return ' + expression)();
        result = parseFloat(result.toFixed(4));
        display.value = result;
        if (!isFinite(result)) {
          display.value = "Error";
          return;
        }
        const historyItem = userInput + " = " + result;
        history.push(historyItem);
        updateHistory();
      }
      catch (error) {
        display.value = "Error";
      }
    }

    else {
      if (value === ".") {
        const parts = display.value.split(/[\+\-\*\/\(\)]/);
        const lastPart = parts[parts.length - 1];
        if (lastPart.includes(".")) {
          return;
        }
      }
      display.value += value;
    }
  });
});

display.addEventListener("keydown", (event) => {
  const allowedKeys = "0123456789+-*/().";
  if (event.key === "Enter") {
    event.preventDefault();
    buttons.forEach(button => {
      if (button.textContent === "=") button.click();
    });
  }

  else if (!allowedKeys.includes(event.key)) {
    event.preventDefault();
  }
});