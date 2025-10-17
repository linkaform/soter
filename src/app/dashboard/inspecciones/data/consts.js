const totalRooms = 130;
const rooms = Array.from({ length: totalRooms }, (_, i) => i + 1); // [1, 2, ..., 130]
const tags = Array.from({ length: 50 }).map(
    (_, i, a) => `Toallas extras: ${a.length - i}`
);

const options = [
    { name: 'Manzana', id: 1 },
    { name: 'Banana', id: 2 },
    { name: 'Naranja', id: 3 }
];

const optionsCuatri = [
    { name: 'C1', id: 1 },
    { name: 'C2', id: 2 },
    { name: 'C3', id: 3 },
];

// Calcular cuatrimestre actual según el mes
function getCurrentCuatri() {
    const month = new Date().getMonth() + 1; // 1-12
    if (month >= 1 && month <= 4) return 1;    // C1
    if (month >= 5 && month <= 8) return 2;    // C2
    return 3;                                  // C3
}

const currentCuatriId = getCurrentCuatri();
const optionsCuatriDefecto = optionsCuatri.filter(opt => opt.id === currentCuatriId);

const optionsHotel = [
    { name: 'Todos', id: 0 },
    { name: 'Hotel 1', id: 1 },
    { name: 'Hotel 2', id: 2 },
    { name: 'Hotel 3', id: 3 },
    { name: 'Hotel 4', id: 4 },
    { name: 'Hotel 5', id: 5 },
    { name: 'Hotel 6', id: 6 },
    { name: 'Hotel 7', id: 7 },
    { name: 'Hotel 8', id: 8 },
    { name: 'Hotel 9', id: 9 },
    { name: 'Hotel 10', id: 10 }
];

const optionsHotelDefecto = [
    { nombre_hotel: 'Todos' },
];

export { rooms, tags, options, optionsCuatri, optionsHotel, optionsHotelDefecto, optionsCuatriDefecto }