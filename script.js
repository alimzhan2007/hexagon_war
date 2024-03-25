function calculateHexagonPoints(centerX, centerY, radius) {
  const points = [];
  for (let i = 0; i < 6; i++) {
    const angleRad = (Math.PI / 3) * i - (Math.PI / 6);
    const x = centerX + radius * Math.cos(angleRad);
    const y = centerY + radius * Math.sin(angleRad);
    points.push(`${x},${y}`);
  }
  return points.join(' ');
}

const radius = 75; // радиус шестиугольника
const width = radius * Math.sqrt(3) + 2;
const height = radius * 2 + 2;
const svgElement = document.getElementById('hexagonSvg');
const centerX = width / 2; // центр по оси X
const centerY = height / 2; // центр по оси Y

let points = calculateHexagonPoints(centerX, centerY, radius);


// Создаем элемент полигона с заданными координатами
const polygonElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
polygonElement.setAttribute('id', 'original_hex');
polygonElement.setAttribute('points', points);
polygonElement.setAttribute('fill', 'none');
polygonElement.setAttribute('stroke', 'black');
polygonElement.setAttribute('stroke-width', '2');
// Добавляем полигон в SVG
svgElement.appendChild(polygonElement);