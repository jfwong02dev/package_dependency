import React, { Fragment } from 'react'
import List from '../List'
import './index.less'

export default ({ onSearch, list }) => (
  <Fragment>
    <span className="recent-title">Recent Search: </span>
    {list && <List list={list} recent={{ onSearch }} />
    // {list && (
    //   <ul className="recent-list">
    //     {list.map((item, index) => (
    //       <li key={index}>
    //         {checkTop3(index)}
    //         <span className="list-text" onClick={() => onSearch(item)}>
    //           {item}
    //         </span>
    //       </li>
    //     ))}
    //   </ul>
    // )
    }
  </Fragment>
)
