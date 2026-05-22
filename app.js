// 1. Load data from local storage, or start with an empty array
let habits = JSON.parse(localStorage.getItem("simpleHabits")) || [];
let weekOffset = 0; // 0 is this week, -1 is last week, 1 is next week

// Helper: Formats a date into a clean string like "2026-05-22" for saving
function formatDate(date) {
    return date.toISOString().split("T")[0];
}

// 2. Figure out the 7 dates for the current week being viewed
function getWeekDates() {
    let today = new Date();
    // Adjust the date based on which week the user is looking at
    today.setDate(today.getDate() + (weekOffset * 7));

    let currentDayOfWeek = today.getDay(); // 0 is Sunday, 1 is Monday...
    let distanceToMonday = currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1;
    
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

// 3. Calculate the streak
function getStreak(habit) {
    let streak = 0;
    let checkDate = new Date();
    let todayStr = formatDate(checkDate);

    // If today is NOT checked, we start counting the streak from yesterday
    if (!habit.completedDates[todayStr]) {
        checkDate.setDate(checkDate.getDate() - 1); 
    }

    // Count backwards day by day
    while (true) {
        let dateStr = formatDate(checkDate);
        if (habit.completedDates[dateStr] === true) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1); // move back 1 day
        } else {
            break; // Stop counting when we find an empty day
        }
    }
    return streak;
}

// 4. Update the screen (The render function)
function updateUI() {
    let table = document.getElementById("habit-table");
    let emptyMessage = document.getElementById("empty-message");

    // Handle empty state
    if (habits.length === 0) {
        table.classList.add("hidden");
        emptyMessage.classList.remove("hidden");
        return;
    } else {
        table.classList.remove("hidden");
        emptyMessage.classList.add("hidden");
    }

    let weekDates = getWeekDates();
    let realTodayStr = formatDate(new Date()); // Get actual today's date

    // Draw Header Row
    let headerHTML = "<th>Habit Name</th><th>Streak</th>";
    const dayNames = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    
    for (let i = 0; i < 7; i++) {
        let dateStr = formatDate(weekDates[i]);
        let isToday = (dateStr === realTodayStr) ? "class='today'" : "";
        headerHTML += `<th ${isToday}>${dayNames[i]}<br>${weekDates[i].getDate()}</th>`;
    }
    document.getElementById("table-header-row").innerHTML = headerHTML;

    // Draw Habit Rows
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

        // Add 7 checkboxes for the 7 days
        for (let j = 0; j < 7; j++) {
            let dateStr = formatDate(weekDates[j]);
            let isChecked = habit.completedDates[dateStr] ? "checked" : "";
            let isToday = (dateStr === realTodayStr) ? "class='today'" : "";
            
            // Disable checkboxes if we are looking at future weeks
            let disabled = (weekOffset > 0) ? "disabled" : "";

            rowHTML += `<td ${isToday}>
                <input type="checkbox" onchange="toggleHabit(${i}, '${dateStr}')" ${isChecked} ${disabled}>
            </td>`;
        }
        
        rowHTML += "</tr>";
        tbodyHTML += rowHTML;
    }
    document.getElementById("table-body").innerHTML = tbodyHTML;
}

// 5. Button Actions
window.addHabit = function() {
    let input = document.getElementById("habit-input");
    if (input.value.trim() !== "") {
        habits.push({
            name: input.value,
            completedDates: {} // an object to hold dates like {"2026-05-22": true}
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
    // Flip true to false, or false to true
    habits[index].completedDates[dateStr] = !habits[index].completedDates[dateStr];
    saveData();
};

window.changeWeek = function(direction) {
    if (direction === 0) {
        weekOffset = 0; // Back to this week
    } else {
        weekOffset += direction; // +1 or -1
    }
    updateUI();
};

function saveData() {
    localStorage.setItem("simpleHabits", JSON.stringify(habits));
    updateUI();
}

// Start the app when the page loads
updateUI();