
traceWithCount = msg => R.tap(x => console.log(msg, x.length))
traceWithAll = msg => R.tap(x => console.log(msg, x))
traceWithout = msg => R.tap(x => console.log(msg))

const sumBy = prop => vals => R.reduce(
    (current, val) => R.evolve({[prop]: R.add(val[prop])}, current),
    R.head(vals),
    R.tail(vals)
)
const groupSumBy = R.curry((groupOn, sumOn, vals) => 
    R.values(
        R.map(
            R.pipe(
                sumBy(sumOn)
            )
        )(R.groupBy(R.prop(groupOn), vals))
    )
)

const groupByIdAndSumByCount = groupSumBy('id', 'count');
  
// groupSumBy('title', 'age', people)

obj1 = {id:'a', count:2}
obj2 = {id:'a', count:3, goat:'aye'}
obj3 = {id:'a', count:4, goat:'naye'}
obj4 = {id:'b', count:3, goat:'aye'}
obj5 = {id:'b', count:4, goat:'naye'}

let finalTest = R.compose(     
    traceWithAll('testy5'),
    // R.map(
    //     R.compose(
    //         traceWithAll('here'),
    //         R.map(
    //             R.compose(
    //                 traceWithAll('here2'),
    //                 concatValues()
    //             )
    //         )
    //     )
    // ),
    // traceWithAll('testy1'),
    // byId(),
    groupByIdAndSumByCount,
    traceWithAll('testy'),
);

let result = finalTest([obj1, obj2, obj3, obj4, obj5]);
console.log("result");
console.log(result);