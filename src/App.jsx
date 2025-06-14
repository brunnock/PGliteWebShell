import React from 'react';
import {initState,reducer} from './reducer.js';
import Table from './Table.jsx';
import Output from './Output.jsx';

import './App.css';

import { PGlite } from '@electric-sql/pglite'
import { usePGlite } from "@electric-sql/pglite-react"

var pg = new PGlite('idb://my-pgdata')

function App() {

  const [state, dispatch] = React.useReducer(reducer, initState);
  const [update, setUpdate] = React.useState(true);
  const textRef = React.useRef(null);

  function reset() {
    if (confirm("Delete all data?")) {
      pg.exec('DROP SCHEMA public CASCADE; CREATE SCHEMA public;');
      dispatch({type:'reset'});
    }
  }

  React.useEffect(()=>{
    let allData={};
    if (update) {
      pg.query("SELECT tablename FROM pg_tables WHERE schemaname='public'")
	.then(tableData => {
	  let tables = tableData.rows.map(x=>x.tablename);
	  let queries = tables.map(x=>pg.query(`select * from ${x}`));
	  Promise.all(queries)
	    .then(results=>{
	      results.forEach((result,indx)=>{
		let table=tables[indx];
		allData[table]={};
		allData[table].fields = result.fields.map(field => field.name);
		allData[table].data=[];
		result.rows.map(z=>allData[table].data.push(Object.values(z)));
	      })
	    })
	    .then(() => dispatch({type:'setValue', key:'data', value:allData}))
	})
	.catch(err => console.log(err.message));
      setUpdate(false);
    }
  }, [update]);


  function run() {
    if (textRef.current.value) {
      pg.exec(textRef.current.value)
	.then(result=>{
	  dispatch({type:'setOutput', result:result});
	  setUpdate(true);
	})
	.catch(err=>dispatch({type:'setError', error:err.message}));
      dispatch({type:'run', input:textRef.current.value});
      textRef.current.value = '';
    }
    dispatch({type:'setValue', key:'output', value:''});
  }

  
  // 4 panes- input, output, history, data

  return (
    <>

      <details id='intro' open={true}>
	<summary>Intro</summary>
	<p>This is PGlite. A Postgres server that runs in your browser. You're running a Postgres server in your browser right now.</p>
	
	<p>Below are four panes. Enter SQL code in the lower left pane and see the output in the lower right.
	  All of your code will be added to the <i>History</i> in the upper left and all of the current data stored by this database will be displayed in the upper right.</p>

	<p>You can enter the following SQL to try it out-</p>
	<code>{`CREATE TABLE ages (
  name VARCHAR(128),
 age INTEGER
);

INSERT INTO ages (name, age) VALUES ('Jon', 10);
INSERT INTO ages (name, age) VALUES ('Jan', 20);
INSERT INTO ages (name, age) VALUES ('Jim', 30);
INSERT INTO ages (name, age) VALUES ('Bob', 40);
INSERT INTO ages (name, age) VALUES ('Eve', 50);

SELECT * FROM ages;
`}
	</code>
      </details>
      
      <pre id="history">{state.history}</pre>

      <div id="data">
	{Object.keys(state.data).map(table=>
	  <details key={table+'DETAILS'}>
	    <summary>{table}</summary>
	    <Table table={table} fields={state.data[table].fields} data={state.data[table].data} />
	  </details>
	)}
      </div>

      <textarea ref={textRef} placeholder="Enter SQL here."></textarea>

      <Output state={state} />

      <div id="buttons">
	<button onClick={run}>Run</button>
	<button onClick={reset}>Reset</button>
      </div>
    </>
  )
}

export default App;
