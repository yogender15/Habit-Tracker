document.addEventListener('DOMContentLoaded', () => {
    const habitForm = document.getElementById('habit-form');
    const habitInput = document.getElementById('habit-input');
    const habitList = document.getElementById('habit-list');
    const calendarGrid = document.getElementById('calendar-grid');
    const streakCount = document.getElementById('streak-count');
    const resetButton = document.getElementById('reset-button');

    // Load saved habits and initialize streak
    let habits = JSON.parse(localStorage.getItem('habits')) || [];
    let streak = JSON.parse(localStorage.getItem('streak')) || 0;
    streakCount.textContent = `Streak: ${streak} days`;

    habits.forEach(habit => addHabitToList(habit));
    loadCalendar();

    // Add new habit
    habitForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const habitText = habitInput.value.trim();
        if (habitText) {
            const habit = { text: habitText, completed: false };
            habits.push(habit);
            addHabitToList(habit);
            saveHabits();
            habitInput.value = '';
        }
    });

    // Function to add habit to the DOM
    function addHabitToList(habit) {
        const li = document.createElement('li');
        li.classList.add('habit-item');
        if (habit.completed) li.classList.add('completed');
        
        li.innerHTML = `
            ${habit.text}
            <button class="check-btn">${habit.completed ? "Undo" : "Complete"}</button>
            <button class="delete-btn">Delete</button>
        `;
        
        const checkBtn = li.querySelector('.check-btn');
        const deleteBtn = li.querySelector('.delete-btn');
        
        checkBtn.addEventListener('click', () => toggleHabitCompletion(habit, li, checkBtn));
        deleteBtn.addEventListener('click', () => deleteHabit(habit, li));

        habitList.appendChild(li);
    }

    // Toggle habit completion status
    function toggleHabitCompletion(habit, li, btn) {
        habit.completed = !habit.completed;
        li.classList.toggle('completed');
        btn.textContent = habit.completed ? "Undo" : "Complete";
        updateStreak();
        saveHabits();
    }

    // Delete habit from the list
    function deleteHabit(habit, li) {
        habits = habits.filter(h => h !== habit); // Remove from the habit array
        li.remove(); // Remove from the UI
        saveHabits();
    }

    // Save habits and streak to LocalStorage
    function saveHabits() {
        localStorage.setItem('habits', JSON.stringify(habits));
    }

    function saveStreak() {
        localStorage.setItem('streak', JSON.stringify(streak));
    }

    // Calendar View Logic
    function loadCalendar() {
        const daysInMonth = new Date().getDate();
        const completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];

        for (let day = 1; day <= daysInMonth; day++) {
            const dayEl = document.createElement('div');
            dayEl.classList.add('day');
            if (completedDays.includes(day)) {
                dayEl.classList.add('completed');
            }
            dayEl.textContent = day;

            dayEl.addEventListener('click', () => {
                dayEl.classList.toggle('completed');
                if (dayEl.classList.contains('completed')) {
                    completedDays.push(day);
                } else {
                    const index = completedDays.indexOf(day);
                    if (index > -1) completedDays.splice(index, 1);
                }
                localStorage.setItem('completedDays', JSON.stringify(completedDays));
                updateStreak();
            });

            calendarGrid.appendChild(dayEl);
        }
    }

    // Streak Counter Logic
    function updateStreak() {
        const completedDays = JSON.parse(localStorage.getItem('completedDays')) || [];
        const today = new Date().getDate();
        if (completedDays.includes(today - 1) && completedDays.includes(today)) {
            streak += 1;
        } else {
            streak = 0; // Reset streak if no consecutive completion
        }
        streakCount.textContent = `Streak: ${streak} days`;
        saveStreak();
    }

    // Reset Habit Tracker
    resetButton.addEventListener('click', () => {
        if (confirm("Are you sure you want to reset the entire tracker?")) {
            habits = [];
            streak = 0;
            localStorage.clear();
            habitList.innerHTML = ''; // Clear UI
            calendarGrid.innerHTML = ''; // Clear Calendar
            streakCount.textContent = `Streak: 0 days`;
        }
    });
});
