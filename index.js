import Lightbox from './src/Viewer'

export default {
    install(Vue, options) {
        Vue.component("dicom-viewer", Lightbox);
    }
};