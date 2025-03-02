// Init an array to store tasks with an object format
let tasks = [];

// DOM Elements
const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");
const taskList = document.getElementById("taskList");
const clearTaskBtn = document.getElementById("clearTaskBtn");
const emptyState = document.getElementById("emptyState");
const taskCounter = document.getElementById("taskCounter");

// Load tasks from local storage when the page loads
document.addEventListener("DOMContentLoaded", function() {
    loadTasksFromLocalStorage();
    displayTasks();
});

// Eevent listener to add tasks to the add task btn
addTaskBtn.addEventListener("click", addTask);

// Event listener for the Enter key on the input field
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Add a task
function addTask() {
    // Get the task input value
    let taskText = taskInput.value.trim();
    
    if (taskText === "") {
        // Add shake animation to input
        taskInput.classList.add("is-invalid");
        setTimeout(() => {
            taskInput.classList.remove("is-invalid");
        }, 500);
        return;
    }
    
    // Add task as an object with text, completed status, and unique ID
    const newTask = {
        id: Date.now(), // Use timestamp as unique ID
        text: taskText,
        completed: false,
        createdAt: new Date().toISOString()
    };
    
    tasks.push(newTask);
    
    // Clear the input field
    taskInput.value = "";
    
    // Focus back on input for quick sequential task adding
    taskInput.focus();
    
    // Save to local storage
    saveTasksToLocalStorage();
    
    // Render the tasks
    displayTasks();
    
    // Add a little animation to the last added task
    setTimeout(() => {
        const lastTask = taskList.lastChild;
        if (lastTask) {
            lastTask.classList.add("highlight");
            setTimeout(() => {
                lastTask.classList.remove("highlight");
            }, 1000);
        }
    }, 50);
}

// Display the tasks from tasks[] in the UL
function displayTasks() {
    // Clear the existing task list before updating it
    taskList.innerHTML = "";
    
    // Check if tasks array is empty
    if (tasks.length === 0) {
        emptyState.classList.remove("d-none");
    } else {
        emptyState.classList.add("d-none");
    }

    // Loop through the tasks array and add each task to the UL
    tasks.forEach((task) => {
        // Create a new LI element
        let li = document.createElement("li");

        // Add bootstrap classes for styling
        li.classList.add(
            "list-group-item",
            "d-flex",
            "justify-content-between",
            "align-items-center"
        );

        // Add completed class if task is completed
        if (task.completed) {
            li.classList.add("completed");
        }

        // Create the task text span
        let taskText = document.createElement("span");
        taskText.textContent = task.text;
        
        // Create button container div
        let btnContainer = document.createElement("div");
        
        // Create complete button
        let completeBtn = document.createElement("button");
        completeBtn.classList.add("btn", "btn-sm", "me-2", "task-complete-btn");
        completeBtn.innerHTML = task.completed ? '<i class="fas fa-check"></i>' : '<i class="fas fa-check"></i>';
        completeBtn.addEventListener("click", function() {
            toggleComplete(task.id);
        });
        
        // Create delete button
        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("btn", "btn-danger", "btn-sm");
        deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
        deleteBtn.addEventListener("click", function() {
            removeTask(task.id);
        });
        
        // Append buttons to container
        btnContainer.appendChild(completeBtn);
        btnContainer.appendChild(deleteBtn);
        
        // Append task text and button container to list item
        li.appendChild(taskText);
        li.appendChild(btnContainer);
        
        // Append the LI element to the UL
        taskList.appendChild(li);
    });

    // Update the task counter
    updateTaskCounter();
}

// Toggle task completion status
function toggleComplete(taskId) {
    tasks = tasks.map(task => {
        if (task.id === taskId) {
            return { ...task, completed: !task.completed };
        }
        return task;
    });
    
    // Save to local storage
    saveTasksToLocalStorage();
    
    // Render the tasks
    displayTasks();
}

// Remove a task
function removeTask(taskId) {
    // Remove the task from the tasks array
    tasks = tasks.filter(task => task.id !== taskId);

    // Save to local storage
    saveTasksToLocalStorage();
    
    // Render the tasks
    displayTasks();
}

// Update the task counter
function updateTaskCounter() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const remainingTasks = totalTasks - completedTasks;
    
    const counterText = `You have ${remainingTasks} task${remainingTasks !== 1 ? 's' : ''} remaining`;
    taskCounter.textContent = counterText;
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
    }
}

// An event listener to the clear task button
clearTaskBtn.addEventListener("click", function () {
    if (tasks.length === 0) return;
    
    if (confirm("Are you sure you want to clear all tasks?")) {
        // Clear the tasks array
        tasks = [];
        
        // Clear local storage
        localStorage.removeItem('tasks');

        // Render the tasks
        displayTasks();
    }
});
