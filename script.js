// script.js

document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let taskInput = document.getElementById("task");
    let taskValue = taskInput.value.trim();
    if (taskValue === "") return;

    let ul = document.getElementById("taskList");
    let li = document.createElement("li");
    li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
    li.innerHTML = `<input type='checkbox' onchange='toggleTaskCompletion(this)'> <span>${taskValue}</span> <button class='btn btn-danger btn-sm' onclick="removeTask(this)">X</button>`;
    ul.appendChild(li);

    saveTasks(); // Save tasks to localStorage
    taskInput.value = ""; 
}

function toggleTaskCompletion(checkbox) {
    let li = checkbox.parentElement;
    li.classList.toggle("completed", checkbox.checked);
    saveTasks(); // Update localStorage when task is completed/uncompleted
}

function removeTask(button) {
    if (confirm("Are you sure you want to delete this task?")) {
        let li = button.parentElement;
        let deletedTasks = document.getElementById("deletedTasks");
        li.classList.add("deleted-task");
        let taskText = li.querySelector("span").textContent;
        li.innerHTML = `<span>${taskText}</span> <button class='btn btn-warning btn-sm' onclick="permanentlyDeleteTask(this)">Delete Permanently</button>`;
        deletedTasks.appendChild(li);
        saveTasks(); // Update localStorage after removal
    }
}

function permanentlyDeleteTask(button) {
    if (confirm("Are you sure you want to permanently delete this task?")) {
        let li = button.parentElement;
        li.remove();
        saveTasks(); // Update localStorage after permanent deletion
    }
}

function saveTasks() {
    let tasks = [];
    document.querySelectorAll("#taskList li").forEach(li => {
        let taskText = li.querySelector("span").textContent;
        let isCompleted = li.classList.contains("completed");
        tasks.push({ text: taskText, completed: isCompleted });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    let deletedTasks = [];
    document.querySelectorAll("#deletedTasks li").forEach(li => {
        deletedTasks.push(li.querySelector("span").textContent);
    });
    localStorage.setItem("deletedTasks", JSON.stringify(deletedTasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    let deletedTasks = JSON.parse(localStorage.getItem("deletedTasks")) || [];
    let ul = document.getElementById("taskList");
    let deletedUl = document.getElementById("deletedTasks");

    tasks.forEach(task => {
        let li = document.createElement("li");
        li.classList.add("list-group-item", "d-flex", "justify-content-between", "align-items-center");
        if (task.completed) li.classList.add("completed");
        li.innerHTML = `<input type='checkbox' ${task.completed ? "checked" : ""} onchange='toggleTaskCompletion(this)'> <span>${task.text}</span> <button class='btn btn-danger btn-sm' onclick="removeTask(this)">X</button>`;
        ul.appendChild(li);
    });

    deletedTasks.forEach(task => {
        let li = document.createElement("li");
        li.classList.add("list-group-item", "deleted-task", "d-flex", "justify-content-between", "align-items-center");
        li.innerHTML = `<span>${task}</span> <button class='btn btn-warning btn-sm' onclick="permanentlyDeleteTask(this)">Delete Permanently</button>`;
        deletedUl.appendChild(li);
    });
}
