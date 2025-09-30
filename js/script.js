// Subscribe to data changes from admin panel
DataAPI.subscribe(() => {
    updateStatistics();
    renderBatchCards();
});

// Use DataAPI instead of separate alumniData array
function getAlumniData() {
    return DataAPI.getAllAlumni();
}

// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const adminLoginBtn = document.getElementById('adminLoginBtn');
const adminLoginModal = document.getElementById('adminLoginModal');
const alumniListModal = document.getElementById('alumniListModal');
const alumniDetailsModal = document.getElementById('alumniDetailsModal');
const closeBtns = document.querySelectorAll('.close');
const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const adminLoginForm = document.getElementById('adminLoginForm');

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scroll and active nav link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// Update active nav on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPos = window.scrollY + 100;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Modal Functions
adminLoginBtn.addEventListener('click', () => {
    adminLoginModal.classList.add('active');
});

closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').classList.remove('active');
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Admin Login
adminLoginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Simple authentication (in production, use proper authentication)
    if (username === 'admin' && password === 'admin123') {
        alert('Login successful! Redirecting to admin panel...');
        window.location.href = 'admin.html';
    } else {
        alert('Invalid credentials. Please try again.');
    }
});

// Search Functionality
searchInput.addEventListener('input', (e) => {
    const query = e.target.value.toLowerCase().trim();
    
    if (query.length === 0) {
        searchResults.classList.remove('active');
        searchResults.innerHTML = '';
        return;
    }

    const filtered = DataAPI.searchAlumni(query);

    if (filtered.length > 0) {
        searchResults.innerHTML = filtered.map(alumni => `
            <div class="search-result-item" data-id="${alumni.id}">
                <div class="search-result-name">${alumni.name}</div>
                <div class="search-result-info">Batch ${alumni.batch} • ${alumni.employmentStatus}</div>
            </div>
        `).join('');
        searchResults.classList.add('active');

        // Add click handlers
        document.querySelectorAll('.search-result-item').forEach(item => {
            item.addEventListener('click', () => {
                const alumniId = parseInt(item.dataset.id);
                showAlumniDetails(alumniId);
                searchResults.classList.remove('active');
                searchInput.value = '';
            });
        });
    } else {
        searchResults.innerHTML = '<div class="search-result-item">No results found</div>';
        searchResults.classList.add('active');
    }
});

// Close search results when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.search-container')) {
        searchResults.classList.remove('active');
    }
});

// Render Batch Cards
function renderBatchCards() {
    const batchGrid = document.getElementById('batchGrid');
    const alumniData = getAlumniData();
    const batches = [...new Set(alumniData.map(a => a.batch))].sort((a, b) => a - b);
    
    batchGrid.innerHTML = batches.map(batch => {
        const count = alumniData.filter(a => a.batch === batch).length;
        return `
            <div class="batch-card" data-batch="${batch}">
                <h3>Batch ${batch}</h3>
                <p>${count} ${count === 1 ? 'Graduate' : 'Graduates'}</p>
            </div>
        `;
    }).join('');

    // Add click handlers
    document.querySelectorAll('.batch-card').forEach(card => {
        card.addEventListener('click', () => {
            const batch = parseInt(card.dataset.batch);
            showBatchAlumni(batch);
        });
    });
}

// Show Alumni List by Batch
function showBatchAlumni(batch) {
    const batchAlumni = DataAPI.getAlumniByBatch(batch);
    const batchTitle = document.getElementById('batchTitle');
    const alumniList = document.getElementById('alumniList');

    batchTitle.textContent = `Batch ${batch} Alumni (${batchAlumni.length})`;
    
    alumniList.innerHTML = batchAlumni.map(alumni => `
        <div class="alumni-item" data-id="${alumni.id}">
            <div>
                <div class="alumni-item-name">${alumni.name}</div>
                <div class="alumni-item-info">${alumni.employmentStatus} • ${alumni.currentWork?.company || alumni.business?.name || 'N/A'}</div>
            </div>
            <i class="fas fa-chevron-right"></i>
        </div>
    `).join('');

    alumniListModal.classList.add('active');

    // Add click handlers
    document.querySelectorAll('.alumni-item').forEach(item => {
        item.addEventListener('click', () => {
            const alumniId = parseInt(item.dataset.id);
            alumniListModal.classList.remove('active');
            setTimeout(() => showAlumniDetails(alumniId), 300);
        });
    });
}

// Show Alumni Details
function showAlumniDetails(alumniId) {
    const alumni = DataAPI.getAlumniById(alumniId);
    if (!alumni) return;

    const alumniDetails = document.getElementById('alumniDetails');
    
    alumniDetails.innerHTML = `
        <div class="alumni-details-header">
            <h2>${alumni.name}</h2>
            <p>Batch ${alumni.batch} Graduate</p>
        </div>

        <div class="details-grid">
            <!-- Personal Information -->
            <div class="detail-section">
                <h3><i class="fas fa-user"></i> Personal Information</h3>
                <div class="detail-row">
                    <span class="detail-label">Age:</span>
                    <span class="detail-value">${alumni.age}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">IIEE Position:</span>
                    <span class="detail-value">${alumni.iieePosition}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Email:</span>
                    <span class="detail-value">${alumni.email}</span>
                </div>
                <div class="detail-row">
                    <span class="detail-label">Employment Status:</span>
                    <span class="detail-value">${alumni.employmentStatus}</span>
                </div>
            </div>

            <!-- Licenses -->
            <div class="detail-section">
                <h3><i class="fas fa-certificate"></i> Professional Licenses</h3>
                ${alumni.licenses.length > 0 ? alumni.licenses.map(license => `
                    <div class="license-badge">${license.type} - ${license.year}</div>
                `).join(' ') : '<p class="no-data">No licenses recorded</p>'}
            </div>

            <!-- Current Work -->
            ${alumni.currentWork ? `
            <div class="detail-section">
                <h3><i class="fas fa-briefcase"></i> Current Employment</h3>
                <div class="job-item">
                    <div class="job-title">${alumni.currentWork.position}</div>
                    <div class="job-company">${alumni.currentWork.company}</div>
                    <div class="job-details">
                        <span><i class="fas fa-map-marker-alt"></i> ${alumni.currentWork.location}</span>
                        <span><i class="fas fa-calendar"></i> ${alumni.currentWork.year}</span>
                        ${alumni.currentWork.achievements ? `<span><i class="fas fa-trophy"></i> ${alumni.currentWork.achievements}</span>` : ''}
                    </div>
                </div>
            </div>
            ` : ''}

            <!-- Past Jobs -->
            ${alumni.pastJobs && alumni.pastJobs.length > 0 ? `
            <div class="detail-section">
                <h3><i class="fas fa-history"></i> Work History</h3>
                ${alumni.pastJobs.map(job => `
                    <div class="job-item">
                        <div class="job-title">${job.position}</div>
                        <div class="job-company">${job.company}</div>
                        <div class="job-details">
                            <span><i class="fas fa-map-marker-alt"></i> ${job.location}</span>
                            <span><i class="fas fa-calendar"></i> ${job.year}</span>
                            ${job.achievements ? `<span><i class="fas fa-trophy"></i> ${job.achievements}</span>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
            ` : ''}

            <!-- Business -->
            ${alumni.business ? `
            <div class="detail-section">
                <h3><i class="fas fa-store"></i> Business Information</h3>
                <div class="business-item">
                    <div class="business-name">${alumni.business.name}</div>
                    <div class="business-type">${alumni.business.type}</div>
                    <div class="business-details">
                        <span><i class="fas fa-info-circle"></i> ${alumni.business.description}</span>
                        <span><i class="fas fa-map-marker-alt"></i> ${alumni.business.location}</span>
                    </div>
                </div>
            </div>
            ` : ''}
        </div>
    `;

    alumniDetailsModal.classList.add('active');
}

// Update Statistics
function updateStatistics() {
    const stats = DataAPI.getStatistics();
    
    document.getElementById('totalAlumni').textContent = stats.total;
    document.getElementById('employedCount').textContent = stats.employed;
    document.getElementById('licensedCount').textContent = stats.licensed;
}

// Batch Filter Functionality
const batchSearchInput = document.getElementById('batchSearchInput');
const clearBatchFilter = document.getElementById('clearBatchFilter');
const batchGrid = document.getElementById('batchGrid');

// Filter batch cards
function filterBatchCards() {
    const searchTerm = batchSearchInput.value.toLowerCase().trim();
    const batchCards = document.querySelectorAll('.batch-card');
    let visibleCount = 0;

    // Show/hide clear button
    clearBatchFilter.style.display = searchTerm ? 'flex' : 'none';

    batchCards.forEach(card => {
        const batchYear = card.dataset.batch;
        
        if (batchYear.includes(searchTerm)) {
            card.classList.remove('hidden');
            visibleCount++;
        } else {
            card.classList.add('hidden');
        }
    });

    // Show "no results" message if no cards visible
    removeNoResultsMessage();
    if (visibleCount === 0 && searchTerm) {
        showNoResultsMessage();
    }
}

// Show no results message
function showNoResultsMessage() {
    const message = document.createElement('div');
    message.className = 'no-results-message';
    message.id = 'noResultsMessage';
    message.innerHTML = `
        <i class="fas fa-search" style="font-size: 3rem; color: var(--primary-blue); margin-bottom: 1rem;"></i>
        <p>No batches found matching "${batchSearchInput.value}"</p>
        <p style="font-size: 0.9rem; margin-top: 0.5rem;">Try searching for a different year (2006-2024)</p>
    `;
    batchGrid.appendChild(message);
}

// Remove no results message
function removeNoResultsMessage() {
    const existingMessage = document.getElementById('noResultsMessage');
    if (existingMessage) {
        existingMessage.remove();
    }
}

// Clear filter
function clearBatchFilterInput() {
    batchSearchInput.value = '';
    filterBatchCards();
    batchSearchInput.focus();
}

// Event listeners
batchSearchInput.addEventListener('input', filterBatchCards);
clearBatchFilter.addEventListener('click', clearBatchFilterInput);

// Allow Enter key to clear when field is empty
batchSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        clearBatchFilterInput();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    updateStatistics();
    renderBatchCards();
});