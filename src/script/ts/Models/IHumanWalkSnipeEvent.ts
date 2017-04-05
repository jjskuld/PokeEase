enum HumanWalkEventTypes{
        StartWalking,
        DestinationReached,
        PokemonScanned,
        AddedSnipePokemon,
        PokestopUpdated,
        NotEnoughtPalls,
        TargetedPokemon,
        ClientRequestUpdate,
        EncounterSnipePokemon,
        QueueUpdated
}
interface IHumanWalkSnipeFilter{
    MaxDistance :number;
    MaxWalkTimes : number;
    Priority :number;
    CatchPokemonWhileWalking :boolean;
    SpinPokestopWhileWalking :boolean;
    AllowSpeedUp :boolean;
    MaxSpeedUpSpeed :number;

}
interface ISnipePokemonInfo{
    Distance :number;
    EstimatedTime :number;
    IsCatching :number;
    Latitude :number;
    Longitude :number;
    Id :number;
    ExpiredTime :string;
    IsFake :boolean;
    IsVisited :boolean;
    Setting :IHumanWalkSnipeFilter;
    Source :string;
    UniqueId:string;
}

interface IHumanWalkSnipeListEvent {
    Pokemons: ISnipePokemonInfo[]
}                                            
interface IHumanWalkSnipeEvent extends IEvent{
    Latitude: number;
    Longitude: number; 
    Distance: number;
    Estimate: number;
    Expires: number;
    PokemonId: number;
    UniqueId: string;
    CatchPokemon: Boolean;
    CurrentBalls: number;
    MinBallsToSnipe: number;
    NearestDistance: number;
    PauseDuration: number;
    Pokemons: any;
    Pokestops: any;
    Setting: any;
    SpinPokeStop: boolean;
    Timestamp: number;
    Type: HumanWalkEventTypes;
    WalkSpeedApplied: number;
    WalkTimes: number;
    Rarity?:string;
}
 interface IHumanWalkSnipeStartEvent extends IEvent{
    Latitude: number;
    Longitude: number; 
    PokemonId: number;
    PokemonName?:string;
    Distance:number;
    Estimated: number;
    Rarity?:string;
 }
 interface IHumanWalkSnipeReachedEvent extends IEvent{
    UniqueId:string;
    PauseDuration: number; 
}
