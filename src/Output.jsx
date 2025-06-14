import Table from './Table.jsx';

function Output({state}) {
  if (state.error) return <output><b>{state.error}</b></output>;

  if (state.output.data){
    let data = state.output.data;
      
    if (state.output.fields) {
      // multiple rows
      return <output><Table fields={state.output.fields} data={state.output.data} /></output>
	
    } else {

      if (state.output.data.length===0) return <output>No data returned.</output>;
      
      // single row
      let entries = Object.entries(state.output.data[0]);
      if (entries.length>1) {
	return (
	  <output id="singleRecord">
	    <table>
	      <tbody>
		{Object.entries(state.output.data[0]).map((x,indx)=> 
		  <tr key={'tr'+indx}><th>{x[0]}</th><td>{x[1] ? x[1].toString(): 'No data.'}</td></tr>
		)}				       
	      </tbody>
	    </table>
	  </output>
	)
      } else {
	if (entries[0] && entries[0][1]) {
	  // just 1 value and not null
	  return <output>{entries[0][1].toString()}</output>;
	} else {
	  return <output>No data returned.</output>; // select nothing or null
	}
      }
    }
  }
  return <output>{state.output.toString()}</output>;
}

export default Output;
