<template>
    <ul class="lightbox-pictogram__list mx-n1">
        <li class="lightbox-pictogram__item  px-1">
            <button type="button"
                    class="lightbox-pictogram__btn"
                    @click.prevent="openViewerItem('all')"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="All projections"
            />
        </li>
        <li class="lightbox-pictogram__item  px-1">
            <button type="button"
                    class="lightbox-pictogram__btn"
                    @click.prevent="openViewerItem('right')"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Right projections" />
        </li>
        <li class="lightbox-pictogram__item  px-1">
            <button type="button"
                    class="lightbox-pictogram__btn"
                    @click.prevent="openViewerItem('left')"
                    data-toggle="tooltip"
                    data-placement="bottom"
                    title="Left projections"
            />
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
