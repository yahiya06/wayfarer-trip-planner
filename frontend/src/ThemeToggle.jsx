function ThemeToggle({ darkTheme, onToggle }) {
  return <button className="theme-toggle" type="button" onClick={onToggle} aria-pressed={darkTheme} aria-label={`Switch to ${darkTheme ? 'light' : 'dark'} theme`}><span aria-hidden="true">{darkTheme ? '☀' : '◐'}</span><span>{darkTheme ? 'Light mode' : 'Dark mode'}</span></button>
}

export default ThemeToggle
