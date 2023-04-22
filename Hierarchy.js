// Функция иерархической кластеризации
function Hierarchy() {
    let number, index;
// Получаем количество кластеров из элемента с id "count"
    let klnumber = document.getElementById("count").value;

// Создаем массивы для хранения номеров, координат по x и y для каждого кластера
    let clustersNumber = [];
    let clustersX = [];
    let clustersY = [];

// Заполняем массивы начальными значениями отдельных кластеров, каждый со своим номером и координатами
    for (index = 0; index < circlesX.length; ++index) {
        clustersNumber[index] = index;
        clustersX[index] = circlesX[index];
        clustersY[index] = circlesY[index];
    }

    while (1) {
        let count = 0;
// Подсчитываем количество кластеров
        for (number = 0; number < clustersNumber.length; ++number) {
            let nmb = 0;
            for (index = 0; index < clustersNumber.length; ++index) {
                // Если встретили кластер с таким же номером, значит он уже был объединен
                if (clustersNumber[index] === number) {
                    nmb = 1;
                    break;
                }
            }
            count += nmb;
        }

// Если кластеров столько же, сколько указано в "count", то заканчиваем работу
        if (count == klnumber) {
            break;
        }

// Находим два ближайших кластера
        let mindist = 999999;
        let indf = 0;
        let inds = 0;
        for (let indexfir = 0; indexfir < circlesX.length - 1; ++indexfir) {
            for (let indexsec = indexfir + 1; indexsec < circlesX.length; ++indexsec) {
                let distant = dist(clustersX[indexfir], clustersX[indexsec], clustersY[indexfir], clustersY[indexsec]);
                if ((distant < mindist) && (distant !== 0)) {
                    mindist = distant;
                    indf = indexfir;
                    inds = indexsec;
                }
            }
        }

// Находим новые координаты для объединенного кластера
        let clustcenterx = (clustersX[indf] + clustersX[inds]) / 2;
        let clustcentery = (clustersY[indf] + clustersY[inds]) / 2;

// Записываем номер второго кластера
        clusNum = clustersNumber[inds];
// Объединяем кластеры, записывая новые координаты в первый кластер
        clustersX[indf] = clustcenterx;
        clustersY[indf] = clustcentery;
        for (index = 0; index < clustersNumber.length; ++index) {
            // Заменяем номер второго кластера на номер первого кластера в массиве номеров кластеров clustersNumber
            if (clustersNumber[index] === clusNum) {
                clustersNumber[index] = clustersNumber[indf];
                // Обновляем координаты для всех точек, относящихся к объединенному кластеру
                clustersX[index] = clustcenterx;
                clustersY[index] = clustcentery;
            }
        }
    }

// Массив для хранения типов кластеров (номеров)
    let numberType = [];
// Создаем новые типы кластеров, пропуская кластеры, которые были объединены ранее
    for (number = 0; number < clustersNumber.length; ++number) {
        let type = 0;
        for (index = 0; index < clustersNumber.length; ++index) {
            if (clustersNumber[index] === number) {
// Кластер относится к новому типу
                type = 1;
                break;
            }
        }
        if (type === 1) {
            numberType.push(number);
        }
    }

// Создаем новый массив цветов кластеров на основе типов кластеров
    for (let color = 0; color < numberType.length; ++color) {
        for (number = 0; number < clustersNumber.length; ++number) {
            if (clustersNumber[number] === numberType[color]) {
                circleHierarchy[number] = color;
            }
        }
    }
    //После завершения алгоритма вызывается функция changeColorHierarchy(),
    // которая меняет цвет кругов в зависимости от кластера, к которому они относятся.
    changeColorHierarchy();
}