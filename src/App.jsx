import React, { useState } from "react";
import "./App.css";

const rows = 11;
const seatsPerRow = 7;
const createInitialSeats = () => {
  let seats = [];
  for (let i = 0; i < rows; i++) {
    seats.push(new Array(seatsPerRow).fill(0));
  }
  seats.push(new Array(3).fill(0));
  return seats;
};

const Seats = () => {
  const [seatStatus, setSeatStatus] = useState(createInitialSeats());
  const [seatsToBook, setSeatsToBook] = useState(0);
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [error, setError] = useState("");
  const [ticket, setTicket] = useState(null);

  const bookSeats = () => {
    let seats = [...seatStatus];
    let totalAvailable = seats.flat().filter((seat) => seat === 0).length;
    if(seatsToBook<=0){
      setError("Enter at least 1 seat to book!");
      return;
    }

    if (seatsToBook > totalAvailable) {
      setError("Not enough seats available.");
      return;
    }

    if (seatsToBook > 7) {
      setError("You can book a maximum of 7 seats.");
      return;
    }

    if (!username || !age || !phoneNo) {
      setError("Please fill out the entire form.");
      return;
    }

    let bookedSeats = [];
    for (let i = 0; i < seatStatus.length; i++) {
      let row = seatStatus[i];
      let availableSeatsInRow = row.reduce((acc, seat, idx) => {
        if (seat === 0) acc.push(idx);
        return acc;
      }, []);

      if (availableSeatsInRow.length >= seatsToBook) {
        for (let j = 0; j < seatsToBook; j++) {
          row[availableSeatsInRow[j]] = 1;
          bookedSeats.push(`Row ${i + 1} Seat ${availableSeatsInRow[j] + 1}`);
        }
        setSeatStatus(seats);
        setError("");
        generateTicket(username, phoneNo, bookedSeats);
        return;
      }
    }
    let remainingSeats = seatsToBook;
    for (let i = 0; i < seatStatus.length && remainingSeats > 0; i++) {
      let row = seatStatus[i];
      for (let j = 0; j < row.length && remainingSeats > 0; j++) {
        if (row[j] === 0) { 
          row[j] = 1;  
          bookedSeats.push(`Row ${i + 1} Seat ${j + 1}`);
          remainingSeats--;
        }
      }
    }
    setSeatStatus(seats);
    setError("");
    generateTicket(username, phoneNo, bookedSeats);
  };

  const generateTicket = (name, phone, bookedSeats) => {
    const ticketInfo = `
      Name: ${name}
      Phone: ${phone}
      Seats Booked: ${bookedSeats.join(", ")}
    `;
    setTicket(ticketInfo);

    const element = document.createElement("a");
    const file = new Blob([ticketInfo], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = `${name}_ticket.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <div className="book">
      <h1>Train Seat Booking</h1>
      <div className="ui">
        <div className="seats-grid">
          {seatStatus.map((row, rowIndex) =>
            row.map((seat, seatIndex) => (
              <div
                key={`${rowIndex}-${seatIndex}`}
                className={`seat ${seat === 1 ? "booked" : "available"}`}
              ></div>
            ))
          )}
        </div>
        <div>
          <form>
            <input
              type="text"
              value={username}
              placeholder="Enter your name"
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type="number"
              value={age}
              placeholder="Enter your age"
              onChange={(e) => setAge(e.target.value)}
            />
            <input
              type="number"
              value={phoneNo}
              placeholder="Enter your phone number"
              onChange={(e) => setPhoneNo(e.target.value)}
            />
          </form>
          <input
            type="number"
            value={seatsToBook}
            onChange={(e) => setSeatsToBook(parseInt(e.target.value))}
            placeholder="Number of seats"
            max={7}
          />
          <button onClick={bookSeats}>Book Seats</button>
          {error && <p className="error">{error}</p>}
        </div>
      </div>
      {ticket && <pre>{ticket}</pre>}
    </div>
  );
};

export default Seats;
