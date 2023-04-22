const CanvasKmeans = document.getElementById("CanvasKmeans");
const CanvasHierarchy = document.getElementById("CanvasHierarchy");
// два холста CanvasKmeans и CanvasHierarchy, используя метод getElementById и getContext,
// чтобы получить контекст рисования на каждом холсте.
const ctxCanvasKmeans = CanvasKmeans.getContext("2d");
const ctxCanvasHierarchy = CanvasHierarchy.getContext("2d");
//Затем создаются массивы для кругов на каждом холсте: circleKmeans для кругов/
// на холсте Kmeans и circleHierarchy для кругов на холсте иерархии.
let circleKmeans = [];
let circleHierarchy = []
//массивы circlesX и circlesY для хранения координат x и y каждого круга.;
let circlesX = [];
let circlesY = [];
//радиус круга равный 5.
const radius = 5;
//массив цветов для раскраски кластеров
colours = [
    'blue',
    'yellow',
    'green',
    'purple',
    'orange',
    'gray',
    'plum',
    'burlywood',
    'darkgoldenrod',
    'darkslateblue',
    'fuchsia',
    'indigo',
    'mediumvioletred',
    'orangered',
    'powderblue',
    'thistle',
    'aqua',
    'cadetblue',
    'darkgray',
    'darkslategray',
    'lightgreen',
    'magenta',
    'midnightblue',
    'orchid',
    'purple',
    'tomato',
    'aquamarine',
    'chartreuse',
    'darkgreen',
    'darkturquoise',
    'khaki',
    'lightpink',
    'rebeccapurple',
    'brown',
    'darkcyan',
    'forestgreen',
    'indianred',
    'mediumturquoise',
    'orange',
    'plum',
    'burlywood',
    'darkgoldenrod',
    'darkslateblue',
    'fuchsia',
    'indigo',
    'mediumvioletred',
    'orangered',
    'powderblue',
    'thistle',
    'aqua',
    'cadetblue',
    'darkgray',
    'darkslategray',
    'lightgreen',
    'magenta',
    'midnightblue',
    'orchid',
    'purple',
    'tomato',
    'aquamarine',
    'chartreuse',
    'darkgreen',
    'darkturquoise',
    'khaki',
    'lightpink',
    'rebeccapurple',
    'brown',
    'darkcyan',
    'forestgreen',
    'indianred',
    'mediumturquoise',
    'orange',
    'plum',
    'burlywood',
    'darkgoldenrod',
    'darkslateblue',
    'fuchsia',
    'indigo',
    'mediumvioletred',
    'orangered',
    'powderblue',
    'thistle',
    'aqua',
    'cadetblue',
    'darkgray',
    'darkslategray',
    'lightgreen',
    'magenta',
    'midnightblue',
    'orchid',
    'purple',
    'tomato',
    'aquamarine',
    'chartreuse',
    'darkgreen',
    'darkturquoise',
    'khaki',
    'lightpink',
    'rebeccapurple',
    'steelblue',
    'violet',
]

//С помощью метода addEventListener добавляются два события click на каждый из холстов.
// Когда пользователь щелкает на холст, получаются координаты щелчка
// и добавляются в массивы circlesX и circlesY,
// а также добавляются -1 значения в массивы circleKmeans и circleHierarchy,
// представляющие, что каждый круг находится в одной общей группе.
CanvasKmeans.addEventListener("click", function(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    circlesX.push(x);
    circlesY.push(y);
    circleKmeans.push(-1);
    circleHierarchy.push(-1);
    drawCircleCanvasKmeans(x, y, -1);
    drawCircleCanvasHierarchy(x, y, -1);
});

CanvasHierarchy.addEventListener("click", function(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    circlesX.push(x);
    circlesY.push(y);
    circleKmeans.push(-1);
    circleHierarchy.push(-1);
    drawCircleCanvasKmeans(x, y, -1);
    drawCircleCanvasHierarchy(x, y, -1);
});

// clearCanvas-очистка холста
function clearCanvas() {
    ctxCanvasKmeans.clearRect(0, 0, CanvasKmeans.width, CanvasKmeans.height);
    ctxCanvasHierarchy.clearRect(0, 0, CanvasHierarchy.width, CanvasHierarchy.height);
    circlesX = [];
    circlesY = [];
    circleKmeans = [];
    circleHierarchy = [];
}
// drawCircleCanvas..-рисования кругов на каждом холсте с соответствующим цветом.

function drawCircleCanvasKmeans(x, y, col){
    ctxCanvasKmeans.beginPath();
    ctxCanvasKmeans.arc(x, y, radius, 0, 2 * Math.PI);
    ctxCanvasKmeans.fillStyle=colours[col];
    ctxCanvasKmeans.fill();
}
function drawCircleCanvasHierarchy(x, y, col)
{
    ctxCanvasHierarchy.beginPath();
    ctxCanvasHierarchy.arc(x, y, radius, 0, 2 * Math.PI);
    ctxCanvasHierarchy.fillStyle =colours[col];
    ctxCanvasHierarchy.fill();
}

//changeColor... используются для перерисовки кругов на каждом холсте с цветами,
// соответствующим их группировке в массивы circleKmeans и circleHierarchy.
function changeColorKmeans() {
    ctxCanvasKmeans.clearRect(0, 0, CanvasKmeans.width, CanvasKmeans.height);
    for (var i = 0; i < circlesX.length; i++) {
        drawCircleCanvasKmeans(circlesX[i], circlesY[i], circleKmeans[i]);
    }
}

function changeColorHierarchy() {
    ctxCanvasHierarchy.clearRect(0, 0, CanvasHierarchy.width, CanvasHierarchy.height);
    for (var i = 0; i < circlesX.length; i++) {
        drawCircleCanvasHierarchy(circlesX[i], circlesY[i], circleHierarchy[i]);
    }
}
//Также есть функция расчета расстояния между двумя точками на плоскости,

function dist(x1, x2, y1, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
}

// основная функция clusterization, которая открывает доступ к кнопкам
// и вызывает алгоритмы Kmeans() и Hierarchy(),
// обрабатывающие информацию о расположении кругов на холстах.

function clusterization() {
    document.getElementById('count').disabled = true;
    document.getElementById('clearMap').disabled = true;
    document.getElementById('claster').disabled = true;

    Kmeans();
    Hierarchy();

    document.getElementById('count').disabled = false;
    document.getElementById('clearMap').disabled = false;
    document.getElementById('claster').disabled = false;
}
// функция случайного целого числа
function randomInteger(min, max) {
    let rand = min + Math.random() * (max - min);
    return Math.floor(rand);
}