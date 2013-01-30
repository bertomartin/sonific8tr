var App = Ember.Application.create();

App.Router.map(function() {
  this.resource('stations', function() {
    this.resource('stations.tracks', { path: ':station_id/tracks' }, function() {
      this.route('playing', { path: ':tracks_id' } );
    })
  });
});

App.IndexRoute = Ember.Route.extend({
  redirect: function() {
    this.transitionTo('stations');
  }
});

App.StationsRoute = Ember.Route.extend({
  model: function() {
    return App.Station.find();
  }
});

App.StationsTracksPlayingRoute = Ember.Route.extend({
  setupController: function(controller, model) {
    controller.set('content', model);
    setTimeout(function(){
      widget = SC.Widget( document.getElementById('sc-widget') );
      widget.play();
    },1500); // cheating for programmatic click :-)
  }
});

App.TracksRoute = Ember.Route.extend({
  model: function(params) {
    return App.Tracks.find(params.listing_id);
  }
});

App.StationsIndexView = Ember.View.extend({
  isActive: true
});

App.StationsTracksPlayingView = Ember.View.extend({
  //didInsertElement: function(){
    //debugger;
  //},
  scBaseUrl: 'https://w.soundcloud.com/player/',
  scTrackSourceUrlBinding: 'controller.model.url',
  scIframeSourceUrl: function() {
    return this.scBaseUrl + '?url=' + this.scTrackSourceUrl;
  }.property()
});

App.StationsController = Ember.ArrayController.extend({
  addAndSearch: function(artist){
    App.Station.createRecord({ name: artist, tracks: [] });
  }
});

App.SearchView = Ember.TextField.extend({
  valueBinding: 'query',
  didInsertElement: function() {
    this.$().focus();
  },
  clearTextBox: function(){
    this.$().val('');
  },
  change: function(e) {
    this.controller.search( this.query );
    this.clearTextBox();
  }
});

App.SearchController = Ember.Controller.extend({
  needs: 'stations',
  search: function(query) {
    this.get('controllers.stations').addAndSearch(query);
  }
});

App.Store = DS.Store.extend({
  revision: 11,
  adapter: 'DS.FixtureAdapter'
});

App.Station = DS.Model.extend({
  name: DS.attr('string'),
  tracks: DS.hasMany('App.Tracks')
});

App.Tracks = DS.Model.extend({
  title: DS.attr('string'),
  url: DS.attr('string')
});

App.Station.FIXTURES = [
  {
    id: 1,
    name: 'Carl Craig',
    tracks: [100,101,102]
  },
  {
    id: 2,
    name: 'Stacey Pullen',
    tracks: [200,201,202]
  }
];

App.Tracks.FIXTURES = [
  {
    id: 100,
    title: '20 Years Of Planet E Essential Mix',
    url: 'https://api.soundcloud.com/r_co/carl-craig-20-years-of-planet'
  },
  {
    id: 101,
    title: 'Live @ Mixmag Live',
    url: 'https://api.soundcloud.com/planetedetroit/carl-craig-live-mixmag-live-19'
  },
  {
    id: 102,
    title: 'FACT mix 345',
    url: 'https://api.soundcloud.com/selftitledmag/carl-craig-fact-mix-345'
  },
  {
    id: 200,
    title: 'Stacey Pullen Live',
    url: 'https://api.soundcloud.com/staceypullen/stacey-pullen-live'
  },
  {
    id: 201,
    title: 'Get Up (Original)',
    url: 'https://soundcloud.com/staceypullen/stacey-pullen-get-up-original'
  },
  {
    id: 202,
    title: 'Circus Act',
    url: 'https://soundcloud.com/staceypullen/sets/bfr007-circus-act-ep'
  }
];
