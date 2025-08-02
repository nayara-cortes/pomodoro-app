/** TASKS LOGIC */

/** GLOBAL VARIABLES */
let taskList = [
    {text: "Figma UI Design.", completed: false},
    {text: "Work on the website layout (no logic).", completed: false}, 
    {text: "Add scrollbar.", completed: false},
];


function renderTasks() {
    let task_ul = document.getElementById("task-list-ul");
    task_ul.innerHTML = "";

    taskList.forEach((task, index, taskList) => {

        // Creamos li + checkbox
        let li = document.createElement("li"); // Creamos el elemento li

        // Creamos checkbox
        const checkbox = document.createElement("span"); // Creamos un elemento span para poder darle comportamiento
        checkbox.classList.add("task-checkbox"); // Le damos el estilo de la clase task-checkbox
        checkbox.addEventListener("click", () => completeTask(index));

        // Creamos texto
        const text = document.createElement("span"); // Creamos un texto nodo para poder añadirlo a li
        text.classList.add("task-text");
        text.textContent = task.text; 

        // Si la tarea está completada, añadir tick al checkbox + cambiar estilo texto
        if(task.completed === true) {
            checkbox.classList.add("task-completed-checkbox");
            text.classList.add("task-completed-text");
        }

        

        
        li.appendChild(checkbox); // Le añadimos el checkbox

        
        li.appendChild(text);

        // Añadimos el li a ul
        task_ul.appendChild(li);
    });
}

function completeTask(id) {
    if(taskList[id].completed === true) {
        taskList[id].completed = false;
    } else {
        taskList[id].completed = true;
    }
    renderTasks();
}

renderTasks();
