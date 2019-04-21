import cornerstoneTools from 'cornerstone-tools'
import * as cornerstone from "cornerstone-core";

const LengthTool = cornerstoneTools.LengthTool

const getNewContext = cornerstoneTools.import('drawing/getNewContext')
const draw = cornerstoneTools.import('drawing/draw')
const setShadow = cornerstoneTools.import('drawing/setShadow')
const drawLine = cornerstoneTools.import('drawing/drawLine')
const drawHandles = cornerstoneTools.import('drawing/drawHandles')
const drawLinkedTextBox = cornerstoneTools.import('drawing/drawLinkedTextBox')

export default class LineDrawer extends LengthTool {
    reset() {
        const toolData = cornerstoneTools.getToolState(this.element, this.name);
        if (typeof toolData.data == 'undefined') {
            toolData.data = []
        }

        toolData.data = []
    }

    /**
     * Custom callback for when a tool is selected.
     *
     * @method toolSelectedCallback
     * @memberof Tools.Base.BaseAnnotationTool
     *
     * @param  {*} evt
     * @param  {*} annotation
     * @param  {string} [interactionType=mouse]
     * @returns {void}
     */
    toolSelectedCallback(evt, annotation, interactionType = 'mouse') {
        const toolData = cornerstoneTools.getToolState(evt.currentTarget, this.name);

        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();


        // TimeOut added for dbl click preventing. Dblclick creates a new point
        setTimeout(() => {
            toolData.data = toolData.data.filter(a => {
                return !Object.is(annotation, a)
            })

            // Update viewport immediately
            const viewport = cornerstone.getViewport(this.element);
            cornerstone.setViewport(this.element, viewport);
        }, 100)
    }

    createNewMeasurement(eventData) {
        const goodEventData = eventData && eventData.currentPoints && eventData.currentPoints.image;

        if (!goodEventData) {
            logger.error(
                `required eventData not supplied to tool ${
                    this.name
                    }'s createNewMeasurement`
            );

            return;
        }

        const {x, y} = eventData.currentPoints.image;

        return {
            visible: true,
            active: true,
            color: undefined,
            handles: {
                start: {
                    x,
                    y,
                    highlight: true,
                    active: false,
                },
                end: {
                    x,
                    y,
                    highlight: true,
                    active: true,
                },
                textBox: {
                    active: false,
                    hasMoved: false,
                    movesIndependently: false,
                    drawnIndependently: true,
                    allowedOutsideImage: true,
                    hasBoundingBox: true,
                },
            },
        };
    }

    renderToolData(evt) {
        const eventData = evt.detail;
        const {handleRadius, drawHandlesOnHover} = this.configuration;
        const toolData = cornerstoneTools.getToolState(evt.currentTarget, this.name);

        if (!toolData) {
            return;
        }

        // We have tool data for this element - iterate over each one and draw it
        const context = getNewContext(eventData.canvasContext.canvas);
        const {image, element} = eventData;

        const lineWidth = 2;
        const imagePlane = cornerstoneTools.external.cornerstone.metaData.get(
            'imagePlaneModule',
            image.imageId
        );
        let rowPixelSpacing;
        let colPixelSpacing;

        if (imagePlane) {
            rowPixelSpacing =
                imagePlane.rowPixelSpacing || imagePlane.rowImagePixelSpacing;
            colPixelSpacing =
                imagePlane.columnPixelSpacing || imagePlane.colImagePixelSpacing;
        } else {
            rowPixelSpacing = image.rowPixelSpacing;
            colPixelSpacing = image.columnPixelSpacing;
        }

        for (let i = 0; i < toolData.data.length; i++) {
            const data = toolData.data[i];

            if (data.visible === false) {
                return;
            }

            draw(context, context => {
                // Configurable shadow
                setShadow(context, this.configuration);

                const color = cornerstoneTools.toolColors.getColorIfActive(data);

                // Draw the measurement line
                drawLine(context, element, data.handles.start, data.handles.end, {
                    color,
                });

                // Draw the handles
                const handleOptions = {
                    color,
                    handleRadius: 4,
                    drawHandlesIfActive: drawHandlesOnHover,
                };

                drawHandles(context, eventData, data.handles, handleOptions);

                // Set rowPixelSpacing and columnPixelSpacing to 1 if they are undefined (or zero)
                const dx = (data.handles.end.x - data.handles.start.x) * (colPixelSpacing || 1);
                const dy = (data.handles.end.y - data.handles.start.y) * (rowPixelSpacing || 1);

                // Calculate the length, and create the text variable with the millimeters or pixels suffix
                const length = Math.sqrt(dx * dx + dy * dy);

                // Store the length inside the tool for outside access
                data.length = length;

                if (!data.handles.textBox.hasMoved) {
                    const coords = {
                        x: Math.max(data.handles.start.x, data.handles.end.x),
                    };

                    // Depending on which handle has the largest x-value,
                    // Set the y-value for the text box
                    if (coords.x === data.handles.start.x) {
                        coords.y = data.handles.start.y;
                    } else {
                        coords.y = data.handles.end.y;
                    }

                    data.handles.textBox.x = coords.x;
                    data.handles.textBox.y = coords.y;
                }

                // Move the textbox slightly to the right and upwards
                // So that it sits beside the length tool handle
                const xOffset = 10;

                const text = textBoxText(data, rowPixelSpacing, colPixelSpacing);

                drawLinkedTextBox(
                    context,
                    element,
                    data.handles.textBox,
                    text,
                    data.handles,
                    textBoxAnchorPoints,
                    color,
                    lineWidth,
                    xOffset,
                    true
                );
            });

        }

        function textBoxText(data, rowPixelSpacing, colPixelSpacing) {
            // Set the length text suffix depending on whether or not pixelSpacing is available
            let suffix = ' mm';

            const length = data.length / 10;

            return `${length.toFixed(1)}${suffix}`;
        }

        function textBoxAnchorPoints(handles) {
            const midpoint = {
                x: (handles.start.x + handles.end.x) / 2,
                y: (handles.start.y + handles.end.y) / 2,
            };

            return [handles.start, midpoint, handles.end];
        }
    }
}