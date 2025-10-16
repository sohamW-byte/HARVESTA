
'use client';

import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';

// Define the shape of the dictionary
type Translations = {
  [key: string]: {
    [lang: string]: string;
  };
};

// Simple hardcoded dictionary for demonstration
const dictionary: Translations = {
  'Profile': {
    'hi': 'प्रोफ़ाइल',
    'gom': 'प्रोफायल',
  },
  'Log out': {
    'hi': 'लॉग आउट',
    'gom': 'लॉग आउट',
  },
  'Dashboard': {
    'hi': 'डैशबोर्ड',
    'gom': 'डॅशबोर्ड',
  },
  'AI Suggestions': {
    'hi': 'एआई सुझाव',
    'gom': 'एआय सूचना',
  },
  'Marketplace': {
    'hi': 'बाज़ार',
    'gom': 'बाजारपेठ',
  },
  'My Fields': {
    'hi': 'मेरे खेत',
    'gom': ' म्हजीं शेतां',
  },
  'Reports': {
    'hi': 'रिपोर्ट्स',
    'gom': 'अहवाल',
  },
  'Messages': {
    'hi': ' संदेश',
    'gom': 'संदेश',
  },
  'Community': {
    'hi': 'समुदाय',
    'gom': 'समुदाय',
  },
  'Feedback & Help': {
    'hi': 'प्रतिक्रिया और सहायता',
    'gom': 'प्रतिक्रिया आनी मदत',
  },
  'Admin': {
    'hi': 'एडमिन',
    'gom': 'एडमिन',
  },
  'Yojanas & Schemes': {
    'hi': 'योजनाएं और स्कीमें',
    'gom': 'योजना आनी स्कीमां',
  },
  'PM Kisan Samman Nidhi': {
    'hi': 'पीएम किसान सम्मान निधि',
    'gom': 'पीएम किसान सम्मान निधी',
  },
  'e-NAM': {
    'hi': 'ई-नाम',
    'gom': 'ई-नाम',
  },
  'Soil Health Card': {
    'hi': 'मृदा स्वास्थ्य कार्ड',
    'gom': 'मृदा आरोग्य कार्ड',
  },
  'Pradhan Mantri Fasal Bima Yojana': {
    'hi': 'प्रधानमंत्री फसल बीमा योजना',
    'gom': 'प्रधानमंत्री फसल विमा योजना',
  },
  'Kisan Suvidha': {
    'hi': 'किसान सुविधा',
    'gom': 'शेतकार सुविधा',
  },
  'Hello': {
    'hi': 'नमस्ते',
    'gom': 'नमस्कार',
  },
  'Welcome to Harvesta': {
    'hi': 'हार्वेस्टा में आपका स्वागत है',
    'gom': 'हार्वेस्टांत तुमकां येवकार',
  },
  "Here's a summary of your farm's performance.": {
    'hi': 'यहां आपके खेत के प्रदर्शन का सारांश है।',
    'gom': 'तुमच्या शेताच्या कामगिरीचो सारांश हांगा दिला।',
  },
  'Add Produce': {
    'hi': 'उत्पाद जोड़ें',
    'gom': 'उत्पादन घाल',
  },
  'Fields Overview': {
    'hi': 'खेतों का अवलोकन',
    'gom': 'शेतांचो आढावो',
  },
  'Overall health is positive': {
    'hi': 'समग्र स्वास्थ्य सकारात्मक है',
    'gom': 'एकूण भलायकी बरी आसा',
  },
  'Total Expenses': {
    'hi': 'कुल खर्च',
    'gom': 'एकूण खर्च',
  },
  'This month so far': {
    'hi': 'इस महीने अब तक',
    'gom': ' ह्या म्हयन्यांत आतां मेरेन',
  },
  'Ask the AI Assistant': {
    'hi': 'एआई सहायक سے پوچھیں',
    'gom': 'एआय सहायकाक विचार',
  },
  'Field Progress': {
    'hi': 'खेत की प्रगति',
    'gom': 'शेताची प्रगति',
  },
  'Completion': {
    'hi': 'समापन',
    'gom': 'पूर्णताय',
  },
  'Next Up': {
    'hi': 'अगला',
    'gom': 'फुडें',
  },
  'Live Market Prices': {
    'hi': 'लाइव बाजार मूल्य',
    'gom': 'लायव्ह बाजाराचे दर',
  },
  'Real-time commodity prices from various markets across India.': {
    'hi': 'पूरे भारत के विभिन्न बाजारों से वास्तविक समय में कमोडिटी की कीमतें।',
    'gom': 'भारतभरातल्या वेगवेगळ्या बाजारांतल्या वस्तूंचे实时 दर।',
  },
  'Search by commodity, market...': {
    'hi': 'वस्तु, बाजार द्वारा खोजें...',
    'gom': 'वस्तू, बाजारपेठ प्रमाणें सोद...',
  },
  'Filter by State': {
    'hi': 'राज्य द्वारा फ़िल्टर करें',
    'gom': 'राज्या प्रमाणें ফিল্টার कर',
  },
  'All States': {
    'hi': 'सभी राज्य',
    'gom': 'सगळीं राज्यां',
  },
  'Sort by': {
    'hi': 'इसके अनुसार क्रमबद्ध करें',
    'gom': ' sırala',
  },
  'Commodity (A-Z)': {
    'hi': 'वस्तु (A-Z)',
    'gom': 'वस्तू (A-Z)',
  },
  'Commodity (Z-A)': {
    'hi': 'वस्तु (Z-A)',
    'gom': 'वस्तू (Z-A)',
  },
  'Price (Low-High)': {
    'hi': 'मूल्य (कम-ज़्यादा)',
    'gom': 'मोल (उण्यांतल्यान चड)',
  },
  'Price (High-Low)': {
    'hi': 'मूल्य (ज़्यादा-कम)',
    'gom': 'मोल (चडांतल्यान उणें)',
  },
  'Commodity': {
    'hi': 'वस्तु',
    'gom': 'वस्तू',
  },
  'Market': {
    'hi': 'बाजार',
    'gom': 'बाजारपेठ',
  },
  'Price (Modal/Kg)': {
    'hi': 'मूल्य (मोडल/किग्रा)',
    'gom': 'मोल (मोडल/किलो)',
  },
  'Arrival Date': {
    'hi': 'आगमन तिथि',
    'gom': 'येवपाची तारीख',
  },
  'No results found for your query.': {
    'hi': 'आपकी क्वेरी के लिए कोई परिणाम नहीं मिला।',
    'gom': 'तुमच्या सोदाक निकाल मेळूंक ना।',
  },
  'Show Less': {
    'hi': 'कम दिखाएं',
    'gom': ' कमी दाखय',
  },
  'Show More': {
    'hi': 'और दिखाओ',
    'gom': 'आनीक दाखय',
  },
  'Voices from the Field': {
    'hi': 'खेत से आवाजें',
    'gom': 'शेतांतल्यान आवाज',
  },
  'Hear what our community of farmers has to say.': {
    'hi': 'सुनें कि हमारे किसान समुदाय का क्या कहना है।',
    'gom': 'आमच्या शेतकार समुदायाक कितें म्हणचें आसा तें आयka।',
  },
  'Crop Growth Monitor': {
    'hi': 'फसल वृद्धि मॉनिटर',
    'gom': 'पीक वाड मॉनिटर',
  },
  "Weekly progress for {field}.": {
    'hi': '{field} के लिए साप्ताहिक प्रगति।',
    'gom': '{field} खातीर सातोळ्याची प्रगति।',
  },
  'Weekly progress of key growth metrics.': {
    'hi': 'प्रमुख विकास मेट्रिक्स की साप्ताहिक प्रगति।',
    'gom': ' म्हत्वाच्या वाडीच्या मेट्रिक्सची सातोळ्याची प्रगति।',
  },
  'No growth data available for your fields yet. Add some data to see your chart!': {
    'hi': 'आपके खेतों के लिए अभी तक कोई विकास डेटा उपलब्ध नहीं है। अपना चार्ट देखने के لیے کچھ ডেটা شامل کریں!',
    'gom': 'तुमच्या शेतां खातीर अजून मेरेन वाडीचो डेटा उपलब्ध ना. तुमचो चार्ट पळोवपाक कांय डेटा घाल!',
  },
};

interface TranslationContextType {
  language: string;
  setLanguage: (language: string) => void;
  t: (key: string, params?: { [key: string]: string | number }) => string;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState('en');

  const t = useCallback((key: string, params?: { [key: string]: string | number }): string => {
    let translation = key;
    if (language !== 'en' && dictionary[key] && dictionary[key][language]) {
      translation = dictionary[key][language];
    }
    
    if (params) {
        Object.keys(params).forEach(paramKey => {
            const regex = new RegExp(`{${paramKey}}`, 'g');
            translation = translation.replace(regex, String(params[paramKey]));
        });
    }

    return translation;
  }, [language]);

  const value = {
    language,
    setLanguage,
    t,
  };

  return (
    <TranslationContext.Provider value={value}>
      {children}
    </TranslationContext.Provider>
  );
}

export function useTranslation(): TranslationContextType {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
}
