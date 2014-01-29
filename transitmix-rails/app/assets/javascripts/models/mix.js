// A mix is a name and a set of routes. Simple enough.
tm.Mix = Backbone.Model.extend({
  urlRoot: function() {
    return 'http://' + window.location.host + '/mixes/';
  },

  defaults: {
    name: 'Unnamed',
  },
});