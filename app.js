// ── Кеширование API ──

const API_CACHE = {};
const CACHE_TTL = 10 * 60 * 1000; // 10 минут для активных миссий
const CACHE_TTL_INACTIVE = 60 * 60 * 1000; // 1 час для завершённых

async function cachedFetch(url, signal, isActive = false) {
    const now = Date.now();
    const ttl = isActive ? CACHE_TTL : CACHE_TTL_INACTIVE;

    if (API_CACHE[url] && (now - API_CACHE[url].ts < ttl)) {
        return API_CACHE[url].data;
    }

    const res = await fetch(url, { signal });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    API_CACHE[url] = { data, ts: now };
    return data;
}

// ── Конфигурация миссий ──

const MISSIONS = {
    artemis_ii: {
        type: 'nasa-images',
        name: '🔴 Artemis II',
        fullName: 'Artemis II — пилотируемый облёт Луны',
        searchQuery: 'Artemis II Moon',
        defaultYear: 2026,
        nasaCenter: '',
        wikimediaQuery: 'Artemis II mission',
        active: true,
    },
    curiosity: {
        type: 'mars-rover',
        name: 'Curiosity',
        fullName: 'Mars Science Laboratory',
        latestSol: 4855,
        maxSol: 5000,
        location: 'Gale Crater',
        distance: '~35.97 км',
        detail: 'Исследует boxwork formations',
        weatherSensor: 'REMS',
        galleryUrl: 'https://mars.nasa.gov/msl/multimedia/raw-images/?order=sol+desc',
        weatherUrl: 'https://mars.nasa.gov/msl/weather/',
        cameras: [
            { value: 'FHAZ', label: 'FHAZ' },
            { value: 'RHAZ', label: 'RHAZ' },
            { value: 'NAVCAM', label: 'NAVCAM' },
            { value: 'MASTCAM', label: 'MASTCAM' },
            { value: 'MAHLI', label: 'MAHLI' },
            { value: 'CHEMCAM', label: 'CHEMCAM' },
        ],
    },
    perseverance: {
        type: 'mars-rover',
        name: 'Perseverance',
        fullName: 'Mars 2020',
        latestSol: 1800,
        maxSol: 2000,
        location: 'Jezero Crater',
        distance: '~30 км',
        detail: 'Сбор образцов грунта для возврата на Землю',
        weatherSensor: 'MEDA',
        galleryUrl: 'https://mars.nasa.gov/mars2020/multimedia/raw-images/',
        weatherUrl: 'https://mars.nasa.gov/mars2020/weather/',
        cameras: [
            { value: 'EDL_RUCAM', label: 'EDL RUCAM' },
            { value: 'EDL_RDCAM', label: 'EDL RDCAM' },
            { value: 'EDL_DDCAM', label: 'EDL DDCAM' },
            { value: 'EDL_PUCAM1', label: 'EDL PUCAM1' },
            { value: 'EDL_PUCAM2', label: 'EDL PUCAM2' },
            { value: 'FRONT_HAZCAM_LEFT_A', label: 'Front Hazcam Left' },
            { value: 'FRONT_HAZCAM_RIGHT_A', label: 'Front Hazcam Right' },
            { value: 'REAR_HAZCAM_LEFT', label: 'Rear Hazcam Left' },
            { value: 'REAR_HAZCAM_RIGHT', label: 'Rear Hazcam Right' },
            { value: 'NAVCAM_LEFT', label: 'Navcam Left' },
            { value: 'NAVCAM_RIGHT', label: 'Navcam Right' },
            { value: 'MCZ_LEFT', label: 'Mastcam-Z Left' },
            { value: 'MCZ_RIGHT', label: 'Mastcam-Z Right' },
            { value: 'SUPERCAM_RMI', label: 'SuperCam RMI' },
            { value: 'SKYCAM', label: 'SkyCam' },
            { value: 'SHERLOC_WATSON', label: 'SHERLOC Watson' },
        ],
    },
    spirit: {
        type: 'nasa-images',
        name: 'Spirit',
        fullName: 'MER-A — Spirit',
        searchQuery: 'Spirit Mars rover',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Spirit rover Mars MER-A',
    },
    opportunity: {
        type: 'nasa-images',
        name: 'Opportunity',
        fullName: 'MER-B — Opportunity',
        searchQuery: 'Opportunity Mars rover',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Opportunity rover Mars MER-B',
    },
    lro: {
        type: 'nasa-images', name: 'LRO', fullName: 'Lunar Reconnaissance Orbiter',
        searchQuery: 'Lunar Reconnaissance Orbiter', defaultYear: '', nasaCenter: '',
    },
    chandrayaan3: {
        type: 'nasa-images',
        name: 'Chandrayaan-3',
        fullName: 'Chandrayaan-3 Pragyan',
        searchQuery: 'Chandrayaan',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Chandrayaan-3',
    },
    yutu2: {
        type: 'nasa-images',
        name: 'Yutu-2',
        fullName: "Chang'e 4 — Yutu-2",
        searchQuery: 'Yutu lunar rover',
        fallbackQueries: ['China moon rover', 'Chang-e lunar'],
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: "Chang'e 4",
    },
    zhurong: {
        type: 'nasa-images',
        name: 'Zhurong',
        fullName: 'Tianwen-1 — Zhurong',
        searchQuery: 'Zhurong',
        fallbackQueries: ['China Mars rover', 'Tianwen Mars'],
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Zhurong rover',
    },
    slim: {
        type: 'nasa-images',
        name: 'SLIM',
        fullName: 'SLIM — LEV-1/LEV-2 (SORA-Q)',
        searchQuery: 'JAXA moon',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'SLIM JAXA lunar',
    },
    lunokhod1: {
        type: 'nasa-images',
        name: 'Луноход-1',
        fullName: 'Luna 17 — Луноход-1',
        searchQuery: 'Lunokhod',
        fallbackQueries: ['Luna 17', 'Soviet lunar rover'],
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Lunokhod 1',
    },
    lunokhod2: {
        type: 'nasa-images',
        name: 'Луноход-2',
        fullName: 'Luna 21 — Луноход-2',
        searchQuery: 'Lunokhod 2',
        fallbackQueries: ['Luna 21', 'Lunokhod'],
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Lunokhod 2',
    },
    sojourner: {
        type: 'nasa-images',
        name: 'Sojourner',
        fullName: 'Mars Pathfinder — Sojourner',
        searchQuery: 'Sojourner Mars Pathfinder',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Sojourner Mars Pathfinder rover',
    },
    ingenuity: {
        type: 'nasa-images',
        name: 'Ingenuity',
        fullName: 'Mars Helicopter — Ingenuity',
        searchQuery: 'Ingenuity Mars helicopter',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Ingenuity helicopter Mars',
    },
    phoenix: {
        type: 'nasa-images',
        name: 'Phoenix',
        fullName: 'Phoenix Mars Lander',
        searchQuery: 'Phoenix Mars lander',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Phoenix Mars lander',
    },
    insight: {
        type: 'nasa-images',
        name: 'InSight',
        fullName: 'InSight Mars Lander',
        searchQuery: 'InSight Mars lander',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'InSight Mars lander',
    },
    viking: {
        type: 'nasa-images',
        name: 'Viking',
        fullName: 'Viking 1 & 2 Landers',
        searchQuery: 'Viking Mars lander surface',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Viking lander Mars',
    },
    apollo_lrv: {
        type: 'nasa-images',
        name: 'Apollo LRV',
        fullName: 'Apollo Lunar Roving Vehicle',
        searchQuery: 'Apollo lunar roving vehicle',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Apollo Lunar Roving Vehicle',
    },
    huygens: {
        type: 'nasa-images',
        name: 'Huygens',
        fullName: 'Huygens — посадка на Титан',
        searchQuery: 'Huygens Titan probe',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Huygens probe Titan',
    },
    philae: {
        type: 'nasa-images',
        name: 'Philae',
        fullName: 'Rosetta / Philae — комета 67P',
        searchQuery: 'Rosetta comet 67P Philae',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Rosetta spacecraft comet 67P',
    },
    venera: {
        type: 'nasa-images',
        name: 'Венера',
        fullName: 'Венера-9…14 — поверхность Венеры',
        searchQuery: 'Venera Venus surface',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Venera Venus lander surface',
    },
    cassini: {
        type: 'nasa-images',
        name: 'Cassini',
        fullName: 'Cassini — Сатурн и спутники',
        searchQuery: 'Cassini Saturn',
        defaultYear: '',
        nasaCenter: '',
    },
    juno: {
        type: 'nasa-images', name: 'Juno', fullName: 'Juno — Юпитер',
        searchQuery: 'Juno Jupiter', defaultYear: '', nasaCenter: '',
        active: true,
    },
    new_horizons: {
        type: 'nasa-images', name: 'New Horizons', fullName: 'New Horizons — Плутон и пояс Койпера',
        searchQuery: 'New Horizons Pluto', defaultYear: '', nasaCenter: '',
    },
    voyager: {
        type: 'nasa-images', name: 'Voyager', fullName: 'Voyager 1 & 2 — дальний космос',
        searchQuery: 'Voyager spacecraft planet', defaultYear: '', nasaCenter: '',
    },
    osiris_rex: {
        type: 'nasa-images',
        name: 'OSIRIS-REx',
        fullName: 'OSIRIS-REx — астероид Бенну',
        searchQuery: 'OSIRIS-REx asteroid Bennu',
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'OSIRIS-REx Bennu',
        active: true,
    },
    hayabusa2: {
        type: 'nasa-images',
        name: 'Hayabusa2',
        fullName: 'Hayabusa2 — астероид Рюгу',
        searchQuery: 'Hayabusa2 asteroid Ryugu',
        fallbackQueries: ['Hayabusa asteroid', 'JAXA asteroid'],
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: 'Hayabusa2 Ryugu',
    },
    messenger: {
        type: 'nasa-images',
        name: 'MESSENGER',
        fullName: 'MESSENGER — Меркурий',
        searchQuery: 'MESSENGER Mercury planet',
        defaultYear: '',
        nasaCenter: '',
    },
    dawn: {
        type: 'nasa-images',
        name: 'Dawn',
        fullName: 'Dawn — Веста и Церера',
        searchQuery: 'Dawn spacecraft Ceres Vesta',
        defaultYear: '',
        nasaCenter: '',
    },
    mro: {
        type: 'nasa-images',
        name: 'MRO',
        fullName: 'Mars Reconnaissance Orbiter',
        searchQuery: 'Mars Reconnaissance Orbiter HiRISE',
        defaultYear: '',
        nasaCenter: '',
        active: true,
    },
    chang_e3: {
        type: 'nasa-images',
        name: "Chang'e 3",
        fullName: "Chang'e 3 — Yutu",
        searchQuery: "Chang'e 3 Yutu",
        fallbackQueries: ['China lunar rover Yutu'],
        defaultYear: '',
        nasaCenter: '',
        wikimediaQuery: "Chang'e 3 Yutu rover",
    },
    // ── Марс орбитеры ──
    mars_express: {
        type: 'nasa-images', name: 'Mars Express', fullName: 'Mars Express (ESA)',
        searchQuery: 'Mars Express ESA', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Mars Express spacecraft',
    },
    maven: {
        type: 'nasa-images', name: 'MAVEN', fullName: 'MAVEN — атмосфера Марса',
        searchQuery: 'MAVEN Mars', defaultYear: '', nasaCenter: '',
    },
    mars_odyssey: {
        type: 'nasa-images', name: 'Odyssey', fullName: 'Mars Odyssey',
        searchQuery: 'Mars Odyssey', defaultYear: '', nasaCenter: '', active: true,
    },
    mangalyaan: {
        type: 'nasa-images', name: 'Mangalyaan', fullName: 'Mars Orbiter Mission (ISRO)',
        searchQuery: 'Mars Orbiter Mission India', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Mars Orbiter Mission Mangalyaan',
    },
    exomars_tgo: {
        type: 'nasa-images', name: 'ExoMars TGO', fullName: 'ExoMars Trace Gas Orbiter',
        searchQuery: 'ExoMars Trace Gas Orbiter', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'ExoMars Trace Gas Orbiter',
    },
    // ── Луна дополнительно ──
    chandrayaan1: {
        type: 'nasa-images', name: 'Chandrayaan-1', fullName: 'Chandrayaan-1 (ISRO)',
        searchQuery: 'Chandrayaan-1', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Chandrayaan-1',
    },
    kaguya: {
        type: 'nasa-images', name: 'Kaguya', fullName: 'SELENE/Kaguya (JAXA)',
        searchQuery: 'Kaguya SELENE Moon', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'SELENE Kaguya Moon',
    },
    grail: {
        type: 'nasa-images', name: 'GRAIL', fullName: 'GRAIL — гравитация Луны',
        searchQuery: 'GRAIL Moon', defaultYear: '', nasaCenter: '',
    },
    lcross: {
        type: 'nasa-images', name: 'LCROSS', fullName: 'LCROSS — вода на Луне',
        searchQuery: 'LCROSS Moon', defaultYear: '', nasaCenter: '',
    },
    odysseus_im1: {
        type: 'nasa-images', name: 'Odysseus', fullName: 'IM-1 Odysseus (Intuitive Machines)',
        searchQuery: 'Odysseus lunar lander', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Intuitive Machines Odysseus',
    },
    // ── Венера ──
    magellan: {
        type: 'nasa-images', name: 'Magellan', fullName: 'Magellan — радар Венеры',
        searchQuery: 'Magellan Venus', defaultYear: '', nasaCenter: '',
    },
    akatsuki: {
        type: 'nasa-images', name: 'Akatsuki', fullName: 'Akatsuki — Венера (JAXA)',
        searchQuery: 'Akatsuki Venus', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Akatsuki Venus spacecraft',
    },
    venus_express: {
        type: 'nasa-images', name: 'Venus Express', fullName: 'Venus Express (ESA)',
        searchQuery: 'Venus Express', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Venus Express spacecraft',
    },
    // ── Юпитер ──
    galileo: {
        type: 'nasa-images', name: 'Galileo', fullName: 'Galileo — Юпитер',
        searchQuery: 'Galileo Jupiter spacecraft', defaultYear: '', nasaCenter: '',
    },
    europa_clipper: {
        type: 'nasa-images', name: 'Europa Clipper', fullName: 'Europa Clipper — Европа',
        searchQuery: 'Europa Clipper', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Europa Clipper spacecraft', active: true,
    },
    juice: {
        type: 'nasa-images', name: 'JUICE', fullName: 'JUICE — Юпитер (ESA)',
        searchQuery: 'JUICE Jupiter ESA', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'JUICE spacecraft Jupiter',
    },
    // ── Солнце ──
    parker: {
        type: 'nasa-images', name: 'Parker', fullName: 'Parker Solar Probe',
        searchQuery: 'Parker Solar Probe', defaultYear: '', nasaCenter: '', active: true,
    },
    soho: {
        type: 'nasa-images', name: 'SOHO', fullName: 'SOHO — Солнце',
        searchQuery: 'SOHO Sun', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'SOHO spacecraft Sun',
    },
    solar_orbiter: {
        type: 'nasa-images', name: 'Solar Orbiter', fullName: 'Solar Orbiter (ESA/NASA)',
        searchQuery: 'Solar Orbiter', defaultYear: '', nasaCenter: '', active: true,
    },
    // ── Астероиды/кометы дополнительно ──
    hayabusa1: {
        type: 'nasa-images', name: 'Hayabusa', fullName: 'Hayabusa — астероид Итокава',
        searchQuery: 'Hayabusa asteroid Itokawa', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Hayabusa Itokawa',
    },
    stardust: {
        type: 'nasa-images', name: 'Stardust', fullName: 'Stardust — комета Вильд-2',
        searchQuery: 'Stardust comet Wild', defaultYear: '', nasaCenter: '',
    },
    deep_impact: {
        type: 'nasa-images', name: 'Deep Impact', fullName: 'Deep Impact — комета Темпель-1',
        searchQuery: 'Deep Impact comet Tempel', defaultYear: '', nasaCenter: '',
    },
    near_shoemaker: {
        type: 'nasa-images', name: 'NEAR', fullName: 'NEAR Shoemaker — астероид Эрос',
        searchQuery: 'NEAR Shoemaker Eros', defaultYear: '', nasaCenter: '',
    },
    lucy: {
        type: 'nasa-images', name: 'Lucy', fullName: 'Lucy — троянские астероиды',
        searchQuery: 'Lucy spacecraft asteroid', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Lucy spacecraft asteroid',
    },
    dart: {
        type: 'nasa-images', name: 'DART', fullName: 'DART — Диморфос',
        searchQuery: 'DART asteroid Dimorphos', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'DART spacecraft asteroid',
    },
    // ── Телескопы ──
    hubble: {
        type: 'nasa-images', name: 'Hubble', fullName: 'Hubble Space Telescope',
        searchQuery: 'Hubble Space Telescope', defaultYear: '', nasaCenter: '',
    },
    jwst: {
        type: 'nasa-images', name: 'JWST', fullName: 'James Webb Space Telescope',
        searchQuery: 'James Webb Space Telescope', defaultYear: '', nasaCenter: '',
    },
    chandra: {
        type: 'nasa-images', name: 'Chandra', fullName: 'Chandra X-ray Observatory',
        searchQuery: 'Chandra X-ray Observatory', defaultYear: '', nasaCenter: '',
    },
    spitzer: {
        type: 'nasa-images', name: 'Spitzer', fullName: 'Spitzer Space Telescope',
        searchQuery: 'Spitzer Space Telescope', defaultYear: '', nasaCenter: '',
    },
    // ── Другие лунные ──
    chang_e5: {
        type: 'nasa-images', name: "Chang'e 5", fullName: "Chang'e 5 — возврат грунта",
        searchQuery: "Chang'e 5", defaultYear: '', nasaCenter: '',
        wikimediaQuery: "Chang'e 5 lunar",
    },
    chang_e6: {
        type: 'nasa-images', name: "Chang'e 6", fullName: "Chang'e 6 — обратная сторона",
        searchQuery: "Chang'e 6", defaultYear: '', nasaCenter: '',
        wikimediaQuery: "Chang'e 6 lunar",
    },
    beresheet: {
        type: 'nasa-images', name: 'Beresheet', fullName: 'Beresheet (SpaceIL, Израиль)',
        searchQuery: 'Beresheet lunar', defaultYear: '', nasaCenter: '',
        wikimediaQuery: 'Beresheet spacecraft',
    },
};

const state = {};
let activeMission = 'curiosity';

function debounce(fn, delay = 400) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

function getEls(id) {
    return {
        missionInfo: document.getElementById(`${id}-mission-info`),
        photos: document.getElementById(`${id}-photos-container`),
        weather: document.getElementById(`${id}-weather-container`),
        controls: document.getElementById(`${id}-controls`),
    };
}

// ── Марсианские роверы (nebulum API) ──

async function fetchWeatherData(missionId, sol) {
    const s = state[missionId];
    if (s.weatherAbort) s.weatherAbort.abort();
    s.weatherAbort = new AbortController();

    const els = getEls(missionId);
    if (!els.weather) return;

    els.weather.innerHTML = '<p class="loading">Загрузка погоды...</p>';
    const url = `https://marsweather.ingenology.com/v1/archive/?sol=${sol}`;

    try {
        const data = await cachedFetch(url, s.weatherAbort.signal);
        const r = data.results?.[0] || data;
        if (!r?.sol) throw new Error('No data');

        const m = MISSIONS[missionId];
        els.weather.innerHTML = `
            <p><strong>Сол:</strong> ${r.sol}</p>
            <p><strong>Температура:</strong> ${r.min_temp?.toFixed(1) ?? '?'}°C / ${r.max_temp?.toFixed(1) ?? '?'}°C</p>
            <p><strong>Давление:</strong> ${r.pressure?.toFixed(1) ?? '?'} Pa</p>
            <p><strong>Оптическая плотность:</strong> ${r.atmo_opacity || r.relative_humidity || '?'}</p>
            ${r.wind_speed ? `<p><strong>Ветер:</strong> ~${r.wind_speed} м/с</p>` : ''}
            <p style="color:var(--success); font-size:13px;">✓ ${m.weatherSensor} • ${m.location}</p>
        `;
    } catch (e) {
        if (e.name === 'AbortError') return;
        const m = MISSIONS[missionId];
        els.weather.innerHTML = `
            <p style="color:var(--error);">Погода недоступна (сол ${sol})</p>
            <p><a href="${m.weatherUrl}" target="_blank" rel="noopener">Погода на NASA</a></p>
        `;
    }
}

async function fetchMarsRover(missionId, sol = null) {
    const m = MISSIONS[missionId];
    const s = state[missionId];
    if (s.dataAbort) s.dataAbort.abort();
    s.dataAbort = new AbortController();

    const els = getEls(missionId);
    const solInput = document.getElementById(`${missionId}-sol-input`);
    const camSelect = document.getElementById(`${missionId}-camera-select`);

    const selectedSol = sol ?? (solInput ? parseInt(solInput.value) || m.latestSol : m.latestSol);
    const camera = camSelect?.value !== 'all' ? camSelect?.value : '';

    els.missionInfo.innerHTML = `<h2>${m.name} (${m.fullName})</h2><p>Загрузка (сол ${selectedSol})...</p>`;
    els.photos.innerHTML = '<p class="loading">Загрузка фото...</p>';

    let url = `https://rovers.nebulum.one/api/v1/rovers/${missionId}/photos?sol=${selectedSol}`;
    if (camera) url += `&camera=${camera}`;

    try {
        const data = await cachedFetch(url, s.dataAbort.signal, true);
        const photos = data.photos?.slice(0, 30) || [];

        els.missionInfo.innerHTML = `
            <h2>${m.name} Rover (${m.fullName})</h2>
            <p><strong>Сол:</strong> ${selectedSol} (активен на апрель 2026)</p>
            <p><strong>Дата на Земле:</strong> ${photos[0]?.earth_date || 'Апрель 2026'}</p>
            <p><strong>Расстояние:</strong> ${m.distance}</p>
            <p><strong>Фото на соле:</strong> ${photos.length}</p>
            <p><strong>Место:</strong> ${m.location} • ${m.detail}</p>
            <p style="color:var(--success);">✓ Ровер активен • Данные из публичного зеркала NASA</p>
        `;

        renderMarsPhotos(els.photos, photos, m);
        fetchWeatherData(missionId, selectedSol);
    } catch (e) {
        if (e.name === 'AbortError') { fetchWeatherData(missionId, selectedSol); return; }
        els.missionInfo.innerHTML = `<h2>${m.name}</h2><p style="color:var(--error);">API недоступен (сол ${selectedSol})</p>`;
        els.photos.innerHTML = `<p>Фото не загружены. <a href="${m.galleryUrl}" target="_blank" rel="noopener">Галерея NASA</a></p>`;
        fetchWeatherData(missionId, selectedSol);
    }
}

function renderMarsPhotos(container, photos, mission) {
    container.innerHTML = '';
    if (!photos.length) {
        container.innerHTML = '<p class="loading">Фото не найдены на этом соле. Попробуйте другой.</p>';
        return;
    }
    photos.forEach(p => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.setAttribute('role', 'listitem');
        const camName = p.camera?.full_name || p.camera?.name || '?';
        const title = `${mission.name} Sol ${p.sol} — ${camName}`;
        card.innerHTML = `
            <img src="${p.img_src}" alt="${title}"
                 loading="lazy" onerror="this.src='https://via.placeholder.com/300x200/333/fff?text=Недоступно';this.onerror=null;">
            <div class="photo-info">
                <strong>Sol ${p.sol}</strong><br>
                ${p.earth_date || '?'} • ${camName}<br>
                <a href="${p.img_src}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Оригинал</a>
            </div>
        `;
        card.addEventListener('click', () => openLightbox(p.img_src, title, `${p.earth_date || ''} • ${camName}`, p.img_src, 'Открыть оригинал'));
        container.appendChild(card);
    });
}

// ── NASA Image Library (лунные миссии) ──

async function fetchNasaImages(missionId, query = null, page = 1, _fallbackIdx = 0) {
    const m = MISSIONS[missionId];
    const s = state[missionId];
    const append = page > 1;

    if (!append) {
        if (s.dataAbort) s.dataAbort.abort();
        s.dataAbort = new AbortController();
    }

    const els = getEls(missionId);
    const searchInput = document.getElementById(`${missionId}-search-input`);
    const yearInput = document.getElementById(`${missionId}-year-input`);

    const q = query || searchInput?.value || m.searchQuery;
    const year = yearInput ? yearInput.value : '';

    if (!append) {
        els.photos.innerHTML = '<p class="loading">Поиск изображений...</p>';
    }

    // Убираем sentinel если есть
    const oldSentinel = els.photos.querySelector('.scroll-sentinel');
    if (oldSentinel) oldSentinel.remove();

    let url = `https://images-api.nasa.gov/search?q=${encodeURIComponent(q)}&media_type=image&page=${page}&page_size=30`;

    if (m.active && !year && !query) {
        const currentYear = new Date().getFullYear();
        url += `&year_start=${currentYear - 1}&year_end=${currentYear}`;
    } else if (year) {
        url += `&year_start=${year}&year_end=${year}`;
    }
    if (m.nasaCenter) url += `&center=${m.nasaCenter}`;

    try {
        const data = await cachedFetch(url, s.dataAbort.signal, m.active);
        let items = data.collection?.items || [];
        let totalHits = data.collection?.metadata?.total_hits || 0;

        if (m.active && items.length > 0) {
            items.sort((a, b) => {
                const da = a.data?.[0]?.date_created || '';
                const db = b.data?.[0]?.date_created || '';
                return db.localeCompare(da);
            });
        }

        if (totalHits === 0 && m.fallbackQueries && _fallbackIdx < m.fallbackQueries.length && !query) {
            return fetchNasaImages(missionId, m.fallbackQueries[_fallbackIdx], page, _fallbackIdx + 1);
        }

        if (totalHits < 50 && m.wikimediaQuery && page === 1) {
            const wikiItems = await fetchWikimediaCommons(m.wikimediaQuery, 30 - items.length, s.dataAbort.signal);
            renderCombinedPhotos(els.photos, items, wikiItems, totalHits, missionId, q, page);
        } else {
            renderNasaPhotos(els.photos, items, totalHits, missionId, q, page, append);
        }

        // Сохраняем состояние для infinite scroll
        const maxPage = Math.ceil(totalHits / 30);
        s.scrollQuery = q;
        s.scrollPage = page;
        s.scrollMaxPage = Math.min(maxPage, 100);
        s.scrollLoading = false;

    } catch (e) {
        if (e.name === 'AbortError') return;
        s.scrollLoading = false;
        if (!append) {
            if (m.wikimediaQuery) {
                try {
                    els.photos.innerHTML = '<p class="loading">NASA API недоступен, ищем в Wikimedia Commons...</p>';
                    const wikiItems = await fetchWikimediaCommons(m.wikimediaQuery, 30);
                    renderCombinedPhotos(els.photos, [], wikiItems, 0, missionId, m.wikimediaQuery, 1);
                } catch (e2) {
                    els.photos.innerHTML = '<p style="color:var(--error);">Ошибка загрузки изображений</p>';
                }
            } else {
                els.photos.innerHTML = '<p style="color:var(--error);">Ошибка загрузки из NASA Image Library</p>';
            }
        }
    }
}

function renderNasaPhotos(container, items, totalHits, missionId, query, page, append = false) {
    if (!append) {
        container.innerHTML = '';

        if (!items.length) {
            container.innerHTML = '<p class="loading">Изображения не найдены. Попробуйте другой запрос.</p>';
            return;
        }

        const info = document.createElement('div');
        info.className = 'search-results-info';
        info.innerHTML = `Найдено: ${totalHits}`;
        container.appendChild(info);
    }

    // Убираем старый sentinel
    const oldSentinel = container.querySelector('.scroll-sentinel');
    if (oldSentinel) oldSentinel.remove();

    items.forEach(item => {
        const imgData = item.data?.[0];
        const links = item.links;
        const imgSrc = links?.[0]?.href || '';
        if (!imgSrc) return;

        const card = document.createElement('div');
        card.className = 'photo-card';
        card.setAttribute('role', 'listitem');

        const title = imgData?.title || 'Без названия';
        const date = imgData?.date_created ? imgData.date_created.split('T')[0] : '?';
        const desc = imgData?.description ? imgData.description.substring(0, 120) + '...' : '';
        const nasaId = imgData?.nasa_id || '';
        const detailUrl = nasaId ? `https://images.nasa.gov/details/${nasaId}` : imgSrc;

        card.innerHTML = `
            <img src="${imgSrc}" alt="${title}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200/333/fff?text=Недоступно';this.onerror=null;">
            <div class="photo-info">
                <strong>${title}</strong><br>
                ${date} ${imgData?.center ? '• ' + imgData.center : ''}<br>
                ${desc ? `<span class="photo-desc">${desc}</span><br>` : ''}
                <a href="${detailUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Подробнее на NASA</a>
            </div>
        `;
        card.addEventListener('click', () => openLightbox(imgSrc, title, `${date} • ${desc}`, detailUrl, 'Подробнее на NASA'));
        container.appendChild(card);
    });

    // Добавляем sentinel для infinite scroll если есть ещё страницы
    const maxPage = Math.ceil(totalHits / 30);
    if (page < Math.min(maxPage, 100) && items.length > 0) {
        const sentinel = document.createElement('div');
        sentinel.className = 'scroll-sentinel';
        sentinel.innerHTML = '<p class="loading">Загрузка...</p>';
        container.appendChild(sentinel);
        observeSentinel(sentinel, missionId);
    }
}

// ── Wikimedia Commons fallback ──

async function fetchWikimediaCommons(query, limit = 30, signal = null) {
    const encoded = encodeURIComponent(query);
    const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encoded}&srnamespace=6&srlimit=${limit}&format=json&origin=*`;

    const res = await fetch(searchUrl, {
        signal,
        headers: { 'Api-User-Agent': 'SpaceRoversMonitor/1.0' },
    });
    if (!res.ok) throw new Error(`Wikimedia HTTP ${res.status}`);
    const data = await res.json();
    const results = data.query?.search || [];
    if (!results.length) return [];

    // Получаем URL-ы картинок
    const titles = results.map(r => r.title).join('|');
    const infoUrl = `https://commons.wikimedia.org/w/api.php?action=query&titles=${encodeURIComponent(titles)}&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=400&format=json&origin=*`;

    const res2 = await fetch(infoUrl, {
        signal,
        headers: { 'Api-User-Agent': 'SpaceRoversMonitor/1.0' },
    });
    if (!res2.ok) return [];
    const data2 = await res2.json();
    const pages = data2.query?.pages || {};

    return Object.values(pages)
        .filter(p => p.imageinfo?.[0]?.thumburl)
        .map(p => {
            const ii = p.imageinfo[0];
            const meta = ii.extmetadata || {};
            const rawDesc = meta.ImageDescription?.value || '';
            // Strip HTML tags from description
            const desc = rawDesc.replace(/<[^>]*>/g, '').substring(0, 120);
            return {
                source: 'wikimedia',
                title: p.title.replace('File:', '').replace(/\.\w+$/, ''),
                thumbUrl: ii.thumburl,
                pageUrl: ii.descriptionurl,
                desc,
            };
        });
}

function renderCombinedPhotos(container, nasaItems, wikiItems, nasaTotalHits, missionId, query, page) {
    container.innerHTML = '';

    const hasNasa = nasaItems.length > 0;
    const hasWiki = wikiItems.length > 0;

    if (!hasNasa && !hasWiki) {
        container.innerHTML = '<p class="loading">Изображения не найдены. Попробуйте другой запрос.</p>';
        return;
    }

    const info = document.createElement('div');
    info.className = 'search-results-info';
    const parts = [];
    if (hasNasa) parts.push(`NASA: ${nasaTotalHits}`);
    if (hasWiki) parts.push(`Wikimedia Commons: ${wikiItems.length}`);
    info.innerHTML = parts.join(' • ');
    container.appendChild(info);

    // NASA photos
    nasaItems.forEach(item => {
        const imgData = item.data?.[0];
        const links = item.links;
        const imgSrc = links?.[0]?.href || '';
        if (!imgSrc) return;

        const card = document.createElement('div');
        card.className = 'photo-card';
        card.setAttribute('role', 'listitem');

        const title = imgData?.title || 'Без названия';
        const date = imgData?.date_created ? imgData.date_created.split('T')[0] : '?';
        const desc = imgData?.description ? imgData.description.substring(0, 120) + '...' : '';
        const nasaId = imgData?.nasa_id || '';
        const detailUrl = nasaId ? `https://images.nasa.gov/details/${nasaId}` : imgSrc;

        card.innerHTML = `
            <img src="${imgSrc}" alt="${title}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200/333/fff?text=Недоступно';this.onerror=null;">
            <div class="photo-info">
                <span class="source-badge nasa">NASA</span>
                <strong>${title}</strong><br>
                ${date} ${imgData?.center ? '• ' + imgData.center : ''}<br>
                ${desc ? `<span class="photo-desc">${desc}</span><br>` : ''}
                <a href="${detailUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Подробнее</a>
            </div>
        `;
        card.addEventListener('click', () => openLightbox(imgSrc, title, `${date} • ${desc}`, detailUrl, 'Подробнее на NASA'));
        container.appendChild(card);
    });

    // Wikimedia photos
    wikiItems.forEach(item => {
        const card = document.createElement('div');
        card.className = 'photo-card';
        card.setAttribute('role', 'listitem');

        // Получаем полноразмерный URL из thumb (убираем /thumb/ и размер)
        const fullUrl = item.thumbUrl.replace(/\/thumb\//, '/').replace(/\/\d+px-[^/]+$/, '');

        card.innerHTML = `
            <img src="${item.thumbUrl}" alt="${item.title}" loading="lazy"
                 onerror="this.src='https://via.placeholder.com/300x200/333/fff?text=Недоступно';this.onerror=null;">
            <div class="photo-info">
                <span class="source-badge wiki">Wikimedia</span>
                <strong>${item.title}</strong><br>
                ${item.desc ? `<span class="photo-desc">${item.desc}</span><br>` : ''}
                <a href="${item.pageUrl}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Открыть на Commons</a>
            </div>
        `;
        card.addEventListener('click', () => openLightbox(fullUrl, item.title, item.desc, item.pageUrl, 'Открыть на Commons'));
        container.appendChild(card);
    });
}

// ── Инициализация контролов ──

function initMarsControls(id) {
    const m = MISSIONS[id];
    const container = document.getElementById(`${id}-controls`);
    if (!container) return;

    const opts = m.cameras.map(c => `<option value="${c.value}">${c.label}</option>`).join('');
    container.innerHTML = `
        <label>Сол: <input type="number" id="${id}-sol-input" value="${m.latestSol}" min="0" max="${m.maxSol}"></label>
        <label>Камера:
            <select id="${id}-camera-select">
                <option value="all">Все камеры</option>
                ${opts}
            </select>
        </label>
        <button class="ctrl-btn load-btn" data-mission="${id}">Загрузить</button>
        <button class="ctrl-btn latest-btn" data-mission="${id}">Latest (~${m.latestSol})</button>
        <button class="ctrl-btn random-btn" data-mission="${id}">Случайный</button>
    `;

    container.addEventListener('click', (e) => {
        const btn = e.target;
        const mid = btn.dataset.mission;
        if (!mid) return;
        if (btn.classList.contains('load-btn')) fetchMarsRover(mid);
        if (btn.classList.contains('latest-btn')) fetchMarsRover(mid, MISSIONS[mid].latestSol);
        if (btn.classList.contains('random-btn')) fetchMarsRover(mid, Math.floor(Math.random() * MISSIONS[mid].latestSol) + 1);
    });

    const solInput = document.getElementById(`${id}-sol-input`);
    if (solInput) solInput.addEventListener('input', debounce(() => fetchMarsRover(id)));
}

function initNasaImageControls(id) {
    const m = MISSIONS[id];
    const container = document.getElementById(`${id}-controls`);
    if (!container) return;

    container.innerHTML = `
        <label>Поиск: <input type="text" id="${id}-search-input" value="${m.searchQuery}" placeholder="Ключевые слова..."></label>
        <label>Год: <input type="number" id="${id}-year-input" value="${m.defaultYear}" min="1960" max="2026" placeholder="Любой"></label>
        <button class="ctrl-btn search-btn" data-mission="${id}">Найти</button>
        <button class="ctrl-btn reset-btn" data-mission="${id}">Сбросить</button>
    `;

    container.addEventListener('click', (e) => {
        const btn = e.target;
        const mid = btn.dataset.mission;
        if (!mid) return;
        if (btn.classList.contains('search-btn')) fetchNasaImages(mid);
        if (btn.classList.contains('reset-btn')) {
            document.getElementById(`${mid}-search-input`).value = MISSIONS[mid].searchQuery;
            document.getElementById(`${mid}-year-input`).value = MISSIONS[mid].defaultYear;
            fetchNasaImages(mid);
        }
    });

    const searchInput = document.getElementById(`${id}-search-input`);
    if (searchInput) {
        searchInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') fetchNasaImages(id);
        });
    }
}

// ── Переключение вкладок ──

function switchTab(missionId) {
    activeMission = missionId;

    document.querySelectorAll('.tab').forEach(tab => {
        const isActive = tab.dataset.mission === missionId;
        tab.classList.toggle('active', isActive);
        tab.setAttribute('aria-selected', isActive);
    });

    document.querySelectorAll('.mission-panel').forEach(panel => {
        panel.classList.toggle('active', panel.id === `panel-${missionId}`);
    });

    const s = state[missionId];
    if (!s.loaded) {
        s.loaded = true;
        loadMission(missionId);
    }
}

function loadMission(id) {
    const m = MISSIONS[id];
    if (m.type === 'mars-rover') {
        fetchMarsRover(id, m.latestSol);
    } else if (m.type === 'nasa-images') {
        fetchNasaImages(id);
    }
}

// ── Lightbox ──

function openLightbox(imgSrc, title, caption, linkUrl, linkText) {
    const lb = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const cap = document.getElementById('lightbox-caption');

    img.src = imgSrc;
    img.alt = title;
    cap.innerHTML = `<strong>${title}</strong>${caption ? '<br>' + caption : ''}${linkUrl ? `<br><a href="${linkUrl}" target="_blank" rel="noopener">${linkText || 'Источник'}</a>` : ''}`;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    const lb = document.getElementById('lightbox');
    lb.hidden = true;
    document.getElementById('lightbox-img').src = '';
    document.body.style.overflow = '';
}

function initLightbox() {
    const lb = document.getElementById('lightbox');
    lb.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
    lb.querySelector('.lightbox-close').addEventListener('click', closeLightbox);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !lb.hidden) closeLightbox();
    });
}

// ── Infinite Scroll ──

function observeSentinel(sentinel, missionId) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            observer.disconnect();
            const s = state[missionId];
            if (s.scrollLoading || s.scrollPage >= s.scrollMaxPage) return;
            s.scrollLoading = true;
            fetchNasaImages(missionId, s.scrollQuery, s.scrollPage + 1);
        });
    }, { rootMargin: '400px' });
    observer.observe(sentinel);
}

// ── Scroll to Top ──

function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Наверх');
    btn.innerHTML = '↑';
    btn.hidden = true;
    document.body.appendChild(btn);

    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

    window.addEventListener('scroll', () => {
        btn.hidden = window.scrollY < 600;
    }, { passive: true });
}

// ── Init ──

function generateTabs() {
    const nav = document.querySelector('.tabs');
    Object.entries(MISSIONS).forEach(([id, m], i) => {
        const btn = document.createElement('button');
        btn.className = 'tab' + (i === 0 ? ' active' : '');
        btn.role = 'tab';
        btn.setAttribute('aria-selected', i === 0);
        btn.dataset.mission = id;
        btn.textContent = m.name;
        nav.appendChild(btn);
    });
}

const MISSION_YEARS = {
    artemis_ii: [2026], curiosity: [2012], perseverance: [2021],
    spirit: [2004, 2010], opportunity: [2004, 2018], lro: [2009],
    chandrayaan3: [2023, 2023], yutu2: [2019], zhurong: [2021, 2022],
    slim: [2024, 2024], lunokhod1: [1970, 1971], lunokhod2: [1973, 1973],
    sojourner: [1997, 1997], ingenuity: [2021, 2024], phoenix: [2008, 2008],
    insight: [2018, 2022], viking: [1976, 1982], apollo_lrv: [1971, 1972],
    huygens: [2005, 2005], philae: [2014, 2016], venera: [1975, 1982],
    cassini: [2004, 2017], juno: [2016], new_horizons: [2015],
    voyager: [1977], osiris_rex: [2016], hayabusa2: [2018],
    messenger: [2011, 2015], dawn: [2011, 2018], mro: [2006],
    chang_e3: [2013, 2016], mars_express: [2003], maven: [2014],
    mars_odyssey: [2001], mangalyaan: [2014, 2022], exomars_tgo: [2016],
    chandrayaan1: [2008, 2009], kaguya: [2007, 2009], grail: [2012, 2012],
    lcross: [2009, 2009], odysseus_im1: [2024, 2024], magellan: [1990, 1994],
    akatsuki: [2015], venus_express: [2006, 2014], galileo: [1995, 2003],
    europa_clipper: [2024], juice: [2023], parker: [2018], soho: [1996],
    solar_orbiter: [2020], hayabusa1: [2005, 2010], stardust: [2004, 2011],
    deep_impact: [2005, 2013], near_shoemaker: [2000, 2001],
    lucy: [2021], dart: [2022, 2022], hubble: [1990], jwst: [2022],
    chandra: [1999], spitzer: [2003, 2020], chang_e5: [2020, 2020],
    chang_e6: [2024, 2024], beresheet: [2019, 2019],
};

function getMissionYearsStr(id, m) {
    const y = MISSION_YEARS[id];
    if (!y) return '';
    if (y.length === 1) return m.active ? `${y[0]} – н.в.` : `${y[0]}`;
    return `${y[0]} – ${y[1]}`;
}

function generatePanels() {
    const main = document.querySelector('main');
    Object.entries(MISSIONS).forEach(([id, m], i) => {
        const panel = document.createElement('div');
        panel.id = `panel-${id}`;
        panel.className = 'mission-panel' + (i === 0 ? ' active' : '');
        panel.role = 'tabpanel';
        const years = getMissionYearsStr(id, m);
        const yearsHtml = years ? `<span class="mission-years">${years}</span>` : '';
        const statusBadge = m.active
            ? '<span style="color:#0f0;font-size:13px;">✓ Миссия активна</span>'
            : '<span style="color:#888;font-size:13px;">☆ Миссия завершена</span>';
        panel.innerHTML = `
            <section class="status"><div class="mission-part"><div id="${id}-mission-info">
                <h2>${m.fullName || m.name} ${yearsHtml}</h2>
                ${m.type === 'mars-rover' ? '<p>Загрузка...</p>' : statusBadge}
            </div></div>
            ${m.type === 'mars-rover' ? `<div class="weather-part"><h3>Погода (${m.weatherSensor}, ${m.location})</h3><div id="${id}-weather-container" class="weather-card"><p class="loading">Загрузка...</p></div></div>` : ''}
            </section>
            <section class="controls" id="${id}-controls"></section>
            <section class="photos"><h2>Снимки ${m.name}</h2><div id="${id}-photos-container" class="photo-grid" role="list"></div></section>
        `;
        main.appendChild(panel);
    });
}

function initUI() {
    generateTabs();
    generatePanels();
    initLightbox();
    initScrollToTop();

    Object.keys(MISSIONS).forEach(id => {
        state[id] = { dataAbort: null, weatherAbort: null, loaded: false };
        const m = MISSIONS[id];
        if (m.type === 'mars-rover') initMarsControls(id);
        else if (m.type === 'nasa-images') initNasaImageControls(id);
    });

    document.querySelectorAll('.tab').forEach(tab => {
        tab.addEventListener('click', () => switchTab(tab.dataset.mission));
    });

    state.curiosity.loaded = true;
    fetchMarsRover('curiosity', MISSIONS.curiosity.latestSol);
}

window.onload = initUI;
