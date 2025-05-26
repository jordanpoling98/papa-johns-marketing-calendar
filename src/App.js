import React, { useState, useEffect } from 'react';

// Define a helper function to get weather icon based on temperature
const getWeatherIcon = (temp) => {
  if (temp >= 75) return '☀️'; // Sunny for 75°F and above
  if (temp >= 65) return '☁️'; // Cloudy for 65°F to 74°F
  return '🌧️'; // Rainy/cooler for below 65°F
};

// Define the initial calendar data for June 2025 with accurate dates
// and VERIFIED HISTORICAL WEATHER DATA FOR JUNE 2024 (Vancouver, WA 98683)
// June 1, 2025 is a Sunday. The data starts directly with June 1.
const initialCalendarData = [
  // June 2024 Historical Weather Data for Vancouver, WA (98683 vicinity)
  // Source: AccuWeather historical data for June 2024
  { date: 1, day: 'Sun', weather: { high: 73, icon: getWeatherIcon(73) }, promos: [] },
  { date: 2, day: 'Mon', weather: { high: 62, icon: getWeatherIcon(62) }, promos: [
    { id: 'promo1', type: 'general', text: 'Start of Cheddar Pizza' },
    { id: 'promo2', type: 'general', text: 'Shaq-a-Roni becomes permanent menu item', detail: '$16.99 SHAQ / $18.99 w/ 2L' }
  ], specialDay: 'special-day', weekLabel: 'P6 Wk3' },
  { date: 3, day: 'Tue', weather: { high: 63, icon: getWeatherIcon(63) }, promos: [
    { id: 'promo3', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ]},
  { date: 4, day: 'Wed', weather: { high: 68, icon: getWeatherIcon(68) }, promos: [
    { id: 'promo4', type: 'rmp50', text: '50% Off RMP to Lapsed Guests', detail: 'Promo Code: RMP50' }
  ]},
  { date: 5, day: 'Thu', weather: { high: 75, icon: getWeatherIcon(75) }, promos: [] },
  { date: 6, day: 'Fri', weather: { high: 81, icon: getWeatherIcon(81) }, promos: [] },
  { date: 7, day: 'Sat', weather: { high: 86, icon: getWeatherIcon(86) }, promos: [] },
  { date: 8, day: 'Sun', weather: { high: 83, icon: getWeatherIcon(83) }, promos: [] },
  { date: 9, day: 'Mon', weather: { high: 76, icon: getWeatherIcon(76) }, promos: [], weekLabel: 'P6 Wk4' },
  { date: 10, day: 'Tue', weather: { high: 79, icon: getWeatherIcon(79) }, promos: [
    { id: 'promo5', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ]},
  { date: 11, day: 'Wed', weather: { high: 74, icon: getWeatherIcon(74) }, promos: [] },
  { date: 12, day: 'Thu', weather: { high: 73, icon: getWeatherIcon(73) }, promos: [] },
  { date: 13, day: 'Fri', weather: { high: 75, icon: getWeatherIcon(75) }, promos: [] },
  { date: 14, day: 'Sat', weather: { high: 69, icon: getWeatherIcon(69) }, promos: [] },
  { date: 15, day: 'Sun', weather: { high: 64, icon: getWeatherIcon(64) }, promos: [], specialDay: 'special-fathers-day', specialText: '👔 Father’s Day' },
  { date: 16, day: 'Mon', weather: { high: 65, icon: getWeatherIcon(65) }, promos: [], weekLabel: 'P7 Wk1' },
  { date: 17, day: 'Tue', weather: { high: 66, icon: getWeatherIcon(66) }, promos: [
    { id: 'promo6', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ]},
  { date: 18, day: 'Wed', weather: { high: 73, icon: getWeatherIcon(73) }, promos: [
    { id: 'promo7', type: 'rmp50', text: '50% Off RMP to Lapsed Guests', detail: 'Promo Code: RMP50' }
  ]},
  { date: 19, day: 'Thu', weather: { high: 86, icon: getWeatherIcon(86) }, promos: [], specialDay: 'special-juneteenth', specialText: 'Juneteenth' },
  { date: 20, day: 'Fri', weather: { high: 90, icon: getWeatherIcon(90) }, promos: [] },
  { date: 21, day: 'Sat', weather: { high: 91, icon: getWeatherIcon(91) }, promos: [] },
  { date: 22, day: 'Sun', weather: { high: 86, icon: getWeatherIcon(86) }, promos: [] },
  { date: 23, day: 'Mon', weather: { high: 71, icon: getWeatherIcon(71) }, promos: [], weekLabel: 'P7 Wk2' },
  { date: 24, day: 'Tue', weather: { high: 76, icon: getWeatherIcon(76) }, promos: [
    { id: 'promo8', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ]},
  { date: 25, day: 'Wed', weather: { high: 88, icon: getWeatherIcon(88) }, promos: [] },
  { date: 26, day: 'Thu', weather: { high: 71, icon: getWeatherIcon(71) }, promos: [] },
  { date: 27, day: 'Fri', weather: { high: 69, icon: getWeatherIcon(69) }, promos: [] },
  { date: 28, day: 'Sat', weather: { high: 80, icon: getWeatherIcon(80) }, promos: [] },
  { date: 29, day: 'Sun', weather: { high: 82, icon: getWeatherIcon(82) }, promos: [] },
  { date: 30, day: 'Mon', weather: { high: 80, icon: getWeatherIcon(80) }, promos: [], weekLabel: 'P7 Wk3' },
];

const App = () => {
  const [calendar, setCalendar] = useState(initialCalendarData);
  const [isPromoModalVisible, setIsPromoModalVisible] = useState(false);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false); // New state for edit modal
  const [selectedEvent, setSelectedEvent] = useState(null); // To store event being edited
  const [promoCopyOutput, setPromoCopyOutput] = useState('');
  const [isLoadingPromo, setIsLoadingPromo] = useState(false);

  // State for the new/edited event form
  const [eventDate, setEventDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventPromoCode, setEventPromoCode] = useState('');
  const [eventColor, setEventColor] = useState('general');

  // Function to open Add Event modal
  const openAddEventModal = () => {
    setEventDate('');
    setEventTitle('');
    setEventPromoCode('');
    setEventColor('general');
    setSelectedEvent(null); // Ensure no event is selected for editing
    setIsAddEventModalVisible(true);
  };

  // Function to open Edit Event modal
  const openEditEventModal = (dayDate, promoId) => {
    const day = calendar.find(d => d.date === dayDate);
    if (day) {
      const promo = day.promos.find(p => p.id === promoId);
      if (promo) {
        setEventDate(dayDate);
        setEventTitle(promo.text);
        setEventPromoCode(promo.detail || '');
        setEventColor(promo.type);
        setSelectedEvent({ dayDate, promoId }); // Store which event is being edited
        setIsEditEventModalVisible(true);
      }
    }
  };

  const handleAddEditEventSubmit = (e) => {
    e.preventDefault();
    const dateNum = parseInt(eventDate, 10);

    if (isNaN(dateNum) || dateNum < 1 || dateNum > 30 || !eventTitle.trim()) {
      alert('Please enter a valid date (1-30) and promo title.'); // Using alert for simplicity as per instructions
      return;
    }

    if (selectedEvent) { // Editing existing event
      setCalendar(prevCalendar => prevCalendar.map(day => {
        if (day.date === selectedEvent.dayDate) {
          return {
            ...day,
            promos: day.promos.map(promo =>
              promo.id === selectedEvent.promoId
                ? { ...promo, type: eventColor, text: eventTitle.trim(), detail: eventPromoCode.trim() || undefined }
                : promo
            )
          };
        }
        return day;
      }));
      setIsEditEventModalVisible(false);
    } else { // Adding new event
      const newPromo = {
        id: `promo${Date.now()}`, // Simple unique ID
        type: eventColor,
        text: eventTitle.trim(),
        detail: eventPromoCode.trim() || undefined
      };

      setCalendar(prevCalendar => prevCalendar.map(day => {
        if (day.date === dateNum) {
          return { ...day, promos: [...day.promos, newPromo] };
        }
        return day;
      }));
      setIsAddEventModalVisible(false);
    }

    // Reset form fields
    setEventDate('');
    setEventTitle('');
    setEventPromoCode('');
    setEventColor('general');
  };

  const handleDeleteEvent = (dayDate, promoId) => {
    // Using alert for simplicity as per instructions
    if (window.confirm('Are you sure you want to delete this event?')) {
      setCalendar(prevCalendar => prevCalendar.map(day => {
        if (day.date === dayDate) {
          return {
            ...day,
            promos: day.promos.filter(promo => promo.id !== promoId)
          };
        }
        return day;
      }));
    }
  };

  const generatePromoCopy = async (promoText) => {
    setIsPromoModalVisible(true);
    setPromoCopyOutput(''); // Clear previous output
    setIsLoadingPromo(true); // Show loading indicator

    const prompt = `Generate a short, engaging social media post for the following Papa John's promotion: "${promoText}". Keep it under 200 characters and include relevant emojis.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    const apiKey = ""; // Leave as-is, Canvas will provide

    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API error: ${response.status} - ${errorData.error.message || response.statusText}`);
      }

      const result = await response.json();

      if (result.candidates && result.candidates.length > 0 &&
          result.candidates[0].content && result.candidates[0].content.parts &&
          result.candidates[0].content.parts.length > 0) {
        const text = result.candidates[0].content.parts[0].text;
        setPromoCopyOutput(text);
      } else {
        setPromoCopyOutput('Could not generate promo copy. Unexpected API response.');
      }
    } catch (error) {
      console.error('Error generating promo copy:', error);
      setPromoCopyOutput(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsLoadingPromo(false); // Hide loading indicator
    }
  };

  // Helper to chunk the calendar data into weeks for table rendering
  const chunkIntoWeeks = (data) => {
    const weeks = [];
    const daysInMonth = data.length; // 30 for June
    const firstDayOfMonthDate = new Date('2025-06-01T00:00:00'); // Use T00:00:00 to ensure start of day and avoid timezone issues
    const firstDayOfWeekIndex = firstDayOfMonthDate.getDay(); // 0 for Sunday, 1 for Monday...

    // Create a flat array for all days in the grid (up to 6 weeks * 7 days)
    const allDaysInGrid = Array(6 * 7).fill(null);

    // Place the actual calendar days into the grid starting from the correct day of the week
    let currentDayIndex = firstDayOfWeekIndex;
    for (let i = 0; i < daysInMonth; i++) {
      allDaysInGrid[currentDayIndex] = data[i];
      currentDayIndex++;
    }

    // Chunk the flat array into weeks (rows)
    for (let i = 0; i < allDaysInGrid.length; i += 7) {
      weeks.push(allDaysInGrid.slice(i, i + 7));
    }

    // Remove any trailing empty weeks if they don't contain any actual days
    while (weeks.length > 0 && weeks[weeks.length - 1].every(day => day === null)) {
      weeks.pop();
    }

    return weeks;
  };

  const weeks = chunkIntoWeeks(calendar);

  return (
    <div className="body">
      <div className="logo">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Papa_Johns_logo.svg/2560px-Papa_Johns_logo.svg.png" alt="Papa John's Logo" />
      </div>
      
      {/* New: Add Event Controls */}
      <div className="add-event-controls">
        <div className="add-button-container">
          <button className="add-button" onClick={openAddEventModal}>
            +
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <img src="https://images.vexels.com/media/users/3/143402/isolated/preview/afbbf15d5e82a1c4fb5a55c4eacf3003-graduation-cap-icon.png" alt="Graduation Cap" className="header-icon" />
          <img src="https://png.pngtree.com/png-clipart/20220812/ourmid/pngtree-shine-sun-light-effect-free-png-and-psd-png-image_6106445.png" alt="Sunshine" className="header-icon" />
          <h1>June 2025 Marketing Calendar</h1>
        </div>
        <div className="banner">Graduation Month – Local Schools & Summer Programs</div>
        <table>
          <thead>
            <tr>
              <th>Sun</th><th>Mon</th><th>Tue</th><th>Wed</th><th>Thu</th><th>Fri</th><th>Sat</th>
            </tr>
          </thead>
          <tbody>
            {weeks.map((week, weekIndex) => (
              <tr key={weekIndex}>
                {week.map((dayData, dayIndex) => (
                  <td key={dayIndex} className={dayData?.specialDay || ''}>
                    {dayData ? (
                      <div className="cell-content">
                        <div className="date-weather-group">
                          <div className="date-number" style={dayData.specialDay === 'special-fathers-day' ? { color: '#ffeb3b' } : dayData.specialDay === 'special-juneteenth' ? { color: '#fcd116' } : {}}>
                            {dayData.date}
                          </div>
                          <div className="weather">
                            {dayData.weather.icon} {dayData.weather.high}°
                          </div>
                        </div>
                        
                        {dayData.specialText && (
                          <div className="badge special-text-badge" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff' }}>
                            {dayData.specialText}
                          </div>
                        )}
                        
                        {dayData.promos.map((promo, promoIndex) => (
                          <div className="card" key={promoIndex}>
                            <div className={`badge ${promo.type === 'two-dollar' ? 'two-dollar' : promo.type === 'rmp50' ? 'rmp50' : ''}`}>
                              {promo.text}
                            </div>
                            {promo.detail && (
                              <span className={`promo-detail ${promo.type === 'two-dollar' ? 'two-dollar' : promo.type === 'rmp50' ? 'rmp50' : ''}`}>
                                {promo.detail}
                              </span>
                            )}
                            <span
                              className="generate-promo-star"
                              onClick={(e) => {
                                e.stopPropagation();
                                generatePromoCopy(`${promo.text} ${promo.detail || ''}`);
                              }}
                              title="Generate Promo Copy"
                            >
                              ✨
                            </span>
                            {/* New: Edit and Delete Icons */}
                            <span
                              className="edit-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                openEditEventModal(dayData.date, promo.id);
                              }}
                              title="Edit Event"
                            >
                              ✏️
                            </span>
                            <span
                              className="delete-icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteEvent(dayData.date, promo.id);
                              }}
                              title="Delete Event"
                            >
                              🗑️
                            </span>
                          </div>
                        ))}

                        {dayData.weekLabel && (
                          <div className="week-label-bubble">
                            {dayData.weekLabel}
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="cell-content empty-cell" style={{ backgroundColor: '#f9f9f9' }}>{/* Empty cell */}</div>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Promo Copy Modal Structure */}
      {isPromoModalVisible && (
        <div id="promoCopyModalOverlay" className="modal-overlay visible">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setIsPromoModalVisible(false)}>&times;</button>
            <div className="modal-title">Generated Promo Copy</div>
            {isLoadingPromo ? (
              <div className="loading-indicator">Generating...</div>
            ) : (
              <div className="promo-copy-output">{promoCopyOutput}</div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Event Modal Form */}
      {(isAddEventModalVisible || isEditEventModalVisible) && (
        <div id="eventFormModalOverlay" className="modal-overlay visible">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => {
                setIsAddEventModalVisible(false);
                setIsEditEventModalVisible(false);
            }}>&times;</button>
            <div className="modal-title">{selectedEvent ? 'Edit Calendar Event' : 'Add New Calendar Event'}</div>
            <form onSubmit={handleAddEditEventSubmit} className="add-event-form">
              <div className="form-group">
                <label htmlFor="eventDate">Date (1-30):</label>
                <input
                  type="number"
                  id="eventDate"
                  min="1"
                  max="30"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
                  disabled={!!selectedEvent} 
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventTitle">Promo Title:</label>
                <input
                  type="text"
                  id="eventTitle"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="eventPromoCode">Promo Code (Optional):</label>
                <input
                  type="text"
                  id="eventPromoCode"
                  value={eventPromoCode}
                  onChange={(e) => setEventPromoCode(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Color:</label>
                <div className="color-options">
                  <label>
                    <input
                      type="radio"
                      name="eventColor"
                      value="general"
                      checked={eventColor === 'general'}
                      onChange={(e) => setEventColor(e.target.value)}
                    />
                    White (Default)
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="eventColor"
                      value="two-dollar"
                      checked={eventColor === 'two-dollar'}
                      onChange={(e) => setEventColor(e.target.value)}
                    />
                    Red
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="eventColor"
                      value="rmp50"
                      checked={eventColor === 'rmp50'}
                      onChange={(e) => setEventColor(e.target.value)}
                    />
                    Green
                  </label>
                </div>
              </div>
              <button type="submit" className="submit-event-btn">
                {selectedEvent ? 'Save Changes' : 'Add Event'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Styles for the React App */}
      <style>{`
        body {
          font-family: 'Open Sans', sans-serif;
          font-weight: 300;
          line-height: 1.6;
          background-color: #f0f2f5;
          color: #333;
          margin: 0;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          min-height: 100vh;
        }

        h1, .banner {
          font-family: 'Montserrat', sans-serif;
          font-weight: 800;
          letter-spacing: 0.5px;
          text-transform: uppercase;
        }

        h1 {
          color: #c8102e;
          font-size: 2.5em;
          margin-bottom: 0.5em;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
        }

        .banner {
          font-weight: 600;
          background-color: #006c3b;
          color: #fff;
          padding: 15px 20px;
          margin-bottom: 20px;
          border-radius: 8px;
          text-align: center;
          box-shadow: 0 4px 8px rgba(0,0,0,0.1);
        }
        
        .calendar-container {
          max-width: 1200px;
          width: 100%;
          margin: auto;
          background-color: #ffffff;
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
          overflow: hidden;
        }
        .calendar-header {
          padding: 1.5rem 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #ffffff;
          border-bottom: 1px solid #e0e0e0;
          border-radius: 12px 12px 0 0;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          table-layout: fixed;
        }
        th {
          border: 1px solid #ebebeb;
          background-color: #f8f8f8;
          padding: 12px 8px;
          text-align: center;
          font-size: 0.95em;
          font-weight: 600;
          color: #666;
          text-transform: uppercase;
        }
        td {
          border: 1px solid #ebebeb;
          background-color: #fdfdfd;
          vertical-align: top;
          height: 160px; /* Fixed height for consistent row height */
          padding: 12px;
          transition: background-color 0.2s ease-in-out;
        }
        td:hover {
            background-color: #f5f5f5;
        }
        /* Style for empty cells */
        .empty-cell {
            background-color: #f9f9f9 !important; /* Lighter background for empty cells */
        }

        .cell-content {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            height: 100%;
        }

        .date-weather-group {
            display: flex;
            align-items: center;
            gap: 6px; /* Space between date and weather */
            margin-bottom: 8px; /* Space below date/weather group */
        }

        .week-label { /* Original week-label style, now unused */
          font-size: 0.68em;
          color: #999;
          margin-bottom: 4px;
        }

        .date-number {
          font-size: 1.3em;
          font-weight: 700;
          color: #222;
        }
        .weather {
          font-size: 0.8em;
          color: #555;
        }

        .badge {
          display: block;
          padding: 8px 10px;
          border-radius: 6px;
          font-weight: 600;
          font-size: 0.85em;
          text-align: center;
          box-shadow: 0 1px 3px rgba(0,0,0,0.05);
          transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
          width: 100%;
          box-sizing: border-box;
        }
        .badge:hover {
            transform: translateY(-1px);
            box-shadow: 0 2px 6px rgba(0,0,0,0.1);
        }
        .badge.two-dollar {
          background-color: #ffe8eb;
          color: #c8102e;
        }
        .badge.rmp50 {
          background-color: #e8f5e8;
          color: #006c3b;
        }
        /* New style for special text badge (Father's Day, Juneteenth) */
        .badge.special-text-badge {
            background: rgba(255,255,255,0.2);
            color: #fff;
            box-shadow: none; /* No extra shadow for these */
            border: 1px solid rgba(255,255,255,0.3); /* Subtle white border */
            margin-bottom: 8px; /* Space below this badge */
            padding: 6px 10px; /* Slightly smaller padding */
        }

        .card {
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.03);
          padding: 8px;
          margin-top: 8px;
          border: 1px solid #f0f0f0;
          width: 100%;
          box-sizing: border-box;
          position: relative; /* Needed for absolute positioning of star */
        }
        .card:first-of-type {
            margin-top: 0; /* No top margin for the first card in a cell */
        }
        /* Ensure spacing between multiple cards in a cell */
        .cell-content .card + .card {
            margin-top: 8px;
        }

        .promo-detail {
            font-size: 0.68em;
            color: #777;
            display: block;
            margin-top: 5px;
            line-height: 1.2;
            text-align: center;
        }
        .promo-detail.two-dollar {
            color: #a00d27;
        }
        .promo-detail.rmp50 {
            color: #00502a;
        }

        .special-day {
          background-color: #fffbf0;
          border: 2px solid #f9e0a0;
        }
        .special-fathers-day {
          background: linear-gradient(135deg, #e0f7fa 0%, #004d40 100%);
          border: 2px solid rgba(0, 77, 64, 0.4);
          color: #fff;
        }
        .special-juneteenth {
          background: linear-gradient(135deg, #f0f4f8 0%, #bf0a30 50%, #fcd116 100%);
          border: 2px solid rgba(0, 0, 0, 0.4);
          color: #fff;
        }
        .logo { 
            text-align: center; 
            margin-bottom: 15px;
            padding-top: 5px;
        }
        .logo img { 
            height: 30px;
            width: auto;
            max-width: 100%;
            display: block;
            margin: 0 auto;
        }
        .header-icon {
            vertical-align: middle;
            margin-right: 8px;
            width: 25px;
            height: 25px;
        }

        /* New styles for the hidden star emoji button */
        .generate-promo-star {
          position: absolute;
          top: 4px;
          right: 6px;
          font-size: 1.1em;
          cursor: pointer;
          opacity: 0.3;
          transition: opacity 0.2s ease-in-out, transform 0.1s ease-in-out;
          line-height: 1;
          padding: 3px;
          border-radius: 50%;
          background-color: transparent;
        }
        .generate-promo-star:hover {
          opacity: 1;
          transform: scale(1.1);
          background-color: rgba(255, 255, 255, 0.7);
        }
        .generate-promo-star:active {
          transform: scale(0.95);
        }

        /* New week-label-bubble style */
        .week-label-bubble {
            background-color: #e8f0f8;
            color: #555;
            font-size: 0.65em;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 12px;
            margin-top: auto;
            align-self: flex-end;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
            border: 1px solid #d0dbe8;
        }

        /* Modal styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.6);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          opacity: 0;
          visibility: hidden;
          transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
        }
        .modal-overlay.visible {
          opacity: 1;
          visibility: visible;
        }

        .modal-content {
          background-color: #fff;
          padding: 25px;
          border-radius: 10px;
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
          width: 90%;
          max-width: 500px;
          transform: translateY(-20px);
          transition: transform 0.3s ease-in-out;
          position: relative;
        }
        .modal-overlay.visible .modal-content {
          transform: translateY(0);
        }

        .modal-close-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          background: none;
          border: none;
          font-size: 1.5em;
          cursor: pointer;
          color: #888;
          transition: color 0.2s;
        }
        .modal-close-btn:hover {
          color: #333;
        }

        .modal-title {
          font-family: 'Montserrat', sans-serif;
          font-weight: 700;
          font-size: 1.3em;
          color: #c8102e;
          margin-bottom: 15px;
          text-align: center;
        }

        .promo-copy-output {
          background-color: #f8f8f8;
          border: 1px solid #eee;
          padding: 15px;
          border-radius: 8px;
          min-height: 80px;
          font-size: 0.9em;
          line-height: 1.5;
          color: #444;
          white-space: pre-wrap;
          word-wrap: break-word;
        }

        .loading-indicator {
          text-align: center;
          padding: 20px;
          font-style: italic;
          color: #777;
        }
        .loading-indicator::after {
          content: '...';
          animation: loading-dots 1s infinite;
        }
        @keyframes loading-dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }

        /* Add/Edit Event Form Styles */
        .add-event-controls {
            width: 100%;
            max-width: 1200px;
            display: flex;
            justify-content: flex-end; /* Align to the right */
            margin-bottom: 15px;
            position: relative; /* For dropdown positioning if needed later */
        }

        .add-button {
            background-color: #006c3b;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            font-size: 1.5em; /* Larger plus sign */
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
            line-height: 1; /* Keep plus sign centered */
        }
        .add-button:hover {
            background-color: #005a30;
            transform: translateY(-1px);
        }
        .add-button:active {
            transform: translateY(0);
        }

        .add-event-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }

        .form-group {
            display: flex;
            flex-direction: column;
        }

        .form-group label {
            font-size: 0.9em;
            color: #555;
            margin-bottom: 5px;
            font-weight: 600;
        }

        .form-group input[type="text"],
        .form-group input[type="number"] {
            padding: 10px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 1em;
            width: 100%;
            box-sizing: border-box;
        }
        .form-group input[type="number"]:disabled {
            background-color: #f0f0f0;
            cursor: not-allowed;
        }

        .color-options {
            display: flex;
            gap: 15px;
            margin-top: 5px;
        }

        .color-options label {
            display: flex;
            align-items: center;
            font-size: 0.9em;
            font-weight: 400;
            cursor: pointer;
        }

        .color-options input[type="radio"] {
            margin-right: 5px;
            cursor: pointer;
        }

        .submit-event-btn {
            background-color: #c8102e;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 1em;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
            margin-top: 20px;
        }
        .submit-event-btn:hover {
            background-color: #a00d27;
        }

        /* Edit/Delete Icons */
        .edit-icon, .delete-icon {
            position: absolute;
            top: 4px; /* Align with star */
            font-size: 0.9em; /* Smaller icons */
            cursor: pointer;
            opacity: 0; /* Hidden by default */
            transition: opacity 0.2s ease-in-out, transform 0.1s ease-in-out;
            line-height: 1;
            padding: 3px;
            border-radius: 50%;
            background-color: transparent;
        }
        .card:hover .edit-icon,
        .card:hover .delete-icon {
            opacity: 0.7; /* Visible on card hover */
        }
        .edit-icon:hover, .delete-icon:hover {
            opacity: 1;
            transform: scale(1.1);
            background-color: rgba(255, 255, 255, 0.7);
        }
        .edit-icon {
            right: 28px; /* Position next to star */
            color: #007bff; /* Blue for edit */
        }
        .delete-icon {
            right: 50px; /* Position next to edit */
            color: #dc3545; /* Red for delete */
        }

        @media (max-width: 768px) {
            body {
                padding: 10px;
            }
            h1 {
                font-size: 1.5em;
            }
            .banner {
                font-size: 0.8em;
                padding: 8px 12px;
            }
            th, td {
                padding: 6px 3px;
                font-size: 0.8em;
            }
            .cell-content {
                min-height: 100px;
            }
            .date-number {
                font-size: 1em;
            }
            .weather {
                font-size: 0.7em;
            }
            .badge {
                font-size: 0.75em;
                padding: 5px 7px;
            }
            .card .promo-detail {
                font-size: 0.55em;
            }
            .logo img { 
                height: 20px;
            }
            .header-icon { 
                width: 18px;
                height: 18px;
            }
            .modal-content {
                padding: 10px;
            }
            .modal-title {
                font-size: 1em;
            }
            .promo-copy-output {
                font-size: 0.75em;
            }
            .generate-promo-star {
                top: 1px;
                right: 2px;
                font-size: 0.8em;
                padding: 1px;
            }
            .week-label-bubble {
                font-size: 0.6em;
                padding: 3px 6px;
            }
            .add-button {
                font-size: 1.2em;
                padding: 8px 12px;
            }
            .form-group label {
                font-size: 0.8em;
            }
            .form-group input[type="text"],
            .form-group input[type="number"] {
                padding: 8px;
                font-size: 0.9em;
            }
            .color-options label {
                font-size: 0.8em;
            }
            .submit-event-btn {
                padding: 10px 15px;
                font-size: 0.9em;
            }
            .edit-icon, .delete-icon {
                top: 1px;
                font-size: 0.8em;
                padding: 2px;
            }
            .edit-icon {
                right: 20px;
            }
            .delete-icon {
                right: 38px;
            }
        }
      `}</style>
    </div>
  );
};

export default App;
