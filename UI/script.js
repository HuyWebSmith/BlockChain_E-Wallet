// script.js
let balance = 1000.0; // Số dư ban đầu

document.getElementById('sendButton').addEventListener('click', function() {
    const recipient = document.getElementById('recipient').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (isNaN(amount) || amount <= 0) {
        alert("Invalid amount.");
        return;
    }

    if (amount > balance) {
        alert("Not enough balance.");
        return;
    }

    balance -= amount;
    document.getElementById('balance').innerText = "Balance: " + balance + " ETH";
    alert("Have send " + amount + " ETH to " + recipient);
});

document.getElementById('checkBalanceButton').addEventListener('click', function() {
    alert("Current balance: " + balance + " ETH");
});
