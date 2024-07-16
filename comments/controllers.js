const {selectCommentsByArticleId} = require('./models')


exports.getCommentsByArticleId = (request, response, next) => {
    const { article_id } = request.params;

    selectCommentsByArticleId(article_id).then(comments => {
      // console.log(comments)
      response.status(200).send(comments)
    })
    .catch(err => {
      console.log(err, "controller")
      return next(err)
    })
}

