$().ready(function() {

  window.user = {
    data: [
      {name:"T. Woods", age:37},
      {name:"P. Mickelson", age:43}
    ],
    clickHandler: function(e) {
      e.preventDefault();
      var randomNum = ((Math.random() * 2 | 0) + 1) - 1;
      $("input").val(this.data[randomNum].name + " " + this.data[randomNum].age);
    }
  }
  $("button").click(user.clickHandler.bind(user));

  window.Deployment = Backbone.RelationalModel.extend({});

  window.Deployments = Backbone.Collection.extend({model: Deployment});

  window.Environment = Backbone.RelationalModel.extend({
    relations: [{
        type: Backbone.HasMany,
        key: 'deployments',
        relatedModel: 'window.Deployment',
        reverseRelation: {
            key: 'environment',
            includeInJSON: 'id',
        },
    }]
  });

  window.Environments = Backbone.Collection.extend({
    model: window.Environment,

    url: '/environments',

    flatMapSubmodels: function() {
      return _.flatten(
        _.map(
            this.pluck('deployments'),
            function(d) { return d.models }
        )
      )
    }
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
      return moment(new Date(timeStr)).format('MM-DD-YYYY -- HH:mm');
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

  window.EnvironmentView = Backbone.View.extend({
    template: _.template('<option value="<%= id %>"><%= name %></option>'),

    render: function() {
      this.el = $(this.template(this.model.toJSON()));
      return this;
    }
  });

  window.EnvironmentsView = Backbone.View.extend({
    el: '#env-drop-select',

    template: _.template(
      '<select name="env" class="form-control">' +
      '<option value>All Environments</option>' +
      '</select>'
    ),

    initialize: function() {
      this.collection.on('add', this.addOne, this);
      this.collection.on('reset', this.addAll, this);
    },

    render: function() {
      this.addAll();
      return this;
    },

    addAll: function() {
      this.$el.html(this.template());
      this.collection.forEach(this.addOne, this);
    },

    addOne: function(model) {
      var view = new EnvironmentView({model: model});
      this.$('select:last').append(view.render().el);
    }
  });

  var D = React.DOM;

  var EnvironmentOption = React.createClass({
    render: function() {
      return D.option({}, this.props.environment)
    }
  });

  var EnvironmentSelect = React.createClass({
    render: function() {
      var options = [D.input({value: 'All'})];
      this.props.environments.forEach(function(environment) {
        options.push(EnvironmentOption({environment: environment}))
      });
      return D.select({className: 'form-control', name: 'env'}, options)
    }
  });

  var DeploymentRow = React.createClass({

    formatTime: function(timeStr) {
      return moment(new Date(timeStr)).format('MM-DD-YYYY -- HH:mm');
    },

    render: function() {
      var href = '/deploy/' + this.props.id + '/delete'
      var deleteButton = D.a({className: 'delete small', href: href}, 'Delete')
      return (D.tr({}, [
        D.td({}, deleteButton),
        D.td({}, this.formatTime(this.props.deployed_at)),
        D.td({}, this.props.name),
        D.td({}, this.props.version),
        D.td({}, this.props.environment_id),
      ]))
    }
  });

  var DeploymentTable = React.createClass({
    propTypes: {
      deployments: React.PropTypes.array
    },
    render: function() {
      var rows = [];
      this.props.deployments.forEach(function(deployment) {
        rows.push(DeploymentRow(deployment));
      });
      return (
        D.table(
          {className: 'table table-hover deployments'},
          [
            D.thead(
              {},
              D.tr(
                {className: 'deployment'},
                [
                  D.th({}, ''),
                  D.th({}, D.a({href: '/', class: 'sortable'}, 'Deployed')),
                  D.th({}, D.a({href: '/', class: 'sortable'}, 'Name')),
                  D.th({}, D.a({href: '/', class: 'sortable'}, 'Version')),
                  D.th({}, D.a({href: '/', class: 'sortable'}, 'Environment'))
                ]
              )
            ),
            D.tbody({}, rows)
          ]
        )
      )
    }
  });

  var EnvironmentSelect = React.createClass({
    handleChange: function(e) {
      this.props.onChange(parseInt(this.getDOMNode().value))
    },
    render: function() {
      return D.select({onChange: this.handleChange},[
        D.option({value: 1}, "Test"),
        D.option({value: 2}, "Test 2"),
        D.option({value: 3}, "Test 3")
      ])
    }
  })

  var App = React.createClass({
    getInitialState: function() {
      return {environmentId: null};
    },
    propTypes: {
      deployments: React.PropTypes.object
    },
    handleEnvironmentChange: function(environmentId) {
      this.setState({environmentId: environmentId})
    },
    filteredEnvironments: function() {
      var filteredEnvironments;
      if (this.state.environmentId != null) {
        var that = this;
        filteredEnvironments = _.map(that.props.deployments.where(
          {environment_id: that.state.environmentId}
        ), function(item) { return item.toJSON(); } );
      } else {
        filteredEnvironments = this.props.deployments.toJSON();
      }
      return filteredEnvironments;
    },
    render: function() {
      return (D.div({}, [
        EnvironmentSelect({onChange: this.handleEnvironmentChange}),
        DeploymentTable({deployments: this.filteredEnvironments()})
      ]));
    }
  });

  window.WFVIW = new (Backbone.Router.extend({
    routes: {"": "index"},

    index: function() {
      this.environments = new Environments();

      // must fetch to get submodels
      var that = this;
      this.environments.fetch({reset: true}).done(function() {
        that.deployments = new Deployments(that.environments.flatMapSubmodels());
        React.renderComponent(
          App({deployments: that.deployments}),
          document.getElementById("deployment-table")
        );
      });
        // this.deploymentsView = new DeploymentsView({collection: that.deployments});
        // this.deploymentsView.render();
        // $(this.deploymentsView.el).insertAfter('thead');

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
