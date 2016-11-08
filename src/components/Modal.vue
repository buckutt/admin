<template>
    <transition name="fade">
        <div class="modal modal__bg" v-if="openEditModal">
            <slot></slot>
        </div>
    </transition>
</template>

<script>
import { updateEditModal } from '../store/actions';

export default {
    vuex: {
        getters: {
            openEditModal: state => state.global.openEditModal
        },
        actions: {
            updateEditModal
        }
    },

    methods: {
        closeModal() {
            this.updateEditModal(false);
        }
    }
}
</script>
