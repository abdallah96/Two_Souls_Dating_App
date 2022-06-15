import React from "react";
import './Tags.css';

const Tags = ({ Tagname}) => {
    return (
      <div className="tag">
         {Tagname}
      </div>
    );
  }
  
  export default Tags;
  