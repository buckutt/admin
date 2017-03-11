<template>
    <transition name="fade">
        <div class="modal modal__bg" v-if="openEditModal">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions([
            'updateEditModal'
        ]),
        closeModal() {
            this.updateEditModal(false);
        }
    },

    computed: {
        ...mapState({
            openEditModal: state => state.global.openEditModal
        })
    }
};
</script>
