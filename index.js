import Vue from 'vue'
import Lightbox from './src/Viewer'

window.Bus = new Vue()

export default {
    install(Vue, options) {
        Vue.component("dicom-viewer", Lightbox);
    }
};