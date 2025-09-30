import { useState, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import './App.css';
import DarkModeToggle from './components/DarkModeToggle';

const Header = () => (
  <header>
    <h1>Formalized</h1>
    <p>Instantly elevate your writing to a professional standard.</p>
  </header>
);

const TextArea = ({ id, value, onChange, placeholder, count, isOutput }) => (
  <div className="textarea-group">
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      readOnly={isOutput}
    />
    <div className="char-count">{count} characters</div>
  </div>
);

TextArea.propTypes = {
  id: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string.isRequired,
  count: PropTypes.number.isRequired,
  isOutput: PropTypes.bool,
};

TextArea.defaultProps = {
  isOutput: false,
};

const Buttons = ({ onFormalize, onCopy, disabled }) => (
  <div className="button-group">
    <button onClick={onFormalize} className="formalize-button" disabled={disabled}>
      Formalize
    </button>
    <button onClick={onCopy} className="copy-button" disabled={!disabled}>
      Copy
    </button>
  </div>
);

Buttons.propTypes = {
  onFormalize: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
};

function App() {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(prefersDarkMode);
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const formalizeText = useCallback(() => {
    if (!inputText.trim()) {
      setError('Input text cannot be empty.');
      return;
    }

    // Placeholder for AI-powered formalization
    const formalized = inputText
      .replace(/idk/gi, "I do not know")
      .replace(/btw/gi, "by the way")
      .replace(/imo/gi, "in my opinion")
      .replace(/tldr/gi, "too long; didn't read")
      .replace(/\b(wanna|gonna|gotta)\b/gi, (match) => {
        switch (match.toLowerCase()) {
          case 'wanna': return 'want to';
          case 'gonna': return 'going to';
          case 'gotta': return 'got to';
          default: return match;
        }
      })
      .split('. ')
      .map(sentence => sentence.charAt(0).toUpperCase() + sentence.slice(1))
      .join('. ');

    setOutputText(formalized);
    setError('');
  }, [inputText]);

  const copyToClipboard = useCallback(() => {
    if (!outputText) {
      setError('Nothing to copy.');
      return;
    }
    navigator.clipboard.writeText(outputText);
    setError('');
  }, [outputText]);

  return (
    <div className="container">
      <DarkModeToggle isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Header />
      <main className="app">
        <TextArea
          id="input"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter informal text here..."
          count={inputText.length}
        />
        <TextArea
          id="output"
          value={outputText}
          onChange={() => {}}
          placeholder="Formalized text will appear here..."
          count={outputText.length}
          isOutput
        />
        <Buttons
          onFormalize={formalizeText}
          onCopy={copyToClipboard}
          disabled={!inputText}
        />
        {error && <p className="error-message">{error}</p>}
      </main>
    </div>
  );
}

export default App;