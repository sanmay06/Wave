

export const Colors = {
  light: {
    background: '#F5F7FA', // Soft, near-white pink-tinted background
    primary: '#e75480',     // Warm pink (vivid, but gentle enough)
    secondary: '#fadadd',   // Light rose/pink pastel accent
    text: '#333333',        // Maintain high contrast for readability
    labelText: '#555555',   // Slightly softened for secondary text
    button: { background: '#e75480', color: '#ffffff' },  // Pink button
    buttonHover: { background: '#c7436d', color: '#ffffff' }, // Deeper pink
    border: '#f3e6ec',      // Light pink border to match the background tone
    link: '#e75480',        // Consistent with primary color
    linkHover: '#c7436d',   // Slightly darker hover for link
    card: '#ffffff',
    
    // Tabs
    tabBackground: '#fef1f4',  // Very light pinkish background
    tabActiveBackground: '#fffafa', // Matches overall background
    tabText: '#333333',
    tabActiveText: '#e75480',

    // Menu Bar
    menuBackground: '#fff0f5',  // Light pink background
    menuText: '#333333',
    menuHoverBackground: '#ffe4ee', // Slightly deeper pink hover
    menuHoverText: '#e75480',

    // Sidebar
    sidebarBackground: '#fdf0f5', // Warm light pink
    sidebarText: '#444444',
    sidebarActiveText: '#e75480',
  },

  dark: {
    background: '#121212',
    primary: '#1E88E5',
    secondary: '#1565C0',
    text: '#E0E0E0',
    labelText: '#B0BEC5',
    button: { background: '#1E88E5', color: '#ffffff' },
    buttonHover: { background: '#1565C0', color: '#ffffff' },
    border: '#333333',
    link: '#64B5F6',
    linkHover: '#42A5F5',

    tabBackground: '#1E1E1E',
    tabActiveBackground: '#121212',
    tabText: '#B0BEC5',
    tabActiveText: '#64B5F6',

    menuBackground: '#1c1c1c',
    menuText: '#E0E0E0',
    menuHoverBackground: '#263238',
    menuHoverText: '#64B5F6',

    sidebarBackground: '#181818',
    sidebarText: '#B0BEC5',
    sidebarActiveText: '#64B5F6',
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
