# 🚀 Space Missions Monitor

Интерактивный каталог космических миссий с фотографиями. 57+ миссий — от советских «Луноходов» и Viking до Artemis II и JWST.

## Возможности

- Фото с марсианских роверов (Curiosity, Perseverance) по солам и камерам
- Снимки лунных, планетарных и астероидных миссий
- Орбитальные аппараты: Cassini, Juno, Voyager, New Horizons и др.
- Космические телескопы: Hubble, JWST, Chandra, Spitzer
- Лайтбокс для просмотра фото в полном размере
- Автоматическое дополнение из Wikimedia Commons при нехватке снимков
- Кеширование API-запросов на клиенте
- Для активных миссий — свежие фото первыми

## Источники данных

- [NASA Mars Rover Photos API](https://rovers.nebulum.one) — raw-фото Curiosity и Perseverance
- [NASA Image and Video Library](https://images.nasa.gov) — все остальные миссии
- [Wikimedia Commons](https://commons.wikimedia.org) — fallback для миссий с малым количеством фото в NASA

## Технологии

Чистый HTML/CSS/JS, без фреймворков и сборки. Все данные загружаются из публичных API на клиенте.

## Деплой

Статический сайт — работает на любом хостинге. Текущий деплой через GitHub Pages.
