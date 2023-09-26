document.addEventListener("DOMContentLoaded", () => {
  // Handle cell click event
  document.addEventListener("click", (event) => {
    if (event.target.classList.contains("cell")) {
      const cell = event.target;
      const personName = cell.getAttribute("data-person");
      const date = cell.getAttribute("data-date");
      const week = cell.getAttribute("data-week");

      if (date) {
        toggleCellColor(cell, personName, { type: "date", value: date });
      } else if (week) {
        toggleCellColor(cell, personName, { type: "week", value: week });
      }
    }
  });
});

// Function to toggle cell color and update server
function toggleCellColor(cell, personName, identifier) {
  const colors = ["", "cell-green", "cell-orange", "cell-red"];
  let currentColorIndex = 0;

  // Identify the current color class
  for (let i = 1; i < colors.length; i++) {
    if (cell.classList.contains(colors[i])) {
      currentColorIndex = i;
      cell.classList.remove(colors[i]);
      break;
    }
  }

  // Calculate the next color index and add the corresponding class
  const nextColorIndex = (currentColorIndex + 1) % colors.length;
  if (nextColorIndex > 0) {
    cell.classList.add(colors[nextColorIndex]);
  }

  // Update server
  fetch("/update-color", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: personName,
      identifier,
      color: colors[nextColorIndex],
    }),
  });
}

// Add person
function addPerson(name) {
  fetch("/add-person", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  }).then(() => location.reload());
}

// Event listener for add person button
document.getElementById("addPersonBtn").addEventListener("click", () => {
  const name = document.getElementById("newPersonName").value;
  if (name) {
    addPerson(name);
    document.getElementById("newPersonName").value = "";
  }
});

// Add person when Enter key is pressed in the text box
document
  .getElementById("newPersonName")
  .addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      const name = event.target.value;
      if (name) {
        addPerson(name);
        event.target.value = "";
      }
    }
  });

// Remove person
document.querySelectorAll(".removePersonBtn").forEach((btn) => {
  btn.addEventListener("click", (event) => {
    event.preventDefault(); // Prevent the default action
    const name = btn.getAttribute("data-person");
    const isConfirmed = confirm(
      `Are you sure you want to remove ${name}? All data on this person will be deleted.`
    );

    if (isConfirmed) {
      fetch("/remove-person", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      }).then(() => location.reload());
    }
  });
});

// Update date range
document
  .getElementById("startDate")
  .addEventListener("change", updateDateRange);
document.getElementById("endDate").addEventListener("change", updateDateRange);

function updateDateRange() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  fetch("/update-dates", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ startDate, endDate }),
  }).then(() => location.reload());
}
