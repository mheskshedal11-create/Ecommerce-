const uploadImageController = (req, res) => {
    try {
        const file = req.file

    } catch (error) {
        console.log(error)
        return res.status(400).json({
            success: false,
            message: error.message || error
        })
    }
}
export default uploadImageController