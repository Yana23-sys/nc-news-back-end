const {selectArticleById, selectArticles, updateArticle, insertArticle} = require('./models')


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
    const {topic, sort_by, order, limit, p} = request.query

    const validationErrs = [
        isValidPositiveNum(limit, 'limit'), 
        isValidPositiveNum(p, 'page')
    ].filter(e => e !== undefined)

    if (validationErrs.length === 0) {
        selectArticles(topic, sort_by, order, limit, p)
        .then((articles) => {
            response.status(200).send( articles )
        })
        .catch(err => {
            next(err)
        })
    } else {
        response.status(400).send( {message: validationErrs.join(', ')} )
    }
}
const isValidPositiveNum = (num, queryName) => {
    if (num && (isNaN(num) || parseInt(num) <= 0) ) {
        return `invalid ${queryName} query`
    }
}

exports.changeArticle = (request, response, next) => {
    const {article_id} = request.params
    const {inc_votes} = request.body

    updateArticle(article_id, inc_votes)
    .then((article) => {
        response.status(200).send(article)
    })
    .catch(err =>  next(err))
}

exports.postArticle = (request, response, next) => {
    const { title, topic, author, body, article_img_url } = request.body

    insertArticle(title, topic, author, body, article_img_url)
    .then(article => response.status(201).send(article))
    .catch(err => {
        next(err)
    })
}