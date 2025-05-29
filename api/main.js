let currentPage = 1;
const pageSize = 30; // Limitar a 10 elementos por página
let totalGames = 0;
const body = document.querySelector('body');
const paginationWrapper = document.createElement('pagination-wrapper');
body.appendChild(paginationWrapper);

const renderPagination = () => {

    if (!paginationWrapper) {
        console.error("Pagination wrapper not found!");
        return;
    }

    let paginationContainer = document.querySelector('.pagination-container');

    if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination-container');
        paginationWrapper.appendChild(paginationContainer);
    } else {
        paginationContainer.innerHTML = ''; // Clear previous pagination
    }

    const totalPages = Math.min(Math.ceil(totalGames / pageSize), 3); // Limit to 3 pages max

    const prevButton = document.createElement('button');
    prevButton.textContent = 'Anterior';
    prevButton.disabled = currentPage === 1;
    prevButton.addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            consulta('929bb74e6a654e3987aa7d3ae5e7ae10', currentPage);
            renderPagination();
        }
    });
    paginationContainer.appendChild(prevButton);

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-number');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }
        pageButton.addEventListener('click', () => {
            currentPage = i;
            consulta('929bb74e6a654e3987aa7d3ae5e7ae10', currentPage);
            renderPagination();
        });
        paginationContainer.appendChild(pageButton);
    }

    const nextButton = document.createElement('button');
    nextButton.textContent = 'Siguiente';
    nextButton.disabled = currentPage === totalPages;
    nextButton.addEventListener('click', () => {
        if (currentPage < totalPages) {
            currentPage++;
            consulta('929bb74e6a654e3987aa7d3ae5e7ae10', currentPage);
            renderPagination();
        }
    });
    paginationContainer.appendChild(nextButton);
};

const Mostrar = (title, image, released, updated, storesData) => {
    const gridContainer = document.querySelector('.games-grid');
    const div = document.createElement('div');
    div.classList.add('game-card');
    div.innerHTML = `
        <h3>${title}</h3>
        <p>Lanzamiento: ${released}</p>
        <p>Actualización: ${updated}</p>
    `;
    gridContainer.appendChild(div);
    const img = document.createElement("img");
    img.src = image;
    div.appendChild(img);
    img.classList.add('capturas');
    const storesTitle = document.createElement('h4');
    div.appendChild(storesTitle);
    storesTitle.textContent = 'Disponible en:';
    

    if (storesData && storesData.length > 0) {

        const storesList = document.createElement('ul');
        storesData.forEach(storeObj => {
        const store = storeObj.store; // Accede al objeto 'store' anidado
        const link = document.createElement('a');
        link.href = store.domain.startsWith('http') ? store.domain : `https://${store.domain}`;
        link.textContent = store.name;
        link.target = '_blank'; 
        link.style.display = 'block'; 
        div.appendChild(link);
    });
        div.appendChild(storesList); 
    } else {
        const noStores = document.createElement('p');
        noStores.textContent = 'No se encontraron tiendas para este juego.';
        div.appendChild(noStores);
    }
};

const iteringData = (data) => {
    const body = document.querySelector('body');
    // Limpiar los resultados anteriores
    const existingGames = body.querySelectorAll(':scope > div');
    existingGames.forEach(div => {
        if (!div.classList.contains('pagination-container')) {
            if(div.parentNode === body){
                body.removeChild(div);
            }
        }
    });

    let gridContainer = document.querySelector('.games-grid');
    if (!gridContainer) {
        gridContainer = document.createElement('div');
        gridContainer.classList.add('games-grid');
        body.appendChild(gridContainer);
    }

    const itemsToShow = data.slice(0, 10);
    itemsToShow.forEach(element => {
        Mostrar(element.name, element.background_image, element.released, element.updated, element.stores);

    });
};



const consulta = async (Api_key, page) => {
    const offset = (page - 1) * pageSize;
    let response = await fetch(`https://api.rawg.io/api/games?key=${Api_key}&page_size=${pageSize}&offset=${offset}&page=65`);
    if (!response.ok){
        throw new Error ("error");
    }
    response = await response.json();
    totalGames = response.count;
    iteringData(response.results);
    renderPagination(); 
};

consulta('929bb74e6a654e3987aa7d3ae5e7ae10', 1);


