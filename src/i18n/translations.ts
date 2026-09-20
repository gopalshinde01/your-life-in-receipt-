import { Language, LanguageOption } from '../types';

export const LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी', flag: '🇮🇳' },
];

export const translations = {
  en: {
    // Navigation
    navDashboard: 'Dashboard',
    navReceipt: 'Receipt',
    navAdd: '+ Add Entry',
    navActivities: 'Activities',
    navExpenses: 'Expenses',
    navGoals: 'Goals',
    navAnalytics: 'Analytics',
    navInsights: 'Insights',
    navProfile: 'Profile',
    tagline: 'Daily Ledger',

    // Receipt Strings
    receiptTitle: 'YOUR LIFE RECEIPT',
    receiptSubtitle: 'Transactions of Living & Growth',
    receiptTimeSpent: 'TIME SPENT',
    receiptMoneySpent: 'MONEY SPENT',
    receiptAchievements: 'ACHIEVEMENTS & GOALS',
    receiptMood: 'MOOD',
    receiptLifeScore: 'LIFE SCORE',
    receiptOverallIndex: 'OVERALL INDEX',
    receiptReflection: 'Deterministic Daily Reflection',
    receiptThankYou: 'THANK YOU FOR LIVING.',
    receiptFooterSub: 'Retain receipt for your personal records',
    receiptTotalTime: 'TOTAL TIME',
    receiptTotal: 'TOTAL',
    receiptPrint: 'Print / PDF',
    receiptDownloadPdf: 'Save as PDF',
    receiptDownloadImage: 'Download Image',
    receiptCopy: 'Copy Text',
    receiptCopied: '✓ Copied',
    receiptNoActivities: 'No tracked activities today.',
    receiptNoExpenses: 'No expenses recorded today.',
    receiptAverageVibe: 'Average Vibe:',

    // Hero / Landing
    heroBadge: 'Frontend Hackathon Showcase • Zero Backend',
    heroTitle: 'Your Entire Life,',
    heroTitleHighlight: 'Printed On A Receipt.',
    heroSubtitle: 'Transform your time, money, habits, goals, and daily vibes into a tangible, itemized digital Life Receipt. 100% private, client-side, accessible, and fast.',
    launchDashboard: 'Launch Dashboard →',
    viewLiveReceipt: 'View Live Receipt',
    addDailyEntry: '+ Add Daily Entry',

    // Dashboard
    welcomeBack: 'Welcome back',
    dashboardSubtitle: 'Here is your living ledger for today. Every transaction, moment, and achievement is captured below.',
    timeTracked: 'Time Tracked',
    moneySpent: 'Money Spent',
    goalsProgress: 'Goals Progress',
    averageMood: 'Average Mood',
    recentActivities: 'Recent Activities',
    recentExpenses: 'Recent Expenses',
    viewAll: 'View All',

    // Common / Actions
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    loading: 'Loading...',
    theme: 'Theme',
    language: 'Language',
    clearAll: 'Clear All',
    search: 'Search',
    all: 'All',
    done: 'Done',
    inProgress: 'in progress',

    // Life Score
    lifeScoreTitle: 'Life Score Index',
    calculationBreakdown: 'Calculation Breakdown',
    productivity: 'Productivity',
    health: 'Health & Habits',
    mood: 'Mood & Morale',
    balance: 'Daily Balance',

    // Add Entry
    addLedgerTitle: 'Add to Your Ledger',
    addLedgerSubtitle: 'Log activities, record expenses, define goals, or check in on your emotional vibe.',
    tabActivity: 'Activity',
    tabExpense: 'Expense',
    tabGoal: 'Goal',
    tabMood: 'Mood / Vibe',
  },

  hi: {
    // Navigation
    navDashboard: 'डैशबोर्ड',
    navReceipt: 'रसीद',
    navAdd: '+ प्रविष्टि जोड़ें',
    navActivities: 'गतिविधियाँ',
    navExpenses: 'खर्च',
    navGoals: 'लक्ष्य',
    navAnalytics: 'विश्लेषण',
    navInsights: 'सुझाव',
    navProfile: 'प्रोफ़ाइल',
    tagline: 'दैनिक बहीखाता',

    // Receipt Strings
    receiptTitle: 'आपकी जीवन रसीद',
    receiptSubtitle: 'दैनिक जीवन और विकास का हिसाब-किताब',
    receiptTimeSpent: 'बिताया गया समय',
    receiptMoneySpent: 'खर्च किया गया धन',
    receiptAchievements: 'उपलब्धियां और लक्ष्य',
    receiptMood: 'मनोदशा (मूड)',
    receiptLifeScore: 'जीवन स्कोर',
    receiptOverallIndex: 'समग्र सूचकांक',
    receiptReflection: 'दैनिक अवलोकन व आत्म-चिंतन',
    receiptThankYou: 'जीवन जीने के लिए धन्यवाद।',
    receiptFooterSub: 'यह रसीद अपने व्यक्तिगत रिकॉर्ड के लिए सुरक्षित रखें',
    receiptTotalTime: 'कुल समय',
    receiptTotal: 'कुल योग',
    receiptPrint: 'प्रिंट / पीडीएफ',
    receiptDownloadPdf: 'पीडीएफ सुरक्षित करें',
    receiptDownloadImage: 'इमेज डाउनलोड',
    receiptCopy: 'टेक्स्ट कॉपी करें',
    receiptCopied: '✓ कॉपी हुआ',
    receiptNoActivities: 'आज कोई गतिविधि दर्ज नहीं की गई।',
    receiptNoExpenses: 'आज कोई खर्च दर्ज नहीं किया गया।',
    receiptAverageVibe: 'औसत मनोदशा:',

    // Hero / Landing
    heroBadge: 'फ्रंटएंड हैकाथॉन प्रदर्शन • पूरी तरह से निजी',
    heroTitle: 'आपका संपूर्ण जीवन,',
    heroTitleHighlight: 'एक सुंदर रसीद पर मुद्रित।',
    heroSubtitle: 'अपने समय, धन, आदतों, लक्ष्यों और मनोदशा को एक ठोस डिजिटल रसीद में बदलें। 100% सुरक्षित, ब्राउज़र-आधारित और तेज़।',
    launchDashboard: 'डैशबोर्ड खोलें →',
    viewLiveReceipt: 'लाइव रसीद देखें',
    addDailyEntry: '+ दैनिक प्रविष्टि जोड़ें',

    // Dashboard
    welcomeBack: 'स्वागत है',
    dashboardSubtitle: 'यह आज का आपका जीवंत बहीखाता है। आपका प्रत्येक क्षण और उपलब्धि यहाँ दर्ज है।',
    timeTracked: 'ट्रैक किया गया समय',
    moneySpent: 'खर्च की गई राशि',
    goalsProgress: 'लक्ष्य प्रगति',
    averageMood: 'औसत मनोदशा',
    recentActivities: 'हाल की गतिविधियाँ',
    recentExpenses: 'हाल के खर्च',
    viewAll: 'सभी देखें',

    // Common / Actions
    save: 'सहेजें',
    cancel: 'रद्द करें',
    delete: 'हटाएं',
    loading: 'लोड हो रहा है...',
    theme: 'थीम',
    language: 'भाषा',
    clearAll: 'सब साफ़ करें',
    search: 'खोजें',
    all: 'सभी',
    done: 'पूर्ण',
    inProgress: 'प्रगति पर',

    // Life Score
    lifeScoreTitle: 'जीवन स्कोर सूचकांक',
    calculationBreakdown: 'गणना का विवरण',
    productivity: 'उत्पादकता',
    health: 'स्वास्थ्य व आदतें',
    mood: 'मनोदशा व ऊर्जा',
    balance: 'दैनिक संतुलन',

    // Add Entry
    addLedgerTitle: 'बहीखाते में जोड़ें',
    addLedgerSubtitle: 'गतिविधि दर्ज करें, खर्च लिखें, लक्ष्य निर्धारित करें या अपनी मनोदशा दर्ज करें।',
    tabActivity: 'गतिविधि',
    tabExpense: 'खर्च',
    tabGoal: 'लक्ष्य',
    tabMood: 'मनोदशा (मूड)',
  },

  mr: {
    // Navigation
    navDashboard: 'डॅशबोर्ड',
    navReceipt: 'पावती',
    navAdd: '+ नोंद जोडा',
    navActivities: 'दैनंदिन कृती',
    navExpenses: 'खर्च',
    navGoals: 'ध्येये व उद्दिष्टे',
    navAnalytics: 'विश्लेषण',
    navInsights: 'मार्गदर्शन',
    navProfile: 'प्रोफाइल',
    tagline: 'दैनंदिन जमाखर्च',

    // Receipt Strings
    receiptTitle: 'तुमची जीवन पावती',
    receiptSubtitle: 'दैनंदिन जीवन आणि प्रगतीचा लेखाजोखा',
    receiptTimeSpent: 'दिलेला वेळ',
    receiptMoneySpent: 'झालेला खर्च',
    receiptAchievements: 'साध्य केलेली ध्येये',
    receiptMood: 'मनःस्थिती (मूड)',
    receiptLifeScore: 'जीवन निर्देशांक (लाईफ स्कोर)',
    receiptOverallIndex: 'एकूण निर्देशांक',
    receiptReflection: 'दैनंदिन निरीक्षण व विचार',
    receiptThankYou: 'सजग जीवन जगल्याबद्दल धन्यवाद.',
    receiptFooterSub: 'ही पावती तुमच्या वैयक्तिक नोंदीसाठी जतन करा',
    receiptTotalTime: 'एकूण वेळ',
    receiptTotal: 'एकूण खर्च',
    receiptPrint: 'प्रिंट / पीडीएफ',
    receiptDownloadPdf: 'पीडीएफ जतन करा',
    receiptDownloadImage: 'इमेज डाउनलोड',
    receiptCopy: 'मजकूर कॉपी करा',
    receiptCopied: '✓ कॉपी झाले',
    receiptNoActivities: 'आज कोणतीही कृती नोंदवलेली नाही.',
    receiptNoExpenses: 'आज कोणताही खर्च नोंदवला नाही.',
    receiptAverageVibe: 'सरासरी मनःस्थिती:',

    // Hero / Landing
    heroBadge: 'फ्रंटएंड हॅकाथॉन सादरीकरण • १००% खाजगी',
    heroTitle: 'तुमचे संपूर्ण आयुष्य,',
    heroTitleHighlight: 'एका सुंदर पावतीवर रेखाटलेले.',
    heroSubtitle: 'तुमचा वेळ, पैसा, सवयी, ध्येये आणि मनःस्थिती एका डिजिटल जीवन पावतीमध्ये रूपांतरित करा. सुरक्षित, जलद आणि संपूर्णतः स्थानिक.',
    launchDashboard: 'डॅशबोर्ड सुरू करा →',
    viewLiveReceipt: 'थेट पावती पहा',
    addDailyEntry: '+ दैनिक नोंद करा',

    // Dashboard
    welcomeBack: 'पुन्हा स्वागत आहे',
    dashboardSubtitle: 'हा आजचा तुमचा जीवन-लेखाजोखा आहे. प्रत्येक क्षण, कृती आणि यश येथे नोंदवले आहे.',
    timeTracked: 'नोंदवलेला वेळ',
    moneySpent: 'झालेला खर्च',
    goalsProgress: 'ध्येय प्रगती',
    averageMood: 'सरासरी मनःस्थिती',
    recentActivities: 'नुकत्याच केलेल्या कृती',
    recentExpenses: 'नुकतेच झालेले खर्च',
    viewAll: 'सर्व पहा',

    // Common / Actions
    save: 'जतन करा',
    cancel: 'रद्द करा',
    delete: 'हटवा',
    loading: 'लोड होत आहे...',
    theme: 'रंगसंगती (थीम)',
    language: 'भाषा',
    clearAll: 'सर्व साफ करा',
    search: 'शोधा',
    all: 'सर्व',
    done: 'पूर्ण',
    inProgress: 'प्रगतीत',

    // Life Score
    lifeScoreTitle: 'जीवन स्कोर निर्देशांक',
    calculationBreakdown: 'गणनेचे विवरण',
    productivity: 'उत्पादकता',
    health: 'आरोग्य व सवयी',
    mood: 'मनःस्थिती व ऊर्जा',
    balance: 'दैनंदिन समतोल',

    // Add Entry
    addLedgerTitle: 'खात्यात नोंद करा',
    addLedgerSubtitle: 'कृती नोंदवा, खर्च लिहा, नवीन ध्येय ठरवा किंवा मनःस्थिती नोंदवा.',
    tabActivity: 'कृती',
    tabExpense: 'खर्च',
    tabGoal: 'ध्येय',
    tabMood: 'मनःस्थिती (मूड)',
  },
};

export type TranslationKey = keyof typeof translations.en;

export function getTranslation(lang: Language, key: TranslationKey): string {
  const dict = translations[lang] || translations.en;
  return dict[key] || translations.en[key] || key;
}
