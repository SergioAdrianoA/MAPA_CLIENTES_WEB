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
    // CLUSTERS
    // =====================================================

    const markers =
      L.markerClusterGroup();

    // =====================================================
    // ELEMENTOS
    // =====================================================

    const buscaInput =
      document.getElementById('busca');

    const cidadeFiltro =
      document.getElementById('cidadeFiltro');

    const bairroFiltro =
      document.getElementById('bairroFiltro');

    const ramoFiltro =
      document.getElementById('ramoFiltro');

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

        preencherFiltros(clientes);

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

        // =================================================
        // IGNORA COORDENADAS INVÁLIDAS
        // =================================================

        if (
          isNaN(lat) ||
          isNaN(lng)
        ) {
          return;
        }

        // =================================================
        // POPUP
        // =================================================

        const popup = `

          <div style="min-width:220px;">

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

            <b>CIDADE:</b><br>
            ${cliente.cidade || ''}

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

        // =================================================
        // MARCADOR
        // =================================================

        const marker =
          L.marker([lat, lng])

            .bindPopup(popup);

        markers.addLayer(marker);
      });

      map.addLayer(markers);
    }

    // =====================================================
    // PREENCHER FILTROS
    // =====================================================

    function preencherFiltros(lista) {

      preencherSelect(

        cidadeFiltro,

        lista.map(c => c.cidade),

        'Todas as cidades'
      );

      preencherSelect(

        bairroFiltro,

        lista.map(c => c.bairro),

        'Todos os bairros'
      );

      preencherSelect(

        ramoFiltro,

        lista.map(c => c.ramo),

        'Todos os ramos'
      );
    }

    // =====================================================
    // PREENCHER SELECT
    // =====================================================

    function preencherSelect(
      select,
      valores
    ) {

      const itens = [

        ...new Set(

          valores.filter(Boolean)
        )
      ]

      .sort();

      select.innerHTML = '';

      itens.forEach(item => {

        select.innerHTML +=

          `
            <option value="${item}">
              ${item}
            </option>
          `;
      });
    }

    // =====================================================
    // OBTER MULTISELECT
    // =====================================================

    function obterValoresSelecionados(select) {

      return Array.from(

        select.selectedOptions

      ).map(option => option.value);
    }

    // =====================================================
    // FILTROS
    // =====================================================

    function aplicarFiltros() {

      const busca =

        buscaInput.value
          .trim()
          .toUpperCase();

      const cidades =
        obterValoresSelecionados(
          cidadeFiltro
        );

      const bairros =
        obterValoresSelecionados(
          bairroFiltro
        );

      const ramos =
        obterValoresSelecionados(
          ramoFiltro
        );

      const filtrados =

        clientes.filter(cliente => {

          // ===============================================
          // BUSCA
          // ===============================================

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

          // ===============================================
          // CIDADE
          // ===============================================

          const matchCidade =

            cidades.length === 0 ||

            cidades.includes(
              cliente.cidade
            );

          // ===============================================
          // BAIRRO
          // ===============================================

          const matchBairro =

            bairros.length === 0 ||

            bairros.includes(
              cliente.bairro
            );

          // ===============================================
          // RAMO
          // ===============================================

          const matchRamo =

            ramos.length === 0 ||

            ramos.includes(
              cliente.ramo
            );

          return (

            matchBusca &&
            matchCidade &&
            matchBairro &&
            matchRamo
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

    cidadeFiltro.addEventListener(
      'change',
      aplicarFiltros
    );

    bairroFiltro.addEventListener(
      'change',
      aplicarFiltros
    );

    ramoFiltro.addEventListener(
      'change',
      aplicarFiltros
    );

    // =====================================================
    // START
    // =====================================================

    carregarClientes();
  }
);
