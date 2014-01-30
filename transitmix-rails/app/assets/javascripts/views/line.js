// View for route "lines", as vizualized on the map.
tm.LineView = Backbone.View.extend({
  initialize: function() {
    this.map = tm.map;

    this.listenTo(this.model, 'change:polyline', this.updateLine);
    this.listenTo(this.model, 'change:mode', this.updateMode);
    this.listenTo(this.model, 'destroy', this.removeLine);
    this.listenTo(this.model.collection, 'reset', this.removeLine);
  },

  render: function() {
    var latlngs = this.model.get('polyline');
    var color = this.model.get('color');

    var options = this.lineOptions = {
      color: color,
      opacity: 1,
      weight: 10,
    };

    if (tm.showingAggregate) {
      options.opacity = 0.5;
      options.weight = 5;
    }

    this.line = L.polyline(latlngs, options).addTo(this.map);
    if (tm.showingAggregate) {
      this.line.on('click', function() {
        tm.router.navigate("mix/" + this.model.get('mixId'), {trigger: true});
      }, this);
    } else {
      this.line.on('click', function() {
        var mode = this.model.getMode();
        if (mode === 'viewing') {
          this.model.setMode('selected');
        } else if (mode ==='selected') {
          this.model.setMode('viewing');
        }
      }, this);
    }
  },

  updateLine: function() {
    this.line.setLatLngs(this.model.get('polyline'));
  },

  updateMode: function() {
    var mode = this.model.getMode();
    if (mode === 'drawing') {
      this.startDrawing();
    } else {
      this.stopDrawing();
    }

    if (mode === 'selected') {
      this.startSelecting();
    } else {
      this.stopSelecting();
    }
  },

  startDrawing: function() {
    this.map.on('mousemove', this.updateDrawingUI, this);
    this.map.on('click', this.addPoint, this);

    // show "dot" right below cursor
    $('body').append('<div class="drawBall"></div>');
    this.$drawBall = $('.drawBall');
    this.$drawBall.css({ background: this.model.get('color') });

    // show a done button to let users stop drawing. Initially hidden.
    $('body').append('<div class="finishDrawing" style="display:none">Done</div>');
    this.$finishDrawing = $('.finishDrawing');

    this.$finishDrawing.on('click', _.bind(this.finishDrawing, this));
  },

  finishDrawing: function() {
    this.model.setMode('viewing');
    if (tm.mix.get('loadedFromServer')) {
      tm.ghettoDuplicate();
    } else {
      this.model.save();
    }
  },

  stopDrawing: function() {
    this.map.off('mousemove');
    this.map.off('click');

    if (this.$drawBall) this.$drawBall.remove();
    if (this.$finishDrawing) this.$finishDrawing.remove();
    if (this.predictiveLine) this.predictiveLine.setLatLngs([]);
  },

  updateDrawingUI: function(event) {
    var p = event.containerPoint;
    this.$drawBall.css({
      left: p.x + 'px',
      top: p.y + 'px',
    });

    if (this.predictiveLine) {
      this.predictiveLine.setLatLngs([this.lastAddedPoint, event.latlng]);
    }
  },

  addPoint: function(event) {
    var latlng = event.latlng;
    this.model.addPoint(latlng);

    this.lastAddedPoint = latlng;
    var points = this.model.get('polyline').length;

    if (points === 1) {
      // add the predictive path line  
      this.predictiveLine = L.polyline([], this.lineOptions).addTo(this.map);
    } else if (points > 1) {
      // show & move the done button
      var p = event.containerPoint;

      this.$finishDrawing.show();
      this.$finishDrawing.css({
        left: p.x + 'px',
        top: p.y + 'px',
      });
    }
  },

  // TODO: Kinda a big mess of events. Should re-arrange to make more clear.
  startSelecting: function() {
    // get all of the points, draw a cirlce on each
    var polyline = this.model.get('polyline');
    var options = {
      color: this.model.get('color'),
      opacity: 1,
      fill: this.model.get('color'),
      fillOpacity: 1,
    };
    this.selectionCircles = [];

    polyline.forEach(function(latlng, index) {
      var circle = L.circle(latlng, 60, options).addTo(this.map);
      this.selectionCircles.push(circle);

      circle.on('mousedown', function(event) { 
        event.originalEvent.stopPropagation();
        event.originalEvent.preventDefault();

        // listen for the mouse move, update as needed
        this.map.on('mousemove', function(e) {
          var line = _.clone(this.model.get('polyline'));
          line[index] = e.latlng;
          this.model.set('polyline', line);

          circle.setLatLng(e.latlng);
        }, this);

        // end the dragging when the mouse lifts up
        this.map.once('mouseup', function() {
          this.map.off('mousemove')
        }, this);
      }, this);
    }, this);
  },

  stopSelecting: function() {
    if (!this.selectionCircles) return;

    // save the series of changes
    if (tm.mix.get('loadedFromServer')) {
      tm.ghettoDuplicate();
    } else {
      this.model.save({patch: true});
    }
    this.removeSelectionCircles();
  },

  removeSelectionCircles: function() {
    if (!this.selectionCircles) return;
    this.selectionCircles.forEach(function(circle) {
      this.map.removeLayer(circle);
    }, this);
  },

  removeLine: function() {
    this.removeSelectionCircles();
    this.map.removeLayer(this.line);
    this.remove();
  }
});
