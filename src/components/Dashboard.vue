<template>
    <div v-if="currentEvent">
        <canvas ref="chart" width="400" height="400"></canvas>
    </div>
</template>

<script>
export default {
    vuex: {
        getters: {
            currentEvent : state => state.global.currentEvent
        }
    },

    data () {
        return {
            graph: {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [
                    {
                        label: "My First dataset",
                        fillColor: "rgba(220,220,220,0.2)",
                        strokeColor: "rgba(220,220,220,1)",
                        pointColor: "rgba(220,220,220,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(220,220,220,1)",
                        data: [65, 59, 80, 81, 56, 55, 40]
                    },
                    {
                        label: "My Second dataset",
                        fillColor: "rgba(151,187,205,0.2)",
                        strokeColor: "rgba(151,187,205,1)",
                        pointColor: "rgba(151,187,205,1)",
                        pointStrokeColor: "#fff",
                        pointHighlightFill: "#fff",
                        pointHighlightStroke: "rgba(151,187,205,1)",
                        data: [28, 48, 40, 19, 86, 27, 90]
                    }
                ]
            }
        };
    },

    mounted () {
        let es = new EventSource("https://localhost:3000/changes?models=purchases", {
            withCredentials: true,
        });
        es.onmessage = function (event) {
            console.log(event.data);
        };
        es.onerror = function (l) {
            console.log(l);
        };
    }
}
</script>
