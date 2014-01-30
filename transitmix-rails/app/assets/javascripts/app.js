// Use Mustache-style syntax
_.templateSettings = {
  interpolate: /\{\{(.+?)\}\}/g
};

var tm = tm || {};

// For the moment, use a global variable to manage aggregate map
tm.showingAggregate = false;

// This router and general saving strategy is very naive. Should learn
// more about the BackboneJS defaults and rewrite it. One of the key
// parts should be to connect the mix and routes models and have them
// use the natural URL generation system.
tm.DefaultRouter = Backbone.Router.extend({
  routes: {
    'mix/:id': 'loadMix',
    'new': 'newMix',
    '*path': 'defaultRoute',
  },

  loadMix: function(id) {
    $.get('http://' + window.location.host + '/mixes/' + id + '.json', function(data) {
      tm.showingAggregate = false;

      tm.routes.reset(data.routes);
      tm.mix.set({
        id: id,
        name: data.name,
        loadedFromServer: true,
      });
    });
  },

  newMix: function() {
    $.post('http://' + window.location.host + '/mixes.json', function(data) {
      tm.showingAggregate = false;

      tm.router.navigate('/mix/' + data.id);
      tm.mix.set({
        id: data.id,
        name: data.name,
        loadedFromServer: false,
      });
      tm.routes.reset();
    });
  },

  defaultRoute: function() {
    $.get('http://' + window.location.host + '/mixes.json', function(data) {
      tm.showingAggregate = true;

      var allRoutes = [];
      data.forEach(function(mix) {
        var id = mix.id;
        mix.routes.forEach(function(r) {
          r.mixId = id;
          allRoutes.push(r);
        });
      });

      tm.routes.reset(allRoutes);
      tm.mix.set({
        name: 'All Routes!',
      });
    });
  },
});

tm.init = function() {
  var routes = tm.routes = new tm.Routes();
  var mix = tm.mix = new tm.Mix();

  var mainView = new tm.MainView({
    model: mix,
    collection: routes,
  });

  mainView.render();

  tm.router = new tm.DefaultRouter();
  Backbone.history.start();

  // pre-filled set of routes.
  // TODO: load these via server call using a URL paramter
  // var data = [{"name":"48","description":"Quintora to Westville","savedOnce":"true","color":"#AD0101","polyline":[{"lat":37.74818629372592,"lng":-122.42013931274413},{"lat":37.77254656936578,"lng":-122.42271423339842},{"lat":37.771596736802074,"lng":-122.42348670959471},{"lat":37.775803045522146,"lng":-122.42434501647949},{"lat":37.77227518987836,"lng":-122.45249748229982},{"lat":37.77085043122794,"lng":-122.45532989501953},{"lat":37.77261441408201,"lng":-122.4657154083252},{"lat":37.77247872458732,"lng":-122.46889114379881},{"lat":37.77071473849609,"lng":-122.47172355651855},{"lat":37.771596736802074,"lng":-122.47541427612303},{"lat":37.770239811973674,"lng":-122.48159408569336},{"lat":37.770104118121296,"lng":-122.48485565185547},{"lat":37.77078258489315,"lng":-122.48674392700195},{"lat":37.77078258489315,"lng":-122.49180793762206},{"lat":37.76671169088488,"lng":-122.50605583190918},{"lat":37.76928994977783,"lng":-122.50845909118652},{"lat":37.770443352285376,"lng":-122.51094818115233}]},
  //             {"name":"51X","description":"Upendside to Notam","savedOnce":"true","color":"#0071CA","polyline":[{"lat":37.74811842660096,"lng":-122.41936683654784},{"lat":37.77281794785716,"lng":-122.42202758789061},{"lat":37.78787789236924,"lng":-122.40348815917969},{"lat":37.79676317682161,"lng":-122.40511894226076},{"lat":37.80035768295354,"lng":-122.4103546142578},{"lat":37.799543847826506,"lng":-122.41739273071288},{"lat":37.80218877920469,"lng":-122.41790771484375},{"lat":37.801374964252865,"lng":-122.42443084716797},{"lat":37.80415546165205,"lng":-122.4250316619873},{"lat":37.80340948481954,"lng":-122.43146896362306},{"lat":37.80544394934274,"lng":-122.43189811706542}]}];
};

// duplicate the model for remixing purposes. Can probably do this better.
tm.ghettoDuplicate = function(name) {
  $.post('http://' + window.location.host + '/mixes.json', function(data) {
    // update the mix
    tm.mix.set({
      id: data.id,
      name: name || tm.mix.get('name') + ' Remix',
      loadedFromServer: false,
    });
    tm.router.navigate('mix/' + data.id);

    tm.routes.each(function(route) {
      route.id = undefined;
      route.save()
    });
  });
}


