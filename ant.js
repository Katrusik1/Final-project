startButtonEvent();
class Canvas {
    // Класс для моего собственного поля canvas с методами и так далее
    constructor(canvas_id, container_id) {
        this.canvas = document.getElementById(canvas_id);
        this.context = this.canvas.getContext('2d');
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
        this.container = document.getElementById(container_id);
    }

    clearField() {
        this.context.clearRect(0, 0, this.context.canvas.width, this.context.canvas.height);
    }

    resize() {
        // Изменяет размер холста, если событие == 'resize'
        this.canvas.width = this.container.offsetWidth;
        this.canvas.height = this.container.offsetHeight;
        this.width = this.context.canvas.width;
        this.height = this.context.canvas.height;
    }


    drawCirclePoint(point) {
        let ctx = this.context;
        ctx.beginPath();
        ctx.arc(point.x, point.y, 10, 0, 2 * Math.PI);
        ctx.fillStyle = "Black";
        ctx.fill();
    }

    drawPath(point1, point2, color) {
        let ctx = this.context;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.moveTo(point1.x + 3, point1.y + 4);
        ctx.lineTo(point2.x + 3, point2.y + 4);
        ctx.stroke();
    }
}

//добавление точек на холст, когда пользователь нажимает на него.
function putPointByClick(event) {
    let x = event.offsetX;
    let y = event.offsetY;
    canvas.drawCirclePoint({ x, y });
    points.push({ x, y, num });
    num++;
}

//Функция контрольных точек проверяет, есть ли какие-либо точки на холсте, и выводит предупреждение, если таковых нет
function checkPoints() {
    // if CanvasField is clear raises alert
    if (num === 0) {
        console.log("There are no dots!!!");
        alert("Put the dots, baby!");
        return true;
    }
}

//евклидово расстояние между двумя точками
function computeSquareEuclidDistance(point1, point2) {
    return Math.sqrt(Math.pow((point1.x - point2.x), 2) + Math.pow((point1.y - point2.y), 2));
}
//
function drawPoints() {
    for (let i = 0; i < points.length; i++) {
        canvas.drawCirclePoint(points[i]);
    }
}
//Draw рисует линии между точками в заданном порядке.
function Draw(arrNumbers) {
    for (let i = 0; i < num - 1; i++) {
        canvas.drawPath(points[arrNumbers[i]], points[arrNumbers[i + 1]]);
    }

    canvas.drawPath(points[arrNumbers[0]], points[arrNumbers[arrNumbers.length - 2]]); // т.к путь замкнутый
}

//createMatrixWeigh создает матрицу расстояний между всеми парами точек
function createMatrixWeigh(distanceMetric) {
    // заполнение матрицы весов
    let arrive = [];
    for (let i = 0; i < num; i++) {
        let arr = []
        for (let j = 0; j < num; j++) {
            if (i === j) {
                arr.push(0);
            } else {
                arr.push(distanceMetric(points[i], points[j]));
            }
        }
        arrive.push(arr);
    }
    return arrive;
}
//createMatrixPheromone создает матрицу уровней феромонов для каждой пары точек.
function createMatrixPheromone() {
    // заполнение матрицы фермонов
    let arrive = [];
    for (let i = 0; i < num; i++) {
        let arr = [];
        for (let j = 0; j < num; j++) {
            if (i === j) {
                arr.push(0);
            } else {
                arr.push(0.5);
            }
        }
        arrive.push(arr)
    }

    return arrive;
}
//создаём доступные точки
function createAvaiblePoints(currPoint) {
    let arr = [];
    for (let n = 0; n < num; n++) {
        if (n === currPoint) {
            arr.push(false);
        } else {
            arr.push(true);
        }
    }
    return arr;
}

//nextPoint выбирает следующую точку для посещения на основе комбинации уровней феромонов и расстояния.
function nextPoint(mWeight, mPheromone, avPoints, currPoint) {
    // случайный выбор новой вершины
    let desireToMove = [];
    let desireSum = 0;
    let probabilityToMove = [];

    for (let i = 0; i < avPoints.length; i++) {
        if (avPoints[i]) {
            let disire = Math.pow(200 / mWeight[currPoint][i], beta) * Math.pow(mPheromone[currPoint][i], alfa);
            desireToMove.push(disire);
            desireSum += disire;
        } else {
            desireToMove.push(0);
        }
    }
    probabilityToMove.push(desireToMove[0] / desireSum);

    for (let i = 1; i < desireToMove.length; i++) {
        probabilityToMove.push(probabilityToMove[i - 1] + (desireToMove[i] / desireSum));
    }

    let randomValue = Math.random();
    for (let i = 0; i < probabilityToMove.length; i++) {
        if (randomValue <= probabilityToMove[i]) {
            return i;
        }
    }
}

//Функция plusPheromone обновляет/увеличивает уровни феромонов на путях, пройденных муравьями, которые нашли более короткий путь.
function plusPheromone(mPheromone, path) {
    for (let i = 0; i < path.length - 2; i++) {
        mPheromone[i][i + 1] += (Q / path[path.length - 1]);
        mPheromone[i + 1][i] += (Q / path[path.length - 1]);
    }

    mPheromone[path[0]][path[path.length - 2]] += (Q / path[path.length - 1]);
    mPheromone[path[path.length - 2]][path[0]] += (Q / path[path.length - 1]);

    return mPheromone;
}

//minusPheromone снижает уровень феромонов на всех путях.
function minusPheromone(mPheromone) {
    for (let i = 0; i < mPheromone.length; i++) {
        for (let j = 0; j < mPheromone.length; j++) {
            mPheromone[i][j] *= pheromoneResidue;
        }
    }

    return mPheromone;
}
//Функция startButtonEvent прослушивает нажатие кнопки "Start" и запускает алгоритм оптимизации муравьиной колонии.
function startButtonEvent() {
    document.getElementById("Start").addEventListener("click", function() {

        //Очищается поле canvas вызовом функции clearField().
        canvas.clearField();
        //Выводятся на экран точки, которые были заданы пользователем, при помощи вызова функции drawPoints().
        drawPoints();
        //Проверяется наличие точек, если их нет, то функция завершает работу.
        if (!checkPoints()) {
            //Кнопка "Start" блокируется, чтобы не было возможности запустить алгоритм повторно.
            document.getElementById("Start").disabled = true;
            canvas.clearField();
            for (let i = 0; i < num; i++) {
                canvas.drawCirclePoint(points[i]);
            }
            // Определяется тип метрики расстояния для матрицы весов и создаются две матрицы:
            // матрица весов и матрица феромонов.
            //console.log() — это метод, предназначенный для печати в консоль браузера.
            console.log('start')
            checkRadioButtons("metric");
            let matrixWeight = createMatrixWeigh(metricTypes[distanceMetric]);
            let matrixPheromone = createMatrixPheromone();
            //Устанавливается значение длины минимального пути по умолчанию равное бесконечности
            // и создается массив минимального пути.
            let minPathLength = Infinity;
            let minPath = [];


            for (let x = 0; x < iterationsNum; x++) {

                //Создается массив для всех найденных путей в текущей итерации.
                let allPath = [];

                for (let j = 0; j < num; j++) {
                    //Для каждой точки находится доступный множество точек и выбирается следующая точка
                    // с помощью функции nextPoint(), которая учитывает значения матриц весов и феромонов.
                    let availablePoints = createAvaiblePoints(j);
                    let currPath = [];
                    let lenghtCurrPath = 0;
                    currPath.push(j);

                    for (let i = 0; i < num - 1; i++) {
                        let newPoint = nextPoint(matrixWeight, matrixPheromone, availablePoints, currPath[i]);
                        currPath.push(newPoint);
                        availablePoints[newPoint] = false;
                        //Строится найденный путь, который добавляется в массив всех путей.
                        lenghtCurrPath += metricTypes[distanceMetric](points[currPath[currPath.length - 2]], points[currPath[currPath.length - 1]]);
                    }

                    lenghtCurrPath += metricTypes[distanceMetric](points[currPath[0]], points[currPath[currPath.length - 1]]);
                    //Если найденный путь короче, чем длина текущего минимального пути,
                    // то обновляются значения длины минимального пути и самого пути.
                    if (lenghtCurrPath < minPathLength) {
                        minPathLength = lenghtCurrPath;
                        minPath = currPath;
                    }
                    //В массив всех путей для каждого пути из текущей итерации добавляется значение его длины.
                    currPath.push(lenghtCurrPath);
                    allPath.push(currPath);

                }
                //Матрица феромонов обновляется: с каждой итерацией феромон на действительно пройденном муравьем пути испаряется,
                matrixPheromone = minusPheromone(matrixPheromone);
                // а на оставшихся путях добавляются новые следы феромонов в соответствии с длинами найденных путей на этой итерации.
                for (let i = 0; i < allPath.length; i++) {
                    matrixPheromone = plusPheromone(matrixPheromone, allPath[i]);
                }
            }
            //вызывается функция drawAll(), которая отображает минимальный путь на canvas.
            drawAll(minPath);
            //Кнопка "Start" разблокируется.
            document.getElementById("Start").disabled = false;

        }
    });
}

function drawAll(minPath) {
    canvas.clearField();
    drawPoints();
    Draw(minPath);
}
//Функция inputRange обновляет значение параметров на основе
// ввода с помощью ползунков диапазона.
function inputRange(id) {
    let rng = document.getElementById(`${id}Range`);
    let counter = document.getElementById(`${id}Counter`);
    counter.textContent = counter.textContent.replace(/\d+/, `${rng.value}`);
    switch (id) {
        case 'iterations':
            iterationsNum = parseInt(rng.value);
            break;
        case 'pheramoneQ':
            Q = parseInt(rng.value);
            break;
        case 'pheramoneR':
            pheromoneResidue = parseInt(rng.value) / 100;
            break;
        case 'beta':
            beta = parseInt(rng.value);
            break;
        case 'alfa':
            alfa = parseInt(rng.value);
            break;
    }
}

//Функция checkRadioButtons обновляет используемый показатель расстояния на
// основе ввода с помощью переключателей.
function checkRadioButtons(name) {
    let radioButtons = document.getElementsByName(name)
    for (const radioButton of radioButtons) {
        if (radioButton.checked) {
            switch (name) {
                case "metric":
                    distanceMetric = radioButton.value;
                    break;
            }
            break;
        }
    }
}


function clearAll() {
    // Clears canvas and data. Creates standard solve with current amount of clusters
    document.getElementById("Start").disabled = false;
    points = [];
    canvas.clearField();
    num = 0;
}

//создается объект Canvas, настраивает прослушиватели событий для щелчков мыши
// и изменения размера окна и инициализирует несколько переменных.
let canvas = new Canvas('canvas_1', 'container-canvas');
canvas.canvas.addEventListener('mousedown', function(event) {
    putPointByClick(event, canvas);

})
window.addEventListener('resize', function() {
    canvas.resize();
    clearAll();
}, false);
window.onload = canvas.resize.bind(canvas);


let points = [];
let num = 0;
let iterationsNum = 2000;
let pheromoneResidue = 0.65;
let Q = 4;
let beta = 3;
let alfa = 1;
metricTypes = {
    "euclid": computeSquareEuclidDistance,
}
let distanceMetric = "euclid"