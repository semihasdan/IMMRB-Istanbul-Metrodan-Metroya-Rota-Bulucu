export interface Station {
    name: string;
    line: string;
    coordinates: {
        type: string;
        coordinates: [number, number];
    };
}

export interface Route {
    path: Station[];
    distance: number;
    numberOfStations: number;
}

export interface MapStation {
    name: string;
    line: string;
    coordinates: [number, number];
}

export interface MapRoute {
    path: MapStation[];
    distance: number;
    numberOfStations: number;
} 