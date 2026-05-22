let habitsString = localStorage.getItem("simpleHabits");
let habits = [];
if (habitsString !== null) {
    habits = JSON.parse(habitsString);
}

let weekOffset = 0; 

function formatDate(date) {
    return date.toISOString().split("T")[0];
}

function getWeekDates() {
    let today = new Date();
    today.setDate(today.getDate() + (weekOffset * 7));

    let currentDayOfWeek = today.getDay();

    let distanceToMonday = 0;
    if (currentDayOfWeek === 0) {
        distanceToMonday = 6;
    } else {
        distanceToMonday = currentDayOfWeek - 1;
    }
    
    let monday = new Date(today);
    monday.setDate(today.getDate() - distanceToMonday);

    let weekDates = [];
    for (let i = 0; i < 7; i++) {
        let nextDay = new Date(monday);
        nextDay.setDate(monday.getDate() + i);
        weekDates.push(nextDay);
    }
    return weekDates;
}

function getStreak(habit) {
    let streak = 0;
    let checkDate = new Date();
    let todayStr = formatDate(checkDate);

    if (habit.completedDates[todayStr] !== true) {
        checkDate.setDate(checkDate.getDate() - 1); 
    }

    while (true) {
        let dateStr = formatDate(checkDate);
        if (habit.completedDates[dateStr] === true) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1); 
        } else {
            break; 
        }
    }
    return streak;
}

function updateUI() {
    let table = document.getElementById("habit-table");
    let emptyMessage = document.getElementById("empty-message");

    if (habits.length === 0) {
        table.classList.add("hidden");
        emptyMessage.classList.remove("hidden");
        return;
    } else {
        table.classList.remove("hidden");
        emptyMessage.classList.add("hidden");
    }

    let weekDates = getWeekDates();
    let realTodayStr = formatDate(new Date()); 
  
    let headerHTML = "<th>Habit Name</th><th>Streak</th>";
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    for (let i = 0; i < 7; i++) {
        let dateStr = formatDate(weekDates[i]);
        
        let isToday = "";
        if (dateStr === realTodayStr) {
            isToday = "class='today'";
        }

        headerHTML += `<th ${isToday}>${dayNames[i]}<br>${weekDates[i].getDate()}</th>`;
    }
    document.getElementById("table-header-row").innerHTML = headerHTML;

    let tbodyHTML = "";
    for (let i = 0; i < habits.length; i++) {
        let habit = habits[i];
        let streak = getStreak(habit);

        let rowHTML = `<tr>
            <td>
                ${habit.name} 
                <button style="float:right; padding: 2px 5px;" onclick="deleteHabit(${i})">X</button>
            </td>
            <td style="color: blue; font-weight: bold;">${streak}</td>`;

        for (let j = 0; j < 7; j++) {
            let dateStr = formatDate(weekDates[j]);
            
            let isChecked = "";
            if (habit.completedDates[dateStr] === true) {
                isChecked = "checked";
            }
            
            let isToday = "";
            if (dateStr === realTodayStr) {
                isToday = "class='today'";
            }
            
            let disabled = "";
            if (weekOffset > 0) {
                disabled = "disabled";
            }

            rowHTML += `<td ${isToday}>
                <input type="checkbox" onchange="toggleHabit(${i}, '${dateStr}')" ${isChecked} ${disabled}>
            </td>`;
        }
        
        rowHTML += "</tr>";
        tbodyHTML += rowHTML;
    }
    document.getElementById("table-body").innerHTML = tbodyHTML;
}

window.addHabit = function() {
    let input = document.getElementById("habit-input");
    if (input.value.trim() !== "") {
        habits.push({
            name: input.value,
            completedDates: {} 
        });
        input.value = "";
        saveData();
    }
};

window.deleteHabit = function(index) {
    habits.splice(index, 1);
    saveData();
};

window.toggleHabit = function(index, dateStr) {
    if (habits[index].completedDates[dateStr] === true) {
        habits[index].completedDates[dateStr] = false;
    } else {
        habits[index].completedDates[dateStr] = true;
    }
    saveData();
};

window.changeWeek = function(direction) {
    if (direction === 0) {
        weekOffset = 0; 
    } else {
        weekOffset = weekOffset + direction; 
    }
    updateUI();
};

function saveData() {
    localStorage.setItem("simpleHabits", JSON.stringify(habits));
    updateUI();
}

updateUI();