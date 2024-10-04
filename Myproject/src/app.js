// Import the Web3 library
let web3;
let simpleStorage;
let messageHistory = [];

// Your ABI from SimpleStorage.json
const SimpleStorageABI = [
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            },
            {
                "internalType": "string",
                "name": "message",
                "type": "string"
            }
        ],
        "name": "setMessage",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getMessage",
        "outputs": [
            {
                "internalType": "string",
                "name": "",
                "type": "string"
            }
        ],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    }
];

// Your contract address
const contractAddress = "0xE66c73D4b8EAea9471de192162513135ab4985d2"; // Replace with your contract address

// Initialize the smart contract
async function init() {
    if (window.ethereum) {
        web3 = new Web3(window.ethereum);
        await window.ethereum.enable();
    } else {
        alert("Please install MetaMask!");
        return;
    }

    const networkId = await web3.eth.net.getId();
    
    // Create a contract instance using the ABI and address
    simpleStorage = new web3.eth.Contract(
        SimpleStorageABI, // Use the ABI here
        contractAddress,   // Use the contract address here
    );

    // Optionally, you can log the contract instance to ensure it's set up correctly
    console.log("Contract instance created:", simpleStorage);
}

// Function to set a message in the contract
async function setMessage() {
    const index = document.getElementById('index').value;
    const message = document.getElementById('message').value;

    if (!index || isNaN(index) || index < 0) {
        alert('Please enter a valid index number.');
        return;
    }

    if (!message.trim()) {
        alert('Message cannot be empty!');
        return;
    }

    const accounts = await web3.eth.getAccounts();

    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'inline-block';
    document.getElementById('transactionStatus').innerText = '';

    try {
        await simpleStorage.methods.setMessage(index, message).send({ from: accounts[0] });
        document.getElementById('transactionStatus').innerText = 'Message set successfully!';
        
        messageHistory.push(`Index ${index}: ${message}`);
        displayMessageHistory();
    } catch (error) {
        document.getElementById('transactionStatus').innerText = 'Transaction failed! Please try again.';
        console.error(error);
    } finally {
        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

// Function to get a message from the contract
async function getMessage() {
    const index = document.getElementById('index').value;

    if (!index || isNaN(index) || index < 0) {
        alert('Please enter a valid index number.');
        return;
    }

    try {
        const message = await simpleStorage.methods.getMessage(index).call();
        document.getElementById('displayMessage').innerText = message || 'No message at this index.';
    } catch (error) {
        document.getElementById('displayMessage').innerText = 'Error retrieving message.';
        console.error(error);
    }
}

// Function to display message history
function displayMessageHistory() {
    const historyList = document.getElementById('messageHistory');
    historyList.innerHTML = '';
    messageHistory.forEach(item => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item';
        listItem.textContent = item;
        historyList.appendChild(listItem);
    });
}

// Initialize the app when the window loads
window.addEventListener('load', init);
