// Lazy loading for images
document.addEventListener("DOMContentLoaded", function () {
    const images = document.querySelectorAll("img[loading='lazy']");
    images.forEach((img) => {
      img.src = img.dataset.src;
    });
  });
  
  // Modal functionality
  function openModal(id) {
    const freelancer = freelancers.find((f) => f.id === id);
    const modal = document.createElement("div");
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span onclick="closeModal()">&times;</span>
        <h2>${freelancer.name}</h2>
        <p>Skills: ${freelancer.skills.join(", ")}</p>
        <p>Location: ${freelancer.location}</p>
        <p>Rating: ${freelancer.rating}</p>
        <a href="${freelancer.portfolio}" target="_blank">View Portfolio</a>
      </div>
    `;
    document.body.appendChild(modal);
  }
  
  function closeModal() {
    const modal = document.querySelector(".modal");
    if (modal) modal.remove();
  }