document.addEventListener('DOMContentLoaded', function() {
    const cookie = document.getElementById('cookie');
    const scoreDisplay = document.getElementById('score');
    const gameContainer = document.getElementById('game-container');
    const buyUpgradeButton = document.getElementById('buy-upgrade');
    const upgradesOwnedDisplay = document.getElementById('upgrades-owned');
    const buyMultiplierButton = document.getElementById('buy-multiplier');
    const multipliersOwnedDisplay = document.getElementById('multipliers-owned');
    const usernameInput = document.getElementById('username-input');
    const startGameButton = document.getElementById('start-game');
    const usernameContainer = document.getElementById('username-container');
    const settingsButton = document.getElementById('settings-button');
    const settingsPanel = document.getElementById('settings-panel');
    const wipeSaveButton = document.getElementById('wipe-save-button');

    // Initially hide game elements
    gameContainer.style.display = 'none';
    settingsPanel.style.display = 'none';

    // Load saved game state or set default values if none exist
    let score = parseFloat(localStorage.getItem('score')) || 0;
    let upgradesOwned = parseInt(localStorage.getItem('upgradesOwned'), 10) || 0;
    let multipliersOwned = parseInt(localStorage.getItem('multipliersOwned'), 10) || 0;
    let upgradeCost = parseInt(localStorage.getItem('upgradeCost'), 10) || 10;
    let multiplierCost = parseInt(localStorage.getItem('multiplierCost'), 10) || 20;
    let cookiesPerSecond = parseFloat(localStorage.getItem('cookiesPerSecond')) || 0.5;
    let cookiesPerClick = parseFloat(localStorage.getItem('cookiesPerClick')) || 1;
    let username = localStorage.getItem('username') || '';

    function saveGame() {
        localStorage.setItem('score', score);
        localStorage.setItem('upgradesOwned', upgradesOwned);
        localStorage.setItem('multipliersOwned', multipliersOwned);
        localStorage.setItem('upgradeCost', upgradeCost);
        localStorage.setItem('multiplierCost', multiplierCost);
        localStorage.setItem('cookiesPerSecond', cookiesPerSecond);
        localStorage.setItem('cookiesPerClick', cookiesPerClick);
        localStorage.setItem('username', username);
    }

    function updateScore(amount) {
        score += amount;
        score = parseFloat(score.toFixed(1));
        saveGame();
        updateDisplay();
    }

    function updateDisplay() {
        scoreDisplay.textContent = `Cookies: ${score}`;
        upgradesOwnedDisplay.textContent = `Upgrades Owned: ${upgradesOwned}`;
        buyUpgradeButton.textContent = `Buy Upgrade (${upgradeCost} cookies)`;
        multipliersOwnedDisplay.textContent = `Multipliers Owned: ${multipliersOwned}`;
        buyUpgradeButton.disabled = score < upgradeCost;
        buyMultiplierButton.disabled = score < multiplierCost;
    }

// ... other parts of the script ...

function showClickBonus(e) {
    const clickBonus = document.createElement('div');
    clickBonus.classList.add('click-bonus');
    clickBonus.textContent = `+${cookiesPerClick.toFixed(1)}`;
    const rect = cookie.getBoundingClientRect();
    // Adjusted offsets for the bonus to appear where the cookie is clicked
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;
    clickBonus.style.left = `${offsetX}px`;
    clickBonus.style.top = `${offsetY}px`;
    gameContainer.appendChild(clickBonus); // Ensure this is the right container for your setup

    // Animate and remove the click bonus element
    setTimeout(() => {
        clickBonus.style.opacity = 0;
        clickBonus.style.transform = `translate(-50%, -50%) translateY(-50px)`; // Center and move up
    }, 100);
    setTimeout(() => {
        clickBonus.remove(); // Modern method to remove the element
    }, 1000);
}

// ... other parts of the script ...


// ... other parts of the script ...


cookie.addEventListener('click', function(e) {
    updateScore(cookiesPerClick);
    showClickBonus(e); // Make sure this is called here

    function showClickBonus(e) {
    const clickBonus = document.createElement('div');
    clickBonus.classList.add('click-bonus');
    clickBonus.textContent = `+${cookiesPerClick.toFixed(1)}`;

         showClickBonus(e); // Call the function with the click event object as argument
  }
});


    function startGame() {
        usernameContainer.style.display = 'none';
        gameContainer.style.display = 'block';
        updateDisplay();
        setInterval(function() {
            updateScore(upgradesOwned * cookiesPerSecond / 10);
        }, 100);
    }

    startGameButton.addEventListener('click', function() {
        username = usernameInput.value.trim();
        if (username.length > 0) {
            startGame();
        } else {
            alert('Please enter a username to start the game.');
        }
    });

    settingsButton.addEventListener('click', function() {
        settingsPanel.style.display = settingsPanel.style.display === 'none' ? 'block' : 'none';
    });

    wipeSaveButton.addEventListener('click', function() {
        if (confirm('Are you sure you want to wipe your save? This cannot be undone.')) {
            localStorage.clear();
            score = 0;
            upgradesOwned = 0;
            multipliersOwned = 0;
            upgradeCost = 10;
            multiplierCost = 20;
            cookiesPerSecond = 0.5;
            cookiesPerClick = 1;
            updateDisplay();
            settingsPanel.style.display = 'none';
        }
    });

    // If the user already has cookies or a username saved, start the game immediately
    if (score > 0 || username) {
        startGame();
    } else {
        usernameContainer.style.display = 'block';
    }

    cookie.addEventListener('click', function(e) {
        updateScore(cookiesPerClick);
        showClickBonus(e);
    });

    buyUpgradeButton.addEventListener('click', function() {
        if (score >= upgradeCost) {
            updateScore(-upgradeCost);
            upgradesOwned++;
            upgradeCost = Math.ceil(upgradeCost * 1.2);
            cookiesPerSecond += 0.5;
            updateDisplay();
        }
    });

    buyMultiplierButton.addEventListener('click', function() {
        if (score >= multiplierCost) {
            updateScore(-multiplierCost);
            multipliersOwned++;
            multiplierCost = Math.ceil(multiplierCost * 1.2);
            cookiesPerClick = parseFloat((cookiesPerClick + 0.1).toFixed(1));
            updateDisplay();
        }
    });
});

// Add to the bottom of your existing script.js file
window.addEventListener('beforeunload', function() {
    const timestamp = Date.now();
    localStorage.setItem('lastCloseTime', timestamp);
    saveGame();
});

document.addEventListener('DOMContentLoaded', function() {
    // ... existing game initialization code ...

  const lastCloseTime = parseInt(localStorage.getItem('lastCloseTime'), 10);
const currentTime = Date.now();
const timePassed = (currentTime - lastCloseTime) / 1000; // Time passed in seconds
let offlineCookies = 0;

if (lastCloseTime && timePassed > 0) {
  offlineCookies = timePassed * cookiesPerSecond * upgradesOwned;
  score += offlineCookies;

  // Show the offline cookies notification
  showOfflineCookiesNotification(offlineCookies);
}


    

    // Don't forget to call updateDisplay() to refresh the score display
    updateDisplay();
});

function showOfflineCookiesNotification(offlineCookies) {
  // Create a notification element
  const notificationElement = document.createElement('div');
  notificationElement.classList.add('offline-cookies-notification');

  // Add content to the notification
  notificationElement.textContent = `You earned ${offlineCookies.toFixed(1)} cookies while you were away!`;

  // Add the notification element to the DOM
  document.body.appendChild(notificationElement);

  // Animate the notification and remove it after a certain time
  notificationElement.classList.add('show');
  setTimeout(() => {
    notificationElement.classList.remove('show');
    setTimeout(() => {
      notificationElement.remove();
    }, 500);
  }, 3000);
}

// Styles for the offline cookies notification
.offline-cookies-notification {
  background-color: #2ECC71; /* Green color */
  border: 1px solid #27AE60; /* Darker green border */
  border-radius: 5px;
  padding: 15px;
  position: fixed;
  top: 30px;
  right: 30px;
  font-size: 18px;
  color: white; /* White text */
  text-align: center;
  z-index: 10000; /* Ensure notification appears on top */
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2); /* Subtle shadow */
  animation: slideInDown 0.3s ease-in-out;
}

@keyframes slideInDown {
  from {
    transform: translateY(-100%); /* Start off-screen */
    opacity: 0;
  }
  to {
    transform: translateY(0); /* Slide down to visible position */
    opacity: 1;
  }
}


