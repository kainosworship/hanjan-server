export const colors = {
    primary: {
        coral: '#FF6B52',
        dark: '#E8563F',
        light: '#FFE8E3',
    },
    secondary: {
        amber: '#FFB547',
        amberLight: '#FFF3DB',
    },
    neutral: {
        charcoal: '#1A1A2E',
        darkGray: '#4A4A68',
        mediumGray: '#8E8EA9',
        lightGray: '#E8E8F0',
        warmWhite: '#FFF8F5',
        pureWhite: '#FFFFFF',
    },
    semantic: {
        success: '#34C759',
        warning: '#FFCC00',
        error: '#FF3B30',
        info: '#007AFF',
    },
    categories: {
        coffee: '#8B6914',
        meal: '#FF8C42',
        drink: '#D4A017',
        walk: '#4CAF50',
        culture: '#9C27B0',
        anything: '#FF6B9D',
    },
};

export const darkColors = {
    ...colors,
    neutral: {
        ...colors.neutral,
        background: '#121220',
        card: '#1E1E32',
        text: '#F5F5FA',
        body: '#C8C8DA',
        divider: '#2A2A42',
    },
};
