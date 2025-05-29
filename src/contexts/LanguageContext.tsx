
import React, { createContext, useContext, useState, useEffect } from 'react';

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
    label_secret_code: 'Secret Code',
    enter: 'Enter',
    welcome_title: 'Welcome to Sri Balaji Temple',
    welcome_subtitle: 'Experience Divine Bliss and Spiritual Enlightenment',
    view_events: 'View Events',
    stat_devotees: 'Devotees',
    stat_events: 'Events',
    stat_donations: 'Donations',
    stat_live_visitors: 'Live Visitors'
  },
  hi: {
    home: 'होम',
    gallery: 'गैलरी',
    events: 'कार्यक्रम',
    services: 'सेवाएं',
    donations: 'दान',
    signup: 'साइन अप',
    admin: 'एडमिन',
    label_secret_code: 'गुप्त कोड',
    enter: 'दर्ज',
    welcome_title: 'श्री बालाजी मंदिर में आपका स्वागत है',
    welcome_subtitle: 'दिव्य आनंद और आध्यात्मिक ज्ञान का अनुभव करें',
    view_events: 'कार्यक्रम देखें',
    stat_devotees: 'भक्त',
    stat_events: 'कार्यक्रम',
    stat_donations: 'दान',
    stat_live_visitors: 'लाइव विज़िटर'
  },
  te: {
    home: 'హోమ్',
    gallery: 'గ్యాలరీ',
    events: 'ఈవెంట్స్',
    services: 'సేవలు',
    donations: 'దానాలు',
    signup: 'సైన్ అప్',
    admin: 'అడ్మిన్',
    label_secret_code: 'రహస్య కోడ్',
    enter: 'ప్రవేశించండి',
    welcome_title: 'శ్రీ బాలాజీ ఆలయానికి స్వాగతం',
    welcome_subtitle: 'దైవిక ఆనందం మరియు ఆధ్యాత్మిక జ్ఞానోదయాన్ని అనుభవించండి',
    view_events: 'ఈవెంట్స్ చూడండి',
    stat_devotees: 'భక్తులు',
    stat_events: 'ఈవెంట్స్',
    stat_donations: 'దానాలు',
    stat_live_visitors: 'లైవ్ విజిటర్స్'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
