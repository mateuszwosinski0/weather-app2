# WeatherApp

Nowoczesna aplikacja pogodowa zbudowana w React, Vite i Tailwind CSS. Pozwala szybko sprawdzić pogodę dla wybranego miasta i wygodnie przeglądać prognozę.

## Funkcje

- wyszukiwanie miast z podpowiedziami;
- wyszukiwanie głosowe w przeglądarkach obsługujących Web Speech API;
- pobieranie lokalizacji przez przycisk „My location”;
- aktualna temperatura, temperatura odczuwalna, wilgotność, wiatr i opady;
- prognoza na 7 dni oraz prognoza godzinowa od bieżącej godziny;
- wykres temperatury z danymi po najechaniu na punkt;
- ulubione miasta zapisywane w pamięci przeglądarki;
- przełącznik jednostek Celsius/Fahrenheit;
- stany loading, error i no results z możliwością ponowienia;
- responsywny interfejs w ciemnym granatowym motywie.

## Technologie

- React 19, Vite, Tailwind CSS 4
- Open-Meteo Geocoding API i Weather API

## Uruchomienie lokalne

```bash
npm install
npm run dev
```

Sprawdzenie kodu i buildu produkcyjnego:

```bash
npm run lint
npm run build
```

Dane pochodzą z [Open-Meteo](https://open-meteo.com/) i nie wymagają klucza API.
