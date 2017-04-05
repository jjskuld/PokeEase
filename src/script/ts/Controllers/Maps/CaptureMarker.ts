class CaptureMarker extends google.maps.OverlayView {

    private latlng: google.maps.LatLng;
    private div: HTMLElement;
    private args: any;
    private map :google.maps.Map;
    private current: IPokemonCaptureEvent;

    constructor(latlng: google.maps.LatLng, map: google.maps.Map, sender: IPokemonCaptureEvent , args: any) {
        super();

	    this.latlng = latlng;
	    this.args = args;
	    this.setMap(map);
        this.map = map;
        this.current = sender;
    }

    public draw() {
	    var div = this.div;

	    if (!div) {

		    div = this.div = document.createElement('div');
		    var innerdiv = document.createElement('div');

		    var d = $(div);
          
		    var i = $(innerdiv);

		    d.addClass('marker');
		    d.css({
			    'position': "absolute",
			    'width': "60px",
			    'height': "60px",
			    'z-index': "99999"
		    })

		    if(this.args.PokemonId !== 'undefined')
			    i.css({'background-image': "url(images/pokemon/" + this.args.PokemonId + ".png)"});

		    i.css({
			    'background-size': "contain",
			    'background-position': "center center",
			    'background-repeat': 'no-repeat',
			    'width': "40px",
			    'height': "40px",
			    'margin': "5px"
		    })

		    d.append(i);
		    
            var panes = this.getPanes();
		    panes.overlayMouseTarget.appendChild(div);
            var me = this;
            let map = this.map;
            let pokemonName = this.args.Name;
            let popupData :IPokemonInfoPopupData = this.current;
            popupData.Name = pokemonName;
            popupData.PokemonId = this.args.PokemonId;
            google.maps.event.addDomListener(div, "click", function(event) {
			    var infowindow = new google.maps.InfoWindow({
                  content:  app.templates.PokemonInfoPopup(popupData)
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
