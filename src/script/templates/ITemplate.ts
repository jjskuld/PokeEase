class app{
     static templates: ITemplate;
}
interface IJournal{
    SnipeStartNotification(data:ISnipeStartNotificationData) :string;
    PokemonUpgraded(data: IPokemonUpgradedData) :string;
}
interface ITemplateNotification {
    Journals:IJournal;

}
interface ITemplate{
    PokemonInfoPopup(data: IPokemonInfoPopupData):string;
    SnipePokemonItem(data:ISnipePokemonItemData) :string;
    SnipePokemonMarker(data:ISnipePokemonMarkerData) :string;
    PokemonSnipeInfoPopup(data: IPokemonSnipeInfoPopupData): string;
    SelectedPostionPopup(data: ISelectedPostionPopup): string;
    Notifications: ITemplateNotification;
    InfoWindow: ITemplateInfoWindow;
    Pokemon : IPokemonTemplate
}