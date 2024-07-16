exports.psqlErrorHandler = (err, req, res, next) => {
    if (err.code === '22P02') {
        res.status(400).send({ message: 'Bad request'})
    } else {
        next(err)
    }
}

exports.customErrorHandler = (err, req, res, next) => {
    if(err.status && err.message) {
        res.status(err.status).send({ message: err.message})
    } else {
        next(err)
    }
}

exports.serverErrorHandler = (err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: `Server Error: ${err}`});
}