import multer from "multer";

//Configure Multer Storage
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "./public/temp")
    },
    filename: function (req, file, cb) {
      
      cb(null, file.originalname)
    }
})

//Initialize the multer and export
export const upload = multer({ storage: storage })
