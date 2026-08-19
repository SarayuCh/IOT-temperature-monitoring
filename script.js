let simulationRunning = false;
let simulationInterval = null;
let temperatures = [];
let times = [];
const threshold = 35;

function startSimulation() {
    if (simulationRunning) return;

    simulationRunning = true;
    document.getElementById("simulationStatus").innerText = "ON";
    document.getElementById("alertMessage").innerText =
        "Temperature simulation started.";

    generateTemperature();

    simulationInterval = setInterval(generateTemperature, 2000);
}

function stopSimulation() {
    simulationRunning = false;
    clearInterval(simulationInterval);
    simulationInterval = null;

    document.getElementById("simulationStatus").innerText = "OFF";
    document.getElementById("alertMessage").innerText =
        "Temperature simulation stopped.";
}

function restartSimulation() {
    clearInterval(simulationInterval);

    simulationRunning = false;
    simulationInterval = null;
    temperatures = [];
    times = [];

    document.getElementById("simulationStatus").innerText = "OFF";
    document.getElementById("temperature").innerText = "25.0";

    const status = document.getElementById("status");
    status.innerText = "Normal";
    status.className = "status normal";

    document.getElementById("alertMessage").innerText =
        "System restarted successfully.";

    document.getElementById("historyTable").innerHTML = "";

    drawGraph();
}

function generateTemperature() {
    const temperature = 20 + Math.random() * 20;
    updateTemperature(temperature);
}

function generateLowTemperature() {
    const temperature = 10 + Math.random() * 10;
    updateTemperature(temperature);
}

function generateNormalTemperature() {
    const temperature = 24 + Math.random() * 5;
    updateTemperature(temperature);
}

function generateHighTemperature() {
    const temperature = 36 + Math.random() * 9;
    updateTemperature(temperature);
}

function updateTemperature(temperature) {
    temperature = Number(temperature.toFixed(1));

    document.getElementById("temperature").innerText = temperature;

    const statusElement = document.getElementById("status");
    const alertMessage = document.getElementById("alertMessage");

    let status;

    if (temperature < 20) {
        status = "Low";
        statusElement.className = "status low";
        alertMessage.innerText =
            "LOW ALERT: Temperature is below normal.";
    } else if (temperature < 30) {
        status = "Normal";
        statusElement.className = "status normal";
        alertMessage.innerText =
            "Temperature is within the normal range.";
    } else if (temperature < threshold) {
        status = "Warning";
        statusElement.className = "status warning";
        alertMessage.innerText =
            "WARNING: Temperature is near the safe threshold.";
    } else {
        status = "Critical";
        statusElement.className = "status critical";
        alertMessage.innerText =
            "CRITICAL ALERT: Temperature exceeded the safe threshold.";
    }

    statusElement.innerText = status;

    const time = new Date().toLocaleTimeString();

    temperatures.push(temperature);
    times.push(time);

    if (temperatures.length > 20) {
        temperatures.shift();
        times.shift();
    }

    updateHistory(time, temperature, status);
    drawGraph();
}

function updateHistory(time, temperature, status) {
    const table = document.getElementById("historyTable");
    const row = table.insertRow(0);

    row.insertCell(0).innerText = time;
    row.insertCell(1).innerText = temperature + " °C";

    const statusCell = row.insertCell(2);
    statusCell.innerText = status;

    if (status === "Normal") {
        statusCell.style.color = "green";
    } else if (status === "Low") {
        statusCell.style.color = "#0b5c8e";
    } else if (status === "Warning") {
        statusCell.style.color = "#856404";
    } else {
        statusCell.style.color = "red";
    }

    while (table.rows.length > 10) {
        table.deleteRow(table.rows.length - 1);
    }
}

function drawGraph() {
    const canvas = document.getElementById("temperatureChart");
    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (temperatures.length === 0) {
        ctx.fillStyle = "#486581";
        ctx.font = "18px Arial";
        ctx.textAlign = "center";
        ctx.fillText(
            "Start simulation to view temperature graph",
            canvas.width / 2,
            canvas.height / 2
        );
        ctx.textAlign = "left";
        return;
    }

    const left = 65;
    const right = 30;
    const top = 30;
    const bottom = 45;

    const width = canvas.width - left - right;
    const height = canvas.height - top - bottom;

    ctx.strokeStyle = "#d9e2ec";
    ctx.lineWidth = 1;

    for (let i = 0; i <= 5; i++) {
        const y = top + (height / 5) * i;

        ctx.beginPath();
        ctx.moveTo(left, y);
        ctx.lineTo(canvas.width - right, y);
        ctx.stroke();

        ctx.fillStyle = "#486581";
        ctx.font = "12px Arial";
        ctx.fillText((50 - i * 10) + "°C", 15, y + 4);
    }

    ctx.beginPath();

    temperatures.forEach((temp, index) => {
        const x = temperatures.length === 1
            ? left + width / 2
            : left + (index / (temperatures.length - 1)) * width;

        const y = top + ((50 - temp) / 50) * height;

        if (index === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    });

    ctx.strokeStyle = "#102a43";
    ctx.lineWidth = 3;
    ctx.stroke();

    temperatures.forEach((temp, index) => {
        const x = temperatures.length === 1
            ? left + width / 2
            : left + (index / (temperatures.length - 1)) * width;

        const y = top + ((50 - temp) / 50) * height;

        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fillStyle = "#102a43";
        ctx.fill();
    });
}

function showDashboard() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

function showGraph() {
    document.getElementById("graphSection").scrollIntoView({
        behavior: "smooth"
    });
}

function showHistory() {
    document.getElementById("historySection").scrollIntoView({
        behavior: "smooth"
    });
}

function showAlert() {
    document.getElementById("alertSection").scrollIntoView({
        behavior: "smooth"
    });
}

drawGraph();