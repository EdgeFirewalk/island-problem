import React, { useState } from 'react';
import MapSizeInputs from './components/MapSizeInputs';
import MapBuilder from './components/MapBuilder';
import IslandMap from './components/IslandMap';

const App = () => {
    const [mapSize, setMapSize] = useState({
        N: 3,
        M: 3
    });
    const [islandMap, setIslandMap] = useState(new Array(9).fill('.'));

    function setNewMapSize(newMap) {
        // По условию задачи N и M находятся в диапазоне от 3 до 100
        const MAX = 100;

        // При вводе больше 100 инпуты примут значение 100
        // При вводе меньше 3 инпуты обведутся красным и карта для ввода не будет построена (см. MapBuilder)
        if (newMap.N > MAX) {
            setMapSize({ ...mapSize, N: MAX });
            setIslandMap(new Array(MAX * newMap.M).fill('.'));
        } else if (newMap.M > MAX) {
            setMapSize({ ...mapSize, M: MAX });
            setIslandMap(new Array(newMap.N * MAX).fill('.'));
        } else {
            setMapSize({
                N: parseInt(newMap.N),
                M: parseInt(newMap.M)
            });

            try {
                // На случай, если из инпута прилетит NaN (в таком случае карта для ввода не отрисуется)
                setIslandMap(new Array(newMap.N * newMap.M).fill('.'));
            } catch {}
        }
    }

    return (
        <div className="App">
            <MapSizeInputs mapSize={mapSize} setNewMapSize={setNewMapSize} />
            <MapBuilder
                mapSize={mapSize}
                islandMap={islandMap}
                setIslandMap={setIslandMap}
            />
            <IslandMap mapSize={mapSize} islandMap={islandMap} />
        </div>
    );
};

export default App;
