import { useState, useEffect , useMemo } from "react";


export const TestViewt1 = () => {

    const [count, setCount] = useState(0);

    useEffect(() => {
      let timer = setTimeout(() => {
      setCount((count) => count + 1);
    }, 5000);
  
    return () => clearTimeout(timer)
    }, [count]);
  
    return <h1>I've rendered {count} times!</h1>;
}

export const TestViewt2 = () => {
    const [count, setCount] = useState(0);
    const [todos, setTodos] =  useState<string[]>(['']);
    const calculation = useMemo(() => expensiveCalculation(count), [count]);
  
    const increment = () => {
      setCount((c) => c + 1);
    };
    const addTodo = () => {
      setTodos((t) => {
        var s:string[] = [...t, "New Todo"]
        return s;
      }  );
    };
  
    return (
      <div>
        <div>
          <h2>My Todos</h2>
          {todos.map((todo, index) => {
            return <p key={index}>{todo}</p>;
          })}
          <button onClick={addTodo}>Add Todo</button>
        </div>
        <hr />
        <div>
          Count: {count}
          <button onClick={increment}>+</button>
          <h2>Expensive Calculation</h2>
          {calculation}
        </div>
      </div>
    );
  };
  
  const expensiveCalculation = (num:number) => {
    for (let i = 0; i < 1000000000; i++) {
      num += 1;
    }
    return num;
}
