<template>
    <router-link
        :to="user.id"
        class="tile-card-staff mdl-card"
        :class="{ 'mdl-shadow--2dp': !active, 'mdl-shadow--8dp': active }"
        @mouseover.native="active = true"
        @mouseleave.native="active = false">
        <div class="mdl-card__title mdl-card--expand">
            <i class="material-icons">assignment_ind</i>
            <h6 class="b--capitalized">
                {{ user.firstname }} {{ user.lastname }}
            </h6>
        </div>
        <div class="mdl-card__supporting-text">
            <div v-for="right in user.rights">
                <span><i class="material-icons">assignment_turned_in</i> {{ right.name }}</span>
                <span><i class="material-icons">location_on</i> {{ right.point.name }}</span>
                <span><i class="material-icons">alarm</i> {{ right.period.name }}</span>
            </div>
        </div>
    </router-link>
</template>

<script>
export default {
    props: {
        user: {
            type    : Object,
            required: true
        }
    },

    data() {
        return {
            active: false
        };
    }
};
</script>

<style>
    .tile-card-staff.mdl-card {
        display: flex;
        width: 700px;
        margin: 10px;
        max-height: 200px;
        text-decoration: none;
        flex-direction: row;
        align-items: center;
    }

    .tile-card-staff > .mdl-card__title {
        align-items: center;
        flex-direction: column;
        width: 250px;
        text-align: center;
        margin-top: 15px;

        & > i {
            font-size: 100px;
        }
    }

    .tile-card-staff > .mdl-card__title > h6 {
        margin-top: 0;
    }

    .tile-card-staff > .mdl-card__supporting-text {
        overflow-y: overlay;
        height: 100px;
        margin-right: 5px;
        padding: 0;

        & > div {
            display: flex;

            & > span {
                display: flex;
                align-items: center;
                width: 50%;
                flex: auto;

                & > i {
                    margin-right: 5px;
                    font-size: 25px;
                }
            }
        }
    }

    .tile-card-staff > .mdl-card__title {
        color: #000;
    }
</style>
