const multer = require("multer");
const path = require("path");

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, done) => {
            done(null, "uploads/");
        },
        filename: (req, file, done) => {
            const ext = path.extname(file.originalname);
            const fildName = path.basename(file.originalname, ext) + "&&" + Date.now() + ext;
            done(null, fildName);
            req.fileDir = fildName;
        }
    })
});

module.exports = {upload};