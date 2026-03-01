const decibelValue = document.getElementById('decibelValue');
const noiseStatus = document.getElementById('noiseStatus');
const indicatorFill = document.getElementById('indicatorFill');
const lastUpdated = document.getElementById('lastUpdated');
const readingsTable = document.getElementById('readingsTable');
const logoutBtn = document.getElementById('logoutBtn');
const clearReadingsBtn = document.getElementById('clearReadingsBtn');
const downloadReadingsBtn = document.getElementById('downloadReadingsBtn');
const printReadingsBtn = document.getElementById('printReadingsBtn');

const systemPowerToggle = document.getElementById('systemPowerToggle');
const powerStatus = document.getElementById('powerStatus');
const headerSystemStatus = document.getElementById('headerSystemStatus');
const headerStatusDot = document.getElementById('headerStatusDot');
const systemPowerStatus = document.getElementById('systemPowerStatus');
const footerSystemStatus = document.getElementById('footerSystemStatus');

const presentCount = document.getElementById('presentCount');
const onLeaveCount = document.getElementById('onLeaveCount');
const absentCount = document.getElementById('absentCount');
const adviserNameInput = document.getElementById('adviserName');
const adviserSubjectInput = document.getElementById('adviserSubject');
const adviserNumberInput = document.getElementById('adviserNumber');
const adviserStatusSelect = document.getElementById('adviserStatus');
const addAdviserBtn = document.getElementById('addAdviserBtn');
const advisersTable = document.getElementById('advisersTable');
const emailAllBtn = null; // Will use testEmailBtn instead
const enableEmailToggle = document.getElementById('enableEmail');
const emailTemplate = document.getElementById('emailTemplate');
const totalEmailsSent = document.getElementById('totalEmailsSent');
const activeAdvisers = document.getElementById('activeAdvisers');
const adviserSystemStatus = document.getElementById('adviserSystemStatus');
const footerEmailStatus = document.getElementById('footerEmailStatus');
const footerAdviserStatus = document.getElementById('footerAdviserStatus');

const editModalOverlay = document.getElementById('editModalOverlay');
const closeEditModal = document.getElementById('closeEditModal');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const editAdviserName = document.getElementById('editAdviserName');
const editAdviserSubject = document.getElementById('editAdviserSubject');
const editAdviserNumber = document.getElementById('editAdviserNumber');
const editAdviserStatus = document.getElementById('editAdviserStatus');
const saveAdviserBtn = document.getElementById('saveAdviserBtn');

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

const sim800lStatus = document.getElementById('sim800lStatus');
const wallSystemStatus = document.getElementById('wallSystemStatus');

const simulateQuietBtn = document.getElementById('simulateQuiet');
const simulateModerateBtn = document.getElementById('simulateModerate');
const simulateLoudBtn = document.getElementById('simulateLoud');
const autoSimulateBtn = document.getElementById('autoSimulate');
const testEmailBtn = document.getElementById('testEmailBtn');

const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContainer = document.getElementById('mainContainer');
const sidebarLinks = document.querySelectorAll('.sidebar-link');
const autoScrollStatus = document.getElementById('autoScrollStatus');
const sidebarDbValue = document.getElementById('sidebarDbValue');
const sidebarAdviserCount = document.getElementById('sidebarAdviserCount');
const readingsCount = document.getElementById('readingsCount');
const advisersBadge = document.getElementById('advisersBadge');
const schedulesBadge = document.getElementById('schedulesBadge');
const wallsBadge = document.getElementById('wallsBadge');
const emailBadge = document.getElementById('emailBadge');
const quickSimButtons = document.querySelectorAll('.quick-sim-btn');

const scheduleAdviserSelect = document.getElementById('scheduleAdviserSelect');
const scheduleDay = document.getElementById('scheduleDay');
const scheduleStartTime = document.getElementById('scheduleStartTime');
const scheduleEndTime = document.getElementById('scheduleEndTime');
const scheduleActive = document.getElementById('scheduleActive');
const scheduleStatusLabel = document.getElementById('scheduleStatusLabel');
const saveScheduleBtn = document.getElementById('saveScheduleBtn');
const clearScheduleForm = document.getElementById('clearScheduleForm');
const schedulesTable = document.getElementById('schedulesTable');
const activateAllSchedules = document.getElementById('activateAllSchedules');
const deactivateAllSchedules = document.getElementById('deactivateAllSchedules');
const activeSchedulesCount = document.getElementById('activeSchedulesCount');
const totalSchedulesCount = document.getElementById('totalSchedulesCount');
const currentlyScheduled = document.getElementById('currentlyScheduled');
const offSchedule = document.getElementById('offSchedule');
const nextEmailWindow = document.getElementById('nextEmailWindow');

let currentDecibels = 65;
let isAutoSimulating = false;
let autoSimulateInterval = null;
let autoSimulateStep = 0;
let readingsHistory = [];
let editingAdviserId = null;
let emailCooldownTimer = null;

let isSystemOn = true;

let advisers = [];
let emailSettings = {
    enabled: true,
    totalSent: 0,
    template: "NMS Alert: High noise level detected in your classroom. Current level: {level} dB ({status})."
};

let emailCooldown = {
    enabled: true,
    hours: 1,
    minutes: 0,
    lastEmailTime: null,
    cooldownEnd: null
};

let teacherSchedules = [];
let emailSessions = [];
let editingScheduleId = null;
let adviserNotifiedInSession = {};

let wallState = {
    north: 'concrete',
    east: 'concrete',
    south: 'plywood',
    west: 'plywood'
};

let isSidebarOpen = false;
let isAutoScrollEnabled = true;
let activeSection = 'noise';
let useRealHardware = true;

function checkAuth() {
    const hasSession = localStorage.getItem('isLoggedIn') === 'true';

    if (!hasSession) {
        alert('Please log in to access the admin dashboard');
        window.location.href = 'index.html';
        return false;
    }

    return true;
}

function getCurrentDay() {
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const now = new Date();
    return days[now.getDay()];
}

function getCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

function timeToMinutes(timeString) {
    if (!timeString) return 0;
    const [hours, minutes] = timeString.split(':').map(Number);
    return hours * 60 + minutes;
}

function isTimeInRange(currentTime, startTime, endTime) {
    const currentMinutes = timeToMinutes(currentTime);
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);
    
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
}

function formatTimeForDisplay(timeString) {
    if (!timeString) return '--:--';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function getCurrentTimeWithSeconds() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
}

const BREAK_TIMES = [
    { start: '09:00', end: '09:15' },
    { start: '15:00', end: '15:15' }
];

function isBreakTime() {
    const current = getCurrentTime();
    return BREAK_TIMES.some(bt => isTimeInRange(current, bt.start, bt.end));
}

function initializeSystemPower() {
    const savedSystemPower = localStorage.getItem('systemPower');
    if (savedSystemPower !== null) {
        isSystemOn = savedSystemPower === 'true';
    }
    updateSystemPowerUI();
    systemPowerToggle.addEventListener('change', function() {
        toggleSystemPower(this.checked);
    });
}

function toggleSystemPower(isOn) {
    isSystemOn = isOn;
    localStorage.setItem('systemPower', isSystemOn.toString());
    updateSystemPowerUI();
    if (!isSystemOn && isAutoSimulating) {
        stopAutoSimulation();
    }
    addSystemStatusReading();
    console.log(`System ${isSystemOn ? 'turned ON' : 'turned OFF'}`);
}

function updateSystemPowerUI() {
    systemPowerToggle.checked = isSystemOn;
    const powerStatusElement = document.getElementById('powerStatus');
    if (isSystemOn) {
        powerStatusElement.innerHTML = '<i class="fas fa-plug"></i><span>System is ON</span>';
        powerStatusElement.className = 'power-status system-on';
        headerSystemStatus.textContent = 'System: ON';
        headerSystemStatus.parentElement.classList.remove('system-off');
        headerStatusDot.className = 'status-dot active';
        systemPowerStatus.textContent = 'ON';
        systemPowerStatus.className = 'status-value';
        footerSystemStatus.textContent = 'ON';
        footerSystemStatus.className = 'status-active';
    } else {
        powerStatusElement.innerHTML = '<i class="fas fa-power-off"></i><span>System is OFF</span>';
        powerStatusElement.className = 'power-status system-off';
        headerSystemStatus.textContent = 'System: OFF';
        headerSystemStatus.parentElement.classList.add('system-off');
        headerStatusDot.className = 'status-dot inactive';
        systemPowerStatus.textContent = 'OFF';
        systemPowerStatus.className = 'status-value error';
        footerSystemStatus.textContent = 'OFF';
        footerSystemStatus.className = 'status-inactive';
    }
    if (!isSystemOn) {
        decibelValue.textContent = '-- dB';
        decibelValue.className = 'decibel-value color-system-off';
        noiseStatus.textContent = 'System OFF';
        noiseStatus.className = 'noise-status system-off';
        indicatorFill.style.width = '0%';
        sidebarDbValue.textContent = '-- dB';
        sidebarDbValue.className = 'sidebar-stat-value';
    }
    updateControlStates();
}

function updateControlStates() {
    const simulationButtons = [simulateQuietBtn, simulateModerateBtn, simulateLoudBtn, autoSimulateBtn];
    const quickSimButtons = document.querySelectorAll('.quick-sim-btn');
    const systemControls = [testEmailBtn, addAdviserBtn, saveScheduleBtn, 
                           activateAllSchedules, deactivateAllSchedules, clearReadingsBtn,
                           downloadReadingsBtn, printReadingsBtn];
    simulationButtons.forEach(btn => {
        if (btn) {
            btn.disabled = !isSystemOn;
            btn.classList.toggle('system-disabled', !isSystemOn);
        }
    });
    quickSimButtons.forEach(btn => {
        if (btn) {
            btn.disabled = !isSystemOn;
        }
    });
    systemControls.forEach(btn => {
        if (btn) {
            btn.disabled = !isSystemOn;
        }
    });
    const formInputs = [adviserNameInput, adviserSubjectInput, adviserNumberInput, 
                       adviserStatusSelect, scheduleAdviserSelect, scheduleDay,
                       scheduleStartTime, scheduleEndTime, scheduleActive];
    
    formInputs.forEach(input => {
        if (input) {
            input.disabled = !isSystemOn;
        }
    });
    if (enableEmailToggle) {
        enableEmailToggle.disabled = !isSystemOn;
    }
    if (emailTemplate) {
        emailTemplate.disabled = !isSystemOn;
    }
    const wallToggles = [wallNorthToggle, wallEastToggle, wallSouthToggle, wallWestToggle];
    wallToggles.forEach(toggle => {
        if (toggle) {
            toggle.disabled = !isSystemOn;
        }
    });
    const wallButtons = [setAllConcreteBtn, setAllPlywoodBtn];
    wallButtons.forEach(btn => {
        if (btn) {
            btn.disabled = !isSystemOn;
        }
    });
    const dashboardCards = document.querySelectorAll('.dashboard-card');
    dashboardCards.forEach(card => {
        card.classList.toggle('system-disabled', !isSystemOn);
    });
}

function addSystemStatusReading() {
    const timeString = getCurrentTimeWithSeconds();
    
    const reading = {
        time: timeString,
        originalDecibels: 0,
        measuredDecibels: 0,
        status: 'System ' + (isSystemOn ? 'ON' : 'OFF'),
        emailStatus: 'N/A',
        recipients: [],
        sessionInfo: isSystemOn ? 'System activated' : 'System deactivated',
        wallComposition: `${concreteCount.textContent}C/${plywoodCount.textContent}P`,
        isSystemEvent: true
    };
    
    readingsHistory.unshift(reading);
    if (readingsHistory.length > 10) readingsHistory.pop();
    updateReadingsTable();
}

document.addEventListener('DOMContentLoaded', function() {
    if (!checkAuth()) return;

    loadSavedState();
    initializeSystemPower();
    setInterval(fetchRealNoiseData, 2000);
    initializeNoiseSimulation();
    
    updateReadingsTable();
    updateAdvisersTable();
    updateScheduleAdviserDropdown();
    updateSchedulesTable();
    updateWallUI();
    initializeWallToggles();
    initSidebar();
    updateTime();
    
    initializeScheduleEventListeners();
    startScheduleMonitoring();
    setInterval(updateTime, 60000);
    downloadReadingsBtn.addEventListener('click', downloadReadingsAsText);
    printReadingsBtn.addEventListener('click', printReadingsReport);
    
    clearReadingsBtn.addEventListener('click', function() {
        if (!isSystemOn) {
            alert('System is OFF. Turn on the system to clear readings.');
            return;
        }

        if (confirm('Are you sure you want to clear all recent readings?')) {
            readingsHistory = [];
            updateReadingsTable();
            updateSidebarBadges();
            saveState();
        }
    });
    const syncEmailsBtn = document.createElement('button');
    syncEmailsBtn.innerHTML = '<i class="fas fa-sync"></i> Sync Emails';
    syncEmailsBtn.className = 'sidebar-link sync-btn';
    syncEmailsBtn.addEventListener('click', syncEmailAddressesToHardware);
    const adviserLink = document.querySelector('[data-section="advisers"]');
    if (adviserLink) {
        adviserLink.parentNode.insertBefore(syncEmailsBtn, adviserLink.nextSibling);
    }

    console.log('Dashboard initialized with real hardware connection');
});

function initSidebar() {
    console.log('Initializing sidebar');
    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState === 'open') {
        openSidebar();
    }
    const savedAutoScroll = localStorage.getItem('autoScrollEnabled');
    if (savedAutoScroll !== null) {
        isAutoScrollEnabled = savedAutoScroll === 'true';
        updateAutoScrollUI();
    }
    sidebarToggle.addEventListener('click', toggleSidebar);
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            navigateToSection(section);
            setActiveSidebarLink(this);
        });
    });
    quickSimButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            if (!isSystemOn) return;
            const level = this.dataset.level;
            triggerQuickSimulation(level);
        });
    });
    initAutoScrollObserver();
    updateSidebarBadges();
    
    console.log('Sidebar initialized');
}

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

function navigateToSection(section) {
    console.log(`Navigating to section: ${section}`);
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
        case 'schedules':
            scrollToElement('schedule-management');
            break;
        case 'walls':
            scrollToElement('wall-checker');
            break;
        case 'email':
            scrollToElement('email-config');
            break;
        case 'export':
            downloadReadingsAsText();
            break;
        case 'simulation':
            if (!isAutoSimulating && isSystemOn) {
                autoSimulateBtn.click();
            }
            break;
        case 'reports':
            printReadingsReport();
            break;
    }
    if (wasAutoScrollEnabled) {
        setTimeout(() => {
            isAutoScrollEnabled = true;
            updateAutoScrollUI();
        }, 2000);
    }
}

function triggerQuickSimulation(level) {
    if (!isSystemOn) {
        console.log('System is OFF, ignoring quick sim');
        return;
    }
    
    if (isAutoSimulating) {
        console.log('Auto simulation is running, ignoring quick sim');
        return;
    }
    
    let decibels;
    switch(level) {
        case 'quiet':
            decibels = 50;
            break;
        case 'moderate':
            decibels = 80;
            break;
        case 'loud':
            decibels = 110;
            break;
        default:
            decibels = 80;
    }
    
    console.log(`Quick simulation: ${level} (${decibels} dB)`);
    updateNoiseDisplay(decibels);
}

function scrollToElement(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function setActiveSidebarLink(linkElement) {
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
    });
    linkElement.classList.add('active');
    activeSection = linkElement.dataset.section;
}

function initAutoScrollObserver() {
    const sections = [
        { id: 'current-noise-level', section: 'noise' },
        { id: 'adviser-management', section: 'advisers' },
        { id: 'schedule-management', section: 'schedules' },
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
    sections.forEach(section => {
        const element = document.getElementById(section.id);
        if (element) {
            observer.observe(element);
        }
    });
}

function updateActiveSidebarLink(section) {
    sidebarLinks.forEach(link => {
        link.classList.remove('active');
        if (link.dataset.section === section) {
            link.classList.add('active');
        }
    });
}

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

function updateSidebarBadges() {
    const regularReadings = readingsHistory.filter(r => !r.isSystemEvent).length;
    readingsCount.textContent = regularReadings;
    const presentAdvisers = advisers.filter(a => a.status === 'present').length;
    advisersBadge.textContent = presentAdvisers;
    sidebarAdviserCount.textContent = presentAdvisers;
    const activeSchedules = teacherSchedules.filter(s => s.isActive).length;
    schedulesBadge.textContent = `${activeSchedules}/${teacherSchedules.length}`;
    const concreteWalls = Object.values(wallState).filter(type => type === 'concrete').length;
    const plywoodWalls = 4 - concreteWalls;
    wallsBadge.textContent = `${concreteWalls}C/${plywoodWalls}P`;
    emailBadge.textContent = emailSettings.enabled ? 'ON' : 'OFF';
    emailBadge.style.color = emailSettings.enabled ? '#2ea043' : '#8b949e';
}

function updateSidebarNoiseValue(decibels, status) {
    sidebarDbValue.textContent = `${decibels} dB`;
    sidebarDbValue.className = 'sidebar-stat-value';
    if (status === 'Quiet') {
        sidebarDbValue.classList.add('color-quiet');
    } else if (status === 'Moderate') {
        sidebarDbValue.classList.add('color-moderate');
    } else if (status === 'Loud') {
        sidebarDbValue.classList.add('color-loud');
    }
}

let lastTimeSync = 0;
const TIME_SYNC_INTERVAL_MS = 5 * 60 * 1000;

async function syncTimeToDevice() {
    if (!useRealHardware) return;
    try {
        const timeStr = getCurrentTime();
        const res = await fetch('/api/time', {
            method: 'POST',
            headers: { 'Content-Type': 'text/plain' },
            body: timeStr
        });
        if (res.ok) lastTimeSync = Date.now();
    } catch (e) {}
}

async function fetchRealNoiseData() {
    if (!useRealHardware) {
        console.log('Simulation mode active - skipping hardware fetch');
        return;
    }
    
    try {
        const response = await fetch('/api/noise');
        if (response.ok) {
            const data = await response.json();
            console.log('Real noise data:', data);
            if (Date.now() - lastTimeSync > TIME_SYNC_INTERVAL_MS) {
                syncTimeToDevice();
            }
            updateNoiseDisplay(data.decibels);
            updateHardwareStatus(data);
        }
    } catch (error) {
        console.error('Error fetching noise data:', error);
        if (isAutoSimulating) {
            stopAutoSimulation();
        }
    }
}

function updateHardwareStatus(data) {
    if (data.isAlarming) {
        console.log('Hardware alarm active');
    } else if (data.inCooldown) {
        console.log('Hardware in cooldown');
    }
    if (data.emailSent) {
        console.log('Email sent by hardware');
        // Update UI to show email was sent by hardware
        const lastReading = readingsHistory[0];
        if (lastReading && lastReading.emailStatus !== 'Sent') {
            lastReading.emailStatus = 'Sent';
            lastReading.sessionInfo = 'Sent via ESP32 Gmail';
            updateReadingsTable();
        }
    }
    
    // Update Gmail connection status indicators
    updateGmailStatus(data);
}

function updateGmailStatus(data) {
    // Update footer email status based on hardware Gmail capability
    const footerEmailStatusElement = document.getElementById('footerEmailStatus');
    if (footerEmailStatusElement) {
        if (data.emailSent !== undefined) {
            footerEmailStatusElement.textContent = 'Gmail Ready';
            footerEmailStatusElement.className = 'status-active';
        } else {
            footerEmailStatusElement.textContent = 'Gmail Unknown';
            footerEmailStatusElement.className = 'status-inactive';
        }
    }
    
    // Update email badge to show Gmail status
    const emailBadgeElement = document.getElementById('emailBadge');
    if (emailBadgeElement) {
        if (data.emailSent !== undefined) {
            emailBadgeElement.textContent = 'Gmail';
            emailBadgeElement.style.color = '#2ea043';
        } else {
            emailBadgeElement.textContent = 'Gmail?';
            emailBadgeElement.style.color = '#f85149';
        }
    }
}

async function syncEmailAddressesToHardware() {
    try {
        console.log('=== SYNCING GMAIL ADDRESSES TO ESP32 ===');
        
        // Clear existing email addresses on ESP32
        try {
            const clearResponse = await fetch('/api/email/clear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });
            
            if (clearResponse.ok) {
                console.log('✓ Cleared existing email addresses from ESP32');
            } else {
                console.warn('⚠ Failed to clear existing email addresses from ESP32');
            }
        } catch (error) {
            console.error('✗ Error clearing email addresses:', error);
        }
        
        // Get present advisers with Gmail addresses
        const presentAdvisers = advisers.filter(a => a.status === 'present');
        
        if (presentAdvisers.length === 0) {
            console.log('No present advisers to sync');
            alert('No present advisers to sync to hardware.');
            return;
        }
        
        let successCount = 0;
        let failureCount = 0;
        
        // Sync each adviser's Gmail address to ESP32
        for (const adviser of presentAdvisers) {
            try {
                console.log(`Syncing Gmail: ${adviser.name} -> ${adviser.number}`);
                
                const response = await fetch('/api/email', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `email=${encodeURIComponent(adviser.number)}`
                });
                
                if (response.ok) {
                    console.log(`✓ Synced Gmail: ${adviser.number}`);
                    successCount++;
                } else {
                    console.error(`✗ Failed to sync Gmail: ${adviser.number} (Status: ${response.status})`);
                    failureCount++;
                }
            } catch (error) {
                console.error(`✗ Error syncing Gmail ${adviser.number}:`, error);
                failureCount++;
            }
            
            // Small delay between requests to avoid overwhelming the ESP32
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        
        console.log(`=== GMAIL SYNC COMPLETE ===`);
        console.log(`✓ Successfully synced: ${successCount} Gmail addresses`);
        console.log(`✗ Failed to sync: ${failureCount} Gmail addresses`);
        
        // Show user-friendly result
        if (successCount > 0) {
            alert(`Successfully synced ${successCount} Gmail addresses to ESP32 hardware!${failureCount > 0 ? ` (${failureCount} failed)` : ''}`);
        } else {
            alert('Failed to sync any Gmail addresses to ESP32 hardware. Please check the console for details.');
        }
        
    } catch (error) {
        console.error('✗ Critical error syncing Gmail addresses:', error);
        alert('Critical error syncing Gmail addresses. Please check the console for details.');
    }
}

function updateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    const dateString = now.toLocaleDateString();
    lastUpdated.textContent = `${dateString} ${timeString}`;
}

function updateNoiseDisplay(decibels) {
    console.log(`Updating noise display with: ${decibels} dB`);
    if (!isSystemOn) {
        console.log('System is OFF, ignoring noise update');
        return;
    }
    if (isBreakTime()) {
        currentDecibels = decibels;
        const measuredDecibels = applyWallAdjustments(decibels);
        decibelValue.textContent = `${measuredDecibels} dB`;
        decibelValue.className = 'decibel-value color-moderate';
        noiseStatus.textContent = 'Break time';
        noiseStatus.className = 'noise-status color-moderate';
        let fillPct = ((measuredDecibels - 40) / 60) * 100;
        if (fillPct < 0) fillPct = 0;
        if (fillPct > 100) fillPct = 100;
        indicatorFill.style.width = `${fillPct}%`;
        indicatorFill.className = 'indicator-fill bg-moderate';
        updateSidebarNoiseValue(measuredDecibels, 'Break time');
        return;
    }

    currentDecibels = decibels;
    const measuredDecibels = applyWallAdjustments(decibels);
    console.log(`After wall adjustments: ${measuredDecibels} dB`);
    decibelValue.textContent = `${measuredDecibels} dB`;
    let status = '';
    let colorClass = '';
    let shouldSendEmail = false;

    if (measuredDecibels < 60) {
        status = 'Quiet';
        colorClass = 'quiet';
        shouldSendEmail = false;
    } else if (measuredDecibels <= 99) {
        status = 'Moderate';
        colorClass = 'moderate';
        shouldSendEmail = false;
    } else {
        status = 'Loud';
        colorClass = 'loud';
        shouldSendEmail = true;
    }

    console.log(`Status: ${status}, Color: ${colorClass}, Send Email: ${shouldSendEmail}`);
    decibelValue.className = 'decibel-value color-' + colorClass;
    noiseStatus.className = 'noise-status color-' + colorClass;
    noiseStatus.textContent = status;
    let fillPercentage = ((measuredDecibels - 40) / 60) * 100;
    if (fillPercentage < 0) fillPercentage = 0;
    if (fillPercentage > 100) fillPercentage = 100;

    indicatorFill.style.width = `${fillPercentage}%`;
    indicatorFill.className = 'indicator-fill bg-' + colorClass;
    updateSidebarNoiseValue(measuredDecibels, status);
    let emailStatusText = 'Not Sent';
    let emailRecipients = [];
    let sessionInfo = '';

    if (shouldSendEmail && emailSettings.enabled && isSystemOn) {
        const presentAdvisers = advisers.filter(a => a.status === 'present');
        if (presentAdvisers.length > 0) {
            if (emailCooldown.enabled && isOnCooldown()) {
                emailStatusText = 'On Cooldown';
                sessionInfo = 'Resets next session';
            } else {
                const scheduledAdvisers = presentAdvisers.filter(adviser =>
                    isTeacherScheduled(adviser.id)
                );

                if (scheduledAdvisers.length > 0) {
                    emailRecipients = scheduledAdvisers.map(a => a.name);
                    const emailResult = sendEmail(measuredDecibels, status, scheduledAdvisers.map(a => a.name));
                    emailStatusText = emailResult ? 'Sent' : 'Failed';
                    sessionInfo = emailResult ? `${scheduledAdvisers.length} advisers notified` : 'Send failed';
                } else {
                    emailStatusText = 'No Scheduled Advisers';
                    sessionInfo = 'No advisers scheduled for current time';
                }
            }
        } else {
            emailStatusText = 'No Active Advisers';
            sessionInfo = 'No present advisers';
        }
    } else if (!emailSettings.enabled) {
        emailStatusText = 'Disabled';
        sessionInfo = 'Email disabled';
    } else if (!isSystemOn) {
        emailStatusText = 'System OFF';
        sessionInfo = 'System is turned off';
    }
    addToHistory(decibels, measuredDecibels, status, emailStatusText, emailRecipients, sessionInfo);
    saveState();
}

function applyWallAdjustments(originalDecibels) {
    let concreteWalls = 0;
    let plywoodWalls = 0;

    Object.values(wallState).forEach(type => {
        if (type === 'concrete') concreteWalls++;
        else plywoodWalls++;
    });
    const concreteRetention = 0.8;
    const plywoodRetention = 0.4;
    const totalWalls = 4;
    const averageRetention = (concreteWalls * concreteRetention + plywoodWalls * plywoodRetention) / totalWalls;
    const measuredDecibels = originalDecibels * averageRetention;
    const ambientNoise = 10;
    const finalReading = Math.round(measuredDecibels + ambientNoise);
    return Math.max(0, Math.min(120, finalReading));
}

function getRandomDecibels(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addToHistory(originalDecibels, measuredDecibels, status, emailStatus, recipients = [], sessionInfo = '') {
    const timeString = getCurrentTimeWithSeconds();

    const reading = {
        time: timeString,
        originalDecibels: originalDecibels,
        measuredDecibels: measuredDecibels,
        status: status,
        emailStatus: emailStatus,
        recipients: recipients,
        sessionInfo: sessionInfo,
        wallComposition: `${concreteCount.textContent}C/${plywoodCount.textContent}P`
    };

    readingsHistory.unshift(reading);
    if (readingsHistory.length > 10) readingsHistory.pop();
    updateReadingsTable();
    updateSidebarBadges();
}

function updateReadingsTable() {
    readingsTable.innerHTML = '';

    if (readingsHistory.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" style="text-align: center; color: #8b949e;">
                No readings yet. Use the controls to simulate noise levels.
            </td>
        `;
        readingsTable.appendChild(row);
        return;
    }

    readingsHistory.forEach(reading => {
        const row = document.createElement('tr');
        if (reading.isSystemEvent) {
            row.innerHTML = `
                <td>${reading.time}</td>
                <td colspan="2" style="text-align: center; color: #58a6ff; font-weight: 500;">
                    <i class="fas fa-power-off"></i> ${reading.sessionInfo}
                </td>
                <td>
                    <span class="status-badge ${reading.status.toLowerCase().includes('on') ? 'quiet' : 'loud'}">
                        ${reading.status}
                    </span>
                </td>
                <td colspan="2" style="text-align: center; color: #8b949e;">
                    System Event
                </td>
            `;
            readingsTable.appendChild(row);
            return;
        }

        const statusClass = reading.status.toLowerCase();
        const statusBadge = `<span class="status-badge ${statusClass}">${reading.status}</span>`;

        const email = reading.emailStatus === 'Sent' ? 'sent' : 'not-sent';
        const emailBadge = `<span class="email-badge ${email}">${reading.emailStatus}</span>`;

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
            <td>${emailBadge}</td>
            <td class="session-info">
                <div class="email-recipients" title="${reading.recipients.join(', ')}">
                    ${recipientsText}
                </div>
                ${reading.sessionInfo ? `<div class="session-cooldown">${reading.sessionInfo}</div>` : ''}
            </td>
        `;

        readingsTable.appendChild(row);
    });
}

function validateEmail(email) {
    if (!email) return { ok: false, message: 'Email address is required', formatted: '' };
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return { ok: false, message: 'Please enter a valid email address', formatted: '' };
    }
    
    // Prefer Gmail addresses but allow other domains for flexibility
    const lowerEmail = email.toLowerCase();
    if (!lowerEmail.includes('@gmail.com') && !lowerEmail.includes('@googlemail.com')) {
        return { 
            ok: false, 
            message: 'Gmail addresses are recommended for best compatibility (@gmail.com or @googlemail.com)', 
            formatted: '' 
        };
    }
    
    return { ok: true, message: '', formatted: lowerEmail };
}

if (adviserNumberInput) {
    adviserNumberInput.addEventListener('input', function() {
        // Convert to lowercase for Gmail addresses
        this.value = this.value.toLowerCase();
    });
}

if (editAdviserNumber) {
    editAdviserNumber.addEventListener('input', function() {
        // Convert to lowercase for Gmail addresses
        this.value = this.value.toLowerCase();
    });
}

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
    const present = advisers.filter(a => a.status === 'present').length;
    const onLeave = advisers.filter(a => a.status === 'on-leave').length;
    const absent = advisers.filter(a => a.status === 'absent').length;

    presentCount.textContent = present;
    onLeaveCount.textContent = onLeave;
    absentCount.textContent = absent;
    activeAdvisers.textContent = present;
    footerAdviserStatus.textContent = `${present} Present`;
    adviserSystemStatus.textContent = present > 0 ? 'Active' : 'No Active Advisers';
    adviserSystemStatus.className = present > 0 ? 'status-value' : 'status-value warning';
    updateScheduleAdviserDropdown();
    updateSidebarBadges();
    advisers.forEach(adviser => {
        const row = document.createElement('tr');
        row.dataset.id = adviser.id;

        row.innerHTML = `
            <td>${adviser.name}</td>
            <td>${adviser.subject}</td>
            <td>${adviser.number}</td>
            <td><span class="adviser-status ${adviser.status}">${adviser.status.charAt(0).toUpperCase() + adviser.status.slice(1)}</span></td>
            <td class="adviser-actions">
                <button class="btn-edit" data-id="${adviser.id}" ${!isSystemOn ? 'disabled' : ''}>
                    <i class="fas fa-edit"></i> Edit
                </button>
                <button class="btn-delete" data-id="${adviser.id}" ${!isSystemOn ? 'disabled' : ''}>
                    <i class="fas fa-trash"></i> Delete
                </button>
            </td>
        `;

        advisersTable.appendChild(row);
    });
    document.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!isSystemOn) return;
            const id = parseInt(this.dataset.id);
            openEditModal(id);
        });
    });

    document.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', function() {
            if (!isSystemOn) return;
            const id = parseInt(this.dataset.id);
            deleteAdviser(id);
        });
    });
}

addAdviserBtn.addEventListener('click', function() {
    if (!isSystemOn) {
        alert('System is OFF. Turn on the system to add advisers.');
        return;
    }

    const name = adviserNameInput.value.trim();
    const subject = adviserSubjectInput.value.trim();
    const rawNumber = adviserNumberInput.value.trim();
    const status = adviserStatusSelect.value;

    if (!name || !subject || !rawNumber) {
        alert('Please fill in all fields');
        return;
    }
    if (/\d/.test(name)) {
        alert('Adviser name cannot contain integers/numbers');
        adviserNameInput.focus();
        return;
    }

    const emailResult = validateEmail(rawNumber);
    if (!emailResult.ok) {
        alert(emailResult.message);
        adviserNumberInput.focus();
        return;
    }

    const newAdviser = {
        id: Date.now(),
        name,
        subject,
        number: emailResult.formatted,
        status
    };

    advisers.push(newAdviser);
    saveAdvisers();
    updateAdvisersTable();
    adviserNameInput.value = '';
    adviserSubjectInput.value = '';
    adviserNumberInput.value = '';
    adviserStatusSelect.value = 'present';

    adviserNameInput.focus();

    alert('Adviser added successfully!');
});
function openEditModal(id) {
    if (!isSystemOn) return;

    const adviser = advisers.find(a => a.id === id);
    if (!adviser) return;

    editingAdviserId = id;
    editAdviserName.value = adviser.name;
    editAdviserSubject.value = adviser.subject;
    editAdviserNumber.value = adviser.number;
    editAdviserStatus.value = adviser.status;

    editModalOverlay.classList.add('active');
}
function closeEditModalFunc() {
    editModalOverlay.classList.remove('active');
    editingAdviserId = null;
    editAdviserName.value = '';
    editAdviserSubject.value = '';
    editAdviserNumber.value = '';
    editAdviserStatus.value = 'present';
}
saveAdviserBtn.addEventListener('click', function() {
    if (!isSystemOn) return;

    if (!editingAdviserId) return;

    const adviserIndex = advisers.findIndex(a => a.id === editingAdviserId);
    if (adviserIndex === -1) return;

    const editedName = editAdviserName.value.trim();
    const editedSubject = editAdviserSubject.value.trim();
    const editedRawNumber = editAdviserNumber.value.trim();

    if (!editedName || !editedSubject || !editedRawNumber) {
        alert('Please fill in all fields');
        return;
    }
    if (/\d/.test(editedName)) {
        alert('Adviser name cannot contain integers/numbers');
        editAdviserName.focus();
        return;
    }

    const emailResult = validateEmail(editedRawNumber);
    if (!emailResult.ok) {
        alert(emailResult.message);
        editAdviserNumber.focus();
        return;
    }

    advisers[adviserIndex] = {
        ...advisers[adviserIndex],
        name: editedName,
        subject: editedSubject,
        number: emailResult.formatted,
        status: editAdviserStatus.value
    };

    saveAdvisers();
    updateAdvisersTable();
    closeEditModalFunc();
    alert('Adviser updated successfully!');
});
function deleteAdviser(id) {
    if (!isSystemOn) {
        alert('System is OFF. Turn on the system to delete advisers.');
        return;
    }

    if (!confirm('Are you sure you want to delete this adviser?')) return;
    advisers = advisers.filter(a => a.id !== id);
    teacherSchedules = teacherSchedules.filter(schedule => schedule.teacherId !== id);

    saveAdvisers();
    saveSchedules();
    updateAdvisersTable();
    updateSchedulesTable();
    alert('Adviser and associated schedules deleted successfully!');
}
async function sendEmail(decibels, status, recipients) {
    console.log(`\n=== GMAIL SENDING PROCESS ===`);
    console.log(`Time: ${getCurrentTime()}, Day: ${getCurrentDay()}`);
    console.log(`Recipients: ${recipients.join(', ')}`);
    
    if (!recipients || recipients.length === 0) {
        console.log('Email blocked: No recipients specified');
        return false;
    }
    if (!isSystemOn) {
        console.log('Email blocked: System is OFF');
        return false;
    }
    if (emailCooldown.enabled && isOnCooldown()) {
        console.log('Email blocked: All scheduled advisers already notified this session');
        return false;
    }
    const validRecipients = recipients.filter(recipient => {
        const adviser = advisers.find(a => a.name === recipient);
        if (!adviser) {
            console.log(`- ${recipient}: Not found in advisers list`);
            return false;
        }
        if (adviser.status !== 'present') {
            console.log(`- ${recipient}: Status is ${adviser.status} (needs to be present)`);
            return false;
        }
        if (!isTeacherScheduled(adviser.id)) {
            console.log(`- ${recipient}: Not scheduled for current time`);
            return false;
        }
        if (wasAdviserNotifiedInCurrentSession(adviser.id)) {
            console.log(`- ${recipient}: Already notified this session (one per session)`);
            return false;
        }
        console.log(`- ✓ ${recipient}: Present, scheduled, and not yet notified this session`);
        return true;
    });

    console.log(`Valid recipients: ${validRecipients.length} out of ${recipients.length}`);
    if (validRecipients.length === 0) {
        console.log('Email blocked: No valid recipients (not scheduled, not present, or already notified this session)');
        return false;
    }

    // Get Gmail addresses for valid recipients
    const gmailAddresses = validRecipients.map(name => {
        const adviser = advisers.find(a => a.name === name);
        return adviser ? adviser.number : null;
    }).filter(email => email !== null);

    if (gmailAddresses.length === 0) {
        console.log('Email blocked: No valid Gmail addresses found');
        return false;
    }

    try {
        // Trigger email sending via ESP32 hardware
        console.log('Triggering Gmail sending via ESP32 hardware...');
        
        // Use the new email trigger endpoint
        const triggerResponse = await fetch('/api/email/trigger', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
        
        if (triggerResponse.ok) {
            const result = await triggerResponse.text();
            console.log('✓ Gmail trigger response:', result);
        } else {
            console.warn('⚠ Gmail trigger failed:', triggerResponse.status);
            throw new Error('ESP32 email trigger failed');
        }

        // Mark advisers as notified in this session
        validRecipients.forEach(name => {
            const adviser = advisers.find(a => a.name === name);
            if (adviser) {
                const sessionKey = getCurrentSessionKeyForAdviser(adviser.id);
                if (sessionKey) adviserNotifiedInSession[adviser.id] = sessionKey;
            }
        });

        // Update email statistics
        emailSettings.totalSent += validRecipients.length;
        totalEmailsSent.textContent = emailSettings.totalSent;
        
        logEmailSession(decibels, status, validRecipients);
        saveEmailSettings();
        saveAdviserNotifiedInSession();
        saveEmailSessions();

        console.log(`✓ Gmail triggered for ${validRecipients.length} scheduled/present advisers: "${validRecipients.join(', ')}"`);
        console.log(`✓ Email addresses: ${gmailAddresses.join(', ')}`);
        return true;
        
    } catch (error) {
        console.error('✗ Gmail trigger failed:', error);
        return false;
    }
}
function isOnCooldown() {
    const scheduledAdvisers = advisers.filter(a =>
        a.status === 'present' && getCurrentSessionKeyForAdviser(a.id) !== null
    );
    if (scheduledAdvisers.length === 0) return false;
    return scheduledAdvisers.every(a => wasAdviserNotifiedInCurrentSession(a.id));
}
function setCooldown() {
}
function getCurrentSessionKeyForAdviser(adviserId) {
    const currentDay = getCurrentDay();
    const currentTime = getCurrentTime();
    const activeSchedules = teacherSchedules.filter(s =>
        s.teacherId === adviserId && s.isActive === true && s.day === currentDay
    );
    for (const schedule of activeSchedules) {
        if (isTimeInRange(currentTime, schedule.startTime, schedule.endTime)) {
            return `${currentDay}_${schedule.startTime}_${schedule.endTime}`;
        }
    }
    return null;
}
function wasAdviserNotifiedInCurrentSession(adviserId) {
    const key = getCurrentSessionKeyForAdviser(adviserId);
    return key !== null && adviserNotifiedInSession[adviserId] === key;
}
function isTeacherScheduled(adviserId) {
    return getCurrentSessionKeyForAdviser(adviserId) !== null;
}
function updateEmailSettingsUI() {
    enableEmailToggle.checked = emailSettings.enabled;
    emailTemplate.value = emailSettings.template;
    totalEmailsSent.textContent = emailSettings.totalSent;
    footerEmailStatus.textContent = emailSettings.enabled ? 'Enabled' : 'Disabled';
    footerEmailStatus.className = emailSettings.enabled ? 'status-active' : 'status-value warning';
    updateSidebarBadges();
}
enableEmailToggle.addEventListener('change', function() {
    if (!isSystemOn) {
        this.checked = !this.checked;
        alert('System is OFF. Turn on the system to change email settings.');
        return;
    }
    
    emailSettings.enabled = this.checked;
    saveEmailSettings();
    updateEmailSettingsUI();
});
emailTemplate.addEventListener('change', function() {
    if (!isSystemOn) return;
    
    emailSettings.template = this.value;
    saveEmailSettings();
});
function updateCooldownUI() {
    startCooldownTimer();
}
function startCooldownTimer() {
    if (emailCooldownTimer) clearInterval(emailCooldownTimer);

    emailCooldownTimer = setInterval(() => {
        if (isOnCooldown()) {
            updateCooldownUI();
        } else {
            clearInterval(emailCooldownTimer);
        }
    }, 60000);
}
function logEmailSession(decibels, status, recipients) {
    const session = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        decibels: decibels,
        status: status,
        recipients: recipients,
        recipientCount: recipients.length
    };

    emailSessions.unshift(session);
    if (emailSessions.length > 100) emailSessions.pop();
    console.log(`Email session logged: ${recipients.length} recipients for ${decibels}dB ${status}`);
}

function updateEmailLog() {
}
function updateScheduleAdviserDropdown() {
    scheduleAdviserSelect.innerHTML = '<option value="">Select Adviser</option>';
    
    const presentAdvisers = advisers.filter(adviser => adviser.status === 'present');
    
    presentAdvisers.forEach(adviser => {
        const option = document.createElement('option');
        option.value = adviser.id;
        option.textContent = `${adviser.name} (${adviser.subject})`;
        scheduleAdviserSelect.appendChild(option);
    });
}
function hasScheduleConflict(adviserId, day, startTime, endTime, excludeScheduleId = null) {
    const sameDaySchedules = teacherSchedules.filter(schedule => 
        schedule.teacherId === adviserId && 
        schedule.day === day &&
        schedule.id !== excludeScheduleId
    );
    
    for (const schedule of sameDaySchedules) {
        const scheduleStart = schedule.startTime;
        const scheduleEnd = schedule.endTime;
        
        if (
            (startTime >= scheduleStart && startTime < scheduleEnd) ||
            (endTime > scheduleStart && endTime <= scheduleEnd) ||
            (startTime <= scheduleStart && endTime >= scheduleEnd)
        ) {
            return true;
        }
    }
    
    return false;
}
function saveSchedule() {
    if (!isSystemOn) {
        alert('System is OFF. Turn on the system to save schedules.');
        return;
    }

    const adviserId = parseInt(scheduleAdviserSelect.value);
    const day = scheduleDay.value;
    const startTime = scheduleStartTime.value;
    const endTime = scheduleEndTime.value;
    const isActive = scheduleActive.checked;
    if (!adviserId) {
        alert('Please select an adviser');
        return;
    }
    
    if (!startTime || !endTime) {
        alert('Please set both start and end times');
        return;
    }
    
    if (startTime >= endTime) {
        alert('End time must be after start time');
        return;
    }
    if (hasScheduleConflict(adviserId, day, startTime, endTime, editingScheduleId)) {
        if (!confirm('This schedule overlaps with an existing schedule. Do you want to continue?')) {
            return;
        }
    }
    
    if (editingScheduleId) {
        const scheduleIndex = teacherSchedules.findIndex(s => s.id === editingScheduleId);
        if (scheduleIndex !== -1) {
            teacherSchedules[scheduleIndex] = {
                ...teacherSchedules[scheduleIndex],
                teacherId: adviserId,
                day: day,
                startTime: startTime,
                endTime: endTime,
                isActive: isActive
            };
        }
    } else {
        const newSchedule = {
            id: Date.now(),
            teacherId: adviserId,
            day: day,
            startTime: startTime,
            endTime: endTime,
            isActive: isActive
        };
        
        teacherSchedules.push(newSchedule);
    }
    
    saveSchedules();
    updateSchedulesTable();
    clearScheduleFormFunc();
    alert('Schedule saved successfully!');
}
function updateSchedulesTable() {
    schedulesTable.innerHTML = '';
    
    if (teacherSchedules.length === 0) {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td colspan="6" class="empty-message">
                <i class="fas fa-calendar-times"></i>
                No schedules added yet. Add your first schedule above.
            </td>
        `;
        schedulesTable.appendChild(row);
    } else {
        const dayOrder = {
            'monday': 1, 'tuesday': 2, 'wednesday': 3,
            'thursday': 4, 'friday': 5, 'saturday': 6, 'sunday': 7
        };
        
        teacherSchedules.sort((a, b) => {
            if (dayOrder[a.day] !== dayOrder[b.day]) {
                return dayOrder[a.day] - dayOrder[b.day];
            }
            return a.startTime.localeCompare(b.startTime);
        });
        
        teacherSchedules.forEach(schedule => {
            const adviser = advisers.find(a => a.id === schedule.teacherId);
            const row = document.createElement('tr');
            row.dataset.id = schedule.id;
            const currentDay = getCurrentDay();
            const currentTime = getCurrentTime();
            
            let isCurrent = false;
            if (schedule.day === currentDay && 
                isTimeInRange(currentTime, schedule.startTime, schedule.endTime) &&
                schedule.isActive) {
                row.classList.add('current-schedule');
                isCurrent = true;
            }
            const hasOverlap = hasScheduleConflict(schedule.teacherId, schedule.day, 
                schedule.startTime, schedule.endTime, schedule.id);
            if (hasOverlap) {
                row.classList.add('schedule-overlap');
            }
            
            row.innerHTML = `
                <td>
                    <strong>${adviser ? adviser.name : 'Unknown Adviser'}</strong>
                    ${adviser ? `<div style="font-size: 12px; color: #8b949e;">${adviser.subject}</div>` : ''}
                    ${adviser ? `<div style="font-size: 11px; color: #58a6ff;">Status: ${adviser.status}</div>` : ''}
                </td>
                <td>
                    <span style="font-weight: 500;">${capitalizeFirst(schedule.day)}</span>
                    <span class="day-badge ${schedule.day.substring(0, 3)}">
                        ${schedule.day.substring(0, 3).toUpperCase()}
                    </span>
                </td>
                <td class="time-range" title="24-hour format">
                    <i class="far fa-clock" style="margin-right: 5px; color: #8b949e;"></i>
                    ${schedule.startTime}
                    <div style="font-size: 10px; color: #8b949e;">${formatTimeForDisplay(schedule.startTime)}</div>
                </td>
                <td class="time-range" title="24-hour format">
                    <i class="far fa-clock" style="margin-right: 5px; color: #8b949e;"></i>
                    ${schedule.endTime}
                    <div style="font-size: 10px; color: #8b949e;">${formatTimeForDisplay(schedule.endTime)}</div>
                </td>
                <td>
                    <span class="schedule-status ${schedule.isActive ? 'active' : 'inactive'}">
                        <i class="fas fa-circle" style="font-size: 8px; margin-right: 4px;"></i>
                        ${schedule.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <div style="font-size: 10px; color: #8b949e; margin-top: 3px;">
                        ${getCurrentDay() === schedule.day ? 'Today' : ''}
                    </div>
                </td>
                <td class="schedule-actions">
                    <button class="btn-edit-schedule" data-id="${schedule.id}" title="Edit Schedule" ${!isSystemOn ? 'disabled' : ''}>
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn-delete-schedule" data-id="${schedule.id}" title="Delete Schedule" ${!isSystemOn ? 'disabled' : ''}>
                        <i class="fas fa-trash"></i> Delete
                    </button>
                    <button class="btn-toggle-schedule ${schedule.isActive ? '' : 'inactive'}" data-id="${schedule.id}" 
                            title="${schedule.isActive ? 'Deactivate Schedule' : 'Activate Schedule'}" ${!isSystemOn ? 'disabled' : ''}>
                        <i class="fas fa-power-off"></i> ${schedule.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                </td>
            `;
            
            schedulesTable.appendChild(row);
        });
    }
    const activeSchedules = teacherSchedules.filter(s => s.isActive).length;
    activeSchedulesCount.textContent = activeSchedules;
    totalSchedulesCount.textContent = teacherSchedules.length;
    updateScheduleStatistics();
    updateSidebarBadges();
}
function updateScheduleStatistics() {
    const currentDay = getCurrentDay();
    const currentTime = getCurrentTime();
    const currentlyScheduledAdvisers = new Set();
    
    teacherSchedules.forEach(schedule => {
        if (schedule.isActive && 
            schedule.day === currentDay && 
            isTimeInRange(currentTime, schedule.startTime, schedule.endTime)) {
            currentlyScheduledAdvisers.add(schedule.teacherId);
        }
    });
    const presentAdvisers = advisers.filter(a => a.status === 'present');
    const offScheduleAdvisers = presentAdvisers.filter(adviser => {
        return !teacherSchedules.some(schedule =>
            schedule.teacherId === adviser.id &&
            schedule.isActive &&
            schedule.day === currentDay &&
            isTimeInRange(currentTime, schedule.startTime, schedule.endTime)
        );
    });
    
    currentlyScheduled.textContent = currentlyScheduledAdvisers.size;
    offSchedule.textContent = offScheduleAdvisers.length;
    let nextWindow = '--:--';
    const currentMinutes = timeToMinutes(currentTime);
    const futureSchedules = teacherSchedules.filter(schedule => {
        if (!schedule.isActive || schedule.day !== currentDay) return false;
        
        const scheduleStartMinutes = timeToMinutes(schedule.startTime);
        return scheduleStartMinutes > currentMinutes;
    });
    
    if (futureSchedules.length > 0) {
        futureSchedules.sort((a, b) => 
            timeToMinutes(a.startTime) - timeToMinutes(b.startTime)
        );
        
        nextWindow = formatTimeForDisplay(futureSchedules[0].startTime);
    }
    
    nextEmailWindow.textContent = nextWindow;
}
function editSchedule(id) {
    if (!isSystemOn) return;

    const schedule = teacherSchedules.find(s => s.id === id);
    if (!schedule) return;

    editingScheduleId = id;
    scheduleAdviserSelect.value = schedule.teacherId;
    scheduleDay.value = schedule.day;
    scheduleStartTime.value = schedule.startTime;
    scheduleEndTime.value = schedule.endTime;
    scheduleActive.checked = schedule.isActive;
    scheduleStatusLabel.textContent = schedule.isActive ? 'Active' : 'Inactive';
    document.getElementById('schedule-management').scrollIntoView({ behavior: 'smooth' });
}
function deleteSchedule(id) {
    if (!isSystemOn) {
        alert('System is OFF. Turn on the system to delete schedules.');
        return;
    }

    if (!confirm('Are you sure you want to delete this schedule?')) return;

    teacherSchedules = teacherSchedules.filter(s => s.id !== id);
    saveSchedules();
    updateSchedulesTable();
    alert('Schedule deleted successfully!');
}
function toggleSchedule(id) {
    if (!isSystemOn) {
        alert('System is OFF. Turn on the system to toggle schedules.');
        return;
    }

    const schedule = teacherSchedules.find(s => s.id === id);
    if (!schedule) return;

    schedule.isActive = !schedule.isActive;
    saveSchedules();
    updateSchedulesTable();

    const status = schedule.isActive ? 'activated' : 'deactivated';
    alert(`Schedule ${status} successfully!`);
}
function clearScheduleFormFunc() {
    editingScheduleId = null;
    scheduleAdviserSelect.value = '';
    scheduleDay.value = 'monday';
    scheduleStartTime.value = '08:00';
    scheduleEndTime.value = '17:00';
    scheduleActive.checked = true;
    scheduleStatusLabel.textContent = 'Active';
}
function activateAllSchedulesFunc() {
    if (!isSystemOn) {
        alert('System is OFF. Turn on the system to activate schedules.');
        return;
    }

    if (!confirm('Activate all schedules?')) return;

    teacherSchedules.forEach(schedule => {
        schedule.isActive = true;
    });

    saveSchedules();
    updateSchedulesTable();
    alert('All schedules activated!');
}
function deactivateAllSchedulesFunc() {
    if (!isSystemOn) {
        alert('System is OFF. Turn on the system to deactivate schedules.');
        return;
    }

    if (!confirm('Deactivate all schedules?')) return;

    teacherSchedules.forEach(schedule => {
        schedule.isActive = false;
    });

    saveSchedules();
    updateSchedulesTable();
    alert('All schedules deactivated!');
}
function updateScheduleStatusLabel() {
    scheduleStatusLabel.textContent = scheduleActive.checked ? 'Active' : 'Inactive';
}
function initializeScheduleEventListeners() {
    saveScheduleBtn.addEventListener('click', saveSchedule);
    clearScheduleForm.addEventListener('click', clearScheduleFormFunc);
    activateAllSchedules.addEventListener('click', activateAllSchedulesFunc);
    deactivateAllSchedules.addEventListener('click', deactivateAllSchedulesFunc);
    scheduleActive.addEventListener('change', updateScheduleStatusLabel);
    document.addEventListener('click', function(e) {
        if (e.target.closest('.btn-edit-schedule')) {
            const btn = e.target.closest('.btn-edit-schedule');
            const id = parseInt(btn.dataset.id);
            editSchedule(id);
        }
        
        if (e.target.closest('.btn-delete-schedule')) {
            const btn = e.target.closest('.btn-delete-schedule');
            const id = parseInt(btn.dataset.id);
            deleteSchedule(id);
        }
        
        if (e.target.closest('.btn-toggle-schedule')) {
            const btn = e.target.closest('.btn-toggle-schedule');
            const id = parseInt(btn.dataset.id);
            toggleSchedule(id);
        }
    });
}
function startScheduleMonitoring() {
    updateScheduleStatistics();
    setInterval(updateScheduleStatistics, 60000);
}
function updateWallUI() {
    console.log('Updating wall UI with state:', wallState);
    wallNorthToggle.checked = wallState.north === 'plywood';
    wallEastToggle.checked = wallState.east === 'plywood';
    wallSouthToggle.checked = wallState.south === 'plywood';
    wallWestToggle.checked = wallState.west === 'plywood';
    wallItems.forEach(item => {
        const side = item.dataset.side;
        const wallType = wallState[side];
        item.className = `wall-item wall-${side} ${wallType}`;
        const toggleContainer = item.querySelector('.wall-toggle-container');
        if (toggleContainer) {
            const labels = toggleContainer.querySelectorAll('.wall-type-label');
            if (labels.length >= 2) {
                labels[0].style.color = wallType === 'concrete' ? '#fff' : '#8b949e';
                labels[1].style.color = wallType === 'plywood' ? '#fff' : '#8b949e';
            }
        }
    });
    let concreteWalls = 0;
    let plywoodWalls = 0;

    Object.values(wallState).forEach(type => {
        if (type === 'concrete') concreteWalls++;
        else plywoodWalls++;
    });

    concreteCount.textContent = concreteWalls;
    plywoodCount.textContent = plywoodWalls;
    wallSummary.textContent = `${concreteWalls} Concrete, ${plywoodWalls} Plywood`;
    let footerStatus = 'Mixed';
    if (concreteWalls === 4) footerStatus = 'All Concrete';
    else if (plywoodWalls === 4) footerStatus = 'All Plywood';
    else if (concreteWalls > plywoodWalls) footerStatus = 'Mostly Concrete';
    else if (plywoodWalls > concreteWalls) footerStatus = 'Mostly Plywood';

    footerWallStatus.textContent = footerStatus;
    wallSystemStatus.textContent = 'Configured';
    let adjustmentRating = 'Medium';
    if (concreteWalls === 4) adjustmentRating = 'High (Increases readings)';
    else if (plywoodWalls === 4) adjustmentRating = 'Low (Decreases readings)';
    else if (concreteWalls >= 3) adjustmentRating = 'Medium-High';
    else if (plywoodWalls >= 3) adjustmentRating = 'Medium-Low';

    noiseAdjustment.textContent = adjustmentRating;
    updateSidebarBadges();

    console.log(`Wall composition: ${concreteWalls} concrete, ${plywoodWalls} plywood`);
}
function initializeWallToggles() {
    console.log('Initializing wall toggles');
    updateWallUI();
    wallNorthToggle.addEventListener('change', function() {
        if (!isSystemOn) {
            this.checked = !this.checked;
            alert('System is OFF. Turn on the system to change wall settings.');
            return;
        }
        console.log('North wall toggle changed');
        wallState.north = this.checked ? 'plywood' : 'concrete';
        updateWallUI();
        saveWallState();
    });

    wallEastToggle.addEventListener('change', function() {
        if (!isSystemOn) {
            this.checked = !this.checked;
            alert('System is OFF. Turn on the system to change wall settings.');
            return;
        }
        console.log('East wall toggle changed');
        wallState.east = this.checked ? 'plywood' : 'concrete';
        updateWallUI();
        saveWallState();
    });

    wallSouthToggle.addEventListener('change', function() {
        if (!isSystemOn) {
            this.checked = !this.checked;
            alert('System is OFF. Turn on the system to change wall settings.');
            return;
        }
        console.log('South wall toggle changed');
        wallState.south = this.checked ? 'plywood' : 'concrete';
        updateWallUI();
        saveWallState();
    });

    wallWestToggle.addEventListener('change', function() {
        if (!isSystemOn) {
            this.checked = !this.checked;
            alert('System is OFF. Turn on the system to change wall settings.');
            return;
        }
        console.log('West wall toggle changed');
        wallState.west = this.checked ? 'plywood' : 'concrete';
        updateWallUI();
        saveWallState();
    });
    setAllConcreteBtn.addEventListener('click', function() {
        if (!isSystemOn) {
            alert('System is OFF. Turn on the system to change wall settings.');
            return;
        }
        console.log('Setting all walls to concrete');
        wallState.north = 'concrete';
        wallState.east = 'concrete';
        wallState.south = 'concrete';
        wallState.west = 'concrete';
        updateWallUI();
        saveWallState();
    });

    setAllPlywoodBtn.addEventListener('click', function() {
        if (!isSystemOn) {
            alert('System is OFF. Turn on the system to change wall settings.');
            return;
        }
        console.log('Setting all walls to plywood');
        wallState.north = 'plywood';
        wallState.east = 'plywood';
        wallState.south = 'plywood';
        wallState.west = 'plywood';
        updateWallUI();
        saveWallState();
    });
}
function stopAutoSimulation() {
    isAutoSimulating = false;
    if (autoSimulateInterval) {
        clearInterval(autoSimulateInterval);
        autoSimulateInterval = null;
    }
    autoSimulateBtn.innerHTML = '<i class="fas fa-play"></i> Auto Simulate';
    autoSimulateBtn.classList.remove('active');
    console.log('Stopped auto simulation');
}
function initializeNoiseSimulation() {
    console.log('Initializing noise simulation buttons');
    simulateQuietBtn.addEventListener('click', function(e) {
        console.log('Quiet simulation clicked');
        e.stopPropagation();
        if (!isSystemOn) {
            alert('System is OFF. Turn on the system to simulate noise.');
            return;
        }
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
        if (!isSystemOn) {
            alert('System is OFF. Turn on the system to simulate noise.');
            return;
        }
        if (isAutoSimulating) {
            console.log('Auto simulation is running, ignoring manual click');
            return;
        }
        const moderateDecibels = 80;
        console.log(`Moderate simulation: ${moderateDecibels} dB`);
        updateNoiseDisplay(moderateDecibels);
    });

    simulateLoudBtn.addEventListener('click', function(e) {
        console.log('Loud simulation clicked');
        e.stopPropagation();
        if (!isSystemOn) {
            alert('System is OFF. Turn on the system to simulate noise.');
            return;
        }
        if (isAutoSimulating) {
            console.log('Auto simulation is running, ignoring manual click');
            return;
        }
        const loudDecibels =120;
        console.log(`Loud simulation: ${loudDecibels} dB`);
        updateNoiseDisplay(loudDecibels);
    });

    autoSimulateBtn.addEventListener('click', function(e) {
        console.log('Auto simulate clicked');
        e.stopPropagation();
        if (!isSystemOn) {
            alert('System is OFF. Turn on the system to use auto simulation.');
            return;
        }
        if (!isAutoSimulating) {
            isAutoSimulating = true;
            autoSimulateBtn.innerHTML = '<i class="fas fa-stop"></i> Stop Auto Simulate';
            autoSimulateBtn.classList.add('active');

            console.log('Starting auto simulation');
            autoSimulateInterval = setInterval(function() {
                const sequence = [50, 80, 110];
                const newDecibels = sequence[autoSimulateStep % sequence.length];
                autoSimulateStep++;

                console.log(`Auto simulation: ${newDecibels} dB`);
                updateNoiseDisplay(newDecibels);
            }, 3000);
        } else {
            stopAutoSimulation();
        }
    });
}
function downloadReadingsAsText() {
    if (readingsHistory.length === 0) {
        alert('No readings to download');
        return;
    }

    let text = 'NOISE MONITORING SYSTEM - READINGS REPORT\n';
    text += '===========================================\n\n';
    const now = new Date();
    text += `Report Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}\n`;
    text += `System Status: ${isSystemOn ? 'ON' : 'OFF'}\n`;
    text += `Current System Status: ${adviserSystemStatus.textContent}\n`;
    text += `Active Advisers: ${presentCount.textContent}\n`;
    text += `Scheduled Advisers: ${currentlyScheduled.textContent}\n`;
    text += `Wall Composition: ${concreteCount.textContent} Concrete, ${plywoodCount.textContent} Plywood\n`;
    text += `Email Notifications: ${emailSettings.enabled ? 'Enabled' : 'Disabled'}\n`;
    text += `Total Emails Sent: ${totalEmailsSent.textContent}\n\n`;
    text += '='.repeat(50) + '\n\n';
    text += 'RECENT READINGS\n';
    text += '='.repeat(50) + '\n';
    text += 'Time\t\tSource dB\tMeasured dB\tStatus\t\tEmail Status\tRecipients\n';
    text += '─'.repeat(100) + '\n';
    const regularReadings = readingsHistory.filter(r => !r.isSystemEvent);
    
    regularReadings.forEach((reading, index) => {
        const time = reading.time.padEnd(10, ' ');
        const source = `${reading.originalDecibels} dB`.padEnd(12, ' ');
        const measured = `${reading.measuredDecibels} dB`.padEnd(14, ' ');
        const status = reading.status.padEnd(12, ' ');
        const email = reading.emailStatus.padEnd(12, '');
        const recipients = reading.recipients.length > 0
            ? reading.recipients.join(', ')
            : 'None';

        text += `${time}\t${source}\t${measured}\t${status}\t${email}\t${recipients}\n`;
        if (reading.sessionInfo) {
            text += `\t Session: ${reading.sessionInfo}\n`;
        }
        if ((index + 1) % 3 === 0 && index !== regularReadings.length - 1) {
            text += '─'.repeat(100) + '\n';
        }
    });

    text += '\n' + '='.repeat(50) + '\n\n';
    text += 'SUMMARY STATISTICS\n';
    text += '='.repeat(50) + '\n';

    const quietReadings = regularReadings.filter(r => r.status === 'Quiet').length;
    const moderateReadings = regularReadings.filter(r => r.status === 'Moderate').length;
    const loudReadings = regularReadings.filter(r => r.status === 'Loud').length;

    const emailSent = regularReadings.filter(r => r.emailStatus === 'Sent').length;
    const emailFailed = regularReadings.filter(r => r.emailStatus === 'Failed').length;
    const emailOnCooldown = regularReadings.filter(r => r.emailStatus === 'On Cooldown').length;
    const emailNoSchedule = regularReadings.filter(r => r.emailStatus === 'No Scheduled Advisers').length;

    text += `Total Readings: ${regularReadings.length}\n`;
    text += `Quiet Readings: ${quietReadings} (${regularReadings.length > 0 ? Math.round((quietReadings / regularReadings.length) * 100) : 0}%)\n`;
    text += `Moderate Readings: ${moderateReadings} (${regularReadings.length > 0 ? Math.round((moderateReadings / regularReadings.length) * 100) : 0}%)\n`;
    text += `Loud Readings: ${loudReadings} (${regularReadings.length > 0 ? Math.round((loudReadings / regularReadings.length) * 100) : 0}%)\n\n`;

    text += `Email Sent Successfully: ${emailSent}\n`;
    text += `Email Failed: ${emailFailed}\n`;
    text += `Email Blocked (Cooldown): ${emailOnCooldown}\n`;
    text += `Email Blocked (No Schedule): ${emailNoSchedule}\n`;
    let avgOriginal = 0;
    let avgMeasured = 0;
    let avgAdjustment = 0;
    
    if (regularReadings.length > 0) {
        avgOriginal = regularReadings.reduce((sum, r) => sum + r.originalDecibels, 0) / regularReadings.length;
        avgMeasured = regularReadings.reduce((sum, r) => sum + r.measuredDecibels, 0) / regularReadings.length;
        avgAdjustment = regularReadings.reduce((sum, r) => sum + (r.measuredDecibels - r.originalDecibels), 0) / regularReadings.length;
    }

    text += `\nAverage Source dB: ${avgOriginal.toFixed(2)}\n`;
    text += `Average Measured dB: ${avgMeasured.toFixed(2)}\n`;
    text += `Average Wall Adjustment: ${avgAdjustment.toFixed(2)} dB\n`;

    text += '\n' + '='.repeat(50) + '\n';
    text += 'END OF REPORT\n';
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
function printReadingsReport() {
    if (readingsHistory.length === 0) {
        alert('No readings to print');
        return;
    }

    const now = new Date();
    const printWindow = window.open('', '_blank');
    const regularReadings = readingsHistory.filter(r => !r.isSystemEvent);
    const quietReadings = regularReadings.filter(r => r.status === 'Quiet').length;
    const moderateReadings = regularReadings.filter(r => r.status === 'Moderate').length;
    const loudReadings = regularReadings.filter(r => r.status === 'Loud').length;

    const emailSent = regularReadings.filter(r => r.emailStatus === 'Sent').length;
    const emailFailed = regularReadings.filter(r => r.emailStatus === 'Failed').length;
    const emailOnCooldown = regularReadings.filter(r => r.emailStatus === 'On Cooldown').length;

    const avgOriginal = regularReadings.length > 0 
        ? regularReadings.reduce((sum, r) => sum + r.originalDecibels, 0) / regularReadings.length 
        : 0;
    const avgMeasured = regularReadings.length > 0 
        ? regularReadings.reduce((sum, r) => sum + r.measuredDecibels, 0) / regularReadings.length 
        : 0;

    let html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Noise Monitoring System - Readings Report</title>
            <link rel="stylesheet" href="style1.css">
        </head>
        <body class="print-report">
            <div class="header">
                <h1>Noise Monitoring System</h1>
                <div class="subtitle">Readings Report</div>
                <div>Generated: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>
            </div>

            <div class="section">
                <h2>System Information</h2>
                <div class="info-grid">
                    <div class="info-item">
                        <strong>System Status:</strong> ${isSystemOn ? 'ON' : 'OFF'}
                    </div>
                    <div class="info-item">
                        <strong>System Power:</strong> ${adviserSystemStatus.textContent}
                    </div>
                    <div class="info-item">
                        <strong>Active Advisers:</strong> ${presentCount.textContent} Present
                    </div>
                    <div class="info-item">
                        <strong>Scheduled Advisers:</strong> ${currentlyScheduled.textContent}
                    </div>
                    <div class="info-item">
                        <strong>Wall Composition:</strong> ${concreteCount.textContent} Concrete, ${plywoodCount.textContent} Plywood
                    </div>
                    <div class="info-item">
                        <strong>Email Notifications:</strong> ${emailSettings.enabled ? 'Enabled' : 'Disabled'}
                    </div>
                    <div class="info-item">
                        <strong>Total Emails Sent:</strong> ${totalEmailsSent.textContent}
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Recent Readings (${regularReadings.length} records)</h2>
    `;

    if (regularReadings.length === 0) {
        html += `<p style="text-align: center; color: #7f8c8d; padding: 20px;">No regular readings available.</p>`;
    } else {
        html += `
                <table>
                    <thead>
                        <tr>
                            <th>Time</th>
                            <th>Source dB</th>
                            <th>Measured dB</th>
                            <th>Status</th>
                            <th>Email Status</th>
                            <th>Recipients</th>
                        </tr>
                    </thead>
                    <tbody>
        `;

        regularReadings.forEach(reading => {
            const statusClass = `status-${reading.status.toLowerCase()}`;
            let emailClass = '';
            if (reading.emailStatus === 'Sent') emailClass = 'email-sent';
            else if (reading.emailStatus === 'Failed') emailClass = 'email-failed';
            else if (reading.emailStatus === 'On Cooldown') emailClass = 'email-cooldown';

            html += `
                <tr>
                    <td>${reading.time}</td>
                    <td>${reading.originalDecibels} dB</td>
                    <td>${reading.measuredDecibels} dB</td>
                    <td class="${statusClass}">${reading.status}</td>
                    <td class="${emailClass}">${reading.emailStatus}</td>
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
                        <div>${regularReadings.length > 0 ? Math.round((quietReadings / regularReadings.length) * 100) : 0}%</div>
                    </div>
                    <div class="summary-item summary-moderate">
                        <div style="font-size: 24px; font-weight: bold;">${moderateReadings}</div>
                        <div>Moderate Readings</div>
                        <div>${regularReadings.length > 0 ? Math.round((moderateReadings / regularReadings.length) * 100) : 0}%</div>
                    </div>
                    <div class="summary-item summary-loud">
                        <div style="font-size: 24px; font-weight: bold;">${loudReadings}</div>
                        <div>Loud Readings</div>
                        <div>${regularReadings.length > 0 ? Math.round((loudReadings / regularReadings.length) * 100) : 0}%</div>
                    </div>
                </div>

                <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
                    <div>
                        <h3>Email Statistics</h3>
                        <ul style="margin: 10px 0; padding-left: 20px;">
                            <li>Email Sent Successfully: <strong>${emailSent}</strong></li>
                            <li>Email Failed: <strong>${emailFailed}</strong></li>
                            <li>Email Blocked (Cooldown): <strong>${emailOnCooldown}</strong></li>
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
        `;
    }

    html += `
            <div class="footer">
                <p>Noise Monitoring System &copy; ${now.getFullYear()} | Admin Dashboard Report</p>
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
// Add Gmail connection test function
async function testGmailConnection() {
    try {
        console.log('Testing Gmail connection to ESP32...');
        const response = await fetch('/api/noise');
        if (response.ok) {
            const data = await response.json();
            console.log('Gmail connection test result:', data);
            return data.emailSent !== undefined;
        }
        return false;
    } catch (error) {
        console.error('Gmail connection test failed:', error);
        return false;
    }
}

// Update sync button text to reflect Gmail
const syncEmailsBtn = document.querySelector('.sync-btn');
if (syncEmailsBtn) {
    syncEmailsBtn.innerHTML = '<i class="fas fa-sync"></i> Sync Gmail';
}

testEmailBtn.addEventListener('click', async function() {
    if (!isSystemOn) {
        alert('System is OFF. Turn on the system to send test Gmail.');
        return;
    }

    const presentAdvisers = advisers.filter(a => a.status === 'present');
    if (presentAdvisers.length === 0) {
        alert('No present advisers to send test Gmail to');
        return;
    }
    
    // Check if advisers have Gmail addresses
    const advisersWithGmail = presentAdvisers.filter(a => a.number && a.number.includes('@'));
    if (advisersWithGmail.length === 0) {
        alert('No present advisers have Gmail addresses configured');
        return;
    }
    
    const currentDay = getCurrentDay();
    const currentTime = getCurrentTime();
    const currentTimeDisplay = formatTimeForDisplay(currentTime);
    
    const message = `Send test Gmail to ${advisersWithGmail.length} present adviser(s)?\n\n` +
                   `Current Time: ${currentTimeDisplay}\n` +
                   `Current Day: ${capitalizeFirst(currentDay)}\n\n` +
                   `Note: Gmail will only be sent to advisers who are:\n` +
                   `1. Present\n` +
                   `2. Have an active schedule for ${currentTimeDisplay} on ${capitalizeFirst(currentDay)}\n` +
                   `3. Have Gmail addresses configured`;
    
    if (confirm(message)) {
        const originalText = testEmailBtn.innerHTML;
        testEmailBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending Gmail...';
        testEmailBtn.disabled = true;

        try {
            // Test Gmail connection first
            const connectionOk = await testGmailConnection();
            if (!connectionOk) {
                throw new Error('ESP32 Gmail connection not responding');
            }
            
            // Sync email addresses to hardware first
            console.log('Syncing Gmail addresses before test...');
            await syncEmailAddressesToHardware();
            
            // Small delay to ensure ESP32 processes the addresses
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            // Send test email
            const success = await sendEmail(85, 'Loud (Test)', advisersWithGmail.map(a => a.name));

            if (success) {
                alert(`✓ Test Gmail sent successfully!\n\n` +
                      `Check the Recent Readings table for details on which advisers received the Gmail.\n` +
                      `The ESP32 hardware will send the actual Gmail messages.`);
            } else {
                alert(`✗ Failed to send test Gmail.\n\n` +
                      `Possible reasons:\n` +
                      `• No advisers are scheduled for current time (${currentTimeDisplay})\n` +
                      `• All scheduled advisers already notified this session\n` +
                      `• ESP32 Gmail connection issues\n` +
                      `• Check console for detailed logs`);
            }

        } catch (error) {
            console.error('Test Gmail error:', error);
            alert(`✗ Error sending test Gmail: ${error.message}\n\n` +
                  'Please check the console for detailed error information.');
        } finally {
            testEmailBtn.innerHTML = originalText;
            testEmailBtn.disabled = false;
        }
    }
});
closeEditModal.addEventListener('click', closeEditModalFunc);
cancelEditBtn.addEventListener('click', closeEditModalFunc);
editModalOverlay.addEventListener('click', function(e) {
    if (e.target === editModalOverlay) closeEditModalFunc();
});
logoutBtn.addEventListener('click', function() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('isLoggedIn');
        stopAutoSimulation();
        if (emailCooldownTimer) {
            clearInterval(emailCooldownTimer);
        }
        window.location.href = 'index.html';
    }
});
function loadSavedState() {
    const savedSystemPower = localStorage.getItem('systemPower');
    if (savedSystemPower !== null) {
        isSystemOn = savedSystemPower === 'true';
    }
    const savedState = localStorage.getItem('noiseMonitorState');
    if (savedState) {
        const state = JSON.parse(savedState);
        currentDecibels = state.currentDecibels || 65;
        readingsHistory = state.readingsHistory || [];
    }
    const savedAdvisers = localStorage.getItem('advisers');
    if (savedAdvisers) {
        advisers = JSON.parse(savedAdvisers);
    } else {
        advisers = [
            {
                id: 1,
                name: "Mark Jarred Malacao",
                subject: "Adviser 1",
                number: "markjarredmalacao540@gmail.com",
                status: "present"
            },
            {
                id: 2,
                name: "Serene XDA",
                subject: "Adviser 2",
                number: "serenexda@gmail.com",
                status: "present"
            },
            {
                id: 3,
                name: "Maxine 101408",
                subject: "Adviser 3",
                number: "maxine101408@gmail.com",
                status: "present"
            }
        ];
        saveAdvisers();
    }
    const savedEmailSettings = localStorage.getItem('emailSettings');
    if (savedEmailSettings) {
        emailSettings = JSON.parse(savedEmailSettings);
    }
    const savedCooldown = localStorage.getItem('emailCooldown');
    if (savedCooldown) {
        emailCooldown = JSON.parse(savedCooldown);
    }
    const savedNotified = localStorage.getItem('adviserNotifiedInSession');
    if (savedNotified) {
        try {
            const parsed = JSON.parse(savedNotified);
            adviserNotifiedInSession = typeof parsed === 'object' && parsed !== null ? parsed : {};
        } catch (e) {
            adviserNotifiedInSession = {};
        }
    }
    const savedSchedules = localStorage.getItem('teacherSchedules');
    if (savedSchedules) {
        teacherSchedules = JSON.parse(savedSchedules);
    } else {
        const now = new Date();
        const currentHour = now.getHours().toString().padStart(2, '0');
        const currentMinute = now.getMinutes().toString().padStart(2, '0');
        const currentTime = `${currentHour}:${currentMinute}`;
        const nextHour = (now.getHours() + 1) % 24;
        const endTime = `${nextHour.toString().padStart(2, '0')}:${currentMinute}`;
        
        teacherSchedules = [
            {
                id: 1,
                teacherId: 1,
                day: getCurrentDay(),
                startTime: currentTime,
                endTime: endTime,
                isActive: true
            },
            {
                id: 2,
                teacherId: 3,
                day: getCurrentDay(),
                startTime: currentTime,
                endTime: endTime,
                isActive: true
            }
        ];
        saveSchedules();
    }
    const savedSessions = localStorage.getItem('emailSessions');
    if (savedSessions) {
        emailSessions = JSON.parse(savedSessions);
    }
    const savedWallState = localStorage.getItem('wallCheckerState');
    if (savedWallState) {
        wallState = JSON.parse(savedWallState);
    }
    updateEmailSettingsUI();
    updateCooldownUI();
    updateScheduleStatistics();
}
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

function saveEmailSettings() {
    localStorage.setItem('emailSettings', JSON.stringify(emailSettings));
}

function saveCooldownSettings() {
    localStorage.setItem('emailCooldown', JSON.stringify(emailCooldown));
}
function saveAdviserNotifiedInSession() {
    const toSave = {};
    Object.keys(adviserNotifiedInSession).forEach(k => { toSave[k] = adviserNotifiedInSession[k]; });
    localStorage.setItem('adviserNotifiedInSession', JSON.stringify(toSave));
}

function saveSchedules() {
    localStorage.setItem('teacherSchedules', JSON.stringify(teacherSchedules));
}

function saveEmailSessions() {
    localStorage.setItem('emailSessions', JSON.stringify(emailSessions));
}

function saveWallState() {
    localStorage.setItem('wallCheckerState', JSON.stringify(wallState));
}

function saveSystemPower() {
    localStorage.setItem('systemPower', isSystemOn.toString());
}
function capitalizeFirst(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function debugSchedules() {
    console.log('\n=== SCHEDULE DEBUG INFO ===');
    console.log(`Current Time: ${getCurrentTime()} (${formatTimeForDisplay(getCurrentTime())})`);
    console.log(`Current Day: ${getCurrentDay()}`);
    console.log(`\nActive Schedules:`);
    
    teacherSchedules.forEach((schedule, index) => {
        const adviser = advisers.find(a => a.id === schedule.teacherId);
        console.log(`${index + 1}. ${adviser ? adviser.name : 'Unknown'} - ${schedule.day} ${schedule.startTime}-${schedule.endTime} (${schedule.isActive ? 'Active' : 'Inactive'})`);
    });
    
    console.log(`\nPresent Advisers:`);
    advisers.filter(a => a.status === 'present').forEach((adviser, index) => {
        const schedules = teacherSchedules.filter(s => s.teacherId === adviser.id && s.isActive);
        console.log(`${index + 1}. ${adviser.name} - ${schedules.length} active schedule(s)`);
    });
}
document.addEventListener('keydown', function(event) {
    if (!isSystemOn) return;

    const target = event.target;
    const tagName = target && target.tagName ? target.tagName.toUpperCase() : '';
    const isTypingField = tagName === 'INPUT' || tagName === 'TEXTAREA' || (target && target.isContentEditable);

    switch(event.key) {
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
        case 'o':
            if (event.ctrlKey && event.shiftKey) {
                event.preventDefault();
                systemPowerToggle.click();
                alert(`System ${systemPowerToggle.checked ? 'turned ON' : 'turned OFF'}`);
            }
            break;
    }
});
window.addEventListener('load', function() {
    setTimeout(function() {
        alert('Tip: Use keyboard shortcuts:\n' +
              'Ctrl+D = Download readings\n' +
              'Ctrl+P = Print report\n' +
              'Ctrl+B = Toggle sidebar\n' +
              'Ctrl+Shift+A = Toggle auto-scroll\n' +
              'Ctrl+Shift+O = Toggle system power');
    }, 1000);
});
document.addEventListener('visibilitychange', function() {
    if (document.hidden && isAutoSimulating) {
        clearInterval(autoSimulateInterval);
        autoSimulateBtn.setAttribute('data-paused', 'true');
    } else if (!document.hidden && isAutoSimulating && autoSimulateBtn.getAttribute('data-paused') === 'true') {
        autoSimulateBtn.removeAttribute('data-paused');
        autoSimulateInterval = setInterval(function() {
            const sequence = [50, 80, 110];
            const newDecibels = sequence[autoSimulateStep % sequence.length];
            autoSimulateStep++;

            updateNoiseDisplay(newDecibels);
        }, 3000);
    }
});
window.addEventListener('beforeunload', function() {
    if (isAutoSimulating) {
        clearInterval(autoSimulateInterval);
    }
    if (smsCooldownTimer) {
        clearInterval(smsCooldownTimer);
    }
});
document.addEventListener('click', function(event) {
    if (window.innerWidth <= 768 && isSidebarOpen) {
        if (!sidebar.contains(event.target) && !sidebarToggle.contains(event.target)) {
            closeSidebar();
        }
    }
});