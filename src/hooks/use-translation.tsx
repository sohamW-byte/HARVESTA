
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
    // General UI
    'Profile': { 'hi': 'प्रोफ़ाइल', 'gom': 'प्रोफायल' },
    'Log out': { 'hi': 'लॉग आउट', 'gom': 'लॉग आउट' },
    'Dashboard': { 'hi': 'डैशबोर्ड', 'gom': 'डॅशबोर्ड' },
    'Marketplace': { 'hi': 'बाज़ार', 'gom': 'बाजारपेठ' },
    'Messages': { 'hi': ' संदेश', 'gom': 'संदेश' },
    'Community': { 'hi': 'समुदाय', 'gom': 'समुदाय' },
    'Feedback & Help': { 'hi': 'प्रतिक्रिया और सहायता', 'gom': 'प्रतिक्रिया आनी मदत' },
    'Admin': { 'hi': 'एडमिन', 'gom': 'एडमिन' },
    'Post': { 'hi': 'पोस्ट', 'gom': 'पोस्ट' },
    'Likes': { 'hi': 'पसंद', 'gom': 'लाईक्स' },
    'Comments': { 'hi': 'टिप्पणियाँ', 'gom': 'टिप्पणी' },
    'Farmer': { 'hi': 'किसान', 'gom': 'शेतकार' },
    'Buyer': { 'hi': 'खरीदार', 'gom': 'खरेदीदार' },
    'Just now': { 'hi': 'अभी-अभी', 'gom': 'आतां' },
    '2h ago': { 'hi': '2 घंटे पहले', 'gom': '2 वरां आदीं' },
    '5h ago': { 'hi': '5 घंटे पहले', 'gom': '5 वरां आदीं' },
    '1d ago': { 'hi': '1 दिन पहले', 'gom': '1 दीस आदीं' },
    '3d ago': { 'hi': '3 दिन पहले', 'gom': '3 दीस आदीं' },

    // Dashboard Page
    'Hello': { 'hi': 'नमस्ते', 'gom': 'नमस्कार' },
    'Welcome to Harvesta': { 'hi': 'हार्वेस्टा में आपका स्वागत है', 'gom': 'हार्वेस्टांत तुमकां येवकार' },
    "Here's a summary of your farm's performance.": { 'hi': 'यहां आपके खेत के प्रदर्शन का सारांश है।', 'gom': 'तुमच्या शेताच्या कामगिरीचो सारांश हांगा दिला।' },
    'Add Produce': { 'hi': 'उत्पाद जोड़ें', 'gom': 'उत्पादन घाल' },
    'Fields Overview': { 'hi': 'खेतों का अवलोकन', 'gom': 'शेतांचो आढावो' },
    'Good': { 'hi': 'अच्छा', 'gom': 'बरें' },
    'Overall health is positive': { 'hi': 'समग्र स्वास्थ्य सकारात्मक है', 'gom': 'एकूण भलायकी बरी आसा' },
    'Total Expenses': { 'hi': 'कुल खर्च', 'gom': 'एकूण खर्च' },
    'This month so far': { 'hi': 'इस महीने अब तक', 'gom': ' ह्या म्हयन्यांत आतां मेरेन' },
    'Ask the AI Assistant': { 'hi': 'एआई सहायक से पूछें', 'gom': 'एआय सहायकाक विचार' },
    'Field Progress': { 'hi': 'खेत की प्रगति', 'gom': 'शेताची प्रगति' },
    'Completion': { 'hi': 'समापन', 'gom': 'पूर्णताय' },
    'Next Up': { 'hi': 'अगला', 'gom': 'फुडें' },
    'Harvest Wheat': { 'hi': 'गेहूं की कटाई', 'gom': 'गंव काडप' },
    'Due': { 'hi': 'देय', 'gom': 'देय' },
    'in 3 days': { 'hi': '3 दिनों में', 'gom': '3 दिसांनी' },
    'Live Market Prices': { 'hi': 'लाइव बाजार मूल्य', 'gom': 'लायव्ह बाजाराचे दर' },
    'Real-time commodity prices from various markets across India.': { 'hi': 'पूरे भारत के विभिन्न बाजारों से वास्तविक समय में कमोडिटी की कीमतें।', 'gom': 'भारतभरातल्या वेगवेगळ्या बाजारांतल्या वस्तूंचे实时 दर।' },
    'Search by commodity, market...': { 'hi': 'वस्तु, बाजार द्वारा खोजें...', 'gom': 'वस्तू, बाजारपेठ प्रमाणें सोद...' },
    'Filter by State': { 'hi': 'राज्य द्वारा फ़िल्टर करें', 'gom': 'राज्या प्रमाणें ফিল্টার कर' },
    'All States': { 'hi': 'सभी राज्य', 'gom': 'सगळीं राज्यां' },
    'Sort by': { 'hi': 'इसके अनुसार क्रमबद्ध करें', 'gom': ' sırala' },
    'Commodity (A-Z)': { 'hi': 'वस्तु (A-Z)', 'gom': 'वस्तू (A-Z)' },
    'Commodity (Z-A)': { 'hi': 'वस्तु (Z-A)', 'gom': 'वस्तू (Z-A)' },
    'Price (Low-High)': { 'hi': 'मूल्य (कम-ज़्यादा)', 'gom': 'मोल (उण्यांतल्यान चड)' },
    'Price (High-Low)': { 'hi': 'मूल्य (ज़्यादा-कम)', 'gom': 'मोल (चडांतल्यान उणें)' },
    'Commodity': { 'hi': 'वस्तु', 'gom': 'वस्तू' },
    'Market': { 'hi': 'बाजार', 'gom': 'बाजारपेठ' },
    'Price (Modal/Kg)': { 'hi': 'मूल्य (मोडल/किग्रा)', 'gom': 'मोल (मोडल/किलो)' },
    'Arrival Date': { 'hi': 'आगमन तिथि', 'gom': 'येवपाची तारीख' },
    'No results found for your query.': { 'hi': 'आपकी क्वेरी के लिए कोई परिणाम नहीं मिला।', 'gom': 'तुमच्या सोदाक निकाल मेळूंक ना।' },
    'Show Less': { 'hi': 'कम दिखाएं', 'gom': ' कमी दाखय' },
    'Show More': { 'hi': 'और दिखाओ', 'gom': 'आनीक दाखय' },
    'Voices from the Field': { 'hi': 'खेत से आवाजें', 'gom': 'शेतांतल्यान आवाज' },
    'Hear what our community of farmers has to say.': { 'hi': 'सुनें कि हमारे किसान समुदाय का क्या कहना है।', 'gom': 'आमच्या शेतकार समुदायाक कितें म्हणचें आसा तें आयका।' },
    "Harvesta's marketplace connected me directly with buyers in Mumbai. I got 20% better prices for my wheat this season!": { 'hi': 'हार्वेस्टा के बाज़ार ने मुझे सीधे मुंबई के खरीदारों से जोड़ा। मुझे इस सीजन में अपने गेहूं के लिए 20% बेहतर दाम मिले!', 'gom': 'हार्वेस्टाच्या बाजारपेठेन म्हाका मुंबयच्या खरेदीदारांकडेन थेट जोडलो. ह्या हंगामांत म्हज्या गव्हाक 20% चड मोलाचें मोल मेळ्ळें!' },
    "The AI suggestions for crop rotation were a game-changer. My soil health has improved, and I'm seeing better yields for my sugarcane.": { 'hi': 'फसल चक्र के लिए एआई के सुझाव एक गेम-चेंजर थे। मेरी मिट्टी का स्वास्थ्य सुधरा है, और मुझे अपने गन्ने की बेहतर पैदावार दिख रही है।', 'gom': 'पीक फिरोवपा खातीर एआयच्या सूचनांनी खेळ बदलून उडयलो. म्हज्या जमनीची भलायकी सुदारल्या, आनी म्हज्या ऊसाक चड उत्पन्न मेळटा।' },
    "Finally, a platform that understands farmers. The live price board helped me decide the best time to sell my coffee beans.": { 'hi': 'अंत में, एक ऐसा मंच जो किसानों को समझता है। लाइव प्राइस बोर्ड ने मुझे यह तय करने में मदद की कि मेरी कॉफी बीन्स बेचने का सबसे अच्छा समय कब है।', 'gom': 'निमाणें, शेतकारांक समजून घेवपी एक मंच. लायव्ह प्राइज बोर्डान म्हाका म्हजें कॉफीचें बीं विकपाचो सगळ्यांत बरो वेळ थारावपाक मदत केली.' },
    'Crop Growth Monitor': { 'hi': 'फसल वृद्धि मॉनिटर', 'gom': 'पीक वाड मॉनिटर' },
    "Weekly progress for {field}.": { 'hi': '{field} के लिए साप्ताहिक प्रगति।', 'gom': '{field} खातीर सातोळ्याची प्रगति।' },
    'Weekly progress of key growth metrics.': { 'hi': 'प्रमुख विकास मेट्रिक्स की साप्ताहिक प्रगति।', 'gom': ' म्हत्वाच्या वाडीच्या मेट्रिक्सची सातोळ्याची प्रगति।' },
    'No growth data available for your fields yet. Add some data to see your chart!': { 'hi': 'आपके खेतों के लिए अभी तक कोई विकास डेटा उपलब्ध नहीं है। अपना चार्ट देखने के लिए कुछ डेटा जोड़ें!', 'gom': 'तुमच्या शेतां खातीर अजून मेरेन वाडीचो डेटा उपलब्ध ना. तुमचो चार्ट पळोवपाक कांय डेटा घाल!' },

    // Sidebar
    'AI Suggestions': { 'hi': 'एआई सुझाव', 'gom': 'एआय सूचना' },
    'My Fields': { 'hi': 'मेरे खेत', 'gom': ' म्हजीं शेतां' },
    'Reports': { 'hi': 'रिपोर्ट्स', 'gom': 'अहवाल' },
    'Yojanas & Schemes': { 'hi': 'योजनाएं और स्कीमें', 'gom': 'योजना आनी स्कीमां' },
    'PM Kisan Samman Nidhi': { 'hi': 'पीएम किसान सम्मान निधि', 'gom': 'पीएम किसान सम्मान निधी' },
    'e-NAM': { 'hi': 'ई-नाम', 'gom': 'ई-नाम' },
    'Soil Health Card': { 'hi': 'मृदा स्वास्थ्य कार्ड', 'gom': 'मृदा आरोग्य कार्ड' },
    'Pradhan Mantri Fasal Bima Yojana': { 'hi': 'प्रधानमंत्री फसल बीमा योजना', 'gom': 'प्रधानमंत्री फसल विमा योजना' },
    'Kisan Suvidha': { 'hi': 'किसान सुविधा', 'gom': 'शेतकार सुविधा' },

    // Marketplace page
    'Buy and sell produce directly with verified partners.': { 'hi': 'सत्यापित भागीदारों के साथ सीधे उत्पाद खरीदें और बेचें।', 'gom': 'सत्यापित भागीदारांकडेन थेट उत्पादन विकतें घेयात आनी विकचें.' },
    'For Sale': { 'hi': 'बिक्री के लिए', 'gom': 'विकपा खातीर' },
    'Wanted': { 'hi': 'चाहिए', 'gom': 'जाय' },
    'Sold by': { 'hi': 'द्वारा बेचा गया', 'gom': 'विकपी' },
    'Wanted by': { 'hi': 'द्वारा चाहा गया', 'gom': 'जाय आशिल्लो' },
    'Quantity': { 'hi': 'मात्रा', 'gom': 'प्रमाण' },
    'Price': { 'hi': 'कीमत', 'gom': 'मोल' },
    'Location': { 'hi': 'स्थान', 'gom': 'जागो' },
    'Contact Seller': { 'hi': 'विक्रेता से संपर्क करें', 'gom': 'विकप्या कडेन संपर्क करचो' },
    'Contact Buyer': { 'hi': 'खरीदार से संपर्क करें', 'gom': 'खरेदीदारा कडेन संपर्क करचो' },
    // Marketplace items
    "Sona Masoori Rice": { "hi": "सोना मसूरी चावल", "gom": "सोना मसूरी तांदूळ" },
    "Nagpur Oranges": { "hi": "नागपुर संतरे", "gom": "नागपूर संत्री" },
    "Organic Turmeric": { "hi": "जैविक हल्दी", "gom": "सेंद्रिय हळद" },
    "Alphonso Mangoes": { "hi": "अल्फांसो आम", "gom": "हापूस आंबे" },
    "Shimla Apples": { "hi": "शिमला सेब", "gom": "शिमला सफरचंद" },
    "Darjeeling Tea": { "hi": "दार्जिलिंग चाय", "gom": "दार्जिलिंग च्या" },
    "Ramesh Kumar": { "hi": "रमेश कुमार", "gom": "रमेश कुमार" },
    "Sunita Deshpande": { "hi": "सुनीता देशपांडे", "gom": "सुनीता देशपांडे" },
    "Vijay Farms": { "hi": "विजय फार्म्स", "gom": "विजय फार्म्स" },
    "Konkan Orchards": { "hi": "कोंकण ऑर्चर्ड्स", "gom": "कोंकण ऑर्चर्ड्स" },
    "Himalayan Fresh": { "hi": "हिमालयन फ्रेश", "gom": "हिमालयन फ्रेश" },
    "Glenburn Tea Estate": { "hi": "ग्लेनबर्न टी एस्टेट", "gom": "ग्लेनबर्न टी इस्टेट" },
    "Nalgonda, TS": { "hi": "नलगोंडा, टीएस", "gom": "नलगोंडा, टीएस" },
    "Nagpur, MH": { "hi": "नागपुर, एमएच", "gom": "नागपूर, एमएच" },
    "Erode, TN": { "hi": "इरोड, टीएन", "gom": "इरोड, टीएन" },
    "Ratnagiri, MH": { "hi": "रत्नागिरी, एमएच", "gom": "रत्नागिरी, एमएच" },
    "Shimla, HP": { "hi": "शिमला, एचपी", "gom": "शिमला, एचपी" },
    "Darjeeling, WB": { "hi": "दार्जिलिंग, डब्ल्यूबी", "gom": "दार्जिलिंग, डब्ल्यूबी" },
    
    // Community Page
    'Community Forum': { 'hi': 'सामुदायिक मंच', 'gom': 'समुदाय मंच' },
    'Connect, discuss, and trade with the Harvesta community.': { 'hi': 'हार्वेस्टा समुदाय के साथ जुड़ें, चर्चा करें और व्यापार करें।', 'gom': 'हार्वेस्टा समुदाया वांगडा जोडचें, चर्चा करची आनी वेपार करचो.' },
    'Share an update or ask a question...': { 'hi': 'एक अपडेट साझा करें या एक प्रश्न पूछें...', 'gom': 'एक अपडेट वांटून घेयात वा एक प्रस्न विचारचो...' },
    "Looking for 2 quintals of high-quality Basmati rice. Please contact me if you have stock available near Delhi. Good price offered.": { 'hi': '2 क्विंटल उच्च गुणवत्ता वाले बासमती चावल की तलाश है। यदि आपके पास दिल्ली के पास स्टॉक उपलब्ध है तो कृपया मुझसे संपर्क करें। अच्छी कीमत की पेशकश की।', 'gom': '2 क्विंटल उच्च प्रतीचो बासमती तांदूळ सोदतां. दिल्ली लागीं स्टॉक उपलब्ध आसल्यार कृपया संपर्क करचो. बरो दर दिवचो.' },
    "The price for tomatoes in the Hyderabad market seems to be dropping. Anyone else seeing this?": { 'hi': 'हैदराबाद के बाजार में टमाटर की कीमत गिरती दिख रही है। क्या कोई और भी यह देख रहा है?', 'gom': 'हैदराबाद बाजारांत टोमॅटोचो दर देंवता अशें दिसता. आनीक कोणाक हें दिसता?' },
    "Has anyone tried the new organic fertilizer from AgriCorp? Thinking of using it for my next soybean crop in Indore. Reviews welcome!": { 'hi': 'क्या किसी ने एग्रीकॉर्प से नया जैविक उर्वरक आजमाया है? इसे इंदौर में मेरी अगली सोयाबीन की फसल के लिए इस्तेमाल करने की सोच रहा हूं। समीक्षाओं का स्वागत है!', 'gom': 'एग्रीकॉर्पचें नवें सेंद्रिय सारें कोणें वापरलां? इंदौर हांगा म्हज्या फुडल्या सोयाबीन पिका खातीर तें वापरपाचो विचार करतां. पुनरावलोकनांक येवकार!' },
    "Just finished a successful harvest of Alphonso mangoes. Thanks to the community for the tips on pest control!": { 'hi': 'अभी-अभी अल्फांसो आम की सफल फसल पूरी की है। कीट नियंत्रण पर सुझावों के लिए समुदाय का धन्यवाद!', 'gom': 'आत्ताच हापूस आंब्यांची यशस्वी कापणी केली. किड नियंत्रणाचेर उपाय सुचयल्ल्या खातीर समुदायाक धन्यवाद!' },
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
    if (typeof key !== 'string') {
        return key;
    }
    
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
