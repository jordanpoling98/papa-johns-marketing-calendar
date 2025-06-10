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
    { id: 'promo8', type: 'two-dollar', text: '🍕 BOGO for $2!', detail: 'Promo Code: 2DOLLARTUES' }
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
  const [isAuthReady, setIsAuthReady] = useState(false);
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
    
