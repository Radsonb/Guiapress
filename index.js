const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const session = require("express-session");

const categoriesControlle = require("./categories/categoriesControlle");
const articlesControlle = require("./articles/articlesController");
const usersController = require("./user/UserController")

const Category = require("./categories/Category");
const Article = require("./articles/Article");
const User = require("./user/User")

app.set("view engine", "ejs");

app.use(session({
  secret: 'qualquercoisa',
  cookie: { maxAge: 300000000 }
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static("public"));

connection
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados feita com sucesso");
  })
  .catch((error) => {
    console.log(error);
  });

app.use("/", categoriesControlle);
app.use("/", articlesControlle);
app.use("/", usersController);

app.get("/", (req, res) => {
  Article.findAll({
    order: [["id", "DESC"]],
    limit: 4
  }).then((articles) => {
    Category.findAll().then((categories) => {
      res.render("index", { articles: articles, categories: categories });
    });
  });
});

app.get("/:slug", (req, res) => {
  var slug = req.params.slug;

  Article.findOne({
    where: {
      slug: slug,
    },
  })
    .then((article) => {
      if (article != undefined) {
        Category.findAll().then((categories) => {
          res.render("article", { article: article, categories: categories });
        });
      } else {
        res.redirect("/");
      }
    })
    .catch((err) => {
      res.redirect("/");
    });
});


app.get('/category/:slug', (req, res) => {
  var slug = req.params.slug;
  Category.findOne({
    where: {
      slug: slug
    },
    include: [{ model: Article }]
  }).then(category => {
    if(category != undefined){
      Category.findAll().then(categories => {
        res.render('index', { articles: category.articles, categories: categories })
      })
    }else{
      res.redirect('/')
    }
  }).catch(err => {
    res.redirect('/')
  })
});



app.listen(4000, () => {
  console.log("O servidor está rodando!");
});
