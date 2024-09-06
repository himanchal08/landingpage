const chatBox = document.getElementById('chat-box');
let globalData = {};

const responses = { 
    "hi": "Hello! Welcome to our online ticketing system. How can I assist you today? Please select an option below.",
    "book ticket": "Please select a state or union territory from the dropdown menu.",
    "help": "You will be redirected to the help page.",
    "state selected": "You have selected a state. Please choose a city from the dropdown menu.",
    "city selected": "You have selected a city. Please choose a museum from the dropdown menu.",
    "museum selected": "You have selected a museum. Proceeding with booking..."
};

const initialOptions = ["Book Ticket", "Help"];
const statesAndUTs = {
    "Andhra Pradesh": ["Vijayawada", "Chandavaram", "Kadapa"],
    "Arunachal Pradesh": ["Itanagar"],
    "Assam": ["Guwahati", "Mayong"],
    "Bihar": ["Patna"],
    "Chandigarh": ["Chandigarh"],
    "Goa": ["Benaulim", "Nuvem", "Panaji"],
    "Gujarat": ["Ahmedabad"],
    "Haryana": ["Rewari", "Taoru"],
    "Himachal Pradesh": ["Sirmaur", "Dharamsala"],
    "Jammu and Kashmir": ["Jammu"],
    "Jharkhand": ["Ranchi"],
    "Karnataka": ["Bijapur", "Bangalore"],
    "Kerala": ["Kochi", "Kozhikode"],
    "Ladakh": ["Kargil"],
    "Madhya Pradesh": ["Indore", "Bhopal"],
    "Maharashtra": ["Mumbai"],
    "Manipur": ["Imphal"],
    "Mizoram": ["Aizawl"],
    "Nagaland": ["Kohima"],
    "National Capital Territory of Delhi": ["Delhi"],
    "Odisha": ["Bhubaneshwar"],
    "Puducherry": ["Puducherry"],
    "Punjab": ["Anandpur Sahib", "Amritsar"],
    "Rajasthan": ["Jaipur", "Udaipur", "Sawai Madhopur"],
    "Sikkim": ["Gangtok"],
    "Tamil Nadu": ["Chennai", "Madurai"],
    "Telangana": ["Hyderabad"],
    "Tripura": ["Agartala"],
    "Uttar Pradesh": ["Lucknow", "Allahabad", "Kanpur"],
    "West Bengal": ["Kolkata"]
};

const museums = {
    "Vijayawada": ["Bapu Museum"],
    "Chandavaram": ["Chandavaram Buddhist site"],
    "Kadapa": ["Bhagwan Mahavir Government Museum"],
    "Itanagar": ["Jawaharlal Nehru Museum"],
    "Guwahati": ["Shankardev Kalakshetra", "Assam State Museum"],
    "Mayong": ["Mayong Central Museum and Emporium"],
    "Patna": ["Bhartiya Nritya Kala Mandir", "Bihar Museum"],
    "Chandigarh": ["Government Museum and Art Gallery"],
    "Benaulim": ["Goa Chitra Museum"],
    "Nuvem": ["Ashvek Vintage World"],
    "Panaji": ["Goa State Museum"],
    "Ahmedabad": ["Lalbhai Dalpatbhai Museum", "Sardar Vallabhbhai Patel National Memorial", "Sanskar Kendra"],
    "Rewari": ["Rewari Railway Heritage Museum"],
    "Taoru": ["Heritage Transport Museum"],
    "Sirmaur": ["Shivalik Fossil Park"],
    "Dharamsala": ["Library of Tibetan Works and Archives"],
    "Jammu": ["Shashvat Art Gallery", "Dogra Art Museum"],
    "Ranchi": ["Ranchi Science Centre", "State Museum Hotwar"],
    "Bijapur": ["Archaeological Museum"],
    "Bangalore": ["Government Museum"],
    "Kochi": ["Indo-Portuguese Museum"],
    "Kozhikode": ["Pazhassi Raja Archaeological Museum"],
    "Kargil": ["Munshi Aziz Bhat Museum of Central Asian and Kargil Trade Artefacts"],
    "Indore": ["Indore Museum"],
    "Bhopal": ["Bharat Bhavan"],
    "Mumbai": ["Bhau Daji Lad Museum", "National Gallery of Modern Art"],
    "Imphal": ["Archaeological Museum", "Hijagang"],
    "Aizawl": ["Mizoram State Museum"],
    "Kohima": ["Nagaland State Museum"],
    "Delhi": ["National Museum", "National Gallery of Modern Art"],
    "Bhubaneshwar": ["Odisha State Museum", "Tribal Research Institute Museum"],
    "Puducherry": ["Pondicherry Museum"],
    "Anandpur Sahib": ["Virasat-e-Khalsa"],
    "Amritsar": ["Partition Museum"],
    "Jaipur": ["Albert Hall Museum"],
    "Udaipur": ["Vintage and Classic Car Museum"],
    "Sawai Madhopur": ["Rajiv Gandhi Regional Museum of Natural History"],
    "Gangtok": ["Namgyal Institute of Tibetology"],
    "Chennai": ["Chennai Railway Museum", "Government Museum"],
    "Madurai": ["Gandhi Memorial Museum"],
    "Hyderabad": ["Nizam Museum", "Salar Jung Museum"],
    "Agartala": ["Tripura State Museum"],
    "Lucknow": ["State Museum"],
    "Allahabad": ["Allahabad Museum"],
    "Kanpur": ["Kanpur Sangrahalaya"],
    "Kolkata": ["Indian Museum", "Victoria Memorial", "State Archaeological Gallery"]
};
const ticketPrices = {
    "Bapu Museum": { adult: 50, child: 30 },
    "Chandavaram Buddhist site": { adult: 10, child: 5 },
    "Bhagwan Mahavir Government Museum": { adult: 3, child: 1 },
    "Jawaharlal Nehru Museum": { adult: 10, child: 5 },
    "Shankardev Kalakshetra": { adult: 30, child: 10 },
    "Assam State Museum": { adult: 33, child: 11 },
    "Mayong Central Museum and Emporium": { adult: 10, child: 5 },
    "Bhartiya Nritya Kala Mandir": { adult: 10, child: 5 },
    "Bihar Museum": { adult: 100, child: 50 },
    "Government Museum and Art Gallery": { adult: 30, child: 20 },
    "Goa Chitra Museum": { adult: 300, child: 100 },
    "Ashvek Vintage World": { adult: 100, child: 50 },
    "Goa State Museum": { adult: 30, child: 15 },
    "Lalbhai Dalpatbhai Museum": { adult: 40, child: 20 },
    "Sardar Vallabhbhai Patel National Memorial": { adult: 20, child: 10 },
    "Sanskar Kendra": { adult: 10, child: 5 },
    "Rewari Railway Heritage Museum": { adult: 10, child: 5 },
    "Heritage Transport Museum": { adult: 70, child: 30 },
    "Shivalik Fossil Park": { adult: 80, child: 50 },
    "Library of Tibetan Works and Archives": { adult: 80, child: 50 },
    "Shashvat Art Gallery": { adult: 80, child: 50 },
    "Dogra Art Museum": { adult: 100, child: 50 },
    "Ranchi Science Centre": { adult: 10, child: 5 },
    "State Museum Hotwar": { adult: 70, child: 20 },
    "Archaeological Museum": { adult: 20, child: 5 },
    "Government Museum": { adult: 30, child: 10 },
    "Indo-Portuguese Museum": { adult: 60, child: 35 },
    "Pazhassi Raja Archaeological Museum": { adult: 40, child: 20 },
    "Munshi Aziz Bhat Museum of Central Asian and Kargil Trade Artefacts": { adult: 20, child: 10 },
    "Indore Museum": { adult: 10, child: 10 },
    "Bharat Bhavan": { adult: 50, child: 30 },
    "Bhau Daji Lad Museum": { adult: 60, child: 30 },
    "National Gallery of Modern Art": { adult: 100, child: 50 },
    "Archaeological Museum": { adult: 90, child: 45 },
    "Hijagang": { adult: 80, child: 30 },
    "Mizoram State Museum": { adult: 10, child: 5 },
    "Nagaland State Museum": { adult: 10, child: 5 },
    "National Museum": { adult: 20, child: 5 },
    "National Gallery of Modern Art": { adult: 70, child: 40 },
    "Odisha State Museum": { adult: 40, child: 24 },
    "Tribal Research Institute Museum": { adult: 50, child: 10 },
    "Pondicherry Museum": { adult: 30, child: 10 },
    "Virasat-e-Khalsa": { adult: 30, child: 10 },
    "Partition Museum": { adult: 20, child: 10 },
    "Albert Hall Museum": { adult: 80, child: 30 },
    "Vintage and Classic Car Museum": { adult: 200, child: 150 },
    "Rajiv Gandhi Regional Museum of Natural History": { adult: 40, child: 30 },
    "Namgyal Institute of Tibetology": { adult: 65, child: 20 },
    "Chennai Railway Museum": { adult: 100, child: 30 },
    "Government Museum": { adult: 30, child: 15 },
    "Gandhi Memorial Museum": { adult: 50, child: 20 },
    "Nizam Museum": { adult: 30, child: 20 },
    "Salar Jung Museum": { adult: 50, child: 40 },
    "Tripura State Museum": { adult: 30, child: 10 },
    "State Museum": { adult: 50, child: 30 },
    "Allahabad Museum": { adult: 50, child: 25 },
    "Kanpur Sangrahalaya": { adult: 70, child: 40 },
    "Indian Museum": { adult: 50, child: 30 },
    "Victoria Memorial": { adult: 50, child: 25 },
    "State Archaeological Gallery": { adult: 10, child: 5 }
};

function displayMessage(sender, message) {
    const messageElement = `<p><strong>${sender}:</strong> ${message}</p>`;
    chatBox.innerHTML += messageElement;
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayTypingIndicator() {
    const typingElement = document.createElement('p');
    typingElement.id = 'typing-indicator';
    typingElement.innerText = "Sanjay is typing...";
    chatBox.appendChild(typingElement);
    chatBox.scrollTop = chatBox.scrollHeight;
    setTimeout(() => typingElement.remove(), 1000);
}

function clearOptions() {
    chatBox.querySelectorAll('button').forEach(button => button.remove());
    const dropdowns = chatBox.querySelectorAll('select');
    dropdowns.forEach(dropdown => dropdown.remove());
}

function displayOptions(options) {
    clearOptions();
    options.forEach(option => {
        const buttonElement = document.createElement('button');
        buttonElement.innerText = option;
        buttonElement.onclick = () => handleUserInput(option.toLowerCase());
        chatBox.appendChild(buttonElement);
    });
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayStateDropdown() {
    clearOptions();
    const dropdownElement = document.createElement('select');
    dropdownElement.id = 'state-dropdown';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.innerText = "Select State";

    dropdownElement.appendChild(defaultOption);

    Object.keys(statesAndUTs).forEach(state => {
        const optionElement = document.createElement('option');
        optionElement.value = state;
        optionElement.innerText = state;
        dropdownElement.appendChild(optionElement);
    });
    
    dropdownElement.onchange = () => {
        const selectedState = dropdownElement.value;
        if (selectedState) {
            handleStateSelection(selectedState);
        }
    };

    chatBox.appendChild(dropdownElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayCityDropdown(cities) {
    clearOptions();
    const dropdownElement = document.createElement('select');
    dropdownElement.id = 'city-dropdown';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.innerText = "Select City";
    dropdownElement.appendChild(defaultOption);

    cities.forEach(city => {
        const optionElement = document.createElement('option');
        optionElement.value = city;
        optionElement.innerText = city;
        dropdownElement.appendChild(optionElement);
    });

    dropdownElement.onchange = () => {
        const selectedCity = dropdownElement.value;
        if (selectedCity) {
            handleCitySelection(selectedCity);
        }
    };

    chatBox.appendChild(dropdownElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function displayMuseumDropdown(museums) {
    clearOptions();
    const dropdownElement = document.createElement('select');
    dropdownElement.id = 'museum-dropdown';
    
    const defaultOption = document.createElement('option');
    defaultOption.value = "";
    defaultOption.innerText = "Select Museum";
    dropdownElement.appendChild(defaultOption);

    museums.forEach(museum => {
        const optionElement = document.createElement('option');
        optionElement.value = museum;
        optionElement.innerText = museum;
        dropdownElement.appendChild(optionElement);
    });

    dropdownElement.onchange = () => {
        const selectedMuseum = dropdownElement.value;
        if (selectedMuseum) {
            handleMuseumSelection(selectedMuseum);
        }
    };

    chatBox.appendChild(dropdownElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function handleStateSelection(state) {
    globalData["state"] = state;

    displayMessage("User", `Selected State: ${state}`);
    displayMessage("Sanjay", responses["state selected"]);
    const cities = statesAndUTs[state] || [];
    displayCityDropdown(cities);
}

function handleCitySelection(city) {
    globalData["city"] = city;

    displayMessage("User", `Selected City: ${city}`);
    displayMessage("Sanjay", responses["city selected"]);
    const museumsList = museums[city] || [];
    displayMuseumDropdown(museumsList);
}

function handleMuseumSelection(museum) {
    globalData["museum"] = museum;

    displayMessage("User", `Selected Museum: ${museum}`);
    displayMessage("Sanjay", responses["museum selected"]);
    displayMuseumPrices(museum);
}

function displayMuseumPrices(museum) {
    const prices = ticketPrices[museum];
    if (prices) {
        const priceMessage = `Adult Ticket Price: ₹${prices.adult}\nChild Ticket Price: ₹${prices.child}`;
        displayMessage("Sanjay", priceMessage);
        
        // Prompt the user for ticket quantities
        displayMessage("Sanjay", "How many tickets do you need? Please enter the number of adult and child tickets.");
        
        // Add input fields for user to enter ticket quantities
        const inputElement = document.createElement('div');
        inputElement.innerHTML = `
            <label for="adult-tickets">Adult Tickets:</label>
            <input type="number" id="adult-tickets" min="0">
            <label for="child-tickets">Child Tickets:</label>
            <input type="number" id="child-tickets" min="0">
            <button onclick="submitTicketQuantities('${museum}')">Submit</button>
        `;
        chatBox.appendChild(inputElement);
    } else {
        displayMessage("Sanjay", "Prices not available for the selected museum.");
    }
}
function submitTicketQuantities(museum) {
    const adultTickets = document.getElementById('adult-tickets').value;
    const childTickets = document.getElementById('child-tickets').value;
    const ticketPrice = ticketPrices[museum];
    
    if (adultTickets || childTickets) {
        const totalAdultPrice = adultTickets * ticketPrice.adult;
        const totalChildPrice = childTickets * ticketPrice.child;
        const totalPrice = totalAdultPrice + totalChildPrice;
        
        displayMessage("User", `Adult Tickets: ${adultTickets}\nChild Tickets: ${childTickets}`);
        displayMessage("Sanjay", `Total Price:\nAdult Tickets: ₹${totalAdultPrice}\nChild Tickets: ₹${totalChildPrice}\nTotal: ₹${totalPrice}`);
        
        // Remove the input fields after submission
        document.querySelector('#chat-box > div').remove();

        globalData["totalPrice"] = totalPrice;
        
        // Prompt for the date
        displayMessage("Sanjay", "Please select the date for your visit.");
        
        const dateInput = document.createElement('div');
        dateInput.innerHTML = `
            <input type="date" id="visit-date">
            <button onclick="submitVisitDate('${museum}')">Submit</button>
        `;
        chatBox.appendChild(dateInput);
    } else {
        displayMessage("Sanjay", "Please enter the number of tickets.");
    }
}
function submitVisitDate(museum) {
    const visitDate = document.getElementById('visit-date').value;
    
    if (visitDate) {
        displayMessage("User", `Selected Date: ${visitDate}`);
        displayMessage("Sanjay", "Please type 'confirm' in the message area to finalize your booking.");
        
        document.querySelector('#chat-box > div').remove();

        expectedResponse = 'confirm';
    } else {
        displayMessage("Sanjay", "Please select a date.");
    }
}
let expectedResponse = null;

function handleUserInput(input) {
    const formattedInput = input.trim().toLowerCase();
    if (formattedInput === "") {
        displayMessage("Sanjay", "Please enter a message.");
        return;
    }

    displayMessage("User", input);
    clearOptions();

    if (expectedResponse === 'confirm' && formattedInput === 'confirm') {
        displayMessage("Sanjay", "Your booking has been confirmed! Thank you for choosing our service.");
        expectedResponse = null;
        window.location.href = `/book-ticket?price=${globalData['totalPrice']}&museum=${globalData['museum']}`;
        return;
    } else if (expectedResponse === 'confirm' && formattedInput !== 'confirm') {
        displayMessage("Sanjay", "Please type 'confirm' to finalize your booking.");
        return;
    }

    if (responses[formattedInput]) {
        displayTypingIndicator();
        setTimeout(() => {
            if (formattedInput === "hi") {
                displayMessage("Sanjay", responses["hi"]);
                displayOptions(initialOptions);
            } else if (formattedInput === "book ticket") {
                displayMessage("Sanjay", responses["book ticket"]);
                displayStateDropdown();
            } else if (formattedInput === "help") {
                displayMessage("Sanjay", responses["help"]);
                window.location.href = "help.html"; // Redirect to help page
            } else {
                displayMessage("Sanjay", "I'm not sure how to respond to that. Please choose one of the options.");
                displayOptions(initialOptions);
            }
        }, 1000);
    } else {
        displayMessage("Sanjay", "I'm not sure how to respond to that. Please choose one of the options.");
        displayOptions(initialOptions);
    }
}

function sendMessage(message) {
    // Your code to send the message goes here
    document.getElementById('send-button').onclick = function() {
        const userInput = document.getElementById('user-input').value;
        if (userInput.trim() !== "") {
            handleUserInput(userInput); // Correct function name
            document.getElementById('user-input').value = ""; // Clear input after sending
        }
    };
}

window.onload = function() {
    displayMessage("Sanjay", responses["hi"]);
    displayOptions(initialOptions);
};
