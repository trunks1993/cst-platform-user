import React, { useState, useEffect } from 'react';
import { Slider } from 'antd';

export default ({ type, data = [] }) => {
  // eslint-disable-next-line no-unused-vars
  const [list, setList] = useState([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    if (data.length) {
      if (type === '7') {
        data.forEach(ele => {
          ele.demagePercent = (ele.damageCount / ele.totalCount).toFixed(2) * 100;
        });
        console.log(data);
      }
    }
    setList(data);
  }, [data]);
  const getDefaultWidth = (len) => {
    if (len % 3 === 0) {
      return '33.3%';
    } else if (len % 2 === 0) {
      return '50%';
    }
    return '100%';
  };
  if (type === '6'){
    return (
      list.map((ele,i) => (
        <div key={i} className="crime-content">
          <div className="crime-content-pro"><span style={{ width: '100px', display: 'inline-block' }}>{ele.label}</span><Slider defaultValue={ele.value} disabled style={{ cursor: 'pointer' }} /> <span>{ele.value}人</span></div>
        </div>
      ))
    );
  }
  return (
    <div className="equipment-content">
      {
        list.map((ele,i) => (
          <div key={i} className="crime-content-pro" style={{ width: getDefaultWidth(list.length) }}>
            <span className="crime-content-title" style={{ width: '100px', display: 'inline-block' }}>{ele.label}</span>
            <div className="crime-content-pro-box">
              <Slider defaultValue={100} disabled style={{ cursor: 'pointer' }} /> <span className="number">{'总数  ' + ele.totalCount}人</span>
              <Slider defaultValue={+ele.demagePercent} disabled style={{ cursor: 'pointer' }} /> <span className="number">{'损坏数 ' + ele.damageCount}人</span>
            </div>
          </div>
        ))
      }
    </div>

  );
};
