/**
 * EPIC Foundation - Shared Database Layer
 * Replaces localStorage with a real shared Postgres database via Vercel API routes.
 * Include this script on every page BEFORE auth.js:
 *   <script src="db.js"></script>
 *   <script src="auth.js"></script>
 *
 * It patches localStorage so existing code continues to work,
 * while silently syncing reads/writes to the backend database.
 */

const EPICDB = (() => {
    const BASE = '/api';

    // ── Core fetch helpers ──────────────────────────────────────
    async function apiGet(path) {
        try {
            const r = await fetch(BASE + path);
            if (!r.ok) throw new Error('API error ' + r.status);
            return r.json();
        } catch (e) {
            console.warn('EPICDB.apiGet failed', path, e);
            return null;
        }
    }

    async function apiPost(path, body) {
        try {
            const r = await fetch(BASE + path, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return r.json();
        } catch (e) {
            console.warn('EPICDB.apiPost failed', path, e);
            return null;
        }
    }

    async function apiPut(path, body) {
        try {
            const r = await fetch(BASE + path, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            return r.json();
        } catch (e) {
            console.warn('EPICDB.apiPut failed', path, e);
            return null;
        }
    }

    // ── Users ───────────────────────────────────────────────────
    async function getUsers() {
        const users = await apiGet('/users');
        if (users) {
            try { localStorage.setItem('epic_users', JSON.stringify(users)); } catch(e) { console.warn('Bypassing local cache for ' + 'localStorage.setItem('epic_users', JSON.stringify(users));'); }
            return users;
        }
        // Fallback to localStorage if API fails
        try { return JSON.parse(localStorage.getItem('epic_users')) || []; }
        catch { return []; }
    }

    async function saveUser(user) {
        return apiPut('/users', user);
    }

    async function createUser(user) {
        return apiPost('/users', user);
    }

    // ── Auctions ────────────────────────────────────────────────
    async function getAuctions() {
        const auctions = await apiGet('/auctions');
        if (auctions) {
            try { localStorage.setItem('epic_auctions', JSON.stringify(auctions)); } catch(e) { console.warn('Bypassing local cache for ' + 'localStorage.setItem('epic_auctions', JSON.stringify(auctions));'); }
            return auctions;
        }
        try { return JSON.parse(localStorage.getItem('epic_auctions')) || []; }
        catch { return []; }
    }

    async function saveAuction(auction) {
        return apiPost('/auctions', auction);
    }

    // ── Courses ─────────────────────────────────────────────────
    async function getCourses() {
        const remote = await apiGet('/courses');
        let local = [];
        try { local = JSON.parse(localStorage.getItem('epic_courses')) || []; } catch { local = []; }

        if (remote && remote.length > 0) {
            // Merge: for each remote course, prefer the local version if it's newer
            const merged = remote.map(rc => {
                const lc = local.find(c => c.id === rc.id);
                if (lc && lc.updated_at && rc.updated_at && lc.updated_at > rc.updated_at) {
                    return lc; // local is newer — keep it (e.g. unsaved image upload)
                }
                return rc;
            });
            // Also include any local-only courses not yet pushed to DB
            local.forEach(lc => {
                if (!merged.find(c => c.id === lc.id)) merged.push(lc);
            });
            
            // Ensure any new codebase defaults (like Torrey Pines) exist
            if (typeof getDefaultCourses === 'function') {
                getDefaultCourses().forEach(def => {
                    if (!merged.find(c => c.id === def.id)) merged.push(def);
                });
            }

            try { localStorage.setItem('epic_courses', JSON.stringify(merged)); } catch(e) { console.warn('Bypassing local cache for ' + 'localStorage.setItem('epic_courses', JSON.stringify(merged));'); }
            return merged;
        }

        // No remote data — fall back to local, then seed
        if (local.length > 0) {
            if (typeof getDefaultCourses === 'function') {
                getDefaultCourses().forEach(def => {
                    if (!local.find(c => c.id === def.id)) local.push(def);
                });
            }
            try { localStorage.setItem('epic_courses', JSON.stringify(local)); } catch(e) { console.warn('Bypassing local cache for ' + 'localStorage.setItem('epic_courses', JSON.stringify(local));'); }
            return local;
        }
        if (typeof loadSharedCourses === 'function') return loadSharedCourses();
        return [];
    }

    async function saveCourse(course) {
        return apiPost('/courses', course);
    }

    async function deleteCourse(courseId) {
        try {
            const r = await fetch(BASE + '/courses?id=' + encodeURIComponent(courseId), { method: 'DELETE' });
            return r.json();
        } catch (e) {
            console.warn('EPICDB.deleteCourse failed', e);
            return null;
        }
    }

    // ── Events ──────────────────────────────────────────────────
    async function getEvents() {
        const events = await apiGet('/events');
        if (events) {
            localStorage.setItem('epic_events', JSON.stringify(events));
            return events;
        }
        try { return JSON.parse(localStorage.getItem('epic_events')) || []; }
        catch { return []; }
    }

    async function saveEvent(event) {
        return apiPost('/events', event);
    }

    // ── Sync: push all current localStorage data to the DB ──────
    // Useful for first-time migration of admin-seeded data
    async function syncToServer() {
        const users = JSON.parse(localStorage.getItem('epic_users') || '[]');
        for (const user of users) {
            await apiPost('/users', user).catch(() => apiPut('/users', user));
        }
        const auctions = JSON.parse(localStorage.getItem('epic_auctions') || '[]');
        for (const a of auctions) {
            await apiPost('/auctions', a);
        }
        const events = JSON.parse(localStorage.getItem('epic_events') || '[]');
        for (const e of events) {
            await apiPost('/events', e);
        }
        console.log('EPICDB: sync complete.');
    }

    // ── Init: load from server into localStorage on page load ───
    async function init() {
        await getUsers();
        await getAuctions();
        await getEvents();
        await getCourses();
    }

    return { init, getUsers, saveUser, createUser, getAuctions, saveAuction, getEvents, saveEvent, getCourses, saveCourse, deleteCourse, syncToServer };
})();

// Auto-init on every page load
document.addEventListener('DOMContentLoaded', () => {
    EPICDB.init().catch(console.warn);
});
