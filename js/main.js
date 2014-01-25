var transitmix = transitmix || {};

transitmix.Route = Backbone.Model.extend({
  defaults: {
    polyline: [],
  },
});

transitmix.Routes = Backbone.Collection.extend({
  model: transitmix.Route,
});

transitmix.MainView = Backbone.View.extend({
  el: 'body',

  events: {
    "mouseenter .ui": "showAdd",
    "mouseleave .ui": "hideAdd",
    "click .add": "beginAdd",
    "click .doneDrawing": "finishAdd",
  },

  initialize: function() {
    this.drawMode = false;
    this.newLine = false;
    this.newLineNext = false;
    this.showingDoneButton = false;

    this.center = [37.778733, -122.421467];
    this.defaultZoomLevel = 14;

    var options = { tileLayer: { detectRetina: true }};
    this.map = L.mapbox.map('map', 'samhashemi.h3e534lc', options)
      .setView(this.center, this.defaultZoomLevel);

    // Have to go through MapBox to get the latlong metadata
    this.map.on('click', _.bind(this.addPoint, this));
    this.map.on('mousemove', _.bind(this.showNext, this));
  },

  showAdd: function() {
    $('.add').slideDown(150);
  },

  hideAdd: function() {
    $('.add').slideUp(150);
  },

  beginAdd: function() {
    if (this.drawMode) return;
    this.drawMode = true;
  },

  addPoint: function(e) {
    if (!this.drawMode) return;

    var latlng = e.latlng;
    if (!this.newLine) {
      var options = {
        color: '#0D7215',
        opacity: 1,
        weight: 10,
      };
      this.newLine = L.polyline([latlng], options).addTo(this.map);
    } else {
      this.newLine.addLatLng(latlng);

      // Insert button to finish drawing.
      // TODO: Refactor this and other drawing code into seperate view.
      if (!this.showingDoneButton) this.$el.append('<div class="doneDrawing">Done</div>');
    }

    // Move the 'Finish'  
    var point = e.containerPoint;
    $('.doneDrawing').css({
      left: point.x + 10,
      top: point.y - 20,
    });
  },

  // Shows where the transit line will go if a user clicks.
  // Basically the "predicated" path of the cursor.
  showNext: function(e) {
    if (!this.drawMode || !this.newLine) return;

    var lastClickedPoint = _.last(this.newLine.getLatLngs());
    var currentMousePosition = e.latlng;

    var latlngs = [lastClickedPoint, currentMousePosition];
    if (!this.newLineNext) {
      var options = {
        color: '#0D7215',
        opacity: 1,
        weight: 10,
      };
      this.newLineNext = L.polyline(latlngs, options).addTo(this.map);
    } else {
      this.newLineNext.setLatLngs(latlngs);
    }
  },

  finishAdd: function() {
    // TODO: Figure out how to actually remove the line...
    this.newLineNext.setStyle({opacity: 0});

    this.collection.add({
      name: 'hello',
      description: 'ummmm',
      polyline: this.newLine.getLatLngs(),
    });

    this.drawMode = false;
    this.newLine = false;
    this.newLineNext = false;

    $('.doneDrawing').remove();
    this.showingDoneButton = false;
  },

  render: function() {
    this.collection.each(function(route) {
      var latlngs = route.get('polyline');
      var color = route.get('color');

      var options = {
        color: color,
        opacity: 1,
        weight: 10,
      };
      L.polyline(latlngs, options).addTo(this.map);
    }, this);
  },
});

transitmix.init = function() {
  // pre-filled set of routes.
  // TODO: load these via server call using a URL paramter
  var data = [{"name":"hello","description":"ummmm","color":"#AD0101","polyline":[{"lat":37.74818629372592,"lng":-122.42013931274413},{"lat":37.77254656936578,"lng":-122.42271423339842},{"lat":37.771596736802074,"lng":-122.42348670959471},{"lat":37.775803045522146,"lng":-122.42434501647949},{"lat":37.77227518987836,"lng":-122.45249748229982},{"lat":37.77085043122794,"lng":-122.45532989501953},{"lat":37.77261441408201,"lng":-122.4657154083252},{"lat":37.77247872458732,"lng":-122.46889114379881},{"lat":37.77071473849609,"lng":-122.47172355651855},{"lat":37.771596736802074,"lng":-122.47541427612303},{"lat":37.770239811973674,"lng":-122.48159408569336},{"lat":37.770104118121296,"lng":-122.48485565185547},{"lat":37.77078258489315,"lng":-122.48674392700195},{"lat":37.77078258489315,"lng":-122.49180793762206},{"lat":37.76671169088488,"lng":-122.50605583190918},{"lat":37.76928994977783,"lng":-122.50845909118652},{"lat":37.770443352285376,"lng":-122.51094818115233}]},
              {"name":"hello","description":"ummmm","color":"#0071CA","polyline":[{"lat":37.74811842660096,"lng":-122.41936683654784},{"lat":37.77281794785716,"lng":-122.42202758789061},{"lat":37.78787789236924,"lng":-122.40348815917969},{"lat":37.79676317682161,"lng":-122.40511894226076},{"lat":37.80035768295354,"lng":-122.4103546142578},{"lat":37.799543847826506,"lng":-122.41739273071288},{"lat":37.80218877920469,"lng":-122.41790771484375},{"lat":37.801374964252865,"lng":-122.42443084716797},{"lat":37.80415546165205,"lng":-122.4250316619873},{"lat":37.80340948481954,"lng":-122.43146896362306},{"lat":37.80544394934274,"lng":-122.43189811706542}]}];

  var routes = new transitmix.Routes(data);
  var mainView = new transitmix.MainView({ collection: routes });
  mainView.render();
};


