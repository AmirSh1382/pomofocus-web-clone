// variables //////////////////////
const body = $.body
const timeLine = $.querySelector(".time-line")
const allTimerTypeBtns = $.querySelectorAll(".timer-type-btn")
const timer = $.querySelector(".timer")
const PomodoroBtn = $.querySelector(".Pomodoro")
const shortBreakBtn = $.querySelector(".Short-braek")
const longBreakBtn = $.querySelector(".Long-break")
const timerStartBtn = $.querySelector(".timer-start-btn")
const timerStopBtn = $.querySelector(".timer-stop-btn")

const startAudio = $.querySelector(".start-audio")
const stopAudio = $.querySelector(".stop-audio")

let pomodoro = null
let shortBreak = null
let longBreak = null

let timerStopConfirmation = false
let isTimerStarted = false
let selectedTimerTime = 0
let timerStopedTime = 0
let timeInterval = null


// fucntions //////////////////////
// to update the timer times based on the setting (this func is called in Setting Script as on load)
function timesUpdater(){
    pomodoro = setting.pomodoro * 60
    shortBreak = setting.shortBreak * 60
    longBreak = setting.longBreak * 60
}

// to set pomodoro as the defualt timer on load
function setPomodoroAsDefualtTimer(){
    selectedTimerTime = pomodoro
    setTimerTimeFormat(pomodoro)
}

// to active pomodoro timer by pressing (pomodoro) btn
function pomodoroTimerActive(){
    timerReset(PomodoroBtn , pomodoro)

    document.documentElement.style.setProperty("--primary-color" , "rgb(217, 85, 80)")
}

// to active short break timer by pressing (short break) btn
function shortBreakTimerActive(){
    timerReset(shortBreakBtn , shortBreak)

    document.documentElement.style.setProperty("--primary-color" , "rgb(76, 145, 149)")
}

// to active long break timer by pressing (long break) btn
function longBreakTimerActive(){   
    timerReset(longBreakBtn , longBreak)

    document.documentElement.style.setProperty("--primary-color" , "rgb(69, 124, 163)")
}

// to reset the timer based on timer type and timer time
function timerReset(timerTypeBtn , timerTime){
    timerStopedTime = 0
    selectedTimerTime = timerTime

    stopTimer()
    timeLineUpdater(timerTime)
    setTimerTimeFormat(timerTime)

    removeActiveClass()
    timerTypeBtn.classList.add("active")
}

// to update timer time line based on timer progress
function timeLineUpdater(timerSec){
    let timerProgressPercent = (100 - ((timerSec / selectedTimerTime) * 100)) + "%"
    
    timeLine.style.width = timerProgressPercent
}

// to make a timer format and append it to dom
function setTimerTimeFormat(timerSecond){
    let timerMin = Math.floor(timerSecond / 60)
    let timerSec = timerSecond % 60

    if(timerMin < 10){
        timerMin = "0" + timerMin
    }

    if(timerSec < 10){
        timerSec = "0" + timerSec
    }

    let finallTimeFormat = timerMin + ":" + timerSec

    timer.innerHTML = finallTimeFormat
    window.top.document.title = finallTimeFormat + "-Time to focus!"
}

// to remove an active class from all timer type btns
function removeActiveClass(){
    allTimerTypeBtns.forEach(function(btn){
        btn.classList.remove("active")
    })
}

// to start the timer countdown by clicking on start btn
function startTimer(timerSec){
    // to avoid reseting the timer time if there have been pauses during timer running
    if(timerStopedTime){
        timerSec = timerStopedTime
    }

    if(isDarkModeOn){
        $.documentElement.style.setProperty("--dark-theme-opacity" , "0")
        $.documentElement.style.setProperty("--dark-theme-visibility" , "hidden")
        $.documentElement.style.setProperty("--muted-text-color" , "#000")
        body.style.backgroundColor = "#000"
    }

    startAudio.play()

    timeInterval = setInterval(function(){
        timerSec--

        if(timerSec <= 0){
            alarmSound.play()
            stopTimer()
        }
        
        timerStopedTime = timerSec
        timeLineUpdater(timerSec)
        setTimerTimeFormat(timerSec)
    },1000)

    timerStopBtn.style.display = "inline"
    timerStartBtn.style.display = "none"

    isTimerStarted = true
}

// to stop timer from counting down by clearing the intrval
function stopTimer(){
    stopAudio.play()
    
    if(isDarkModeOn){
        $.documentElement.style.setProperty("--dark-theme-opacity" , "1")
        $.documentElement.style.setProperty("--dark-theme-visibility" , "visible")
        $.documentElement.style.setProperty("--muted-text-color" , "rgba(255, 255, 255, 0.7)")
        body.style.backgroundColor = "var(--primary-color)"
    }

    clearInterval(timeInterval)

    timerStopBtn.style.display = "none"
    timerStartBtn.style.display = "inline"

    isTimerStarted = false
}

// a confirm alert to make sure user wants to stop the timer and reset it completely
function timerStoppingconfirmation(){
    timerStopConfirmation = confirm("The timer is still running, are you sure you want to stop it?")
}

// event listeners ////////////////////
// to set pomodoro timer as the defualt timer on load
window.addEventListener("load" , setPomodoroAsDefualtTimer)
// an event listener for pomodoro btn
PomodoroBtn.addEventListener("click" , function(){
    if(isTimerStarted){
        // to show a confirmation alert if the timer was running
        timerStoppingconfirmation()

        if(timerStopConfirmation){
            pomodoroTimerActive()
        }
    }else{
        pomodoroTimerActive()
    }
})

// an event listener for short break btn
shortBreakBtn.addEventListener("click" , function(){
    if(isTimerStarted){
        // to show a confirmation alert if the timer was running
        timerStoppingconfirmation()

        if(timerStopConfirmation){
            shortBreakTimerActive()
        }
    }else{
        shortBreakTimerActive()
    }
})

// an event listener for long break btn
longBreakBtn.addEventListener("click" , function(){
    if(isTimerStarted){
        // to show a confirmation alert if the timer was running
        timerStoppingconfirmation()

        if(timerStopConfirmation){
            longBreakTimerActive()
        }
    }else{
        longBreakTimerActive()
    }
})

// // an event listener for timer start btn
timerStartBtn.addEventListener("click" , function(){
    startTimer(selectedTimerTime)
})

// an event listener for timer stop btn
timerStopBtn.addEventListener("click" , function(){
    stopTimer()
})