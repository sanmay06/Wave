

export const Colors = {
  // Light Theme (White Background)
  light: {
    background: '#ffffff',  // Pure white for a clean look
    primary: '#0073e6',     // Vibrant blue for primary elements
    secondary: '#CEEAD6',   // Light green for accents
    text: '#333333',        // Dark gray for readability
    labelText: '#555555',   // Lighter gray for secondary text
    button: { background: '#0073e6', color: '#ffffff' },  // Blue button with white text
    buttonHover: { background: '#005bb5', color: '#ffffff' }, // Darker blue on hover
    border: '#e0e0e0',      // Light gray for dividers and borders
    link: '#0073e6',        // Blue for links
    linkHover: '#005bb5',   // Darker blue on hover

    // Tabs
    tabBackground: '#f5f5f5',  // Light gray for inactive tabs
    tabActiveBackground: '#ffffff', // White for active tab
    tabText: '#333333',        // Dark gray for tab text
    tabActiveText: '#0073e6',  // Blue for active tab text

    // Menu Bar
    menuBackground: '#f8f9fa',  // Light gray for menu background
    menuText: '#333333',        // Dark gray for menu text
    menuHoverBackground: '#e3f2fd', // Light blue hover effect
    menuHoverText: '#0073e6',   // Blue text on hover

    // Sidebar
    sidebarBackground: '#f1f1f1', // Light gray sidebar
    sidebarText: '#444444',       // Slightly darker gray for contrast
    sidebarActiveText: '#0073e6', // Highlight active sidebar item
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

    // Tabs
    tabBackground: '#1E1E1E',  // Dark gray for inactive tabs
    tabActiveBackground: '#121212', // Dark black for active tab
    tabText: '#B0BEC5',        // Gray text for tabs
    tabActiveText: '#64B5F6',  // Bright blue for active tab

    // Menu Bar
    menuBackground: '#1c1c1c',  // Dark gray for menu
    menuText: '#E0E0E0',        // Light gray menu text
    menuHoverBackground: '#263238', // Dark blue-gray hover effect
    menuHoverText: '#64B5F6',   // Bright blue text on hover

    // Sidebar
    sidebarBackground: '#181818', // Slightly lighter black for sidebar
    sidebarText: '#B0BEC5',       // Soft gray for contrast
    sidebarActiveText: '#64B5F6', // Highlight active sidebar item
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
