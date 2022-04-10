var bodyParser = require ('body-parser');
var urlencodedParser = bodyParser.urlencoded ({extended: false});
var mongoose = require ('mongoose');

//Connect to Database
mongoose.set ('useUnifiedTopology', true);

//Insert the link to the NoSQL database.
mongoose.connect (
  'mongodb+srv://bhupesh:1234@cluster0.7at15.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',
  {useNewUrlParser: true}
);

//Create a schema
var todoSchema = new mongoose.Schema ({
  item: String,
});

var Todo = mongoose.model ('Todo', todoSchema);

//get data from MongoDB and pass to view
module.exports = function (app) {
  app.get ('/todo', function (req, res) {
    Todo.find ({}, function (err, data) {
      if (err) throw err;
      res.render ('todo', {todos: data});
    });
  });

  //get tasks from MongoDB
  app.post ('/todo', urlencodedParser, function (req, res) {
    var newTodo = Todo (req.body).save (function (err, data) {
      if (err) throw err;
      res.json (data);
    });
  });

  //delete the task from MongoDB
  app.delete ('/todo/:item', function (req, res) {
    Todo.find ({
      item: req.params.item.replace (/\-/g, ' '),
    }).deleteOne (function (err, data) {
      if (err) throw err;
      res.json (data);
    });
  });

  app.put ('/todo/:item', function (req, res) {
    Todo.find ({
      item: req.params.item.replace (/\-/g, ' '),
    }).updateOne (function (err, data) {
      if (err) throw err;
      res.json (data);
    });
  });
};
