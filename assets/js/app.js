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
        <div class="row g-0 rounded overflow-hidden d-flex flex-column align-items-center text-center text-md-start">

        <!-- Informacion del personaje -->
            <div class="col-md-8 p-4 d-flex flex-column col-md-4 p-4 d-flex flex-column justify-content-center align-items-center align-items-md-start"> 
                <strong class="d-inline-block mb-2 text-primary">${personaje.affiliation}</strong>
                <h3 class="mb-0">${personaje.name}</h3>                   
            </div>
        <!-- Imagen -->
            <div class="col-md-4 d-flex justify-content-center">
                <img src="${personaje.image}" alt="${personaje.name}" class="img-fluid rounded img-click" style="object-fit: cover; width: 100%; height: auto;">
            </div>
        <!-- Raza -->
            <div class="col-md-4 p-4 d-flex flex-column justify-content-center align-items-center align-items-md-start"> 
                <div class="mb-1 text-body-secondary">${personaje.race}</div>                    
            </div>
        </div>
        </div>
        `;

        // Agregar evento click a la imagen
        let img = card.querySelector(".img-click");
        img.addEventListener("click", () => 
            
            verImagen(personaje.image,personaje.name,personaje.description,personaje.ki,personaje.maxKi));   

        contenedor.appendChild(card);
    });
}


// Funcion para seleccionar personaje y mostrar imagen y descripcion 

function verImagen(src,name,description,ki,maxKi) {
    let modal = document.getElementById("modal"); 

    document.getElementById("modalImagen").src = src;
    document.getElementById("modalNombre").textContent = name; // Agrega el nombre
    document.getElementById("modalDescripcion").textContent =  description || "Sin descripción";  // Agrega la descripcion
    document.getElementById("modalKi").textContent = `${ki}%`; // Ki
    document.getElementById("modalKi").style.width = `${ki}%`; // Ajustar barra de progreso
    document.getElementById("modalmaxKi").textContent = `${maxKi}%`; // Máximo Ki
    document.getElementById("modalmaxKi").style.width = `${maxKi}%`; // Ajustar barra de progreso


    modal.classList.add("show"); // Agregar clase para Bootstrap (si usas Bootstrap)
    modal.style.display = "flex";
      // Mostrar el modal
}

function cerrarModal() {
    document.getElementById("modal").style.display = "none";
}

document.getElementById("close").addEventListener("click", () => cerrarModal());


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

