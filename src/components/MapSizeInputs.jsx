import React from 'react';
import '../styles/MapSizeInputs.css';

const MapSizeInputs = ({ mapSize, setNewMapSize }) => {
    return (
        <div className="map-size">
            <div className="container">
                <div className="map-size__inner">
                    <div className="map-size__input-block">
                        <label htmlFor="N" className="map-size__label">
                            N =
                        </label>
                        <label htmlFor="M" className="map-size__label">
                            M =
                        </label>
                    </div>
                    <div className="map-size__input-block">
                        <input
                            id="N"
                            className="map-size__input"
                            type="text"
                            value={mapSize.N}
                            onChange={(e) =>
                                setNewMapSize({ ...mapSize, N: e.target.value })
                            }
                            onFocus={(e) => e.target.select()}
                            style={
                                isNaN(mapSize.N) || mapSize.N < 3
                                    ? { border: '2px solid red' }
                                    : {}
                            }
                        />
                        <input
                            id="M"
                            className="map-size__input"
                            type="text"
                            value={mapSize.M}
                            onChange={(e) =>
                                setNewMapSize({ ...mapSize, M: e.target.value })
                            }
                            onFocus={(e) => e.target.select()}
                            style={
                                isNaN(mapSize.M) || mapSize.M < 3
                                    ? { border: '2px solid red' }
                                    : {}
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MapSizeInputs;