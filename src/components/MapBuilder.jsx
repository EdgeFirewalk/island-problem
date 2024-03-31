import React, { useState } from 'react';
import '../styles/MapBuilder.css';

const MapBuilder = ({ mapSize, islandMap, setIslandMap }) => {
    let builtIslandMap = [];

    function buildInputMap(mapSize) {
        if (mapSize.N < 3 || mapSize.M < 3) {
            // Карта для ввода не будет отрисована, если был неверный ввод
            return;
        }

        let cells = []; // Инпуты для точек и решёточек
        let currentId = 0;
        for (let i = 0; i < mapSize.N; i++) {
            for (let j = 0; j < mapSize.M; j++) {
                cells.push(
                    <input
                        id={currentId.toString()}
                        key={currentId}
                        className="map-builder__cell"
                        type="text"
                        value={islandMap[currentId]}
                        onChange={(e) => {
                            let value = e.target.value;
                            let newMap = [...islandMap];
                            newMap[e.target.id] =
                                value === '.' || value === '#' ? value : '#'; // Любой символ будет преобразован в решёточку, если это не точка
                            setIslandMap(newMap);
                        }}
                        onFocus={(e) => e.target.select()}
                    />
                );
                currentId++;
            }
            cells.push(<br key={Math.random()} />);
        }

        return <div className="map-builder__inner">{cells}</div>;
    }

    return (
        <div className="map-builder">
            <div className="container">{buildInputMap(mapSize)}</div>
        </div>
    );
};

export default MapBuilder;
