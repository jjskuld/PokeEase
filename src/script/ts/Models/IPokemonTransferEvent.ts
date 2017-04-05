interface IPokemonTransferEvent extends IEvent {
    Id: number;
	PokemonId: number;
    Cp: number;
    Perfection: number;
    BestCp: number;
    BestPerfection: number;
	Candy: number;
	FamilyId: number;
}