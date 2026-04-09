import * as Haptics from 'expo-haptics';

export function useHaptics() {
  const lightImpact = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  const mediumImpact = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  const heavyImpact = () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  const successNotification = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  const warningNotification = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  const errorNotification = () => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

  return { lightImpact, mediumImpact, heavyImpact, successNotification, warningNotification, errorNotification };
}
