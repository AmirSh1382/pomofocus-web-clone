// variables ////////////////
// task options 
const tasksOptionsBtn = $.querySelector(".tasks-options-btn")
const tasksOptions = $.querySelector(".tasks-options")
const clearFinishedTaskBtn = $.querySelector(".clear-finished-tasks-btn")
const checkAllTasksBtn = $.querySelector(".check-all-tasks")
const clearAllTasksBtn = $.querySelector(".clear-all-tasks")

// tasks
const tasksCount = $.querySelector(".tasks-count")
const focusedTaskDisplayer= $.querySelector(".focused-task-name")
const tasksContainer = $.querySelector(".tasks-container")

// add task
const addTaskBtn = $.querySelector(".add-task-btn")
const taskForm = $.querySelector(".task-form")
const formTitleInput = $.querySelector(".task-title-input")
const formTimeInput = $.querySelector(".form-time-input")
const taskNoteContainer = $.querySelector(".note-container")
const taskNoteAdderBtn = $.querySelector(".add-note-btn")
const formNoteInput = $.querySelector(".form-note-input")
const formDeleteBtn = $.querySelector(".form-delete-btn")
const formCancelBtn = $.querySelector(".form-cancel-btn")
const formSubmitBtn = $.querySelector(".form-submit-btn")

const footerTasksCount = $.querySelector(".all-tasks-count")
const footerFinishedTasksCount = $.querySelector(".finished-tasks-count")
const footerCurrentTime = $.querySelector(".current-time")

let isTaskOptionsOpen = false
let isTaskFormOpen = false
let isEditTaskFormOpen = false
let editedTaskId = null

let isAnyTaskFocused = false

let allTasks = []
let tasksCounter = 0

// functions ////////////////
// to get all tasks from local storage on load
function getTasksFromLocalStorage(){
    let tasks = JSON.parse(localStorage.getItem("tasks"))

    if(tasks){
        allTasks = tasks

        tasksGenerator(allTasks)
    }
}

// to set all tasks in to local storage
function setTaskArrayIntoLocalStorage(tasksArray){
    localStorage.setItem("tasks" , JSON.stringify(tasksArray))
}

// to get tasks counter from local storage on load
function getTasksCounterFromLocalStorage(){
    tasksCounter = localStorage.getItem("tasksCounter")
}

// to set tasks counter in to the local storage
function setTasksCounterIntoLocalStorage(counter){
    localStorage.setItem("tasksCounter" , counter)
}

// to show the task options menu when the menu is close
function showTasksOptions(){
    isTaskOptionsOpen = true    
    tasksOptions.classList.add("display-on")
}

// to close the task options menu when the menu is open
function hideTaskOptions(){
    isTaskOptionsOpen = false
    tasksOptions.classList.remove("display-on")
}

// to clear all finished tasks by clicking on (clear all finished task) btn
function clearFinishedTask(){
    allTasks = allTasks.filter(function(task){
        return task.status !== "done"
    })

    tasksGenerator(allTasks)
    setTaskArrayIntoLocalStorage(allTasks)
}

// to check all tasks by clicking on (check all tasks) btn
function checkAllTasks(){
    allTasks.map(function(task){
        task.status = "done"
    })

    tasksGenerator(allTasks)
    setTaskArrayIntoLocalStorage(allTasks)
}

// to clear all tasks by clicking on (clear all tasks) btn (with confirmation)
function clearAllTasks(){
    let confirmation = confirm("Are you sure you want to delete all tasks?")

    if(confirmation){
        allTasks = []
        tasksCounter = 0
    
        tasksGenerator(allTasks)
        setTaskArrayIntoLocalStorage(allTasks)
        setTasksCounterIntoLocalStorage(tasksCounter)
    }
}

// to show the task form to add a new task
function openForm(){
    isTaskFormOpen = true

    if(!formTitleInput.value){
        formSubmitBtn.setAttribute("disabled" , "")
    }

    addTaskBtn.classList.add("hide")
    
    taskForm.style.display = "block"
    setTimeout(function(){
        taskForm.classList.add("show")

        formTitleInput.focus()
    },1)
}

// to hide the task form
function closeForm(){
    isTaskFormOpen = false
    isEditTaskFormOpen = false

    addTaskBtn.classList.remove("hide")

    taskForm.classList.remove("show")
    taskForm.classList.remove("edit-task-form")
    taskForm.style.display = "none"

    closeNoteInput()
    formInputsReset()
}

// to validate the form title input (it should not be empty)
function formTitleInputValidation(){
    if(formTitleInput.value.trim().length >= 1){
        formSubmitBtn.removeAttribute("disabled")
    }else{
        formSubmitBtn.setAttribute("disabled" , "")
    }
}  

// to validate all form inputs before generating the new task
function formInputsValidation(event){
    event.preventDefault()

    let taskTitle = formTitleInput.value.trim().replace(/ {1,}/g," ")
    let taskTime = Math.floor(formTimeInput.value)
    let taskNote = formNoteInput.value.trim().replace(/ {1,}/g," ")

    if(taskTime < 0 || taskTime >60 || isNaN(taskTime)){
        taskTime = 0
    }

    if(!taskNote.trim().length || !taskNote){
        taskNote = ""
    }

    let newTask = {
        id: tasksCounter,
        title : taskTitle,
        time: taskTime,
        note: taskNote,
        status: "not done",
        focused: false
    }

    allTasks.push(newTask)

    closeNoteInput()
    formInputsReset()
    formTitleInput.focus()

    tasksGenerator(allTasks)
    
    if(isEditTaskFormOpen){
        isEditTaskFormOpen = false
        
        closeForm()
        deletePreviousTask()
    }
    
    tasksCounter++
    setTaskArrayIntoLocalStorage(allTasks)
    setTasksCounterIntoLocalStorage(tasksCounter)
}

// to delete the previous task if the user edit that task
function deletePreviousTask(){
    allTasks = allTasks.filter(function(task){
        return task.id !== editedTaskId
    })
    
    tasksGenerator(allTasks)
    setTaskArrayIntoLocalStorage(allTasks)
}

// to create a template for each task and append it to dom
function tasksGenerator(tasksArray){
    let tasksFragment = $.createDocumentFragment()
    tasksCount.innerHTML = "#" + tasksArray.length
    footerTasksCount.innerHTML = tasksArray.length
    tasksContainer.innerHTML = ""

    isAnyTaskFocused = false

    tasksArray.forEach(function(task){
        let taskContainer = $.createElement("div")
        taskContainer.className = "task-container mb-2"
        taskContainer.setAttribute("onclick" , "clickValidation(event,"+ task.id +")")

        if(task.focused){
            isAnyTaskFocused = true
            taskContainer.classList.add("task-focused")
            
            focusedTaskDisplay(task.title)
        }

        if(task.status === "done"){
            taskContainer.classList.add("task-finished")
        }

        let taskInfo = $.createElement("div")
        taskInfo.className = "task-info d-flex align-items-center"

        let taskFinishedBtn = $.createElement("i")
        taskFinishedBtn.className = "task-finished-btn bi bi-check-circle-fill ms-1 me-2"

        let taskMsg = $.createElement("span")
        taskMsg.className = "task-msg"
        taskMsg.innerHTML = task.title

        taskInfo.append(taskFinishedBtn,taskMsg)

        if(task.time){
            let taskTime = $.createElement("span")
            taskTime.innerHTML = task.time + " min"
            taskTime.className = "task-time ms-auto me-4"

            taskInfo.append(taskTime)
        }

        let taskEditBtn = $.createElement("i")
        taskEditBtn.className = "task-edit-btn bi bi-pencil-square ms-3"

        taskInfo.append(taskEditBtn)
        taskContainer.append(taskInfo)

        if(task.note){
            let taskNote = $.createElement("div")
            taskNote.innerHTML = task.note
            taskNote.className = "task-note shadow mt-2 ms-3 px-2"

            taskContainer.append(taskNote)
        }
        
        tasksFragment.append(taskContainer)
    })

    tasksContainer.append(tasksFragment)

    // to automatically set (time to focus) title if no tasks were focused
    if(!isAnyTaskFocused){
        focusedTaskDisplay("time to focus!")
    }

    upadateFinishedTasksCount()
}

// to display the focued task name on (task header section)
function focusedTaskDisplay(taskTitle){
    focusedTaskDisplayer.innerHTML = taskTitle
}

function clickValidation(event,taskId){
    // to prevent the action if user clicked on finish btn or edit btn
    if(!event.target.className.includes("task-finished-btn") && !event.target.className.includes("task-edit-btn")){
        setTaskAsFocused(taskId)
    }
    // to change the task status if the target was exactly on the status btn
    else if(event.target.className.includes("task-finished-btn")){
        changeTaskStatus(taskId)
    }
    // to open the edit task if the target was exactly on the edit btn
    else if(event.target.className.includes("task-edit-btn")){
        editTask(taskId)
    }
}

// to focus on the task based on its id
function setTaskAsFocused(taskId){
    isAnyTaskFocused = true

    allTasks.forEach(function(task){
        task.focused = false
        if(task.id == taskId){
            focusedTaskDisplayer.innerHTML = task.title

            task.focused = true
        }
    })

    tasksGenerator(allTasks)
    setTaskArrayIntoLocalStorage(allTasks)
}

// to change the task status based on the previous status
function changeTaskStatus(taskId){
    allTasks.forEach(function(task){
        if(task.id == taskId){
            if(task.status === "done"){
                task.status = "not done"
            }else{
                task.status = "done"
            }
            
            return
        }
    })

    tasksGenerator(allTasks)
    upadateFinishedTasksCount()
    setTaskArrayIntoLocalStorage(allTasks)
}

// to edit the task based on its id
function editTask(taskId){
    isEditTaskFormOpen = true

    taskForm.classList.add("edit-task-form")

    let mainTask = allTasks.find(function(task){
        if(task.id == taskId){
            return task
        }
    })

    formTitleInput.value = mainTask.title
    formTimeInput.value = mainTask.time

    if(mainTask.note){
        openNoteInput()

        formNoteInput.value = mainTask.note
    }

    editedTaskId = taskId

    openForm()
    formTitleInputValidation()
}

// to update the number if finished tasks
function upadateFinishedTasksCount(){
    let finishedTasks = allTasks.filter(function(task){
        return task.status === "done"
    })

    footerFinishedTasksCount.innerHTML = finishedTasks.length
}

// to open the form note input to add a note to the task
function openNoteInput(){
    taskNoteAdderBtn.style.display = "none"
    taskNoteContainer.style.display = "block"

    formNoteInput.focus()
}

// to close the form note input
function closeNoteInput(){
    taskNoteContainer.style.display = "none"
    taskNoteAdderBtn.style.display = "inline-block"
}

// to reset all form inputs
function formInputsReset(){
    formTitleInput.value = ""
    formNoteInput.value = ""
    formTimeInput.value = ""

    formSubmitBtn.setAttribute("disabled" , "")
}

// to cancel the adding task process (with confirmation)
function formCancelation(event){
    event.preventDefault()

    isEditTaskFormOpen = false

    if(formTitleInput.value.trim()){
        let confirmation = confirm("The input data will be lost. Are you sure you want to close it?")
        if(confirmation){
            closeForm()
        }
    }else{
        closeForm()
    }
}

function deleteTask(event){
    event.preventDefault()
    isEditTaskFormOpen = false

    allTasks = allTasks.filter(function(task){
        return task.id != editedTaskId
    })
    
    closeForm()
    tasksGenerator(allTasks)
    setTaskArrayIntoLocalStorage(allTasks)
}

function currentTimeCalc(){
    let mytime = new Date()

    let currentHour = mytime.getHours()
    let currentMinute = mytime.getMinutes()

    if(currentHour < 10){
        currentHour = "0" + currentHour 
    }

    if(currentMinute < 10){
        currentMinute = "0" + currentMinute
    }

    footerCurrentTime.innerHTML = currentHour + ":" + currentMinute
}

// event listeners ////////////
// to get all tasks from local storage on load
window.addEventListener("load" , getTasksFromLocalStorage)

//to get tasks counter from local storage on load
window.addEventListener("load" , getTasksCounterFromLocalStorage)

// to hide the task options menu when clicking outside the menu (task options btns is included either)
window.addEventListener("click" , function(event){
    if(isTaskOptionsOpen && event.target !== tasksOptions && event.target !== tasksOptionsBtn){
        hideTaskOptions()
    }
})

// to close or show the task options menu based on either its open or not, when clicking on the btn 
tasksOptionsBtn.addEventListener("click" , function(){
    if(isTaskOptionsOpen){
        hideTaskOptions()
    }else{
        showTasksOptions()
    }
})

// to close the task form when clicking outside the form
window.addEventListener("mouseup" , function(event){
    if(isTaskFormOpen && event.target !== taskForm && !taskForm.contains(event.target)){
        formCancelation(event)
    }
})

// to open the task form by pressing Enter key
window.addEventListener("keydown" , function(event){
    if(event.key === "Enter"){
        addTaskBtn.focus()
    }
})

// to clear all finished tasks by clicking on (clear all finished task) btn
clearFinishedTaskBtn.addEventListener("click" , clearFinishedTask)

// to check all tasks by clicking on (check all tasks) btn
checkAllTasksBtn.addEventListener("click" , checkAllTasks)

// to clear all tasks by clicking on (clear all tasks) btn (with confirmation)
clearAllTasksBtn.addEventListener("click" , clearAllTasks)

// to focus on the time input by pressing Enter key
formTitleInput.addEventListener("keydown" , function(event){
    if(event.key === "Enter"){
        event.preventDefault()
        formTimeInput.focus()
    }
})

// to focus on the form submit btn by pressing Enter key
formTimeInput.addEventListener("keydown" , function(event){
    if(event.key === "Enter"){
        event.preventDefault()
        formSubmitBtn.focus()
    }
})

// to open task form by clicking on the (+ add task) btn
addTaskBtn.addEventListener("click" , openForm) 

// to validate the form title input on each change
formTitleInput.addEventListener("input" , formTitleInputValidation)

// to add a note input in to the form by clicking on (+ add note) btn
taskNoteAdderBtn.addEventListener("click" , openNoteInput)

// to delete the task by clicking on (delete) btn
formDeleteBtn.addEventListener("click" , deleteTask)

// to cancel and close the form by clicking on (cancel) btn
formCancelBtn.addEventListener("click" , formCancelation)

// to submit the form and generate the task
formSubmitBtn.addEventListener("click" , formInputsValidation)

// to show the current time on the task footer
setInterval(function(){
    currentTimeCalc()
},1000)