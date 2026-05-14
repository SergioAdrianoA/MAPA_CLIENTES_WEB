// =====================================================
// APP.JS
// =====================================================

document.addEventListener(

  'DOMContentLoaded',

  async () => {

    // =====================================================
    // MAPA
    // =====================================================

    const map = L.map('map').setView(
      [-4.2767, -55.9836],
      13
    );

    // =====================================================
    // TILE LAYER
    // =====================================================

    L.tileLayer(

      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

      {
        attribution:
          '&copy; OpenStreetMap'
      }

    ).addTo(map);

    // =====================================================
    // CLUSTER
    // =====================================================

    const markers =
      L.markerClusterGroup();

    // =====================================================
    // ELEMENTOS
    // =====================================================

    const buscaInput =
      document.getElementById('busca');

    const bairroFiltro =
      document.getElementById('bairroFiltro');

    // =====================================================
    // CLIENTES
    // =====================================================

    let clientes = [];

    // =====================================================
    // CARREGAR CLIENTES
    // =====================================================

    async function carregarClientes() {

      try {

        const response = await fetch(

          `clientes.json?v=${Date.now()}`
        );

        clientes =
          await response.json();

        renderizarClientes(clientes);

        preencherBairros(clientes);

      } catch (erro) {

        console.error(
          'ERRO AO CARREGAR CLIENTES:',
          erro
        );
      }
    }

    // =====================================================
    // RENDERIZAR CLIENTES
    // =====================================================

    function renderizarClientes(lista) {

      markers.clearLayers();

      lista.forEach(cliente => {

        const lat =
          parseFloat(cliente.latitude);

        const lng =
          parseFloat(cliente.longitude);

        // ===============================================
        // IGNORA COORDENADAS INVÁLIDAS
        // ===============================================

        if (
          isNaN(lat) ||
          isNaN(lng)
        ) {
          return;
        }

        const popup = `

          <div style="min-width:220px">

            <b style="font-size:16px;">
              ${cliente.fantasia || ''}
            </b>

            <br><br>

            <b>RAZÃO:</b><br>
            ${cliente.razao || ''}

            <br><br>

            <b>RAMO:</b><br>
            ${cliente.ramo || ''}

            <br><br>

            <b>BAIRRO:</b><br>
            ${cliente.bairro || ''}

            <br><br>

            <b>ENDEREÇO:</b><br>
            ${cliente.endereco || ''}

            <br><br>

            <a
              href="https://www.google.com/maps?q=${lat},${lng}"
              target="_blank"
            >
              Abrir no Google Maps
            </a>

          </div>
        `;

        const marker =
          L.marker([lat, lng])

            .bindPopup(popup);

        markers.addLayer(marker);
      });

      map.addLayer(markers);
    }

    // =====================================================
    // BAIRROS
    // =====================================================

    function preencherBairros(lista) {

      const bairros = [

        ...new Set(

          lista

            .map(c => c.bairro)

            .filter(Boolean)
        )
      ]

      .sort();

      bairroFiltro.innerHTML =

        `
          <option value="">
            Todos os bairros
          </option>
        `;

      bairros.forEach(bairro => {

        bairroFiltro.innerHTML +=

          `
            <option value="${bairro}">
              ${bairro}
            </option>
          `;
      });
    }

    // =====================================================
    // FILTROS
    // =====================================================

    function aplicarFiltros() {

      const busca =

        buscaInput.value
          .trim()
          .toUpperCase();

      const bairro =

        bairroFiltro.value;

      const filtrados =

        clientes.filter(cliente => {

          const matchBusca =

            !busca ||

            (
              cliente.razao &&
              cliente.razao
                .toUpperCase()
                .includes(busca)
            ) ||

            (
              cliente.fantasia &&
              cliente.fantasia
                .toUpperCase()
                .includes(busca)
            );

          const matchBairro =

            !bairro ||

            cliente.bairro === bairro;

          return (
            matchBusca &&
            matchBairro
          );
        });

      renderizarClientes(filtrados);
    }

    // =====================================================
    // EVENTOS
    // =====================================================

    buscaInput.addEventListener(
      'input',
      aplicarFiltros
    );

    bairroFiltro.addEventListener(
      'change',
      aplicarFiltros
    );

    // =====================================================
    // START
    // =====================================================

    carregarClientes();
  }
);
