<template>
    <div  @click.stop="">
        <div class="lightbox__image">
            <Buttons :zoom-value="zoomValue"
                     :title="image.type_name"
                     @reset="reset"
                     @invert="invert"
                     @rotateLeft="rotateLeft"
                     @rotateRight="rotateRight"
                     @zoomIn="zoomIn"
                     @zoomOut="zoomOut"
                     @enableDrawer="enableDrawer"
                     @disableDrawer="disableDrawer"
            />
            <div class="lightbox__image-canvas"
                 ref="image"
                 style="position: relative"
                 oncontextmenu="return false"
                 unselectable='on'
                 onselectstart='return false;'
                 onmousedown='return false;'>
            </div>
        </div>
    </div>
</template>

<script>
    import {ImageViewer} from '../ImageViewer.js'
    import Buttons from './Projection/Buttons.vue'
    import PictogramBtn from './PictogramBtn.vue'
    import ProjectionBtn from './ProjectionBtn.vue'

    export default {
        components: {
            Buttons,
            ProjectionBtn,
            PictogramBtn
        },
        props: {
            image: Object
        },
        data() {
            return {
                zoomValue: 0,
            }
        },
        mounted() {
            this.$viewerEvents.$on('view.changed', () => {
                this.destroy()
                this.init()
            })

            this.init()
        },
        beforeDestroy() {
            this.destroy()
        },
        methods: {
            init() {
                this.$nextTick(() => {
                    if(!this.$refs.image) return

                    this.viewer = new ImageViewer(this.$refs.image)
                    this.viewer.events((e) => {
                        this.zoomValue = e.zoomValue
                    })

                    this.viewer.init(
                        this.image.url
                    )
                })
            },
            destroy() {
                if(!this.viewer) return

                this.viewer.destroy()
                this.viewer = null
            },
            enableDrawer() {
                this.viewer.enableDrawer()
            },
            disableDrawer() {
                this.viewer.disableDrawer()
            },
            reset() {
                this.viewer.reset()
            },
            invert() {
                this.viewer.invert()
            },
            rotateLeft() {
                this.viewer.rotateLeft()
            },
            rotateRight() {
                this.viewer.rotateRight()
            },
            zoomIn() {
                this.viewer.zoomIn()
            },
            zoomOut() {
                this.viewer.zoomOut()
            },
        }
    }
</script>
