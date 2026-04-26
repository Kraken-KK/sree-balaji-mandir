import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'en' | 'hi' | 'te';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    home: 'Home',
    gallery: 'Gallery',
    events: 'Events',
    services: 'Services',
    donations: 'Donations',
    signup: 'Sign Up',
    admin: 'Admin',
    history: 'History',
    secretCode: 'Secret Code',
    enter: 'Enter',
    welcomeTitle: 'Welcome to Sri Balaji Temple',
    welcomeSubtitle: 'Experience Divine Bliss and Spiritual Enlightenment',
    viewEvents: 'View Events',
    devotees: 'Devotees',
    eventsCount: 'Events',
    donationsAmount: 'Donations',
    liveVisitors: 'Live Visitors',
    eventsTitle: 'Temple Events & Celebrations',
    festivals: 'Festivals',
    daily: 'Daily Rituals',
    special: 'Special Events',
    register: 'Register Now',
    fullName: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    members: 'Number of Members',
    submit: 'Submit Registration',
    registrationSuccess: 'Registration Successful!',
    galleryTitle: 'Sacred Gallery',
    servicesTitle: 'Temple Services',
    donationsTitle: 'Make a Donation',
    signupTitle: 'Join Our Community',
    username: 'Username',
    password: 'Password',
    confirmPassword: 'Confirm Password',
    signupSubmit: 'Create Account',
    signupSuccess: 'Account created successfully!',
    templeHistory: 'Temple History',
    managementFamily: 'Management & Family',
    aboutTitle: 'About Our Sacred Temple'
  },
  hi: {
    home: 'होम',
    gallery: 'गैलरी',
    events: 'कार्यक्रम',
    services: 'सेवाएं',
    donations: 'दान',
    signup: 'साइन अप',
    admin: 'एडमिन',
    history: 'इतिहास',
    secretCode: 'गुप्त कोड',
    enter: 'दर्ज करें',
    welcomeTitle: 'श्री बालाजी मंदिर में आपका स्वागत है',
    welcomeSubtitle: 'दिव्य आनंद और आध्यात्मिक ज्ञान का अनुभव करें',
    viewEvents: 'कार्यक्रम देखें',
    devotees: 'भक्त',
    eventsCount: 'कार्यक्रम',
    donationsAmount: 'दान',
    liveVisitors: 'लाइव विज़िटर',
    eventsTitle: 'मंदिर कार्यक्रम और उत्सव',
    festivals: 'त्योहार',
    daily: 'दैनिक अनुष्ठान',
    special: 'विशेष कार्यक्रम',
    register: 'अभी पंजीकरण करें',
    fullName: 'पूरा नाम',
    email: 'ईमेल पता',
    phone: 'फोन नंबर',
    members: 'सदस्यों की संख्या',
    submit: 'पंजीकरण जमा करें',
    registrationSuccess: 'पंजीकरण सफल!',
    galleryTitle: 'पवित्र गैलरी',
    servicesTitle: 'मंदिर सेवाएं',
    donationsTitle: 'दान करें',
    signupTitle: 'हमारे समुदाय में शामिल हों',
    username: 'उपयोगकर्ता नाम',
    password: 'पासवर्ड',
    confirmPassword: 'पासवर्ड की पुष्टि करें',
    signupSubmit: 'खाता बनाएं',
    signupSuccess: 'खाता सफलतापूर्वक बनाया गया!',
    templeHistory: 'मंदिर का इतिहास',
    managementFamily: 'प्रबंधन और परिवार',
    aboutTitle: 'हमारे पवित्र मंदिर के बारे में'
  },
  te: {
    home: 'హోమ్',
    gallery: 'గ్యాలరీ',
    events: 'ఈవెంట్స్',
    services: 'సేవలు',
    donations: 'దానాలు',
    signup: 'సైన్ అప్',
    admin: 'అడ్మిన్',
    history: 'చరిత్ర',
    secretCode: 'రహస్య కోడ్',
    enter: 'ప్రవేశించండి',
    welcomeTitle: 'శ్రీ బాలాజీ ఆలయానికి స్వాగతం',
    welcomeSubtitle: 'దైవిక ఆనందం మరియు ఆధ్యాత్మిక జ్ఞానోదయాన్ని అనుభవించండి',
    viewEvents: 'ఈవెంట్స్ చూడండి',
    devotees: 'భక్తులు',
    eventsCount: 'ఈవెంట్స్',
    donationsAmount: 'దానాలు',
    liveVisitors: 'లైవ్ విజిటర్స్',
    eventsTitle: 'ఆలయ కార్యక్రమాలు మరియు వేడుకలు',
    festivals: 'పండుగలు',
    daily: 'దైనందిన కర్మలు',
    special: 'ప్రత్యేక కార్యక్రమాలు',
    register: 'ఇప్పుడే నమోదు చేయండి',
    fullName: 'పూర్తి పేరు',
    email: 'ఇమెయిల్ చిరునామా',
    phone: 'ఫోన్ నంబర్',
    members: 'సభ్యుల సంఖ్య',
    submit: 'నమోదు సమర్పించండి',
    registrationSuccess: 'నమోదు విజయవంతం!',
    galleryTitle: 'పవిత్ర గ్యాలరీ',
    servicesTitle: 'ఆలయ సేవలు',
    donationsTitle: 'దానం చేయండి',
    signupTitle: 'మా సంఘంలో చేరండి',
    username: 'వినియోగదారు పేరు',
    password: 'పాస్‌వర్డ్',
    confirmPassword: 'పాస్‌వర్డ్ నిర్ధారించండి',
    signupSubmit: 'ఖాతా సృష్టించండి',
    signupSuccess: 'ఖాతా విజయవంతంగా సృష్టించబడింది!',
    templeHistory: 'ఆలయ చరిత్ర',
    managementFamily: 'నిర్వహణ మరియు కుటుంబం',
    aboutTitle: 'మా పవిత్ర ఆలయం గురించి'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && ['en', 'hi', 'te'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations[typeof language]] || key;
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
