import { PromptImageURL } from "./promptImageURL";

export interface PromptImage {
    image_url: PromptImageURL;

    /**
     * The type of the content part.
     */
    type: 'image_url';
}