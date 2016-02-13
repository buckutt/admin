<template>
    <div>
        <canvas v-el:chart width="400" height="400"></canvas>
    </div>
</template>

<script>
export default {
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

    attached () {
        this.chart = new Chart(this.$els.chart.getContext('2d')).Line(this.graph, {
            bezierCurve: false
        });

        let es = new EventSource("https://localhost:3000/changes?model=purchases", {
            withCredentials: true,
        });
        es.onmessage = function (event) {
            console.log(event.data);
        };
        es.onerror = function (l) {
            console.log(l);
        };

        setInterval(() => {
            this.chart.datasets[0].points[2].value = parseInt(Math.random() * 50);
            this.chart.update();
        }, 1000);
    }
}
</script>
