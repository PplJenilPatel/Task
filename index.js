var inputBox, todoListTable, doneListTable, addButton;

onStart();

function onStart() {
    inputBox = document.getElementById("todoInput");
    todoListTable = document.getElementById("todoListTable");
    doneListTable = document.getElementById("doneListTable");
    addButton = document.getElementById("addButton");
    inputBox.addEventListener("keypress", (e) => {
        if(e.key == "Enter") {
           addTask() ;
        }
    })
    addButton.addEventListener("click", ()=> {
        addTask();
    })
    const taskObject = JSON.parse(localStorage.getItem("taskList"));
    if(taskObject != null) {
        refreshTables();
    }
}

function addToLocalStorage(taskMessage, done) {
    var taskList = null;
    // const temp = localStorage.getItem('taskList');
    // console.log(JSON.stringify(temp));
    // return;
    taskList = getListFromLocalStorage();
    // taskList = JSON.parse(localStorage.getItem("taskList"));
    if(taskList == null) {
        createTaskList();
        // taskList = JSON.parse(localStorage.getItem("taskList"));
        taskList = getListFromLocalStorage();
    }
    const id = taskList["count"];
    // console.log(taskList);
    taskList["list"].push({
        "taskMessage": taskMessage,
        "done": done,
        "id": id
    });
    taskList["count"]++;
    // localStorage.removeItem("taskList");
    // // console.log(`after operation ${JSON.stringify(taskList)}`);
    // localStorage.setItem("taskList", JSON.stringify(taskList));
    setListToLocalStorage(taskList);
    addItemToToDoTable(taskMessage, id);
}

function addTask() {
    const taskInput = inputBox.value;
    addToLocalStorage(taskInput, false);
    inputBox.value = "";
    inputBox.focus();
}

function createTaskList() {
    const listCreateObject = JSON.stringify({"list":[], "count": 0});
    console.log(listCreateObject);
    localStorage.setItem("taskList", listCreateObject);
}

function showData() {
    const data = getListFromLocalStorage();
    console.log(data);
}

function addItemToToDoTable(taskMessage, id) {
    var newRow = todoListTable.insertRow();
    newRow.setAttribute("id", id);
    var message = newRow.insertCell(0), doneBox = newRow.insertCell(1);
    message.innerHTML = taskMessage;
    doneBox.innerHTML = `<button id=${id}>Done</button>`;
    doneBox.addEventListener("click", ()=> {
        moveToDone(id);
    })
}

function moveToDone(id) {
    var taskList = JSON.parse(localStorage.getItem("taskList"));
    taskList["list"][id]["done"] = true;
    // localStorage.removeItem("taskList");
    // localStorage.setItem("taskList", JSON.stringify(taskList));
    setListToLocalStorage(taskList);
    addItemToDoneTable(taskList["list"][id]["taskMessage"],id);
    removeFromToDo(id);
}

function addItemToDoneTable(taskMessage, id) {
    var newRow = doneListTable.insertRow();
    var taskMessageCell = newRow.insertCell(0);
    taskMessageCell.innerHTML = `<del>${taskMessage}</del>`;
}

function removeFromToDo(id) {
    console.log(id);
    for(var iter = 0; iter < todoListTable.rows.length; ++iter) {
        if(todoListTable.rows[iter].getAttribute("id") == id) {
            todoListTable.deleteRow(iter);
            return;
        }
    }
}

function refreshTables() {
    // const taskArrayObject = JSON.parse(localStorage.getItem("taskList"));
    const taskArrayObject = getListFromLocalStorage();
    const taskArray = taskArrayObject["list"];
    for(var counter = 0; counter < taskArray.length; ++counter) {
        if(taskArray[counter]["done"] == false) {
            addItemToToDoTable(taskArray[counter]["taskMessage"], taskArray[counter]["id"]);
        } else {
            addItemToDoneTable(taskArray[counter]["taskMessage"], taskArray[counter]["id"]);
        }
    }
}

function getListFromLocalStorage(itemName = 'taskList') {
    var taskList = JSON.parse(localStorage.getItem(itemName));
    return taskList;
}

function setListToLocalStorage(taskList, itemName = 'taskList') {
    localStorage.setItem(itemName, JSON.stringify(taskList));
}
