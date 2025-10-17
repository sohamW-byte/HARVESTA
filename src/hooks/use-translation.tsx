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
    'Orders': { 'hi': 'आदेश', 'gom': 'आदेश' },
    'Pricing': { 'hi': 'मूल्य निर्धारण', 'gom': 'दर' },
    'Messages': { 'hi': ' संदेश', 'gom': 'संदेश' },
    'Community': { 'hi': 'समुदाय', 'gom': 'समुदाय' },
    'Feedback & Help': { 'hi': 'प्रतिक्रिया और सहायता', 'gom': 'प्रतिक्रिया आनी मदत' },
    'Admin': { 'hi': 'एडमिन', 'gom': 'एडमिन' },
    'Post': { 'hi': 'पोस्ट', 'gom': 'पोस्ट' },
    'Likes': { 'hi': 'पसंद', 'gom': 'लाईक्स' },
    'Comments': { 'hi': 'टिप्पणियाँ', 'gom': 'टिप्पणी' },
    'Farmer': { 'hi': 'किसान', 'gom': 'शेतकार' },
    'Buyer': { 'hi': 'खरीदार', 'gom': 'खरेदीदार' },
    'User': { 'hi': 'उपयोगकर्ता', 'gom': 'वापरपी' },
    'Just now': { 'hi': 'अभी-अभी', 'gom': 'आतां' },
    '2h ago': { 'hi': '2 घंटे पहले', 'gom': '2 वरां आदीं' },
    '5h ago': { 'hi': '5 घंटे पहले', 'gom': '5 वरां आदीं' },
    '1d ago': { 'hi': '1 दिन पहले', 'gom': '1 दीस आदीं' },
    '3d ago': { 'hi': '3 दिन पहले', 'gom': '3 दीस आदीं' },
    'all': { 'hi': 'सभी', 'gom': 'सगळें' },

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
    'of tasks complete': { 'hi': 'कार्य पूर्ण', 'gom': 'कामां पूर्ण' },
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
    'Buy Now': { 'hi': 'अभी खरीदें', 'gom': 'आतां विकतें घे' },
    'View Details': { 'hi': 'विवरण देखें', 'gom': 'विवरण पळय' },
    
    // Data Translations
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
    "Anjali Traders": { "hi": "अंजलि ट्रेडर्स", "gom": "अंजली ट्रेडर्स" },
    "Spice India Exports": { "hi": "स्पाइस इंडिया एक्सपोर्ट्स", "gom": "स्पाइस इंडिया एक्सपोर्ट्स" },
    "Fresh Fruits Co.": { "hi": "फ्रेश फ्रूट्स कंपनी", "gom": "फ्रेश फ्रूट्स कंपनी" },
    "Goa Farms": { "hi": "गोवा फार्म्स", "gom": "गोंय फार्म्स" },
    "Nalgonda, TS": { "hi": "नलगोंडा, टीएस", "gom": "नलगोंडा, टीएस" },
    "Nagpur, MH": { "hi": "नागपुर, एमएच", "gom": "नागपूर, एमएच" },
    "Erode, TN": { "hi": "इरोड, टीएन", "gom": "इरोड, टीएन" },
    "Ratnagiri, MH": { "hi": "रत्नागिरी, एमएच", "gom": "रत्नागिरी, एमएच" },
    "Shimla, HP": { "hi": "शिमला, एचपी", "gom": "शिमला, एचपी" },
    "Darjeeling, WB": { "hi": "दार्जिलिंग, डब्ल्यूबी", "gom": "दार्जिलिंग, डब्ल्यूबी" },
    "10 quintal": { "hi": "10 क्विंटल", "gom": "10 क्विंटल" },
    "50 kg": { "hi": "50 किलो", "gom": "50 किलो" },
    "5 quintal": { "hi": "5 क्विंटल", "gom": "5 क्विंटल" },
    "10 dozen": { "hi": "10 दर्जन", "gom": "10 डझन" },
    "20 boxes": { "hi": "20 बक्से", "gom": "20 पेटयो" },
    "100 kg": { "hi": "100 किलो", "gom": "100 किलो" },
    "₹2,800/qtl": { "hi": "₹2,800/क्विंटल", "gom": "₹2,800/क्विंटल" },
    "₹40/kg": { "hi": "₹40/किलो", "gom": "₹40/किलो" },
    "₹8,000/qtl": { "hi": "₹8,000/क्विंटल", "gom": "₹8,000/क्विंटल" },
    "₹1,200/dozen": { "hi": "₹1,200/दर्जन", "gom": "₹1,200/डझन" },
    "₹1,500/box": { "hi": "₹1,500/बॉक्स", "gom": "₹1,500/पेट" },
    "₹2,500/kg": { "hi": "₹2,500/किलो", "gom": "₹2,500/किलो" },
    "Up to ₹8,000/qtl": { "hi": "₹8,000/क्विंटल तक", "gom": "₹8,000/क्विंटल मेरेन" },
    "Fresh Cashews": { "hi": "ताजा काजू", "gom": "ताजे काजू" },
    "1 tonne": { "hi": "1 टन", "gom": "1 टन" },
    "Up to ₹70,000/qtl": { "hi": "₹70,000/क्विंटल तक", "gom": "₹70,000/क्विंटल मेरेन" },
    "Konkan Dry Fruits": { "hi": "कोंकण ड्राई फ्रूट्स", "gom": "कोंकण ड्राय फ्रूट्स" },
    "Panaji, Goa": { "hi": "पणजी, गोवा", "gom": "पणजी, गोंय" },
    "Long-staple Cotton": { "hi": "लंबा-रेशा कपास", "gom": "लांब धाग्यांचो कापूस" },
    "50 tonne": { "hi": "50 टन", "gom": "50 टन" },
    "Market Rate": { "hi": "बाजार दर", "gom": "बाजार दर" },
    "National Textiles": { "hi": "नेशनल टेक्सटाइल्स", "gom": "नॅशनल टेक्सटायल्स" },
    "Coimbatore, TN": { "hi": "कोयंबटूर, टीएन", "gom": "कोयंबतूर, टीएन" },
    "Malka Masur Dal": { "hi": "मलका मसूर दाल", "gom": "मलका मसूर दाळ" },
    "Up to ₹6,500/qtl": { "hi": "₹6,500/क्विंटल तक", "gom": "₹6,500/क्विंटल मेरेन" },
    "Delhi Grain Traders": { "hi": "दिल्ली ग्रेन ट्रेडर्स", "gom": "दिल्ली ग्रेन ट्रेडर्स" },
    "New Delhi, DL": { "hi": "नई दिल्ली, डीएल", "gom": "नवी दिल्ली, डीएल" },
    "Soybeans": { "hi": "सोयाबीन", "gom": "सोयाबीन" },
    "100 tonne": { "hi": "100 टन", "gom": "100 टन" },
    "Agro Processors Inc.": { "hi": "एग्रो प्रोसेसर्स इंक.", "gom": "एग्रो प्रोसेसर्स इंक." },
    "Indore, MP": { "hi": "इंदौर, एमपी", "gom": "इंदौर, एमपी" },
    "Cardamom": { "hi": "इलायची", "gom": "वेलची" },
    "500 kg": { "hi": "500 किलो", "gom": "500 किलो" },
    "Up to ₹1,800/kg": { "hi": "₹1,800/किलो तक", "gom": "₹1,800/किलो मेरेन" },
    "Kerala Spice Co.": { "hi": "केरल स्पाइस कंपनी", "gom": "केरळ स्पाइस कंपनी" },
    "Idukki, KL": { "hi": "इडुक्की, केएल", "gom": "इडुक्की, केएल" },

    // Pricing Page
    'Get Started': { 'hi': 'शुरू करें', 'gom': 'सुरु करचें' },
    'Upgrade to Pro': { 'hi': 'प्रो में अपग्रेड करें', 'gom': 'प्रो-क अपग्रेड करचें' },
    'Contact Sales': { 'hi': 'बिक्री से संपर्क करें', 'gom': 'विक्री कडेन संपर्क करचो' },
    'Starter Farmer': { 'hi': 'स्टार्टर किसान', 'gom': 'स्टार्टर शेतकार' },
    'Pro Farmer': { 'hi': 'प्रो किसान', 'gom': 'प्रो शेतकार' },
    'Business Buyer': { 'hi': 'बिजनेस खरीदार', 'gom': 'बिजनेस खरेदीदार' },
    'List up to 5 products': { 'hi': '5 उत्पादों तक सूचीबद्ध करें', 'gom': '5 उत्पाद मेरेन सूचीबद्ध करात' },
    'Basic market price access': { 'hi': 'बुनियादी बाजार मूल्य तक पहुंच', 'gom': 'मूल बाजार दरा मेरेन प्रवेश' },
    'Community forum access': { 'hi': 'सामुदायिक मंच तक पहुंच', 'gom': 'समुदाय मंचा मेरेन प्रवेश' },
    'Standard support': { 'hi': 'मानक समर्थन', 'gom': 'मानक आदार' },
    'Unlimited product listings': { 'hi': 'असीमित उत्पाद लिस्टिंग', 'gom': 'अमर्याद उत्पाद सूची' },
    'Advanced AI recommendations': { 'hi': 'उन्नत एआई सिफारिशें', 'gom': 'प्रगत एआय शिफारसी' },
    'Real-time price alerts': { 'hi': 'वास्तविक समय मूल्य अलर्ट', 'gom': 'वास्तविक वेळ दर अलर्ट' },
    '0% commission on first 5 orders': { 'hi': 'पहले 5 ऑर्डर पर 0% कमीशन', 'gom': 'पयल्या 5 ऑर्डरचेर 0% कमिशन' },
    'Priority support': { 'hi': 'प्राथमिकता समर्थन', 'gom': 'प्राधान्य आदार' },
    'Bulk order placement': { 'hi': 'थोक ऑर्डर प्लेसमेंट', 'gom': 'थोक ऑर्डर प्लेसमेंट' },
    'Access to verified sellers network': { 'hi': 'सत्यापित विक्रेताओं के नेटवर्क तक पहुंच', 'gom': 'सत्यापित विक्रेत्यांच्या नेटवर्क मेरेन प्रवेश' },
    'Advanced supply chain analytics': { 'hi': 'उन्नत आपूर्ति श्रृंखला विश्लेषिकी', 'gom': 'प्रगत पुरवण साखळी विश्लेषिकी' },
    'Dedicated account manager': { 'hi': 'समर्पित खाता प्रबंधक', 'gom': 'समर्पित खातें वेवस्थापक' },
    '24/7 premium support': { 'hi': '24/7 प्रीमियम समर्थन', 'gom': '24/7 प्रीमियम आदार' },
    
    // Community Page
    'Community Forum': { 'hi': 'सामुदायिक मंच', 'gom': 'समुदाय मंच' },
    'Connect, discuss, and trade with the Harvesta community.': { 'hi': 'हार्वेस्टा समुदाय के साथ जुड़ें, चर्चा करें और व्यापार करें।', 'gom': 'हार्वेस्टा समुदाया वांगडा जोडचें, चर्चा करची आनी वेपार करचो.' },
    'Share an update or ask a question...': { 'hi': 'एक अपडेट साझा करें या एक प्रश्न पूछें...', 'gom': 'एक अपडेट वांटून घेयात वा एक प्रस्न विचारचो...' },
    "Looking for 2 quintals of high-quality Basmati rice. Please contact me if you have stock available near Delhi. Good price offered.": { 'hi': '2 क्विंटल उच्च गुणवत्ता वाले बासमती चावल की तलाश है। यदि आपके पास दिल्ली के पास स्टॉक उपलब्ध है तो कृपया मुझसे संपर्क करें। अच्छी कीमत की पेशकश की।', 'gom': '2 क्विंटल उच्च प्रतीचो बासमती तांदूळ सोदतां. दिल्ली लागीं स्टॉक उपलब्ध आसल्यार कृपया संपर्क करचो. बरो दर दिवचो.' },
    "The price for tomatoes in the Hyderabad market seems to be dropping. Anyone else seeing this?": { 'hi': 'हैदराबाद के बाजार में टमाटर की कीमत गिरती दिख रही है। क्या कोई और भी यह देख रहा है?', 'gom': 'हैदराबाद बाजारांत टोमॅटोचो दर देंवता अशें दिसता. आनीक कोणाक हें दिसता?' },
    "Has anyone tried the new organic fertilizer from AgriCorp? Thinking of using it for my next soybean crop in Indore. Reviews welcome!": { 'hi': 'क्या किसी ने एग्रीकॉर्प से नया जैविक उर्वरक आजमाया है? इसे इंदौर में मेरी अगली सोयाबीन की फसल के लिए इस्तेमाल करने की सोच रहा हूं। समीक्षाओं का स्वागत है!', 'gom': 'एग्रीकॉर्पचें नवें सेंद्रिय सारें कोणें वापरलां? इंदौर हांगा म्हज्या फुडल्या सोयाबीन पिका खातीर तें वापरपाचो विचार करतां. पुनरावलोकनांक येवकार!' },
    "Just finished a successful harvest of Alphonso mangoes. Thanks to the community for the tips on pest control!": { 'hi': 'अभी-अभी अल्फांसो आम की सफल फसल पूरी की है। कीट नियंत्रण पर सुझावों के लिए समुदाय का धन्यवाद!', 'gom': 'आत्ताच हापूस आंब्यांची यशस्वी कापणी केली. किड नियंत्रणाचेर उपाय सुचयल्ल्या खातीर समुदायाक धन्यवाद!' },
    "Anjali Traders": { "hi": "अंजलि ट्रेडर्स", "gom": "अंजली ट्रेडर्स" },
    "Vijay Kumar": { "hi": "विजय कुमार", "gom": "विजय कुमार" },
    "Sunita Patil": { "hi": "सुनीता पाटिल", "gom": "सुनीता पाटील" },
    "Rajesh Farms": { "hi": "राजेश फार्म्स", "gom": "राजेश फार्म्स" },
    "Maharashtra": { "hi": "महाराष्ट्र", "gom": "महाराष्ट्र" },
    "Punjab": { "hi": "पंजाब", "gom": "पंजाब" },
    "Uttar Pradesh": { "hi": "उत्तर प्रदेश", "gom": "उत्तर प्रदेश" },
    "Andhra Pradesh": { "hi": "आंध्र प्रदेश", "gom": "आंध्र प्रदेश" },
    "West Bengal": { "hi": "पश्चिम बंगाल", "gom": "पश्चिम बंगाल" },
    "Gujarat": { "hi": "गुजरात", "gom": "गुजरात" },
    "Madhya Pradesh": { "hi": "मध्य प्रदेश", "gom": "मध्य प्रदेश" },
    "Karnataka": { "hi": "कर्नाटक", "gom": "कर्नाटक" },
    "Tamil Nadu": { "hi": "तमिलनाडु", "gom": "तामिळनाडू" },
    "Rajasthan": { "hi": "राजस्थान", "gom": "राजस्थान" },
    "Kerala": { "hi": "केरल", "gom": "केरळ" },
    "Assam": { "hi": "असम", "gom": "आसाम" },
    "Bihar": { "hi": "बिहार", "gom": "बिहार" },
    "Haryana": { "hi": "हरियाणा", "gom": "हरियाणा" },
    "Onion": { "hi": "प्याज", "gom": "कांदो" },
    "Wheat": { "hi": "गेहूँ", "gom": "गंव" },
    "Potato": { "hi": "आलू", "gom": "बटाटो" },
    "Red Chilli": { "hi": "लाल मिर्च", "gom": "तांबडी मिरची" },
    "Rice": { "hi": "चावल", "gom": "तांदूळ" },
    "Cotton": { "hi": "कपास", "gom": "कापूस" },
    "Tomato": { "hi": "टमाटर", "gom": "टोमॅटो" },
    "Turmeric": { "hi": "हल्दी", "gom": "हळद" },
    "Mustard": { "hi": "सरसों", "gom": "सरसों" },
    "Mango": { "hi": "आम", "gom": "आंबो" },
    "Black Pepper": { "hi": "काली मिर्च", "gom": "काळी मिरी" },
    "Ginger": { "hi": "अदरक", "gom": "आलें" },
    "Lentil (Masur)": { "hi": "मसूर", "gom": "मसूर" },
    "Paddy (Basmati)": { "hi": "धान (बासमती)", "gom": "शेत (बासमती)" },
    "Nashik": { "hi": "नाशिक", "gom": "नाशिक" },
    "Ludhiana": { "hi": "लुधियाना", "gom": "लुधियाना" },
    "Lucknow": { "hi": "लखनऊ", "gom": "लखनऊ" },
    "Guntur": { "hi": "गुंटूर", "gom": "गुंटूर" },
    "Kolkata": { "hi": "कोलकाता", "gom": "कोलकाता" },
    "Rajkot": { "hi": "राजकोट", "gom": "राजकोट" },
    "Indore": { "hi": "इंदौर", "gom": "इंदौर" },
    "Bengaluru": { "hi": "बेंगलुरु", "gom": "बेंगळूरू" },
    "Erode": { "hi": "इरोड", "gom": "इरोड" },
    "Jaipur (F&V)": { "hi": "जयपुर (एफ एंड वी)", "gom": "जयपूर (एफ एंड वी)" },
    "Ratnagiri": { "hi": "रत्नागिरी", "gom": "रत्नागिरी" },
    "Idukki": { "hi": "इडुक्की", "gom": "इडुक्की" },
    "Guwahati": { "hi": "गुवाहाटी", "gom": "गुवाहाटी" },
    "Patna": { "hi": "पटना", "gom": "पटना" },
    "Karnal": { "hi": "करनाल", "gom": "करनाल" },
    "Khanna": { "hi": "खन्ना", "gom": "खन्ना" },
    "Sealdah": { "hi": "सियालदह", "gom": "सियालदह" },
    "Gondal": { "hi": "गोंडल", "gom": "गोंडल" },
    "Nedumkandam": { "hi": "नेदुमकंडम", "gom": "नेदुमकंडम" },
    "Pamohi": { "hi": "पमोही", "gom": "पमोही" },
    "Meethapur": { "hi": "मीठापुर", "gom": "मीठापूर" },
    "Ramesh Patel": {"hi": "रमेश पटेल", "gom": "रमेश पटेल"},
    "Priya Rao": {"hi": "प्रिया राव", "gom": "प्रिया राव"},
    "Anand Kumar": {"hi": "आनंद कुमार", "gom": "आनंद कुमार"},
    "Punjab, India": {"hi": "पंजाब, भारत", "gom": "पंजाब, भारत"},
    "Maharashtra, India": {"hi": "महाराष्ट्र, भारत", "gom": "महाराष्ट्र, भारत"},
    "Karnataka, India": {"hi": "कर्नाटक, भारत", "gom": "कर्नाटक, भारत"},

    // Testimonials Card
    "produce-rice": {"hi": "चावल के दाने", "gom": "तांदळाचे दाणे"},
    "produce-oranges": {"hi": "ताजे संतरे", "gom": "ताजी संत्री"},
    "produce-wheat": {"hi": "गेहूं का खेत", "gom": "गव्हाचें शेत"},
    "produce-onions": {"hi": "लाल प्याज", "gom": "तांबडे कांदे"},
    "produce-mangoes": {"hi": "पके आम", "gom": "पिकिल्ले आंबे"},
    "produce-tea": {"hi": "चाय की पत्तियां", "gom": "च्याचीं पानां"},
    "produce-apples": {"hi": "लाल सेब", "gom": "तांबडे सफरचंद"},
    "produce-soybean": {"hi": "सोयाबीन का खेत", "gom": "सोयाबीन शेत"},
    "produce-cardamom": {"hi": "हरी इलायची", "gom": "हळवी वेलची"},
    "A beautiful illustration of a farm landscape.": {"hi": "एक खेत के परिदृश्य का एक सुंदर चित्रण।", "gom": "एका शेताच्या सुंदर देखाव्याचें चित्रण."},
    "A satellite view of a farm field.": {"hi": "एक खेत के मैदान का उपग्रह दृश्य।", "gom": "एका शेताच्या मैदानाचो उपग्रह दृश्य."},
    "Avatar for a sample user.": {"hi": "एक नमूना उपयोगकर्ता के लिए अवतार।", "gom": "एका नमुन्या वापरप्या खातीर अवतार."},
    "Avatar for another sample user.": {"hi": "एक और नमूना उपयोगकर्ता के लिए अवतार।", "gom": "दुसऱ्या नमुन्या वापरप्या खातीर अवतार."},
    "Avatar for a third sample user.": {"hi": "तीसरे नमूना उपयोगकर्ता के लिए अवतार।", "gom": "तिसऱ्या नмуन्या वापरप्या खातीर अवतार."},
    "Sona Masoori Rice": {"hi": "सोना मसूरी चावल", "gom": "सोना मसूरी तांदूळ"},
    "Nagpur Oranges": {"hi": "नागपुर संतरे", "gom": "नागपूर संत्री"},
    "Ears of golden wheat.": {"hi": "सुनहरे गेहूं की बालियां।", "gom": "भांगराळ्या गव्हाच्यो कणयो."},
    "Bangalore Rose Onions": {"hi": "बैंगलोर रोज़ प्याज", "gom": "बंगळूर रोझ कांदे"},
    "Alphonso Mangoes": {"hi": "अल्फांसो आम", "gom": "हापूस आंबे"},
    "Darjeeling Tea": {"hi": "दार्जिलिंग चाय", "gom": "दार्जिलिंग च्या"},
    "Shimla Apples": {"hi": "शिमला सेब", "gom": "शिमला सफरचंद"},
    "Soybeans": {"hi": "सोयाबीन", "gom": "सोयाबीन"},
    "Cardamom pods": {"hi": "इलायची की फली", "gom": "वेलचीच्यो फळ्यो"}
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
