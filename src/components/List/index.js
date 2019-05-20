import React, { Fragment } from 'react'
import './index.less'

function checkTop(index, num = 3) {
  return Array.from(new Array(num), (x, i) => i).indexOf(index) !== -1
    ? 'list-index dark'
    : 'list-index'
}

export default ({ list, recent }) => {
  return (
    <Fragment>
      {recent ? (
        <Fragment>
          <ul className="recent-list">
            {list.map((item, index) => (
              <li key={index}>
                <span className={checkTop(index)}>{index + 1}</span>
                <span
                  className="list-text"
                  onClick={() => recent.onSearch(item) || null}
                >
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </Fragment>
      ) : (
        <ul>
          {list.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
    </Fragment>
  )
}
