
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
    const onboardingContainer = document.getElementById('onboarding-container');
    const instructions = document.getElementById('instructions');

    // Hide game elements initially
    gameContainer.style.display = 'none';

    // Load saved game state or set default values if none exist
    let score = parseFloat(localStorage.getItem('score')) || 0;
    let upgradesOwned = parseInt(localStorage.getItem('upgradesOwned'), 10) || 0;
    let multipliersOwned = parseInt(localStorage.getItem('multipliersOwned'), 10) || 0;
    let upgradeCost = parseInt(localStorage.getItem('upgradeCost'), 10) || 10;
    let multiplierCost = parseInt(localStorage.getItem('multiplierCost'), 10) || 20;
    let cookiesPerSecond = parseFloat(localStorage.getItem('cookiesPerSecond')) || 0.5;
    let cookiesPerClick = parseFloat(localStorage.getItem('cookiesPerClick')) || 1;
    let username = localStorage.getItem('username') || '';
    let achievements = JSON.parse(localStorage.getItem('achievements')) || {};
    let totalCookiesEarned = parseFloat(localStorage.getItem('totalCookiesEarned')) || 0;

    function saveGame() {
        localStorage.setItem('score', score);
        localStorage.setItem('upgradesOwned', upgradesOwned);
        localStorage.setItem('multipliersOwned', multipliersOwned);
        localStorage.setItem('upgradeCost', upgradeCost);
        localStorage.setItem('multiplierCost', multiplierCost);
        localStorage.setItem('cookiesPerSecond', cookiesPerSecond);
        localStorage.setItem('cookiesPerClick', cookiesPerClick);
        localStorage.setItem('username', username);
        localStorage.setItem('achievements', JSON.stringify(achievements));
        localStorage.setItem('totalCookiesEarned', totalCookiesEarned);
    }

    function updateScore(amount) {
        score += amount;
        totalCookiesEarned += amount;
        score = parseFloat(score.toFixed(1));
        totalCookiesEarned = parseFloat(totalCookiesEarned.toFixed(1));
        saveGame();
        updateDisplay();
        checkAchievements();
    }

    function updateDisplay() {
        scoreDisplay.textContent = `Cookies: ${score.toFixed(1)}`;
        upgradesOwnedDisplay.textContent = `Upgrades Owned: ${upgradesOwned}`;
        buyUpgradeButton.textContent = `Buy Upgrade (${upgradeCost} cookies)`;
        buyUpgradeButton.title = `Increases cookies per second by 0.5`;
        multipliersOwnedDisplay.textContent = `Multipliers Owned: ${multipliersOwned}`;
        buyMultiplierButton.textContent = `Buy Multiplier (${multiplierCost} cookies)`;
        buyMultiplierButton.title = `Increases cookies per click by 0.1`;
        buyUpgradeButton.disabled = score < upgradeCost;
        buyMultiplierButton.disabled = score < multiplierCost;
        document.getElementById('total-cookies').textContent = `Total Cookies Baked: ${totalCookiesEarned.toFixed(1)}`;
        document.getElementById('cookies-per-second').textContent = `Cookies per Second: ${(upgradesOwned * cookiesPerSecond).toFixed(1)}`;
        document.getElementById('cookies-per-click').textContent = `Cookies per Click: ${cookiesPerClick.toFixed(1)}`;
    }

    startGameButton.addEventListener('click', function() {
        username = usernameInput.value;
        if (username) {
            onboardingContainer.style.display = 'none';
            gameContainer.style.display = 'block';
            saveGame();
            updateDisplay();
        }
    });
});
      