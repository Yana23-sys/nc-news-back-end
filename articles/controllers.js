const {selectArticleById, selectArticles} = require('./models')


exports.getArticleById = (request, response, next) => {
    const { article_id } = request.params

    if(/^\d+$/.test(article_id)) {
        selectArticleById(article_id)
        .then((article) => {
            response.status(200).send( article )
        })
        .catch(err => {
            next(err)
        })
    } else {
        response.status(400).send({message: `Invalid article id: ${article_id}`})
    }

}

exports.getArticles = (request, response, next) => {
    selectArticles()
    .then((articles) => {
        response.status(200).send( articles )
    })
    .catch(err => {
        next(err)
    })
}