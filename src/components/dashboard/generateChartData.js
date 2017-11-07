export default (timefilter, timeseries, colorsPattern) => {
    const xAxis         = [];
    const startBoundary = moment(new Date(timefilter.dateIn)).ceil(timefilter.divide, 'minutes');
    const endBoundary   = moment(new Date(timefilter.dateOut)).ceil(timefilter.divide, 'minutes');
    const curves        = [];
    const colors        = {};

    for (let t = moment(startBoundary); t <= endBoundary; t.add(timefilter.divide, 'minutes')) {
        xAxis.push(t.toISOString());
    }

    const curvesLength = xAxis.length;

    Object.keys(timeseries).forEach((timeserieKey, timeserieIndex) => {
        const timeserie      = timeseries[timeserieKey];
        curves[timeserieKey] = Array(curvesLength)
            .fill(0)
            .map((_, index) => {
                const start = moment(startBoundary).add(timefilter.divide * (index - 1), 'minutes');
                const end   = moment(startBoundary).add(timefilter.divide * index, 'minutes');

                const filteredTimeserie = timeserie
                    .filter(time => moment(time).isBetween(start, end, null, '[)'));

                return filteredTimeserie.length;
            });

        colors[timeserieKey] = colorsPattern[timeserieIndex];
    });

    return {
        x         : 'x',
        xLocaltime: false,
        xFormat   : '%Y-%m-%dT%H:%M:%S.%LZ',
        json      : {
            x: xAxis,
            ...curves
        },
        colors
    };
};
