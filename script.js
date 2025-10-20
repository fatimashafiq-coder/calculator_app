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

    if (value === "AC" || value === "C") {
      display.value = "";
    }
    else if (value === "Del") {
      display.value = display.value.slice(0, -1);
    }
    else if (value === "=") {
      try {
        let expression = display.value;
        expression = expression.replace(/sin/g, 'Math.sin');
        expression = expression.replace(/cos/g, 'Math.cos');
        expression = expression.replace(/tan/g, 'Math.tan');
        expression = expression.replace(/√/g, 'Math.sqrt');
        expression = expression.replace(/\^/g, '**');
        expression = expression.replace(/π/g, 'Math.PI');
        expression = expression.replace(/e/g, 'Math.E');

        const result = new Function('return ' + expression)();
        const historyItem = display.value + " = " + result;
        history.unshift(historyItem);
        updateHistory();
        display.value = result;
      } catch (error) {
        display.value = "Error";
      }
    }
    else {
      display.value += value;
    }
  });
});