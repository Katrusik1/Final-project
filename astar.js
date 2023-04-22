var n = document.getElementById("size").value;
var table = document.getElementById("table");
var start = null;
var end = null;
var impassables = new Set();
var map;
var flagForTableButtons = true;
generateMap();

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function generateMap() {

    n = document.getElementById("size").value;
    map = new Array(n);
    for (let i = 0; i < n; i++) {
        map[i] = new Array(n);
        for (let j = 0; j < n; j++) {
            map[i][j] = 0;
        }
    }
    var newTable = document.createElement("table");
    for (var i = 0; i < n; i++) {
        var row = document.createElement("tr");
        for (var j = 0; j < n; j++) {
            var cell = document.createElement("td");
            cell.dataset.x = j;
            cell.dataset.y = i;
            cell.addEventListener("click", function() {
                if (flagForTableButtons) {
                    // При клике на ячейку устанавливаем ее как начальную или конечную
                    if (start == null && this != end && !impassables.has(this)) {
                        start = this;
                        this.classList.add("start");
                    } else if (end == null && this != start && !impassables.has(this)) {
                        end = this;
                        this.classList.add("end");
                        // При повторном нажатии на начальную или конечную ячейку - освобождаем её
                    } else if (this == start || this == end) {
                        if (this == start) {
                            start = null;
                            this.classList.remove("start");
                        }
                        if (this == end) {
                            end = null;
                            this.classList.remove("end");
                        }
                        // При нажатии на ячейку устанавливаем её как непроходимую
                    } else if (!impassables.has(this) && this != start && this != end) {
                        impassables.add(this);
                        this.classList.remove("searching");
                        this.classList.add("impassable");
                        // При повторном нажатии на непроходимую клетку - освобождаем её
                    } else if (impassables.has(this)) {
                        impassables.delete(this);
                        this.classList.remove("impassable");
                    }
                }
            });
            row.appendChild(cell);
        }
        newTable.appendChild(row);
    }

    // Заменяем старую таблицу новой
    table.parentNode.replaceChild(newTable, table);

    // Сбрасываем переменные
    table = newTable;
    start = null;
    end = null;
    impassables.clear();
}

function findPath() {

    // Удаляем старый путь
    for (var i = 0; i < n; i++) {
        for (var j = 0; j < n; j++) {
            var cell = table.rows[i].cells[j];
            cell.classList.remove("path");
            cell.classList.remove("searching");
        }
    }

    // Ищем путь 
    if (start == null || end == null) {
        alert("Укажите стартовую и конечную клетки!");
    } else {
        var openSet = new Set([start]);
        var cameFrom = new Map();
        var gScore = new Map([
            [start, 0]
        ]);
        var fScore = new Map([
            [start, heuristic(start, end)]
        ]);
        while (openSet.size > 0) {
            var current = getLowestFScore(openSet, fScore);
            if (current == end) { //если дошли до конечной точки -> выводим получившийся путь
                showPath(cameFrom, end);
                return;
            }
            openSet.delete(current);
            for (var neighbor of getNeighbors(current)) { //перебираем другие соседские клетки
                if (impassables.has(neighbor)) { //непроходимая клетка -> идем дальше
                    continue;
                }

                var tentativeGScore = gScore.get(current) + 1;

                if (!gScore.has(neighbor) || tentativeGScore < gScore.get(neighbor)) {
                    cameFrom.set(neighbor, current);
                    gScore.set(neighbor, tentativeGScore);
                    fScore.set(neighbor, tentativeGScore + heuristic(neighbor, end));
                    if (!openSet.has(neighbor)) {
                        openSet.add(neighbor);
                        if (neighbor != end) {
                            neighbor.classList.add("searching");
                        }
                    }
                }
            }
        }
        alert("Путь не найден!");
    }
}

function getLowestFScore(set, scores) {
    // Находим элемент из множества с наименьшим значением fScore
    var lowest = null;
    var lowestScore = Infinity;
    for (var elem of set) {
        if (scores.get(elem) < lowestScore) {
            lowest = elem;
            lowestScore = scores.get(elem);
        }
    }
    return lowest;
}

function getNeighbors(cell) {
    // Получаем соседние ячейки
    var neighbors = new Set();
    var x = cell.cellIndex;
    var y = cell.parentNode.rowIndex;
    if (x > 0) {
        neighbors.add(table.rows[y].cells[x - 1]);
    }
    if (x < n - 1) {
        neighbors.add(table.rows[y].cells[x + 1]);
    }
    if (y > 0) {
        neighbors.add(table.rows[y - 1].cells[x]);
    }
    if (y < n - 1) {
        neighbors.add(table.rows[y + 1].cells[x]);
    }
    return neighbors;
}

function heuristic(a, b) {
    // Вычисляем эвристическое расстояние между двумя клетками
    var x1 = a.cellIndex;
    var y1 = a.parentNode.rowIndex;
    var x2 = b.cellIndex;
    var y2 = b.parentNode.rowIndex;
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

async function showPath(cameFrom, current) {
    // Отображаем найденный путь
    while (cameFrom.has(current)) {
        current = cameFrom.get(current);
        if (current != start) {
            current.classList.remove("searching");
            current.classList.add("path");
            await sleep(100);
        }
    }
}
class Coords {
    x = null;
    y = null;
    constructor(x, y) { //инициаоизация координат точки
        this.x = x;
        this.y = y;
    }
}

//сделать поле пустым
function makeEmpty(x, y) {
    map[x][y] = 0;
    table.rows[x].cells[y].classList.remove("start");
    table.rows[x].cells[y].classList.remove("end");
    table.rows[x].cells[y].classList.remove("searching");
    table.rows[x].cells[y].classList.remove("path");
    table.rows[x].cells[y].classList.remove("impassable");
    impassables.delete(table.rows[x].cells[y]);
}
//сделать поле стеной
function makeWall(x, y) {
    map[x][y] = 1;
    table.rows[x].cells[y].classList.remove("start");
    table.rows[x].cells[y].classList.remove("end");
    table.rows[x].cells[y].classList.remove("searching");
    table.rows[x].cells[y].classList.remove("path");
    table.rows[x].cells[y].classList.add("impassable");
    impassables.add(table.rows[x].cells[y]);
}
//проверка на пустое поле
function isEmpty(x, y) {
    return map[x][y] === 0 ? true : false;
}

//создание лабиринта
async function createPrimmLabyrinth() {

    // Создание массива лабиринта
    let map = new Array(n);
    for (let i = 0; i < n; i++) {
        map[i] = new Array(n);
    }

    //начальные и конечные позиции
    let topRow = 0;
    let bottomRow = n - 1;
    let topCell = 0;
    let bottomCell = n - 1;

    //заполнение лабиринта
    while (topRow <= bottomRow) {
        while (topCell < n && bottomCell >= 0) {
            makeWall(topRow, topCell);
            makeWall(bottomRow, bottomCell);

            topCell++;
            bottomCell--;
        }
        topCell = 0;
        bottomCell = n - 1;
        topRow++;
        bottomRow--;
    }


    //рандомная ячейка начала генерации лабиринта
    let cell = new Coords(Math.floor((Math.random() * (n / 2))) * 2, Math.floor((Math.random() * (n / 2))) * 2);
    makeEmpty(cell.x, cell.y);

    //массив использованных ячеек
    let isUsed = new Array(n);
    for (let i = 0; i < n; i++) {
        isUsed[i] = new Array(n);
        for (let j = 0; j < n; j++) {
            isUsed[i][j] = false;
        }
    }
    isUsed[cell.x][cell.y] = true; //посетили начальную точку 

    // Создание массива и добавление туда точек лабиринта находящиеся в двух клетках от координаты которую выбрали выше.
    let toCheck = new Array;
    if (cell.y - 2 >= 0) {
        toCheck.push(new Coords(cell.x, cell.y - 2));
        isUsed[cell.x][cell.y - 2] = true;
    }
    if (cell.y + 2 < n) {
        toCheck.push(new Coords(cell.x, cell.y + 2));
        isUsed[cell.x][cell.y + 2] = true;
    }
    if (cell.x - 2 >= 0) {
        toCheck.push(new Coords(cell.x - 2, cell.y));
        isUsed[cell.x - 2][cell.y] = true;
    }
    if (cell.x + 2 < n) {
        toCheck.push(new Coords(cell.x + 2, cell.y));
        isUsed[cell.x + 2][cell.y] = true;
    }

    // Пока есть элементы в массиве, выбрать рандомный и убрать стены.
    while (toCheck.length > 0) {
        let index = Math.floor(Math.random() * toCheck.length);
        let x = toCheck[index].x;
        let y = toCheck[index].y;
        makeEmpty(x, y);

        if (x == n - 2) {
            makeEmpty(x + 1, y);
        }
        if (y == n - 2) {
            makeEmpty(x, y + 1);
        }
        toCheck.splice(index, 1);


        // Убрать стену в ячейке находящейся между рандомной ячейкой и ее родителем.
        let directions = ["up", "down", "right", "left"];
        let flag = false;
        while (directions.length > 0 && !flag) {
            let dir_index = Math.floor(Math.random() * directions.length);
            switch (directions[dir_index]) {
                case "up":
                    if (y - 2 >= 0 && isEmpty(x, y - 2)) {
                        makeEmpty(x, y - 1);
                        flag = true;
                    }
                    break;
                case "down":
                    if (y + 2 < n && isEmpty(x, y + 2)) {
                        makeEmpty(x, y + 1);
                        flag = true;
                    }
                    break;
                case "right":
                    if (x - 2 >= 0 && isEmpty(x - 2, y)) {
                        makeEmpty(x - 1, y);
                        flag = true;
                    }
                    break;
                case "left":
                    if (x + 2 < n && isEmpty(x + 2, y)) {
                        makeEmpty(x + 1, y);
                        flag = true;
                    }
                    break;
            }
            directions.splice(dir_index, 1);
        }




        // Добавить новые клетки которые можно зачистить.
        if (y - 2 >= 0 && !isEmpty(x, y - 2) && !isUsed[x][y - 2]) {
            toCheck.push(new Coords(x, y - 2));
            isUsed[x][y - 2] = true;
        }
        if (y + 2 < n && !isEmpty(x, y + 2) && !isUsed[x][y + 2]) {
            toCheck.push(new Coords(x, y + 2));
            isUsed[x][y + 2] = true;
        }
        if (x - 2 >= 0 && !isEmpty(x - 2, y) && !isUsed[x - 2][y]) {
            toCheck.push(new Coords(x - 2, y));
            isUsed[x - 2][y] = true;
        }
        if (x + 2 < n && !isEmpty(x + 2, y) && !isUsed[x + 2][y]) {
            toCheck.push(new Coords(x + 2, y));
            isUsed[x + 2][y] = true;
        }
    }
}