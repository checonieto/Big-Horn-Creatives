// LocalStorage Utilities
function getLocalStorage(key) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
}

function setLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
}

// Main Application
document.addEventListener('DOMContentLoaded', async () => {
  // DOM Elements
  const elements = {
    container: document.getElementById('freelancers-list'),
    modal: document.getElementById('freelancer-modal'),
    modalContent: document.getElementById('modal-content'),
    closeModal: document.getElementById('close-modal'),
    skillsFilter: document.getElementById('skills-filter'),
    locationFilter: document.getElementById('location-filter'),
    resetBtn: document.getElementById('reset-filters')
  };

  // State
  let freelancers = [];

  // Fetch all my BISON freelancers
  async function fetchFreelancers() {
    try {
      const cached = getLocalStorage('freelancers');
      if (cached) return cached;

      const response = await fetch('data/freelancers.json');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setLocalStorage('freelancers', data);
      return data;
    } catch (error) {
      console.error('Error:', error);
      elements.container.innerHTML = '<p class="error">Error loading freelancers</p>';
      return [];
    }
  }

  // Display all my BISON freelancers
  function displayFreelancers(freelancersToShow) {
    elements.container.innerHTML = freelancersToShow.map(freelancer => `
      <div class="freelancer-card" data-id="${freelancer.id}">
        <img src="${freelancer.image}" alt="${freelancer.name}" loading="lazy">
        <h3>${freelancer.name}</h3>
        <p><strong>Skills:</strong> ${freelancer.skills.join(', ')}</p>
        <p><strong>Location:</strong> ${freelancer.location}</p>
        <p><strong>Rating:</strong> ${freelancer.rating}/5</p>
        <button class="view-details">View Details</button>
      </div>
    `).join('');
  }

  // functionality
  function setupFilters() {
    function applyFilters() {
      const skill = elements.skillsFilter.value;
      const location = elements.locationFilter.value;
      
      const filtered = freelancers.filter(f => {
        const skillMatch = skill === 'all' || f.skills.includes(skill);
        const locationMatch = location === 'all' || f.location === location;
        return skillMatch && locationMatch;
      });
      
      displayFreelancers(filtered);
    }

    // Event listeners
    elements.skillsFilter.addEventListener('change', applyFilters);
    elements.locationFilter.addEventListener('change', applyFilters);
    elements.resetBtn.addEventListener('click', () => {
      elements.skillsFilter.value = 'all';
      elements.locationFilter.value = 'all';
      displayFreelancers(freelancers);
    });

    // filter
    applyFilters();
  }

  // Modal functionality
  function setupModal() {
    function showDetails(id) {
      const freelancer = freelancers.find(f => f.id === id);
      if (!freelancer) return;

      elements.modalContent.innerHTML = `
        <div class="modal-body">
          <img src="${freelancer.image}" alt="${freelancer.name}">
          <div class="details">
            <h2>${freelancer.name}</h2>
            <p><strong>Skills:</strong> ${freelancer.skills.join(', ')}</p>
            <p><strong>Location:</strong> ${freelancer.location}</p>
            <p><strong>Rating:</strong> ${freelancer.rating}/5</p>
            ${freelancer.portfolio ? `<a href="${freelancer.portfolio}" target="_blank">View Portfolio</a>` : ''}
          </div>
        </div>
      `;
      elements.modal.style.display = 'block';
    }

    // cards
    elements.container.addEventListener('click', (e) => {
      if (e.target.classList.contains('view-details')) {
        const card = e.target.closest('.freelancer-card');
        const id = parseInt(card.dataset.id);
        showDetails(id);
      }
    });

    // Close modal
    elements.closeModal.addEventListener('click', () => {
      elements.modal.style.display = 'none';
    });

    window.addEventListener('click', (e) => {
      if (e.target === elements.modal) {
        elements.modal.style.display = 'none';
      }
    });
  }

  // Start
  freelancers = await fetchFreelancers();
  if (freelancers.length) {
    setupFilters();
    setupModal();
  }
});