const {selectCommentsByArticleId, insertComment, removeCommentById} = require('./models')


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
  .catch(err => next(err))
}

exports.deleteComment = (request, response, next) => {
  const { comment_id } = request.params

  removeCommentById(comment_id)
  .then(() => response.status(204).send())
  .catch(err => next(err))
}

