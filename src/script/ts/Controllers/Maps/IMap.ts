﻿interface IMap {
    config: IMapConfig;
    movePlayer: (position: IUpdatePositionEvent) => void;
    setPokeStops: (pokeStops: IPokeStopEvent[]) => void;
    setGyms: (gyms: IGymEvent[]) => void;
    targetFort: (target: IFortTargetEvent) => void;
    usePokeStop: (pokeStopUsed: IFortUsedEvent) => void;
    onPokemonCapture: (pokemonCapture: IPokemonCaptureEvent) => void;
    onSnipePokemonStart: (snipePokemon: IHumanWalkSnipeStartEvent) => void;
    onHumanSnipeReachedDestination: (ev: IHumanWalkSnipeReachedEvent) => void;
    onMapClick : (ev:any) => void;
}