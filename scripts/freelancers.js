// Fetch freelancer data from JSON file
async function fetchFreelancers() {
  try {
    const response = await fetch('/data/freelancers.json'); // Ensure correct path
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching freelancers:', error);
    return []; // Return empty array to prevent errors
  }
}

// Display freelancers on the page
function displayFreelancers(freelancers, containerId) {
  const container = document.getElementById(containerId);
  if (!container) {
    console.error(`Container with ID "${containerId}" not found.`);
    return;
  }

  if (freelancers.length === 0) {
    container.innerHTML = `<p>No freelancers available.</p>`;
    return;
  }

  container.innerHTML = freelancers
    .map(
      (freelancer) => `
      <div class="freelancer-card">
        <img src="${freelancer.image || 'default-avatar.png'}" alt="${freelancer.name}" loading="lazy">
        <h3>${freelancer.name}</h3>
        <p><strong>Skills:</strong> ${freelancer.skills?.join(', ') || 'N/A'}</p>
        <p><strong>Location:</strong> ${freelancer.location || 'Unknown'}</p>
        <p><strong>Rating:</strong> ${freelancer.rating ?? 'Not Rated'}</p>
        <a href="${freelancer.portfolio || '#'}" target="_blank" class="cta-button">View Portfolio</a>
      </div>
    `
    )
    .join('');
}
// Filter freelancers based on search input
function filterFreelancers(freelancers) {
  const searchInput = document.getElementById('search');
  if (!searchInput) return;

  searchInput.addEventListener('input', () => {
    const searchTerm = searchInput.value.toLowerCase().trim();

    const filteredFreelancers = freelancers.filter((freelancer) =>
      freelancer.skills.some((skill) => skill.toLowerCase().includes(searchTerm)) ||
      freelancer.location.toLowerCase().includes(searchTerm)
    );

    displayFreelancers(filteredFreelancers, 'freelancers-list');
  });
}

// Initialize the page
async function init() {
  const freelancers = await fetchFreelancers();
  displayFreelancers(freelancers, 'freelancers-list');
  filterFreelancers(freelancers); // Enable search filtering
}

// Run the initialization function when the page loads
document.addEventListener('DOMContentLoaded', init);