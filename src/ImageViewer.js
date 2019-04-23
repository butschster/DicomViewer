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

                // Add zoom tools
                cornerstoneTools.addTool(ZoomMouseWheelTool)
                cornerstoneTools.setToolActive('ZoomMouseWheel', { mouseButtonMask: 1 })

                // Add line drawer tools
                // MacOS users can't use middle mouse button, that's why I use enable/disable line drawing button
                cornerstoneTools.addTool(LengthTool)

                // Fit image into view
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

    // Enable lines drawing
    // Disable pan
    enableDrawer() {
        cornerstoneTools.setToolDisabledForElement(this.element, 'Pan')
        cornerstoneTools.setToolActiveForElement(this.element, 'Length', { mouseButtonMask: 1 })
    }

    // Disable lines drawing
    // Enable pan
    disableDrawer() {
        cornerstoneTools.setToolDisabledForElement(this.element, 'Length')
        cornerstoneTools.setToolActiveForElement(this.element, 'Pan', { mouseButtonMask: 1 })

        this.updateViewport()
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
        if (typeof callback === 'function') {
            callback(viewport)
        }
        cornerstone.setViewport(this.element, viewport);
    }

    reset() {
        // Reset view
        cornerstone.reset(this.element)

        // Remove all drew lines
        cornerstoneTools.getToolForElement(this.element, 'Length').reset()
    }

    // Invert image
    invert() {
        this.updateViewport((viewport) => {
            viewport.invert = !viewport.invert;
        })
    }

    destroy() {
        cornerstone.disable(this.element);
    }

}