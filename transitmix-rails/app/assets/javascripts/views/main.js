tm.MainView = Backbone.View.extend({
  el: 'body',

  events: {
    'mouseenter .ui': 'showAddButton',
    'mouseleave .ui': 'hideAddButton',
    'click .newmix': 'createMix',
    'click .add': 'addRoute',
    'keyup': 'saveTitle',
  },

  initialize: function() {
    this.listenTo(this.model, 'change:name', this.updateTitle);
    this.listenTo(this.collection, 'add', this.addOne);
    this.listenTo(this.collection, 'reset', this.addAll);
    this.listenTo(this.collection, 'reset', this.render);

    var center = [37.778733, -122.421467];
    var defaultZoomLevel = 14;

    // the map needs to be globally available for subviews to access
    var options = { tileLayer: { detectRetina: true }};
    tm.map = this.map = L.mapbox.map('map', 'samhashemi.h3e534lc', options)
      .setView(center, defaultZoomLevel);
  },

  render: function() {
    tm.showingAggregate ? $('.hello').show() : $('.hello').hide();
  },

  addOne: function(route) {
    var lineView = new tm.LineView({model: route});
    lineView.render(); // no need to appened, goes through mapbox

    if (!tm.showingAggregate) {
      var blockView = new tm.BlockView({model: route});
      $('#routes').append(blockView.render().el);
    }
  },

  addAll: function() {
    this.collection.each(this.addOne, this);
  },

  showAddButton: function() {
    if (!tm.showingAggregate) $('.add').slideDown(150);
  },

  hideAddButton: function() {
    $('.add').slideUp(150);
  },

  createMix: function() {
    tm.router.navigate('new', {trigger: true});
  },

  addRoute: function() {
    var route = this.collection.add({});
    route.setMode('editing');

    // small detail: hide the add button when in the adding process
    this.hideAddButton();
  },

  updateTitle: function() {
    $('.mapname').html(this.model.get('name') || 'Name Me!');
  },

  // Save the title as it changes, but don't do excessive calls
  saveTitle: function() {
    if (this.nameTimeout) clearTimeout(this.nameTimeout);

    this.nameTimeout = setTimeout(_.bind(function() {
      var mixName = this.model.get('name');
      var newName = $('.mapname').html();

      if (mixName !== newName) {
        this.model.save({name: newName}, {patch: true});
      };
    }, this), 300)
  }

});