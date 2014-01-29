tm.Route = Backbone.Model.extend({
  urlRoot: function() {
    return 'http://' + window.location.host + '/mixes/' + tm.mix.get('id') + '/routes';
  },

  defaults: function() {
    var colors = ['#0D7215', '#AD0101', '#0071CA'];
    var randomColor = colors[Math.floor(Math.random() * colors.length)];

    return {
      name: 'unnamed',
      description: 'no desc',
      color: randomColor,
      type: 'bus',
      polyline: [],
    }
  },

  addPoint: function(point) {
    var polyline = _.clone(this.get('polyline'));
    polyline.push(point);
    this.set('polyline', polyline);
  },

  getMode: function() {
    return this.collection.getMode(this);
  },

  setMode: function(mode) {
    this.collection.setMode(this, mode);
  },
});

tm.Routes = Backbone.Collection.extend({
  model: tm.Route,

  initialize: function() {
    // keep one model as interactive at any one time.
    this.interactiveRoute = false;
    this.routeMode = 'viewing';

    this.on('reset', function(col, opts){
       _.each(opts.previousModels, function(model){
            model.trigger('remove');
        });
    });
  },

  getMode: function(route) {
    if (this.interactiveRoute === route) {
      return this.routeMode;
    } else {
      return 'viewing';
    }
  },

  setMode: function(route, mode) {
    var oldRoute = this.interactiveRoute;
    this.interactiveRoute = route;
    this.routeMode = mode;

    if (oldRoute !== this.interactiveRoute && oldRoute) oldRoute.trigger('change change:mode');
    this.interactiveRoute.trigger('change change:mode');
  },
});