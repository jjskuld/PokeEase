interface IMapConfig {
    translationController: ITranslationService;
    requestSender: IRequestSender;
    followPlayer: boolean;
    mapElement: JQuery;
    infoWindowTemplate: JQuery;
}