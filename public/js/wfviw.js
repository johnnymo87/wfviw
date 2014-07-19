$().ready(function() {

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

  // var Table = React.createClass({
  //   getInitialState: function() {
  //     return {data: this.props.data};
  //   },
  //   render: function () {
  //     return (
  //       React.DOM.table(null, React.DOM.tbody(null,
  //         this.state.data.map(function (row) {
  //           return (
  //             React.DOM.tr(null,
  //               row.map(function (cell) {
  //                 return React.DOM.td(null, cell);
  //               })
  //             )
  //           );
  //         })
  //       ))
  //     );
  //   }
  // });
  //
  // var data = [[1,2,3],[4,5,6],[7,8,9]];
  //
  // var table = React.renderComponent(
  //   Table({data: data}),
  //   $('table')[0]);
  //

  // deployed_at: "2014-07-04 23:48:28 +0100"
  // deployed_by: null
  // environment: 1
  // environment_id: 1
  // hostname: null
  // id: 1
  // name: "goals"
  // version: "2.0"

// var ProductCategoryRow = React.createClass({
//     render: function() {
//         return (<tr><th colSpan="2">{this.props.category}</th></tr>);
//     }
// });
//
// var ProductRow = React.createClass({
//     render: function() {
//         var name = this.props.product.stocked ?
//             this.props.product.name :
//             <span style={{color: 'red'}}>
//                 {this.props.product.name}
//             </span>;
//         return (
//             <tr>
//                 <td>{name}</td>
//                 <td>{this.props.product.price}</td>
//             </tr>
//         );
//     }
// });
//
// var ProductTable = React.createClass({
//     render: function() {
//         var rows = [];
//         var lastCategory = null;
//         this.props.products.forEach(function(product) {
//             if (product.category !== lastCategory) {
//                 rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
//             }
//             rows.push(<ProductRow product={product} key={product.name} />);
//             lastCategory = product.category;
//         });
//         return (
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Price</th>
//                     </tr>
//                 </thead>
//                 <tbody>{rows}</tbody>
//             </table>
//         );
//     }
// });
//
// var SearchBar = React.createClass({
//     render: function() {
//         return (
//             <form onSubmit={this.handleSubmit}>
//                 <input type="text" placeholder="Search..." />
//                 <p>
//                     <input type="checkbox" />
//                     Only show products in stock
//                 </p>
//             </form>
//         );
//     }
// });
//
// var FilterableProductTable = React.createClass({
//     render: function() {
//         return (
//             <div>
//                 <SearchBar />
//                 <ProductTable products={this.props.products} />
//             </div>
//         );
//     }
// });
//
//
// var PRODUCTS = [
//   {category: 'Sporting Goods', price: '$49.99', stocked: true, name: 'Football'},
//   {category: 'Sporting Goods', price: '$9.99', stocked: true, name: 'Baseball'},
//   {category: 'Sporting Goods', price: '$29.99', stocked: false, name: 'Basketball'},
//   {category: 'Electronics', price: '$99.99', stocked: true, name: 'iPod Touch'},
//   {category: 'Electronics', price: '$399.99', stocked: false, name: 'iPhone 5'},
//   {category: 'Electronics', price: '$199.99', stocked: true, name: 'Nexus 7'}
// ];
//  
// React.renderComponent(<FilterableProductTable products={PRODUCTS} />, document.body); 
//   var DeploymentRow = React.createClass({
//     render: function() {
//
//     }
//   });

  var D = React.Dom;

  var DeploymentRow = React.CreateClass({
    render: function() {
      var href = '/deploy/' + this.props.id + '/delete'
      var deleteButton = D.a({class: 'delete small', href: href}, 'Delete')
      return (D.tr({}, [
        D.td({}, deleteButton),
        D.td({}, this.props.deployed_at),
        D.td({}, this.props.name),
        D.td({}, this.props.version),
        D.td({}, this.props.environment_id),
      ]))
    }
  });

// var ProductTable = React.createClass({
//     render: function() {
//         var rows = [];
//         var lastCategory = null;
//         this.props.products.forEach(function(product) {
//             if (product.category !== lastCategory) {
//                 rows.push(<ProductCategoryRow category={product.category} key={product.category} />);
//             }
//             rows.push(<ProductRow product={product} key={product.name} />);
//             lastCategory = product.category;
//         });
//         return (
//             <table>
//                 <thead>
//                     <tr>
//                         <th>Name</th>
//                         <th>Price</th>
//                     </tr>
//                 </thead>
//                 <tbody>{rows}</tbody>
//             </table>
//         );
//     }
// });
  var DeploymentTable = React.createClass({
    render: function() {
      var rows = [];
      this.props.deployments.forEach(function(deployment) {
        rows.push(DeploymentRow(deployment));
      });
      return (
        D.table(
          {},
          [
            D.thead(
              {},
              D.tr(
                {},
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

  window.WFVIW = new (Backbone.Router.extend({
    routes: {"": "index"},

    index: function() {
      this.environments = new Environments();
      this.environmentsView = new EnvironmentsView({collection: this.environments});
      this.environmentsView.render();

      // must fetch to get submodels
      var that = this;
      this.environments.fetch({reset: true}).done(function() {
        that.deployments = new Deployments(that.environments.flatMapSubmodels());
        this.deploymentsView = new DeploymentsView({collection: that.deployments});
        this.deploymentsView.render();
        $(this.deploymentsView.el).insertAfter('thead');
      });
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
