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
      display.value = display.value.slice(0, display.value.length - 1);
    }
    else if (value == "Clear") {
      historyDiv.innerHTML = "";
      display.value = "";
    }
    else if (value == "Restore") {
      let lastOperation = history[0];
      let parts = lastOperation.split(" = ");
      display.value = parts[1];
      history.shift();
      updateHistory();
    }
    else if (value === "=") {
      try {
        let userInput = display.value;
        let expression = display.value;
        expression = expression.replace(/sin/g, 'Math.sin');
        expression = expression.replace(/cos/g, 'Math.cos');
        expression = expression.replace(/tan/g, 'Math.tan');
        expression = expression.replace(/√/g, 'Math.sqrt');
        expression = expression.replace(/\^/g, '**');
        expression = expression.replace(/π/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');

        expression = expression.replace(/(\d+|\))(\()/g, '$1*$2');
        expression = expression.replace(/(\d+|\))(?=\d+|Math\.(sin|cos|tan|sqrt)|\()/g, '$1*');
        expression = expression.replace(/Math\.sqrt(\d+(?:\.\d+)?)/g, 'Math.sqrt($1)');

        let result = new Function('return ' + expression)();
        result = parseFloat(result.toFixed(4));
        display.value = result;

        const historyItem = userInput + " = " + result;
        history.unshift(historyItem);
        updateHistory();

      } catch (error) {
        display.value = "Error";
      }
    }
    else {
      display.value += value;
    }
  });
});
display.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    buttons.forEach(button => {
      if (button.textContent === "=") button.click();
    });
  }
});