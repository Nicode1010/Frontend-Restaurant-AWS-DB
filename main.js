document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('grid');

    // URL de la API para obtener todos los pedidos
    const apiURL = 'https://yknf2fu0l7.execute-api.us-east-1.amazonaws.com/dev/get-orders/';
    // URL de la API para crear una nueva orden
    const createOrderURL = 'https://yknf2fu0l7.execute-api.us-east-1.amazonaws.com/dev/create-order';

    // Variable para almacenar los datos obtenidos
    let ordersData = null;

    // Función para crear una tarjeta de pedido
    const createCard = (order) => {
        const card = document.createElement('div');
        card.className = 'card';
        
        card.innerHTML = `
            <h2>Orden #${order.id_pedido}</h2>
            <p>Tipo de Comida: ${order.TipodeComida}</p>
            <p>Nombre: ${order.Nombre}</p>
            <p>Valor: ${order.Valor}</p>
        `;
        
        return card;
    };

    // Función para obtener datos de la API y renderizar las tarjetas
    const fetchData = async () => {
        try {
            const response = await fetch(apiURL, {
                method: "GET",
            });
            const data = await response.json();

            if (data.msg === "Pedidos encontrados" && Array.isArray(data.orders) && data.orders.length > 0) {
                ordersData = data.orders; // Almacenar los datos obtenidos
                renderCards(ordersData); // Renderizar las tarjetas con los datos obtenidos
            } else {
                console.error('Error: No se encontraron órdenes');
            }
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    // Función para renderizar las tarjetas
    const renderCards = (data) => {
        grid.innerHTML = ''; // Limpiar el contenido previo del grid
        data.forEach(order => {
            const card = createCard(order);
            grid.appendChild(card);
        });
    };

    // Función para mostrar estadísticas al hacer clic en el botón "Estadísticas"
    const showStatistics = () => {
        if (!ordersData) {
            console.error('Error: No se han obtenido datos de órdenes.');
            return;
        }

        // Calcular estadísticas aquí
        const foodFrequency = {};
        ordersData.forEach(order => {
            const foodType = order.TipodeComida;
            if (foodFrequency[foodType]) {
                foodFrequency[foodType]++;
            } else {
                foodFrequency[foodType] = 1;
            }
        });

        let mostOrderedFood = '';
        let highestFrequency = 0;

        for (const foodType in foodFrequency) {
            if (foodFrequency[foodType] > highestFrequency) {
                mostOrderedFood = foodType;
                highestFrequency = foodFrequency[foodType];
            }
        }

        alert(`La comida más pedida es ${mostOrderedFood} con ${highestFrequency} pedidos.`);
    };

    // Función para crear una nueva orden
    const createOrder = async () => {
        try {
            const newOrder = {};

            // Solicitar los detalles de la orden mediante una ventana emergente
            newOrder.id_pedido = prompt('Ingrese el ID del pedido:');
            newOrder.Nombre = prompt('Ingrese el nombre de la comida:');
            newOrder.TipodeComida = prompt('Ingrese el tipo de comida:');
            newOrder.Valor = prompt('Ingrese el valor de la comida:');

            const response = await fetch(createOrderURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newOrder)
            });

            const responseData = await response.json();
            if (response.ok) {
                // Si la orden se crea correctamente, volver a cargar los datos para actualizar la vista
                fetchData();
                alert('Orden creada exitosamente');
            } else {
                console.error('Error al crear la orden:', responseData.message);
            }
        } catch (error) {
            console.error('Error al crear la orden:', error);
        }
    };

    // Llamar a la función para obtener los datos y renderizar las tarjetas
    fetchData();

    // Agregar un evento de clic al botón "Estadísticas"
    const statsButton = document.querySelector('.stats-button');
    statsButton.addEventListener('click', showStatistics);

    // Agregar un evento de clic al botón "Crear Orden"
    const createOrderButton = document.querySelector('.create-order-button');
    createOrderButton.addEventListener('click', createOrder);
});