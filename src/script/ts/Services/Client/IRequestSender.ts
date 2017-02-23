interface IRequestSender {
    sendGetConfigRequest();
    sendPokemonListRequest();
    sendEggsListRequest();
    sendInventoryListRequest();
    sendPlayerStatsRequest();
    sendGetPokemonSettingsRequest();
    sendTransferPokemonRequest(pokemonId: string);
    sendUpgradePokemonRequest(pokemonId: string, max:boolean);
    sendEvolvePokemonRequest(pokemonId: string);
    sendHumanSnipePokemonRemoveRequest(pokemonId: string);
    sendHumanSnipePokemonSnipeRequest(pokemonId: string);
    sendPokemonSnipeListUpdateRequest();
    sendRecycleRequest(itemId: number, count: number);
    sendMoveToRequest(lat: number, lng: number, teleport: boolean, fortId?:string)
    currentBotFamily: BotFamily;
}