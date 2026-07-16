// ALEXANDRIA — region / country / exam-board registry.
// Cascading selection source-of-truth used by the CONFIGURE console.

export const examRegions = {
  Asia: {
    'United Kingdom': ['AQA', 'Edexcel (Pearson)', 'OCR', 'WJEC / Eduqas'],
    India: ['CBSE', 'CISCE (ICSE/ISC)', 'NIOS', 'IB (International Baccalaureate)'],
    China: ['Gaokao (NCEE)', 'IB', 'AP (College Board)'],
    Japan: ['National Center Test', 'IB'],
    Singapore: ['Cambridge IGCSE', 'Singapore-Cambridge GCE O/A-Level'],
    Pakistan: ['Cambridge O/A-Level', 'FBISE', 'Aga Khan Board'],
  },
  Africa: {
    'South Africa': ['IEB', 'NSC (DBE)', 'Cambridge IGCSE'],
    Nigeria: ['WAEC (WASSCE)', 'NECO', 'JAMB'],
    Kenya: ['KNEC (KCPE/KCSE)', 'Cambridge IGCSE'],
    Egypt: ['Thanaweya Amma', 'IGCSE (Edexcel/Cambridge)'],
    Ghana: ['WAEC (WASSCE)'],
  },
  Europe: {
    'United Kingdom': ['AQA', 'Edexcel (Pearson)', 'OCR', 'WJEC / Eduqas', 'SQA (Scotland)'],
    France: ['Baccalauréat', 'Cambridge IGCSE', 'IB'],
    Germany: ['Abitur', 'IB'],
    Spain: ['EBAU / EvAU', 'IB'],
    'Republic of Ireland': ['Leaving Certificate (SEC)', 'Cambridge A-Level'],
    Netherlands: ['VWO / HAVO', 'IB'],
  },
  'North America': {
    'United States': ['College Board (AP / SAT)', 'ACT', 'IB'],
    Canada: ['Provincial Diploma (e.g. OSSD)', 'IB', 'AP'],
    Mexico: ['SEP Bachillerato', 'IB'],
  },
  'South America': {
    Brazil: ['ENEM', 'ENEM/Vestibular'],
    Argentina: ['Título de Bachiller', 'IB'],
    Chile: ['PAES (formerly PSU)'],
    Colombia: ['ICFES (Saber 11)'],
  },
  Oceania: {
    Australia: ['State HSC / VCE / QCE / WACE / SACE', 'IB'],
    'New Zealand': ['NCEA', 'Cambridge International', 'IB'],
  },
};

export const regionList = Object.keys(examRegions);