const express = require("express");
const router = express.Router();
const Category = require("./Category");
const slugify = require('slugify')

router.get("/admin/categories/new", (req, res) => { //Inserir Categoria
  res.render("admin/categories/new.ejs");
});

router.post("/categories/save", (req, res) => { //Salvar Categoria no DB

  var title = req.body.title;

  if (title != undefined) {
    
    Category.create({
      title: title,
      slug: slugify(title)
    }).then(() => {
      res.redirect('/admin/categories')
    })

  } else {
    res.redirect("/admin/categories/new");
  }
});

router.get('/admin/categories', (req, res) => {//Listar Categorias

  Category.findAll({ raw: true }).then(categories => {
    res.render('admin/categories/index.ejs', { categories: categories })    
  })

});

router.post('/categories/delete', (req, res) => {//Deletar Categoria
  var id = req.body.id;

  if(id != undefined){
    if(!isNaN(id)){

      Category.destroy({
        where: {
          id: id
        }
      }).then(() => {
        res.redirect('/admin/categories');
      })

    }else{
      res.redirect('/admin/categories');
    }
  }else{
    res.redirect('/admin/categories');
  }
});

router.get('/admin/categories/edit/:id', (req, res) => {//Editar Categoria

  var id = req.params.id;

  if(isNaN(id)){

    res.redirect('/admin/categories')
  }

  Category.findByPk(id).then(category => {
    if(category != undefined){

      res.render('admin/categories/edit' , { category: category })

    }else{
      res.redirect('/admin/categories')
    }
  }).catch((error) => {
    res.redirect('/admin/categories')
  })

});

router.post('/categories/update', (req, res) => {
  var id = req.body.id;
  var title = req.body.title;

  Category.update({title: title, slug: slugify(title)}, {
    where: {
      id: id
    }
  }).then(() => {
    res.redirect('/admin/categories')
  })
});

module.exports = router;
