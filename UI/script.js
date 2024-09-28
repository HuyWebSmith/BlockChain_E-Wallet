// script.js

// Initial balance of 5000 ETH
let balance = 5000;

// Get references to the DOM elements
const sendButton = document.getElementById('sendButton');
const transactionStatus = document.getElementById('transactionStatus');
const recipientInput = document.getElementById('recipient');
const amountInput = document.getElementById('amount');
const balanceDisplay = document.getElementById('balance');

// Function to update the balance display
function updateBalance() {
    balanceDisplay.innerText = `Balance: ${balance} ETH`;
}

// Function to simulate sending ETH
function sendTransaction() {
    const recipient = recipientInput.value;
    const amount = parseFloat(amountInput.value);

    // Basic validation to check if the fields are filled
    if (!recipient || isNaN(amount) || amount <= 0) {
        transactionStatus.innerText = 'Please enter a valid recipient address and amount.';
        transactionStatus.style.color = 'red';
        return;
    }

    // Check if the user has enough balance
    if (amount > balance) {
        transactionStatus.innerText = 'Insufficient balance!';
        transactionStatus.style.color = 'red';
        return;
    }

    // Simulate a transaction with a delay (to mimic waiting for transaction confirmation)
    transactionStatus.innerText = 'Sending transaction...';
    transactionStatus.style.color = 'blue';

    setTimeout(() => {
        // Deduct the amount from the balance
        balance -= amount;

        // Update the balance display
        updateBalance();

        // Simulate transaction success
        transactionStatus.innerText = `Transaction of ${amount} ETH to ${recipient} was successful!`;
        transactionStatus.style.color = 'green';

        // Clear input fields
        recipientInput.value = '';
        amountInput.value = '';
    }, 2000); // Simulated delay of 2 seconds
}

// Attach click event listener to the send button
sendButton.addEventListener('click', sendTransaction);
