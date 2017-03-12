class SnipeMarker extends google.maps.OverlayView {

    private latlng: google.maps.LatLng;
    private div: HTMLElement;
    private args: any;
    private map :google.maps.Map;
    private current: IHumanWalkSnipeStartEvent;

    constructor(latlng: google.maps.LatLng, map: google.maps.Map, sender: IHumanWalkSnipeStartEvent , args: any) {
        super();

	    this.latlng = latlng;
	    this.args = args;
	    this.setMap(map);
        this.map = map;
        this.current = sender;
    }
    public remove() {
        this.setMap(null)
        $(this.div).remove();
    }
    public draw() {
	    var div = this.div;

	    if (!div) {

            const markerHtml = app.templates.SnipePokemonMarker( {PokemonId: this.current.PokemonId});
		    div = this.div = $(markerHtml)[0]
        
            var panes = this.getPanes();
		    panes.overlayMouseTarget.appendChild(div);
            var me = this;
            let map = this.map;
            let pokemonName = this.args.Name;
            let popupData :IPokemonSnipeInfoPopupData = this.current;
            popupData.PokemonName = pokemonName;
            //popupData.PokemonId = this.args.PokemonId;
            google.maps.event.addDomListener(div, "click", function(event) {
			    var infowindow = new google.maps.InfoWindow({
                  content:  app.templates.PokemonSnipeInfoPopup(popupData)
                });
                 infowindow.open(map, me);
                 window.setIwStyles();
                 event.stopPropagation();
			    google.maps.event.trigger(self, "click");
		    });
	    }

	    var point = this.getProjection().fromLatLngToDivPixel(this.latlng);

	    if (point) {
		    div.style.left = (point.x - 30) + 'px';
		    div.style.top = (point.y - 30) + 'px';
	    }
    }

    public getPosition(): google.maps.LatLng {
        return this.latlng;
    }
}
