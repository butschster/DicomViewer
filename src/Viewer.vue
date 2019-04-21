<template>
    <div>
        <div class="lightbox d-flex" v-if="visible">
            <div class="lightbox__elements flex-fill">
                <Projection v-for="image in visibleImages"
                            :key="image.type_name"
                            :image="image"
                            class="lightbox__element"
                            :class="{'lightbox__element--half-height': totalVisibleImages > 2}"
                />
            </div>
            <div class="lightbox__btn-wrapper position-relative">
                <div class="lightbox__close" @click="hide">&times;</div>
                <div class="lightbox-pictogram">
                    <ProjectionBtn @openViewer="openViewer"/>
                    <PictogramBtn @openViewer="openViewer"/>
                </div>
            </div>
        </div>
        <div class="lightbox-pictogram" v-else>
            <PictogramBtn class="lightbox-pictogram__list--horizontal"
                          @openViewer="openViewer"
            />
        </div>
    </div>
</template>

<script>
    import _ from 'lodash'
    import Projection from './partials/Projection'
    import PictogramBtn from './partials/PictogramBtn'
    import ProjectionBtn from './partials/ProjectionBtn'

    export default {
        components: {
            Projection,
            PictogramBtn,
            ProjectionBtn
        },
        props: {
            images: Object,
        },
        data() {
            return {
                visible: false,
                view: 'all',
                callbacks: []
            }
        },
        computed: {
            totalVisibleImages() {
                return Object.keys(this.visibleImages).length
            },
            visibleImages() {
                let images = Object.assign({
                    rmlo: null,
                    lmlo: null,
                    rcc: null,
                    lcc: null,
                }, this.images)

                switch (this.view) {
                    case 'left':
                        return _.pick(images, 'lcc', 'lmlo')
                    case'right':
                        return _.pick(images, 'rcc', 'rmlo')
                }

                if (_.has(images, this.view)) {
                    return _.pick(images, this.view)
                }

                return images
            }
        },
        methods: {
            openViewer(view) {
                this.view = view
                this.visible = true

                Bus.$emit('view.changed', view)
            },

            hide() {
                this.visible = false
                document.body.style.overflow = 'auto'
            }
        },
    }
</script>
