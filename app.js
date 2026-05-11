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
// CARREGAR CLIENTES
// ========================================

async function carregarClientes() {

  try {

    const response = await fetch('clientes.json');

    const clientes = await response.json();

    console.log(clientes);

    clientes.forEach(cliente => {

      // IGNORA SEM COORDENADAS
      if (!cliente.lat || !cliente.lng) return;

      // CRIAR MARCADOR
      const marker = L.marker([
        cliente.lat,
        cliente.lng
      ]);

      // POPUP
      marker.bindPopup(`
        <div style="min-width:200px">
          <h3>${cliente.fantasia}</h3>

          <p>
            <b>Bairro:</b>
            ${cliente.bairro}
          </p>

          <p>
            <b>Cidade:</b>
            ${cliente.cidade}
          </p>

          <a
            href="https://www.google.com/maps?q=${cliente.lat},${cliente.lng}"
            target="_blank"
          >
            Abrir no Google Maps
          </a>
        </div>
      `);

      // ADICIONA NO CLUSTER
      markers.addLayer(marker);

    });

    // ADICIONA CLUSTERS NO MAPA
    map.addLayer(markers);

  } catch (error) {

    console.error(
      'ERRO AO CARREGAR CLIENTES',
      error
    );

  }

}

// ========================================
// INICIAR
// ========================================

carregarClientes();
