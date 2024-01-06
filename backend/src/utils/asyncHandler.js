const asyncHandler = (functionToPerform) => {
    return (req, res, next) => {
        Promise
            .resolve(functionToPerform(req, res, next))
            .catch((err) => next(err))
    }
}

export { asyncHandler }