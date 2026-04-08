import { ActivityCategory } from '../types/activity.types';

export const ACTIVITY_CATEGORIES: Record<ActivityCategory, {
    label: string;
    emoji: string;
    color: string;
    lightColor: string;
}> = {
    coffee: {
        label: '커피 한잔',
        emoji: '☕',
        color: '#8B6914',
        lightColor: '#FFF3DB',
    },
    meal: {
        label: '같이 밥',
        emoji: '🍽️',
        color: '#FF8C42',
        lightColor: '#FFE8D6',
    },
    drink: {
        label: '한잔 하자',
        emoji: '🍺',
        color: '#D4A017',
        lightColor: '#FFF8E1',
    },
    walk: {
        label: '산책/운동',
        emoji: '🚶',
        color: '#4CAF50',
        lightColor: '#E8F5E9',
    },
    culture: {
        label: '문화생활',
        emoji: '🎨',
        color: '#9C27B0',
        lightColor: '#F3E5F5',
    },
    anything: {
        label: '뭐든 좋아',
        emoji: '🎲',
        color: '#FF6B9D',
        lightColor: '#FFE4ED',
    },
};
