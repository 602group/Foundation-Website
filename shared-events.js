// Shared Events & Destinations Data Store (localStorage)

const DEFAULT_EVENTS = [
    {
        id: "pebble-beach-2026",
        status: "active",
        visibility: "all",
        title: "Pebble Beach Golf Experience",
        location: "Pebble Beach, California",
        date: "May 15-18, 2026",
        spots: 8,
        spotsSold: 0,
        allowGuests: true,
        price: 4500,
        image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&q=80",
        link: "events/pebble-beach-may-15-2026.html",
        description: "An exclusive 4-day golf experience at the world-renowned Pebble Beach Golf Links, including lodging, meals, and caddie services.",
        includes: "Lodging, Meals, Caddies, Transportation",
        contactEmail: "",
        // Financial fields (costs)
        costVenue: 8000,
        costCatering: 3500,
        costTransportation: 2000,
        costMarketing: 1200,
        costStaff: 1800,
        costMisc: 500
    },
    {
        id: "scottish-highlands-2026",
        status: "pending",
        visibility: "all",
        title: "Scottish Highlands Golf Tour",
        location: "St Andrews, Scotland",
        date: "June 20-25, 2026",
        spots: 12,
        spotsSold: 8,
        price: 5200,
        image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=1200&q=80",
        link: "#",
        description: "A 6-day immersive tour through the birthplace of golf, including play at St Andrews Old Course and Carnoustie.",
        includes: "Lodging, Meals, Greens Fees, Airport Transfers",
        contactEmail: "",
        costVenue: 12000,
        costCatering: 5000,
        costTransportation: 4500,
        costMarketing: 1500,
        costStaff: 2200,
        costMisc: 800
    },
    {
        id: "ireland-adventure-2026",
        status: "pending",
        visibility: "all",
        title: "Ireland Golf Adventure",
        location: "County Kerry, Ireland",
        date: "July 10-15, 2026",
        spots: 6,
        spotsSold: 4,
        price: 3800,
        image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=1200&q=80",
        link: "#",
        description: "5 days on Ireland's breathtaking southwest coast playing the finest links courses in the world.",
        includes: "Lodging, Greens Fees, Meals, Group Transport",
        contactEmail: "",
        costVenue: 7000,
        costCatering: 2800,
        costTransportation: 3200,
        costMarketing: 900,
        costStaff: 1500,
        costMisc: 600
    },
    {
        id: "japan-experience-2026",
        status: "pending",
        visibility: "all",
        title: "Japan Golf & Culture Experience",
        location: "Tokyo & Kyoto, Japan",
        date: "September 5-12, 2026",
        spots: 10,
        spotsSold: 7,
        price: 6500,
        image: "https://images.unsplash.com/photo-1587174489496-cc4c0e0c8b1e?w=1200&q=80",
        link: "#",
        description: "An 8-day curated tour blending world-class golf with Japanese culture — tea ceremonies, temples, and top-tier courses.",
        includes: "Lodging, Greens Fees, Cultural Experiences, Meals, All Ground Transport",
        contactEmail: "",
        costVenue: 14000,
        costCatering: 6000,
        costTransportation: 5500,
        costMarketing: 2000,
        costStaff: 3000,
        costMisc: 1200
    }
];

const DEFAULT_DESTINATIONS = [
    { id: "dest-ireland", status: "active", name: "Ireland", image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80" },
    { id: "dest-scotland", status: "pending", name: "Scotland", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80" },
    { id: "dest-england", status: "pending", name: "England", image: "https://images.unsplash.com/photo-1592919505780-303950717480?w=800&q=80" },
    { id: "dest-spain", status: "pending", name: "Spain", image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80" },
    { id: "dest-japan", status: "pending", name: "Japan", image: "https://images.unsplash.com/photo-1587174489496-cc4c0e0c8b1e?w=800&q=80" },
    { id: "dest-aus-nz", status: "pending", name: "AUS & NZ", image: "https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=800&q=80" },
    { id: "dest-usa", status: "pending", name: "USA", image: "https://images.unsplash.com/photo-1587174486073-ae5e5cff23aa?w=800&q=80" },
    { id: "dest-france", status: "pending", name: "France", image: "https://images.unsplash.com/photo-1592919505780-303950717480?w=800&q=80" }
];

const EVENTS_VERSION = '2';

function loadSharedEvents() {
    const raw = localStorage.getItem('epic_events');
    if (!raw || raw === '[]') {
        localStorage.setItem('epic_events', JSON.stringify(DEFAULT_EVENTS));
        localStorage.setItem('epic_events_ver', EVENTS_VERSION);
        return DEFAULT_EVENTS;
    }
    return JSON.parse(raw);
}

function getEventById(id) {
    return loadSharedEvents().find(e => e.id === id) || null;
}

const DESTINATIONS_VERSION = '2';

function loadSharedDestinations() {
    const raw = localStorage.getItem('epic_destinations');
    if (!raw || raw === '[]') {
        localStorage.setItem('epic_destinations', JSON.stringify(DEFAULT_DESTINATIONS));
        localStorage.setItem('epic_destinations_ver', DESTINATIONS_VERSION);
        return DEFAULT_DESTINATIONS;
    }
    return JSON.parse(raw);
}

function saveEvent(eventData) {
    const events = loadSharedEvents();
    if (!eventData.id) eventData.id = 'event-' + Date.now();
    const idx = events.findIndex(e => e.id === eventData.id);
    if (idx !== -1) {
        events[idx] = { ...events[idx], ...eventData };
    } else {
        // Set defaults for new events
        events.push({
            spotsSold: 0,
            status: 'active',
            visibility: 'all',
            description: '',
            includes: '',
            contactEmail: '',
            costVenue: 0,
            costCatering: 0,
            costTransportation: 0,
            costMarketing: 0,
            costStaff: 0,
            costMisc: 0,
            ...eventData
        });
    }
    localStorage.setItem('epic_events', JSON.stringify(events));
    return events;
}

/**
 * Compute spots sold for an event by counting real trip records in epic_users.
 * This is the source of truth — never trust the stored spotsSold value alone.
 */
function computeSpotsSold(eventId) {
    try {
        const users = JSON.parse(localStorage.getItem('epic_users') || '[]');
        let total = 0;
        users.forEach(u => {
            if (u.trips) {
                u.trips.forEach(t => {
                    if (t.eventId === eventId) {
                        total += (t.spotsReserved || 1);
                    }
                });
            }
        });
        return total;
    } catch (e) { return 0; }
}

/**
 * Re-sync all events' spotsSold from epic_users and save back.
 * Call this on admin page load to auto-heal any stale data.
 */
function recomputeAllSpotsSold() {
    const events = loadSharedEvents();
    let changed = false;
    events.forEach(e => {
        const live = computeSpotsSold(e.id);
        if (e.spotsSold !== live) {
            e.spotsSold = live;
            changed = true;
        }
    });
    if (changed) {
        localStorage.setItem('epic_events', JSON.stringify(events));
    }
    return events;
}

function saveDestination(destData) {
    const destinations = loadSharedDestinations();
    if (!destData.id) destData.id = 'dest-' + Date.now();
    const idx = destinations.findIndex(d => d.id === destData.id);
    if (idx !== -1) {
        destinations[idx] = { ...destinations[idx], ...destData };
    } else {
        destinations.push(destData);
    }
    localStorage.setItem('epic_destinations', JSON.stringify(destinations));
    return destinations;
}

function deleteEvent(id) {
    const events = loadSharedEvents().filter(e => e.id !== id);
    localStorage.setItem('epic_events', JSON.stringify(events));

    // Cascade: scrub orphaned trips from users
    try {
        const users = JSON.parse(localStorage.getItem('epic_users') || '[]');
        let changed = false;
        users.forEach(u => {
            if (u.trips) {
                const initLen = u.trips.length;
                u.trips = u.trips.filter(t => t.eventId !== id);
                if (u.trips.length !== initLen) changed = true;
            }
        });
        if (changed) localStorage.setItem('epic_users', JSON.stringify(users));
    } catch (e) { console.error('Error cascading event delete to users:', e); }
}

function deleteDestination(id) {
    const destinations = loadSharedDestinations().filter(d => d.id !== id);
    localStorage.setItem('epic_destinations', JSON.stringify(destinations));
}
