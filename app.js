// ========================================
// MAPA BASE
// ========================================

const map = L.map('map').setView(
  [-4.2723219, -55.9798269],
  13
);

// ========================================
// CAMADA OPENSTREETMAP
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

    // ========================================
    // FETCH JSON
    // ========================================

    const response =
      await fetch('clientes.json');

    const clientes =
      await response.json();

    console.log(
      'CLIENTES:',
      clientes
    );

    // ========================================
    // LOOP CLIENTES
    // ========================================

    clientes.forEach(cliente => {

      try {

        // ========================================
        // VALIDAR COORDENADAS
        // ========================================

        if (
          cliente.latitude == null ||
          cliente.longitude == null
        ) {

          console.warn(
            'SEM COORDENADAS:',
            cliente
          );

          return;

        }

        // ========================================
        // CONVERTER PARA NUMBER
        // ========================================

        const latitude =
          Number(cliente.latitude);

        const longitude =
          Number(cliente.longitude);

        // ========================================
        // VALIDAR NUMBER
        // ========================================

        if (
          isNaN(latitude) ||
          isNaN(longitude)
        ) {

          console.warn(
            'COORDENADAS INVÁLIDAS:',
            cliente
          );

          return;

        }

        // ========================================
        // CRIAR MARKER
        // ========================================

        const marker = L.marker([
          latitude,
          longitude
        ]);

        // ========================================
        // POPUP
        // ========================================

        marker.bindPopup(`

          <div style="min-width:220px">

            <h3>
              ${cliente.fantasia || ''}
            </h3>

            <p>
              <b>Razão:</b><br>
              ${cliente.razao || ''}
            </p>

            <p>
              <b>Ramo:</b>
              ${cliente.ramo || ''}
            </p>

            <p>
              <b>Bairro:</b>
              ${cliente.bairro || ''}
            </p>

            <p>
              <b>Cidade:</b>
              ${cliente.cidade || ''}
            </p>

            <p>
              <b>Endereço:</b><br>
              ${cliente.endereco || ''}
            </p>

            <a
              href="https://www.google.com/maps?q=${latitude},${longitude}"
              target="_blank"
            >
              Abrir no Google Maps
            </a>

          </div>

        `);

        // ========================================
        // ADICIONAR NO CLUSTER
        // ========================================

        markers.addLayer(marker);

      } catch (erroCliente) {

        console.error(
          'ERRO CLIENTE:',
          cliente
        );

        console.error(
          erroCliente
        );

      }

    });

    // ========================================
    // ADICIONAR CLUSTERS
    // ========================================

    map.addLayer(markers);

    // ========================================
    // AJUSTAR ZOOM AUTOMÁTICO
    // ========================================

    if (
      markers.getLayers().length > 0
    ) {

      map.fitBounds(
        markers.getBounds(),
        {
          padding: [40, 40]
        }
      );

    }

    console.log(
      'CLIENTES CARREGADOS:',
      markers.getLayers().length
    );

  } catch (erro) {

    console.error(
      'ERRO AO CARREGAR JSON'
    );

    console.error(erro);

  }

}

// ========================================
// INICIAR SISTEMA
// ========================================

carregarClientes();
