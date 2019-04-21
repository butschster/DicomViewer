<template>
    <ul class="lightbox-pictogram__list">
        <li class="lightbox-pictogram__item">
            <button type="button" class="btn btn-outline-light w-100" @click.prevent="openViewerItem('rmlo')">
                rmlo
            </button>
        </li>
        <li class="lightbox-pictogram__item">
            <button type="button" class="btn btn-outline-light w-100" @click.prevent="openViewerItem('rcc')">
                rcc
            </button>
        </li>
        <li class="lightbox-pictogram__item">
            <button type="button" class="btn btn-outline-light w-100" @click.prevent="openViewerItem('lmlo')">
                lmlo
            </button>
        </li>
        <li class="lightbox-pictogram__item">
            <button type="button" class="btn btn-outline-light w-100" @click.prevent="openViewerItem('lcc')">
                lcc
            </button>
        </li>
    </ul>
</template>
<script>
    export default {
        methods: {
            openViewerItem(view) {
                this.$emit('openViewer', view);
            }
        }
    }
</script>
