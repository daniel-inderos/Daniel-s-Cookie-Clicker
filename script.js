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
    
    // Load saved game state or set default values if none exist
    let score = parseFloat(localStorage.getItem('score')) || 0;
    let upgradesOwned = parseInt(localStorage.getItem('upgradesOwned'), 10) || 0;
    let multipliersOwned = parseInt(localStorage.getItem('multipliersOwned'), 10) || 0;
    let upgradeCost = parseInt(localStorage.getItem('upgradeCost'), 10) || 10;
    let multiplierCost = parseInt(localStorage.getItem('multiplierCost'), 10) || 20;
    let cookiesPerSecond = parseFloat(localStorage.getItem('cookiesPerSecond')) || 0.5;
    let cookiesPerClick = parseFloat(localStorage.getItem('cookiesPerClick')) || 1;
    let username = ''; // New variable for username

    function startGame() {
        // Hide the username input and start button
        document.getElementById('username-container').style.display = 'none';
        
        // Game starts here
        // You can use the username in your game logic if needed
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
    
    
    function saveGame() {
        localStorage.setItem('score', score);
        localStorage.setItem('upgradesOwned', upgradesOwned);
        localStorage.setItem('multipliersOwned', multipliersOwned);
        localStorage.setItem('upgradeCost', upgradeCost);
        localStorage.setItem('multiplierCost', multiplierCost);
        localStorage.setItem('cookiesPerSecond', cookiesPerSecond);
        localStorage.setItem('cookiesPerClick', cookiesPerClick);
    }

    function updateScore(amount) {
        score += amount;
        score = parseFloat(score.toFixed(1)); // Fixes floating-point precision issues
        saveGame(); // Save game state after updating score
        updateDisplay();
    }

    function updateDisplay() {
        scoreDisplay.textContent = `Cookies: ${score}`;
        upgradesOwnedDisplay.textContent = `Upgrades Owned: ${upgradesOwned}`;
        buyUpgradeButton.textContent = `Buy Upgrade (${upgradeCost} cookies)`;
        multipliersOwnedDisplay.textContent = `Multipliers Owned: ${multipliersOwned}`;
        buyMultiplierButton.textContent = `Buy Multiplier (${multiplierCost} cookies)`;
        buyUpgradeButton.disabled = score < upgradeCost;
        buyMultiplierButton.disabled = score < multiplierCost;
    }

    function showClickBonus(e) {
        const clickBonus = document.createElement('div');
        clickBonus.classList.add('click-bonus');
        clickBonus.textContent = `+${cookiesPerClick.toFixed(1)}`;
        const rect = cookie.getBoundingClientRect();
        const offsetX = e.clientX - rect.left; // Get the x position within the cookie image
        const offsetY = e.clientY - rect.top; // Get the y position within the cookie image
        clickBonus.style.left = `${offsetX}px`;
        clickBonus.style.top = `${offsetY}px`;
        gameContainer.appendChild(clickBonus);

        // Animate and remove the click bonus element
        setTimeout(() => {
            clickBonus.style.opacity = 0;
            clickBonus.style.top = `${offsetY - 50}px`;
        }, 100);
        setTimeout(() => gameContainer.removeChild(clickBonus), 1000);
    }

    cookie.addEventListener('click', function(e) {
        updateScore(cookiesPerClick);
        showClickBonus(e);
    });

    buyUpgradeButton.addEventListener('click', function() {
        if (score >= upgradeCost) {
            updateScore(-upgradeCost);
            upgradesOwned++;
            upgradeCost = Math.ceil(upgradeCost * 1.2); // Increase the cost by 20%
            cookiesPerSecond += 0.5; // Increase the cookies per second
            saveGame(); // Save game state after purchasing an upgrade
            updateDisplay();
        }
    });

    buyMultiplierButton.addEventListener('click', function() {
        if (score >= multiplierCost) {
            updateScore(-multiplierCost);
            multipliersOwned++;
            multiplierCost = Math.ceil(multiplierCost * 1.2); // Increase the cost by 20%
            cookiesPerClick = parseFloat((cookiesPerClick + 0.1).toFixed(1)); // Increase cookies per click
            saveGame(); // Save game state after purchasing a multiplier
            updateDisplay();
        }
    });

    setInterval(function() {
        updateScore(upgradesOwned * cookiesPerSecond / 10); // Update 10 times per second for smoother increment
    }, 100);

    // Call updateDisplay at the start to reflect the loaded state
    updateDisplay();
});
