// ========================================
// ELEMENTOS HTML
// ========================================

const buscaInput =
  document.getElementById(
    'buscaCliente'
  );

const bairroSelect =
  document.getElementById(
    'filtroBairro'
  );

// ========================================
// MAPA
// ========================================

const map = L.map('map').setView(
  [-4.2723219, -55.9798269],
  13
);

// ========================================
// TILE LAYER
// ========================================

L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  {
    attribution:
      '&copy; OpenStreetMap'
  }
).addTo(map);

// ========================================
// CLUSTER
// ========================================

const markers =
  L.markerClusterGroup();

map.addLayer(markers);

// ========================================
// BASE CLIENTES
// ========================================

let clientesBase = [];

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

    clientesBase =
      await response.json();

    console.log(
      'CLIENTES:',
      clientesBase
    );

    // ========================================
    // PREENCHER BAIRROS
    // ========================================

    preencherBairros();

    // ========================================
    // RENDERIZAR TODOS
    // ========================================

    renderizarClientes(
      clientesBase
    );

  } catch (erro) {

    console.error(
      'ERRO AO CARREGAR CLIENTES'
    );

    console.error(erro);

  }

}

// ========================================
// PREENCHER BAIRROS
// ========================================

function preencherBairros() {

  // LIMPAR

  bairroSelect.innerHTML = `
    <option value="">
      Todos os bairros
    </option>
  `;

  // ========================================
  // PEGAR BAIRROS ÚNICOS
  // ========================================

  const bairros = [

    ...new Set(

      clientesBase
        .map(cliente =>
          cliente.bairro
        )
        .filter(Boolean)

    )

  ];

  // ========================================
  // ORDENAR
  // ========================================

  bairros.sort();

  // ========================================
  // ADICIONAR OPTIONS
  // ========================================

  bairros.forEach(bairro => {

    const option =
      document.createElement(
        'option'
      );

    option.value = bairro;

    option.textContent =
      bairro;

    bairroSelect.appendChild(
      option
    );

  });

}

// ========================================
// RENDERIZAR CLIENTES
// ========================================

function renderizarClientes(clientes) {

  // ========================================
  // LIMPAR CLUSTERS
  // ========================================

  markers.clearLayers();

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
      ) return;

      const latitude =
        Number(cliente.latitude);

      const longitude =
        Number(cliente.longitude);

      if (
        isNaN(latitude) ||
        isNaN(longitude)
      ) return;

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
  // AJUSTAR MAPA
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

}

// ========================================
// APLICAR FILTROS
// ========================================

function aplicarFiltros() {

  // ========================================
  // VALORES
  // ========================================

  const textoBusca =
    buscaInput.value
      .toLowerCase()
      .trim();

  const bairroSelecionado =
    bairroSelect.value;

  // ========================================
  // FILTRAR
  // ========================================

  const filtrados =
    clientesBase.filter(cliente => {

      // ========================================
      // TEXTO BUSCA
      // ========================================

      const textoCliente = `

        ${cliente.fantasia || ''}
        ${cliente.razao || ''}
        ${cliente.bairro || ''}
        ${cliente.ramo || ''}
        ${cliente.endereco || ''}

      `
      .toLowerCase();

      const matchBusca =
        textoCliente.includes(
          textoBusca
        );

      // ========================================
      // FILTRO BAIRRO
      // ========================================

      const matchBairro =

        !bairroSelecionado ||

        cliente.bairro ===
        bairroSelecionado;

      return (
        matchBusca &&
        matchBairro
      );

    });

  // ========================================
  // RENDERIZAR FILTRADOS
  // ========================================

  renderizarClientes(
    filtrados
  );

}

// ========================================
// EVENTOS
// ========================================

buscaInput.addEventListener(
  'input',
  aplicarFiltros
);

bairroSelect.addEventListener(
  'change',
  aplicarFiltros
);

// ========================================
// INICIAR
// ========================================

carregarClientes();
