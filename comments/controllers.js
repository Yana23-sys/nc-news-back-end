const {selectCommentsByArticleId, insertComment} = require('./models')


exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  selectCommentsByArticleId(article_id).then(comments => {
    response.status(200).send(comments)
  })
  .catch(err => next(err))
}

exports.postComment = (request, response, next) => {
  const { article_id } = request.params
  const {username, body} = request.body

  insertComment(username, body, article_id).then(comment => {
    response.status(201).send(comment)
  })
  .catch(err => {
    console.log(err)
    next(err)})
}

