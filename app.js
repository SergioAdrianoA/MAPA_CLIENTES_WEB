// ========================================
// MAPA BASE
// ========================================

const map = L.map('map').setView(
  [-4.2723219, -55.9798269],
  13
);

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

const markers =
  L.markerClusterGroup();

// ========================================
// CARREGAR CLIENTES
// ========================================

async function carregarClientes() {

  try {

    const response =
      await fetch('clientes.json');

    const clientes =
      await response.json();

    console.log(clientes);

    // ========================================
    // LOOP CLIENTES
    // ========================================

    clientes.forEach(cliente => {

      // ========================================
      // IGNORAR SEM COORDENADAS
      // ========================================

      if (
        !cliente.latitude ||
        !cliente.longitude
      ) return;

      // ========================================
      // MARCADOR
      // ========================================

      const marker = L.marker([

        cliente.latitude,
        cliente.longitude

      ]);

      // ========================================
      // POPUP
      // ========================================

      marker.bindPopup(`

        <div style="min-width:220px">

          <h3>
            ${cliente.fantasia}
          </h3>

          <p>
            <b>Ramo:</b>
            ${cliente.ramo}
          </p>

          <p>
            <b>Bairro:</b>
            ${cliente.bairro}
          </p>

          <p>
            <b>Cidade:</b>
            ${cliente.cidade}
          </p>

          <p>
            <b>Endereço:</b>
            ${cliente.endereco}
          </p>

          <a
            href="https://www.google.com/maps?q=${cliente.latitude},${cliente.longitude}"
            target="_blank"
          >
            Abrir no Google Maps
          </a>

        </div>

      `);

      // ========================================
      // ADICIONAR
      // ========================================

      markers.addLayer(marker);

    });

    // ========================================
    // ADICIONAR CLUSTERS
    // ========================================

    map.addLayer(markers);

    console.log(
      'CLIENTES CARREGADOS'
    );

  } catch (erro) {

    console.error(
      'ERRO AO CARREGAR CLIENTES',
      erro
    );

  }

}

// ========================================
// INICIAR
// ========================================

carregarClientes();
