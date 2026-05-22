**1. How to run:**
You don't need to install anything. Just download the files and double-click `index.html` to open it in your web browser.

**2. Stack & design choices:**
I chose plain HTML, CSS, and JavaScript. Since we just need to save data to `localStorage` and there is no backend server, setting up React or Vue seemed unnecessary. This keeps the code simple and easy for me to explain.

- **Design Decision 1 (Table Layout):** I used an HTML `<table>` instead of CSS Grid. A habit tracker is basically a table of days and habits, so using a standard table makes it very easy to align the headers (the days) with the checkboxes without writing complicated CSS.
- **Design Decision 2 (Streak Logic):** The streak counter starts checking from yesterday if today isn't checked yet. This way, if you open the app in the morning, your streak doesn't incorrectly drop to 0 just because you haven't completed the habit yet today.

**3. Responsive & accessibility:**

- **Responsive layout:** On a laptop monitor, the table fits perfectly. But on a small phone screen, 7 columns of checkboxes get too small to click easily. To fix this, I added `overflow-x: auto` to a wrapper `div` around the table. This allows the user to scroll horizontally on mobile so the checkboxes stay a normal, clickable size.
- **Accessibility handled:** I used standard `<input type="checkbox">` tags. This means users can automatically use the `Tab` key to move through the days and the `Spacebar` to check or uncheck habits without me needing to write extra JavaScript for the keyboard.
- **Accessibility skipped:** I didn't add advanced screen reader text (like `aria-live` to announce when the streak number changes) because I wanted to focus entirely on getting the core logic and visual grid working first.

**4. AI usage:**
I asked AI (Gemini) for help with the logic to calculate the dates for the current week.

- **The prompt:** I asked it how to calculate the 7 dates of the week based on a "week offset" number (e.g., 0 for this week, -1 for last week).
- **The tweak:** At first, it gave me a very complex function. I asked it to simplify the code using basic JavaScript `Date` methods and a simple `while` loop so I could easily understand, explain, and debug it myself.

**5. Honest gap:**
If I had another day, the first thing I would fix is the visual feedback. Right now, clicking a checkbox is instant, so adding a small CSS animation would make it feel nicer to use. Also, dealing with dates in JavaScript can be tricky, so I would want to test the date logic more thoroughly to make sure it doesn't break at the end of a month or year.
