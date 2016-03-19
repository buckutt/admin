<template>
    <div class="treasury">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Treasury</h3>
            <h4>Filters</h4>
            <select v-model="point">
                <option value="0">Tous les points</option>
                <option value="{{ point.id }}" v-for="point in points">{{ point.name }}</option>
            </select>
            <select v-model="fundation">
                <option value="0">Toutes les fondations</option>
                <option value="{{ fundation.id }}" v-for="fundation in fundations">{{ fundation.name }}</option>
            </select>
            <select v-model="period">
                <option value="0">Toutes les périodes</option>
                <option value="{{ period.id }}" v-for="period in periods">{{ period.name }}</option>
            </select>
            <input type="text" v-el:datein>
            <input type="text" v-el:dateout>
            <button @click="filter()">Ok</button>
        </div>
    </div>
</template>

<script>
import { get } from '../lib/fetch';

export default {
    vuex: {
        getters: {
            points: state => state.points,
            fundations: state => state.fundations,
            periods: state => state.periods
        }
    },

    data () {
        return {
            point    : '0',
            fundation: '0',
            period   : '0',
            dateIn   : '',
            dateOut  : ''
        };
    },

    methods: {
        filter () {
            console.log(this.$data);
            let q = [];

            if (this.$data.point !== '0') {
                q.push(JSON.stringify({
                    field: 'pointId',
                    eq: this.$data.point
                }));
            }

            if (this.$data.fundation !== '0') {
                q.push(JSON.stringify({
                    field: 'fundationId',
                    eq: this.$data.fundation
                }));
            }

            if (this.$data.period !== '0') {
                q.push(JSON.stringify({
                    field: 'periodId',
                    eq: this.$data.period
                }));
            }

            if (this.$data.dateIn !== '') {
                q.push(JSON.stringify({
                    field: 'dateIn',
                    ge: this.$data.dateIn,
                    date: true
                }));
            }

            if (this.$data.dateOut !== '') {
                q.push(JSON.stringify({
                    field: 'dateOut',
                    le: this.$data.dateOut,
                    date: true
                }));
            }

            let orQ = 'q=' + q
                .map(o => encodeURIComponent(o))
                .join('&q[]=');

            get(`purchases?${orQ}`)
                .then(purchases => {
                    console.log(purchases);
                })
        }
    },

    attached () {
        const $dateIn  = this.$els.datein;
        const $dateOut = this.$els.dateout;
        jQuery($dateIn).datetimepicker({
            onChangeDateTime: ct => {
                this.$data.dateIn = ct;
            }
        });
        jQuery($dateOut).datetimepicker({
            onChangeDateTime: ct => {
                this.$data.dateOut = ct;
            }
        });
    }
}
</script>

<style lang="sass">
    @import '../main.scss';

    .treasury {
        > div {
            height: calc(100% - 40px);
            margin: 20px ((100% - $cardSize) / 2);
            padding: 20px;
            width: $cardSize;

            > h3 {
                margin: 0;
            }

            > select {
                display: inline-block;
                max-width: 150px;
            }
        }
    }
</style>
