const updateMessages = [];

async function loadOSInfo() {
  try {
    const osInfo = await window.electronAPI.getOSInfo();
    displayOSInfo(osInfo);
  } catch (error) {
    console.error('Error loading OS info:', error);
    document.getElementById('os-info').innerHTML = `
      <div class="info-item">
        <div class="info-label">Error</div>
        <div class="info-value">Failed to load OS information</div>
      </div>
    `;
  }
}

function displayOSInfo(info) {
  const container = document.getElementById('os-info');
  container.innerHTML = '';

  const items = [
    { label: 'Platform', value: info.platform },
    { label: 'Architecture', value: info.arch },
    { label: 'Hostname', value: info.hostname },
    { label: 'OS Release', value: info.release },
    { label: 'OS Version', value: info.version },
    { label: 'Total Memory', value: info.totalMemory },
    { label: 'Free Memory', value: info.freeMemory },
    { label: 'CPU Model', value: info.cpus },
    { label: 'CPU Cores', value: info.cpuCores },
    { label: 'System Uptime', value: info.uptime },
    { label: 'Home Directory', value: info.homeDir },
    { label: 'Temp Directory', value: info.tempDir }
  ];

  items.forEach(item => {
    const div = document.createElement('div');
    div.className = 'info-item';
    div.innerHTML = `
      <div class="info-label">${item.label}</div>
      <div class="info-value">${item.value}</div>
    `;
    container.appendChild(div);
  });
}

function addUpdateMessage(message) {
  const timestamp = new Date().toLocaleTimeString();
  updateMessages.push({ timestamp, message });

  const messagesContainer = document.getElementById('update-messages');
  const messageDiv = document.createElement('div');
  messageDiv.className = 'update-message';
  messageDiv.innerHTML = `<span class="timestamp">${timestamp}</span>${message}`;
  messagesContainer.appendChild(messageDiv);
  messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function showUpdateStatus(message, type = 'info') {
  const statusDiv = document.getElementById('update-status');
  statusDiv.classList.add('show');

  if (type === 'error') {
    statusDiv.classList.add('error');
    statusDiv.classList.remove('success');
  } else if (type === 'success') {
    statusDiv.classList.add('success');
    statusDiv.classList.remove('error');
  } else {
    statusDiv.classList.remove('error', 'success');
  }

  addUpdateMessage(message);
}

document.getElementById('check-updates-btn').addEventListener('click', async () => {
  const btn = document.getElementById('check-updates-btn');
  const originalText = btn.textContent;

  btn.disabled = true;
  btn.innerHTML = 'Checking... <span class="loading"></span>';

  try {
    const result = await window.electronAPI.checkForUpdates();

    if (result && result.error) {
      showUpdateStatus('Error checking for updates: ' + result.error, 'error');
    } else {
      showUpdateStatus('Update check initiated. Check messages below for details.', 'info');
    }
  } catch (error) {
    showUpdateStatus('Failed to check for updates: ' + error.message, 'error');
  } finally {
    btn.disabled = false;
    btn.textContent = originalText;
  }
});

document.getElementById('refresh-btn').addEventListener('click', () => {
  loadOSInfo();
  showUpdateStatus('OS information refreshed', 'success');
});

window.electronAPI.onUpdateStatus((message) => {
  showUpdateStatus(message, 'info');
});

loadOSInfo();
