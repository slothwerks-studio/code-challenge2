// It’s time to board The Badger and cruise across Lake Michigan! 
// The Badger uses assigned seating on the top deck, where seats are in three columns separated by aisles. 
// Several tickets have already been purchased. Our goal is to find all of the possible 
// contiguous seating locations for a family of three. The seats cannot be separated by an aisle. 
// Also, multiple permutations of seating arrangements within a column (or “cluster”) of seats 
// does not constitute multiple valid locations: if four contiguous seats are available, 
// this only constitutes one valid seating location.
//
// The challenge: write a function in a language of your choosing. This function will take in two arguments: 
// 1) an array of purchased seats in no particular order with the syntax of [row][seat], and 
// 2) the number of rows. The seats in each row are arranged thusly: a cluster of three (A, B, and C), 
// a cluster of four (D, E, F, and G), and a cluster of three (H, J, and K). 
// Please note the lack of a seat I (as in India). 
// The function should return the valid number of seating locations for the family of three:
// 
// function validLocations (purchasedSeats, rows) {
// 
//   … some code …
// 
//   return locations
//
// }

// Okay.  This is a logic puzzle.
// Given an array of strings that are reserved seats, we need to determine the number of possible clusters
// which include 3 contiguous seats.  In this puzzle, there are three clusters:  a cluster of three (seats A, B, and C),
// followed by a cluster of four (seats D, E, F, and G), followed by a cluster of three (seats H, J, and K).
// The first and third cluster follow the same rule:
// 
// * If any seat in the cluster is reserved, it cannot be a valid seating location.
//
// As for the middle cluster, we need to follow three rules:
//
// * If either of the middle two seats are reserved (seats E or F), it cannot be a valid seating location.
// * If the middle two seats are not reserved and the first seat is reserved (seat D), then the last seat (seat G) 
//   must not be reserved in order for the cluster to be a valid seating location.
// * If the middle two seats are not reserved and the last seat is reserved (seat G), then the first seat (seat A)
//   must not be reserved in order for the cluster to be a valid seating location.
// 
// It will be much easier to simply eliminate clusters and determine if they are NOT a valid location.  All we need to
// do is organize the data in a way that is useful (rather than the seat reservations being randomly dumped into an array).

// Let's start with some dummy data.

const numberOfRows = 10; // Arbitrary number of rows
const totalNumberOfSeats = numberOfRows * 10; // Total number of seats (given ten seats per row)
const numberOfReservations = getRandomInt(1, totalNumberOfSeats); // Randomly generate the total number of reservations
const reservedSeats = seatReservationBuilder(numberOfRows, numberOfReservations); // Create randomized list of reserved seats

console.log("Number of rows: " + numberOfRows);
console.log("List of reserved seats: " + reservedSeats);

const numberOfValidLocations = validLocations(reservedSeats, numberOfRows);

console.log("Given " + numberOfRows + " rows of seats and an array of existing seat reservations, the number of valid locations where we may fit a family of three will be " + numberOfValidLocations + ".");

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
		console.log("Row Number: " + row.row);
		console.log(rowSeats);
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
		console.log("Number of valid seating locations in this row: " + validSeatingLocationsInThisRow);
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
