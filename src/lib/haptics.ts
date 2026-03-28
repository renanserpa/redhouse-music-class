/**
 * Haptic Feedback Utility
 * Provides subtle vibration feedback for mobile devices
 */

export const haptics = {
  /**
   * Light impact for subtle interactions
   */
  light: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(10);
    }
  },

  /**
   * Medium impact for success or important actions
   */
  medium: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(20);
    }
  },

  /**
   * Heavy impact for errors or strong feedback
   */
  heavy: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate([30, 50, 30]);
    }
  },

  /**
   * Rhythmic pulse for metronome or rhythm games
   */
  pulse: () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(15);
    }
  }
};
