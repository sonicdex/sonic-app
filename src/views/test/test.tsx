import { useState , useEffect , createContext, useContext , useRef , useReducer , useCallback ,useMemo  } from "react";
const UserContext = createContext({});

import Todos2 from './todos';
import useFetch from './useFetch';



const initialTodos = [
    {
      id: 1,
      title: "Todo 1",
      complete: false,
    },
    {
      id: 2,
      title: "Todo 2",
      complete: false,
    },
  ];

  const reducer = (state:any, action:any) => {
    switch (action.type) {
      case "COMPLETE":
        return state.map((todo:any) => {
          if (todo.id === action.id) {
           var p= { ...todo, complete: !todo.complete }
            return p;
          } else {
            return todo;
          }
        });
      default:
        return state;
    }
  };

  function Todos() {

    const [todos, dispatch] = useReducer(reducer, initialTodos);

    const handleComplete = (todo:any) => {
      dispatch({ type: "COMPLETE", id: todo.id });
    };
  
    return (
      <>
        {todos.map((todo:any) => (
          <div key={todo.id}>
            <label>
              <input
                type="checkbox"
                checked={todo.complete}
                onChange={() => handleComplete(todo)}
              />
              {todo.title}
            </label>
          </div>
        ))}
      </>
    );
  }
function App() {
    const [inputValue, setInputValue] = useState("");
    const previousInputValue = useRef("");
  
    useEffect(() => {
      previousInputValue.current = inputValue;
    }, [inputValue]);
  
    return (
      <>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <h2>Current Value: {inputValue}</h2>
        <h2>Previous Value: {previousInputValue.current}</h2>
      </>
    );
  }
  

function Component1() {
  

    const [user, setUser] = useState("Jesse Hall");
    setUser;
    return (
        <UserContext.Provider value={{user:user , number:1222}}>
      <div>
        <h1>{`Hello ${user}!`}</h1>
        <Component2 />
      </div>
        
      </UserContext.Provider>
    //  
    );
  }
  
  function Component2() {
    return (
      <>
        <h1>Component 2  </h1>
        <Component3 />
      </>
    );
  }
  
  function Component3() {
    const value:any = useContext(UserContext);
    return (
      <>
        <h1>Component 3 user {value.user}</h1>
        <Component4 />
      </>
    );
  }
  
  function Component4() {
    return (
      <>
        <h1>Component 4</h1>
        <Component5 />
      </>
    );
  }
  
  function Component5() {
    const value:any = useContext(UserContext);
  
    return (
      <>
        <h1>Component 5</h1>
        <h2>{`Hello ${value.user} again!`}</h2>
      </>
    );
  }

function Timer() {
    const [count, setCount] = useState(0);
    // setInterval(() => {
    //     setCount((count) => count + 2);
    // }, 3000);
    setCount;
    useEffect(() => {
    //     setCount((count) => count + 2);
    //   console.log('count updated' ,count)
    },[count]);
  
    return <h1>I've rendered {count} times!</h1>;
  }
 // Timer;


const App2 = () => {
  const [count, setCount] = useState(0);
  const [todos, setTodos] = useState(["todo 1", "todo 2"]);

  const increment = () => {
    setCount(count+1)
    setTodos(() => [...todos, "new Task"+count]);
  };



  const addTodo = useCallback(() => {
    setCount(count+1) 
    setTodos((t) => [...t, "New Todo "+ count]);}, [todos]);

    const expensiveCalculation = (num:number) => {

      console.log("Calculating...");
      for (let i = 0; i < 1000000000; i++) {
        num += 1;
      }
      return num;
    };

   // const calculation = expensiveCalculation(count);
   const calculation =  useMemo(() => expensiveCalculation(count), [count]);

  return (
    <div>
      <Todos2 todos={todos} addTodo={addTodo}  />
      <hr />
      <div>
        Count: {count}
        <button onClick={increment}>+</button>
      </div>
      <br/>
      <br/>
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


const Home = () => {
 //const [data, setData] = useState<[{id?:string , title?:string}]>([{}]);

  type  d= [{id?:string , title?:string}];
 const data:d= useFetch("https://jsonplaceholder.typicode.com/todos");

//  useMemo(():any => {

//   setTimeout(() => {
//     fetch("https://jsonplaceholder.typicode.com/todos").then(
//       (res) => res.json()
//   ).then((data) => setData(data) );
//   }, 10*1000);
//  },[]);


  return data.length>1 ?(
    <>
      <h1>HOME</h1>
      {data.length>1 &&
        data.map((item ) => {
          return <p key={item.id} >{item.title}</p>;
        })}
    </>
  ): (<></>);
};

export const TestView = () => {
    const [count, setCount] = useState(0);
    const [color, setColor] = useState("");
  

    useEffect(() => {
       
      console.log( 'count' , count , color)
    },[count , color]);

   

    

    return (<div>
        <h1>My favorite color is {color}!</h1>
      <button
        type="button"
        onClick={() => setColor("blue")}
      >Blue</button> , 

<button
        type="button"
        onClick={() => setColor("red")}
      >Red</button> ,
       <button
        type="button"
        onClick={() => setColor("pink")}
      >Pink</button> , 
      <button
        type="button"
        onClick={() => setColor("green")}
      >Green</button>
    <br/>
    ----------------------------------------------------------------------------------

    <h1>I've rendered {count} times! </h1>
    <button
        type="button"
        onClick={() => setCount(count+1)}
      >count</button>

      <Timer></Timer>
      <br/>
      ----------------------------------------------------------------------------------

      <Component1 />
      ----------------------------------------------------------------------------------
      <br/>
      <App/>
      ----------------------------------------------------------------------------------
      <br/>

      <Todos />

      <App2/>
      <br/>
      <br/>
      <br/>

      <Home/>
    </div>
    
    )
}
