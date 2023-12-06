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

    function showClickBonus(e) {
        // ... existing showClickBonus function ...
    }

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
