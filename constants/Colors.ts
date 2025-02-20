

export const Colors = {
  // Light Theme (White Background)
  light: {
    background: '#ffffff',  // Pure white for a clean look
    primary: '#0073e6',     // Vibrant blue for primary elements
    secondary: '#005bb5',   // Darker blue for accents and highlights
    text: '#333333',        // Dark gray for readability
    labelText: '#555555',   // Lighter gray for secondary text
    button: { background: '#0073e6', color: '#ffffff' },  // Blue button with white text
    buttonHover: { background: '#005bb5', color: '#ffffff' }, // Darker blue on hover
    border: '#e0e0e0',      // Light gray for dividers and borders
    link: '#0073e6',        // Blue for links
    linkHover: '#005bb5',   // Darker blue on hover
  },

  // Dark Theme (Dark Background)
  dark: {
    background: '#121212',  // Deep black for dark mode
    primary: '#1E88E5',     // Bright blue for contrast
    secondary: '#1565C0',   // Darker blue for accents
    text: '#E0E0E0',        // Light gray text for readability
    labelText: '#B0BEC5',    // Subtle gray for secondary text
    button: { background: '#1E88E5', color: '#ffffff' },  // Blue button with white text
    buttonHover: { background: '#1565C0', color: '#ffffff' }, // Darker blue on hover
    border: '#333333',      // Dark gray for dividers
    link: '#64B5F6',        // Lighter blue for visibility
    linkHover: '#42A5F5',   // Slightly darker on hover
  },
};

export const accents = {
  success: '#4CAF50',  // Green for success messages
  warning: '#FFC107',  // Yellow-orange for warnings
  error: '#F44336',    // Red for errors and alerts
  info: '#29B6F6',     // Cyan for informational messages
};

const gradientColors = {
  light: ['#E3F2FD', '#BBDEFB'],  // Soft blue gradient for light mode
  dark: ['#1E3A8A', '#0F172A'],   // Deep blue-black gradient for dark mode
};
