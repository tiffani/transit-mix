// View for the route "blocks" that appear in the top right hand corner

tm.BlockView = Backbone.View.extend({
  template: _.template($('#tmpl-route').html()),

  className: 'route block redroute',

  events: {
    'click': 'select',
    'click .draw': 'startDrawing',
    'dblclick': 'removeRoute',
  },

  initialize: function() {
    this.listenTo(this.model, 'change', this.render);
    this.listenTo(this.model, 'destroy', this.remove);
    this.listenTo(this.model, 'change:mode', this.combust);
    this.listenTo(this.model.collection, 'reset', this.remove);
  },

  render: function() {
    this.$el.html(this.template(this.model.toJSON()));
    this.$el.css({ "background-color": this.model.get('color') });
    this.$el.addClass(this.model.get('type'))
    
    var mode = this.model.getMode();
    mode === 'editing' ? this.$('.newroute').show() : this.$('.newroute').hide();

    return this;
  },

  select: function() {
    var mode = this.model.getMode();
    if (mode === 'viewing') {
      this.model.setMode('selected');
    } else if (mode ==='selected') {
      this.model.setMode('viewing');
    }
  },

  startDrawing: function() {
    var name = this.$('.newname').val() || undefined;
    var desc = this.$('.newdesc').val() || undefined;

    this.model.set({
      name: name,
      description: desc,
      // savedOnce: true,
    });

    this.model.setMode('drawing');
  },

  removeRoute: function() {
    this.model.destroy();
  },

  // If we mode change, and it hasn't saved once, destroy it!
  combust: function() {
    // Disable for the moment
    // if (!this.model.get('savedOnce') && this.model.getMode() === 'viewing') this.model.destroy();
  },
});
