export function getWeatherIcon(weatherCode: number): string {
  switch (weatherCode) {
      case 0: return 'mdi-weather-hurricane';
      case 1: return 'mdi-weather-hurricane';
      case 2: return 'mdi-weather-hurricane';
      case 3: case 4: return 'mdi-weather-lightning';
      case 5: case 6: case 7: return 'mdi-weather-snowy-rainy';
      case 8: return 'mdi-weather-fog';
      case 9: case 10: case 11: case 12: return 'mdi-weather-rainy';
      case 13: case 14: case 15: case 16: return 'mdi-weather-snowy';
      case 17: return 'mdi-weather-hail';
      case 18: return 'mdi-weather-snowy';
      case 19: return 'mdi-weather-windy-variant';
      case 20: case 21: case 22: return 'mdi-weather-fog';
      case 23: case 24: return 'mdi-weather-windy';
      case 25: return 'mdi-weather-snowy';
      case 26: case 27: case 28: return 'mdi-weather-cloudy';
      case 29: case 30: return 'mdi-weather-partly-cloudy';
      case 31: case 32: return 'mdi-weather-sunny';
      case 33: return 'mdi-weather-night';
      case 34: return 'mdi-weather-partly-cloudy';
      case 35: return 'mdi-weather-hail';
      case 36: return 'mdi-weather-sunny';
      case 37: case 38: case 39: case 47: return 'mdi-weather-lightning';
      case 40: return 'mdi-weather-pouring';
      case 41: case 42: case 43: return 'mdi-weather-snowy-heavy';
      case 44: return 'mdi-weather-sunny-off';
      case 45: return 'mdi-weather-pouring';
      case 46: return 'mdi-weather-snowy';
      default: return 'mdi-help-circle-outline';
  }
}
