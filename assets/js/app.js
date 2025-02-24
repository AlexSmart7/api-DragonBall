import axios from 'axios';

let currentPage = 1; 
const limit = 10; 
const totalPages = 6;

let personajesGlobal = []

// Peticion para trae todos los personajes y guardarlos en una arreglo para la busqueda de personaje

async function obtenerTodos() {
    try {
        // URLs de las APIs
        let urls = [
            "https://dragonball-api.com/api/characters?page=1&limit=10",
            "https://dragonball-api.com/api/characters?page=2&limit=10",
            "https://dragonball-api.com/api/characters?page=3&limit=10",
            "https://dragonball-api.com/api/characters?page=4&limit=10",
            "https://dragonball-api.com/api/characters?page=5&limit=10",
            "https://dragonball-api.com/api/characters?page=6&limit=10"
        ];

        // Hacer múltiples peticiones en paralelo
        let respuestas = await Promise.all(urls.map(url => axios.get(url)));

        // Extraer los datos y combinarlos en un solo arreglo
        personajesGlobal = respuestas.flatMap(res => res.data.items);
        console.log(personajesGlobal)
    } catch (error) {
        console.error("Error al obtener los datos:", error);
    }
}

// Peticion para trae los personajes iniciales

async function obtenerPersonajes(page) {
    try {
        let response = await axios.get(`https://dragonball-api.com/api/characters?page=${page}&limit=${limit}`);
        let personajes = response.data.items; // Accedemos a items
        console.log(personajes)

        mostrarPersonajes(personajes);
        }

    catch (error) {
        console.error("Error al obtener los datos:", error);
    }

    document.getElementById("pageNumber").textContent = currentPage;
}

// Funcion para mostrar los personajes en el body

function mostrarPersonajes(personajes) {
    let contenedor = document.getElementById("contenedor");
    contenedor.innerHTML = ""; // Limpiar el contenedor antes de mostrar

    personajes.forEach(personaje => {
        let card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
        <div class="col-md-12">
        <div class="row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
          
            <div class="col p-4 d-flex flex-column position-static"> 
                <strong class="d-inline-block mb-2 text-primary-emphasis">${personaje.affiliation}</strong>
                <h3 class="mb-0">${personaje.name}</h3>
                <div class="mb-1 text-body-secondary">${personaje.race}</div>                    
            </div>
            <div class="col-auto d-none d-lg-block">
                <img src="${personaje.image}" alt="${personaje.name}" class="img-click">
            </div>
            <div class="col p-4 d-flex flex-column position-static">
            <p><strong>Poder</strong></p>
                <div class="progress" role="progressbar" aria-label="Animated striped example" aria-valuenow="75" aria-valuemin="0" aria-valuemax="100">
                <div class="progress-bar progress-bar-striped progress-bar-animated" style="width: 100%">${personaje.ki}</div>
                </div>
            </div>
        </div>
        </div>
        `;

        // Agregar evento click a la imagen
        let img = card.querySelector(".img-click");
        img.addEventListener("click", () => verImagen(personaje.image,personaje.name,personaje.description));

        contenedor.appendChild(card);
    });
}


// Funcion para seleccionar personaje y mostrar imagen y descripcion 

function verImagen(src,name,description) {
    document.getElementById("modalImagen").src = src;
    document.getElementById("modalNombre").textContent = name; // Agrega el nombre
    document.getElementById("modalDescripcion").textContent = description; // Agrega la
    document.getElementById("modal").style.display = "flex"
    

}

// Función para cambiar de página
function cambiarPagina(incremento) {
    let nuevaPagina = currentPage + incremento;
    if (nuevaPagina >= 1 && nuevaPagina <= totalPages) {
        currentPage = nuevaPagina;
        obtenerPersonajes(currentPage);
    }
}

// Eventos de botones de paginación
document.getElementById("prevPage").addEventListener("click", () => cambiarPagina(-1));
document.getElementById("nextPage").addEventListener("click", () => cambiarPagina(1));


// Codigo para realizar la busqueda

document.getElementById("inputSearch").addEventListener("input", function () {
    let searchText = this.value.toLowerCase(); // Obtener texto y convertirlo a minúsculas
    let personajesFiltrados = personajesGlobal.filter(personaje => 
        personaje.name.toLowerCase().includes(searchText) // Filtrar por nombre
    );
    mostrarPersonajes(personajesFiltrados); // Mostrar solo los personajes filtrados
});

// Invocar funciones de inicio

obtenerPersonajes();
obtenerTodos();