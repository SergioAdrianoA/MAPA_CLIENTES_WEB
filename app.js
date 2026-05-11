
// ========================================
// MAPA BASE
// ========================================

const map = L.map('map').setView([-4.276, -55.983], 12);

// ========================================
// OPEN STREET MAP
// ========================================

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution: '&copy; OpenStreetMap'
  }
).addTo(map);

// ========================================
// CLUSTER
// ========================================

const markers = L.markerClusterGroup();

// ========================================
// ADICIONAR NO MAPA
// ========================================

map.addLayer(markers);

// ========================================
// TESTE
// ========================================

console.log('MAPA INICIADO');
