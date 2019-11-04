import React from 'react';
import { Icon } from 'antd';

export default () => {
  const data = [
    {
      id: 1,
      label: '分析研判岗-通用模板1'
    },
    {
      id: 2,
      label: '分析研判岗-通用模板1'
    }
  ];

  return (
    <div className="tag-views">
      <ul>
        {data.map(item => (
          <li className="tag-views-item" key={item.id}>
            {item.label}
            <Icon type="close" />
          </li>
        ))}
      </ul>
    </div>
  );
};
