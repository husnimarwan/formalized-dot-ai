import { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import './App.css';

const Header = () => (
  <header>
    <h1>Formalized</h1>
    <p>Transform your text into a more professional format.</p>
  </header>
);

const TextArea = ({ id, value, onChange, placeholder, count }) => (
  <div className="textarea-group">
    <textarea
      id={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
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
};

const Buttons = ({ onFormalize, onCopy, disabled }) => (
  <div className="button-group">
    <button onClick={onFormalize} className="formalize-button" disabled={disabled}>
      Formalize
    </button>
    <button onClick={onCopy} className="copy-button" disabled={disabled}>
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
      <Header />
      <main className="app">
        <TextArea
          id="input"
          value={inputText}
          onChange={handleInputChange}
          placeholder="Enter informal text here..."
          count={inputText.length}
        />
        <Buttons
          onFormalize={formalizeText}
          onCopy={copyToClipboard}
          disabled={!inputText}
        />
        <TextArea
          id="output"
          value={outputText}
          onChange={() => {}}
          placeholder="Formalized text will appear here..."
          count={outputText.length}
        />
        {error && <p className="error-message">{error}</p>}
      </main>
    </div>
  );
}

export default App;