
import React, { createContext, useContext, useState } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    home: 'Home',
    gallery: 'Gallery',
    events: 'Events',
    services: 'Services',
    donations: 'Donations',
    signup: 'Sign Up',
    admin: 'Admin',
    
    // Home Page
    welcome_title: 'Welcome to Sri Balaji Temple',
    welcome_subtitle: 'Experience divine bliss and spiritual enlightenment',
    view_events: 'View Events',
    stat_devotees: 'Devotees',
    stat_events: 'Annual Events',
    stat_donations: 'Donations Raised',
    stat_live_visitors: 'Live Visitors',
    
    // Gallery
    gallery_title: 'Temple Gallery',
    filter_media: 'Filter Media',
    all: 'All',
    images: 'Images',
    videos: 'Videos',
    year: 'By Year',
    
    // Events
    events_title: 'Temple Events',
    cat_festivals: 'Festivals',
    cat_daily: 'Daily Rituals',
    cat_special: 'Special Events',
    register: 'Register',
    
    // Services & Donations
    services_title: 'Temple Services',
    donation_title: 'Make a Donation',
    donation_subtitle: 'Support our temple activities',
    book_ticket: 'Book Now',
    donate_now: 'Donate Now',
    
    // Forms
    label_full_name: 'Full Name',
    label_email: 'Email',
    label_phone: 'Phone Number',
    label_members: 'Number of Members',
    label_name: 'Name',
    label_mobile: 'Mobile',
    label_tickets: 'Number of Tickets',
    label_username: 'Username',
    label_password: 'Password',
    label_confirm_password: 'Confirm Password',
    label_secret_code: 'Secret Code',
    
    // Buttons
    submit: 'Submit',
    signup_submit: 'Create Account',
    enter: 'Enter',
    
    // Messages
    msg_registration_success: 'Registration successful!',
    msg_registration_error: 'Registration failed. Please try again.',
    msg_booking_success: 'Booking confirmed!',
    msg_donation_thanks: 'Thank you for your donation!',
    msg_signup_success: 'Account created successfully!',
  },
  hi: {
    // Navigation
    home: 'मुख्य',
    gallery: 'गैलरी',
    events: 'कार्यक्रम',
    services: 'सेवाएं',
    donations: 'दान',
    signup: 'साइन अप',
    admin: 'प्रशासक',
    
    // Home Page
    welcome_title: 'श्री बालाजी मंदिर में आपका स्वागत है',
    welcome_subtitle: 'दिव्य आनंद और आध्यात्मिक प्रबोधन का अनुभव करें',
    view_events: 'कार्यक्रम देखें',
    stat_devotees: 'भक्तगण',
    stat_events: 'वार्षिक कार्यक्रम',
    stat_donations: 'दान राशि',
    stat_live_visitors: 'लाइव विजिटर',
    
    // Gallery
    gallery_title: 'मंदिर गैलरी',
    filter_media: 'मीडिया फिल्टर',
    all: 'सभी',
    images: 'छवियां',
    videos: 'वीडियो',
    year: 'वर्ष के अनुसार',
    
    // Events
    events_title: 'मंदिर कार्यक्रम',
    cat_festivals: 'त्योहार',
    cat_daily: 'दैनिक आरती',
    cat_special: 'विशेष कार्यक्रम',
    register: 'पंजीकरण',
    
    // Services & Donations
    services_title: 'मंदिर सेवाएं',
    donation_title: 'दान करें',
    donation_subtitle: 'हमारे मंदिर गतिविधियों का समर्थन करें',
    book_ticket: 'बुक करें',
    donate_now: 'अभी दान करें',
    
    // Forms
    label_full_name: 'पूरा नाम',
    label_email: 'ईमेल',
    label_phone: 'फोन नंबर',
    label_members: 'सदस्यों की संख्या',
    label_name: 'नाम',
    label_mobile: 'मोबाइल',
    label_tickets: 'टिकटों की संख्या',
    label_username: 'उपयोगकर्ता नाम',
    label_password: 'पासवर्ड',
    label_confirm_password: 'पासवर्ड की पुष्टि करें',
    label_secret_code: 'गुप्त कोड',
    
    // Buttons
    submit: 'जमा करें',
    signup_submit: 'खाता बनाएं',
    enter: 'प्रवेश',
    
    // Messages
    msg_registration_success: 'पंजीकरण सफल!',
    msg_registration_error: 'पंजीकरण असफल। कृपया पुनः प्रयास करें।',
    msg_booking_success: 'बुकिंग की पुष्टि हो गई!',
    msg_donation_thanks: 'आपके दान के लिए धन्यवाद!',
    msg_signup_success: 'खाता सफलतापूर्वक बनाया गया!',
  },
  te: {
    // Navigation
    home: 'హోమ్',
    gallery: 'గ్యాలరీ',
    events: 'కార్యక్రమాలు',
    services: 'సేవలు',
    donations: 'దానధర్మాలు',
    signup: 'సైన్ అప్',
    admin: 'అడ్మిన్',
    
    // Home Page
    welcome_title: 'శ్రీ బాలాజీ దేవాలయానికి స్వాగతం',
    welcome_subtitle: 'దైవిక ఆనందం మరియు ఆధ్యాత్మిక జ్ఞానాన్ని అనుభవించండి',
    view_events: 'కార్యక్రమాలు చూడండి',
    stat_devotees: 'భక్తులు',
    stat_events: 'వార్షిక కార్యక్రమాలు',
    stat_donations: 'దానధర్మాలు',
    stat_live_visitors: 'లైవ్ విజిటర్లు',
    
    // Gallery
    gallery_title: 'దేవాలయ గ్యాలరీ',
    filter_media: 'మీడియా ఫిల్టర్',
    all: 'అన్నీ',
    images: 'చిత్రాలు',
    videos: 'వీడియోలు',
    year: 'సంవత్సరం వారీగా',
    
    // Events
    events_title: 'దేవాలయ కార్యక్రమాలు',
    cat_festivals: 'పండుగలు',
    cat_daily: 'రోజువారీ పూజలు',
    cat_special: 'ప్రత్యేక కార్యక్రమాలు',
    register: 'నమోదు',
    
    // Services & Donations
    services_title: 'దేవాలయ సేవలు',
    donation_title: 'దానం చేయండి',
    donation_subtitle: 'మా దేవాలయ కార్యక్రమాలకు మద్దతు ఇవ్వండి',
    book_ticket: 'బుక్ చేయండి',
    donate_now: 'ఇప్పుడే దానం చేయండి',
    
    // Forms
    label_full_name: 'పూర్తి పేరు',
    label_email: 'ఇమెయిల్',
    label_phone: 'ఫోన్ నంబర్',
    label_members: 'సభ్యుల సంఖ్య',
    label_name: 'పేరు',
    label_mobile: 'మొబైల్',
    label_tickets: 'టిక్కెట్ల సంఖ్య',
    label_username: 'యూజర్‌నేమ్',
    label_password: 'పాస్‌వర్డ్',
    label_confirm_password: 'పాస్‌వర్డ్ నిర్ధారించండి',
    label_secret_code: 'రహస్య కోడ్',
    
    // Buttons
    submit: 'సమర్పించు',
    signup_submit: 'ఖాతా సృష్టించు',
    enter: 'ప్రవేశించు',
    
    // Messages
    msg_registration_success: 'నమోదు విజయవంతం!',
    msg_registration_error: 'నమోదు విఫలమైంది. దయచేసి మళ్లీ ప్రయత్నించండి.',
    msg_booking_success: 'బుకింగ్ నిర్ధారించబడింది!',
    msg_donation_thanks: 'మీ దానానికి ధన్యవాదాలు!',
    msg_signup_success: 'ఖాతా విజయవంతంగా సృష్టించబడింది!',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations['en']] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
