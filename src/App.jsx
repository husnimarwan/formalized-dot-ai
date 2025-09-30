import { GoogleGenerativeAI } from '@google/generative-ai';
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

const Buttons = ({ onFormalize, onCopy, disabled, loading }) => (
  <div className="button-group">
    <button onClick={onFormalize} className="formalize-button" disabled={disabled || loading}>
      {loading ? 'Formalizing...' : 'Formalize'}
    </button>
    <button onClick={onCopy} className="copy-button" disabled={!disabled || loading}>
      Copy
    </button>
  </div>
);

Buttons.propTypes = {
  onFormalize: PropTypes.func.isRequired,
  onCopy: PropTypes.func.isRequired,
  disabled: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
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

  const [loading, setLoading] = useState(false);

  const formalizeText = useCallback(async () => {
    if (!inputText.trim()) {
      setError('Input text cannot be empty.');
      return;
    }
    setLoading(true);
    setError('');
    setOutputText('');

    try {
      const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

      const prompt = `Formalize the following text. Do not add any extra information, just the formalized text. For example, if the input is 'idk maybe we should go', the output should be 'I do not know, perhaps we should go.':

${inputText}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      setOutputText(text);
    } catch (error) {
      console.error("Error formalizing text:", error);
      setError('Failed to formalize text. Please try again.');
    } finally {
      setLoading(false);
    }
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
          loading={loading}
        />
        {error && <p className="error-message">{error}</p>}
      </main>
    </div>
  );
}

export default App;