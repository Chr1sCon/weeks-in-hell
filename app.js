const express = require("express");
const fs = require("fs");
const path = require("path");
const app = express();
const port = 3000;
const jsonFilePath = './data/appState.json';
//const jsonFilePath = "/usr/src/app/data/appState.json";

// Function to initialize the JSON file
const initializeJsonFile = () => {
  let today = new Date();
  let nextWeek = new Date();
  nextWeek = addWeeksMinusOneDay(nextWeek, 1);
  nextWeek = nextWeek.toISOString().split("T")[0];
  today = today.toISOString().split("T")[0];

  const initialState = {
    weeks: 1,
    startDate: today,
    endDate: nextWeek,
    persons: [],
  };
  fs.writeFileSync(jsonFilePath, JSON.stringify(initialState));
  return initialState;
};

// Function to start the server
const startServer = (appState) => {
  const app = express();

  // Middleware configurations
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  //pp.use(express.static('public'));
  app.use(express.static(path.join(__dirname, "public")));

  // Set up your view engine
  app.set("view engine", "ejs");

  // Main route
  app.get("/", (req, res) => {
    const calendars = appState.persons.map((person) => {
      return {
        name: person.name,
        calendarData: generateCalendar(
          appState.startDate,
          appState.endDate,
          person.weeks,
          person.calendar
        ),
      };
    });
    res.render("index", {
      title: `${appState.weeks} Weeks in Hell`,
      weeks: appState.weeks,
      startDate: appState.startDate, // Add this line
      endDate: appState.endDate, // Add this line
      calendars,
    });
  });

  // Add a new person
  app.post("/add-person", (req, res) => {
    const { name } = req.body;
    if (name && !appState.persons.some((person) => person.name === name)) {
      const newPerson = { name, calendar: {}, weeks: {} };

      // Initialize calendarData for the new person
      newPerson.calendar = generateCalendarData(
        appState.startDate,
        appState.endDate
      );

      // Initialize weekData for the new person
      newPerson.weeks = generateWeekData(appState.startDate, appState.endDate);

      appState.persons.push(newPerson);
      saveAppState();
    }
    res.redirect("/");
  });

  // Remove a person
  app.post("/remove-person", (req, res) => {
    const { name } = req.body;
    appState.persons = appState.persons.filter(
      (person) => person.name !== name
    );
    saveAppState();
    res.redirect("/");
  });

  // Update start and end dates
  app.post("/update-dates", (req, res) => {
    const { startDate, endDate } = req.body;
    if (startDate && endDate) {
      appState.startDate = startDate;
      appState.endDate = endDate;
      // Recalculate weeks
      appState.weeks = Math.ceil(
        (new Date(endDate) - new Date(startDate)) / (7 * 24 * 60 * 60 * 1000)
      );
      saveAppState();
    }
    res.redirect("/");
  });

  // Function to save app state to JSON
  const saveAppState = () => {
    fs.writeFile("./data/appState.json", JSON.stringify(appState), (err) => {
      if (err) console.error("Error writing app state:", err);
    });
  };

  // Update color for a date or a week for a person
  app.post("/update-color", (req, res) => {
    const { name, identifier, color } = req.body;
    const person = appState.persons.find((person) => person.name === name);

    if (person) {
      if (identifier.type === "date") {
        person.calendar[identifier.value] = color;
      } else if (identifier.type === "week") {
        if (!person.weeks) {
          person.weeks = {};
        }
        person.weeks[identifier.value] = color; // identifier.value is now the unique identifier
      }
      saveAppState();
    }
    res.redirect("/");
  });

  // Start the server
  app.listen(port, () => {
    console.log(`Weeks in Hell app listening at http://localhost:${port}`);
  });
};

// Read app state from JSON
let appState;
const loadAppState = () => {
  fs.readFile(jsonFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading app state:", err);
      return;
    }
    appState = JSON.parse(data);
  });
};
loadAppState();

// Function to generate calendar data
const generateCalendar = (
  startDate,
  endDate,
  weekColors,
  existingCalendar = {}
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const calendarData = [];

  let week = [];
  let weekCount = 1;

  for (let dt = new Date(start); dt <= end; dt.setDate(dt.getDate() + 1)) {
    const day = {
      date: new Date(dt),
      color: existingCalendar[dt.toISOString().split("T")[0]] || "",
    };

    if (dt.getDay() === 1 && week.length > 0) {
      // Monday and not the first week
      const weekStart = new Date(week[0].date).toISOString().split("T")[0];
      calendarData.push({
        weekNumber: weekCount++,
        weekStart,
        days: week,
        color: weekColors[weekStart] || "",
      });
      week = [];
    }

    week.push(day);
  }

  if (week.length > 0) {
    const weekStart = new Date(week[0].date).toISOString().split("T")[0];
    calendarData.push({
      weekNumber: weekCount,
      weekStart,
      days: week,
      color: weekColors[weekStart] || "",
    });
  }

  return calendarData;
};

// Function to generate calendar data based on start and end dates
function generateCalendarData(startDate, endDate) {
  // Your logic to generate calendar data goes here
  // This will depend on how you've structured your appState and calendarData
  // For example, you might loop through the date range and initialize each date as 'none'
  const calendarData = {};
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDate <= endDateObj) {
    const dateString = currentDate.toISOString().split("T")[0];
    calendarData[dateString] = "none";
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return calendarData;
}

function generateWeekData(startDate, endDate) {
  const weekData = {};
  let currentDate = new Date(startDate);
  const endDateObj = new Date(endDate);

  while (currentDate <= endDateObj) {
    if (currentDate.getDay() === 1) {
      // Check if it's a Monday
      const weekStart = currentDate.toISOString().split("T")[0];
      weekData[weekStart] = "none";
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return weekData;
}

// Check if JSON file exists
fs.access(jsonFilePath, fs.constants.F_OK, (err) => {
  let appState;
  if (err) {
    // File doesn't exist, initialize it
    appState = initializeJsonFile();
  } else {
    // File exists, read it
    const data = fs.readFileSync(jsonFilePath, "utf8");
    if (!data || !JSON.parse(data)) {
      // File is blank or corrupted, initialize it
      appState = initializeJsonFile();
    } else {
      appState = JSON.parse(data);
    }
  }
  startServer(appState);
});

function addWeeks(date, weeks) {
  date.setDate(date.getDate() + 7 * weeks);
  return date;
}
function addWeeksMinusOneDay(date, weeks) {
  date.setDate(date.getDate() + 7 * weeks - 1);
  return date;
}

function addDays(date, days) {
  date.setDate(date.getDate() + days);
  return date;
}
