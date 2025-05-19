document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");
  const messageDiv = document.getElementById("message");

  // Function to fetch activities from API
  async function fetchActivities() {
    try {
      const response = await fetch("/activities");
      const activities = await response.json();

      // Clear loading message
      activitiesList.innerHTML = "";

      // Populate activities list
      Object.entries(activities).forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
        `;

        // Usuń pierwszą listę uczestników, zostaw tylko alternatywną
        // const participantsSection = document.createElement("div");
        // participantsSection.className = "participants-section";
        // const participantsHeader = document.createElement("p");
        // participantsHeader.innerHTML = "<strong>Uczestnicy:</strong>";
        // participantsSection.appendChild(participantsHeader);

        // const participantsList = document.createElement("ul");
        // if (Array.isArray(details.participants) && details.participants.length > 0) {
        //   details.participants.forEach((participant) => {
        //     const li = document.createElement("li");
        //     li.className = "participant";
        //     li.textContent = participant;
        //     participantsList.appendChild(li);
        //   });
        // } else {
        //   const li = document.createElement("li");
        //   li.className = "participant";
        //   li.textContent = "Brak zapisanych uczestników";
        //   participantsList.appendChild(li);
        // }
        // participantsSection.appendChild(participantsList);

        // Dodaj drugą listę uczestników z niezależnym formatowaniem
        const participantsSectionAlt = document.createElement("div");
        participantsSectionAlt.className = "participants-section-alt";
        const participantsHeaderAlt = document.createElement("p");
        participantsHeaderAlt.innerHTML = "<strong>Lista uczestników:</strong>";
        participantsSectionAlt.appendChild(participantsHeaderAlt);

        const participantsListAlt = document.createElement("ol");
        if (Array.isArray(details.participants) && details.participants.length > 0) {
          details.participants.forEach((participant) => {
            const li = document.createElement("li");
            li.className = "participant-alt";
            li.textContent = participant;
            participantsListAlt.appendChild(li);
          });
        } else {
          const li = document.createElement("li");
          li.className = "participant-alt";
          li.textContent = "Brak uczestników";
          participantsListAlt.appendChild(li);
        }
        participantsSectionAlt.appendChild(participantsListAlt);

        // activityCard.appendChild(participantsSection);
        activityCard.appendChild(participantsSectionAlt);

        activitiesList.appendChild(activityCard);

        // Add option to select dropdown
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        activitySelect.appendChild(option);
      });
    } catch (error) {
      activitiesList.innerHTML = "<p>Failed to load activities. Please try again later.</p>";
      console.error("Error fetching activities:", error);
    }
  }

  // Handle form submission
  signupForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const activity = document.getElementById("activity").value;

    try {
      const response = await fetch(
        `/activities/${encodeURIComponent(activity)}/signup?email=${encodeURIComponent(email)}`,
        {
          method: "POST",
        }
      );

      const result = await response.json();

      if (response.ok) {
        messageDiv.textContent = result.message;
        messageDiv.className = "success";
        signupForm.reset();
      } else {
        messageDiv.textContent = result.detail || "An error occurred";
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Initialize app
  fetchActivities();
});
