/* TIMER LOGIC */

/* GLOBAL VARIABLES */
let myTimer = null;
let minutes, seconds;
let f_minutes = 25, f_seconds = 0;
let s_minutes = 5, s_seconds = 0;
let l_minutes = 10, l_seconds = 0;
let currentPhase = "work";
let session = 1;
let sessionMAX = 2;

const phaseTimes = { work: [f_minutes, f_seconds], shortBreak: [s_minutes, s_seconds], longBreak: [l_minutes, l_seconds] };
setTimeFromPhase();

/* --------------------TIMER LOGIC FUNCTIONS------------------- */

/** Comienzo del temporizador */
function startTimer() {
    // 1. Cambiar el icono a pause
    if(myTimer === null) {
        toggleVisibility("pause-btn", "start-btn");
        timer();
        myTimer = setInterval(timer, 1000);
    }
}

// Maneja el temporizador en marcha: 
// Resta segundos, minutos, y maneja lo que pasa cuando termina.
function timer() {
    showTime();
    if(seconds > 0) {
        seconds--;
    } else if(minutes > 0) {
        minutes--;
        seconds = 59;
    } else {
        clearInterval(myTimer);
        toggleVisibility("start-btn", "pause-btn");
        changePhase();
    }
}

function checkTime(i) {
    if(i < 10) {
        i = "0" + i;
    }
    return i;
}

function pauseTimer() {
    toggleVisibility("start-btn", "pause-btn");
    if(myTimer !== null) {
        clearInterval(myTimer);
        myTimer = null;
    }   
}

function restartTimer() {
    pauseTimer();
    setTimeFromPhase();
    showTime();
}

function changePhase() {
    if(currentPhase === "work") {
        if(session < sessionMAX) {
            session++;
            currentPhase = "shortBreak";
        } else {
            session = 0;
            currentPhase = "longBreak";
        }
    } else if(currentPhase === "shortBreak") {
        currentPhase = "work";
    } else {
        currentPhase = "work";
    }
    // Paramos ejecución de setInterval
    clearInterval(myTimer);
    myTimer = null;
    // Establecemos el tiempo de la fase.
    setTimeFromPhase();
    updatePhaseStyle();
    showTime();
}

// Muestra el tiempo
function showTime() {
    let divMinutes = document.createElement("div");
    
    let colon = document.createElement("span");
    let divSeconds = document.createElement("div");


    divMinutes.textContent = checkTime(minutes);
    colon.textContent = ":";
    divSeconds.textContent = checkTime(seconds);

    const timeDisplay = document.getElementById("time-display");
    timeDisplay.innerHTML = ""; // Limpia el contenido anterior

    document.getElementById("time-display").appendChild(divMinutes);
    document.getElementById("time-display").appendChild(colon);
    document.getElementById("time-display").appendChild(divSeconds);
}

// Cambia la visibilidad de los botones (pausa/inicio) del temporizador
function toggleVisibility(idToShow, idToHide) {
    document.getElementById(idToShow).style.visibility="visible";
    document.getElementById(idToHide).style.visibility="hidden";
}

// Establece el tiempo del temporizador según la fase en la que estemos 
function setTimeFromPhase() {
    [minutes, seconds] = phaseTimes[currentPhase];
}

/** Cambio visual de fase */
function updatePhaseStyle() {
    const buttons = ["focus-btn", "short-break-btn", "long-break-btn"];
    buttons.forEach(id => {
        document.getElementById(id).classList.remove("active-phase");
        document.getElementById(id).classList.add("inactive-phase");
    });

    // Activar solo el que corresponde según currentPhase
    if (currentPhase === "work") {
        document.getElementById("focus-btn").classList.remove("inactive-phase");
        document.getElementById("focus-btn").classList.add("active-phase");
    } else if (currentPhase === "shortBreak") {
        document.getElementById("short-break-btn").classList.remove("inactive-phase");
        document.getElementById("short-break-btn").classList.add("active-phase");
    } else if (currentPhase === "longBreak") {
        document.getElementById("long-break-btn").classList.remove("inactive-phase");
        document.getElementById("long-break-btn").classList.add("active-phase");
    }
}

function focusMode(id) {
    switch(id) {
        case "focus-btn":
            currentPhase = "work";
            break;
        case "short-break-btn":
            currentPhase = "shortBreak";
            break;
        case "long-break-btn":
            currentPhase = "longBreak";
            break;
    }
    setTimeFromPhase();
    updatePhaseStyle();
    showTime();
}



function activateEditMode(unit) {
    const block = document.querySelector(`.time-unit[data-unit="${unit}"]`);
    const span = block.querySelector('.time-value');
    const input = block.querySelector('.input-time');

    span.classList.add("hidden");
    input.classList.remove("hidden");
    input.value = span.textContent;
    input.focus();

    input.onkeydown = (event) => {
        if(event.key === "Enter") {
            let newValue = input.value.trim();
            // Validar que es un número entre 0 y 59 (segundos) o >= 0 (minutos)
            if (!/^\d{1,2}$/.test(newValue)) return; // ignora si no es válido
            if (newValue.length === 1) {
                newValue = "0" + newValue;
            }
            span.textContent = newValue;
            updatePhaseTimes(unit, newValue);
            input.classList.add("hidden");
            span.classList.remove("hidden");
        } 
    }
    input.onblur = () => {
        let newValue = input.value.trim();
        if (!/^\d{1,2}$/.test(newValue)) {
            newValue = span.textContent; // Si no es válido, restaurar el valor original
        } else {
            newValue = checkTime(newValue); // Formatea a 2 dígitos
        }

        span.textContent = newValue;
        updatePhaseTimes(unit, newValue);
        input.classList.add("hidden");
        span.classList.remove("hidden");
    };

    
}

function updatePhaseTimes(unit, value) {
    if (unit === "minutes") {
        phaseTimes[currentPhase][0] = parseInt(value);
        minutes = parseInt(value);
    } else if (unit === "seconds") {
        phaseTimes[currentPhase][1] = parseInt(value);
        seconds = parseInt(value);
    }
}


document.getElementById("time-display").addEventListener("click", function (e) {
    if (e.target.classList.contains("time-value")) {
        const parent = e.target.closest(".time-unit");
        const unit = parent.getAttribute("data-unit");
        activateEditMode(unit);
    }
});


document.getElementById("start-btn").addEventListener("click", startTimer);
document.getElementById("pause-btn").addEventListener("click", pauseTimer);
document.getElementById("restart-btn").addEventListener("click", restartTimer);

document.getElementById("focus-btn").addEventListener("click", () => focusMode("focus-btn"));
document.getElementById("short-break-btn").addEventListener("click", () => focusMode("short-break-btn"));
document.getElementById("long-break-btn").addEventListener("click", () => focusMode("long-break-btn"));


// document.getElementById("config-timer-btn").addEventListener("click", configTimer);


/* Anotaciones para entender el temporizador
    - setInterval(function, 1000 milisegundos) --> ejecuta la función cada 1 segundo
    - clearInterval --> detiene la ejecución de setInterval (si no, sería infinito)
*/