import React from 'react';
import '../styles/IslandMap.css';

const IslandMap = ({ mapSize, islandMap }) => {
    // Создавать карту для того, чтобы потом пользователь мог добавить на неё остров, удобнее из одномерного массива,
    // но позже удобнее проходиться уже по двумерному массиву, чтобы обнаружить остров и придумать путь для пилота
    const twoDimIslandMap = splitArray(islandMap, mapSize.M);
    function splitArray(array, part) {
        let tmp = [];
        // Разделяем одномерный массив по строчкам и получаем удобную карту для работы алгоритмов
        for (let i = 0; i < array.length; i += part) {
            tmp.push(array.slice(i, i + part));
        }
        return tmp;
    }

    let answer = []; // Сюда поместятся координаты (начинающиеся с единицы) для пилота самолёта
    let hasAnswer = false;
    let hasTwoIslands = false;
    let isIslandTouchingSide = false;

    function findAdjacentWaterCells(grid) {
        // Направления по которым будем искать соседние с островом клетки
        const directions = [
            [0, 1], // Вправо
            [1, 0], // Вниз
            [0, -1], // Влево
            [-1, 0], // Вверх
            [1, 1], // Вправо вниз
            [1, -1], // Влево вниз
            [-1, 1], // Вверх вправо
            [-1, -1] // Вверх влево
        ];
        const result = [];

        // Находим любую клетку острова
        let x, y;
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === '#') {
                    x = i;
                    y = j;
                    break;
                }
            }
            if (x !== undefined && y !== undefined) {
                break;
            }
        }

        // Добавляем соседние с островом клетки в результирующий массив
        // Проходимся по всем заранее заданным направлениям
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                // Если клетка является частью острова
                if (grid[i][j] === '#') {
                    for (let k = 0; k < directions.length; k++) {
                        // Выбираем следующее направление
                        const dx = directions[k][0];
                        const dy = directions[k][1];
                        // Находим координаты соседней точки с данной
                        const nx = i + dx;
                        const ny = j + dy;

                        // Проверяем, находится ли соседняя клетка в пределах карты (если нет, то это ошибка входных данных, но это обрабатывается позже)
                        // Заодно проверяем, является ли следующая клетка водой
                        if (
                            nx >= 0 &&
                            nx < grid.length &&
                            ny >= 0 &&
                            ny < grid[nx].length &&
                            grid[nx][ny] === '.'
                        ) {
                            const key = `${nx},${ny}`;
                            // По ключу проверяем, не была ли данная клетка уже добавлена в результат
                            if (
                                !result.some(
                                    (cell) => `${cell[0]},${cell[1]}` === key
                                )
                            ) {
                                result.push([nx, ny]);
                            }
                        }
                    }
                }
            }
        }

        // Вычисляем центр масс острова (т. е. его среднюю точку)
        let totalX = 0;
        let totalY = 0;
        let count = 0;
        // Проходим по всем клеткам, чтобы найти центр
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                // Смотрим, является ли рассматриваемая точка островом
                if (grid[i][j] === '#') {
                    totalX += i;
                    totalY += j;
                    count++;
                }
            }
        }
        // Вычисляем средние значения всех координат по Х и по У
        const centerX = totalX / count;
        const centerY = totalY / count;

        // Сортируем клетки по углу относительно центра масс острова, чтобы понять, как они располагаются друг относительно друга
        result.sort((a, b) => {
            // Разница координат для каждой клетки относительно центра острова
            const dx1 = a[0] - centerX;
            const dy1 = a[1] - centerY;
            const dx2 = b[0] - centerX;
            const dy2 = b[1] - centerY;

            // Здесь считаются углы между линиями, соединящюими рассматриваемые клетки с центром масс
            const angle1 = Math.atan2(dy1, dx1) + 2 * Math.PI;
            const angle2 = Math.atan2(dy2, dx2) + 2 * Math.PI;

            // Сортируем клетки по углам, чтобы получить их в порядке, идущем по часовой стрелке
            if (angle1 > angle2) {
                return -1;
            } else if (angle1 < angle2) {
                return 1;
            } else {
                // Если углы вдруг равны, то сортируем по расстоянию до центра масс
                const d1 = dx1 * dx1 + dy1 * dy1;
                const d2 = dx2 * dx2 + dy2 * dy2;
                if (d1 < d2) {
                    return -1;
                } else if (d1 > d2) {
                    return 1;
                } else {
                    return 0;
                }
            }
        });

        return result;
    }

    function hasTwoLands(grid) {
        // Массив для отслеживания уже посещённых клеток
        const visited = Array.from({ length: grid.length }, () =>
            Array(grid[0].length).fill(false)
        );

        // Указывает, есть ли на карте хотя бы один остров
        let hasLand = false;

        // Здесь используется алгоритм Depth-First Search для обхода всех клеток острова
        const dfs = (i, j) => {
            // Проверяем, находится ли текущая клетка в пределах карты, не была ли посещена ранее и является ли она частью острова
            if (
                i < 0 ||
                i >= grid.length ||
                j < 0 ||
                j >= grid[i].length ||
                visited[i][j] ||
                grid[i][j] !== '#'
            ) {
                return;
            }

            // Текущая клетка помечается как посещённая
            visited[i][j] = true;
            // И тут рекурсивно обходятся все соседние клетки
            dfs(i + 1, j); // Вниз
            dfs(i - 1, j); // Вверх
            dfs(i, j + 1); // Вправо
            dfs(i, j - 1); // Влево
        };

        // Ищем любую клетку острова, чтобы начать обход с неё
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === '#') {
                    hasLand = true; // Остров на карте найден
                    dfs(i, j); // Проходимся по нему
                    break;
                }
            }
            if (hasLand) {
                break;
            }
        }

        // Проверяем, есть ли на карте непосещённые клетки острова
        // Если такая найдётся, то это значит, что на карте есть второй остров
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === '#' && !visited[i][j]) {
                    return true; // Второй остров найден
                }
            }
        }

        return false; // Второго острова нет
    }

    function isLandTouchingSide(grid) {
        // Проверяем, есть ли клетки острова в первой или последней строке
        for (let j = 0; j < grid[0].length; j++) {
            if (grid[0][j] === '#' || grid[grid.length - 1][j] === '#') {
                return true;
            }
        }

        // То же самое в первой или последней колонке
        for (let i = 0; i < grid.length; i++) {
            if (grid[i][0] === '#' || grid[i][grid[i].length - 1] === '#') {
                return true;
            }
        }

        return false;
    }

    function buildIslandMap() {
        // Сразу проверяем, есть ли на карте два острова или касается ли остров края карты
        // И та и другая ситуация недопустимы по условию задачи, поэтому если одна из них обнаружится, то соответствующий флаг
        // станет равен true и покажется соответствующая ошибка
        if (hasTwoLands(twoDimIslandMap)) {
            hasTwoIslands = true;
            return;
        } else if (isLandTouchingSide(twoDimIslandMap)) {
            isIslandTouchingSide = true;
            return;
        }
        // Ещё можно было бы проверять на то, есть ли внутри острова блоки с водой (что является ошибкой входных данных, вроде бы),
        // но не получилось...

        const pilotPath = findAdjacentWaterCells(twoDimIslandMap);
        pilotPath.length > 0 ? (hasAnswer = true) : (hasAnswer = false);
        answer = []; // Обнуляем ответ, чтобы старый не показался при возникновении ошибки ввода размера карты
        if (hasAnswer) {
            answer.push(
                <p key={-1} className="island-map__subtitle title">
                    Ответ
                </p>
            );
            for (let i = 0; i < pilotPath.length; i++) {
                // По условию задачи координаты в ответе начинаются с единицы, а не с нуля
                answer.push(
                    <p key={i} className="island-map__answer">
                        {pilotPath[i][0] + 1} {pilotPath[i][1] + 1}
                    </p>
                );
            }
        }

        let innerTable = []; // Это будет раскрашенная таблица с водой, островом и путём пилота
        let currentIndex = 0;
        let cellTypeClass = ''; // Это добавочный класс для клетки таблицы, который будет говорить, в какой цвет её раскрасить
        for (let i = 0; i < mapSize.N; i++) {
            let row = [];
            for (let j = 0; j < mapSize.M; j++) {
                if (twoDimIslandMap[i][j] === '.') {
                    cellTypeClass = 'island-table__water';
                } else if (twoDimIslandMap[i][j] === '#') {
                    cellTypeClass = 'island-table__island';
                }

                // Если текущие координаты есть в координатах, найденных для пилота
                if (pilotPath.some((cell) => cell[0] === i && cell[1] === j)) {
                    cellTypeClass = 'island-table__airplane-path';
                }

                row.push(
                    <td
                        key={currentIndex}
                        className={'island-table__td ' + cellTypeClass}
                    >
                        {i + 1}, {j + 1}{' '}
                        {/* По условию задачи координаты начинаются с единицы, а не с нуля */}
                    </td>
                );
                currentIndex++;
                cellTypeClass = '';
            }
            innerTable.push(<tr key={i}>{row}</tr>);
        }

        return (
            <table className="island-table">
                <tbody>{innerTable}</tbody>
            </table>
        );
    }

    return (
        <div className="island-map">
            <div className="container">
                <div className="island-map__inner">
                    <p className="island-map__title title">Полученная карта</p>
                    {buildIslandMap()}
                    {hasAnswer ? answer : ''}
                    <p className="island-map__error">
                        {hasTwoIslands
                            ? 'Ошибка входных данных: На карте находится более одного острова.'
                            : ''}
                    </p>
                    <p className="island-map__error">
                        {isIslandTouchingSide
                            ? 'Ошибка входных данных: Остров касается края карты.'
                            : ''}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default IslandMap;
