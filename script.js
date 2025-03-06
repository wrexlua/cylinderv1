window.onscroll = function () {
    var navbar = document.querySelector(".navbar");
    if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
};

const fetch_api = (route) => {
    return fetch(`https://weao.xyz/api/${route}`)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .catch(error => {
            console.error('Fetch error:', error.message);
            return { error: true }; // Hata durumunda hata nesnesi döndür
        });
};

const getPlatformIcon = (platform) => {
    switch (platform.toLowerCase()) {
        case 'windows':
            return '<i class="fab fa-windows platform-icon"></i>';
        case 'mac':
            return '<i class="fab fa-apple platform-icon"></i>';
        case 'android':
            return '<i class="fab fa-android platform-icon"></i>';
        case 'n/a':
            return '<i class="fas fa-question platform-icon"></i>';
        default:
            return '';
    }
};

const FreeIcon = (isFree) => {
    return isFree ? 'Free' : 'Paid';
};

const DetectedIcon = (isDetected) => {
    return isDetected ? 'Detected' : 'Undetected';
};

const DetectionTags = (suncPercentage, uncPercentage) => {
    return `
        <div class="detection-tags">
            ${suncPercentage !== undefined && suncPercentage !== null ? `<span class="detection-tag">${suncPercentage}% SUNC</span>` : ''}
            ${uncPercentage !== undefined && uncPercentage !== null ? `<span class="detection-tag">${uncPercentage}% UNC</span>` : ''}
            <span class="detection-tag ${suncPercentage > 0 || uncPercentage > 0 ? 'detected' : 'undetected'}">${DetectedIcon((suncPercentage > 0 || uncPercentage > 0) && suncPercentage !== null && uncPercentage !== null)}</span>
        </div>
    `;
};

const Cards = (title, details, extra) => {
    const platformIcon = getPlatformIcon(title.toLowerCase());
    const card = document.createElement('div');
    card.className = 'version-card';
    card.innerHTML = `
        <div class="card-header">
            <h3>${platformIcon} ${title}</h3>
        </div>
        <p>${details}</p>
        <div class="details">
            <div><span>Version</span><span>${extra.version || 'N/A'}</span></div>
            <div><span>Date</span><span>${extra.date || 'N/A'}</span></div>
        </div>
    `;
    return card;
};

const Card = (exploit) => {
    const card = document.createElement('div');
    const platformIcon = getPlatformIcon(exploit.platform);
    const access = FreeIcon(exploit.free);
    // updateStatus false ise kırmızı, true ise yeşil
    card.className = `exploit-card ${exploit.updateStatus ? 'status-updated' : 'status-not-updated'}`;
    // DOM'da sınıfın doğru uygulandığını kontrol etmek için
    card.setAttribute('data-update-status', exploit.updateStatus ? 'true' : 'false');
    card.innerHTML = `
        <div class="card-header">
            <h3>${exploit.title}</h3>
            <span class="status-tag">${exploit.updateStatus ? 'Updated' : 'Not Updated'}</span>
        </div>
        <div class="version">Version ${exploit.version}</div>
        ${DetectionTags(exploit.suncPercentage, exploit.uncPercentage)}
        <div class="details">
            <div><span>Platform</span><span>${exploit.platform}</span></div>
            <div><span>RBX Version</span><span>${exploit.rbxversion}</span></div>
            <div><span>Access</span><span>${access}</span></div>
        </div>
        <p><strong>Last Updated:</strong> ${exploit.updatedDate}</p>
        <div class="cta">
            <a href="${exploit.discordlink}" target="_blank" class="discord-link"><i class="fab fa-discord"></i> Discord</a>
            <a href="${exploit.websitelink}" target="_blank" class="website-link"><i class="fas fa-globe"></i> Website</a>
        </div>
    `;
    // Hata ayıklamayı artırma
    console.log(`Applying class: exploit-card ${exploit.updateStatus ? 'status-updated' : 'status-not-updated'} for ${exploit.title} (updateStatus: ${exploit.updateStatus})`);
    return card;
};

const fetchCurrentVersions = () => {
    fetch_api('versions/current')
        .then(data => {
            const container = document.getElementById('current-versions');
            container.innerHTML = '';
            if (data && !data.error && data.Windows && data.Mac) {
                container.appendChild(Cards('Windows', '', { version: data.Windows, date: data.WindowsDate }));
                container.appendChild(Cards('Mac', '', { version: data.Mac, date: data.MacDate }));
            } else if (data.error) {
                container.innerHTML = '<p>Failed to load versions. Check API connection.</p>';
            } else {
                console.warn('Unexpected data format for current versions:', data);
                container.innerHTML = '<p>Failed to load versions. Unexpected data format.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching current versions:', error);
            const container = document.getElementById('current-versions');
            container.innerHTML = '<p>Error loading versions.</p>';
        });
};

const fetchFutureVersions = () => {
    fetch_api('versions/future')
        .then(data => {
            const container = document.getElementById('future-versions');
            container.innerHTML = '';
            if (data && !data.error && data.Windows && data.Mac) {
                container.appendChild(Cards('Windows', '', { version: data.Windows, date: data.WindowsDate }));
                container.appendChild(Cards('Mac', '', { version: data.Mac, date: data.MacDate }));
            } else if (data.error) {
                container.innerHTML = '<p>Failed to load versions. Check API connection.</p>';
            } else {
                console.warn('Unexpected data format for future versions:', data);
                container.innerHTML = '<p>Failed to load versions. Unexpected data format.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching future versions:', error);
            const container = document.getElementById('future-versions');
            container.innerHTML = '<p>Error loading versions.</p>';
        });
};

const fetchAndroidVersion = () => {
    fetch_api('versions/android')
        .then(data => {
            const container = document.getElementById('android-version');
            container.innerHTML = '';
            if (data && !data.error && data.Android) {
                container.appendChild(Cards('Android', '', { version: data.Android, date: data.AndroidDate }));
            } else if (data.error) {
                container.innerHTML = '<p>Failed to load version. Check API connection.</p>';
            } else {
                console.warn('Unexpected data format for android version:', data);
                container.innerHTML = '<p>Failed to load version. Unexpected data format.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching Android version:', error);
            const container = document.getElementById('android-version');
            container.innerHTML = '<p>Error loading version.</p>';
        });
};

const fetchExploitStatus = () => {
    fetch_api('status/exploits')
        .then(data => {
            const exploitStatus = document.getElementById('exploit-status');
            exploitStatus.innerHTML = '';
            if (Array.isArray(data)) {
                data.forEach(exploit => {
                    exploitStatus.appendChild(Card(exploit));
                });
            } else if (data.error) {
                exploitStatus.innerHTML = '<p>Failed to load exploits. Check API connection.</p>';
            } else {
                console.warn('Unexpected data format for exploits:', data);
                exploitStatus.innerHTML = '<p>Failed to load exploits. Unexpected data format.</p>';
            }
        })
        .catch(error => {
            console.error('Error fetching exploit statuses:', error);
            const exploitStatus = document.getElementById('exploit-status');
            exploitStatus.innerHTML = '<p>Error loading exploits.</p>';
        });
};

const refreshAll = () => {
    fetchCurrentVersions();
    fetchFutureVersions();
    fetchExploitStatus();
    fetchAndroidVersion();
};

refreshAll();

const createCountdown = () => {
    const footer = document.querySelector('footer');
    const countdownDiv = document.createElement('div');
    countdownDiv.id = 'countdown';
    footer.appendChild(countdownDiv);

    let timeLeft = 15;
    const updateCountdown = () => {
        countdownDiv.textContent = `Auto-refreshing in ${timeLeft} seconds`;
        timeLeft--;
        if (timeLeft < 0) {
            timeLeft = 15;
            refreshAll();
        }
    };
    
    updateCountdown();
    setInterval(updateCountdown, 1000);
};

function createAnimatedBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    const particles = [];
    const particleCount = 80;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.2 + 0.3;
            this.speedX = Math.random() * 0.2 - 0.1;
            this.speedY = Math.random() * 0.2 - 0.1;
            this.life = 1;
            this.maxLife = Math.random() * 4 + 2;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            this.life -= 0.002;
            if (this.life <= 0) {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.life = 1;
            }
        }

        draw() {
            ctx.fillStyle = `rgba(0, 180, 255, ${this.life * 0.6})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            particles.forEach(other => {
                const dx = this.x - other.x;
                const dy = this.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    ctx.strokeStyle = `rgba(0, 180, 255, ${0.1 * this.life})`;
                    ctx.lineWidth = 0.2;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.stroke();
                }
            });
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        requestAnimationFrame(animate);
    }

    animate();

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}

createAnimatedBackground();
createCountdown();