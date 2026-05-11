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

map.addLayer(markers);

// ========================================
// ELEMENTOS HTML
// ========================================

const buscaInput =
  document.querySelector('input');

const bairroSelect =
  document.querySelector('select');

// ========================================
// BASE CLIENTES
// ========================================

let clientesBase = [];

// ========================================
// CARREGAR CLIENTES
// ========================================

async function carregarClientes() {

  try {

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
    // RENDERIZAR
    // ========================================

    renderizarClientes(
      clientesBase
    );

  } catch (erro) {

    console.error(
      'ERRO AO CARREGAR JSON'
    );

    console.error(erro);

  }

}

// ========================================
// PREENCHER SELECT BAIRROS
// ========================================

function preencherBairros() {

  // LIMPAR

  bairroSelect.innerHTML = `
    <option value="">
      Todos os bairros
    </option>
  `;

  // PEGAR BAIRROS ÚNICOS

  const bairros = [
    ...new Set(

      clientesBase.map(cliente =>
        cliente.bairro
      )

    )
  ];

  // ORDENAR

  bairros.sort();

  // CRIAR OPTIONS

  bairros.forEach(bairro => {

    const option =
      document.createElement('option');

    option.value = bairro;

    option.textContent = bairro;

    bairroSelect.appendChild(option);

  });

}

// ========================================
// RENDERIZAR CLIENTES
// ========================================

function renderizarClientes(clientes) {

  // LIMPAR MARKERS

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
      // MARKER
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
      // ADICIONAR
      // ========================================

      markers.addLayer(marker);

    } catch (erroCliente) {

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
// FILTROS
// ========================================

function aplicarFiltros() {

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
      // BUSCA TEXTO
      // ========================================

      const textoCliente = `

        ${cliente.fantasia || ''}
        ${cliente.razao || ''}
        ${cliente.bairro || ''}
        ${cliente.ramo || ''}

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
  // RENDERIZAR
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
