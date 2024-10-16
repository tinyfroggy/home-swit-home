// #region calender sittings
/**
 * This section handles the settings for the calendar.
 */
const month = document.getElementById('monthName');
const day = document.getElementById("dayName");
const number = document.getElementById("numberOfDay");
const year = document.getElementById("year");
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

const date = new Date();

month.innerHTML = months[date.getMonth()];
day.innerHTML = days[date.getDay()];
number.innerHTML = date.getDate();
year.innerHTML = date.getFullYear();

// #endregion end calender sittings

// #region timer sittings
/**
 * This section handles the settings for the timer.
 */
const display = document.querySelector(".display-timer");
const start = document.querySelector(".start-timer");
const pause = document.querySelector(".pause-timer");
const reset = document.querySelector(".restart-timer");
const save = document.querySelector(".save-timer");
const hours_completed = document.getElementById("hrs");

let startTime = 0;
let elapsedTime = 0;
let paused = true;
let intervalId;
let hrs = 0;
let mins = 0;
let secs = 0;

const savedHours = localStorage.getItem("savedHours");

if (savedHours) {
    hours_completed.innerHTML = savedHours;
}

/**
 * This function starts the timer.
 */

start.addEventListener("click", () => {
    if (paused) {
        paused = false;
        startTime = Date.now() - elapsedTime;
        intervalId = setInterval(updateTimer, 1000);
    }
});

/**
 * This function pauses the timer.
 */
pause.addEventListener("click", () => {
    if (!paused) {
        paused = true;
        clearInterval(intervalId);
    }
});

/**
 * This function resets the timer.
 */
reset.addEventListener("click", () => {
    paused = true;
    clearInterval(intervalId);
    display.textContent = "00 : 00 : 00";
    hrs = 0;
    mins = 0;
    secs = 0;
    elapsedTime = 0;
    startTime = 0;
});

/**
 * This function saves the hours completed.
 */

save.addEventListener("click", () => {
    paused = true;
    clearInterval(intervalId);

    let today = new Date().toLocaleDateString(); // date today
    let savedDate = localStorage.getItem("savedDate");  // date saved
    let previousHours = parseInt(localStorage.getItem("savedHours")) || 0; // hours saved

    // if today != the date saved 
    if (today !== savedDate) {
        previousHours = 0;
    }

    if (hrs > 0) {
        let totalHours = previousHours + hrs;
        localStorage.setItem("savedHours", totalHours);  // save the total hours
        localStorage.setItem("savedDate", today);  // save the date to day
        hours_completed.innerHTML = totalHours;
        alert("Hours saved successfully!");
    } else {
        alert("You can only save if the hours are greater than 0.");
    }

    // restart the timer
    display.textContent = "00 : 00 : 00";
    hrs = 0;
    mins = 0;
    secs = 0;
    elapsedTime = 0;
    startTime = 0;
});


/**
 * This function updates the timer display.
 */
function updateTimer() {
    elapsedTime = Date.now() - startTime;
    hrs = Math.floor(elapsedTime / (1000 * 60 * 60));
    mins = Math.floor((elapsedTime / (1000 * 60)) % 60);
    secs = Math.floor((elapsedTime / 1000) % 60);

    secs = pad(secs);
    mins = pad(mins);
    hrs = pad(hrs);

    display.innerHTML = `${hrs} : ${mins} : ${secs}`;
}

/**
 * This function pads a number with a leading zero if it is less than 10.
 * @param {number} uint The number to pad.
 */

function pad(uint) {
    return ("0" + uint).length > 2 ? uint : "0" + uint;
}

// #endregion timer sittings

// #region to-do list
/**
*  This section handles the settings for the to-do list.
*/
// tasks data

let tasks = [
    {
        "title": "read the book",
        "date": "2020/10/11",
        "isDone": false
    },
    {
        "title": "read the",
        "date": "2025/10/11",
        "isDone": false
    },
    {
        "title": "read",
        "date": "2030/10/11",
        "isDone": false
    }
];

function getTasksFromLocalStorage() {
    let retrievedTasks = JSON.parse(localStorage.getItem("to-do-task"));
    if (retrievedTasks === null) {
        tasks = []
    } else {
        tasks = retrievedTasks
    }
}

getTasksFromLocalStorage()

const taskContainer = document.querySelector('.task');
const addBtn = document.querySelector(".add-task");
let editIndex = null;

// dates
const taskDate = new Date();
const taskYear = taskDate.getFullYear();
const taskMonth = taskDate.getMonth();
const taskDay = taskDate.getDate();
const taskHour = taskDate.getHours();
const taskMinute = taskDate.getMinutes();
let pmOrAm = taskHour >= 12 ? "pm" : "am";

if (taskHour > 12) {
    taskHour -= 12;
    pmOrAm = "pm";
} else if (taskHour === 0) {
    taskHour = 12;
    pmOrAm = "am";
}
let dateStr = taskDay + "/" + taskMonth + "/" + taskYear + " " + taskHour + pmOrAm + " : " + taskMinute + "m";


// show all tasks
/**
* This function displays all the tasks in the to-do list.
*/
function displayTasks() {
    taskContainer.innerHTML = ``;

    tasks.forEach((task, index) => {
        const taskElement = `
            <div class="task-body">
                <h2 class="title-task ${task.isDone ? "done" : ""}">${task.title}<span class="date-task">${task.date}</span></h2>
                <button class="delete-task circle" onclick="deleteTask(${index})"><i class="fa-solid fa-trash"></i></button>
                ${task.isDone ? `<button class="done-task circle" onclick="markDone(${index})"><i class="fa-solid fa-close"></i></button>` : `<button class="done-task circle " onclick="markDone(${index})"><i class="fa-solid fa-check"></i></button>`}
                <button class="edit-task circle" onclick="editTask(${index})"><i class="fa-solid fa-pen-to-square"></i></button>
            </div>
        `;
        taskContainer.innerHTML += taskElement;
    });
}

// add new task
/**
* This function adds a new task to the to-do list.
*/
addBtn.addEventListener("click", () => {
    showCustomPrompt("add");
});

// edit existing task
/**
 * This function edits an existing task in the to-do list.
 * @param {number} index The index of the task to edit.
 */
function editTask(index) {
    document.q
    editIndex = index;
    showCustomPrompt("edit", tasks[index].title);
}

// delete task
/**
 * This function deletes a task from the to-do list.
 * @param {number} index The index of the task to delete.
 */
function deleteTask(index) {
    tasks.splice(index, 1);

    storTask()
    displayTasks();
}

// mark task as done
/**
 * This function marks a task as done in the to-do list.
 * @param {number} index The index of the task to mark as done.
 */
function markDone(index) {
    tasks[index].isDone = !tasks[index].isDone;

    storTask()
    displayTasks();
}

// show custom prompt for adding/editing
/**
 * This function shows a custom prompt for adding or editing a task in the to-do list.
 * @param {string} type The type of the prompt, either "add" or "edit".
 * @param {string} value The initial value of the prompt, if editing.
 */
function showCustomPrompt(type, value = "") {
    const input = document.getElementById('promptInput');
    input.value = value;  // fill input if editing
    document.getElementById('customPrompt').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
    input.focus()

    input.onkeydown = function (event) {
        if (event.key === 'Enter') {
            submitPrompt(type);
        }
    };

    document.getElementById('submitBtn').onclick = function () {
        submitPrompt(type);
    };
}

// submit prompt value
/**
 * This function submits the value of the custom prompt for adding or editing a task in the to-do list.
 * @param {string} type The type of the prompt, either "add" or "edit".
 */
function submitPrompt(type) {
    const input = document.getElementById('promptInput').value.trim();

    if (input === '') {
        alert("Please enter a task");
        return;
    }

    if (type === "add") {
        tasks.push({ title: input, date: dateStr, isDone: false });
    } else if (type === "edit") {
        tasks[editIndex].title = input;
    }

    storTask();
    displayTasks();
    closePrompt();
}

// close prompt
/**
 * This function closes the custom prompt for adding or editing a task in the to-do list.
 */
function closePrompt() {
    document.getElementById('customPrompt').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('promptInput').value = '';
}

function storTask() {
    let tasksJason = JSON.stringify(tasks);
    localStorage.setItem("to-do-task", tasksJason);
}

// initial display of tasks
storTask()
displayTasks();

// #endregion to-do list
