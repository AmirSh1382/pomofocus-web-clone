let $ = document 

///////////////////////////////////

// variables /////////////////////
const settingBtn = $.querySelector(".setting-btn")
const settingCloseBtn = $.querySelector(".btn-close")
const settingOkBtn = $.querySelector(".setting-ok-btn")
const settingSection = $.querySelector(".setting-section")
const pomodoroTimeInput = $.querySelector(".pomodoro-time-input")
const shortBreakTimeInput = $.querySelector(".short-break-time-input")
const longBreakTimeInput = $.querySelector(".long-break-time-input")
const alarmSoundsSelectMenu = $.querySelector(".alarm-sounds-select-menu")
const darkModeSwitch = $.querySelector(".switch")

const loaderSection = $.querySelector("#loader")

const alarmSound = $.querySelector(".alarm-audio")

let setting = {
    pomodoro:25,
    shortBreak:5,
    longBreak:15,
    defualtAlarmSrc:"./Source/Media/audio/alarn-sounds/alarm-Crystal.mp3",
    isDarkModeOn:false
}

let isSettingOpen = false
let isDarkModeOn = false

// fucntions ///////////////
// to remove the loader on load
function removeLoader(){
    setTimeout(function(){
        loaderSection.style.display = "none"
    },1500)
}

// to get setting info from local storage and set the settings
function getSettingFromLocalStorage(){
    let mainSetting = JSON.parse(localStorage.getItem("setting"))

    if(mainSetting){
        setting = mainSetting

        pomodoroTimeInput.value = setting.pomodoro
        shortBreakTimeInput.value = setting.shortBreak
        longBreakTimeInput.value = setting.longBreak

        alarmSound.src = setting.defualtAlarmSrc
        alarmSoundsSelectMenu.value = setting.defualtAlarmSrc

        if(setting.isDarkModeOn){
            turnDarkModeeOnOrOff()
        }
        
    }else{
        setSettingInToLocalStorage()
    }

    timesUpdater()
}

// to set the settings in to local storage
function setSettingInToLocalStorage(){
    localStorage.setItem("setting" , JSON.stringify(setting))
}

// to open the setting menu
function openSetting(){
    isSettingOpen = true

    settingSection.style.display = "block"

    setTimeout(function(){
        settingSection.classList.add("fade-in")
    },1)
}

// to close the setting menu
function closeSetting(){
    isSettingOpen = false

    settingSection.classList.remove("fade-in")

    setTimeout(function(){
        settingSection.style.display = "none"
    },700)
}

// to validate the inputs time (it must be between 1 to 60)
function timeValidation(time , inputName){
    if(time > 60 || time <= 0 || isNaN(time)){
        inputName.value = 1
        time = 1
    }

    return time
}

// to change the alarm sound
function changeAlarmSound(event){
    let newAlarmSrc = event.target.value

    alarmSound.src = newAlarmSrc
    alarmSound.play()
}

// to turn dark mode on or off based on the current dark mode setting
function turnDarkModeeOnOrOff(){
    darkModeSwitch.classList.toggle("on")

    isDarkModeOn = !isDarkModeOn
}

// to save and apply the setting
function saveSetting(){
    isSettingOpen = false

    let newPomodoroTime = timeValidation(pomodoroTimeInput.value , pomodoroTimeInput)
    setting.pomodoro = newPomodoroTime

    let newShortBreakTime = timeValidation(shortBreakTimeInput.value , shortBreakTimeInput)
    setting.shortBreak = newShortBreakTime

    let newLongBreakTime = timeValidation(longBreakTimeInput.value , longBreakTimeInput)
    setting.longBreak = newLongBreakTime

    let newAlarmSrc = alarmSoundsSelectMenu.value
    setting.defualtAlarmSrc = newAlarmSrc

    if(isDarkModeOn){
        setting.isDarkModeOn = true
    }else{
        setting.isDarkModeOn = false
    }

    setSettingInToLocalStorage(setting)

    location.reload()
}

// event listeners ///////////////////////////
window.addEventListener("load" , getSettingFromLocalStorage)
settingBtn.addEventListener("click" , openSetting)
settingCloseBtn.addEventListener("click" , closeSetting)
settingOkBtn.addEventListener("click" , saveSetting)
alarmSoundsSelectMenu.addEventListener("change" , changeAlarmSound)
darkModeSwitch.addEventListener("click" , turnDarkModeeOnOrOff)

// to prevent opening the task form if the setting menu was opened
window.addEventListener("keydown" , function(event){
    if(isSettingOpen && event.key === "Enter"){
        event.preventDefault()
    }
})

window.addEventListener("load" , removeLoader)