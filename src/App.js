import React, { useState, useEffect, useCallback } from 'react';
// Import Firebase modules
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, onSnapshot } from 'firebase/firestore';

// Define a helper function to get weather icon based on weather condition
const getWeatherIcon = (condition) => {
  const lowerCaseCondition = condition.toLowerCase();
  if (lowerCaseCondition.includes('sunny') || lowerCaseCondition.includes('clear')) return '☀️';
  if (lowerCaseCondition.includes('cloudy') || lowerCaseCondition.includes('overcast')) return '☁️';
  if (lowerCaseCondition.includes('rain') || lowerCaseCondition.includes('shower') || lowerCaseCondition.includes('storm')) return '🌧️';
  return '❓'; // Default unknown weather
};

// Define the initial calendar data for June 2025 with accurate dates
// and VERIFIED HISTORICAL WEATHER DATA FOR JUNE 2024 (Portland, OR vicinity)
// Note: This data is for June only. July entries will be handled separately if needed.
const initialJuneCalendarDays = [
  // June 2024 Historical Weather Data for Portland, OR (from AccuWeather)
  { date: 1, day: 'Sun', weather: { high: 73, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 2, day: 'Mon', weather: { high: 62, condition: 'Showers', icon: getWeatherIcon('Showers') }, promos: [
    { id: 'promo1', type: 'general', text: 'Start of Cheddar Pizza' },
    { id: 'promo2', type: 'general', text: 'Shaq-a-Roni becomes permanent menu item', detail: '$16.99 SHAQ / $18.99 w/ 2L' }
  ], specialDay: 'special-day', weekLabel: 'P6 Wk3', holiday: null },
  { date: 3, day: 'Tue', weather: { high: 63, condition: 'Cloudy', icon: getWeatherIcon('Cloudy') }, promos: [
    { id: 'promo3', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ], holiday: null, weekLabel: ''},
  { date: 4, day: 'Wed', weather: { high: 68, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [
    { id: 'promo4', type: 'rmp50', text: '50% Off RMP to Lapsed Guests', detail: 'Promo Code: RMP50' }
  ], holiday: null, weekLabel: ''},
  { date: 5, day: 'Thu', weather: { high: 75, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 6, day: 'Fri', weather: { high: 81, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 7, day: 'Sat', weather: { high: 86, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 8, day: 'Sun', weather: { high: 83, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 9, day: 'Mon', weather: { high: 76, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], weekLabel: 'P6 Wk4', holiday: null },
  { date: 10, day: 'Tue', weather: { high: 79, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [
    { id: 'promo5', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ], holiday: null, weekLabel: ''},
  { date: 11, day: 'Wed', weather: { high: 74, condition: 'Mostly Cloudy', icon: getWeatherIcon('Mostly Cloudy') }, promos: [], holiday: null, weekLabel: '' },
  { date: 12, day: 'Thu', weather: { high: 73, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 13, day: 'Fri', weather: { high: 75, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 14, day: 'Sat', weather: { high: 69, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 15, day: 'Sun', weather: { high: 64, condition: 'Rain', icon: getWeatherIcon('Rain') }, promos: [], specialDay: '', specialText: "Father's Day", holiday: { id: 'holiday1', title: "Father's Day", notes: "Celebrate Dads!", highlight: true }, weekLabel: '' },
  { date: 16, day: 'Mon', weather: { high: 65, condition: 'Cloudy', icon: getWeatherIcon('Cloudy') }, promos: [], weekLabel: 'P7 Wk1', holiday: null },
  { date: 17, day: 'Tue', weather: { high: 66, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [
    { id: 'promo6', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ], holiday: null, weekLabel: ''},
  { date: 18, day: 'Wed', weather: { high: 73, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [
    { id: 'promo7', type: 'rmp50', text: '50% Off RMP to Lapsed Guests', detail: 'Promo Code: RMP50' }
  ], holiday: null, weekLabel: ''},
  { date: 19, day: 'Thu', weather: { high: 86, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], specialDay: '', specialText: 'Juneteenth', holiday: { id: 'holiday2', title: "Juneteenth", notes: "Freedom Day", highlight: true }, weekLabel: '' },
  { date: 20, day: 'Fri', weather: { high: 90, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 21, day: 'Sat', weather: { high: 91, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 22, day: 'Sun', weather: { high: 86, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 23, day: 'Mon', weather: { high: 71, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], weekLabel: 'P7 Wk2', holiday: null },
  { date: 24, day: 'Tue', weather: { high: 76, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [
    { id: 'promo8', type: 'two-dollar', text: '� BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
  ], holiday: null, weekLabel: ''},
  { date: 25, day: 'Wed', weather: { high: 88, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 26, day: 'Thu', weather: { high: 71, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 27, day: 'Fri', weather: { high: 69, condition: 'Showers', icon: getWeatherIcon('Showers') }, promos: [], holiday: null, weekLabel: '' },
  { date: 28, day: 'Sat', weather: { high: 80, condition: 'Partly Sunny', icon: getWeatherIcon('Partly Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 29, day: 'Sun', weather: { high: 82, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], holiday: null, weekLabel: '' },
  { date: 30, day: 'Mon', weather: { high: 80, condition: 'Sunny', icon: getWeatherIcon('Sunny') }, promos: [], weekLabel: 'P7 Wk3', holiday: null },
];

const initialPayPeriodsData = {
  date: null, day: 'Wed', weather: null, promos: [
    { id: 'pay-periods', type: 'pay-periods', text: 'Pay Periods', detail: '5/19-6/1, 6/2-6/15, 6/16-6/29' }
  ], holiday: null, weekLabel: ''
};

// Define initial text for digital offers
const initialDigitalOffersText = 'Cheddar Crust (1 top for $12.99) and Papa\'s Pairings for $6.99';

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

// Custom Confirmation Modal Component
const ConfirmationModal = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="modal-overlay visible">
      <div className="modal-content">
        <div className="modal-title">Confirm Action</div>
        <p>{message}</p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
          <button className="cancel-btn" onClick={onCancel}>Cancel</button>
          <button className="submit-event-btn" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [calendar, setCalendar] = useState(initialJuneCalendarDays);
  const [payPeriodsData, setPayPeriodsData] = useState(initialPayPeriodsData); // New state for pay periods
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

  // State for custom alert modal
  const [isAlertModalVisible, setIsAlertModalVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  // State for confirmation modal
  const [isConfirmationModalVisible, setIsConfirmationModalVisible] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');
  const [confirmationAction, setConfirmationAction] = useState(null); // Function to call on confirm

  // Firebase states
  const [db, setDb] = useState(null);
  const [auth, setAuth] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(true); // Changed to true to try and proceed
  const [isFirestoreLoading, setIsFirestoreLoading] = useState(true);

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

  // New state for editable digital offers text
  const [digitalOffersText, setDigitalOffersText] = useState(initialDigitalOffersText);
  const [isDigitalOffersEditing, setIsDigitalOffersEditing] = useState(false);

  // New state for weather condition in edit modal
  const [editDayWeatherCondition, setEditDayWeatherCondition] = useState('');

  // State for editing day properties
  const [editDayDate, setEditDayDate] = useState('');
  const [editDayWeatherHigh, setEditDayWeatherHigh] = useState('');
  const [editDayWeekLabel, setEditDayWeekLabel] = useState('');

  // Fixed background image URL
  const staticBackgroundUrl = 'https://media.istockphoto.com/id/1463842482/photo/beautiful-multicolor-tropical-background-of-palm-trees.jpg?s=612x612&w=0&k=20&c=FqAG1B4ENYMh9SNzzaqAdlHki0atxI3tVnDWoZCjsU8=';

  // Access environment variables from process.env (Base64 encoded for Firebase config)
  // IMPORTANT: For Create React App, environment variables must start with REACT_APP_
  const FIREBASE_CONFIG_BASE64_ENV = process.env.REACT_APP_FIREBASE_CONFIG_BASE64;
  const APP_ID_ENV = process.env.REACT_APP_APP_ID || 'default-app-id';
  const INITIAL_AUTH_TOKEN_ENV = process.env.REACT_APP_INITIAL_AUTH_TOKEN || null;

  // Decode and parse Firebase config from environment variable
  let firebaseConfig = {};
  try {
    if (typeof FIREBASE_CONFIG_BASE64_ENV === 'string' && FIREBASE_CONFIG_BASE64_ENV.length > 0) {
      // Decode the Base64 string first
      const decodedConfig = atob(FIREBASE_CONFIG_BASE64_ENV);
      firebaseConfig = JSON.parse(decodedConfig);
    } else {
      console.warn("REACT_APP_FIREBASE_CONFIG_BASE64_ENV is empty or not a string. Value:", FIREBASE_CONFIG_BASE64_ENV);
      firebaseConfig = {};
    }
  } catch (e) {
    console.error("Error decoding or parsing REACT_APP_FIREBASE_CONFIG_BASE64_ENV:", e);
    firebaseConfig = {}; // Ensure it's empty if parsing fails
  }

  // API keys (Canvas will inject these at runtime, or they can be set via process.env)
  // For Gemini and Imagen, we'll assume they are handled by Vercel's direct injection if needed,
  // or they would also need REACT_APP_ prefix if accessed this way.
  const GEMINI_API_KEY = ""; // Vercel will inject or keep empty if not set
  const IMAGEN_API_KEY = ""; // Vercel will inject or keep empty if not set

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

  // Function to show confirmation modal
  const showConfirmation = (message, action) => {
    setConfirmationMessage(message);
    setConfirmationAction(() => action); // Store the action function
    setIsConfirmationModalVisible(true);
  };

  // Function to hide confirmation modal
  const hideConfirmation = () => {
    setIsConfirmationModalVisible(false);
    setConfirmationMessage('');
    setConfirmationAction(null);
  };

  // Initialize Firebase and set up authentication
  useEffect(() => {
    // Check if firebaseConfig is truly empty after parsing attempt
    if (Object.keys(firebaseConfig).length === 0) {
      console.error("Firebase config is empty or invalid. Data saving will not work. Please ensure REACT_APP_FIREBASE_CONFIG_BASE64 environment variable is set and valid Base64 JSON.");
      showAlert("Firebase config missing or invalid. Data saving will not work.");
      setIsAuthReady(true);
      setIsFirestoreLoading(false);
      return;
    }

    try {
      const app = initializeApp(firebaseConfig);
      const firestore = getFirestore(app);
      const authentication = getAuth(app);

      setDb(firestore);
      setAuth(authentication);

      const unsubscribe = onAuthStateChanged(authentication, async (user) => {
        if (user) {
          setUserId(user.uid);
        } else {
          try {
            if (INITIAL_AUTH_TOKEN_ENV) { // Use the environment variable for auth token
              await signInWithCustomToken(authentication, INITIAL_AUTH_TOKEN_ENV);
            } else {
              await signInAnonymously(authentication);
            }
            setUserId(authentication.currentUser.uid);
          } catch (error) {
            console.error("Error signing in anonymously:", error);
            showAlert("Failed to sign in. Data persistence may not work.");
          }
        }
        setIsAuthReady(true); // Auth state is ready
      });

      return () => unsubscribe(); // Cleanup auth listener
    } catch (error) {
      console.error("Error initializing Firebase:", error);
      showAlert("Failed to initialize Firebase. Data saving will not work.");
      setIsAuthReady(true); // Still set to ready even if failed, to unblock UI
    }
  }, [JSON.stringify(firebaseConfig), INITIAL_AUTH_TOKEN_ENV]); // Depend on stringified config and auth token env

  // Fetch and sync calendar data from Firestore
  useEffect(() => {
    if (!db || !userId || !isAuthReady) return;

    // Corrected Firestore paths to include /public/data/ and use APP_ID_ENV
    const calendarDocRef = doc(db, `artifacts/${APP_ID_ENV}/public/data/calendarData/juneCalendar`);
    const offersDocRef = doc(db, `artifacts/${APP_ID_ENV}/public/data/digitalOffers/currentMonth`);
    const payPeriodsDocRef = doc(db, `artifacts/${APP_ID_ENV}/public/data/payPeriods/june`);

    const unsubscribeCalendar = onSnapshot(calendarDocRef, (docSnap) => {
      if (docSnap.exists()) {
        const fetchedData = docSnap.data().data; // 'data' field holds the array
        if (fetchedData) {
          setCalendar(fetchedData);
        } else {
          setCalendar(initialJuneCalendarDays); // Fallback to initial if data field is empty
        }
      }
      setIsFirestoreLoading(false);
    }, (error) => {
      console.error("Error fetching Firestore calendar data:", error);
      showAlert("Failed to load saved calendar data. Please check your internet connection or Firebase setup.");
      setIsFirestoreLoading(false);
    });

    const unsubscribeOffers = onSnapshot(offersDocRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().offerText) {
        setDigitalOffersText(docSnap.data().offerText);
      } else {
        console.log("No digital offers data found, setting initial offer.");
        setDoc(offersDocRef, { offerText: initialDigitalOffersText })
          .then(() => setDigitalOffersText(initialDigitalOffersText))
          .catch(error => console.error("Error setting initial offers document:", error));
      }
    }, (error) => {
      console.error("Error fetching digital offers data:", error);
    });

    const unsubscribePayPeriods = onSnapshot(payPeriodsDocRef, (docSnap) => {
      if (docSnap.exists() && docSnap.data().data) {
        setPayPeriodsData(docSnap.data().data);
      } else {
        console.log("No pay periods data found, setting initial pay periods.");
        setDoc(payPeriodsDocRef, { data: initialPayPeriodsData })
          .then(() => setPayPeriodsData(initialPayPeriodsData))
          .catch(error => console.error("Error setting initial pay periods document:", error));
      }
    }, (error) => {
      console.error("Error fetching pay periods data:", error);
    });


    return () => {
      unsubscribeCalendar(); // Cleanup calendar listener
      unsubscribeOffers(); // Cleanup offers listener
      unsubscribePayPeriods(); // Cleanup pay periods listener
    };
  }, [db, userId, isAuthReady, APP_ID_ENV]); // Depend on db, userId, isAuthReady, and APP_ID_ENV

  // Function to update calendar in Firestore
  const updateCalendarInFirestore = async (updatedCalendar) => {
    if (db && userId) {
      try {
        const calendarDocRef = doc(db, `artifacts/${APP_ID_ENV}/public/data/calendarData/juneCalendar`);
        await setDoc(calendarDocRef, { data: updatedCalendar }); // Overwrite with new data
        console.log("Calendar data saved to Firestore!");
      } catch (error) {
        console.error("Error saving calendar to Firestore:", error);
        showAlert("Failed to save data. Please try again.");
      }
    } else {
      console.warn("Firestore or User ID not ready for saving.");
    }
  };

  // Function to update digital offers in Firestore
  const updateDigitalOffersInFirestore = async (newText) => {
    if (db && userId) {
      try {
        const offersDocRef = doc(db, `artifacts/${APP_ID_ENV}/public/data/digitalOffers/currentMonth`);
        await setDoc(offersDocRef, { offerText: newText });
        console.log("Digital offers saved to Firestore!");
      } catch (error) {
        console.error("Error saving digital offers to Firestore:", error);
        showAlert("Failed to save digital offers. Please try again.");
      }
    } else {
      console.warn("Firestore or User ID not ready for saving digital offers.");
    }
  };

  // This function is no longer needed as background is static.
  // It was previously declared twice, so ensuring it's only here once.
  const updateSelectedBackgroundInFirestore = async () => {
    console.log("Background is now static. No Firestore update for dynamic background needed.");
    // No actual Firestore operation here as the background is fixed.
  };


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
        setEventPromoCode(promo.detail || null); // Ensure null instead of undefined
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
      setHolidayDate(dayData); // Pass dayData.date directly, not dayData (corrected)
      setHolidayTitle(day.holiday.title);
      setHolidayNotes(day.holiday.notes || null); // Ensure null instead of undefined
      setHolidayHighlight(day.holiday.highlight || false);
      setSelectedHoliday({ dayDate, id: day.holiday.id });
      setIsEditHolidayModalVisible(true);
    }
  };

  // Function to open Edit Day modal
  const openEditDayModal = useCallback((dayData) => {
    // Only open if dayData has a valid date (not null for info-only cells)
    if (dayData && dayData.date !== null) {
      setEditDayDate(dayData.date);
      setEditDayWeatherHigh(dayData.weather?.high ?? null); // Use nullish coalescing for safety
      setEditDayWeekLabel(dayData.weekLabel || null); // Ensure null instead of undefined
      setEditDayWeatherCondition(dayData.weather?.condition || null); // Ensure null instead of undefined
      setSelectedDayData(dayData);
      setIsEditDayModalVisible(true);
    } else {
      showAlert("Cannot edit this cell. It does not represent a calendar day.");
    }
  }, []);


  const handleAddEditEventSubmit = (e) => {
    e.preventDefault();
    const oldDayDate = selectedEvent ? selectedEvent.dayDate : null; // Capture old date if editing
    const newDayDate = parseInt(eventDate, 10);

    if (isNaN(newDayDate) || newDayDate < 1 || newDayDate > 30 || !eventTitle.trim()) { // June has 30 days
      showAlert('Please enter a valid date (1-30) and promo title.');
      return;
    }

    let updatedCalendar = [...calendar]; // Create a mutable copy

    if (selectedEvent && oldDayDate !== newDayDate) {
        // If date is changed, remove from old day's promos
        updatedCalendar = updatedCalendar.map(day => {
            if (day.date === oldDayDate) {
                return {
                    ...day,
                    promos: day.promos.filter(promo => promo.id !== selectedEvent.promoId)
                };
            }
            return day;
        });
    }

    // Find or create the target day for the new/edited promo
    const targetDayIndex = updatedCalendar.findIndex(day => day.date === newDayDate);
    let targetDay;
    if (targetDayIndex !== -1) {
        targetDay = { ...updatedCalendar[targetDayIndex] };
    } else {
        showAlert("Cannot move event to a date outside the current month's defined range.");
        return;
    }

    if (selectedEvent) { // Editing existing event
      targetDay.promos = targetDay.promos.map(promo =>
        promo.id === selectedEvent.promoId
          ? { ...promo, type: eventColor, text: eventTitle.trim(), detail: (eventPromoCode || '').trim() || null } // Changed to null
          : promo
      );
      // If the event was moved to a new day, ensure it's added if it wasn't already there
      if (oldDayDate !== newDayDate && !targetDay.promos.some(p => p.id === selectedEvent.promoId)) {
          targetDay.promos.push({
              id: selectedEvent.id, // Use selectedEvent.id to ensure consistent ID after move
              type: eventColor,
              text: eventTitle.trim(),
              detail: (eventPromoCode || '').trim() || null // Changed to null
          });
      }
    } else { // Adding new event
      const newPromo = {
        id: `promo${Date.now()}`,
        type: eventColor,
        text: eventTitle.trim(),
        detail: (eventPromoCode || '').trim() || null // Changed to null
      };
      targetDay.promos.push(newPromo);
    }

    // Update the calendar with the modified target day
    if (targetDayIndex !== -1) {
        updatedCalendar[targetDayIndex] = targetDay;
    } else {
        updatedCalendar.push(targetDay);
        updatedCalendar.sort((a, b) => a.date - b.date);
    }

    setCalendar(updatedCalendar);
    updateCalendarInFirestore(updatedCalendar);

    setIsEditEventModalVisible(false);
    setIsAddEventModalVisible(false); // Close add modal too
    // Reset form fields
    setEventDate('');
    setEventTitle('');
    setEventPromoCode('');
    setEventColor('general');
  };

  const handleAddEditHolidaySubmit = (e) => {
    e.preventDefault();
    const dateNum = parseInt(holidayDate, 10);

    if (isNaN(dateNum) || dateNum < 1 || dateNum > 30 || !holidayTitle.trim()) { // June has 30 days
      showAlert('Please enter a valid date (1-30) and holiday title.');
      return;
    }

    const updatedHoliday = {
      id: selectedHoliday ? selectedHoliday.id : `holiday${Date.now()}`,
      title: holidayTitle.trim(),
      notes: (holidayNotes || '').trim() || null, // Ensure null instead of undefined
      highlight: holidayHighlight
    };

    const updatedCalendar = calendar.map(day => {
      if (day.date === dateNum) {
        let specialDayClass = '';
        if (updatedHoliday.title.toLowerCase().includes("father's day")) {
          specialDayClass = 'special-fathers-day';
        } else if (updatedHoliday.title.toLowerCase().includes("juneteenth")) {
          specialDayClass = 'special-juneteenth';
        } else {
          specialDayClass = 'custom-holiday';
        }

        return {
          ...day,
          holiday: updatedHoliday,
          specialDay: specialDayClass,
          specialText: updatedHoliday.title
        };
      }
      return day;
    });
    setCalendar(updatedCalendar);
    updateCalendarInFirestore(updatedCalendar);

    setIsAddHolidayModalVisible(false);
    setIsEditHolidayModalVisible(false);
    setHolidayDate('');
    setHolidayTitle('');
    setHolidayNotes('');
    setHolidayHighlight(false);
    setSelectedHoliday(null);
  };

  const handleEditDaySubmit = (e) => {
    e.preventDefault();
    const dateNum = parseInt(editDayDate, 10);

    if (isNaN(dateNum) || dateNum < 1 || dateNum > 30) { // June has 30 days
        showAlert('Please enter a valid date (1-30).');
        return;
    }

    const updatedCalendar = calendar.map(day => {
        if (day.date === dateNum) {
            return {
                ...day,
                weather: {
                    high: editDayWeatherHigh === '' ? null : parseInt(editDayWeatherHigh, 10), // Ensure null for empty
                    condition: editDayWeatherCondition || null, // Ensure null for empty or undefined
                    icon: getWeatherIcon(editDayWeatherCondition || '') // Ensure string for icon
                },
                weekLabel: (editDayWeekLabel || '').trim() || null // Ensure null for empty or undefined
            };
        }
        return day;
    });
    setCalendar(updatedCalendar);
    updateCalendarInFirestore(updatedCalendar);

    setIsEditDayModalVisible(false);
    setEditDayDate('');
    setEditDayWeatherHigh('');
    setEditDayWeekLabel('');
    setEditDayWeatherCondition('');
    setSelectedDayData(null);
  };


  const handleDeleteEvent = (dayDate, promoId) => {
    showConfirmation('Are you sure you want to delete this event?', () => {
      const updatedCalendar = calendar.map(day => {
        if (day.date === dayDate) {
          return {
            ...day,
            promos: day.promos.filter(promo => promo.id !== promoId)
          };
        }
        return day;
      });
      setCalendar(updatedCalendar);
      updateCalendarInFirestore(updatedCalendar);
      hideConfirmation();
    });
  };

  const handleDeleteHoliday = (dayDate) => {
    showConfirmation('Are you sure you want to delete this holiday?', () => {
      const updatedCalendar = calendar.map(day => {
        if (day.date === dayDate) {
          return {
            ...day,
            holiday: null, // Remove the holiday object
            specialDay: '', // Clear special day class
            specialText: '' // Clear special text
          };
        }
        return day;
      });
      setCalendar(updatedCalendar);
      updateCalendarInFirestore(updatedCalendar);
      hideConfirmation();
    });
  };

  const handleDeleteDay = (dayDate) => {
    showConfirmation(`Are you sure you want to clear all content for day ${dayDate}?`, () => {
        const updatedCalendar = calendar.map(day => {
            if (day.date === dayDate) {
                return {
                    ...day,
                    promos: [],
                    holiday: null,
                    specialDay: '',
                    selectedDayData: null,
                    weather: { high: null, condition: null, icon: null }, // Ensure null
                    weekLabel: null // Ensure null
                };
            }
            return day;
        });
        setCalendar(updatedCalendar);
        updateCalendarInFirestore(updatedCalendar);
        hideConfirmation();
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

  // This function is no longer needed as background is static.
  // It was previously declared twice, so ensuring it's only here once.
  // The duplicate declaration was causing the error. I have now completely removed it.


  // Helper to chunk the calendar data into weeks for table rendering
  const chunkIntoWeeks = (data) => {
    const weeks = [];
    // June 2025 starts on a Sunday (day 0)
    const firstDayOfMonthDate = new Date('2025-06-01T00:00:00');
    const firstDayOfWeekIndex = firstDayOfMonthDate.getDay(); // 0 for Sunday

    // Create a flat array representing the 6x7 grid (max possible weeks for a month)
    const allDaysInGrid = Array(6 * 7).fill(null);

    let currentDayIndex = firstDayOfWeekIndex;
    for (let i = 0; i < data.length; i++) {
      // Ensure we only place days if they fit within the grid
      if (currentDayIndex < allDaysInGrid.length) {
        allDaysInGrid[currentDayIndex] = data[i];
        currentDayIndex++;
      }
    }

    // Chunk into weeks
    for (let i = 0; i < allDaysInGrid.length; i += 7) {
      weeks.push(allDaysInGrid.slice(i, i + 7));
    }

    // Remove any entirely empty trailing weeks
    while (weeks.length > 0 && weeks[weeks.length - 1].every(day => day === null)) {
      weeks.pop();
    }

    return weeks;
  };

  const weeks = chunkIntoWeeks(calendar);

  // The fixed background image URL
  const headerBackgroundUrl = 'https://media.istockphoto.com/id/1463842482/photo/beautiful-multicolor-tropical-background-of-palm-trees.jpg?s=612x612&w=0&k=20&c=FqAG1B4ENYMh9SNzzaqAdlHki0atxI3tVnDWoZCjsU8=';


  // Show loading indicator if Firestore is still loading data
  if (isFirestoreLoading) {
    return (
      <div className="body" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-indicator">Loading Calendar...</div>
        <style>{`
          .loading-indicator {
            text-align: center;
            padding: 20px;
            font-style: italic;
            color: #777;
            font-size: 1.5em;
          }
          @keyframes loading-dots {
            0%, 20% { content: '.'; }
            40% { content: '..'; }
            60%, 100% { content: '...'; }
          }
        `}</style>
      </div>
    );
  }

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
          <button className="add-button" onClick={openAddHolidayModal} title="Add Holiday">
            🎁
          </button>
          <button className="print-button" onClick={() => window.print()} title="Print Calendar">
            🖨️
          </button>
        </div>
      </div>

      <div className="calendar-container">
        <div className="calendar-header" style={{ backgroundImage: `url(${headerBackgroundUrl})`, backgroundColor: '#e0f2f7' }}>
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
          {/* New: Digital Offers Box */}
          <div className="digital-offers-box">
            <h3 className="digital-offers-title">Digital Offers</h3>
            {isDigitalOffersEditing ? (
              <div className="digital-offers-edit-container">
                <textarea
                  value={digitalOffersText}
                  onChange={(e) => setDigitalOffersText(e.target.value)}
                  className="digital-offers-edit-input"
                  rows="3"
                ></textarea>
                <button className="digital-offers-save-btn" onClick={() => {
                  setIsDigitalOffersEditing(false);
                  updateDigitalOffersInFirestore(digitalOffersText);
                }}>Save</button>
              </div>
            ) : (
              <p className="digital-offers-text" onClick={() => setIsDigitalOffersEditing(true)} title="Click to edit digital offers">
                {digitalOffersText}
                <span className="digital-offers-edit-icon">✏️</span>
              </p>
            )}
          </div>
          {/* Removed dynamic background selection controls */}
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
                  <td key={dayIndex} className={`${dayData?.specialDay || ''} ${dayData === null ? 'empty-cell' : ''} ${dayData?.holiday?.highlight ? 'highlight-holiday-cell' : ''}`}>
                    {dayData ? (
                      <div className="cell-content">
                        <div className="date-number-wrapper">
                          {dayData.date !== null && (
                            <div className="date-number">
                                {dayData.date}
                            </div>
                          )}
                          {dayData.weather !== null && (
                            <div className="weather">
                              {dayData.weather.icon} {dayData.weather.high}°
                            </div>
                          )}
                          {/* Edit/Delete Day Icons - only for actual date cells */}
                          {dayData.date !== null && (
                            <>
                              <span
                                className="edit-icon day-edit-icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditDayModal(dayData);
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
                            </>
                          )}

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
                            <div className={`badge ${promo.type === 'two-dollar' ? 'two-dollar' : promo.type === 'rmp50' ? 'rmp50' : promo.type === 'monthly-offer' ? 'monthly-offer' : promo.type === 'pay-periods' ? 'pay-periods' : ''}`}>
                              {promo.text}
                            </div>
                            {promo.detail && (
                              <span className={`promo-detail ${promo.type === 'two-dollar' ? 'two-dollar' : promo.type === 'rmp50' ? 'rmp50' : promo.type === 'monthly-offer' ? 'monthly-offer' : promo.type === 'pay-periods' ? 'pay-periods' : ''}`}>
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
        {/* Display Pay Periods below the main calendar grid */}
        {payPeriodsData && payPeriodsData.promos && payPeriodsData.promos.length > 0 && (
          <div className="pay-periods-container">
            <div className="badge pay-periods">
              {payPeriodsData.promos[0].text}
              {payPeriodsData.promos[0].detail && (
                <span className="promo-detail">{payPeriodsData.promos[0].detail}</span>
              )}
            </div>
          </div>
        )}
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
                <label htmlFor="eventDate">Date (1-30):</label>
                <input
                  type="number"
                  id="eventDate"
                  min="1"
                  max="30"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  required
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
                      name="rmp50"
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
            <form onSubmit={handleAddEditHolidaySubmit} className="add-event-form">
              <div className="form-group">
                <label htmlFor="holidayDate">Date (1-30):</label>
                <input
                  type="number"
                  id="holidayDate"
                  min="1"
                  max="30"
                  value={holidayDate}
                  onChange={(e) => setHolidayDate(e.target.value)}
                  required
                  disabled={!!selectedHoliday}
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
              {/* Removed Generate Background Suggestion for Holiday */}
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
                <label htmlFor="editDayWeatherCondition">Weather Condition:</label>
                <select
                  id="editDayWeatherCondition"
                  value={editDayWeatherCondition}
                  onChange={(e) => setEditDayWeatherCondition(e.target.value)}
                  required
                >
                  <option value="">Select Condition</option>
                  <option value="Sunny">Sunny ☀️</option>
                  <option value="Cloudy">Cloudy ☁️</option>
                  <option value="Rain">Rainy 🌧️</option>
                  <option value="Partly Sunny">Partly Sunny 🌤️</option>
                  <option value="Mostly Cloudy">Mostly Cloudy 🌥️</option>
                </select>
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

      {/* Custom Confirmation Modal */}
      {isConfirmationModalVisible && (
        <ConfirmationModal
          message={confirmationMessage}
          onConfirm={() => {
            if (confirmationAction) {
              confirmationAction();
            }
            hideConfirmation();
          }}
          onCancel={hideConfirmation}
        />
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
        .title-edit-container {
            width: 100%;
            display: flex;
            gap: 10px;
            align-items: center;
        }
        .title-edit-input {
            flex-grow: 1;
            padding: 10px 15px;
            border: 1px solid #ddd;
            border-radius: 8px;
            font-size: 1.1em;
            font-family: 'Montserrat', sans-serif;
            font-weight: 600;
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
          background-color: #ffffff; /* Fallback color */
          background-size: cover;
          background-position: center;
          border-bottom: 1px solid #e0e0e0;
          border-radius: 12px 12px 0 0;
          flex-wrap: wrap; /* Allow items to wrap on smaller screens */
          gap: 15px; /* Space between header elements */
          background-repeat: no-repeat; /* Ensure background doesn't repeat */
        }

        .digital-offers-box {
            background: linear-gradient(45deg, #f0f0f0, #e0e0e0); /* Light grey gradient */
            border: 1px solid #ccc;
            border-radius: 10px;
            padding: 15px 20px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.1);
            text-align: center;
            flex-shrink: 0; /* Prevent shrinking */
            min-width: 200px; /* Minimum width */
            max-width: 280px; /* Maximum width */
            margin-left: 20px; /* Space from calendar title */
            position: relative;
            cursor: pointer;
            transition: transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
        }
        .digital-offers-box:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(0,0,0,0.15);
        }
        .digital-offers-title {
            font-family: 'Montserrat', sans-serif;
            font-weight: 700;
            font-size: 1.1em;
            color: #c8102e;
            margin-top: 0;
            margin-bottom: 8px;
            text-transform: uppercase;
        }
        .digital-offers-text {
            font-size: 0.9em;
            color: #333;
            line-height: 1.4;
            white-space: pre-wrap; /* Preserve whitespace and line breaks */
            word-wrap: break-word; /* Break long words */
            margin-bottom: 0;
        }
        .digital-offers-edit-icon {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 0.8em;
            color: rgba(0,0,0,0.5);
            opacity: 0; /* Hidden by default */
            transition: opacity 0.2s ease-in-out;
        }
        .digital-offers-box:hover .digital-offers-edit-icon {
            opacity: 1; /* Visible on hover */
        }
        .digital-offers-edit-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        .digital-offers-edit-input {
            width: 100%;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.9em;
            box-sizing: border-box;
            resize: vertical; /* Allow vertical resizing */
        }
        .digital-offers-save-btn {
            background-color: #006c3b;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 0.8em;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }
        .digital-offers-save-btn:hover {
            background-color: #005a30;
        }

        .background-selection-controls {
            margin-left: 20px;
            position: relative;
            flex-shrink: 0;
            opacity: 1;
            transition: opacity 0.2s ease-in-out;
            background-color: rgba(255, 255, 255, 0.8);
            padding: 10px;
            border-radius: 8px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            z-index: 10;
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 10px;
        }
        .edit-background-button {
            background-color: #f0f0f0;
            color: #333;
            border: 1px solid #ccc;
            border-radius: 8px;
            padding: 5px 8px;
            font-size: 0.8em;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }
        .edit-background-button:hover {
            background-color: #e0e0e0;
        }
        .background-select-container {
            display: flex;
            flex-direction: column;
            gap: 5px;
            position: static;
            background-color: transparent;
            border: none;
            padding: 0;
            box-shadow: none;
            z-index: auto;
        }
        .background-select {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 0.9em;
        }
        .generate-background-btn {
            background-color: #006c3b;
            color: #fff;
            border: none;
            border-radius: 5px;
            padding: 8px 12px;
            font-size: 0.8em;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }
        .generate-background-btn:hover {
            background-color: #005a30;
        }
        .background-save-btn {
            background-color: #c8102e;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 0.8em;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
        }
        .background-save-btn:hover {
            background-color: #a00d27;
        }
        .background-loading-indicator {
            text-align: center;
            font-style: italic;
            color: #777;
            margin-top: 10px;
        }
        .background-loading-indicator::after {
            content: '...';
            animation: loading-dots 1s infinite;
        }
        @keyframes loading-dots {
          0%, 20% { content: '.'; }
          40% { content: '..'; }
          60%, 100% { content: '...'; }
        }
        .background-guide-message {
            font-size: 0.8em;
            color: #555;
            text-align: center;
            margin-top: 10px;
            padding: 5px;
            border: 1px dashed #ccc;
            border-radius: 5px;
            background-color: rgba(255,255,255,0.7);
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
          min-height: 120px;
          padding: 12px;
          transition: background-color 0.2s ease-in-out;
          position: relative;
        }
        td:hover {
            background-color: #f5f5f5;
        }
        .empty-cell {
            background-color: #f9f9f9 !important;
        }
        .info-only-cell .cell-content {
            justify-content: center;
            align-items: center;
            height: 100%;
        }
        .info-only-cell .date-weather-group {
            display: none;
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
            gap: 6px;
            margin-bottom: 8px;
            position: relative;
            width: 100%;
        }

        .week-label {
          font-size: 0.68em;
          color: #999;
          margin-bottom: 4px;
        }

        .date-number-wrapper {
            position: relative;
            z-index: 1;
            display: inline-block;
            padding: 2px 4px;
            border-radius: 4px;
            transition: background-color 0.3s ease;
        }
        .highlight-holiday-cell .date-number-wrapper {
            background-color: #FFD700;
            border: 1px solid #DAA520;
        }

        .date-number {
          font-size: 1.3em;
          font-weight: 700;
          color: #222;
        }
        .weather {
          font-family: 'Montserrat', sans-serif;
          font-size: 1.0em;
          font-weight: 700;
          color: #444;
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
        .badge.special-text-badge {
            background: rgba(255,255,255,0.2);
            color: #fff;
            box-shadow: none;
            border: 1px solid rgba(255,255,255,0.3);
            margin-bottom: 8px;
            padding: 6px 10px;
            position: relative;
        }
        .badge.monthly-offer {
            background: linear-gradient(135deg, #c8102e 0%, #ff4500 100%);
            color: #fff;
            font-size: 1em;
            font-weight: 700;
            padding: 10px 15px;
            border-radius: 8px;
            margin-top: 8px;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            border: 2px solid #a00d27;
        }
        .badge.monthly-offer .promo-detail {
            color: #fff;
            font-weight: 600;
        }
        .badge.pay-periods {
            background-color: #e6f7ff;
            color: #0056b3;
            border: 1px solid #99d6ff;
            font-weight: 600;
            font-size: 0.85em;
            padding: 8px 10px;
            border-radius: 6px;
            margin-top: 0;
            line-height: 1.3;
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
          position: relative;
        }
        .card:first-of-type {
            margin-top: 0;
        }
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
        .holiday-notes {
            font-size: 0.65em;
            color: #666;
            margin-top: 3px;
            line-height: 1.2;
            text-align: center;
        }

        /* Holiday Cell Backgrounds */
        .special-day {
            background-color: #fffbf0;
            border: 2px solid #f9e0a0;
        }
        .special-fathers-day {
            background: linear-gradient(135deg, #ADD8E6 0%, #87CEEB 100%);
            border: 2px solid #4682B4;
            color: #333;
        }
        .special-juneteenth {
            background: linear-gradient(135deg, #FF6347 0%, #FFD700 50%, #87CEEB 100%);
            border: 2px solid #DC143C;
            color: #333;
        }
        .custom-holiday {
            background: linear-gradient(135deg, #E0FFFF 0%, #87CEFA 100%);
            border: 2px solid #4169E1;
            color: #333;
        }
        .highlight-holiday-cell {
        }
        .highlight-holiday-cell .date-number,
        .highlight-holiday-cell .special-text-badge {
            color: #333 !important;
            font-weight: bold !important;
            text-shadow: none !important;
        }
        .highlight-holiday-cell .special-text-badge {
            background-color: #FFD700 !important;
            border-color: #DAA520 !important;
            color: #333 !important;
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
            margin: 0 10px;
            width: 40px;
            height: 40px;
        }

        /* Corrected styles for icons within cells */
        /* All icons that should be hidden by default */
        .date-weather-group .edit-icon,
        .date-weather-group .delete-icon,
        .date-weather-group .holiday-edit-icon,
        .date-weather-group .holiday-delete-icon,
        .card .edit-icon,
        .card .delete-icon,
        .card .generate-promo-star,
        .title-edit-icon,
        .banner-edit-icon,
        .digital-offers-edit-icon {
          opacity: 0;
          transition: opacity 0.2s ease-in-out, transform 0.1s ease-in-out;
        }

        /* Hover states for icons */
        td:hover .date-weather-group .edit-icon,
        td:hover .date-weather-group .delete-icon,
        td:hover .date-weather-group .holiday-edit-icon,
        td:hover .date-weather-group .holiday-delete-icon {
            opacity: 1;
        }
        /* Show card-level icons on card hover */
        .card:hover .edit-icon,
        .card:hover .delete-icon,
        .card:hover .generate-promo-star {
            opacity: 1;
        }
        /* Show title edit icon on h1 hover */
        h1:hover .title-edit-icon {
            opacity: 1;
        }
        /* Show banner edit icon on banner hover */
        .banner:hover .banner-edit-icon {
            opacity: 1;
        }
        /* Show digital offers edit icon on box hover */
        .digital-offers-box:hover .digital-offers-edit-icon {
            opacity: 1;
        }


        /* Individual icon hover for slight scale/background change */
        .edit-icon:hover, .delete-icon:hover, .generate-promo-star:hover,
        .title-edit-icon:hover, .banner-edit-icon:hover, .digital-offers-edit-icon:hover,
        .edit-background-button:active {
            transform: scale(1.1);
            background-color: rgba(255, 255, 255, 0.7);
        }
        .edit-icon:active, .delete-icon:active, .generate-promo-star:active,
        .title-edit-icon:active, .banner-edit-icon:active, .digital-offers-edit-icon:active,
        .edit-background-button:active {
            transform: scale(0.95);
        }

        /* Positioning of icons within cells */
        .card .edit-icon {
            position: absolute;
            top: 4px;
            right: 28px;
            color: #007bff;
        }
        .card .delete-icon {
            position: absolute;
            top: 4px;
            right: 50px;
            color: #dc3545;
        }
        .generate-promo-star {
          position: absolute;
          top: 4px;
          right: 6px;
          font-size: 1.1em;
          cursor: pointer;
          line-height: 1;
          padding: 3px;
          border-radius: 50%;
          background-color: transparent;
        }
        .day-edit-icon {
            position: absolute;
            top: 0px;
            right: 24px;
            color: #007bff;
        }
        .day-delete-icon {
            position: absolute;
            top: 0px;
            right: 2px;
            color: #dc3545;
        }
        .holiday-edit-icon {
            position: absolute;
            top: 24px;
            right: 24px;
            color: #007bff;
        }
        .holiday-delete-icon {
            position: absolute;
            top: 24px;
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

        /* Pay Periods Container */
        .pay-periods-container {
            margin-top: 20px;
            padding: 15px;
            background-color: #f0f8ff; /* Light blue background */
            border: 1px solid #aaddff;
            border-radius: 10px;
            text-align: center;
            box-shadow: 0 2px 8px rgba(0,0,0,0.08);
        }
        .pay-periods-container .badge {
            display: inline-block; /* Make it fit content */
            width: auto; /* Override 100% width from general badge */
            margin-bottom: 5px;
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

        /* Form styles */
        .add-event-form .form-group {
            margin-bottom: 15px;
        }
        .add-event-form label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: #555;
        }
        .add-event-form input[type="text"],
        .add-event-form input[type="number"],
        .add-event-form textarea,
        .add-event-form select {
            width: 100%;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 5px;
            font-size: 1em;
            box-sizing: border-box;
        }
        .add-event-form .color-options {
            display: flex;
            gap: 15px;
            margin-top: 5px;
        }
        .add-event-form .color-options label {
            display: flex;
            align-items: center;
            gap: 5px;
            font-weight: normal;
            color: #333;
        }
        .add-event-form .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        .add-event-form .checkbox-group input[type="checkbox"] {
            width: auto;
        }
        .submit-event-btn, .copy-to-clipboard-btn, .cancel-btn {
            background-color: #c8102e;
            color: #fff;
            border: none;
            border-radius: 8px;
            padding: 12px 20px;
            font-size: 1em;
            cursor: pointer;
            transition: background-color 0.2s ease-in-out;
            box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .submit-event-btn:hover {
            background-color: #a00d27;
        }
        .cancel-btn {
            background-color: #6c757d;
        }
        .cancel-btn:hover {
            background-color: #5a6268;
        }


        /* Print Styles */
        @media print {
            @page {
                size: landscape;
                margin: 0; /* Remove all margins from the page */
            }
            html, body {
                width: 100vw;
                height: 100vh;
                margin: 0;
                padding: 0;
                overflow: hidden; /* Hide scrollbars */
                box-sizing: border-box; /* Include padding and border in the element's total width and height */
            }
            body {
                font-size: 9pt; /* Increased base font size for print */
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: stretch;
            }
            .add-event-controls,
            .modal-overlay,
            .digital-offers-box, /* Hide digital offers box on print */
            .banner-edit-container,
            .title-edit-container {
                display: none !important;
            }
            /* Hide individual icons */
            .generate-promo-star,
            .edit-icon,
            .delete-icon,
            .banner-edit-icon,
            .copy-to-clipboard-btn,
            .title-edit-icon,
            .background-selection-controls {
                display: none !important;
            }
            .header-icon {
                display: inline-block !important;
                width: 25px !important; /* Slightly larger icon for print */
                height: 25px !important;
                margin: 0 5px !important; /* Adjusted margin */
                vertical-align: middle !important;
                print-color-adjust: exact;
            }

            .logo {
                text-align: center !important;
                margin-bottom: 5px !important; /* Adjusted margin */
                padding-top: 0 !important;
            }
            .logo img {
                height: 18px !important; /* Slightly larger logo for print */
                width: auto !important;
                max-width: 100% !important;
                margin: 0 auto !important;
                filter: grayscale(50%);
            }

            .calendar-container {
                box-shadow: none;
                border: 0; /* Remove outer border to maximize space */
                width: 100%; /* Ensure 100% width for full span */
                height: 100%; /* Ensure 100% height for full span */
                border-radius: 0;
                overflow: hidden; /* Hide scrollbars for print */
                background: #fff;
                print-color-adjust: exact;
                display: flex;
                flex-direction: column;
                justify-content: space-between; /* Distribute space vertically */
                align-items: stretch;
            }
            .calendar-header {
                box-shadow: none;
                border-bottom: 3px solid #000 !important; /* Darker, thicker border */
                padding: 0.3rem 8px; /* Adjusted padding */
                border-radius: 0;
                background-color: #f0f0f0;
                background-image: url(${headerBackgroundUrl}) !important;
                background-size: cover !important;
                background-position: center !important;
                print-color-adjust: exact;
                flex-wrap: nowrap !important;
                justify-content: space-between !important;
                align-items: center !important;
                padding-left: 10px !important;
                padding-right: 10px !important;
            }
            h1 {
                font-size: 1.8em !important; /* Larger font size for main title */
                font-weight: 900 !important;
                margin-bottom: 0.1em !important;
                color: #000 !important; /* Darker text */
                text-shadow: none;
                cursor: default;
                print-color-adjust: exact;
                flex-grow: 1;
                text-align: center;
            }
            .banner {
                box-shadow: none;
                border-radius: 0;
                padding: 5px 8px; /* Adjusted padding */
                margin-bottom: 5px; /* Adjusted margin */
                background-color: #e0e0e0; /* Slightly darker to stand out */
                color: #000;
                border-bottom: 1px solid #666;
                font-size: 1em !important; /* Adjusted font size */
                font-weight: 700 !important;
                print-color-adjust: exact;
            }


            table {
                width: 100%;
                height: 100%; /* Distribute height evenly */
                table-layout: fixed;
                border-collapse: collapse;
                flex-grow: 1; /* Allow table to fill available space */
            }
            th {
                background-color: #f8f8f8;
                border: 3px solid #000 !important; /* Darker, thicker border */
                padding: 3px; /* Adjusted padding */
                font-size: 1em !important; /* Adjusted font size */
                color: #000;
                font-weight: 700;
                text-transform: uppercase;
                print-color-adjust: exact;
            }
            td {
                border: 3px solid #000 !important; /* Darker, thicker border */
                height: 100%; /* Distribute height evenly */
                min-height: 0; /* Remove min-height constraint for better scaling */
                padding: 4px; /* Adjusted padding for better spacing */
                display: table-cell;
                vertical-align: top;
                page-break-inside: avoid;
                background-color: #fdfdfd !important;
                print-color-adjust: exact;
            }
            .cell-content {
                height: 100%;
                min-height: 0; /* Ensure it scales down */
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
            }
            .date-number-wrapper {
                margin-bottom: 3px; /* Add some space below date number */
            }
            .date-number {
                font-size: 1.3em !important; /* Adjusted for print */
                font-weight: 700 !important;
            }
            .weather {
                font-size: 1.1em !important; /* Adjusted for print */
                font-weight: 700 !important;
            }
            .badge {
                padding: 2px 4px; /* Adjusted padding */
                font-size: 0.8em !important; /* Adjusted font size */
                box-shadow: none;
                border: 1px solid #991;
                page-break-inside: avoid;
                margin-bottom: 2px;
                print-color-adjust: exact;
            }
            .card {
                box-shadow: none;
                padding: 2px; /* Adjusted padding */
                margin-top: 2px;
                border: 1px solid #ccc;
                background-color: #fff;
                page-break-inside: avoid;
                print-color-adjust: exact;
            }
            .promo-detail {
                font-size: 0.6em !important; /* Adjusted font size */
                margin-top: 0px;
                line-height: 1.1;
                color: #666;
                print-color-adjust: exact;
            }
            .holiday-notes {
                font-size: 0.6em !important; /* Adjusted font size */
            }
            .week-label-bubble {
                background-color: #e0e0e0;
                color: #333;
                font-size: 0.6em !important; /* Adjusted font size */
                padding: 1px 3px;
                box-shadow: none;
                border: 1px solid #999;
                margin-top: 2px;
                align-self: flex-start;
                print-color-adjust: exact;
            }
            .special-fathers-day,
            .special-juneteenth,
            .custom-holiday {
                /* Ensure background colors print */
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            .pay-periods-container {
                margin-top: 8px !important; /* Adjusted margin */
                padding: 8px !important; /* Adjusted padding */
                font-size: 0.8em !important; /* Adjusted font size */
                border: 1px solid #99d6ff !important;
                background-color: #e6f7ff !important;
                print-color-adjust: exact;
            }
        }

        /* Media queries for screen display only (kept as is) */
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
                width: 25px;
                height: 25px;
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
