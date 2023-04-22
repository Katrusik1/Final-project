function Kmeans() {
    let index;
    let klasterNumber;
    let klcount = document.getElementById("count").value;

    let klasterX = [];
    let klasterY = [];
    // массив расстояний от каждой точки до ближайшего кластера,
    let distance = [];
    //массив старых расстояний до кластеров
    let distanceOld = [];

    //Затем происходит инициализацию координат для каждого кластера
    // путем генерации случайных точек на CanvasKmeans.
    for (index = 0; index < klcount; ++index) {
        klasterX.push(randomInteger(0, CanvasKmeans.width));
        klasterY.push(randomInteger(0, CanvasKmeans.height));
    }
//Далее начинается цикл, проходящий через каждую точку circlesX,
// а для каждой из них ищется ближайший кластер и считается расстояние до него.
    for (index = 0; index < circlesX.length; ++index) {
        let indSave = 0;
        let minDist = 999999;

        for (klasterNumber = 0; klasterNumber < klcount; ++klasterNumber) {
            if (minDist > dist(klasterX[klasterNumber], circlesX[index], klasterY[klasterNumber], circlesY[index])) {
                minDist = dist(klasterX[klasterNumber], circlesX[index], klasterY[klasterNumber], circlesY[index]);
                indSave = klasterNumber;
            }
        }
        //Сохраняется индекс кластера с наименьшим расстоянием в массив circleKmeans,
        // а также в distanceS сохраняется  минимальное расстояние до ближайшего кластера.

        distanceOld[index] = minDist;
        circleKmeans[index] = indSave;
    }
//Затем для каждого кластера считается новое среднее расположение
// и сохраняется в массивах klasterX и klasterY.
    for (klasterNumber = 0; klasterNumber < klcount; ++klasterNumber) {
        let distY = 0;
        let distX = 0;
        let count = 0;

        for (index = 0; index < circlesX.length; ++index) {
            if (circleKmeans[index] === klasterNumber) {
                distY += circlesY[index];
                distX += circlesX[index];
                ++count;
            }
        }

        klasterY[klasterNumber] = distY / count;
        klasterX[klasterNumber] = distX / count;
    }

//Далее еще раз происходит похожий цикл, который обновляет расстояния до ближайшего кластера
    for (index = 0; index < circlesX.length; ++index) {
        let indSave = 0;
        let minDist = 999999;

        for (klasterNumber = 0; klasterNumber < klcount; ++klasterNumber) {
            if (minDist > dist(klasterX[klasterNumber], circlesX[index], klasterY[klasterNumber], circlesY[index])) {
                minDist = dist(klasterX[klasterNumber], circlesX[index], klasterY[klasterNumber], circlesY[index]);
                indSave = klasterNumber;
            }
        }

        distance[index] = minDist;
        circleKmeans[index] = indSave;
    }

    //Затем начинается основной цикл алгоритма k-средних.
    while (radius) {
        let stopper = 0; // Флаг для проверки изменения расстояний между кластерами
        let contin = 0; // Флаг для проверки наличия пустых кластеров
        // Цикл для просчета расстояний между центрами кластеров
        for (klasterNumber = 0; klasterNumber < klcount; ++klasterNumber) {
            let dist = 0; // Расстояние между текущим и предыдущим центром кластера
            let distS = 0; // Расстояние между текущим и новым центром кластера
            for (index = 0; index < circlesX.length; ++index) { // Цикл для рассчета расстояний между центрами и кругами
                if (circleKmeans[index] === klasterNumber) { // Если круг относится к текущему кластеру
                    dist += Math.pow(distance[index], 2);
                    distS += Math.pow(distanceOld[index], 2);
                }
            }
            if (dist !== distS) { // Если расстояние между текущим и предыдущим центром не равно расстоянию между текущим и новым центром
                stopper = 1; // Установка флага, что произошло изменение расстояний
                break;
            }
        }
// Цикл для пересчета координат центров кластеров
        for (klasterNumber = 0; klasterNumber < klcount; ++klasterNumber) {
            let distY = 0;
            let distX = 0;
            let count = 0;
            for (index = 0; index < circlesX.length; ++index) { // Цикл для подсчета количества кругов в текущем кластере и суммирования их координат
                if (circleKmeans[index] === klasterNumber) { // Если круг относится к текущему кластеру
                    distY += circlesY[index];
                    distX += circlesX[index];
                    ++count;
                }
            }
            klasterY[klasterNumber] = distY / count; // Пересчет координат Y центра кластера
            klasterX[klasterNumber] = distX / count; // Пересчет координат X центра кластера
        }
// Цикл для проверки наличия пустых кластеров
        if (stopper === 0) {
            for (klasterNumber = 0; klasterNumber < klcount; ++klasterNumber) {
                let count = 0;

                for (index = 0; index < circlesX.length; ++index) {
                    // Если круг относится к текущему кластеру
                    if (circleKmeans[index] === klasterNumber) {
                        ++count;
                    }
                }
                if (count === 0) { // Если в текущем кластере нет кругов
                    // Цикл для переинициализации координат центров кластеров
                    for (index = 0; index < klcount; ++index) {
                        klasterX[index] = randomInteger(0, CanvasKmeans.width);
                        klasterY[index] = randomInteger(0, CanvasKmeans.height);
                    }
                    contin = 1; // Установка флага, что был найден пустой кластер
                }
            }
        }
// Если изменения не происходят, то алгоритм завершается
        if ((contin === 0) && (stopper === 0)) {
            break;
        }
// Цикл для пересчета расстояний между центрами и кругами и определения принадлежности к кластерам
        for (index = 0; index < circlesX.length; ++index) {
            let indSave = 0;
            let minDist = 999999;

            for (klasterNumber = 0; klasterNumber < klcount; ++klasterNumber) {
                if (minDist > dist(klasterX[klasterNumber], circlesX[index], klasterY[klasterNumber], circlesY[index])) {
                    minDist = dist(klasterX[klasterNumber], circlesX[index], klasterY[klasterNumber], circlesY[index]);
                    indSave = klasterNumber;
                }
            }

            distanceOld[index] = distance[index];
            distance[index] = minDist;
            circleKmeans[index] = indSave;
        }
    }
    //После завершения алгоритма вызывается функция changeColorKmeans(),
    // которая меняет цвет кругов в зависимости от кластера, к которому они относятся.
    changeColorKmeans();
}