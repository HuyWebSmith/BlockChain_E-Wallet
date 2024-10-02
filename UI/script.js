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


//function cal translate from ETH to USD
// Giả sử 1 ETH = 3000 USD
const ethToUsdRate = 3000; 
let ethBalance = 5000; // Đặt số dư ban đầu thành 5000 ETH
const previousEthPrice = 2900; // Tỷ giá trước đó

// Hàm định dạng số tiền USD
function formatCurrency(value) {
    return `$${value.toLocaleString('de-DE')}`; // Sử dụng định dạng 'de-DE' để thêm dấu chấm
}

// Hàm cập nhật số dư và USD tương ứng
function updateBalance() {
    const usdValue = ethBalance * ethToUsdRate;
    const percentageChange = ((ethToUsdRate - previousEthPrice) / previousEthPrice * 100).toFixed(2);

    // Hiển thị số dư ETH và USD theo định dạng yêu cầu
    document.getElementById('balance').innerText = `Balance: ${ethBalance} ETH`;
    document.getElementById('usdValue').innerText = `${formatCurrency(usdValue)} (${percentageChange >= 0 ? '+' : ''}${percentageChange}%)`;

    // Đổi màu tuỳ thuộc vào mức thay đổi
    const percentageChangeElement = document.getElementById('percentageChange');
    percentageChangeElement.style.color = percentageChange >= 0 ? 'green' : 'red';
}

// Gọi hàm cập nhật khi tải trang
updateBalance();

// Xử lý sự kiện khi bấm nút "Send"
document.getElementById('sendButton').addEventListener('click', function() {
    const amountToSend = parseFloat(document.getElementById('amount').value);

    if (isNaN(amountToSend) || amountToSend <= 0) {
        alert('Please enter a valid amount of ETH to send.');
        return;
    }

    if (amountToSend > ethBalance) {
        alert('Insufficient ETH balance.');
        return;
    }


    
    // Trừ số ETH đã gửi khỏi số dư
    ethBalance -= amountToSend;

    // Cập nhật lại số dư và số USD xấp xỉ
    updateBalance();

    // Hiển thị trạng thái giao dịch
    document.getElementById('transactionStatus').innerText = `Sent ${amountToSend} ETH to ${document.getElementById('recipient').value}`;
});



// Hàm băm SHA-256 thực sự (sử dụng Web Crypto API)
async function sha256(message) {
    // Chuyển đổi thông điệp thành Uint8Array
    const msgBuffer = new TextEncoder().encode(message);
    // Băm thông điệp bằng SHA-256
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    // Chuyển hash buffer thành mảng byte
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Chuyển đổi mảng byte thành chuỗi hex
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}


let transactions = []; // Store all transactions
let lastTransactionHash = null; // Store hash of the previous transaction
let transactionCount = 1; // Counter for transaction numbers

// Open a new window for displaying transactions
let transactionWindow;

// Function to generate a random public/private key pair
function generateKeys() {
    const privateKey = `0x${Math.random().toString(16).substring(2, 66)}`; // Random private key
    const publicKey = `0x${Math.random().toString(16).substring(2, 66)}`; // Random public key
    return { privateKey, publicKey };
}

// Function to generate a hash for the transaction using SHA-256
async function generateTransactionHash(amount, recipient, previousHash = "") {
    const data = `${amount}${recipient}${new Date().getTime()}${previousHash}`;
    return await sha256(data); // Hash using SHA-256
}

// SHA-256 hashing function
async function sha256(message) {
    const msgBuffer = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}



// Function to display the new transaction in the opened window
async function displayNewTransactionInWindow(tx, type) {

    // If the transaction window doesn't exist or is closed, open a new one
    if (!transactionWindow || transactionWindow.closed) {
        transactionWindow = window.open('', '_blank', 'width=600,height=400');
        transactionWindow.document.body.innerHTML = `<h2>Blockchain Transactions</h2>`;
        transactionCount = 1; // Reset transaction count
    }

     // Hiện phần Mining...
    const miningDiv = transactionWindow.document.createElement('div');
    miningDiv.innerHTML = `Mining<span id="miningDots${transactionCount}">...</span>`;
    transactionWindow.document.body.appendChild(miningDiv);

     // Hiệu ứng ba dấu chấm
    const dots = transactionWindow.document.getElementById(`miningDots${transactionCount}`);
    let dotCount = 0;
    const interval = setInterval(() => {
         dotCount = (dotCount + 1) % 4; // 0, 1, 2, 3, 0, 1, ...
         dots.innerText = '.'.repeat(dotCount); // Thay đổi số lượng dấu chấm
     }, 500); // Thay đổi mỗi 500ms

     // Mô phỏng thời gian mining
     await new Promise(resolve => setTimeout(resolve, 3000)); // Chờ 3 giây (thời gian mining)

     clearInterval(interval); // Dừng hiệu ứng
     dots.innerText = ''; // Xóa dấu chấm

    
    transactionWindow.document.body.innerHTML += `
        <div style="border: 1px solid black; padding: 10px; margin-bottom: 10px;">
            <h4>Block ${transactionCount++} (${type})</h4>
            <p>Data: {Sender Public Key: ${tx.senderPublicKey}</p>
            <p>Sender Private Key: ${tx.senderPrivateKey}</p>
            <p>Recipient Public Key: ${tx.recipientPublicKey}</p>
            <p>Amount: ${tx.amount} ETH }</p>
            <p>Timestamp: ${tx.timestamp}</p>
            <p>Transaction Hash: ${tx.hash}</p>
            ${tx.previousHash ? `<p>Previous Block Hash: ${tx.previousHash}</p>` : '<p>This is the Genesis Block.</p>'}
            
        </div>
    `;
}


// When "Send" button is clicked, create a new transaction and update the display
document.getElementById('sendButton').addEventListener('click', async function () {
    const recipient = document.getElementById('recipient').value;
    const amount = parseFloat(document.getElementById('amount').value);

    if (!recipient || isNaN(amount) || amount <= 0) {
        alert('Please enter a valid recipient and amount.');
        return;
    }

    if (amount > ethBalance) {
        alert('Insufficient balance');
        return;
    }

    ethBalance -= amount;

    // Generate a random key pair for the sender and a random public key for the recipient
    const senderKeys = generateKeys();
    const recipientKeys = generateKeys();

    // Generate a hash for the new transaction
    const newTransactionHash = await generateTransactionHash(amount, recipient, lastTransactionHash);

    // Thêm thuộc tính timestamp vào giao dịch
    const transactionTimestamp = new Date().toLocaleString(); // Lấy thời gian hiện tại

    // Save the transaction in the list
    const newTransaction = {
        senderPublicKey: senderKeys.publicKey,
        senderPrivateKey: senderKeys.privateKey,
        recipientPublicKey: recipientKeys.publicKey,
        amount: amount,
        hash: newTransactionHash,
        previousHash: lastTransactionHash,
        timestamp: transactionTimestamp // Thêm timestamp vào giao dịch
    };
    transactions.push(newTransaction);

    // Update the last transaction hash
    lastTransactionHash = newTransactionHash;

    // Hiện phần giao dịch mới trong cửa sổ sau khi mining
    await displayNewTransactionInWindow(newTransaction, 'Send');

    // Update the transaction status
    document.getElementById('transactionStatus').innerText = `Successfully sent ${amount} ETH to ${recipient}!`;
});

// Reset transactions when the window is closed
window.addEventListener('beforeunload', function () {
    transactions = []; // Clear transactions
    lastTransactionHash = null; // Reset the last transaction hash
});



//* * Buy and Sell

// Lưu số dư ban đầu


// Cập nhật số dư và giao diện
function updateBalance() {
    document.getElementById('balance').innerText = `Balance: ${balance} ETH`;
}

// Hàm băm SHA-256 để tạo mã hash cho giao dịch
async function hashTransaction(data) {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);
    const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
    return Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// Mở một tab mới với thông tin giao dịch
function openTransactionTab(transaction, hash) {
    const newTab = window.open('', '_blank');
    if (newTab) {
        newTab.document.write('<html><head><title>Transaction Info</title></head><body>');
        newTab.document.write('<h3>Transaction Details</h3>');
        newTab.document.write(`<p><strong>Sender Public Key:</strong> ${transaction.senderPublicKey}</p>`);
        newTab.document.write(`<p><strong>Sender Private Key:</strong> ${transaction.senderPrivateKey}</p>`);
        newTab.document.write(`<p><strong>Recipient Public Key:</strong> ${transaction.recipientPublicKey}</p>`);
        newTab.document.write(`<p><strong>Amount:</strong> ${transaction.amount} ETH</p>`);
        newTab.document.write(`<p><strong>Transaction Hash:</strong> ${hash}</p>`);
        newTab.document.write('</body></html>');
        newTab.document.close();
    } else {
        alert('Your browser blocked the new tab. Please allow pop-ups.');
    }
}


// Buy ETH
document.getElementById('buyButton').onclick = async function () {
    const amount = parseFloat(prompt("Enter amount to buy (ETH):"));
    if (amount > 0) {
        balance += amount;

        // Generate keys for the transaction
        const senderKeys = generateKeys();
        const recipientKeys = generateKeys();

        const transaction = {
            senderPublicKey: senderKeys.publicKey,
            senderPrivateKey: senderKeys.privateKey,
            recipientPublicKey: recipientKeys.publicKey,
            amount,
        };

        // Update balance and display transaction
        updateBalance();
        const hash = await generateTransactionHash(amount, "buy", lastTransactionHash);
        displayNewTransactionInWindow({ ...transaction, hash, previousHash: lastTransactionHash }, 'Buy');
        lastTransactionHash = hash; // Update the last transaction hash
    } else {
        alert("Invalid amount.");
    }
};

// Sell ETH
document.getElementById('sellButton').onclick = async function () {
    const amount = parseFloat(prompt("Enter amount to sell (ETH):"));
    if (amount > 0 && amount <= balance) {
        balance -= amount; // Deduct from balance

        // Generate keys for the transaction
        const senderKeys = generateKeys();
        const recipientKeys = generateKeys();

        const transaction = {
            senderPublicKey: senderKeys.publicKey,
            senderPrivateKey: senderKeys.privateKey,
            recipientPublicKey: recipientKeys.publicKey,
            amount,
        };

        // Update balance and display transaction
        updateBalance();
        const hash = await generateTransactionHash(amount, "sell", lastTransactionHash);
        displayNewTransactionInWindow({ ...transaction, hash, previousHash: lastTransactionHash }, 'Sell');
        lastTransactionHash = hash; // Update the last transaction hash
    } else {
        alert("Invalid amount or insufficient balance.");
    }
};
