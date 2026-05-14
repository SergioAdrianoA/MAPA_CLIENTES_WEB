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
    // TILE
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
    // DROPDOWN
    // =====================================================

    document.querySelectorAll('.dropdown-btn')

      .forEach(btn => {

        btn.addEventListener(
          'click',
          () => {

            btn.parentElement
              .classList.toggle('active');
          }
        );
      });

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

        preencherFiltros();

        renderizarClientes(clientes);

      } catch (erro) {

        console.error(
          erro
        );
      }
    }

    // =====================================================
    // PREENCHER FILTROS
    // =====================================================

    function preencherFiltros() {

      criarCheckboxes(

        cidadeFiltro,

        clientes.map(c => c.cidade),

        'cidade'
      );

      criarCheckboxes(

        bairroFiltro,

        clientes.map(c => c.bairro),

        'bairro'
      );

      criarCheckboxes(

        ramoFiltro,

        clientes.map(c => c.ramo),

        'ramo'
      );
    }

    // =====================================================
    // CRIAR CHECKBOXES
    // =====================================================

    function criarCheckboxes(
      container,
      lista,
      tipo
    ) {

      const itens = [

        ...new Set(

          lista.filter(Boolean)
        )
      ]

      .sort();

      container.innerHTML = '';

      // ===================================================
      // TODOS
      // ===================================================

      container.innerHTML += `

        <label class="checkbox-item">

          <input
            type="checkbox"
            class="${tipo}"
            value="TODOS"
            checked
          />

          TODOS

        </label>
      `;

      // ===================================================
      // ITENS
      // ===================================================

      itens.forEach(item => {

        container.innerHTML += `

          <label class="checkbox-item">

            <input
              type="checkbox"
              class="${tipo}"
              value="${item}"
            />

            ${item}

          </label>
        `;
      });

      // ===================================================
      // EVENTOS
      // ===================================================

      const checkboxes =

        container.querySelectorAll(
          `.${tipo}`
        );

      checkboxes.forEach(cb => {

        cb.addEventListener(
          'change',
          () => {

            controlarTodos(
              checkboxes
            );

            aplicarFiltros();
          }
        );
      });
    }

    // =====================================================
    // CONTROLAR TODOS
    // =====================================================

    function controlarTodos(
      checkboxes
    ) {

      const todos =

        Array.from(checkboxes)

          .find(c =>

            c.value === 'TODOS'
          );

      const outros =

        Array.from(checkboxes)

          .filter(c =>

            c.value !== 'TODOS'
          );

      // ===================================================
      // TODOS MARCADO
      // ===================================================

      if (
        todos.checked &&
        event.target.value === 'TODOS'
      ) {

        outros.forEach(c => {

          c.checked = false;
        });
      }

      // ===================================================
      // OUTRO MARCADO
      // ===================================================

      if (
        event.target.value !== 'TODOS'
      ) {

        todos.checked = false;
      }

      // ===================================================
      // NENHUM
      // ===================================================

      const algumMarcado =

        outros.some(c => c.checked);

      if (!algumMarcado) {

        todos.checked = true;
      }
    }

    // =====================================================
    // OBTER SELECIONADOS
    // =====================================================

    function obterSelecionados(classe) {

      return Array.from(

        document.querySelectorAll(
          `.${classe}:checked`
        )

      )

      .map(c => c.value)

      .filter(v => v !== 'TODOS');
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
        obterSelecionados('cidade');

      const bairros =
        obterSelecionados('bairro');

      const ramos =
        obterSelecionados('ramo');

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
    // RENDERIZAR
    // =====================================================

    function renderizarClientes(lista) {

      markers.clearLayers();

      lista.forEach(cliente => {

        const lat =
          parseFloat(cliente.latitude);

        const lng =
          parseFloat(cliente.longitude);

        if (
          isNaN(lat) ||
          isNaN(lng)
        ) {
          return;
        }

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

        const marker =
          L.marker([lat, lng])

            .bindPopup(popup);

        markers.addLayer(marker);
      });

      map.addLayer(markers);
    }

    // =====================================================
    // EVENTOS
    // =====================================================

    buscaInput.addEventListener(
      'input',
      aplicarFiltros
    );

    // =====================================================
    // START
    // =====================================================

    carregarClientes();
  }
);
