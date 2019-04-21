<template>
    <div class="lightbox__image-btn-group" role="group">
        <div class="btn btn-sm btn-outline-success border-0">
            {{ title.toUpperCase() }}
        </div>
        <button type="button" class="btn btn-sm btn-outline-success" @click="reset" data-toggle="tooltip"
                data-placement="bottom" title="Reset">
            <i class="fa fa-refresh"></i>
        </button>
        <button type="button" class="btn btn-sm btn-outline-success" @click="invert" data-toggle="tooltip"
                data-placement="bottom" title="Invert">
            <i class="fa fa-adjust"></i>
        </button>

        <div class="btn btn-sm btn-outline-success ml-2">
            <i class="fa fa-search"></i> {{ zoomValue }}%
        </div>
        <button class="btn btn-sm btn-outline-success" @click="zoomOut" data-toggle="tooltip" data-placement="bottom"
                title="Zoom out">
            <i class="fa fa-search-minus"></i>
        </button>
        <button class="btn btn-sm btn-outline-success" @click="zoomIn" data-toggle="tooltip" data-placement="bottom"
                title="Zoom in">
            <i class="fa fa-search-plus"></i>
        </button>
        <button class="btn btn-sm btn-outline-success ml-2" @click="rotateLeft" data-toggle="tooltip"
                data-placement="bottom" title="Turn left">
            <i class="fa fa-rotate-left"></i>
        </button>
        <button class="btn btn-sm btn-outline-success" @click="rotateRight" data-toggle="tooltip" data-placement="bottom"
                title="Turn right">
            <i class="fa fa-rotate-right"></i>
        </button>
        <button class="btn btn-sm btn-outline-success ml-2" @click="toggleDrawer" data-toggle="tooltip"
                data-placement="bottom" title="Toggle line drawer">
            <i class="fa fa-compass" v-if="lineDrawer"></i>
            <i class="fa fa-pencil" v-else></i>
        </button>
    </div>
</template>

<script>
    export default {
        props: {
            zoomValue: {
                default: 0
            },
            title: String
        },
        data() {
            return {
                lineDrawer: false
            }
        },
        methods: {
            reset() {
                this.$emit('reset')
            },
            invert() {
                this.$emit('invert')
            },
            rotateLeft() {
                this.$emit('rotateLeft')
            },
            rotateRight() {
                this.$emit('rotateRight')
            },
            zoomIn() {
                this.$emit('zoomIn')
            },
            zoomOut() {
                this.$emit('zoomOut')
            },
            toggleDrawer() {
                this.lineDrawer = !this.lineDrawer

                if (this.lineDrawer) {
                    this.$emit('enableDrawer')
                } else {
                    this.$emit('disableDrawer')
                }
            }
        }
    }
</script>