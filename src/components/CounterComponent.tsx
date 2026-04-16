import {useState} from "react";

function CounterComponent() {

    const [counter, setCounter] = useState(0);

    function incrementCounter() {
        setCounter(counter + 1);
    }

    // function decrementCounter() {
    //     setCounter(counter - 1);
    // }

    return (
        <div>
            <h1>Counter Component</h1>
            <p>{counter}</p>
            <button onClick={incrementCounter}>Counter</button>
        </div>
    )
}

export default CounterComponent;