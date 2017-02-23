﻿class SettingsService implements ISettingsService {
    public dataStorage: IDataStorage;

    public get settings(): ISettings {
        return this.cloneSettings(this.currentSettings);
    }
    private currentSettings: ISettings;
    private settingsKey = "settings";
    private subscribers: ((settings: ISettings, previousSettings: ISettings) => void)[];

    constructor(dataStorage: IDataStorage) {
        this.dataStorage = dataStorage;
        this.subscribers = [];
    }

    public load = (): void => {
        const loadedSettings = this.dataStorage.getData<ISettings>(this.settingsKey);
        if (loadedSettings === null) {
            this.apply(DefaultSettings.settings);
            return;
        }
        this.apply(loadedSettings);
    }

    private cloneSettings = (settings: ISettings): ISettings => {
        return this.mergeSettings([settings]);
    }

    private mergeSettings = (allSettings: ISettings[]): ISettings => {

        const notificationsJournal: INotificationSettings = {
            pokestopUsed: this.coalesceMap(allSettings, s => s.notificationsJournal && s.notificationsJournal.pokestopUsed),
            pokemonCapture: this.coalesceMap(allSettings, s => s.notificationsJournal && s.notificationsJournal.pokemonCapture),
            pokemonSnipe: this.coalesceMap(allSettings, s => s.notificationsJournal && s.notificationsJournal.pokemonSnipe),
            pokemonEvolved: this.coalesceMap(allSettings, s => s.notificationsJournal && s.notificationsJournal.pokemonEvolved),
            eggHatched: this.coalesceMap(allSettings, s => s.notificationsJournal && s.notificationsJournal.eggHatched),
            incubatorStatus: this.coalesceMap(allSettings, s => s.notificationsJournal && s.notificationsJournal.incubatorStatus),
            itemRecycle: this.coalesceMap(allSettings, s => s.notificationsJournal && s.notificationsJournal.itemRecycle),
            pokemonTransfer: this.coalesceMap(allSettings, s => s.notificationsJournal && s.notificationsJournal.pokemonTransfer)
        };

        const notificationsDesktop: INotificationSettings = {
            pokestopUsed: this.coalesceMap(allSettings, s => s.notificationsDesktop && s.notificationsDesktop.pokestopUsed),
            pokemonCapture: this.coalesceMap(allSettings, s => s.notificationsDesktop && s.notificationsDesktop.pokemonCapture),
            pokemonSnipe: this.coalesceMap(allSettings, s => s.notificationsDesktop && s.notificationsDesktop.pokemonSnipe),
            pokemonEvolved: this.coalesceMap(allSettings, s => s.notificationsDesktop && s.notificationsDesktop.pokemonEvolved),
            eggHatched: this.coalesceMap(allSettings, s => s.notificationsDesktop && s.notificationsDesktop.eggHatched),
            incubatorStatus: this.coalesceMap(allSettings, s => s.notificationsDesktop && s.notificationsDesktop.incubatorStatus),
            itemRecycle: this.coalesceMap(allSettings, s => s.notificationsDesktop && s.notificationsDesktop.itemRecycle),
            pokemonTransfer: this.coalesceMap(allSettings, s => s.notificationsDesktop && s.notificationsDesktop.pokemonTransfer)
        };

        const notificationsToast: INotificationSettings = {
            pokestopUsed: this.coalesceMap(allSettings, s => s.notificationsToast && s.notificationsToast.pokestopUsed),
            pokemonCapture: this.coalesceMap(allSettings, s => s.notificationsToast && s.notificationsToast.pokemonCapture),
            pokemonSnipe: this.coalesceMap(allSettings, s => s.notificationsToast && s.notificationsToast.pokemonSnipe),
            pokemonEvolved: this.coalesceMap(allSettings, s => s.notificationsToast && s.notificationsToast.pokemonEvolved),
            eggHatched: this.coalesceMap(allSettings, s => s.notificationsToast && s.notificationsToast.eggHatched),
            incubatorStatus: this.coalesceMap(allSettings, s => s.notificationsToast && s.notificationsToast.incubatorStatus),
            itemRecycle: this.coalesceMap(allSettings, s => s.notificationsToast && s.notificationsToast.itemRecycle),
            pokemonTransfer: this.coalesceMap(allSettings, s => s.notificationsToast && s.notificationsToast.pokemonTransfer)
        };
		
		const notificationsAudio: INotificationSettings = {
            pokestopUsed: this.coalesceMap(allSettings, s => s.notificationsAudio && s.notificationsAudio.pokestopUsed),
            pokemonCapture: this.coalesceMap(allSettings, s => s.notificationsAudio && s.notificationsAudio.pokemonCapture),
            pokemonSnipe: this.coalesceMap(allSettings, s => s.notificationsAudio && s.notificationsAudio.pokemonSnipe),
            pokemonEvolved: this.coalesceMap(allSettings, s => s.notificationsAudio && s.notificationsAudio.pokemonEvolved),
            eggHatched: this.coalesceMap(allSettings, s => s.notificationsAudio && s.notificationsAudio.eggHatched),
            incubatorStatus: this.coalesceMap(allSettings, s => s.notificationsAudio && s.notificationsAudio.incubatorStatus),
            itemRecycle: this.coalesceMap(allSettings, s => s.notificationsAudio && s.notificationsAudio.itemRecycle),
            pokemonTransfer: this.coalesceMap(allSettings, s => s.notificationsAudio && s.notificationsAudio.pokemonTransfer)
        };

        return {
            mapProvider: this.coalesceMap(allSettings, s => s.mapProvider),
            mapFolllowPlayer: this.coalesceMap(allSettings, s => s.mapFolllowPlayer),
            mapClearing: this.coalesceMap(allSettings, s => s.mapClearing),
            mapGoogleApiKey: this.coalesceMap(allSettings, s => s.mapGoogleApiKey),
            mapOsmApiKey: this.coalesceMap(allSettings, s => s.mapOsmApiKey),

            clientAddress: this.coalesceMap(allSettings, s => s.clientAddress),
            clientPort: this.coalesceMap(allSettings, s => s.clientPort),
            clientUseSSL: this.coalesceMap(allSettings, s => s.clientUseSSL),

            notificationsJournal: notificationsJournal,
            notificationsDesktop: notificationsDesktop,
            notificationsToast: notificationsToast,
			notificationsAudio: notificationsAudio,
            notificationsJournalClearingAnimation: this.coalesceMap(allSettings, s => s.notificationsJournalClearingAnimation)
        }
    }

    private coalesceMap<TModel, TResult>(inputs: TModel[], map: (orig: TModel) => TResult): TResult {
        const mapped = _.map(inputs, map);
        return this.coalesce(mapped);
    }

    private coalesce = <T>(inputs: T[]): T => {
        for (let i = 0; i < inputs.length; i++) {
            if (typeof inputs[i] !== "undefined") {
                return inputs[i];
            }
        }
        throw "No value found";
    }

    public apply = (settings: ISettings) => {
        const previousSettings = this.currentSettings;
        const defaultSettings = DefaultSettings.settings;
        const mergedSettings = this.mergeSettings([settings, defaultSettings]);
        this.currentSettings = mergedSettings;
        for (let i = 0; i < this.subscribers.length; i++) {
            const settingsClone = this.cloneSettings(mergedSettings);
            const previousClone = this.cloneSettings(previousSettings);
            this.subscribers[i](settingsClone, previousClone);
        }
        this.save();
    }

    private save = (): void => {
        this.dataStorage.setData(this.settingsKey, this.currentSettings);
    }

    public subscribe(action: (settings: ISettings, previousSettings: ISettings) => void): void {
        this.subscribers.push(action);
    }

    public settingsEqual(settings: ISettings, to: ISettings):boolean {
        let equal = true;

        equal = equal && settings.mapProvider === to.mapProvider;
        equal = equal && settings.mapFolllowPlayer === to.mapFolllowPlayer;
        equal = equal && settings.mapClearing === to.mapClearing;
        equal = equal && settings.mapGoogleApiKey === to.mapGoogleApiKey;
        equal = equal && settings.mapOsmApiKey === to.mapOsmApiKey;

        equal = equal && settings.clientAddress === to.clientAddress;
        equal = equal && settings.clientPort === to.clientPort;
        equal = equal && settings.clientUseSSL === to.clientUseSSL;

        equal = equal && this.notificationSettingsEqual(settings.notificationsJournal, to.notificationsJournal);
        equal = equal && this.notificationSettingsEqual(settings.notificationsDesktop, to.notificationsDesktop);
        equal = equal && this.notificationSettingsEqual(settings.notificationsToast, to.notificationsToast);
		equal = equal && this.notificationSettingsEqual(settings.notificationsAudio, to.notificationsAudio);

        equal = equal && settings.notificationsJournalClearingAnimation === to.notificationsJournalClearingAnimation;

        return equal;
    }

    private notificationSettingsEqual(settings: INotificationSettings, to: INotificationSettings) {
        let equal = true;
        equal = equal && settings.pokestopUsed === to.pokestopUsed;
        equal = equal && settings.pokemonCapture === to.pokemonCapture;
        equal = equal && settings.pokemonSnipe === to.pokemonSnipe;
        equal = equal && settings.pokemonEvolved === to.pokemonEvolved;
        equal = equal && settings.eggHatched === to.eggHatched;
        equal = equal && settings.incubatorStatus === to.incubatorStatus;
        equal = equal && settings.itemRecycle === to.itemRecycle;
        equal = equal && settings.pokemonTransfer === to.pokemonTransfer;
        return equal;
    }
}