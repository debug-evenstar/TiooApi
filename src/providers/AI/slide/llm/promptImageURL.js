class PromptImageURL {
    /**
     * Either a URL of the image or the base64 encoded image data.
     */
    url = '';

    /**
     * Specifies the detail level of the image. Learn more in the
     * [Vision guide](https://platform.openai.com/docs/guides/vision/low-or-high-fidelity-image-understanding).
     */
    detail = 'auto' || 'low' || 'high';
}

module.exports = PromptImageURL;