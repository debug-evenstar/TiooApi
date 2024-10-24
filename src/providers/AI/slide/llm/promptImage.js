const { PromptImageURL } = require("./promptImageURL");

class PromptImage {
    image_url = PromptImageURL;

    /**
     * The type of the content part.
     */
    type = 'image_url';
}

module.exports = PromptImage;