import React, { useState, useEffect } from 'react';
import './index.css';

const App = () => {
  const [language, setLanguage] = useState('en');
  const [term, setTerm] = useState('');
  const [suggestions, setSuggestions] = useState({ category: [], family: [], suggestions: [] });
  const [matchedSuggestions, setMatchedSuggestions] = useState([]);

  useEffect(() => {
    const loadLanguage = () => {
      const storedLanguage = localStorage.getItem('language');
      if (storedLanguage) setLanguage(storedLanguage);
    };
    loadLanguage();
  }, []);

  const fetchData = async (searchTerm) => {
    if (!searchTerm) return; // Skip fetch if term is empty
    try {
      const response = await fetch(`https://taric-backend.vercel.app//api/suggestions?term=${encodeURIComponent(searchTerm)}&lang=${language}`);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      // Ensure data has the expected structure
      if (data && data.categorizedSuggestions && data.matchedSuggestions) {
        setSuggestions(data.categorizedSuggestions);
        setMatchedSuggestions(data.matchedSuggestions);
      } else {
        console.error('Unexpected API response structure:', data);
        setSuggestions({ category: [], family: [], suggestions: [] });
        setMatchedSuggestions([]);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
    fetchData(term); 
  };

  const handleValidateClick = () => {
    fetchData(term);
  };

  const renderSection = (title, items) => (
    items && items.length > 0 && (
      <div>
        <h2 className="text-xl font-bold mb-2">{title}</h2>
        <ul>
          {items.map((item) => (
            <li key={item.code} className="border p-2 mb-2 rounded-md">
              <div dangerouslySetInnerHTML={{ __html: item.value }} />
              <div>Score: {item.score}</div>
              <ul>
                {item.matches && item.matches.map((match, index) => (
                  <li key={index} className="ml-4 text-gray-600">
                    {match.Description}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    )
  );

  // Define translations
  const translations = {
    en: {
      matchedSuggestions: "Matched Suggestions",
      category: "Category",
      family: "Family",
      suggestions: "Suggestions",
      validate: "Validate",
      enterSearchTerm: "Enter search term",
      languageSelector: "Language Selector"
    },
    fr: {
      matchedSuggestions: "Suggestions Correspondantes",
      category: "Catégorie",
      family: "Famille",
      suggestions: "Suggestions",
      validate: "Valider",
      enterSearchTerm: "Entrez le terme de recherche",
      languageSelector: "Sélecteur de langue"
    },
    it: {
      matchedSuggestions: "Suggerimenti Corrispondenti",
      category: "Categoria",
      family: "Famiglia",
      suggestions: "Suggerimenti",
      validate: "Convalida",
      enterSearchTerm: "Inserisci il termine di ricerca",
      languageSelector: "Selettore della lingua"
    }
  };

  // Get the current language translations
  const currentTranslations = translations[language];

  return (
    <div className="container mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">
        {currentTranslations.languageSelector}
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
        {/*<button
          className="bg-blue-500 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md text-sm font-medium"
          onClick={() => handleLanguageChange('it')}
        >
          Italian
        </button>*/}
      </div>
      <div className="mb-4 flex justify-start gap-10">
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="border rounded-md w-[80%] px-4 py-2 h-10"
          placeholder={currentTranslations.enterSearchTerm}
        />
        <button
          onClick={handleValidateClick}
          className="mb-4 bg-blue-500 text-white hover:bg-blue-700 h-10 px-4 py-2 rounded-md text-sm font-medium w-[20%]"
        >
          {currentTranslations.validate}
        </button>
      </div>
      {renderSection(currentTranslations.category, suggestions.category)}
      {renderSection(currentTranslations.family, suggestions.family)}
      {/*{renderSection(currentTranslations.suggestions, suggestions.suggestions)}*/}
      <div>
        {matchedSuggestions.length > 0 && (
          <div>
            <h2 className="text-xl font-bold mb-2">{currentTranslations.matchedSuggestions}</h2>
            <ul>
              {matchedSuggestions.map((item, index) => (
                <li key={index} className="border p-2 mb-2 rounded-md">
                  <div dangerouslySetInnerHTML={{ __html: item.value }} />
                  {/*<div>Score: {item.score}</div>*/}
                  <ul>
                    {item.matches && item.matches.map((match, matchIndex) => (
                      <li key={matchIndex} className="ml-4 text-gray-600">
                        {match.Indent} {match.Goodscode} {language === 'en' ? match.DescriptionEN : language === 'fr' ? match.DescriptionFR : match.Description}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
