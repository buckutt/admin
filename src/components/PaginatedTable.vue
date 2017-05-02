<template>
    <div class="b-responsive-table">
        <transition name="fade">
            <table class="mdl-data-table mdl-js-data-table mdl-shadow--2dp" v-if="displayedData.length > 0">
                <thead>
                    <tr>
                        <th v-for="header in headers" class="mdl-data-table__cell--non-numeric">
                            {{ header.title }}
                        </th>
                        <th class="mdl-data-table__cell--non-numeric" v-if="actions">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="data in displayedData">
                        <td v-for="header in headers" class="mdl-data-table__cell--non-numeric" :class="header.class">
                            <span v-if="header.type">
                                <span v-if="header.type === 'price'">{{ lodget(data, header.field) | price(true) }}</span>
                                <span v-if="header.type === 'date'">{{ lodget(data, header.field) | date }}</span>
                                <span v-if="header.type === 'checkbox'">
                                    <mdl-checkbox :value="lodget(data, header.field)" disabled></mdl-checkbox>
                                </span>
                            </span>
                            <span v-else>{{ lodget(data, header.field) }}</span>
                        </td>
                        <td class="mdl-data-table__cell--non-numeric b-actions-cell">
                            <span v-for="action in actions">
                                <span v-if="action.type">
                                    <b-confirm @confirm="callback(action.action, data)" v-if="action.type === 'confirm'">
                                        {{ action.text }}
                                    </b-confirm>
                                    <span v-if="action.type === 'reversible'">
                                        <mdl-button raised accent @click.native="callback(action.action, data)" v-if="!data[action.field]">{{ action.text1 }}</mdl-button>
                                        <mdl-button raised @click.native="callback(action.action, data)" v-if="data[action.field]">{{ action.text2 }}</mdl-button>
                                    </span>
                                </span>
                                <span v-else>
                                    <mdl-button
                                        :raised="action.raised"
                                        :colored="action.colored"
                                        @click.native="callback(action.action, data)">
                                        {{ action.text }}
                                    </mdl-button>
                                </span>
                            </span>
                        </td>
                    </tr>
                </tbody>
                <tfoot v-if="pagesNumber > 1">
                    <tr>
                        <td :colspan="columnsNumber">
                            <div class="b--center b--fullwidth b-table__pages">
                                <span>
                                    Affichage de {{ displayedData.length }} éléments sur {{ filteredData.length }}
                                </span>
                                <span>
                                    <a href="#" @click.prevent="previous()" :class="{ 'b-table__visible': isPrevious }">Précedent</a>
                                    Page {{ adjustedPage }}/{{ pagesNumber }}
                                    <a href="#" @click.prevent="next()" :class="{ 'b-table__visible': isNext }">Suivant</a>
                                </span>
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
        </transition>
        <transition name="fade">
            <p v-if="displayedData.length === 0">Aucune donnée à afficher.</p>
        </transition>
    </div>
</template>

<script>
import lodget from 'lodash.get';
import fuzzy  from 'fuzzy';
import '../lib/price';
import '../lib/date';

export default {
    props: {
        headers: Array,
        data   : Array,
        filter : {
            type    : Object,
            required: false
        },
        sort: {
            type    : Object,
            required: false
        },
        actions: {
            type    : Array,
            required: false
        },
        route: {
            type    : String,
            required: false
        },
        paging: {
            type    : Number,
            required: false
        }
    },

    data() {
        return {
            page: 1
        };
    },

    methods: {
        callback(action, arg) {
            switch (action) {
                case 'remove':
                    this.$emit(action, { route: this.route, value: arg });
                    break;
                default:
                    this.$emit(action, arg);
            }
        },
        previous() {
            if (this.isPrevious) {
                this.page = this.adjustedPage - 1;
            }
        },
        next() {
            if (this.isNext) {
                this.page += 1;
            }
        },
        lodget(object, path) {
            return lodget(object, path);
        }
    },

    computed: {
        filteredData() {
            if (this.filter) {
                return fuzzy
                    .filter(this.filter.val, this.data, { extract: el => el[this.filter.field] })
                    .map(d => d.original);
            }

            return this.data.slice();
        },
        displayedData() {
            let transformedData = this.filteredData.slice();

            if (this.sort) {
                transformedData = transformedData.sort((a, b) => {
                    const aField = a[this.sort.field].toLowerCase();
                    const bField = b[this.sort.field].toLowerCase();

                    if (aField < bField) {
                        return (this.sort.order !== 'DESC') ? -1 : 1;
                    }

                    if (aField > bField) {
                        return (this.sort.order !== 'DESC') ? 1 : -1;
                    }

                    return 0;
                });
            }

            if (this.paging) {
                transformedData = transformedData.slice(this.start, this.start + this.paging);
            }

            return transformedData;
        },
        start() {
            if (!this.paging) {
                return 0;
            }

            return (this.adjustedPage - 1) * this.paging;
        },
        pagesNumber() {
            if (!this.paging) {
                return 1;
            }

            return Math.ceil(this.filteredData.length / this.paging);
        },
        isPrevious() {
            if (this.adjustedPage - 1 > 0) {
                return true;
            }
            return false;
        },
        isNext() {
            if (this.adjustedPage + 1 <= this.pagesNumber) {
                return true;
            }
            return false;
        },
        adjustedPage() {
            return Math.min(this.page, this.pagesNumber);
        },
        columnsNumber() {
            return (this.actions) ? this.headers.length + 1 : this.headers.length;
        }
    }
};
</script>

<style lang="scss">
    @import '../main.scss';

    .b-table__pages {
        display: flex;
        justify-content: space-between;

        > span {
            > a {
                opacity: 0;
                pointer-events: none;
                text-decoration: none;
                margin: 10px;

                &.b-table__visible {
                    opacity: 1;
                    pointer-events: all;
                }
            }
        }
    }
</style>