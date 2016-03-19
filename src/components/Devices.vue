<template>
    <div class="treasury">
        <div class="mdl-card mdl-shadow--2dp">
            <h3>Devices</h3>
            <table class="mdl-data-table mdl-js-data-table mdl-data-table--selectable mdl-shadow--2dp">
              <thead>
                <tr>
                  <th class="mdl-data-table__cell--non-numeric">Material</th>
                  <th>Quantity</th>
                  <th>Unit price</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td class="mdl-data-table__cell--non-numeric">Acrylic (Transparent)</td>
                  <td>25</td>
                  <td>$2.90</td>
                </tr>
                <tr>
                  <td class="mdl-data-table__cell--non-numeric">Plywood (Birch)</td>
                  <td>50</td>
                  <td>$1.25</td>
                </tr>
                <tr>
                  <td class="mdl-data-table__cell--non-numeric">Laminate (Gold on Blue)</td>
                  <td>10</td>
                  <td>$2.35</td>
                </tr>
              </tbody>
            </table>
        </div>
    </div>
</template>

<script>
export default {
    attached () {
        this.$store = this.$router.app.$options.store;
    },

    data () {
        console.log(this.$store);
        return {};
    }
}
</script>
