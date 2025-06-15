const multer = require("multer")
const path = require("../Data")

const storage = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,'uploads/')
    },
    filename: (req, file,cb) =>{
        const ext = path.extname(file.originalname);
        cb(null,'profile_'+Date.now() + ext);
    }
});

const upload = multer({storage : storage})

module.exports = upload;