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
        // Creamos checkbox
        const checkbox = document.createElement("span"); // Creamos un elemento span para poder darle comportamiento
        checkbox.classList.add("task-checkbox"); // Le damos el estilo de la clase task-checkbox

        // Si la tarea está completada, añadir tick al checkbox
        if(task.completed === true) {
            checkbox.classList.add("task-completed-checkbox");
        }

        // EVENT LISTENER
        checkbox.addEventListener("click", () => completeTask(index));

        // Creamos li + checkbox
        let li = document.createElement("li"); // Creamos el elemento li
        li.appendChild(checkbox); // Le añadimos el checkbox

        // Creamos texto y lo añadimos a li
        const text = document.createTextNode(task.text); // Creamos un texto nodo para poder añadirlo a li
        li.appendChild(text);

        // Añadimos el li a ul
        task_ul.appendChild(li);
    });
}

function completeTask(id) {
    taskList[id].completed = true;
    
}

renderTasks();
