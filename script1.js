// ========== DOM ELEMENTS ==========

// Main DOM Elements
const decibelValue = document.getElementById('decibelValue');
const noiseStatus = document.getElementById('noiseStatus');
const indicatorFill = document.getElementById('indicatorFill');
const lastUpdated = document.getElementById('lastUpdated');
const readingsTable = document.getElementById('readingsTable');
const logoutBtn = document.getElementById('logoutBtn');
const clearReadingsBtn = document.getElementById('clearReadingsBtn');
const downloadReadingsBtn = document.getElementById('downloadReadingsBtn');
const printReadingsBtn = document.getElementById('printReadingsBtn');

// Adviser management elements
const presentCount = document.getElementById('presentCount');
const onLeaveCount = document.getElementById('onLeaveCount');
const absentCount = document.getElementById('absentCount');
const adviserNameInput = document.getElementById('adviserName');
const adviserSubjectInput = document.getElementById('adviserSubject');
const adviserNumberInput = document.getElementById('adviserNumber');
const adviserStatusSelect = document.getElementById('adviserStatus');
const addAdviserBtn = document.getElementById('addAdviserBtn');
const advisersTable = document.getElementById('advisersTable');
const smsAllBtn = document.getElementById('smsAllBtn');
const enableSmsToggle = document.getElementById('enableSms');
const smsTemplate = document.getElementById('smsTemplate');
const totalSmsSent = document.getElementById('totalSmsSent');
const activeAdvisers = document.getElementById('activeAdvisers');
const adviserSystemStatus = document.getElementById('adviserSystemStatus');
const footerSmsStatus = document.getElementById('footerSmsStatus');
const footerAdviserStatus = document.getElementById('footerAdviserStatus');

// Modal elements
const editModalOverlay = document.getElementById('editModalOverlay');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editAdviserName = document.getElementById('editAdviserName');
const editAdviserSubject = document.getElementById('editAdviserSubject');
const editAdviserNumber = document.getElementById('editAdviserNumber');
const editAdviserStatus = document.getElementById('editAdviserStatus');
const saveAdviserBtn = document.getElementById('saveAdviserBtn');

// Wall checker elements
const wallSummary = document.getElementById('wallSummary');
const concreteCount = document.getElementById('concreteCount');
const plywoodCount = document.getElementById('plywoodCount');
const noiseAdjustment = document.getElementById('noiseAdjustment');
const footerWallStatus = document.getElementById('footerWallStatus');
const wallNorthToggle = document.getElementById('wallNorthToggle');
const wallEastToggle = document.getElementById('wallEastToggle');
const wallSouthToggle = document.getElementById('wallSouthToggle');
const wallWestToggle = document.getElementById('wallWestToggle');
const setAllConcreteBtn = document.getElementById('setAllConcrete');
const setAllPlywoodBtn = document.getElementById('setAllPlywood');
const wallItems = document.querySelectorAll('.wall-item');

// System status elements
const sim800lStatus = document.getElementById('sim800lStatus');
const wallSystemStatus = document.getElementById('wallSystemStatus');

// Control buttons
const simulateQuietBtn = document.getElementById('simulateQuiet');
const simulateModerateBtn = document.getElementById('simulateModerate');
const simulateLoudBtn = document.getElementById('simulateLoud');
const autoSimulateBtn = document.getElementById('autoSimulate');
const testSmsBtn = document.getElementById('testSmsBtn');

// Sidebar elements
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContainer = document.getElementById('mainContainer');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const autoScrollStatus = document.getElementById('autoScrollStatus');
const sidebarDbValue = document.getElementById('sidebarDbValue');
const sidebarAdviserCount = document.getElementById('sidebarAdviserCount');
const readingsCount = document.getElementById('readingsCount');
const advisersBadge = document.getElementById('advisersBadge');
const wallsBadge = document.getElementById('wallsBadge');
const smsBadge = document.getElementById('smsBadge');
const quickSimButtons = document.querySelectorAll('.quick-sim-btn');

// ========== STATE VARIABLES ==========

// Dashboard state
let currentDecibels = 65;
let isAutoSimulating = false;
let autoSimulateInterval = null;
let readingsHistory = [];
let editingAdviserId = null;
let smsCooldownTimer = null;

// Adviser management state
let advisers = [];
let smsSettings = {
    enabled: true,
    totalSent: 0,
    template: "URGENT: High noise level detected in your classroom. Current level: {level} dB ({status}). Please check immediately."
};

// SMS Scheduling state
let smsCooldown = {
    enabled: true,
    hours: 1,
    minutes: 0,
    lastSmsTime: null,
    cooldownEnd: null
};

let teacherSchedules = [];
let smsSessions = [];
let editingScheduleId = null;

// Wall checker state
let wallState = {
    north: 'concrete',
    east: 'concrete',
    south: 'plywood',
    west: 'plywood'
};

// Sidebar state
let isSidebarOpen = false;
let isAutoScrollEnabled = true;
let activeSection = 'noise';

// ========== AUTHENTICATION ==========

// Check if user is logged in
function checkAuth() {
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';

    if (!hasSession) {
        alert('Please log in to access the admin dashboard');
        window.location.href = 'index.html';
        return false;
    }

    return true;
}

// ========== INITIALIZATION ==========

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;

    loadSavedState();
    updateNoiseDisplay(currentDecibels);
    updateReadingsTable();
    updateAdvisersTable();
    updateWallUI();
    initializeWallToggles();
    initializeNoiseSimulation();
    initSidebar();
    updateTime();

    setInterval(updateTime, 60000);

    console.log('Dashboard initialized successfully');
});

// ========== SIDEBAR FUNCTIONALITY ==========

// Initialize sidebar
function initSidebar() {
    console.log('Initializing sidebar');
    
    // Load sidebar state
    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState === 'open') {
        openSidebar();
    }
    
    // Load auto-scroll state
    const savedAutoScroll = localStorage.getItem('autoScrollEnabled');
    if (savedAutoScroll !== null) {
        isAutoScrollEnabled = savedAutoScroll === 'true';
        updateAutoScrollUI();
    }
    
    // Add event listeners
    sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Add click event to sidebar links
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            navigateToSection(section);
            setActiveSidebarLink(this);
        });
    });
    
    // Add event listeners to quick simulation buttons
    quickSimButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const level = this.dataset.level;
            triggerQuickSimulation(level);
        });
    });
    
    // Initialize Intersection Observer for auto-scroll
    initAutoScrollObserver();
    
    // Update sidebar badges
    updateSidebarBadges();
    
    console.log('Sidebar initialized');
}

// Toggle sidebar
function toggleSidebar() {
    if (isSidebarOpen) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

function openSidebar() {
    sidebar.classList.add('active');
    mainContainer.classList.add('sidebar-active');
    sidebarToggle.innerHTML = '<i class="fas fa-times"></i>';
    isSidebarOpen = true;
    localStorage.setItem('sidebarState', 'open');
}

function closeSidebar() {
    sidebar.classList.remove('active');
    mainContainer.classList.remove('sidebar-active');
    sidebarToggle.innerHTML = '<i class="fas fa-bars"></i>';
    isSidebarOpen = false;
    localStorage.setItem('sidebarState', 'closed');
}

// Navigate to section
function navigateToSection(section) {
    console.log(`Navigating to section: ${section}`);
    
    // Disable auto-scroll temporarily during manual navigation
    const wasAutoScrollEnabled = isAutoScrollEnabled;
    if (wasAutoScrollEnabled) {
        isAutoScrollEnabled = false;
        updateAutoScrollUI();
    }
    
    switch(section) {
        case 'noise':
            scrollToElement('current-noise-level');
            break;
        case 'readings':
            scrollToElement('recent-readings');
            break;
        case 'controls':
            scrollToElement('system-controls');
            break;
        case 'advisers':
            scrollToElement('adviser-management');
            break;
        case 'walls':
            scrollToElement('wall-checker');
            break;
        case 'sms':
            scrollToElement('sms-config');
            break;
        case 'export':
            downloadReadingsAsText();
            break;
        case 'simulation':
            // Toggle auto simulation
            if (!isAutoSimulating) {
                autoSimulateBtn.click();
            }
            break;
        case 'reports':
            printReadingsReport();
            break;
    }
    
    // Re-enable auto-scroll after 2 seconds
    if (wasAutoScrollEnabled) {
        setTimeout(() => {
            isAutoScrollEnabled = true;
            updateAutoScrollUI();
        }, 2000);
    }
}

// Trigger quick simulation from sidebar
function triggerQuickSimulation(level) {
    if (isAutoSimulating) {
        console.log('Auto simulation is running, ignoring quick sim');
        return;
    }
    
    let decibels;
    switch(level) {
        case 'quiet':
            decibels = getRandomDecibels(40, 59);
            break;
        case 'moderate':
            decibels = getRandomDecibels(60, 80);
            break;
        case 'loud':
            decibels = getRandomDecibels(81, 100);
            break;
        default:
            decibels = getRandomDecibels(60, 80);
    }
    
    console.log(`Quick simulation: ${level} (${decibels} dB)`);
    updateNoiseDisplay(decibels);
}

// Scroll to element smoothly
function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Set active sidebar link
function setActiveSidebarLink(linkElement) {
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    linkElement.classList.add('active');
    activeSection = linkElement.dataset.section;
}

// Initialize auto-scroll observer
function initAutoScrollObserver() {
    const sections = [
        { id: 'current-noise-level', section: 'noise' },
        { id: 'adviser-management', section: 'advisers' },
        { id: 'wall-checker', section: 'walls' },
        { id: 'recent-readings', section: 'readings' },
        { id: 'system-controls', section: 'controls' }
    ];
    
    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };
    
    const observer = new IntersectionObserver((entries) => {
        if (!isAutoScrollEnabled) return;
        
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const observedSection = sections.find(s => s.id === entry.target.id);
                if (observedSection && observedSection.section !== activeSection) {
                    activeSection = observedSection.section;
                    updateActiveSidebarLink(observedSection.section);
                }
            }
        });
    }, observerOptions);
    
    // Observe all sections
    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            observer.observe(element);
        }
    });
}

// Update active sidebar link based on section
function updateActiveSidebarLink(section) {
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });
}

// Update auto-scroll UI
function updateAutoScrollUI() {
    if (isAutoScrollEnabled) {
        autoScrollStatus.textContent = 'ON';
        autoScrollStatus.style.color = '#2ea043';
    } else {
        autoScrollStatus.textContent = 'OFF';
        autoScrollStatus.style.color = '#8b949e';
    }
    localStorage.setItem('autoScrollEnabled', isAutoScrollEnabled.toString());
}

// Update sidebar badges
function updateSidebarBadges() {
    // Update readings count
    readingsCount.textContent = readingsHistory.length;
    
    // Update adviser count
    const presentAdvisers = advisers.filter(a => a.status === 'present').length;
    advisersBadge.textContent = presentAdvisers;
    sidebarAdviserCount.textContent = presentAdvisers;
    
    // Update wall composition
    const concreteWalls = Object.values(wallState).filter(type => type === 'concrete').length;
    const plywoodWalls = 4 - concreteWalls;
    wallsBadge.textContent = `${concreteWalls}C/${plywoodWalls}P`;
    
    // Update SMS status
    smsBadge.textContent = smsSettings.enabled ? 'ON' : 'OFF';
    smsBadge.style.color = smsSettings.enabled ? '#2ea043' : '#8b949e';
}

// Update sidebar noise value
function updateSidebarNoiseValue(decibels, status) {
    sidebarDbValue.textContent = `${decibels} dB`;
    
    // Update color based on status
    sidebarDbValue.className = 'sidebar-stat-value';
    if (status === 'Quiet') {
        sidebarDbValue.classList.add('color-quiet');
    } else if (status === 'Moderate') {
        sidebarDbValue.classList.add('color-moderate');
    } else {
        sidebarDbValue.classList.add('color-loud');
    }
}

// ========== NOISE MONITORING ==========

// Update time display
function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateString = now.toLocaleDateString();
    lastUpdated.textContent = `${dateString} ${timeString}`;
}

// Update noise display based on decibel level
function updateNoiseDisplay(decibels) {
    console.log(`Updating noise display with: ${decibels} dB`);

    currentDecibels = decibels;

    // Apply wall material adjustments
    const measuredDecibels = applyWallAdjustments(decibels);
    console.log(`After wall adjustments: ${measuredDecibels} dB`);

    // Update the numeric display with ADJUSTED reading
    decibelValue.textContent = `${measuredDecibels} dB`;

    // Determine status and color based on ADJUSTED reading
    let status = '';
    let colorClass = '';
    let shouldSendSms = false;

    if (measuredDecibels < 60) {
        status = 'Quiet';
        colorClass = 'quiet';
        shouldSendSms = false;
    } else if (measuredDecibels <= 80) {
        status = 'Moderate';
        colorClass = 'moderate';
        shouldSendSms = false;
    } else {
        status = 'Loud';
        colorClass = 'loud';
        shouldSendSms = true;
    }

    console.log(`Status: ${status}, Color: ${colorClass}, Send SMS: ${shouldSendSms}`);

    // Apply colors
    decibelValue.className = 'decibel-value color-' + colorClass;
    noiseStatus.className = 'noise-status color-' + colorClass;
    noiseStatus.textContent = status;

    // Update indicator bar
    let fillPercentage = ((measuredDecibels - 40) / 60) * 100;
    if (fillPercentage < 0) fillPercentage = 0;
    if (fillPercentage > 100) fillPercentage = 100;

    indicatorFill.style.width = `${fillPercentage}%`;
    indicatorFill.className = 'indicator-fill bg-' + colorClass;

    // Update sidebar noise value
    updateSidebarNoiseValue(measuredDecibels, status);

    // Check if we should send SMS
    let smsStatusText = 'Not Sent';
    let smsRecipients = [];
    let sessionInfo = '';

    if (shouldSendSms && smsSettings.enabled) {
        const presentAdvisers = advisers.filter(a => a.status === 'present');
        if (presentAdvisers.length > 0) {
            // Check cooldown first
            if (smsCooldown.enabled && isOnCooldown()) {
                smsStatusText = 'On Cooldown';
                sessionInfo = 'System on cooldown';
            } else {
                // Filter by schedule
                const scheduledAdvisers = presentAdvisers.filter(adviser =>
                    isTeacherScheduled(adviser.id)
                );

                if (scheduledAdvisers.length > 0) {
                    smsRecipients = scheduledAdvisers.map(a => a.name);
                    const smsResult = sendSMS(measuredDecibels, status, scheduledAdvisers.map(a => a.name));
                    smsStatusText = smsResult ? 'Sent' : 'Failed';
                    sessionInfo = smsResult ? `${scheduledAdvisers.length} advisers notified` : 'Send failed';
                } else {
                    smsStatusText = 'No Scheduled Advisers';
                    sessionInfo = 'No advisers scheduled for current time';
                }
            }
        } else {
            smsStatusText = 'No Active Advisers';
            sessionInfo = 'No present advisers';
        }
    } else if (!smsSettings.enabled) {
        smsStatusText = 'Disabled';
        sessionInfo = 'SMS disabled';
    }

    // Update reading history with session info
    addToHistory(decibels, measuredDecibels, status, smsStatusText, smsRecipients, sessionInfo);
    saveState();
}

// Apply wall material adjustments
function applyWallAdjustments(originalDecibels) {
    let concreteWalls = 0;
    let plywoodWalls = 0;

    Object.values(wallState).forEach(type => {
        if (type === 'concrete') concreteWalls++;
        else plywoodWalls++;
    });

    // CORRECTED: For noise generated INSIDE the classroom:
    // Concrete walls: keep noise in → higher reading
    // Plywood walls: noise escapes → lower reading

    const concreteRetention = 0.8; // 80% of noise stays in concrete room
    const plywoodRetention = 0.4; // 40% of noise stays in plywood room

    const totalWalls = 4;
    const averageRetention = (concreteWalls * concreteRetention + plywoodWalls * plywoodRetention) / totalWalls;

    // Apply retention factor to get measured noise INSIDE the classroom
    const measuredDecibels = originalDecibels * averageRetention;

    // Add ambient noise (10 dB base level)
    const ambientNoise = 10;
    const finalReading = Math.round(measuredDecibels + ambientNoise);

    // Clamp between 0 and 120 dB
    return Math.max(0, Math.min(120, finalReading));
}

// Generate random decibel value
function getRandomDecibels(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Add reading to history
function addToHistory(originalDecibels, measuredDecibels, status, smsStatus, recipients = [], sessionInfo = '') {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second:'2-digit'});

    const reading = {
        time: timeString,
        originalDecibels: originalDecibels,
        measuredDecibels: measuredDecibels,
        status: status,
        smsStatus: smsStatus,
        recipients: recipients,
        sessionInfo: sessionInfo,
        wallComposition: `${concreteCount.textContent}C/${plywoodCount.textContent}P`
    };

    readingsHistory.unshift(reading);
    if (readingsHistory.length > 10) readingsHistory.pop();
    updateReadingsTable();
    updateSidebarBadges();
}

// Update readings table
function updateReadingsTable() {
    readingsTable.innerHTML = '';

    if (readingsHistory.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="7" style="text-align: center; color: #8b949e;">
                No readings yet. Use the controls to simulate noise levels.
            </td>
        `;
        readingsTable.appendChild(row);
        return;
    }

    readingsHistory.forEach(reading => {
        const row = document.createElement('tr');

        const statusClass = reading.status.toLowerCase();
        const statusBadge = `<span class="status-badge ${statusClass}">${reading.status}</span>`;

        let smsBadgeClass = '';
        if (reading.smsStatus === 'Sent') smsBadgeClass = 'sent';
        else if (reading.smsStatus === 'Failed') smsBadgeClass = 'not-sent';
        else smsBadgeClass = 'disabled';

        const smsBadge = `<span class="sms-badge ${smsBadgeClass}">${reading.smsStatus}</span>`;

        const adjustment = reading.measuredDecibels - reading.originalDecibels;
        const arrow = adjustment > 0 ? '↑' : (adjustment < 0 ? '↓' : '→');
        const arrowClass = adjustment > 0 ? 'higher' : (adjustment < 0 ? 'lower' : '');

        const recipientsText = reading.recipients.length > 0
            ? reading.recipients.slice(0, 2).join(', ') + (reading.recipients.length > 2 ? '...' : '')
            : 'None';

        row.innerHTML = `
            <td>${reading.time}</td>
            <td>${reading.originalDecibels} dB</td>
            <td class="adjusted-reading ${arrowClass}">
                ${reading.measuredDecibels} dB
                <span class="adjustment-arrow">${arrow}</span>
            </td>
            <td>${statusBadge}</td>
            <td>${smsBadge}</td>
            <td class="session-info">
                <div class="sms-recipients" title="${reading.recipients.join(', ')}">
                    ${recipientsText}
                </div>
                ${reading.sessionInfo ? `<div class="session-cooldown">${reading.sessionInfo}</div>` : ''}
            </td>
        `;

        readingsTable.appendChild(row);
    });
}

// ========== ADVISER MANAGEMENT ==========

// Update advisers table
function updateAdvisersTable() {
    advisersTable.innerHTML = '';

    if (advisers.length === 0) {
        const row = document.createElement('tr');
        row.className = 'empty-row';
        row.innerHTML = `
            <td colspan="5" class="empty-message">
                <i class="fas fa-user-slash"></i>
                No advisers added yet. Add your first adviser above.
            </td>
        `;
        advisersTable.appendChild(row);
        return;
    }

    // Update counts
    const present = advisers.filter(a => a.status === 'present').length;
    const onLeave = advisers.filter(a => a.status === 'on-leave').length;
    const absent = advisers.filter(a => a.status === 'absent').length;

    presentCount.textContent = present;
    onLeaveCount.textContent = onLeave;
    absentCount.textContent = absent;
    activeAdvisers.textContent = present;

    // Update footer
    footerAdviserStatus.textContent = `${present} Present`;
    adviserSystemStatus.textContent = present > 0 ? 'Active' : 'No Active Advisers';
    adviserSystemStatus.className = present > 0 ? 'status-value' : 'status-value warning';

    // Update sidebar
    updateSidebarBadges();

    // Populate table
    advisers.forEach(adviser => {
        const row = document.createElement('tr');
        row.dataset.id = adviser.id;

        row.innerHTML = `
            <td>${adviser.name}</td>
            <td>${adviser.subject}</td>
            <td>${adviser.number}</td>
            <td><span class="adviser-status ${adviser.status}">${adviser.status.charAt(0).toUpperCase() + adviser.status.slice(1)}</span></td>
            <td class="adviser-actions">
                <button class="btn-edit" data-id="${adviser.id}">
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" data-id="${adviser.id}">
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;

        advisersTable.appendChild(row);
    });

    // Add event listeners to action buttons
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            openEditModal(id);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            deleteAdviser(id);
        });
    });
}

// Add new adviser
addAdviserBtn.addEventListener('click', function() {
    const name = adviserNameInput.value.trim();
    const subject = adviserSubjectInput.value.trim();
    const number = adviserNumberInput.value.trim();
    const status = adviserStatusSelect.value;

    if (!name || !subject || !number) {
        alert('Please fill in all fields');
        return;
    }

    const newAdviser = {
        id: Date.now(),
        name,
        subject,
        number,
        status
    };

    advisers.push(newAdviser);
    saveAdvisers();
    updateAdvisersTable();
    updateTeacherDropdown();

    // Clear form
    adviserNameInput.value = '';
    adviserSubjectInput.value = '';
    adviserNumberInput.value = '';
    adviserStatusSelect.value = 'present';

    adviserNameInput.focus();

    alert('Adviser added successfully!');
});

// Open edit modal
function openEditModal(id) {
    const adviser = advisers.find(a => a.id === id);
    if (!adviser) return;

    editingAdviserId = id;
    editAdviserName.value = adviser.name;
    editAdviserSubject.value = adviser.subject;
    editAdviserNumber.value = adviser.number;
    editAdviserStatus.value = adviser.status;

    editModalOverlay.classList.add('active');
}

// Close edit modal
function closeEditModalFunc() {
    editModalOverlay.classList.remove('active');
    editingAdviserId = null;
    editAdviserName.value = '';
    editAdviserSubject.value = '';
    editAdviserNumber.value = '';
    editAdviserStatus.value = 'present';
}

// Save edited adviser
saveAdviserBtn.addEventListener('click', function() {
    if (!editingAdviserId) return;

    const adviserIndex = advisers.findIndex(a => a.id === editingAdviserId);
    if (adviserIndex === -1) return;

    advisers[adviserIndex] = {
        ...advisers[adviserIndex],
        name: editAdviserName.value.trim(),
        subject: editAdviserSubject.value.trim(),
        number: editAdviserNumber.value.trim(),
        status: editAdviserStatus.value
    };

    saveAdvisers();
    updateAdvisersTable();
    updateTeacherDropdown();
    closeEditModalFunc();
    alert('Adviser updated successfully!');
});

// Delete adviser
function deleteAdviser(id) {
    if (!confirm('Are you sure you want to delete this adviser?')) return;

    // Remove adviser
    advisers = advisers.filter(a => a.id !== id);

    // Remove schedules for this adviser
    teacherSchedules = teacherSchedules.filter(schedule => schedule.teacherId !== id);

    saveAdvisers();
    saveSchedules();
    updateAdvisersTable();
    updateTeacherDropdown();
    updateSchedulesTable();
    updateActiveTeachers();
    alert('Adviser deleted successfully!');
}

// ========== SMS SYSTEM ==========

// Send SMS to advisers
function sendSMS(decibels, status, recipients) {
    if (!recipients || recipients.length === 0) return false;

    // Check cooldown
    if (smsCooldown.enabled && isOnCooldown()) {
        console.log('SMS blocked: System is on cooldown');
        return false;
    }

    // Filter recipients by schedule and status
    const validRecipients = recipients.filter(recipient => {
        const adviser = advisers.find(a => a.name === recipient);
        if (!adviser || adviser.status !== 'present') return false;

        // Check if adviser is scheduled for current time
        return isTeacherScheduled(adviser.id);
    });

    if (validRecipients.length === 0) {
        console.log('SMS blocked: No valid recipients (not scheduled or not present)');
        return false;
    }

    const success = Math.random() < 0.9;

    if (success) {
        // Update SMS stats
        smsSettings.totalSent += validRecipients.length;
        totalSmsSent.textContent = smsSettings.totalSent;

        // Set cooldown
        if (smsCooldown.enabled) {
            setCooldown();
        }

        // Log SMS session
        logSmsSession(decibels, status, validRecipients);

        // Save settings
        saveSmsSettings();
        saveCooldownSettings();
        saveSmsSessions();

        console.log(`SMS sent to ${validRecipients.length} scheduled/present advisers: "${validRecipients.join(', ')}"`);
        return true;
    }

    return false;
}

// Check if system is on cooldown
function isOnCooldown() {
    if (!smsCooldown.lastSmsTime || !smsCooldown.cooldownEnd) return false;

    const now = new Date();
    const cooldownEnd = new Date(smsCooldown.cooldownEnd);

    return now < cooldownEnd;
}

// Set cooldown after SMS
function setCooldown() {
    const now = new Date();
    smsCooldown.lastSmsTime = now.toISOString();

    // Calculate cooldown end time
    const cooldownMs = (smsCooldown.hours * 60 + smsCooldown.minutes) * 60 * 1000;
    const cooldownEnd = new Date(now.getTime() + cooldownMs);
    smsCooldown.cooldownEnd = cooldownEnd.toISOString();

    updateCooldownUI();
}

// Check if adviser is scheduled for current time
function isTeacherScheduled(adviserId) {
    const now = new Date();
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

    const adviserSchedule = teacherSchedules.find(schedule =>
        schedule.teacherId === adviserId &&
        schedule.day === currentDay &&
        schedule.isActive === true
    );

    if (!adviserSchedule) return false;

    // Check if current time is within schedule
    return currentTime >= adviserSchedule.startTime && currentTime <= adviserSchedule.endTime;
}

// Update SMS settings UI
function updateSmsSettingsUI() {
    enableSmsToggle.checked = smsSettings.enabled;
    smsTemplate.value = smsSettings.template;
    totalSmsSent.textContent = smsSettings.totalSent;

    // Update footer
    footerSmsStatus.textContent = smsSettings.enabled ? 'Enabled' : 'Disabled';
    footerSmsStatus.className = smsSettings.enabled ? 'status-active' : 'status-value warning';

    // Update sidebar
    updateSidebarBadges();
}

// Enable SMS toggle
enableSmsToggle.addEventListener('change', function() {
    smsSettings.enabled = this.checked;
    saveSmsSettings();
    updateSmsSettingsUI();
});

// SMS template change
smsTemplate.addEventListener('change', function() {
    smsSettings.template = this.value;
    saveSmsSettings();
});

// Broadcast SMS to all present advisers
smsAllBtn.addEventListener('click', function() {
    const presentAdvisers = advisers.filter(a => a.status === 'present');
    if (presentAdvisers.length === 0) {
        alert('No present advisers to send SMS to');
        return;
    }

    if (confirm(`Send test SMS to ${presentAdvisers.length} present adviser(s)?`)) {
        const success = sendSMS(85, 'Loud (Test)', presentAdvisers.map(a => a.name));
        if (success) {
            alert(`Test SMS sent to ${presentAdvisers.length} adviser(s)!`);
        } else {
            alert('Failed to send test SMS. Please try again.');
        }
    }
});

// Update cooldown UI
function updateCooldownUI() {
    // Start auto-update for cooldown timer
    startCooldownTimer();
}

// Start auto-update timer for cooldown
function startCooldownTimer() {
    if (smsCooldownTimer) clearInterval(smsCooldownTimer);

    smsCooldownTimer = setInterval(() => {
        if (isOnCooldown()) {
            updateCooldownUI();
        } else {
            clearInterval(smsCooldownTimer);
        }
    }, 60000);
}

// Log SMS session
function logSmsSession(decibels, status, recipients) {
    const session = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        decibels: decibels,
        status: status,
        recipients: recipients,
        recipientCount: recipients.length
    };

    smsSessions.unshift(session);

    // Keep only last 20 sessions
    if (smsSessions.length > 20) {
        smsSessions.pop();
    }

    updateSmsLog();
}

// ========== WALL CHECKER ==========

// Update wall UI
function updateWallUI() {
    console.log('Updating wall UI with state:', wallState);

    // Update wall visual classes
    wallItems.forEach(item => {
        const side = item.dataset.side;
        const wallType = wallState[side];
        item.className = `wall-item wall-${side} ${wallType}`;

        // Update toggle container visual
        const toggleContainer = item.querySelector('.wall-toggle-container');
        if (toggleContainer) {
            const labels = toggleContainer.querySelectorAll('.wall-type-label');
            if (labels.length >= 2) {
                labels[0].style.color = wallType === 'concrete' ? '#fff' : '#8b949e';
                labels[1].style.color = wallType === 'plywood' ? '#fff' : '#8b949e';
            }
        }
    });

    // Update counts and summary
    let concreteWalls = 0;
    let plywoodWalls = 0;

    Object.values(wallState).forEach(type => {
        if (type === 'concrete') concreteWalls++;
        else plywoodWalls++;
    });

    concreteCount.textContent = concreteWalls;
    plywoodCount.textContent = plywoodWalls;
    wallSummary.textContent = `${concreteWalls} Concrete, ${plywoodWalls} Plywood`;

    // Update footer status
    let footerStatus = 'Mixed';
    if (concreteWalls === 4) footerStatus = 'All Concrete';
    else if (plywoodWalls === 4) footerStatus = 'All Plywood';
    else if (concreteWalls > plywoodWalls) footerStatus = 'Mostly Concrete';
    else if (plywoodWalls > concreteWalls) footerStatus = 'Mostly Plywood';

    footerWallStatus.textContent = footerStatus;
    wallSystemStatus.textContent = 'Configured';

    // Update noise adjustment rating
    let adjustmentRating = 'Medium';
    if (concreteWalls === 4) adjustmentRating = 'High (Increases readings)';
    else if (plywoodWalls === 4) adjustmentRating = 'Low (Decreases readings)';
    else if (concreteWalls >= 3) adjustmentRating = 'Medium-High';
    else if (plywoodWalls >= 3) adjustmentRating = 'Medium-Low';

    noiseAdjustment.textContent = adjustmentRating;

    // Update sidebar
    updateSidebarBadges();

    console.log(`Wall composition: ${concreteWalls} concrete, ${plywoodWalls} plywood`);
}

// Initialize wall toggle event listeners
function initializeWallToggles() {
    console.log('Initializing wall toggles');

    // Update toggle states based on wallState
    wallNorthToggle.checked = wallState.north === 'plywood';
    wallEastToggle.checked = wallState.east === 'plywood';
    wallSouthToggle.checked = wallState.south === 'plywood';
    wallWestToggle.checked = wallState.west === 'plywood';

    // Add fresh event listeners
    wallNorthToggle.addEventListener('change', function() {
        console.log('North wall toggle changed');
        wallState.north = this.checked ? 'plywood' : 'concrete';
        updateWallUI();
        saveWallState();
    });

    wallEastToggle.addEventListener('change', function() {
        console.log('East wall toggle changed');
        wallState.east = this.checked ? 'plywood' : 'concrete';
        updateWallUI();
        saveWallState();
    });

    wallSouthToggle.addEventListener('change', function() {
        console.log('South wall toggle changed');
        wallState.south = this.checked ? 'plywood' : 'concrete';
        updateWallUI();
        saveWallState();
    });

    wallWestToggle.addEventListener('change', function() {
        console.log('West wall toggle changed');
        wallState.west = this.checked ? 'plywood' : 'concrete';
        updateWallUI();
        saveWallState();
    });

    // Set all concrete/plywood
    setAllConcreteBtn.addEventListener('click', function() {
        console.log('Setting all walls to concrete');
        wallState.north = 'concrete';
        wallState.east = 'concrete';
        wallState.south = 'concrete';
        wallState.west = 'concrete';
        updateWallUI();
        saveWallState();
    });

    setAllPlywoodBtn.addEventListener('click', function() {
        console.log('Setting all walls to plywood');
        wallState.north = 'plywood';
        wallState.east = 'plywood';
        wallState.south = 'plywood';
        wallState.west = 'plywood';
        updateWallUI();
        saveWallState();
    });
}

// ========== SIMULATION CONTROLS ==========

// Initialize noise simulation event listeners
function initializeNoiseSimulation() {
    console.log('Initializing noise simulation buttons');

    // Add fresh event listeners
    simulateQuietBtn.addEventListener('click', function(e) {
        console.log('Quiet simulation clicked');
        e.stopPropagation();
        if (isAutoSimulating) {
            console.log('Auto simulation is running, ignoring manual click');
            return;
        }
        const quietDecibels = getRandomDecibels(40, 59);
        console.log(`Generated quiet decibels: ${quietDecibels}`);
        updateNoiseDisplay(quietDecibels);
    });

    simulateModerateBtn.addEventListener('click', function(e) {
        console.log('Moderate simulation clicked');
        e.stopPropagation();
        if (isAutoSimulating) {
            console.log('Auto simulation is running, ignoring manual click');
            return;
        }
        const moderateDecibels = getRandomDecibels(60, 80);
        console.log(`Generated moderate decibels: ${moderateDecibels}`);
        updateNoiseDisplay(moderateDecibels);
    });

    simulateLoudBtn.addEventListener('click', function(e) {
        console.log('Loud simulation clicked');
        e.stopPropagation();
        if (isAutoSimulating) {
            console.log('Auto simulation is running, ignoring manual click');
            return;
        }
        const loudDecibels = getRandomDecibels(81, 100);
        console.log(`Generated loud decibels: ${loudDecibels}`);
        updateNoiseDisplay(loudDecibels);
    });

    autoSimulateBtn.addEventListener('click', function(e) {
        console.log('Auto simulate clicked');
        e.stopPropagation();
        if (!isAutoSimulating) {
            isAutoSimulating = true;
            autoSimulateBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Auto Simulate';
            autoSimulateBtn.classList.add('active');

            console.log('Starting auto simulation');
            autoSimulateInterval = setInterval(function() {
                const rand = Math.random();
                let newDecibels;

                if (rand < 0.4) {
                    newDecibels = getRandomDecibels(40, 59);
                } else if (rand < 0.8) {
                    newDecibels = getRandomDecibels(60, 80);
                } else {
                    newDecibels = getRandomDecibels(81, 100);
                }

                console.log(`Auto simulation: ${newDecibels} dB`);
                updateNoiseDisplay(newDecibels);
            }, 3000);
        } else {
            isAutoSimulating = false;
            clearInterval(autoSimulateInterval);
            autoSimulateBtn.innerHTML = '<i class="fas fa-play"></i> Auto Simulate';
            autoSimulateBtn.classList.remove('active');
            console.log('Stopped auto simulation');
        }
    });
}

// ========== DATA EXPORT ==========

// Download readings as text file
function downloadReadingsAsText() {
    if (readingsHistory.length === 0) {
        alert('No readings to download');
        return;
    }

    let text = 'NOISE MONITORING SYSTEM - READINGS REPORT\n';
    text += '===========================================\n\n';

    // System Information
    const now = new Date();
    text += `Report Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n`;
    text += `Current System Status: ${adviserSystemStatus.textContent}\n`;
    text += `Active Advisers: ${presentCount.textContent}\n`;
    text += `Wall Composition: ${concreteCount.textContent} Concrete, ${plywoodCount.textContent} Plywood\n`;
    text += `SMS Notifications: ${smsSettings.enabled ? 'Enabled' : 'Disabled'}\n`;
    text += `Total SMS Sent: ${totalSmsSent.textContent}\n\n`;
    text += '='.repeat(50) + '\n\n';

    // Readings Data
    text += 'RECENT READINGS\n';
    text += '='.repeat(50) + '\n';
    text += 'Time\t\tSource dB\tMeasured dB\tStatus\t\tSMS Status\tRecipients\n';
    text += '─'.repeat(100) + '\n';

    readingsHistory.forEach((reading, index) => {
        const time = reading.time.padEnd(10, ' ');
        const source = `${reading.originalDecibels} dB`.padEnd(12, ' ');
        const measured = `${reading.measuredDecibels} dB`.padEnd(14, ' ');
        const status = reading.status.padEnd(12, ' ');
        const sms = reading.smsStatus.padEnd(12, ' ');
        const recipients = reading.recipients.length > 0
            ? reading.recipients.join(', ')
            : 'None';

        text += `${time}\t${source}\t${measured}\t${status}\t${sms}\t${recipients}\n`;

        // Add session info if available
        if (reading.sessionInfo) {
            text += `\t Session: ${reading.sessionInfo}\n`;
        }

        // Add separator every 3 readings
        if ((index + 1) % 3 === 0 && index !== readingsHistory.length - 1) {
            text += '─'.repeat(100) + '\n';
        }
    });

    text += '\n' + '='.repeat(50) + '\n\n';

    // Summary Statistics
    text += 'SUMMARY STATISTICS\n';
    text += '='.repeat(50) + '\n';

    const quietReadings = readingsHistory.filter(r => r.status === 'Quiet').length;
    const moderateReadings = readingsHistory.filter(r => r.status === 'Moderate').length;
    const loudReadings = readingsHistory.filter(r => r.status === 'Loud').length;

    const smsSent = readingsHistory.filter(r => r.smsStatus === 'Sent').length;
    const smsFailed = readingsHistory.filter(r => r.smsStatus === 'Failed').length;
    const smsOnCooldown = readingsHistory.filter(r => r.smsStatus === 'On Cooldown').length;

    text += `Total Readings: ${readingsHistory.length}\n`;
    text += `Quiet Readings: ${quietReadings} (${Math.round((quietReadings / readingsHistory.length) * 100)}%)\n`;
    text += `Moderate Readings: ${moderateReadings} (${Math.round((moderateReadings / readingsHistory.length) * 100)}%)\n`;
    text += `Loud Readings: ${loudReadings} (${Math.round((loudReadings / readingsHistory.length) * 100)}%)\n\n`;

    text += `SMS Sent Successfully: ${smsSent}\n`;
    text += `SMS Failed: ${smsFailed}\n`;
    text += `SMS Blocked (Cooldown): ${smsOnCooldown}\n`;

    // Calculate averages
    const avgOriginal = readingsHistory.reduce((sum, r) => sum + r.originalDecibels, 0) / readingsHistory.length;
    const avgMeasured = readingsHistory.reduce((sum, r) => sum + r.measuredDecibels, 0) / readingsHistory.length;
    const avgAdjustment = readingsHistory.reduce((sum, r) => sum + (r.measuredDecibels - r.originalDecibels), 0) / readingsHistory.length;

    text += `\nAverage Source dB: ${avgOriginal.toFixed(2)}\n`;
    text += `Average Measured dB: ${avgMeasured.toFixed(2)}\n`;
    text += `Average Wall Adjustment: ${avgAdjustment.toFixed(2)} dB\n`;

    text += '\n' + '='.repeat(50) + '\n';
    text += 'END OF REPORT\n';

    // Create and download file
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const timestamp = now.toISOString().slice(0, 19).replace(/:/g, '-');
    a.href = url;
    a.download = `noise_readings_${timestamp}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    alert('Report downloaded successfully!');
}

// Print readings report
function printReadingsReport() {
    if (readingsHistory.length === 0) {
        alert('No readings to print');
        return;
    }

    const now = new Date();
    const printWindow = window.open('', '_blank');

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Noise Monitoring System - Readings Report</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    margin: 20px;
                    color: #333;
                }
                .header {
                    text-align: center;
                    margin-bottom: 30px;
                    border-bottom: 2px solid #333;
                    padding-bottom: 15px;
                }
                .header h1 {
                    color: #2c3e50;
                    margin: 0 0 10px 0;
                }
                .header .subtitle {
                    color: #7f8c8d;
                    font-size: 14px;
                }
                .section {
                    margin-bottom: 25px;
                }
                .section h2 {
                    color: #34495e;
                    border-bottom: 1px solid #ddd;
                    padding-bottom: 5px;
                    margin-bottom: 15px;
                }
                .info-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 15px;
                    margin-bottom: 20px;
                }
                .info-item {
                    background: #f8f9fa;
                    padding: 12px;
                    border-radius: 5px;
                    border-left: 4px solid #3498db;
                }
                .info-item strong {
                    color: #2c3e50;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                    margin: 20px 0;
                    font-size: 14px;
                }
                th {
                    background-color: #34495e;
                    color: white;
                    padding: 10px;
                    text-align: left;
                    border: 1px solid #ddd;
                }
                td {
                    padding: 10px;
                    border: 1px solid #ddd;
                }
                tr:nth-child(even) {
                    background-color: #f9f9f9;
                }
                .status-quiet { color: #27ae60; }
                .status-moderate { color: #f39c12; }
                .status-loud { color: #e74c3c; }
                .sms-sent { color: #27ae60; }
                .sms-failed { color: #e74c3c; }
                .sms-cooldown { color: #f39c12; }
                .summary {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 15px;
                    margin-top: 20px;
                }
                .summary-item {
                    text-align: center;
                    padding: 15px;
                    border-radius: 8px;
                    color: white;
                }
                .summary-quiet { background-color: #27ae60; }
                .summary-moderate { background-color: #f39c12; }
                .summary-loud { background-color: #e74c3c; }
                .footer {
                    margin-top: 30px;
                    padding-top: 15px;
                    border-top: 1px solid #ddd;
                    text-align: center;
                    color: #7f8c8d;
                    font-size: 12px;
                }
                @media print {
                    body { margin: 0; }
                    .no-print { display: none; }
                    @page { margin: 1cm; }
                }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Noise Monitoring System</h1>
                <div class="subtitle">Readings Report</div>
                <div>Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>
            </div>

            <div class="section">
                <h2>System Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>System Status:</strong> ${adviserSystemStatus.textContent}
                    </div>
                    <div class="info-item">
                        <strong>Active Advisers:</strong> ${presentCount.textContent} Present
                    </div>
                    <div class="info-item">
                        <strong>Wall Composition:</strong> ${concreteCount.textContent} Concrete, ${plywoodCount.textContent} Plywood
                    </div>
                    <div class="info-item">
                        <strong>SMS Notifications:</strong> ${smsSettings.enabled ? 'Enabled' : 'Disabled'}
                    </div>
                    <div class="info-item">
                        <strong>Total SMS Sent:</strong> ${totalSmsSent.textContent}
                    </div>
                    <div class="info-item">
                        <strong>Noise Adjustment:</strong> ${noiseAdjustment.textContent}
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Recent Readings (${readingsHistory.length} records)</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Source dB</th>
                            <th>Measured dB</th>
                            <th>Status</th>
                            <th>SMS Status</th>
                            <th>Recipients</th>
                        </tr>
                    </thead>
                    <tbody>
    `;

    readingsHistory.forEach(reading => {
        const statusClass = `status-${reading.status.toLowerCase()}`;
        let smsClass = '';
        if (reading.smsStatus === 'Sent') smsClass = 'sms-sent';
        else if (reading.smsStatus === 'Failed') smsClass = 'sms-failed';
        else if (reading.smsStatus === 'On Cooldown') smsClass = 'sms-cooldown';

        html += `
            <tr>
                <td>${reading.time}</td>
                <td>${reading.originalDecibels} dB</td>
                <td>${reading.measuredDecibels} dB</td>
                <td class="${statusClass}">${reading.status}</td>
                <td class="${smsClass}">${reading.smsStatus}</td>
                <td>${reading.recipients.length > 0 ? reading.recipients.join(', ') : 'None'}</td>
            </tr>
        `;

        if (reading.sessionInfo) {
            html += `
                <tr>
                    <td colspan="6" style="font-size: 12px; color: #666; padding-left: 30px;">
                        <em>Session Info:</em> ${reading.sessionInfo}
                    </td>
                </tr>
            `;
        }
    });

    // Calculate statistics
    const quietReadings = readingsHistory.filter(r => r.status === 'Quiet').length;
    const moderateReadings = readingsHistory.filter(r => r.status === 'Moderate').length;
    const loudReadings = readingsHistory.filter(r => r.status === 'Loud').length;

    const smsSent = readingsHistory.filter(r => r.smsStatus === 'Sent').length;
    const smsFailed = readingsHistory.filter(r => r.smsStatus === 'Failed').length;
    const smsOnCooldown = readingsHistory.filter(r => r.smsStatus === 'On Cooldown').length;

    const avgOriginal = readingsHistory.reduce((sum, r) => sum + r.originalDecibels, 0) / readingsHistory.length;
    const avgMeasured = readingsHistory.reduce((sum, r) => sum + r.measuredDecibels, 0) / readingsHistory.length;

    html += `
                    </tbody>
                </table>
            </div>

            <div class="section">
                <h2>Summary Statistics</h2>
                <div class="summary">
                    <div class="summary-item summary-quiet">
                        <div style="font-size: 24px; font-weight: bold;">${quietReadings}</div>
                        <div>Quiet Readings</div>
                        <div>${Math.round((quietReadings / readingsHistory.length) * 100)}%</div>
                    </div>
                    <div class="summary-item summary-moderate">
                        <div style="font-size: 24px; font-weight: bold;">${moderateReadings}</div>
                        <div>Moderate Readings</div>
                        <div>${Math.round((moderateReadings / readingsHistory.length) * 100)}%</div>
                    </div>
                    <div class="summary-item summary-loud">
                        <div style="font-size: 24px; font-weight: bold;">${loudReadings}</div>
                        <div>Loud Readings</div>
                        <div>${Math.round((loudReadings / readingsHistory.length) * 100)}%</div>
                    </div>
                </div>

                <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <div>
                        <h3>SMS Statistics</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>SMS Sent Successfully: <strong>${smsSent}</strong></li>
                            <li>SMS Failed: <strong>${smsFailed}</strong></li>
                            <li>SMS Blocked (Cooldown): <strong>${smsOnCooldown}</strong></li>
                        </ul>
                    </div>
                    <div>
                        <h3>Average Readings</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Average Source dB: <strong>${avgOriginal.toFixed(2)}</strong></li>
                            <li>Average Measured dB: <strong>${avgMeasured.toFixed(2)}</strong></li>
                            <li>Average Adjustment: <strong>${(avgMeasured - avgOriginal).toFixed(2)} dB</strong></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div class="footer">
                <p>Noise Monitoring System © ${now.getFullYear()} | Admin Dashboard Report</p>
                <p>This report was automatically generated by the Noise Monitoring System.</p>
                <button class="no-print" onclick="window.print()" style="padding: 10px 20px; background: #3498db; color: white; border: none; border-radius: 4px; cursor: pointer; margin-top: 10px;">
                    Print Report
                </button>
            </div>

            <script>
                window.onload = function() {
                    setTimeout(function() {
                        window.print();
                    }, 500);
                };
            </script>
        </body>
        </html>
    `;

    printWindow.document.write(html);
    printWindow.document.close();
}

// ========== EVENT LISTENERS ==========

// Clear recent readings
clearReadingsBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to clear all recent readings?')) {
        readingsHistory = [];
        updateReadingsTable();
        updateSidebarBadges();
        saveState();
    }
});

// Test SMS button
testSmsBtn.addEventListener('click', function() {
    const presentAdvisers = advisers.filter(a => a.status === 'present');
    if (presentAdvisers.length === 0) {
        alert('No present advisers to send test SMS to');
        return;
    }

    if (confirm(`Send test SMS to ${presentAdvisers.length} present adviser(s)?`)) {
        const originalText = testSmsBtn.innerHTML;
        testSmsBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        testSmsBtn.disabled = true;

        setTimeout(() => {
            const success = sendSMS(85, 'Loud (Test)', presentAdvisers.map(a => a.name));

            if (success) {
                alert(`Test SMS sent to ${presentAdvisers.length} adviser(s)!`);
            } else {
                alert('Failed to send test SMS. Please check SIM800L connection.');
            }

            testSmsBtn.innerHTML = originalText;
            testSmsBtn.disabled = false;
        }, 2000);
    }
});

// Modal event listeners
closeEditModal.addEventListener('click', closeEditModalFunc);
cancelEditBtn.addEventListener('click', closeEditModalFunc);
editModalOverlay.addEventListener('click', function(e) {
    if (e.target === editModalOverlay) closeEditModalFunc();
});

// Logout functionality
logoutBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        if (isAutoSimulating) {
            clearInterval(autoSimulateInterval);
            isAutoSimulating = false;
        }
        window.location.href = 'index.html';
    }
});

// Export buttons
downloadReadingsBtn.addEventListener('click', downloadReadingsAsText);
printReadingsBtn.addEventListener('click', printReadingsReport);

// ========== DATA PERSISTENCE ==========

// Load saved state from localStorage
function loadSavedState() {
    // Load noise monitoring state
    const savedState = localStorage.getItem('noiseMonitorState');
    if (savedState) {
        const state = JSON.parse(savedState);
        currentDecibels = state.currentDecibels || 65;
        readingsHistory = state.readingsHistory || [];
    }

    // Load advisers
    const savedAdvisers = localStorage.getItem('advisers');
    if (savedAdvisers) {
        advisers = JSON.parse(savedAdvisers);
    } else {
        // Add sample advisers if none exist
        advisers = [
            {
                id: 1,
                name: "Dr. Maria Santos",
                subject: "Physics",
                number: "+63 912 345 6789",
                status: "present"
            },
            {
                id: 2,
                name: "Prof. Juan Dela Cruz",
                subject: "Mathematics",
                number: "+63 923 456 7890",
                status: "on-leave"
            },
            {
                id: 3,
                name: "Engr. Robert Lim",
                subject: "Computer Science",
                number: "+63 934 567 8901",
                status: "present"
            }
        ];
        saveAdvisers();
    }

    // Load SMS settings
    const savedSmsSettings = localStorage.getItem('smsSettings');
    if (savedSmsSettings) {
        smsSettings = JSON.parse(savedSmsSettings);
    }

    // Load SMS cooldown settings
    const savedCooldown = localStorage.getItem('smsCooldown');
    if (savedCooldown) {
        smsCooldown = JSON.parse(savedCooldown);
    }

    // Load teacher schedules
    const savedSchedules = localStorage.getItem('teacherSchedules');
    if (savedSchedules) {
        teacherSchedules = JSON.parse(savedSchedules);
    } else {
        // Add sample schedules
        teacherSchedules = [
            {
                id: 1,
                teacherId: 1,
                teacherName: "Dr. Maria Santos",
                day: "monday",
                startTime: "08:00",
                endTime: "12:00",
                subject: "Physics",
                isActive: true
            },
            {
                id: 2,
                teacherId: 1,
                teacherName: "Dr. Maria Santos",
                day: "wednesday",
                startTime: "13:00",
                endTime: "17:00",
                subject: "Advanced Physics",
                isActive: true
            },
            {
                id: 3,
                teacherId: 3,
                teacherName: "Engr. Robert Lim",
                day: "monday",
                startTime: "08:00",
                endTime: "17:00",
                subject: "Computer Science",
                isActive: true
            }
        ];
        saveSchedules();
    }

    // Load SMS sessions
    const savedSessions = localStorage.getItem('smsSessions');
    if (savedSessions) {
        smsSessions = JSON.parse(savedSessions);
    }

    // Load wall checker state
    const savedWallState = localStorage.getItem('wallCheckerState');
    if (savedWallState) {
        wallState = JSON.parse(savedWallState);
    }

    // Update UI
    updateSmsSettingsUI();
    updateCooldownUI();
    updateTeacherDropdown();
    updateSchedulesTable();
    updateActiveTeachers();
    updateSmsLog();
}

// Save functions
function saveState() {
    const state = {
        currentDecibels: currentDecibels,
        readingsHistory: readingsHistory
    };
    localStorage.setItem('noiseMonitorState', JSON.stringify(state));
}

function saveAdvisers() {
    localStorage.setItem('advisers', JSON.stringify(advisers));
}

function saveSmsSettings() {
    localStorage.setItem('smsSettings', JSON.stringify(smsSettings));
}

function saveCooldownSettings() {
    localStorage.setItem('smsCooldown', JSON.stringify(smsCooldown));
}

function saveSchedules() {
    localStorage.setItem('teacherSchedules', JSON.stringify(teacherSchedules));
}

function saveSmsSessions() {
    localStorage.setItem('smsSessions', JSON.stringify(smsSessions));
}

function saveWallState() {
    localStorage.setItem('wallCheckerState', JSON.stringify(wallState));
}

// ========== HELPER FUNCTIONS ==========

// Update teacher dropdown
function updateTeacherDropdown() {
    // This function is called but not needed in current version
}

// Update schedules table
function updateSchedulesTable() {
    // This function is called but not needed in current version
}

// Update active teachers display
function updateActiveTeachers() {
    // This function is called but not needed in current version
}

// Update SMS log table
function updateSmsLog() {
    // This function is called but not needed in current version
}

// Helper function to capitalize first letter
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// ========== KEYBOARD SHORTCUTS ==========

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    if (isAutoSimulating) return;

    switch(event.key) {
        case '1':
            simulateQuietBtn.click();
            break;
        case '2':
            simulateModerateBtn.click();
            break;
        case '3':
            simulateLoudBtn.click();
            break;
        case ' ':
            event.preventDefault();
            autoSimulateBtn.click();
            break;
        case 'Escape':
            if (editModalOverlay.classList.contains('active')) {
                closeEditModalFunc();
            }
            break;
        case 'd':
            if (event.ctrlKey) {
                event.preventDefault();
                downloadReadingsAsText();
            }
            break;
        case 'p':
            if (event.ctrlKey) {
                event.preventDefault();
                printReadingsReport();
            }
            break;
        case 'b':
            if (event.ctrlKey) {
                event.preventDefault();
                toggleSidebar();
            }
            break;
        case 'A':
            if (event.ctrlKey && event.shiftKey) {
                event.preventDefault();
                isAutoScrollEnabled = !isAutoScrollEnabled;
                updateAutoScrollUI();
                alert(`Auto-scroll ${isAutoScrollEnabled ? 'enabled' : 'disabled'}`);
            }
            break;
    }
});

// Tooltip for keyboard shortcuts
window.addEventListener('load', function() {
    setTimeout(function() {
        alert('Tip: Use keyboard shortcuts:\n' +
              '1 = Quiet simulation\n' +
              '2 = Moderate simulation\n' +
              '3 = Loud simulation\n' +
              'Space = Toggle auto simulation\n' +
              'Ctrl+D = Download readings\n' +
              'Ctrl+P = Print report\n' +
              'Ctrl+B = Toggle sidebar\n' +
              'Ctrl+Shift+A = Toggle auto-scroll');
    }, 1000);
});

// ========== PAGE VISIBILITY HANDLING ==========

// Handle page visibility change
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isAutoSimulating) {
        clearInterval(autoSimulateInterval);
        autoSimulateBtn.setAttribute('data-paused', 'true');
    } else if (!document.hidden && isAutoSimulating && autoSimulateBtn.getAttribute('data-paused') === 'true') {
        autoSimulateBtn.removeAttribute('data-paused');
        autoSimulateInterval = setInterval(function() {
            const rand = Math.random();
            let newDecibels;

            if (rand < 0.4) {
                newDecibels = getRandomDecibels(40, 59);
            } else if (rand < 0.8) {
                newDecibels = getRandomDecibels(60, 80);
            } else {
                newDecibels = getRandomDecibels(81, 100);
            }

            updateNoiseDisplay(newDecibels);
        }, 3000);
    }
});

// Clean up on page unload
window.addEventListener('beforeunload', function() {
    if (isAutoSimulating) {
        clearInterval(autoSimulateInterval);
    }
    if (smsCooldownTimer) {
        clearInterval(smsCooldownTimer);
    }
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768 && isSidebarOpen) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            closeSidebar();
        }
    }
});