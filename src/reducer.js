const initState = {output:'', history:'', data:'', error:null};

function reducer(state2, action) {
  let state = structuredClone(state2);

  //console.log(action);
  switch (action.type) {

  case 'setValue':
    state[action.key] = action.value;
    break;

  case 'run':
    state.history = state.history + "\n" + action.input.trim();
    break;

  case 'setError':
    state.output = {};
    state.error = action.error;
    break;

  case 'setOutput': {
    state.error=null;
    let result = action.result;
    if ((typeof result)==='object') {
      state.output={};
      let data = result[0].rows;
      state.output.data=data;
      if (data.length>1)
	state.output.fields = result[0].fields.map(x=>x.name)
    } else {
      state.output = result.toString();
    }
    break;
  }
    
  case 'reset':
    return initState;
    
  }
  //console.log(state);
  return state;
}

export {initState, reducer};
