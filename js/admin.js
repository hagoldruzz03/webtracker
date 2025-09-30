const menuToggle = document.getElementById('menuToggle');
const sidebar = document.querySelector('.sidebar');
const menuItems = document.querySelectorAll('.menu-item');
const contentSections = document.querySelectorAll('.content-section');
const pageTitle = document.getElementById('pageTitle');

// Mobile sidebar toggle
menuToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
});

// Close sidebar on outside click (mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 968) {
        if (!sidebar.contains(e.target) && !menuToggle.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    }
});

// Menu navigation
menuItems.forEach(item => {
    item.addEventListener('click', () => {
        const section = item.dataset.section;
        if (!section) return;

        // Update active menu item
        menuItems.forEach(m => m.classList.remove('active'));
        item.classList.add('active');

        // Update page title
        const titles = {
            'dashboard': 'Dashboard',
            'alumni': 'Alumni Management',
            'add': 'Add New Alumni',
            'settings': 'Admin Settings'
        };
        pageTitle.textContent = titles[section] || 'Dashboard';

        // Show selected section
        contentSections.forEach(s => s.classList.remove('active'));
        document.getElementById(`${section}-section`).classList.add('active');

        // Close sidebar on mobile
        if (window.innerWidth <= 968) {
            sidebar.classList.remove('active');
        }

        // Refresh data
        if (section === 'dashboard') {
            updateDashboard();
        } else if (section === 'alumni') {
            renderAlumniTable();
        } else if (section === 'settings') {
            loadAdminAccounts();
        }
    });
});

// Notification Modal System
function showNotification(message, type = 'success') {
    const modal = document.getElementById('notificationModal');
    const icon = document.getElementById('notificationIcon');
    const text = document.getElementById('notificationText');
    const okBtn = document.getElementById('notificationOk');

    // Set icon and color based on type
    const config = {
        success: { icon: 'fa-check-circle', color: '#28a745' },
        error: { icon: 'fa-exclamation-circle', color: '#dc3545' },
        warning: { icon: 'fa-exclamation-triangle', color: '#ffc107' },
        info: { icon: 'fa-info-circle', color: '#17a2b8' }
    };

    const notifConfig = config[type] || config.info;
    icon.className = `fas ${notifConfig.icon}`;
    icon.style.color = notifConfig.color;
    text.textContent = message;

    modal.classList.add('active');

    // Auto close after 3 seconds
    const autoClose = setTimeout(() => {
        modal.classList.remove('active');
    }, 3000);

    // Manual close
    okBtn.onclick = () => {
        clearTimeout(autoClose);
        modal.classList.remove('active');
    };
}

// Confirmation Modal System
function showConfirmation(message, onConfirm) {
    const modal = document.getElementById('confirmModal');
    const text = document.getElementById('confirmText');
    const confirmBtn = document.getElementById('confirmYes');
    const cancelBtn = document.getElementById('confirmNo');

    text.textContent = message;
    modal.classList.add('active');

    confirmBtn.onclick = () => {
        modal.classList.remove('active');
        onConfirm();
    };

    cancelBtn.onclick = () => {
        modal.classList.remove('active');
    };
}

// Logout function
function logout() {
    showConfirmation('Are you sure you want to logout?', () => {
        window.location.href = 'index.html';
    });
}

// Update Dashboard
function updateDashboard() {
    const stats = DataAPI.getStatistics();
    
    document.getElementById('dashTotalAlumni').textContent = stats.total;
    document.getElementById('dashEmployed').textContent = stats.employed;
    document.getElementById('dashLicensed').textContent = stats.licensed;
    document.getElementById('dashBatches').textContent = stats.batches;

    renderBatchChart();
    renderEmploymentChart();
    renderRecentActivity();
}

// Render Batch Chart
function renderBatchChart() {
    const distribution = DataAPI.getBatchDistribution();
    const chartContainer = document.getElementById('batchChart');
    
    const maxValue = Math.max(...Object.values(distribution));
    
    chartContainer.innerHTML = Object.entries(distribution)
        .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
        .map(([batch, count]) => {
            const percentage = (count / maxValue) * 100;
            return `
                <div class="chart-bar">
                    <span class="chart-label">Batch ${batch}</span>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" style="width: ${percentage}%">
                            <span class="chart-value">${count}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
}

// Render Employment Chart
function renderEmploymentChart() {
    const distribution = DataAPI.getEmploymentDistribution();
    const chartContainer = document.getElementById('employmentChart');
    
    const maxValue = Math.max(...Object.values(distribution));
    
    chartContainer.innerHTML = Object.entries(distribution)
        .map(([status, count]) => {
            const percentage = (count / maxValue) * 100;
            return `
                <div class="chart-bar">
                    <span class="chart-label">${status}</span>
                    <div class="chart-bar-bg">
                        <div class="chart-bar-fill" style="width: ${percentage}%">
                            <span class="chart-value">${count}</span>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
}

// Recent Activity Management
function getRecentActivity() {
    const activities = localStorage.getItem('recentActivities');
    return activities ? JSON.parse(activities) : [];
}

function addActivity(action, alumniName) {
    const activities = getRecentActivity();
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    const dateString = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    
    const newActivity = {
        action,
        alumniName,
        timestamp: now.toISOString(),
        displayTime: `${timeString} - ${dateString}`
    };
    
    activities.unshift(newActivity);
    const limitedActivities = activities.slice(0, 10);
    
    localStorage.setItem('recentActivities', JSON.stringify(limitedActivities));
    renderRecentActivity();
}

function renderRecentActivity() {
    const activities = getRecentActivity();
    const activityList = document.getElementById('activityList');
    
    if (activities.length === 0) {
        activityList.innerHTML = '<p class="no-data">No recent activity</p>';
        return;
    }
    
    activityList.innerHTML = activities.map(activity => `
        <div class="activity-item">
            <div class="activity-content">
                <strong>${activity.action}</strong>: ${activity.alumniName}
            </div>
            <div class="activity-time">${activity.displayTime}</div>
        </div>
    `).join('');
}

// Alumni Management
const alumniSearch = document.getElementById('alumniSearch');
const batchFilter = document.getElementById('batchFilter');
const statusFilter = document.getElementById('statusFilter');
const alumniTableBody = document.getElementById('alumniTableBody');

// Populate batch filter
function populateBatchFilter() {
    const batches = [...new Set(DataAPI.getAllAlumni().map(a => a.batch))].sort((a, b) => b - a);
    batchFilter.innerHTML = '<option value="">All Batches</option>' + 
        batches.map(batch => `<option value="${batch}">Batch ${batch}</option>`).join('');
}

// Render Alumni Table
function renderAlumniTable(filteredData = null) {
    const alumni = filteredData || DataAPI.getAllAlumni();
    
    if (alumni.length === 0) {
        alumniTableBody.innerHTML = `
            <tr>
                <td colspan="7" class="no-data">No alumni found</td>
            </tr>
        `;
        return;
    }

    alumniTableBody.innerHTML = alumni.map(a => `
        <tr>
            <td><strong>${a.name}</strong></td>
            <td>Batch ${a.batch}</td>
            <td>${a.age}</td>
            <td>${a.employmentStatus}</td>
            <td>${a.currentWork?.position || a.business?.name || 'N/A'}</td>
            <td>${a.licenses.map(l => l.type).join(', ') || 'None'}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editAlumni(${a.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn-icon btn-delete" onclick="deleteAlumni(${a.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </td>
        </tr>
    `).join('');
}

// Search and Filter
alumniSearch.addEventListener('input', applyFilters);
batchFilter.addEventListener('change', applyFilters);
statusFilter.addEventListener('change', applyFilters);

function applyFilters() {
    const query = alumniSearch.value.toLowerCase();
    const batch = batchFilter.value;
    const status = statusFilter.value;

    let filtered = DataAPI.getAllAlumni();

    if (query) {
        filtered = filtered.filter(a => 
            a.name.toLowerCase().includes(query) ||
            a.email.toLowerCase().includes(query)
        );
    }

    if (batch) {
        filtered = filtered.filter(a => a.batch === parseInt(batch));
    }

    if (status) {
        filtered = filtered.filter(a => a.employmentStatus === status);
    }

    renderAlumniTable(filtered);
}

// Toggle Custom Location
function toggleCustomLocation(prefix) {
    const locationSelect = document.getElementById(`${prefix}CurrentLocation`);
    const customGroup = document.getElementById(`${prefix}CustomLocationGroup`);
    
    if (locationSelect && customGroup) {
        if (locationSelect.value === 'Custom') {
            customGroup.style.display = 'block';
            const customInput = document.getElementById(`${prefix}CustomLocation`);
            if (customInput) {
                setTimeout(() => customInput.focus(), 100);
            }
        } else {
            customGroup.style.display = 'none';
            const customInput = document.getElementById(`${prefix}CustomLocation`);
            if (customInput && locationSelect.value !== 'Custom') {
                customInput.value = '';
            }
        }
    }
}

// Toggle Custom License
function toggleCustomLicense(selectElement) {
    const licenseRow = selectElement.closest('.license-row');
    const customInput = licenseRow.querySelector('.license-custom');
    
    if (customInput) {
        if (selectElement.value === 'Custom') {
            customInput.style.display = 'block';
            setTimeout(() => customInput.focus(), 100);
        } else {
            customInput.style.display = 'none';
            if (selectElement.value !== 'Custom') {
                customInput.value = '';
            }
        }
    }
}

// Toggle Past Job Custom Location
function togglePastJobCustomLocation(selectElement) {
    const entry = selectElement.closest('.past-job-entry');
    if (!entry) return;
    
    const customGroup = entry.querySelector('.pastJob-customLocation-group');
    const customInput = entry.querySelector('.pastJob-customLocation');
    
    if (customGroup) {
        if (selectElement.value === 'Custom') {
            customGroup.style.display = 'block';
            if (customInput) {
                setTimeout(() => customInput.focus(), 100);
            }
        } else {
            customGroup.style.display = 'none';
            if (customInput && selectElement.value !== 'Custom') {
                customInput.value = '';
            }
        }
    }
}

// Toggle Edit Past Job Custom Location
function toggleEditPastJobCustomLocation(selectElement) {
    const entry = selectElement.closest('.past-job-entry');
    if (!entry) return;
    
    const customGroup = entry.querySelector('.editPastJob-customLocation-group');
    const customInput = entry.querySelector('.editPastJob-customLocation');
    
    if (customGroup) {
        if (selectElement.value === 'Custom') {
            customGroup.style.display = 'block';
            if (customInput) {
                setTimeout(() => customInput.focus(), 100);
            }
        } else {
            customGroup.style.display = 'none';
            if (customInput && selectElement.value !== 'Custom') {
                customInput.value = '';
            }
        }
    }
}

// Add Past Job
function addPastJob() {
    const container = document.getElementById('pastJobsContainer');
    const newEntry = document.createElement('div');
    newEntry.className = 'past-job-entry';
    newEntry.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Position</label>
                <input type="text" class="pastJob-position" />
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="pastJob-company" />
            </div>
            <div class="form-group">
                <label>Location</label>
                <select class="pastJob-location">
                    <option value="">Select Location</option>
                    <option value="Local">Local</option>
                    <option value="Overseas">Overseas</option>
                    <option value="Custom">Custom Location</option>
                </select>
            </div>
            <div class="form-group pastJob-customLocation-group" style="display: none;">
                <label>Custom Location</label>
                <input type="text" class="pastJob-customLocation" placeholder="Enter specific location" />
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="pastJob-year" placeholder="e.g., 2018-2020" />
            </div>
            <div class="form-group full-width">
                <label>Achievements</label>
                <textarea class="pastJob-achievements" rows="2"></textarea>
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removePastJob(this)">
            <i class="fas fa-minus"></i> Remove
        </button>
    `;
    container.appendChild(newEntry);
    
    const locationSelect = newEntry.querySelector('.pastJob-location');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            togglePastJobCustomLocation(this);
        });
    }
}

// Remove Past Job
function removePastJob(button) {
    button.closest('.past-job-entry').remove();
}

// Add Edit Past Job
function addEditPastJob() {
    const container = document.getElementById('editPastJobsContainer');
    const newEntry = document.createElement('div');
    newEntry.className = 'past-job-entry';
    newEntry.innerHTML = `
        <div class="form-grid">
            <div class="form-group">
                <label>Position</label>
                <input type="text" class="editPastJob-position" />
            </div>
            <div class="form-group">
                <label>Company</label>
                <input type="text" class="editPastJob-company" />
            </div>
            <div class="form-group">
                <label>Location</label>
                <select class="editPastJob-location">
                    <option value="">Select Location</option>
                    <option value="Local">Local</option>
                    <option value="Overseas">Overseas</option>
                    <option value="Custom">Custom Location</option>
                </select>
            </div>
            <div class="form-group editPastJob-customLocation-group" style="display: none;">
                <label>Custom Location</label>
                <input type="text" class="editPastJob-customLocation" placeholder="Enter specific location" />
            </div>
            <div class="form-group">
                <label>Year</label>
                <input type="text" class="editPastJob-year" placeholder="e.g., 2018-2020" />
            </div>
            <div class="form-group full-width">
                <label>Achievements</label>
                <textarea class="editPastJob-achievements" rows="2"></textarea>
            </div>
        </div>
        <button type="button" class="btn-remove" onclick="removeEditPastJob(this)">
            <i class="fas fa-minus"></i> Remove
        </button>
    `;
    container.appendChild(newEntry);
    
    const locationSelect = newEntry.querySelector('.editPastJob-location');
    if (locationSelect) {
        locationSelect.addEventListener('change', function() {
            toggleEditPastJobCustomLocation(this);
        });
    }
}

// Remove Edit Past Job
function removeEditPastJob(button) {
    button.closest('.past-job-entry').remove();
}

// Edit Alumni
function editAlumni(id) {
    const alumni = DataAPI.getAlumniById(id);
    if (!alumni) return;

    document.getElementById('editId').value = alumni.id;
    document.getElementById('editName').value = alumni.name;
    document.getElementById('editBatch').value = alumni.batch;
    document.getElementById('editAge').value = alumni.age;
    document.getElementById('editIieePosition').value = alumni.iieePosition;
    document.getElementById('editEmail').value = alumni.email;
    document.getElementById('editEmploymentStatus').value = alumni.employmentStatus;

    const pastJobsContainer = document.getElementById('editPastJobsContainer');
    pastJobsContainer.innerHTML = '';
    
    if (alumni.pastJobs && alumni.pastJobs.length > 0) {
        alumni.pastJobs.forEach(job => {
            const entry = document.createElement('div');
            entry.className = 'past-job-entry';
            
            const isCustomLocation = job.location && job.location !== 'Local' && job.location !== 'Overseas';
            const locationValue = isCustomLocation ? 'Custom' : (job.location || '');
            
            entry.innerHTML = `
                <div class="form-grid">
                    <div class="form-group">
                        <label>Position</label>
                        <input type="text" class="editPastJob-position" value="${job.position || ''}" />
                    </div>
                    <div class="form-group">
                        <label>Company</label>
                        <input type="text" class="editPastJob-company" value="${job.company || ''}" />
                    </div>
                    <div class="form-group">
                        <label>Location</label>
                        <select class="editPastJob-location">
                            <option value="">Select Location</option>
                            <option value="Local" ${locationValue === 'Local' ? 'selected' : ''}>Local</option>
                            <option value="Overseas" ${locationValue === 'Overseas' ? 'selected' : ''}>Overseas</option>
                            <option value="Custom" ${isCustomLocation ? 'selected' : ''}>Custom Location</option>
                        </select>
                    </div>
                    <div class="form-group editPastJob-customLocation-group" style="display: ${isCustomLocation ? 'block' : 'none'};">
                        <label>Custom Location</label>
                        <input type="text" class="editPastJob-customLocation" placeholder="Enter specific location" value="${isCustomLocation ? job.location : ''}" />
                    </div>
                    <div class="form-group">
                        <label>Year</label>
                        <input type="text" class="editPastJob-year" value="${job.year || ''}" />
                    </div>
                    <div class="form-group full-width">
                        <label>Achievements</label>
                        <textarea class="editPastJob-achievements" rows="2">${job.achievements || ''}</textarea>
                    </div>
                </div>
                <button type="button" class="btn-remove" onclick="removeEditPastJob(this)">
                    <i class="fas fa-minus"></i> Remove
                </button>
            `;
            pastJobsContainer.appendChild(entry);
            
            const locationSelect = entry.querySelector('.editPastJob-location');
            if (locationSelect) {
                locationSelect.addEventListener('change', function() {
                    toggleEditPastJobCustomLocation(this);
                });
            }
        });
    }

    if (alumni.currentWork) {
        document.getElementById('editCurrentPosition').value = alumni.currentWork.position || '';
        document.getElementById('editCurrentCompany').value = alumni.currentWork.company || '';
        
        const isCustomLocation = alumni.currentWork.location && 
                                alumni.currentWork.location !== 'Local' && 
                                alumni.currentWork.location !== 'Overseas';
        
        if (isCustomLocation) {
            document.getElementById('editCurrentLocation').value = 'Custom';
            document.getElementById('editCustomLocation').value = alumni.currentWork.location;
            document.getElementById('editCustomLocationGroup').style.display = 'block';
        } else {
            document.getElementById('editCurrentLocation').value = alumni.currentWork.location || '';
            document.getElementById('editCustomLocation').value = '';
            document.getElementById('editCustomLocationGroup').style.display = 'none';
        }
        
        document.getElementById('editCurrentYear').value = alumni.currentWork.year || '';
        document.getElementById('editCurrentAchievements').value = alumni.currentWork.achievements || '';
    } else {
        document.getElementById('editCurrentPosition').value = '';
        document.getElementById('editCurrentCompany').value = '';
        document.getElementById('editCurrentLocation').value = '';
        document.getElementById('editCustomLocation').value = '';
        document.getElementById('editCustomLocationGroup').style.display = 'none';
        document.getElementById('editCurrentYear').value = '';
        document.getElementById('editCurrentAchievements').value = '';
    }

    document.getElementById('editModal').classList.add('active');
}

// Delete Alumni
function deleteAlumni(id) {
    const alumni = DataAPI.getAlumniById(id);
    if (!alumni) return;

    showConfirmation(`Are you sure you want to delete ${alumni.name}?`, () => {
        DataAPI.deleteAlumni(id);
        addActivity('Deleted Alumni', alumni.name);
        renderAlumniTable();
        updateDashboard();
        showNotification('Alumni deleted successfully! Changes will reflect on the main page.', 'success');
    });
}

// Close Edit Modal
function closeEditModal() {
    document.getElementById('editModal').classList.remove('active');
}

// Edit Form Submit
document.getElementById('editAlumniForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const id = parseInt(document.getElementById('editId').value);
    
    const updatedData = {
        name: document.getElementById('editName').value,
        batch: parseInt(document.getElementById('editBatch').value),
        age: parseInt(document.getElementById('editAge').value),
        iieePosition: document.getElementById('editIieePosition').value,
        email: document.getElementById('editEmail').value,
        employmentStatus: document.getElementById('editEmploymentStatus').value,
        pastJobs: [],
        currentWork: null,
        business: null
    };

    const pastJobEntries = document.querySelectorAll('#editPastJobsContainer .past-job-entry');
    pastJobEntries.forEach(entry => {
        const position = entry.querySelector('.editPastJob-position').value;
        const company = entry.querySelector('.editPastJob-company').value;
        const locationSelect = entry.querySelector('.editPastJob-location').value;
        const customLocation = entry.querySelector('.editPastJob-customLocation').value;
        const year = entry.querySelector('.editPastJob-year').value;
        const achievements = entry.querySelector('.editPastJob-achievements').value;
        
        if (position || company) {
            const location = locationSelect === 'Custom' ? customLocation : locationSelect;
            updatedData.pastJobs.push({
                position,
                company,
                location,
                year,
                achievements
            });
        }
    });

    const currentPosition = document.getElementById('editCurrentPosition').value;
    if (currentPosition) {
        const locationSelect = document.getElementById('editCurrentLocation').value;
        const customLocation = document.getElementById('editCustomLocation').value;
        const location = locationSelect === 'Custom' ? customLocation : locationSelect;
        
        updatedData.currentWork = {
            position: currentPosition,
            company: document.getElementById('editCurrentCompany').value,
            location: location,
            year: document.getElementById('editCurrentYear').value,
            achievements: document.getElementById('editCurrentAchievements').value
        };
    }

    const existingAlumni = DataAPI.getAlumniById(id);
    updatedData.business = existingAlumni.business;
    updatedData.licenses = existingAlumni.licenses;

    DataAPI.updateAlumni(id, updatedData);
    addActivity('Updated Alumni', updatedData.name);
    closeEditModal();
    renderAlumniTable();
    updateDashboard();
    showNotification('Alumni updated successfully! Changes will reflect on the main page.', 'success');
});

// Add Alumni Form
document.getElementById('addAlumniForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const newAlumni = {
        name: document.getElementById('addName').value,
        batch: parseInt(document.getElementById('addBatch').value),
        age: parseInt(document.getElementById('addAge').value),
        iieePosition: document.getElementById('addIieePosition').value,
        email: document.getElementById('addEmail').value,
        employmentStatus: document.getElementById('addEmploymentStatus').value,
        pastJobs: [],
        currentWork: null,
        business: null,
        licenses: []
    };

    const pastJobEntries = document.querySelectorAll('#pastJobsContainer .past-job-entry');
    pastJobEntries.forEach(entry => {
        const position = entry.querySelector('.pastJob-position').value;
        const company = entry.querySelector('.pastJob-company').value;
        const locationSelect = entry.querySelector('.pastJob-location').value;
        const customLocation = entry.querySelector('.pastJob-customLocation').value;
        const year = entry.querySelector('.pastJob-year').value;
        const achievements = entry.querySelector('.pastJob-achievements').value;
        
        if (position || company) {
            const location = locationSelect === 'Custom' ? customLocation : locationSelect;
            newAlumni.pastJobs.push({
                position,
                company,
                location,
                year,
                achievements
            });
        }
    });

    const currentPosition = document.getElementById('addCurrentPosition').value;
    if (currentPosition) {
        const locationSelect = document.getElementById('addCurrentLocation').value;
        const customLocation = document.getElementById('addCustomLocation').value;
        const location = locationSelect === 'Custom' ? customLocation : locationSelect;
        
        newAlumni.currentWork = {
            position: currentPosition,
            company: document.getElementById('addCurrentCompany').value,
            location: location,
            year: document.getElementById('addCurrentYear').value,
            achievements: document.getElementById('addCurrentAchievements').value
        };
    }

    const businessName = document.getElementById('addBusinessName').value;
    if (businessName) {
        newAlumni.business = {
            name: businessName,
            type: document.getElementById('addBusinessType').value,
            location: document.getElementById('addBusinessLocation').value,
            description: document.getElementById('addBusinessDescription').value
        };
    }

    const licenseRows = document.querySelectorAll('#licenseContainer .license-row');
    licenseRows.forEach(row => {
        const typeSelect = row.querySelector('.license-type').value;
        const customType = row.querySelector('.license-custom').value;
        const year = parseInt(row.querySelector('.license-year').value);
        
        const licenseType = typeSelect === 'Custom' ? customType : typeSelect;
        
        if (licenseType && year) {
            newAlumni.licenses.push({ type: licenseType, year });
        }
    });

    DataAPI.addAlumni(newAlumni);
    addActivity('Added New Alumni', newAlumni.name);
    
    e.target.reset();
    
    document.getElementById('pastJobsContainer').innerHTML = `
        <div class="past-job-entry">
            <div class="form-grid">
                <div class="form-group">
                    <label>Position</label>
                    <input type="text" class="pastJob-position" />
                </div>
                <div class="form-group">
                    <label>Company</label>
                    <input type="text" class="pastJob-company" />
                </div>
                <div class="form-group">
                    <label>Location</label>
                    <select class="pastJob-location" onchange="togglePastJobCustomLocation(this)">
                        <option value="">Select Location</option>
                        <option value="Local">Local</option>
                        <option value="Overseas">Overseas</option>
                        <option value="Custom">Custom Location</option>
                    </select>
                </div>
                <div class="form-group pastJob-customLocation-group" style="display: none;">
                    <label>Custom Location</label>
                    <input type="text" class="pastJob-customLocation" placeholder="Enter specific location" />
                </div>
                <div class="form-group">
                    <label>Year</label>
                    <input type="text" class="pastJob-year" placeholder="e.g., 2018-2020" />
                </div>
                <div class="form-group full-width">
                    <label>Achievements</label>
                    <textarea class="pastJob-achievements" rows="2"></textarea>
                </div>
            </div>
            <button type="button" class="btn-remove" onclick="removePastJob(this)">
                <i class="fas fa-minus"></i> Remove
            </button>
        </div>
    `;
    
    document.getElementById('licenseContainer').innerHTML = `
        <div class="license-row">
            <select class="license-type" onchange="toggleCustomLicense(this)">
                <option value="">Select License</option>
                <option value="REE">REE</option>
                <option value="RME">RME</option>
                <option value="PEE">PEE</option>
                <option value="Custom">Custom License</option>
            </select>
            <input type="text" class="license-custom" placeholder="Enter license type" style="display: none;" />
            <input type="number" class="license-year" placeholder="Year" min="2000" max="2050">
            <button type="button" class="btn-icon" onclick="addLicenseRow()" title="Add License">
                <i class="fas fa-plus"></i>
            </button>
        </div>
    `;
    
    document.getElementById('addCustomLocationGroup').style.display = 'none';

    updateDashboard();
    showNotification('Alumni added successfully! A new batch card will appear on the main page if this is a new batch year.', 'success');
});

// Add License Row
function addLicenseRow() {
    const container = document.getElementById('licenseContainer');
    const newRow = document.createElement('div');
    newRow.className = 'license-row';
    newRow.innerHTML = `
        <select class="license-type" onchange="toggleCustomLicense(this)">
            <option value="">Select License</option>
            <option value="REE">REE</option>
            <option value="RME">RME</option>
            <option value="PEE">PEE</option>
            <option value="Custom">Custom License</option>
        </select>
        <input type="text" class="license-custom" placeholder="Enter license type" style="display: none;" />
        <input type="number" class="license-year" placeholder="Year" min="2007" max="2050">
        <button type="button" class="btn-icon btn-delete" onclick="this.parentElement.remove()" title="Remove License">
            <i class="fas fa-minus"></i>
        </button>
    `;
    container.appendChild(newRow);
}

// Admin Account Management
function getAdminAccounts() {
    const accounts = localStorage.getItem('adminAccounts');
    if (!accounts) {
        const defaultAdmin = [{
            id: 1,
            username: 'admin',
            password: 'admin123',
            createdDate: new Date().toISOString()
        }];
        localStorage.setItem('adminAccounts', JSON.stringify(defaultAdmin));
        return defaultAdmin;
    }
    return JSON.parse(accounts);
}

function saveAdminAccounts(accounts) {
    localStorage.setItem('adminAccounts', JSON.stringify(accounts));
}

function loadAdminAccounts() {
    const accounts = getAdminAccounts();
    const tableBody = document.getElementById('adminAccountsBody');
    
    if (accounts.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="3" class="no-data">No admin accounts found</td></tr>';
        return;
    }
    
    tableBody.innerHTML = accounts.map(account => `
        <tr>
            <td><strong>${account.username}</strong></td>
            <td>${new Date(account.createdDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="openChangePasswordModal(${account.id})" title="Change Password">
                        <i class="fas fa-key"></i>
                    </button>
                    ${accounts.length > 1 ? `
                    <button class="btn-icon btn-delete" onclick="deleteAdminAccount(${account.id})" title="Delete Account">
                        <i class="fas fa-trash"></i>
                    </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

function openCreateAdminModal() {
    document.getElementById('createAdminModal').classList.add('active');
    document.getElementById('createAdminForm').reset();
}

function closeCreateAdminModal() {
    document.getElementById('createAdminModal').classList.remove('active');
}

function openChangePasswordModal(accountId) {
    const account = getAdminAccounts().find(a => a.id === accountId);
    if (!account) return;
    
    document.getElementById('changePasswordId').value = accountId;
    document.getElementById('changePasswordUsername').textContent = account.username;
    document.getElementById('changePasswordModal').classList.add('active');
    document.getElementById('changePasswordForm').reset();
}

function closeChangePasswordModal() {
    document.getElementById('changePasswordModal').classList.remove('active');
}

// Create Admin Account Form
document.getElementById('createAdminForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const username = document.getElementById('newAdminUsername').value.trim();
    const password = document.getElementById('newAdminPassword').value;
    const confirmPassword = document.getElementById('newAdminConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    const accounts = getAdminAccounts();
    
    if (accounts.some(acc => acc.username.toLowerCase() === username.toLowerCase())) {
        showNotification('Username already exists!', 'error');
        return;
    }
    
    const newAccount = {
        id: accounts.length > 0 ? Math.max(...accounts.map(a => a.id)) + 1 : 1,
        username: username,
        password: password,
        createdDate: new Date().toISOString()
    };
    
    accounts.push(newAccount);
    saveAdminAccounts(accounts);
    
    closeCreateAdminModal();
    loadAdminAccounts();
    showNotification(`Admin account "${username}" created successfully!`, 'success');
});

// Change Password Form
document.getElementById('changePasswordForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const accountId = parseInt(document.getElementById('changePasswordId').value);
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;
    
    const accounts = getAdminAccounts();
    const account = accounts.find(a => a.id === accountId);
    
    if (!account) {
        showNotification('Account not found!', 'error');
        return;
    }
    
    if (account.password !== currentPassword) {
        showNotification('Current password is incorrect!', 'error');
        return;
    }
    
    if (newPassword !== confirmNewPassword) {
        showNotification('New passwords do not match!', 'error');
        return;
    }
    
    if (newPassword.length < 6) {
        showNotification('Password must be at least 6 characters long!', 'error');
        return;
    }
    
    account.password = newPassword;
    saveAdminAccounts(accounts);
    
    closeChangePasswordModal();
    showNotification('Password changed successfully!', 'success');
});

function deleteAdminAccount(accountId) {
    const accounts = getAdminAccounts();
    const account = accounts.find(a => a.id === accountId);
    
    if (!account) return;
    
    if (accounts.length === 1) {
        showNotification('Cannot delete the last admin account!', 'error');
        return;
    }
    
    showConfirmation(`Are you sure you want to delete admin account "${account.username}"?`, () => {
        const updatedAccounts = accounts.filter(a => a.id !== accountId);
        saveAdminAccounts(updatedAccounts);
        loadAdminAccounts();
        showNotification('Admin account deleted successfully!', 'success');
    });
}

// Modal Close
document.querySelectorAll('.close').forEach(btn => {
    btn.addEventListener('click', () => {
        btn.closest('.modal').classList.remove('active');
    });
});

window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        e.target.classList.remove('active');
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.pastJob-location').forEach(select => {
        select.addEventListener('change', function() {
            togglePastJobCustomLocation(this);
        });
    });
    
    populateBatchFilter();
    updateDashboard();
    renderAlumniTable();
});