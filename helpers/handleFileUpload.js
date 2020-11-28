const fs = require('fs');
const path = process.env.PHOTO_PATH;
const handleFileUpload = function(buff, recipe_id) {
    const fileName = path + '/recipe-photo-' + recipe_id;

    fs.writeFile(fileName, buff, (err) => {
        if (err) {
            console.log(err);
        }
    });
};

module.exports = handleFileUpload;