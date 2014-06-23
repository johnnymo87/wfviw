$().ready(function() {

  window.Deployment = Backbone.Model.extend({});
  window.Deployments = Backbone.Collection.extend({
    model: Deployment,
    url: '/deployments'
  });

  window.Environment = Backbone.Model.extend({});
  window.Environments = Backbone.Collection.extend({
    model: Environment,
    url: '/environments'
  });

  window.DeploymentView = Backbone.View.extend({
    tagName: 'tr',
    className: 'deployment',
    template: _.template(
      '<td><a class="delete small" href="/deploy/<%= id %>/delete">Delete</a></td>' +
      '<td><%= deployed_at %></td>' +
      '<td><%= name %></td>' +
      '<td><%= version %></td>' +
      '<td><%= environment_id %></td>'
    ),

    formatTime: function(timeStr) {
      return moment(new Date(timeStr)).format('MM-DD-YYYY, HH:mm');
    },

    render: function() {
      data = this.model.toJSON();
      data.deployed_at = this.formatTime(data.deployed_at)
      this.$el.html(this.template(data));
      return this;
    }
  });

  window.DeploymentsView = Backbone.View.extend({
    tagName: 'tbody',

    initialize: function() {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.addAll, this);
    },

    render: function() {
      this.addAll();
      return this;
    },

    addAll: function() {
      this.$el.empty();
      this.collection.forEach(this.addOne, this);
    },

    addOne: function(model) {
      var view = new DeploymentView({model: model});
      this.$el.append(view.render().el);
    }
  });

  window.WFVIW = new (Backbone.Router.extend({
    routes: {"": "index"},

    initialize: function() {
      this.environments = new Environments();
      this.deployments = new Deployments();
      this.deploymentsView = new DeploymentsView({collection: this.deployments});
      this.deploymentsView.render();
    },

    index: function() {
      $(this.deploymentsView.el).insertAfter('thead');
      this.deployments.fetch();
    },

    start: function() {
      Backbone.history.start();
    },
  }));

  WFVIW.start();

  $('select[name=env]').on('change', function() {
    $(this).closest('form').submit();
  });

  $('.deployment a.delete').on('click', function(e) {
    e.preventDefault();
    var $a = $(this);
    $.post($a.attr('href'), function() {
      // TODO: Errors
      $a.closest('.deployment').remove();
    });
  });

  var order = new (function() {
    var __front = 1,
    __back  = -1;
    this.front = function() { return __front };
    this.back  = function() { return __back };
    this.switch = function() {
      __front = -__front;
      __back = -__back;
    }
  });

  $('a.sortable').on('click', function(e) {
    e.preventDefault();
    var cellIndex = $(this).closest('th')[0].cellIndex;
    var wordFrom = function(el, i) { return el.children[i].innerHTML.toLowerCase(); };
    var sorted = $('tbody tr').sort(function(a, b) {
      if(wordFrom(a, cellIndex) > wordFrom(b, cellIndex)) return order.front();
      if(wordFrom(a, cellIndex) < wordFrom(b, cellIndex)) return order.back();
      return 0;
    });
    order.switch();
    $('tbody tr').remove();
    $('tbody').append(sorted);
  });
})
