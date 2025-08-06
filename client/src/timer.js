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
showTime();

/* --------------------TIMER LOGIC FUNCTIONS------------------- */

/** Comienzo del temporizador */
function startTimer() {
    showTime();
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
    document.getElementById("time-display").innerHTML = checkTime(minutes) + ":" + checkTime(seconds);
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




function updatePhaseTimes(unit, value) {
    if (unit === "minutes") {
        phaseTimes[currentPhase][0] = parseInt(value);
        minutes = parseInt(value);
    } else if (unit === "seconds") {
        phaseTimes[currentPhase][1] = parseInt(value);
        seconds = parseInt(value);
    }
}

function configTimer() {
    document.getElementById("config-overlay").classList.remove("hidden");
    document.getElementById("config-display").classList.remove("hidden");
    
}


function escClose(event) {
    if (event.key === "Escape") {
        document.querySelector(".config-display")?.remove();
        document.getElementById("config-overlay").classList.add("hidden");

        // 💡 Muy importante: quita el listener después de cerrar
        document.removeEventListener("keydown", escClose);
    }
}


document.getElementById("start-btn").addEventListener("click", startTimer);
document.getElementById("pause-btn").addEventListener("click", pauseTimer);
document.getElementById("restart-btn").addEventListener("click", restartTimer);

document.getElementById("focus-btn").addEventListener("click", () => focusMode("focus-btn"));
document.getElementById("short-break-btn").addEventListener("click", () => focusMode("short-break-btn"));
document.getElementById("long-break-btn").addEventListener("click", () => focusMode("long-break-btn"));


document.getElementById("config-timer-btn").addEventListener("click", configTimer);


/* Anotaciones para entender el temporizador
    - setInterval(function, 1000 milisegundos) --> ejecuta la función cada 1 segundo
    - clearInterval --> detiene la ejecución de setInterval (si no, sería infinito)
*/