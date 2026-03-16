const fs = require('fs');

async function fixAuctions() {
    const url = 'https://foundation-website-rose.vercel.app/api/auctions';
    const res = await fetch(url);
    const auctions = await res.json();
    
    for (let a of auctions) {
        if (a.id === 'torrey-pines') {
            a.course_id = 'torrey-pines';
            a.course = 'Torrey Pines Golf Course';
            a.images = [];
            console.log('Fixed Torrey Pines');
            await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(a) });
        }
        if (a.id === 'pebble-beach') {
            a.course_id = 'pebble-beach-gc';
            a.images = [];
            console.log('Fixed Pebble Beach');
            await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(a) });
        }
        if (a.id === 'pine-valley') {
            a.course_id = 'pine-valley-gc';
            a.images = [];
            console.log('Fixed Pine Valley');
            await fetch(url, { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(a) });
        }
    }
    console.log('Done!');
}
fixAuctions();
