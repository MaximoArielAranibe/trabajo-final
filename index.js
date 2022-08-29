    document.addEventListener('DOMContentLoaded', () => {
        /* Change theme */
    const changeMode = document.querySelector('body');
    const toggle = document.getElementById('toggle');
    
        const carritoValue = document.getElementById('carritoAmount');
        var carritoAmmount = 0;
        carritoValue.innerHTML = carritoAmmount;

    toggle.onclick = function(){
        toggle.classList.toggle('active');
        changeMode.classList.toggle('active');
    }

        let carrito = [];
        const divisa = '$';
        const DOMitems = document.querySelector('#items');
        const DOMcarrito = document.querySelector('#carrito');
        const DOMtotal = document.querySelector('#total');
        const DOMbotonVaciar = document.querySelector('#boton-vaciar');
        const DOMbotonComprar = document.querySelector('#boton-comprar');
        const miLocalStorage = window.localStorage;


        async function fetchData () {
            const data = await fetch ('api.json');
            const dataJSON = await data.json();
            console.log(dataJSON);
            return dataJSON;
        }
    
    //LLAMADO A API.JSON
    /* fetch('api.json')
    .then(respuesta => respuesta.json()) */
    async function renderizarProductos(){
        const data = await fetchData();
        data.forEach(producto => {
            //MiNodo es el div completo de la card
    const miNodo = document.createElement('div');
    miNodo.classList.add('card' , 'bg-light' , 'ms-2' , 'px-3' ,'py-2');
    miNodo.style.width= "350px";//Agrego altura y ancho fijo
    miNodo.style.height="550px";
    //Titulo del producto
    const miNodoTitle = document.createElement('h3');
    miNodoTitle.classList.add('fw-bold');
    miNodoTitle.textContent = producto.title;
    //Imagen del producto
    const miNodoImagen = document.createElement('img');
    miNodoImagen.setAttribute('src',producto.image);
    miNodoImagen.classList.add('border','border-4','border-dark');
    miNodoImagen.style.width= "300px";
    miNodoImagen.style.height= "250px";
    //Precio del producto
    const miNodoPrecio = document.createElement('p');
    miNodoPrecio.classList.add('fs-4', 'mt-3' , 'fw-bold' , 'text-dark');
    miNodoPrecio.textContent = `${divisa}${producto.precio}`;
    //Div de los buttons
    const miNodoDivButtons = document.createElement('div');
    miNodoDivButtons.classList.add('d-grid' , 'gap-3');
    //Button comprar
    const miNodoButtonComprar = document.createElement('button');
    miNodoButtonComprar.classList.add('btn', 'btn-primary' ,'btn-lg' , 'text-light' , 'fw-bold' , 'position-relative');
    miNodoButtonComprar.textContent = 'Comprar' ;
    //Button carrito
    const miNodoButtonCarrito = document.createElement('button');
    miNodoButtonCarrito.setAttribute('marcador' , producto.id);
    miNodoButtonCarrito.classList.add('btn' , 'btn-primary' , 'btn-lg' , 'text-light' , 'fw-bold');
    miNodoButtonCarrito.textContent = 'Añadir al carrito';
    miNodoButtonCarrito.addEventListener('click', anyadirProductoAlCarrito);
    /* miNodoButtonCarrito.addEventListener('click', añadirAlCarrito); */
    miNodo.appendChild(miNodoTitle);
    miNodo.appendChild(miNodoImagen);
    miNodo.appendChild(miNodoPrecio);
    miNodo.appendChild(miNodoDivButtons);
    miNodoDivButtons.appendChild(miNodoButtonComprar);
    miNodoDivButtons.appendChild(miNodoButtonCarrito);
    DOMitems.appendChild(miNodo);
        })};
    

    function anyadirProductoAlCarrito(evento) {
        carrito.push(evento.target.getAttribute('marcador'))
        renderizarCarrito();
        carritoAmmount++;
        carritoValue.innerHTML = carritoAmmount;
        guardarCarritoEnElLocalStorage();
    }

    function renderizarCarrito() {
        DOMcarrito.textContent = '';
        const carritoSinDuplicados = [... new Set(carrito)];
        carritoSinDuplicados.forEach((item) => {
            const miItem = baseDeDatos.filter((itemBaseDeDatos)=> {
                return itemBaseDeDatos.id === parseInt(item);
            });
            
            const numeroUnidadesItem = carrito.reduce((total , itemId) => {
                return itemId === item ? total += 1 : total;
            }, 0);

            const miNodo = document.createElement('li');
            miNodo.classList.add('list-group-item', 'text-right' , 'mx-2');
            miNodo.getAttribute('marcador');
            miNodo.textContent = `${numeroUnidadesItem} x ${miItem[0].title} - ${divisa}${miItem[0].precio}`;

            const miBoton = document.createElement('button');
            miBoton.classList.add('btn' , 'btn-danger', 'mx-2', 'position-relative');
            miBoton.textContent = '-';
            miBoton.style.marginLeft = '1rem';
            miBoton.dataset.item = item;
            miBoton.addEventListener('click', borrarItemCarrito);

            const miBotonComprar = document.createElement('button');
            miBotonComprar.classList.add('btn' , 'btn-primary' , 'mx-2', 'position-relative');
            miBotonComprar.textContent = '+';
            miBotonComprar.style.marginLeft = '1rem';
            miBotonComprar.dataset.item = item;
            miBotonComprar.addEventListener('click', agregarItemCarrito);
            miNodo.appendChild(miBotonComprar);
            miNodo.appendChild(miBoton);
            DOMcarrito.appendChild(miNodo)
        });

        DOMtotal.textContent = calcularTotal();
    }

    function agregarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.push((carritoId) => {
            return carritoId === id;
        });
        renderizarCarrito();
        guardarCarritoEnElLocalStorage();
    }

    function borrarItemCarrito(evento) {
        const id = evento.target.dataset.item;
        carrito = carrito.filter((carritoId) => {
            return carritoId !== id;
        });
        renderizarCarrito();
        guardarCarritoEnElLocalStorage();
    }

    function calcularTotal(){
        return carrito.reduce((total, item)=>{
            const miItem = baseDeDatos.filter((itemBaseDeDatos) => {
                return itemBaseDeDatos.id === parseInt(item);
            });
            return total + miItem[0].precio;
        }, 0).toFixed(2);
    }

    function vaciarCarrito() {
        carrito = [];
        renderizarCarrito();
        localStorage.clear;
    }

    function guardarCarritoEnElLocalStorage() {
        miLocalStorage.setItem('carrito', JSON.stringify(carrito));
    }

    function cargarCarritoDeLocalStorage () {
        if (miLocalStorage.getItem('carrito') !== null) {
            carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
    }

    // Eventos
    DOMbotonVaciar.addEventListener('click', vaciarCarrito);
    DOMbotonComprar.addEventListener('click', anyadirProductoAlCarrito);

    // Inicio
    cargarCarritoDeLocalStorage();
    renderizarProductos();
    renderizarCarrito();
});


//Pintar CARDS
/*             const agregarAlCarrito = (prodId) => {
                const item = productos.find((prod) => prod.id === prodID)
                carrito.push(item)
                console.log(carrito);
            }
             */


//Arrays
        //Metodo lenght: Sirve para obtener el largo de un array
/* const numeros = [1,2,3,4,5,7];

for (let i= 0; i < numeros.length; i++){
    console.log(numeros[i]);
} */

/* let carrito = [];
let usuario;
let usuarioEnLocalStorage = localStorage.getItem("usuario");

if(usuarioEnLocalStorage){
    usuario = usuarioEnLocalStorage;
    alert("Bienvenido " + usuario);
}else{
    usuario = prompt("Ingrese su nombre de usuario");
    localStorage.setItem("usuario" , usuario);
} */

//Pasamos los productos al carrito.
/* localStorage.setItem("carrito", JSON.stringify(Productos));
 */
