import PropTypes from 'prop-types';
import './DarkModeToggle.css';

const DarkModeToggle = ({ isDarkMode, toggleDarkMode }) => (
  <button onClick={toggleDarkMode} className="dark-mode-toggle" aria-label="Toggle dark mode">
    {isDarkMode ? '☀️' : '🌙'}
  </button>
);

DarkModeToggle.propTypes = {
  isDarkMode: PropTypes.bool.isRequired,
  toggleDarkMode: PropTypes.func.isRequired,
};

export default DarkModeToggle;
