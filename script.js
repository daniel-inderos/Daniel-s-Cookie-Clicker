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

    function checkAchievements() {
        const milestones = [100, 1000, 10000, 100000, 1000000];
        milestones.forEach(milestone => {
            if (totalCookiesEarned >= milestone && !achievements[`cookies${milestone}`]) {
                achievements[`cookies${milestone}`] = true;
                alert(`Achievement unlocked: Baked ${milestone} cookies!`);
                saveGame();
            }
        });
    }

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
            achievements = {};
            totalCookiesEarned = 0;
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
            showPurchaseAnimation();
        }
    });

    buyMultiplierButton.addEventListener('click', function() {
        if (score >= multiplierCost) {
            updateScore(-multiplierCost);
            multipliersOwned++;
            multiplierCost = Math.ceil(multiplierCost * 1.2);
            cookiesPerClick = parseFloat((cookiesPerClick + 0.1).toFixed(1));
            updateDisplay();
            showPurchaseAnimation();
        }
    });

    function showPurchaseAnimation() {
        const purchaseEffect = document.createElement('div');
        purchaseEffect.classList.add('purchase-effect');
        purchaseEffect.textContent = 'Upgrade!';
        gameContainer.appendChild(purchaseEffect);

        setTimeout(() => {
            purchaseEffect.style.opacity = '0';
            purchaseEffect.style.transform = 'translateY(-50px)';
        }, 50);

        setTimeout(() => {
            purchaseEffect.remove();
        }, 500);
    }

    document.addEventListener('DOMContentLoaded', function() {
        // Calculate offline progress
        const lastCloseTime = parseInt(localStorage.getItem('lastCloseTime'), 10);
        const currentTime = Date.now();
        const timePassed = (currentTime - lastCloseTime) / 1000; // Time passed in seconds
        let offlineCookies = 0;

        if (lastCloseTime && timePassed > 0) {
            offlineCookies = timePassed * cookiesPerSecond * upgradesOwned;
            score += offlineCookies;
            totalCookiesEarned += offlineCookies;
        }

        // Notify player of offline cookies earned
        if (offlineCookies > 0) {
            alert(`Welcome back! You've earned ${offlineCookies.toFixed(1)} cookies while you were away.`);
        }

        updateDisplay();
        checkAchievements();
    });

    window.addEventListener('beforeunload', function() {
        const timestamp = Date.now();
        localStorage.setItem('lastCloseTime', timestamp);
        saveGame();
    });
});
