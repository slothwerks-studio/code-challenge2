// It’s time to board The Badger and cruise across Lake Michigan! 
// The Badger uses assigned seating on the top deck, where seats are in three columns separated by aisles. 
// Several tickets have already been purchased. Our goal is to find all of the possible 
// contiguous seating locations for a family of three. The seats cannot be separated by an aisle. 
// Also, multiple permutations of seating arrangements within a column (or “cluster”) of seats 
// does not constitute multiple valid locations: if four contiguous seats are available, 
// this only constitutes one valid seating location.
//
// The challenge: write a function in a language of your choosing. This function will take in two arguments:
//
// 1) an array of purchased seats in no particular order with the syntax of [row][seat], and 
// 2) the number of rows. The seats in each row are arranged thusly: a cluster of three (A, B, and C), 
// a cluster of four (D, E, F, and G), and a cluster of three (H, J, and K). 
// Please note the lack of a seat I (as in India). 
//
// The function should return the valid number of seating locations for the family of three.
// 
// Okay.  This is a logic puzzle.
// Given an array of strings that are reserved seats, we need to determine the number of possible clusters
// which include 3 contiguous seats.  In this puzzle, there are three clusters:  a cluster of three (seats A, B, and C),
// followed by a cluster of four (seats D, E, F, and G), followed by a cluster of three (seats H, J, and K).
// The first and third cluster follow the same rule:
// 
// * If all seats in the cluster are not reserved, it is a valid seating location.
//
// As for the middle cluster, we apply the above logic twice:
//
// * If the first three seats (D, E, and F) are not reserved, this cluster is a valid seating location.  
// It may also be a valid seating location if the last three seats (E, F, and G) are available.
// 
// This logic seems fairly easy to implement.  All we need to do is organize the data in a way 
// that is useful (rather than the seat reservations being randomly dumped into an array).

// We're using a "submit" button in a form to acquire our data, so first we'll stop the webpage from refreshing upon submit.
// We will add an event listener on the form, forcing it to prevent its default behavior:

const userForm = document.getElementById("userForm");

function handleForm(event) { 
	event.preventDefault(); 
} 

userForm.addEventListener('submit', handleForm);

// Let's put the user in control and allow him or her to select the seats to be added to the array, in no particular order.
// First we'll need to know the number of rows.  Then we'll need to build a table with those rows.

// Initializing a "global" variable for the list of reserved seats...
var seatReservationData;

// Initializing a "global" variable for number of rows...
var numberOfRows;

// This is the function called when the submit button on the website is pressed.
// Originally it built a randomized array of seat reservations, built an HTML table to display those reservations,
// and then displayed the results of the validLocations function.  Now it instead builds an empty table
// for the user to manipulate.  Thus there are many sections now commented out.

function getResults() {
  
  // Fetch user input and convert to integer
  userInput = parseInt((document.getElementById("numberOfRows").value), 10);
  console.log("Reported user input: " + userInput);
  
  // Sanitize...
    if (userInput <= 0 || userInput > 30) {
      console.log("This is not going to work.");
      document.getElementById("formWarning").innerHTML = "For the sake of sanity, please limit your entry to a positive integer between 1 and 30.";
      return;
      
    } else {

      clearWarning(); // Clear any existing warning on the webpage      
      
    /* 
      const numberOfRows = userInput;
      
      console.log("Number of rows: " + numberOfRows);
      const totalNumberOfSeats = numberOfRows * 10; // Total number of seats (given ten seats per row)
      const numberOfReservations = getRandomInt(1, totalNumberOfSeats); // Randomly generate the total number of reservations
      const reservedSeats = seatReservationBuilder(numberOfRows, numberOfReservations); // Create randomized list of reserved seats
      console.log("List of reserved seats: " + reservedSeats);
      
      // Build a visual schematic of the seats using createSeatReservationData()
      
      const seatReservationData = createSeatReservationData(reservedSeats, numberOfRows); // Create magic Sloth version of reserved seats
      const seatingTable = buildTable(seatReservationData); // Create HTML for seating table
      // Insert table HTML into the DOM
      document.getElementById("schematic").innerHTML = seatingTable;

      const numberOfValidLocations = validLocations(reservedSeats, numberOfRows);
      
      */
      
      // Update the "global" numberOfRows variable with the sanitized user input...
      numberOfRows = userInput;
      
      // Build the interactive table
      const seatingTable = buildTable2(numberOfRows);

      // Insert table HTML into the DOM
      document.getElementById("schematic").innerHTML = seatingTable;
      
      // Clear any current results and create a prompt...
      seatReservationData = [];
      document.getElementById("reserved-seats").innerHTML = "";
      document.getElementById("resultText").innerHTML = "";
      document.getElementById("prompt").innerHTML = "Okay!  Click on some seats and let's run the requested function.  Or you can change the number of rows, re-build the table, and try again.";
      
      /*
      
      // Dump the "global" seat array into the validLocations function along with the number of rows...
      const numberOfValidLocations = validLocations(seatReservationData, numberOfRows);
      
      const responseText = "Given " + numberOfRows + " rows of seats and the current seat reservations, the number of valid locations where we may fit a family of three will be " + numberOfValidLocations + ".";
      console.log(responseText);
      // Insert response text into the DOM and remove the user prompt
      document.getElementById("resultText").innerHTML = responseText;
      document.getElementById("prompt").innerHTML = "";
      
      */

  	}
      
}

// Clear any existing warning shown on the page

function clearWarning () {
	document.getElementById("formWarning").innerHTML = "";
}

// This is the heart of it all:  the function that actually determines the valid locations per the code challenge.

function validLocations(purchasedSeats, rows) {

	let validSeatingLocations = 0; // Initialize the variable that we will eventually return at the end of the function

	// Okay.  The first thing we're going to do is create a much nicer version of the data that is actually useable.

	const reservedSeatData = createSeatReservationData(purchasedSeats, rows); // Custom "Sloth Special" function

	console.log("Here is our reorganized data...");
	console.log(reservedSeatData);

	// There!  Now our reservations are organized by row and are in order.  So let's loop through these bad boys and apply our logic.
	// Each item in our "database" array is a row, and every row should be accounted for, even if there were no reservations for that row.
	// Therefore we can safely iterate over each object and do some logic checks.

	reservedSeatData.forEach(function(row) {
		// Okay.  Let's get all the seats for this row in an array.  
		// For the purposes of troubleshooting, we'll track each row's possible seating locations separately.
		let rowSeats = [];
		let validSeatingLocationsInThisRow = 0;
		row.seats.forEach(function(seat) {
			rowSeats.push(seat.slice(-1));
		});
		// console.log("Row Number: " + row.row);
		// console.log(rowSeats);
		// So let's tackle the first seat cluster.  If no reservations are found for seats A, B, and C, 
		// we will be able to fit our family of three in that location.
		// We'll use the indexOf method, which will return -1 if the argument cannot be found within the array.
		if (rowSeats.indexOf("A") === -1 && rowSeats.indexOf("B") === -1 && rowSeats.indexOf("C") === -1) {
			validSeatingLocationsInThisRow++;
		}
		// Let's tackle the third cluster.  Same rules as above, but with seats H, J, and K.
		if (rowSeats.indexOf("H") === -1 && rowSeats.indexOf("J") === -1 && rowSeats.indexOf("K") === -1) {
			validSeatingLocationsInThisRow++;
		}
		// Now with cluster number two, we can boil things down into an if else statement, since we don't want to
		// count all of the possible permutations for seating the family of three.
		if (rowSeats.indexOf("D") === -1 && rowSeats.indexOf("E") === -1 && rowSeats.indexOf("F") === -1) {
			validSeatingLocationsInThisRow++;
		} else if (rowSeats.indexOf("E") === -1 && rowSeats.indexOf("F") === -1 && rowSeats.indexOf("G") === -1) {
			validSeatingLocationsInThisRow++;
		}
		// console.log("Number of valid seating locations in this row: " + validSeatingLocationsInThisRow);
		validSeatingLocations = validSeatingLocations + validSeatingLocationsInThisRow;
	});

	return validSeatingLocations;

}

// Sloth's custom randomized seat reservation array builder...

function seatReservationBuilder (rows, numberOfReservations) {
	const availableSeats = ["A", "B", "C", "D", "E", "F", "G", "H", "J", "K"];
	let seatReservations = [];
	const maxAvailableSeats = (rows * 10);
	// Let's build a loop that randomly selects a row and applies a seat.
	while (seatReservations.length < maxAvailableSeats && seatReservations.length < numberOfReservations) {
		let randomRow = getRandomInt(1, rows);
		let randomSeat = availableSeats[Math.floor(Math.random() * availableSeats.length)];
		let newSeat = randomRow + randomSeat;
		// Check to see if this seat is currently in the seat reservation array; if not, add it to the array
		if (seatReservations.indexOf(newSeat) === -1) {
			seatReservations.push(newSeat);
		}
	}
	return seatReservations;
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// For the fun of it, let's create a useful version of the array of reserved seats.

function createSeatReservationData(purchasedSeats, rows) {
	purchasedSeatingData = []; // This will be an array of objects, with each object being the row and all seats belonging to that row
	for (i = 1; i <= rows; i++) {
		let rowData = { row: i, seats: [] }; // Create the row object
		purchasedSeats.forEach(function(seat) {
			let rowNumber = seat.slice(0, -1); // Remove the seat letter to get the row
			let seatLetter = seat.slice(-1); // Capture the seat letter for sanitization
			let sanitizedSeat = rowNumber + seatLetter.toUpperCase();
			if (rowNumber == i) {
				rowData.seats.push(sanitizedSeat); // If the row number for the seat matches current iteration row, add it to the object
			}
		});
		rowData.seats.sort(); // Once current row iteration is complete, put seats in order
		purchasedSeatingData.push(rowData); // Add the row object to our new data array
	}
	return purchasedSeatingData;
}

// The buildTable function takes in the data structure created by createSeatReservationData
// and builds an HTML table that can be manipulated using CSS to visually display the seats.
// If this looks intensely painful, you're right:  we could have done all of this with just a few lines in React.

function buildTable(purchasedSeatingData) {
  
  // initialize string which will contain our entire table
  let tableHtml = '<table><tr class="header-row"><td class="empty-cell"></td><td class="column-header">A</td><td class="column-header">B</td><td class="column-header">C</td><td class="empty-cell"></td><td class="column-header">D</td><td class="column-header">E</td><td class="column-header">F</td><td class="column-header">G</td><td class="empty-cell"></td><td class="column-header">H</td><td class="column-header">J</td><td class="column-header">K</td></tr>';

  purchasedSeatingData.forEach(function(row) {
    
    // For each row, create an array of seat letters
    let rowSeats = [];
    row.seats.forEach(function(seat) {
      let seatLetter = seat.slice(-1);
      rowSeats.push(seatLetter);
    });
    
    // Build variables to include classes based on seats in the current row
    let seatA = '';
    let seatB = '';
    let seatC = '';
    let seatD = '';
    let seatE = '';
    let seatF = '';
    let seatG = '';
    let seatH = '';
    let seatJ = '';
    let seatK = '';
    if (rowSeats.indexOf('A') !== -1) { seatA = '<td class="selected"></td>'; } else { seatA = '<td class="not-selected"></td>'; }
    if (rowSeats.indexOf('B') !== -1) { seatB = '<td class="selected"></td>'; } else { seatB = '<td class="not-selected"></td>'; }
    if (rowSeats.indexOf('C') !== -1) { seatC = '<td class="selected"></td>'; } else { seatC = '<td class="not-selected"></td>'; }
    if (rowSeats.indexOf('D') !== -1) { seatD = '<td class="selected"></td>'; } else { seatD = '<td class="not-selected"></td>'; }
    if (rowSeats.indexOf('E') !== -1) { seatE = '<td class="selected"></td>'; } else { seatE = '<td class="not-selected"></td>'; }  
    if (rowSeats.indexOf('F') !== -1) { seatF = '<td class="selected"></td>'; } else { seatF = '<td class="not-selected"></td>'; }
    if (rowSeats.indexOf('G') !== -1) { seatG = '<td class="selected"></td>'; } else { seatG = '<td class="not-selected"></td>'; }
    if (rowSeats.indexOf('H') !== -1) { seatH = '<td class="selected"></td>'; } else { seatH = '<td class="not-selected"></td>'; }
    if (rowSeats.indexOf('J') !== -1) { seatJ = '<td class="selected"></td>'; } else { seatJ = '<td class="not-selected"></td>'; }
    if (rowSeats.indexOf('K') !== -1) { seatK = '<td class="selected"></td>'; } else { seatK = '<td class="not-selected"></td>'; }        
        
    // Build the HTML for the table row
    let tableRow = '<tr><td class="row-number">' + row.row + '</td>' + seatA + seatB + seatC + '<td class="empty-cell"></td>' + seatD + seatE + seatF + seatG + '<td class="empty-cell"></td>' + seatH + seatJ + seatK + '</tr>';
    
    // Add the table row to the existing table HTML
    tableHtml = tableHtml + tableRow;
  });
  
  // Add finishing tag to table HTML
  tableHtml = tableHtml + '</table>';
  
  return tableHtml;
  
}

// The buildTable2 function is a new spin on this project:  it takes in a number of rows and then builds a "blank"
// table with which the user can interact to select seats to add to the seat array "by hand".

function buildTable2(rows) {
  
  // initialize string which will contain our entire table and add to it an initial string of HTML containing
  // the starting <table> tag and first row of seat markers (A, B, C, D, E, F, G, H, J)
  let tableHtml = '<table><tr class="header-row"><td class="empty-cell"></td><td class="column-header">A</td><td class="column-header">B</td><td class="column-header">C</td><td class="empty-cell"></td><td class="column-header">D</td><td class="column-header">E</td><td class="column-header">F</td><td class="column-header">G</td><td class="empty-cell"></td><td class="column-header">H</td><td class="column-header">J</td><td class="column-header">K</td></tr>';
  
  // Now let's build the "meat" of the table with a for loop:
  
  for (i = 1; i <= rows; i++) {
    // Build the HTML for the table row, adding in an onclick handler
    let newRow = '<tr id="row-number-' + i + '"><td class="row-number">' + i + '</td><td id="seat-' + i + 'A" class="not-selected" onclick="seatToggle(this.id)"></td><td id="seat-' + i + 'B" class="not-selected" onclick="seatToggle(this.id)"></td><td id="seat-' + i + 'C" class="not-selected" onclick="seatToggle(this.id)"></td><td class="empty-cell"></td><td id="seat-' + i + 'D" class="not-selected" onclick="seatToggle(this.id)"><td id="seat-' + i + 'E" class="not-selected" onclick="seatToggle(this.id)"><td id="seat-' + i + 'F" class="not-selected" onclick="seatToggle(this.id)"><td id="seat-' + i + 'G" class="not-selected" onclick="seatToggle(this.id)"><td class="empty-cell"></td><td id="seat-' + i + 'H" class="not-selected" onclick="seatToggle(this.id)"><td id="seat-' + i + 'J" class="not-selected" onclick="seatToggle(this.id)"><td id="seat-' + i + 'K" class="not-selected" onclick="seatToggle(this.id)"></tr>';
    // Add the new row to the existing table HTML string
    tableHtml = tableHtml + newRow;
  }
  
  // Add finishing tag to table HTML
  tableHtml = tableHtml + '</table>';
  
  return tableHtml;
  
}

// The seatToggle function flips the class of the clicked seat within the HTML DOM and manipulates the "global"
// seating array accordingly.  It also will display the current results to the HTML DOM (or remove it).

function seatToggle(seat) {
  
  // Because HTML ID's cannot start with a number, we need to take off the "seat-" from the seat ID...
    seatId = seat.replace("seat-", "");
  
  if (document.getElementById(seat).className == "not-selected") {
    document.getElementById(seat).className = "selected"; 
    seatReservationData.push(seatId);
  } else if (document.getElementById(seat).className == "selected") { 
    document.getElementById(seat).className = "not-selected";
    const seatIndex = seatReservationData.indexOf(seatId);
    seatReservationData.splice(seatIndex, 1);
  }
  
  // This section displays the results or removes the results if the seat array is empty.
  if (seatReservationData.length != 0) {
    displayCurrentReservations(seatReservationData);
    displayValidSeatingLocations(seatReservationData, numberOfRows);
  } else {
    document.getElementById("reserved-seats").innerHTML = "";
    document.getElementById("resultText").innerHTML = "";
    document.getElementById("prompt").innerHTML = "Ummmmm... didn't you want to select some seats?";
  }
  
}

// The displayCurrentReservations function dumps the content of the current seating reservations into the HTML DOM.

function displayCurrentReservations(purchasedSeats) {
  
  let listOfSeats = "";
  seatReservationData.forEach(function(seat) {
    // Because HTML ID's cannot start with a number, we need to take off the "seat-" from the seat ID...
    seatId = seat.replace("seat-", "");
    listOfSeats = listOfSeats + seatId + ", ";
  });
  
  document.getElementById("reserved-seats").innerHTML = "The current list of reserved seats are as follows:<br />" + listOfSeats;
  
}

// The displayValidSeatingLocations function updates the HTML DOM, displaying the results of the validLocations function.

function displayValidSeatingLocations(purchasedSeats, rows) {
  
  const numberOfValidLocations = validLocations(purchasedSeats, rows);
  
  const responseText = "Given " + numberOfRows + " rows of seats and the current seat reservations, the number of valid locations where we may fit a family of three will be " + numberOfValidLocations + ".";

  // Insert response text into the DOM
  document.getElementById("resultText").innerHTML = responseText;
  document.getElementById("prompt").innerHTML = "";
  
}

