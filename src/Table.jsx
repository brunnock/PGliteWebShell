function Table({table='',fields,data}) {
  return (
    <table>
      <thead>
	<tr>
	  {fields.map((x,indx)=><th key={table+x+indx+'TH'}>{x}</th>)}
	</tr>
      </thead>
      <tbody>
	{data.map((x,indx)=>
	  <tr key={'tr'+indx}>
	    {Object.values(x).map((y,indy)=>
	      <td key={table+'TD'+indx+indy}>{y}</td>)}
	  </tr>
	)}
      </tbody>
    </table>
  )
}

export default Table;

