const multer = require('multer');

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        let name = file.originalname.split(' ').join('_');
        const extension = MIME_TYPES[file.mimetype];
        // vérifier si extension déjà présente !
        if (/\.[a-z]{2,4}$/.test(name)) {
            name = name.replace(/\.[a-z]{2,4}$/, '');
        }
        callback(null, name + Date.now() + '.' + extension);
    }
});

module.exports = multer( { storage}).single('image');