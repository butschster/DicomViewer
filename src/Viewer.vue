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
    import {pick } from 'lodash'
    import Projection from './partials/Projection.vue'
    import PictogramBtn from './partials/PictogramBtn.vue'
    import ProjectionBtn from './partials/ProjectionBtn.vue'

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
                        return pick(images, 'lcc', 'lmlo')
                    case'right':
                        return pick(images, 'rcc', 'rmlo')
                }

                if (_.has(images, this.view)) {
                    return pick(images, this.view)
                }

                return images
            }
        },
        methods: {
            openViewer(view) {
                this.view = view
                this.visible = true

                this.$viewerEvents.$emit('view.changed', view)
            },

            hide() {
                this.visible = false
                document.body.style.overflow = 'auto'
            }
        },
    }
</script>

<style lang="scss">
    .lightbox-pictogram__list {
        list-style: none;
        padding: 0;
        margin: 0 auto;

        &--horizontal {
            display: flex;
            justify-content: flex-start;
        }
    }

    .lightbox__btn-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
        width: 100px;

        & .lightbox-pictogram__btn {
            min-height: 66px;
            min-width: 78px;
        }
    }

    .lightbox-pictogram__btn {
        min-height: 106px;
        border: 1px solid #ffffff;
        min-width: 118px;
        background-color: #3490dc;
        background-image: url(./svg/all-icon.svg);
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;

        &:focus,
        &:hover {
            box-shadow: 0px 0px 8px 1px rgba(52, 144, 220, 1);
            transition: .3s ease-out;
        }
    }

    .lightbox-pictogram {
        margin-bottom: 20px;
        position: relative;
    }

    .lightbox-pictogram__item {
        padding: 0;
        margin: 10px;

        &:nth-of-type(2) .lightbox-pictogram__btn {
            background-image: url(./svg/right-icon.svg);
        }

        &:nth-of-type(3) .lightbox-pictogram__btn {
            background-image: url(./svg/left-icon.svg);
        }

        & button {
            text-transform: uppercase;
        }
    }

    .lightbox__elements {
        flex-wrap: wrap;
        flex-grow: 1;
        display: flex;
        align-items: stretch;
        width: 100%;
        height: 100%;
        max-height: 100vh;
        overflow: hidden;
        padding-right: 0;
    }

    .lightbox__element {
        width: 50%;
        height: 100%;
        display: flex;
        flex-grow: 1;
    }

    .lightbox__element--half-height {
        height: 50%;
    }

    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        background: rgba(0, 0, 0, .8);
        width: 100%;
        height: 100%;
        z-index: 1;
        max-height: 100vh;
        overflow: hidden;
    }

    .lightbox__close {
        position: absolute;
        right: 50%;
        margin-right: -10px;
        transform: translateX(30%);
        top: 15px;
        padding: 0 10px;
        font-size: 2.5rem;
        cursor: pointer;
        color: #ffffff;
        z-index: 1000;
        line-height: 2rem;
    }

    .lightbox__arrow--invisible {
        visibility: hidden;
    }

    .lightbox__image {
        border: 3px solid #ffffff;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 100%;
        background: #000000;
        position: relative;
        overflow: hidden;

        & canvas {
            //width: 100%;
            margin: 0 auto;
            object-fit: fill;
        }
    }

    .lightbox__image-canvas {
        flex-grow: 1;

    }

    .lightbox__image-btn-group {
        padding: 10px 0;
        text-align: center;
        margin: 0 1.5rem;
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        position: absolute;
        top: 0;
        z-index: 999;
    }

    .lightbox__arrow {
        padding: 0 2rem;
        cursor: pointer;
        display: flex;
        justify-content: center;
        align-items: center;

        svg {
            fill: #ffffff;
            pointer-events: none;
        }
    }

    @media screen and (max-width: 720px) {
        .lightbox__arrow {
            padding: 0 1rem;
        }

        .lightbox-pictogram {
            &--absolute {
                width: 60px;
            }
        }
        .lightbox-pictogram__btn {
            min-height: 76px;
            min-width: 88px;
        }
    }

    @media screen and (max-width: 500px) {
        .lightbox__element,
        .lightbox__btn-wrapper {
            height: 50%;
        }

        .lightbox__arrow {
            position: absolute;
            padding: 0 2rem;
            height: 100%;
        }

        .lightbox__arrow--right {
            right: 0;
            background: linear-gradient(to right, transparent, rgba(0, 0, 0, .3));
        }

        .lightbox__arrow--left {
            left: 0;
            background: linear-gradient(to left, transparent, rgba(0, 0, 0, .3));
        }
    }
</style>