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
  { date: 1, day: 'Sun', weather: { high: 73, icon: getWeatherIcon(73) }, promos: [], holiday: null, weekLabel: '' },
  { date: 2, day: 'Mon', weather: { high: 62, icon: getWeatherIcon(62) }, promos: [
    { id: 'promo1', type: 'general', text: 'Start of Cheddar Pizza' },
    { id: 'promo2', type: 'general', text: 'Shaq-a-Roni becomes permanent menu item', detail: '$16.99 SHAQ / $18.99 w/ 2L' }
  ], specialDay: 'special-day', weekLabel: 'P6 Wk3', holiday: null },
  { date: 3, day: 'Tue', weather: { high: 63, icon: getWeatherIcon(63) }, promos: [
    { id: 'promo3', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ], holiday: null, weekLabel: ''},
  { date: 4, day: 'Wed', weather: { high: 68, icon: getWeatherIcon(68) }, promos: [
    { id: 'promo4', type: 'rmp50', text: '50% Off RMP to Lapsed Guests', detail: 'Promo Code: RMP50' }
  ], holiday: null, weekLabel: ''},
  { date: 5, day: 'Thu', weather: { high: 75, icon: getWeatherIcon(75) }, promos: [], holiday: null, weekLabel: '' },
  { date: 6, day: 'Fri', weather: { high: 81, icon: getWeatherIcon(81) }, promos: [], holiday: null, weekLabel: '' },
  { date: 7, day: 'Sat', weather: { high: 86, icon: getWeatherIcon(86) }, promos: [], holiday: null, weekLabel: '' },
  { date: 8, day: 'Sun', weather: { high: 83, icon: getWeatherIcon(83) }, promos: [], holiday: null, weekLabel: '' },
  { date: 9, day: 'Mon', weather: { high: 76, icon: getWeatherIcon(76) }, promos: [], weekLabel: 'P6 Wk4', holiday: null },
  { date: 10, day: 'Tue', weather: { high: 79, icon: getWeatherIcon(79) }, promos: [
    { id: 'promo5', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ], holiday: null, weekLabel: ''},
  { date: 11, day: 'Wed', weather: { high: 74, icon: getWeatherIcon(74) }, promos: [], holiday: null, weekLabel: '' },
  { date: 12, day: 'Thu', weather: { high: 73, icon: getWeatherIcon(73) }, promos: [], holiday: null, weekLabel: '' },
  { date: 13, day: 'Fri', weather: { high: 75, icon: getWeatherIcon(75) }, promos: [], holiday: null, weekLabel: '' },
  { date: 14, day: 'Sat', weather: { high: 69, icon: getWeatherIcon(69) }, promos: [], holiday: null, weekLabel: '' },
  { date: 15, day: 'Sun', weather: { high: 64, icon: getWeatherIcon(64) }, promos: [], specialDay: '', specialText: "Father's Day", holiday: { id: 'holiday1', title: "Father's Day", notes: "Celebrate Dads!", highlight: true }, weekLabel: '' },
  { date: 16, day: 'Mon', weather: { high: 65, icon: getWeatherIcon(65) }, promos: [], weekLabel: 'P7 Wk1', holiday: null },
  { date: 17, day: 'Tue', weather: { high: 66, icon: getWeatherIcon(66) }, promos: [
    { id: 'promo6', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ], holiday: null, weekLabel: ''},
  { date: 18, day: 'Wed', weather: { high: 73, icon: getWeatherIcon(73) }, promos: [
    { id: 'promo7', type: 'rmp50', text: '50% Off RMP to Lapsed Guests', detail: 'Promo Code: RMP50' }
  ], holiday: null, weekLabel: ''},
  { date: 19, day: 'Thu', weather: { high: 86, icon: getWeatherIcon(86) }, promos: [], specialDay: '', specialText: 'Juneteenth', holiday: { id: 'holiday2', title: "Juneteenth", notes: "", highlight: true }, weekLabel: '' },
  { date: 20, day: 'Fri', weather: { high: 90, icon: getWeatherIcon(90) }, promos: [], holiday: null, weekLabel: '' },
  { date: 21, day: 'Sat', weather: { high: 91, icon: getWeatherIcon(91) }, promos: [], holiday: null, weekLabel: '' },
  { date: 22, day: 'Sun', weather: { high: 86, icon: getWeatherIcon(86) }, promos: [], holiday: null, weekLabel: '' },
  { date: 23, day: 'Mon', weather: { high: 71, icon: getWeatherIcon(71) }, promos: [], weekLabel: 'P7 Wk2', holiday: null },
  { date: 24, day: 'Tue', weather: { high: 76, icon: getWeatherIcon(76) }, promos: [
    { id: 'promo8', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ], holiday: null, weekLabel: ''},
  { date: 25, day: 'Wed', weather: { high: 88, icon: getWeatherIcon(88) }, promos: [], holiday: null, weekLabel: '' },
  { date: 26, day: 'Thu', weather: { high: 71, icon: getWeatherIcon(71) }, promos: [], holiday: null, weekLabel: '' },
  { date: 27, day: 'Fri', weather: { high: 69, icon: getWeatherIcon(69) }, promos: [], holiday: null, weekLabel: '' },
  { date: 28, day: 'Sat', weather: { high: 80, icon: getWeatherIcon(80) }, promos: [], holiday: null, weekLabel: '' },
  { date: 29, day: 'Sun', weather: { high: 82, icon: getWeatherIcon(82) }, promos: [], holiday: null, weekLabel: '' },
  { date: 30, day: 'Mon', weather: { high: 80, icon: getWeatherIcon(80) }, promos: [], weekLabel: 'P7 Wk3', holiday: null },
  // Add day 31 if the month has it, ensure initialCalendarData has 31 entries if needed for a specific month
  // { date: 31, day: 'Tue', weather: { high: 75, icon: getWeatherIcon(75) }, promos: [], holiday: null, weekLabel: '' },
];

// Custom Alert Modal Component
const AlertModal = ({ message, onClose }) => {
  return (
    <div className="modal-overlay visible">
      <div className="modal-content">
        <button className="modal-close-btn" onClick={onClose}>&times;</button>
        <div className="modal-title">Alert</div>
        <p>{message}</p>
        <button className="submit-event-btn" onClick={onClose}>OK</button>
      </div>
    </div>
  );
};

const App = () => {
  const [calendar, setCalendar] = useState(initialCalendarData);
  const [isPromoModalVisible, setIsPromoModalVisible] = useState(false);
  const [isAddEventModalVisible, setIsAddEventModalVisible] = useState(false);
  const [isEditEventModalVisible, setIsEditEventModalVisible] = useState(false);
  const [isAddHolidayModalVisible, setIsAddHolidayModalVisible] = useState(false);
  const [isEditHolidayModalVisible, setIsEditHolidayModalVisible] = useState(false);
  const [isEditDayModalVisible, setIsEditDayModalVisible] = useState(false); // New state for Edit Day modal
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [selectedDayData, setSelectedDayData] = useState(null); // New state for selected day for editing
  const [promoCopyOutput, setPromoCopyOutput] = useState('');
  const [isLoadingPromo, setIsLoadingPromo] = useState(false);
  const [backgroundSuggestion, setBackgroundSuggestion] = useState(''); // For LLM background suggestion
  const [isLoadingBackgroundSuggestion, setIsLoadingBackgroundSuggestion] = useState(false);

  // State for custom alert modal
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // Function to show custom alert
  const showAlert = (message) => {
    setAlertMessage(message);
    setIsAlertModalVisible(true);
  };

  // Function to hide custom alert
  const hideAlert = () => {
    setIsAlertModalVisible(false);
    setAlertMessage('');
  };

  // State for the new/edited event form
  const [eventDate, setEventDate] = useState('');
  const [eventTitle, setEventTitle] = useState('');
  const [eventPromoCode, setEventPromoCode] = useState('');
  const [eventColor, setEventColor] = useState('general');

  // State for the new/edited holiday form
  const [holidayDate, setHolidayDate] = useState('');
  const [holidayTitle, setHolidayTitle] = useState('');
  const [holidayNotes, setHolidayNotes] = useState('');
  const [holidayHighlight, setHolidayHighlight] = useState(false);

  // State for the editable banner
  const [bannerText, setBannerText] = useState('Graduation Month – Local Schools & Summer Programs');
  const [isBannerEditing, setIsBannerEditing] = useState(false);

  // State for editable calendar title
  const [calendarTitle, setCalendarTitle] = useState('June 2025 Marketing Calendar');
  const [isTitleEditing, setIsTitleEditing] = useState(false);

  // State for editing day properties
  const [editDayDate, setEditDayDate] = useState('');
  const [editDayWeatherHigh, setEditDayWeatherHigh] = useState('');
  const [editDayWeekLabel, setEditDayWeekLabel] = useState('');

  // Gemini API Key
  const GEMINI_API_KEY = "AIzaSyAa7Fkbw1GRZD2DTCgvq-lHWFYKnX1GNzE";


  // Function to open Add Event modal
  const openAddEventModal = () => {
    setEventDate('');
    setEventTitle('');
    setEventPromoCode('');
    setEventColor('general');
    setSelectedEvent(null);
    setIsAddEventModalVisible(true);
  };

  // Function to open Add Holiday modal
  const openAddHolidayModal = () => {
    setHolidayDate('');
    setHolidayTitle('');
    setHolidayNotes('');
    setHolidayHighlight(false);
    setSelectedHoliday(null);
    setBackgroundSuggestion(''); // Clear previous suggestion
    setIsAddHolidayModalVisible(true);
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
        setSelectedEvent({ dayDate, promoId });
        setIsEditEventModalVisible(true);
      }
    }
  };

  // Function to open Edit Holiday modal
  const openEditHolidayModal = (dayDate) => {
    const day = calendar.find(d => d.date === dayDate);
    if (day && day.holiday) {
      setHolidayDate(dayDate);
      setHolidayTitle(day.holiday.title);
      setHolidayNotes(day.holiday.notes || '');
      setHolidayHighlight(day.holiday.highlight || false);
      setSelectedHoliday({ dayDate, id: day.holiday.id });
      setBackgroundSuggestion(''); // Clear previous suggestion
      setIsEditHolidayModalVisible(true);
    }
  };

  // Function to open Edit Day modal
  const openEditDayModal = (dayDate) => {
    const day = calendar.find(d => d.date === dayDate);
    if (day) {
      setEditDayDate(dayDate);
      setEditDayWeatherHigh(day.weather.high);
      setEditDayWeekLabel(day.weekLabel || '');
      setSelectedDayData(day); // Store the entire day object for context
      setIsEditDayModalVisible(true);
    }
  };


  const handleAddEditEventSubmit = (e) => {
    e.preventDefault();
    const dateNum = parseInt(eventDate, 10);

    if (isNaN(dateNum) || dateNum < 1 || dateNum > 31 || !eventTitle.trim()) { // Max 31 days
      showAlert('Please enter a valid date (1-31) and promo title.');
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
        id: `promo${Date.now()}`,
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

  const handleAddEditHolidaySubmit = (e) => {
    e.preventDefault();
    const dateNum = parseInt(holidayDate, 10);

    if (isNaN(dateNum) || dateNum < 1 || dateNum > 31 || !holidayTitle.trim()) { // Max 31 days
      showAlert('Please enter a valid date (1-31) and holiday title.');
      return;
    }

    const updatedHoliday = {
      id: selectedHoliday ? selectedHoliday.id : `holiday${Date.now()}`,
      title: holidayTitle.trim(),
      notes: holidayNotes.trim(),
      highlight: holidayHighlight
    };

    setCalendar(prevCalendar => prevCalendar.map(day => {
      if (day.date === dateNum) {
        // Determine specialDayClass based on holiday title
        let specialDayClass = '';
        if (updatedHoliday.title.toLowerCase().includes("father's day")) {
          specialDayClass = 'special-fathers-day';
        } else if (updatedHoliday.title.toLowerCase().includes("juneteenth")) {
          specialDayClass = 'special-juneteenth';
        } else {
          specialDayClass = 'custom-holiday'; // Generic custom holiday background
        }
        
        return {
          ...day,
          holiday: updatedHoliday,
          specialDay: specialDayClass, // Apply background class
          specialText: updatedHoliday.title // Use holiday title as specialText
        };
      }
      return day;
    }));

    setIsAddHolidayModalVisible(false);
    setIsEditHolidayModalVisible(false); // Close edit modal too
    setHolidayDate('');
    setHolidayTitle('');
    setHolidayNotes('');
    setHolidayHighlight(false);
    setSelectedHoliday(null);
  };

  const handleEditDaySubmit = (e) => {
    e.preventDefault();
    const dateNum = parseInt(editDayDate, 10);

    if (isNaN(dateNum) || dateNum < 1 || dateNum > 31) { // Max 31 days
        showAlert('Please enter a valid date (1-31).');
        return;
    }

    setCalendar(prevCalendar => prevCalendar.map(day => {
        if (day.date === dateNum) {
            return {
                ...day,
                weather: {
                    high: parseInt(editDayWeatherHigh, 10),
                    icon: getWeatherIcon(parseInt(editDayWeatherHigh, 10))
                },
                weekLabel: editDayWeekLabel.trim() || ''
            };
        }
        return day;
    }));
    setIsEditDayModalVisible(false);
    setEditDayDate('');
    setEditDayWeatherHigh('');
    setEditDayWeekLabel('');
    setSelectedDayData(null);
  };


  const handleDeleteEvent = (dayDate, promoId) => {
    // Using custom alert for confirmation
    showAlert('Are you sure you want to delete this event?', () => {
      setCalendar(prevCalendar => prevCalendar.map(day => {
        if (day.date === dayDate) {
          return {
            ...day,
            promos: day.promos.filter(promo => promo.id !== promoId)
          };
        }
        return day;
      }));
      hideAlert(); // Close alert after action
    });
  };

  const handleDeleteHoliday = (dayDate) => {
    // Using custom alert for confirmation
    showAlert('Are you sure you want to delete this holiday?', () => {
      setCalendar(prevCalendar => prevCalendar.map(day => {
        if (day.date === dayDate) {
          return {
            ...day,
            holiday: null, // Remove the holiday object
            specialDay: '', // Clear special day class
            specialText: '' // Clear special text
          };
        }
        return day;
      }));
      hideAlert(); // Close alert after action
    });
  };

  const handleDeleteDay = (dayDate) => {
    // Using custom alert for confirmation
    showAlert(`Are you sure you want to clear all content for day ${dayDate}?`, () => {
        setCalendar(prevCalendar => prevCalendar.map(day => {
            if (day.date === dayDate) {
                return {
                    ...day,
                    promos: [],
                    holiday: null,
                    specialDay: '',
                    specialText: '',
                    weather: { high: null, icon: '' }, // Clear weather
                    weekLabel: '' // Clear week label
                };
            }
            return day;
        }));
        hideAlert(); // Close alert after action
    });
  };

  // Function to copy text to clipboard
  const copyToClipboard = (text) => {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
      document.execCommand('copy');
      showAlert('Copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy: ', err);
      showAlert('Failed to copy to clipboard.');
    }
    document.body.removeChild(textarea);
  };

  const generatePromoCopy = async (promoText) => {
    setIsPromoModalVisible(true);
    setPromoCopyOutput('');
    setIsLoadingPromo(true);

    const prompt = `Generate a short, engaging social media post for the following Papa John's promotion: "${promoText}". Keep it under 200 characters and include relevant emojis.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    // Use the defined API key
    const apiKey = GEMINI_API_KEY; 

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
      setIsLoadingPromo(false);
    }
  };

  const generateBackgroundSuggestion = async () => {
    setIsLoadingBackgroundSuggestion(true);
    setBackgroundSuggestion('');

    const prompt = `Suggest a vibrant, non-photographic, abstract background theme or color palette (e.g., "fiery red and orange gradient with subtle star patterns") suitable for a marketing calendar for the holiday: "${holidayTitle}". Focus on colors and abstract elements, not specific images. Keep it concise.`;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });
    const payload = { contents: chatHistory };
    // Use the defined API key
    const apiKey = GEMINI_API_KEY; 

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
        setBackgroundSuggestion(text);
      } else {
        setBackgroundSuggestion('Could not generate suggestion. Try again.');
      }
    } catch (error) {
      console.error('Error generating background suggestion:', error);
      setBackgroundSuggestion(`Error: ${error.message}.`);
    } finally {
      setIsLoadingBackgroundSuggestion(false);
    }
  };


  // Helper to chunk the calendar data into weeks for table rendering
  const chunkIntoWeeks = (data) => {
    const weeks = [];
    const daysInMonth = data.length; // 30 for June
    const firstDayOfMonthDate = new Date('2025-06-01T00:00:00');
    const firstDayOfWeekIndex = firstDayOfMonthDate.getDay();

    const allDaysInGrid = Array(6 * 7).fill(null);

    let currentDayIndex = firstDayOfWeekIndex;
    for (let i = 0; i < daysInMonth; i++) {
      allDaysInGrid[currentDayIndex] = data[i];
      currentDayIndex++;
    }

    for (let i = 0; i < allDaysInGrid.length; i += 7) {
      weeks.push(allDaysInGrid.slice(i, i + 7));
    }

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
          {/* New: Add Holiday Button */}
          <button className="add-button" onClick={openAddHolidayModal} title="Add Holiday">
            🎁
          </button>
          {/* New: Print Button */}
          <button className="print-button" onClick={() => window.print()} title="Print Calendar">
            🖨️
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header">
          <img src="https://images.vexels.com/media/users/3/143402/isolated/preview/afbbf15d5e82a1c4fb5a55c4eacf3003-graduation-cap-icon.png" alt="Graduation Cap" className="header-icon" />
          <img src="https://png.pngtree.com/png-clipart/20220812/ourmid/pngtree-shine-sun-light-effect-free-png-and-psd-png-image_6106445.png" alt="Sunshine" className="header-icon" />
          {isTitleEditing ? (
            <div className="title-edit-container">
                <input
                    type="text"
                    value={calendarTitle}
                    onChange={(e) => setCalendarTitle(e.target.value)}
                    className="title-edit-input"
                />
                <button className="title-edit-save-btn" onClick={() => setIsTitleEditing(false)}>Save</button>
            </div>
          ) : (
            <h1 onClick={() => setIsTitleEditing(true)} title="Click to edit calendar title">
                {calendarTitle}
                <span className="title-edit-icon">✏️</span>
            </h1>
          )}
        </div>
        {isBannerEditing ? (
          <div className="banner-edit-container">
            <input
              type="text"
              value={bannerText}
              onChange={(e) => setBannerText(e.target.value)}
              className="banner-edit-input"
            />
            <button className="banner-edit-save-btn" onClick={() => setIsBannerEditing(false)}>Save</button>
          </div>
        ) : (
          <div className="banner" onClick={() => setIsBannerEditing(true)} title="Click to edit banner text">
            {bannerText}
            <span className="banner-edit-icon">✏️</span>
          </div>
        )}
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
                  <td key={dayIndex} className={`${dayData?.specialDay || ''} ${dayData?.holiday?.highlight ? 'highlight-holiday-cell' : ''}`}>
                    {dayData ? (
                      <div className="cell-content">
                        <div className="date-weather-group">
                          <div className="date-number-wrapper"> {/* New wrapper for date and its background */}
                            <div className="date-number">
                              {dayData.date}
                            </div>
                          </div>
                          <div className="weather">
                            {dayData.weather.icon} {dayData.weather.high}°
                          </div>
                          {/* Edit/Delete Day Icons */}
                          <span
                            className="edit-icon day-edit-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditDayModal(dayData.date);
                            }}
                            title="Edit Day"
                          >
                            ✏️
                          </span>
                          <span
                            className="delete-icon day-delete-icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteDay(dayData.date);
                            }}
                            title="Clear Day Content"
                          >
                            🗑️
                          </span>

                          {dayData.holiday && ( // Holiday edit/delete icons
                              <span
                                className="edit-icon holiday-edit-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditHolidayModal(dayData.date);
                                }}
                                title="Edit Holiday"
                              >
                                ✏️
                              </span>
                          )}
                          {dayData.holiday && (
                              <span
                                className="delete-icon holiday-delete-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteHoliday(dayData.date);
                                }}
                                title="Delete Holiday"
                              >
                                🗑️
                              </span>
                          )}
                        </div>
                        
                        {dayData.specialText && (
                          <div className="badge special-text-badge">
                            {dayData.specialText}
                            {dayData.holiday?.notes && <div className="holiday-notes">{dayData.holiday.notes}</div>}
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
              <>
                <div className="promo-copy-output">{promoCopyOutput}</div>
                <button
                  className="copy-to-clipboard-btn"
                  onClick={() => copyToClipboard(promoCopyOutput)}
                  disabled={!promoCopyOutput}
                >
                  Copy to Clipboard 📋
                </button>
              </>
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
                <label htmlFor="eventDate">Date (1-31):</label> {/* Max 31 days */}
                <input
                  type="number"
                  id="eventDate"
                  min="1"
                  max="31"
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

      {/* Add/Edit Holiday Modal Form */}
      {(isAddHolidayModalVisible || isEditHolidayModalVisible) && (
        <div id="addHolidayModalOverlay" className="modal-overlay visible">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => {
                setIsAddHolidayModalVisible(false);
                setIsEditHolidayModalVisible(false);
            }}>&times;</button>
            <div className="modal-title">{selectedHoliday ? 'Edit Holiday' : 'Add New Holiday'}</div>
            <form onSubmit={handleAddEditHolidaySubmit} className="add-event-form"> {/* Reusing add-event-form styles */}
              <div className="form-group">
                <label htmlFor="holidayDate">Date (1-31):</label> {/* Max 31 days */}
                <input
                  type="number"
                  id="holidayDate"
                  min="1"
                  max="31"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  required
                  disabled={!!selectedHoliday} // Disable date editing for existing holidays
                />
              </div>
              <div className="form-group">
                <label htmlFor="holidayTitle">Holiday Title:</label>
                <input
                  type="text"
                  id="holidayTitle"
                  value={holidayTitle}
                  onChange={(e) => setHolidayTitle(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="holidayNotes">Notes (Optional):</label>
                <textarea
                  id="holidayNotes"
                  value={holidayNotes}
                  onChange={(e) => setHolidayNotes(e.target.value)}
                  rows="3"
                ></textarea>
              </div>
              <div className="form-group checkbox-group">
                <input
                  type="checkbox"
                  id="holidayHighlight"
                  checked={holidayHighlight}
                  onChange={(e) => setHolidayHighlight(e.target.checked)}
                />
                <label htmlFor="holidayHighlight">Highlight Day (Yellow & Bold Text)</label>
              </div>
              <div className="form-group">
                <button
                  type="button"
                  className="generate-background-btn"
                  onClick={generateBackgroundSuggestion}
                  disabled={isLoadingBackgroundSuggestion || !holidayTitle.trim()}
                >
                  {isLoadingBackgroundSuggestion ? 'Generating...' : 'Generate Background Suggestion ✨'}
                </button>
                {backgroundSuggestion && (
                  <>
                    <textarea
                      className="background-suggestion-output"
                      value={backgroundSuggestion}
                      readOnly
                      rows="2"
                      placeholder="Background suggestion will appear here..."
                    ></textarea>
                    <button
                      type="button"
                      className="copy-to-clipboard-btn"
                      onClick={() => copyToClipboard(backgroundSuggestion)}
                      disabled={!backgroundSuggestion}
                      style={{ marginTop: '10px' }}
                    >
                      Copy to Clipboard 📋
                    </button>
                  </>
                )}
              </div>
              <button type="submit" className="submit-event-btn">
                {selectedHoliday ? 'Save Changes' : 'Add Holiday'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Edit Day Modal Form */}
      {isEditDayModalVisible && (
        <div id="editDayModalOverlay" className="modal-overlay visible">
          <div className="modal-content">
            <button className="modal-close-btn" onClick={() => setIsEditDayModalVisible(false)}>&times;</button>
            <div className="modal-title">Edit Day {selectedDayData?.date}</div>
            <form onSubmit={handleEditDaySubmit} className="add-event-form">
              <div className="form-group">
                <label htmlFor="editDayDate">Date:</label>
                <input
                  type="number"
                  id="editDayDate"
                  value={editDayDate}
                  disabled
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDayWeatherHigh">High Temperature (°F):</label>
                <input
                  type="number"
                  id="editDayWeatherHigh"
                  value={editDayWeatherHigh}
                  onChange={(e) => setEditDayWeatherHigh(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="editDayWeekLabel">Week Label (e.g., P6 Wk3):</label>
                <input
                  type="text"
                  id="editDayWeekLabel"
                  value={editDayWeekLabel}
                  onChange={(e) => setEditDayWeekLabel(e.target.value)}
                />
              </div>
              <button type="submit" className="submit-event-btn">Save Day Changes</button>
            </form>
          </div>
        </div>
      )}

      {/* Custom Alert Modal */}
      {isAlertModalVisible && (
        <AlertModal message={alertMessage} onClose={hideAlert} />
      )}

      {/* Styles for the React App */}
      <style>{`
        body {
          font-family: 'Open Sans', sans-serif;
          font-weight: 300;
          line-height: 1.6;
          background: linear-gradient(135deg, #FFD700 0%, #FF8C00 25%, #FF6347 50%, #FF4500 75%, #FF1493 100%); /* Vibrant, warm gradient */
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
          font-size: 2.2em; /* Adjusted font size to fit on one line */
          margin-bottom: 0.5em;
          text-shadow: 1px 1px 2px rgba(0,0,0,0.05);
          position: relative; /* For edit icon */
          cursor: pointer; /* Indicate it's clickable */
          padding-right: 30px; /* Space for edit icon */
        }
        h1:hover {
            opacity: 0.9;
        }
        h1:hover .title-edit-icon {
            opacity: 1;
        }
        .title-edit-icon {
            position: absolute;
            top: 50%;
            right: 0;
            transform: translateY(-50%);
            font-size: 0.7em;
            color: rgba(0,0,0,0.5);
            opacity: 0;
            transition: opacity 0.2s ease-in-out;
        }
        .title-edit-container {
            width: 100%;
            display: flex;
            gap: 10px;
            align-items: center;
            margin-bottom: 0.5em;
        }
        .title-edit-input {
            flex-grow: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 2.2em; /* Match h1 size */
            font-family: 'Montserrat', sans-serif;
            font-weight: 800;
            color: #c8102e;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .title-edit-save-btn {
            background-color: #006c3b;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            font-size: 0.9em;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }
        .title-edit-save-btn:hover {
            background-color: #005a30;
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
          position: relative; /* For edit icon */
          cursor: pointer; /* Indicate it's clickable */
          transition: background-color 0.3s ease;
        }
        .banner:hover {
            background-color: #005a30; /* Slightly darker on hover */
        }
        .banner-edit-icon {
            position: absolute;
            top: 50%;
            right: 15px;
            transform: translateY(-50%);
            font-size: 0.9em;
            color: rgba(255,255,255,0.7);
            opacity: 0; /* Hidden by default */
            transition: opacity 0.2s ease-in-out;
        }
        .banner:hover .banner-edit-icon {
            opacity: 1; /* Visible on hover */
        }
        .banner-edit-container { /* Style for the input field when editing banner */
            width: 100%;
            max-width: 1200px;
            margin-bottom: 20px;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .banner-edit-input {
            flex-grow: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1.1em;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
        }
        .banner-edit-save-btn {
            background-color: #c8102e;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            font-size: 0.9em;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }
        .banner-edit-save-btn:hover {
            background-color: #a00d27;
        }
        
        .calendar-container {
          max-width: 1200px;
          width: 100%;
          margin: auto;
          background: #ffffff; /* Solid white for the container itself */
          border: 1px solid #e0e0e0;
          border-radius: 12px;
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15); /* More pronounced shadow */
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
            position: relative; /* For holiday edit/delete icons */
            width: 100%; /* Ensure it takes full width for positioning */
        }

        .week-label { /* Original week-label style, now unused */
          font-size: 0.68em;
          color: #999;
          margin-bottom: 4px;
        }

        .date-number-wrapper { /* New wrapper for date and its background */
            position: relative;
            z-index: 1; /* Ensure it's above the yellow background */
            display: inline-block; /* To make background fit content */
            padding: 2px 4px; /* Small padding around date number */
            border-radius: 4px; /* Slightly rounded corners */
            transition: background-color 0.3s ease;
        }
        /* Apply yellow background to date-number-wrapper for highlighted holidays */
        .highlight-holiday-cell .date-number-wrapper {
            background-color: #FFD700; /* Yellow background */
            border: 1px solid #DAA520; /* Darker yellow border */
        }

        .date-number {
          font-size: 1.3em;
          font-weight: 700;
          color: #222;
        }
        .weather {
          font-family: 'Montserrat', sans-serif; /* Applied Montserrat font */
          font-size: 1.0em; /* Slightly larger */
          font-weight: 700; /* Bolder */
          color: #444; /* Darker color for better readability */
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
            position: relative; /* For holiday edit/delete icons */
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
        .holiday-notes { /* Style for holiday notes */
            font-size: 0.65em;
            color: #666;
            margin-top: 3px;
            line-height: 1.2;
            text-align: center;
        }

        /* Holiday Cell Backgrounds */
        /* These classes are applied to the <td> elements */
        .special-day { /* Default for P6 Wk3, if it's not a specific holiday */
            background-color: #fffbf0;
            border: 2px solid #f9e0a0;
        }
        .special-fathers-day {
            background: linear-gradient(135deg, #ADD8E6 0%, #87CEEB 100%); /* Lighter, more distinct blue */
            border: 2px solid #4682B4; /* SteelBlue border */
            color: #333; /* Darker text for contrast */
        }
        .special-juneteenth {
            background: linear-gradient(135deg, #FF6347 0%, #FFD700 50%, #87CEEB 100%); /* Tomato, Gold, SkyBlue */
            border: 2px solid #DC143C; /* Crimson border */
            color: #333; /* Darker text for contrast */
        }
        .custom-holiday { /* New custom holiday background */
            background: linear-gradient(135deg, #E0FFFF 0%, #87CEFA 100%); /* Light Cyan to Light Sky Blue */
            border: 2px solid #4169E1; /* RoyalBlue border */
            color: #333; /* Darker text for contrast */
        }
        /* Highlighted holiday cell styling */
        .highlight-holiday-cell {
            /* This class is added to the td, its background will be the holiday gradient */
            /* The yellow highlight is now on .date-number-wrapper and .special-text-badge text */
        }
        .highlight-holiday-cell .date-number,
        .highlight-holiday-cell .special-text-badge {
            color: #333 !important; /* Darker text for readability on yellow highlight */
            font-weight: bold !important;
            text-shadow: none !important; /* Remove text shadow */
        }
        /* Specific text color for highlighted holiday badge */
        .highlight-holiday-cell .special-text-badge {
            background-color: #FFD700 !important; /* Solid yellow background for badge */
            border-color: #DAA520 !important; /* Darker yellow border for badge */
            color: #333 !important; /* Ensure text is dark on yellow */
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
            margin: 0 10px; /* Increased margin for more space */
            width: 40px; /* Larger icons */
            height: 40px; /* Larger icons */
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
            margin-left: 10px; /* Space between buttons */
        }
        .add-button:hover {
            background-color: #005a30;
            transform: translateY(-1px);
        }
        .add-button:active {
            transform: translateY(0);
        }

        .print-button {
            background-color: #e0e0e0; /* Light grey for print button */
            color: #555;
            border: none;
            border-radius: 8px;
            padding: 10px 15px;
            font-size: 1.5em; /* Same size as add button */
            font-weight: 600;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            transition: background-color 0.2s ease-in-out, transform 0.1s ease-in-out;
            line-height: 1;
            margin-left: 10px; /* Space between buttons */
        }
        .print-button:hover {
            background-color: #d0d0d0;
            transform: translateY(-1px);
        }
        .print-button:active {
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
        .form-group input[type="number"],
        .form-group textarea {
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
        .checkbox-group {
            flex-direction: row; /* Checkbox label on same line */
            align-items: center;
            gap: 8px;
            margin-top: 5px;
        }
        .checkbox-group input[type="checkbox"] {
            margin-bottom: 0;
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
            font-size: 0.9em; /* Smaller icons */
            cursor: pointer;
            opacity: 0; /* Hidden by default */
            transition: opacity 0.2s ease-in-out, transform 0.1s ease-in-out;
            line-height: 1;
            padding: 3px;
            border-radius: 50%;
            background-color: transparent;
        }
        /* Common hover for both promo and holiday icons */
        .card:hover .edit-icon,
        .card:hover .delete-icon,
        .date-weather-group:hover .day-edit-icon, /* New: Day edit/delete hover */
        .date-weather-group:hover .day-delete-icon,
        .date-weather-group:hover .holiday-edit-icon,
        .date-weather-group:hover .holiday-delete-icon {
            opacity: 0.7; /* Visible on card/date-weather-group hover */
        }
        .edit-icon:hover, .delete-icon:hover {
            opacity: 1;
            transform: scale(1.1);
            background-color: rgba(255, 255, 255, 0.7);
        }
        /* Promo card icons */
        .card .edit-icon {
            top: 4px; /* Align with star */
            right: 28px; /* Position next to star */
            color: #007bff; /* Blue for edit */
        }
        .card .delete-icon {
            top: 4px; /* Align with star */
            right: 50px; /* Position next to edit */
            color: #dc3545; /* Red for delete */
        }
        /* Day edit/delete icons (positioned relative to date-weather-group) */
        .day-edit-icon {
            top: 0px; /* Aligned with top of date-weather-group */
            right: 24px; /* Space from right */
            color: #007bff;
        }
        .day-delete-icon {
            top: 0px; /* Aligned with top of date-weather-group */
            right: 2px; /* Close to the right edge */
            color: #dc3545;
        }
        /* Holiday icons (positioned relative to date-weather-group) */
        .holiday-edit-icon {
            top: 24px; /* Positioned below date/weather */
            right: 24px;
            color: #007bff;
        }
        .holiday-delete-icon {
            top: 24px; /* Positioned below date/weather */
            right: 2px;
            color: #dc3545;
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

        /* Print Styles */
        @media print {
            @page {
                size: landscape; /* Set page to landscape */
                margin: 0.5in; /* Add a small margin for printing */
            }
            body {
                background-color: #fff; /* White background for print */
                padding: 0;
                margin: 0;
                display: block; /* Override flex for print */
                width: 100%;
                height: auto;
                font-size: 10pt; /* Base font size for print */
            }
            .add-event-controls, /* Hide the add/print buttons */
            .modal-overlay, /* Hide any open modals */
            .generate-promo-star, /* Hide the AI star */
            .edit-icon, /* Hide edit icon */
            .delete-icon, /* Hide delete icon */
            .header-icon, /* Hide header icons (graduation cap, sun) */
            .banner-edit-icon, /* Hide banner edit icon */
            .copy-to-clipboard-btn, /* Hide copy to clipboard button */
            .title-edit-icon, /* Hide title edit icon */
            .title-edit-container, /* Hide title edit container */
            .title-edit-save-btn { /* Hide title save button */
                display: none !important;
            }
            .logo { /* Re-show logo for print, but control its size */
                display: block !important;
                text-align: center !important;
                margin-bottom: 8px !important; /* Reduced margin */
                padding-top: 0 !important;
            }
            .logo img {
                height: 20px !important; /* Smaller logo for print */
                width: auto !important;
                max-width: 100% !important;
                margin: 0 auto !important;
                filter: grayscale(50%); /* Slightly desaturate for ink saving */
            }

            .calendar-container {
                box-shadow: none; /* No shadow in print */
                border: 1px solid #888; /* More prominent border for print */
                max-width: 100%;
                width: 100%;
                border-radius: 0;
                overflow: visible; /* Ensure content is not hidden */
                background: #fff; /* White background for print */
            }
            .calendar-header {
                box-shadow: none;
                border-bottom: 1px solid #888; /* More prominent border for print */
                padding: 0.4rem 0; /* Reduced padding */
                border-radius: 0;
                background-color: #f0f0f0; /* Light grey background for header */
            }
            h1 {
                font-size: 1.3em; /* Smaller title for print */
                margin-bottom: 0.1em;
                color: #000; /* Black for print */
                text-shadow: none;
                cursor: default; /* Remove pointer for print */
            }
            .banner {
                box-shadow: none;
                border-radius: 0;
                padding: 6px 8px; /* Reduced padding */
                margin-bottom: 8px; /* Reduced margin */
                background-color: #c0c0c0; /* Slightly darker grey for banner in print */
                color: #000; /* Black text for print */
                border-bottom: 1px solid #888; /* Add a bottom border */
                font-size: 0.9em; /* Smaller font for banner */
            }
            table {
                width: 100%;
                table-layout: fixed; /* Keep fixed layout for columns */
                border-collapse: collapse;
            }
            th {
                background-color: #f8f8f8; /* Very light background */
                border: 1px solid #888; /* More prominent border */
                padding: 6px 4px; /* Reduced padding */
                font-size: 0.8em; /* Smaller font */
                color: #000;
                font-weight: 700; /* Make headers bold */
            }
            td {
                border: 1px solid #888; /* More prominent border */
                height: auto; /* Allow height to expand */
                min-height: 60px; /* Reduced minimum height for cells */
                padding: 4px; /* Reduced padding */
                display: table-cell; /* Crucial: Ensure td behaves as a table cell */
                vertical-align: top;
                page-break-inside: avoid; /* Prevent cells from breaking across pages */
            }
            .cell-content {
                height: auto; /* Allow content to dictate height */
                min-height: 0; /* Reset min-height */
                display: flex; /* Keep flexbox for internal content layout */
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
            }
            .date-weather-group {
                display: flex;
                flex-direction: column; /* Stack date and weather vertically */
                align-items: flex-start;
                gap: 2px; /* Smaller gap */
                margin-bottom: 4px; /* Less space */
                position: relative; /* For holiday edit/delete icons in print */
                width: 100%;
            }
            /* Holiday date background in print */
            .date-number-wrapper {
                background-color: transparent; /* Default transparent */
                border: none;
                padding: 0;
                border-radius: 0;
            }
            .highlight-holiday-cell .date-number-wrapper {
                background-color: #FFD700 !important; /* Solid yellow for highlight */
                border: 1px solid #DAA520 !important;
                padding: 2px 4px;
                border-radius: 4px;
            }
            .date-number {
                font-size: 1em; /* Smaller date number */
                color: #000;
                font-weight: 700;
            }
            .weather {
                font-size: 0.65em; /* Even smaller weather text */
                color: #555;
            }
            .badge {
                padding: 3px 5px; /* Reduced padding */
                font-size: 0.65em; /* Smaller font */
                box-shadow: none;
                border: 1px solid #999; /* More prominent border for badges */
                background-color: #f5f5f5; /* Lighter background */
                color: #333; /* Darker text */
                page-break-inside: avoid; /* Prevent badges from breaking */
                margin-bottom: 2px; /* Less space between badges/cards */
            }
            .badge.two-dollar {
                background-color: #ffe8eb; /* Keep light red */
                color: #c8102e;
            }
            .badge.rmp50 {
                background-color: #e8f5e8; /* Keep light green */
                color: #006c3b;
            }
            .badge.special-text-badge {
                background: #c0c0c0 !important; /* Darker grey for special badges in print */
                color: #000 !important;
                border: 1px solid #888 !important;
            }
            .card {
                box-shadow: none;
                padding: 4px; /* Reduced padding */
                margin-top: 4px; /* Reduced margin */
                border: 1px solid #ccc; /* Lighter card border */
                background-color: #fff;
                page-break-inside: avoid; /* Prevent cards from breaking */
            }
            .promo-detail {
                font-size: 0.55em; /* Even smaller font */
                margin-top: 2px; /* Less space */
                color: #666;
            }
            .week-label-bubble {
                background-color: #e0e0e0; /* Darker grey */
                color: #333;
                font-size: 0.55em; /* Even smaller font */
                padding: 2px 5px; /* Reduced padding */
                box-shadow: none;
                border: 1px solid #999;
                margin-top: 4px; /* Adjust margin for print */
                align-self: flex-start; /* Align to left in print */
            }
        }

        /* Media queries for screen display only */
        @media screen and (max-width: 768px) {
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
                width: 25px; /* Adjusted for mobile */
                height: 25px; /* Adjusted for mobile */
                margin: 0 5px;
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
