const {selectCommentsByArticleId, insertCommentByArticleId, removeCommentById, updateComment} = require('./models')


exports.getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;

  selectCommentsByArticleId(article_id).then(comments => {
    response.status(200).send(comments)
  })
  .catch(err => next(err))
}

exports.postCommentByArticleId = (request, response, next) => {
  const { article_id } = request.params
  const {username, body} = request.body

  insertCommentByArticleId(username, body, article_id).then(comment => {
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

exports.changeComment = (request, response, next) => {
  const {comment_id} = request.params
  const {inc_votes} = request.body

  updateComment(comment_id, inc_votes)
  .then((comment) => {
      response.status(200).send(comment)
    })
    .catch(err => {
      // console.log(err, '<<< controller')
      return next(err)
    })
}
