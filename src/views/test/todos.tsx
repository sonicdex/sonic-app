import React, { memo  } from 'react';

type TodosProps={
    todos:string[],
    addTodo:() => any;
}
const Todos2: React.FC<TodosProps>  = ( {todos, addTodo} ) => {
    return (
      <div>
        <br/>
        <h2>My Todos</h2>
        {todos.map((todo, index) => {
          return <p key={index}>{todo}</p>;
        })}
         <button onClick={addTodo}>Add Todo</button>
      </div>
    );
};

export default memo(Todos2);
