import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "Mizan Core": "Mizan Core",
      "Murabaha Engine": "Murabaha Engine",
      "Takaful": "Takaful",
      "Waqf": "Waqf",
      "100% Sharia Compliant": "100% Sharia Compliant",
      "Total GMV Processed": "Total GMV Processed",
      "Active Murabaha Contracts": "Active Murabaha Contracts",
      "Late Fees to Charity": "Late Fees to Charity",
      "Recent Financing Requests": "Recent Financing Requests",
      "New API Request": "New API Request",
      "Contract ID": "Contract ID",
      "Customer": "Customer",
      "Status": "Status",
      "Ownership Risk": "Ownership Risk",
      "Sequence Validated": "Sequence Validated",
      "Fatwa Reference": "Fatwa Reference",
      "Confirmed": "Confirmed",
      "Pending": "Pending",
      "Verified": "Verified",
      "All rights reserved": "All rights reserved",
      "Language": "Language",
      "REQUESTED": "Requested",
      "BANK_PURCHASED": "Bank Purchased",
      "SOLD_TO_CUSTOMER": "Sold to Customer"
    }
  },
  fr: {
    translation: {
      "Mizan Core": "Mizan Core",
      "Murabaha Engine": "Moteur Mourabaha",
      "Takaful": "Takaful",
      "Waqf": "Waqf",
      "100% Sharia Compliant": "100% Conforme à la Charia",
      "Total GMV Processed": "Volume Global Traité",
      "Active Murabaha Contracts": "Contrats Mourabaha Actifs",
      "Late Fees to Charity": "Pénalités versées aux Œuvres",
      "Recent Financing Requests": "Demandes de Financement Récentes",
      "New API Request": "Nouvelle Requête API",
      "Contract ID": "ID Contrat",
      "Customer": "Client",
      "Status": "Statut",
      "Ownership Risk": "Risque de Propriété",
      "Sequence Validated": "Séquence Validée",
      "Fatwa Reference": "Référence Fatwa",
      "Confirmed": "Confirmé",
      "Pending": "En attente",
      "Verified": "Vérifié",
      "All rights reserved": "Tous droits réservés",
      "Language": "Langue",
      "REQUESTED": "Demandé",
      "BANK_PURCHASED": "Acheté par la Banque",
      "SOLD_TO_CUSTOMER": "Vendu au Client"
    }
  },
  ar: {
    translation: {
      "Mizan Core": "ميزان كور",
      "Murabaha Engine": "محرك المرابحة",
      "Takaful": "تكافل",
      "Waqf": "وقف",
      "100% Sharia Compliant": "متوافق مع الشريعة 100٪",
      "Total GMV Processed": "إجمالي الحجم المعالج",
      "Active Murabaha Contracts": "عقود المرابحة النشطة",
      "Late Fees to Charity": "غرامات التأخير",
      "Recent Financing Requests": "طلبات التمويل الأخيرة",
      "New API Request": "طلب API جديد",
      "Contract ID": "رقم العقد",
      "Customer": "العميل",
      "Status": "الحالة",
      "Ownership Risk": "مخاطر الملكية",
      "Sequence Validated": "تم التحقق من التسلسل",
      "Fatwa Reference": "مرجع الفتوى",
      "Confirmed": "مؤكد",
      "Pending": "قيد الانتظار",
      "Verified": "تم التحقق",
      "All rights reserved": "جميع الحقوق محفوظة",
      "Language": "اللغة",
      "REQUESTED": "مطلوب",
      "BANK_PURCHASED": "اشتراها البنك",
      "SOLD_TO_CUSTOMER": "بيعت للعميل"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    }
  });

// Handle RTL for Arabic
i18n.on('languageChanged', (lng) => {
  document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.lang = lng;
});

export default i18n;
