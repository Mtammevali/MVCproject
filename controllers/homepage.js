const ArticleModel = require("../models/ArticleModel");

async function index(req, res) {
    res.render('homepage/index', {Article: await ArticleModel.getAll({}, req.db)});
}
async function view(req, res) {
    res.render('homepage/view', {Article: await ArticleModel.getAll({id: req.params.articleId}, req.db)});
}
module.exports = {
    index,
    view
};