/// <reference path="IFortEvent.ts" />
/// <reference path="PlayerTeam.ts" />

interface IGymEvent extends IFortEvent {
    OwnedByTeam: PlayerTeam;
    GymPoints: string;
    GuardPokemonId: number;
    GuardPokemonCp: number;
}