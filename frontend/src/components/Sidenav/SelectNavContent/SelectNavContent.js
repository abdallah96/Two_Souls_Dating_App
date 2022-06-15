import React from 'react'
import Event from '../Event/Event'
const SelectNavContent = ({data}) => {
    if(data === "explore"){
        return (
          <Event/>
        )
    }
    else if(data === "chat"){
        return (
          <div>test</div>
        )
    }
    else{
        return (
          <div>SelectNavContent</div>
        )
    }
}

export default SelectNavContent