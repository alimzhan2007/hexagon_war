let originalPolygon = svgElement.querySelector('polygon'); // Находим первый полигон в SVG

let layer = 15;
svgElement.setAttribute('width', width * layer * 100);
svgElement.setAttribute('height', height * layer * 100);
let border = Math.floor(layer / 2); 
let grid = [];
const leftshift = radius * Math.sqrt(3);
const topshift = radius * 1.5;
function placePixels(){
    const rect = svgElement.getBoundingClientRect();
    let leftCoord = rect.left; // координата самой левой границы SVG контейнера относительно видимой области браузера
    for(let i = 0; i < layer; i++){
        let local = [];
        for(let j = 0; j < layer; j++){
            if(i + j < border || i + j > layer * 2 - 2 - border){
                local.push(null);
                leftCoord += leftshift;
            }
            else{
                local.push(true);
                const clonedPolygon = originalPolygon.cloneNode(true);
                points = clonedPolygon.getAttribute('points').split(' ');
                const newPoints = points.map(point => {
                const [x, y] = point.split(',').map(parseFloat);
                return `${x + leftshift + leftCoord},${y + i * topshift}`; // Смещаем каждую точку на leftshift пикселей влево
                }).join(' ');
                clonedPolygon.setAttribute('points', newPoints);
                clonedPolygon.id = "pixel_i" + i+"j" + j;
                svgElement.appendChild(clonedPolygon);
                leftCoord += leftshift;        
            }
        }
        grid.push(local);
        leftCoord = rect.left + (leftshift / 2) * (i + 1);
    }
}
originalPolygon.remove();
console.log(grid);
placePixels();


//painting
let drawing = false; // Флаг для отслеживания рисования

// Обработчик события начала рисования
function startDrawing(event) {
    drawing = true;
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const rect = svgElement.getBoundingClientRect();
    const offsetX = mouseX - rect.left;
    const offsetY = mouseY - rect.top;
    const closestHex = findClosestHex(offsetX, offsetY);
    if (closestHex) {
        closestHex.setAttribute('fill', 'blue'); // Изменяем цвет выбранного шестиугольника
    }
}

// Обработчик события окончания рисования
function endDrawing() {
    drawing = false;
}

// Обработчик события перемещения мыши (рисование)
function draw(event) {
    if (drawing) {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const rect = svgElement.getBoundingClientRect();
        const offsetX = mouseX - rect.left;
        const offsetY = mouseY - rect.top;
        const closestHex = findClosestHex(offsetX, offsetY);
        if (closestHex) {
            closestHex.setAttribute('fill', 'blue'); // Изменяем цвет выбранного шестиугольника
        }
    }
}

// Функция для нахождения ближайшего шестиугольника к указанным координатам
function findClosestHex(x, y) {
    const elements = document.querySelectorAll('polygon[id^="pixel_i"]'); // Находим все шестиугольники
    let closest = null;
    let closestDistance = Infinity;
    elements.forEach(element => {
        const bbox = element.getBBox();
        const centerX = bbox.x + bbox.width / 2;
        const centerY = bbox.y + bbox.height / 2;
        const distance = Math.sqrt(Math.pow(centerX - x, 2) + Math.pow(centerY - y, 2));
        if (distance < closestDistance) {
            closest = element;
            closestDistance = distance;
        }
    });
    return closest;
}

// Добавляем обработчики событий для рисования
svgElement.addEventListener('mousedown', startDrawing);
svgElement.addEventListener('mouseup', endDrawing);
svgElement.addEventListener('mousemove', draw);