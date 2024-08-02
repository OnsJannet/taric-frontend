import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [language, setLanguage] = useState('en');
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState({ category: [], family: [], suggestions: [] });

  useEffect(() => {
    const loadLanguage = () => {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) setLanguage(storedLanguage);
    };
    loadLanguage();
  }, []);

  const fetchData = async () => {
    if (!term) return; // Skip fetch if term is empty
    try {
      const response = await fetch(`https://taric-backend.vercel.app/api/suggestions?term=${encodeURIComponent(term)}&lang=${language}`);
      
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setSuggestions(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    fetchData(); // Fetch data when language changes
  };

  const handleValidateClick = () => {
    fetchData();
  };

  const getTitle = (section) => {
    const titles = {
      en: { category: 'Category', family: 'Family', suggestions: 'Suggestions' },
      fr: { category: 'Catégorie', family: 'Famille', suggestions: 'Suggestions' },
      de: { category: 'Kategorie', family: 'Familie', suggestions: 'Vorschläge' },
      it: { category: 'Categoria', family: 'Famiglia', suggestions: 'Suggerimenti' }
    };
    return titles[language][section];
  };

  const renderSection = (title, items) => (
    items.length > 0 && (
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <ul>
          {items.map((item) => (
            <li key={item.code} className="border p-2 mb-2 rounded-md">
              <div dangerouslySetInnerHTML={{ __html: item.value }} />
              <div>Score: {item.score}</div>
            </li>
          ))}
        </ul>
      </div>
    )
  );

  return (
    <div className="container mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {language === 'en' ? 'Language Selector' : language === 'fr' ? 'Sélecteur de langue' : language === 'de' ? 'Sprachauswahl' : 'Selettore della lingua'}
      </h1>
      <div className="mb-10 flex justify-center space-x-2">
        <button 
          className="bg-blue-500 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => handleLanguageChange('en')}
        >
          English
        </button>
        <button 
          className="bg-blue-500 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => handleLanguageChange('fr')}
        >
          French
        </button>
        <button 
          className="bg-blue-500 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => handleLanguageChange('de')}
        >
          German
        </button>
        <button 
          className="bg-blue-500 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => handleLanguageChange('it')}
        >
          Italian
        </button>
      </div>
      <div className="mb-4 flex justify-start gap-10">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="border rounded-md w-[80%] px-4 py-2 h-10"
          placeholder={language === 'en' ? 'Enter search term' : language === 'fr' ? 'Entrez le terme de recherche' : language === 'de' ? 'Suchbegriff eingeben' : 'Inserisci il termine di ricerca'}
        />
        <button
          onClick={handleValidateClick}
          className="mb-4 bg-blue-500 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md text-sm font-medium w-[20%]"
        >
          {language === 'en' ? 'Validate' : language === 'fr' ? 'Valider' : language === 'de' ? 'Validieren' : 'Convalidare'}
        </button>
      </div>
      {renderSection(getTitle('category'), suggestions.category)}
      {renderSection(getTitle('family'), suggestions.family)}
      {renderSection(getTitle('suggestions'), suggestions.suggestions)}
    </div>
  );
};

export default App;
