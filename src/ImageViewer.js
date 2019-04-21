import $ from 'jquery'
import Hammer from 'hammerjs'
import * as cornerstone from 'cornerstone-core'
import * as cornerstoneTools from 'cornerstone-tools'
import * as cornerstoneMath from 'cornerstone-math'
import LengthTool from './tools/lineDrawer'

const PanTool = cornerstoneTools.PanTool
const ZoomMouseWheelTool = cornerstoneTools.ZoomMouseWheelTool
const WwwcTool = cornerstoneTools.WwwcTool

let cornerstoneWebImageLoader = require('cornerstone-web-image-loader')

cornerstoneTools.external.cornerstoneMath = cornerstoneMath
cornerstoneTools.external.cornerstone = cornerstone
cornerstoneTools.external.$ = $
cornerstoneTools.external.Hammer = Hammer
cornerstoneWebImageLoader.external.cornerstone = cornerstone

const csTools = cornerstoneTools.init();

export class ImageViewer {

    constructor(element) {
        this.element = element
    }

    init(image_url) {
        cornerstone.enable(this.element);
        cornerstone.loadImage(image_url)
            .then(image => {
                cornerstone.displayImage(this.element, image)
                cornerstone.reset(this.element)

                cornerstoneTools.addTool(PanTool)
                cornerstoneTools.setToolActive('Pan', { mouseButtonMask: 1 })

                cornerstoneTools.addTool(WwwcTool)
                cornerstoneTools.setToolActive('Wwwc', { mouseButtonMask: 2 })

                cornerstoneTools.addTool(ZoomMouseWheelTool)
                cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 1 })

                cornerstoneTools.addTool(LengthTool)


                this.element.addEventListener('cornerstoneimagerendered', (e) => {
                    if (this.callback) {
                        this.callback({
                            zoomValue: (cornerstone.getViewport(this.element).scale * 100).toFixed(0)
                        })
                    }
                });
            })
    }

    events(callback) {
        this.callback = callback
    }

    enableDrawer() {
        cornerstoneTools.setToolDisabledForElement(this.element, 'Pan')
        cornerstoneTools.setToolActiveForElement(this.element, 'Length', { mouseButtonMask: 1 })
    }

    disableDrawer() {
        cornerstoneTools.setToolDisabledForElement(this.element, 'Length')
        cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 1 })

        const viewport = cornerstone.getViewport(this.element);
        cornerstone.setViewport(this.element, viewport);
    }

    rotateLeft() {
        this.updateViewport((viewport) => {
            viewport.rotation -= 90;
        })
    }

    rotateRight() {
        this.updateViewport((viewport) => {
            viewport.rotation += 90;
        })
    }

    zoomIn() {
        this.updateViewport((viewport) => {
            viewport.scale += 0.1;
        })
    }

    zoomOut() {
        this.updateViewport((viewport) => {
            viewport.scale -= 0.1;
        })
    }

    updateViewport(callback) {
        const viewport = cornerstone.getViewport(this.element);
        callback(viewport)
        cornerstone.setViewport(this.element, viewport);
    }

    reset() {
        cornerstone.reset(this.element)
        cornerstoneTools.getToolForElement(this.element, 'Length').reset()
    }

    invert() {
        this.updateViewport((viewport) => {
            viewport.invert = !viewport.invert;
        })
    }

    destroy() {
        cornerstone.disable(this.element);
    }

}