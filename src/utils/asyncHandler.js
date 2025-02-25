// const asyncHandler = () => {}
// const asyncHandler = (fn) => {}
// const asyncHandler = (fn) => { () => {} }
// const asyncHandler = (fn) => { async() => {} }
// const asyncHandler = (fn) => async() => {} 

//Here we are creating a wrapper function

//method 1 - promise method
const asyncHandler = (requestHandler) => {
    (req , res ,next) => {
        Promise.resolve(requestHandler(req , res , next)).catch((err) => next(err))
    }
}

export {asyncHandler}


//method 2 - try catch method
// const asyncHandler = (fn) => async (req , res , next) => {
//     try {
//         await fn(req , res , next)
//     } catch (error) {
//         res.status(error.code || 500).json({
//             success : false,
//             message : error.message
//         })
//     }
// }