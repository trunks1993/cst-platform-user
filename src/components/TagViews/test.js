import React from 'react';
import { Icon } from 'antd';
import _ from 'lodash';
import { queryByConfigId } from '@/api/cs_api';

export default ({ tags, setTags, setFormInfo, selectTag, setSelectTag, setSelectId }) => {


  // useEffect(() => {
  //   const index = _.findIndex(tags, v => v.cfgId === selectTag.cfgId);
  //   if (index === -1 && selectTag.cfgId) setTags([...tags, selectTag]);
  // }, [selectTag, tags]);

  return (
    <div className="tag-views">
      <ul >
        {
          tags.map((item, index) => {
            return (
              <li className={ selectTag.cfgId === item.cfgId ? 'tag-views-item active-tag-views' : 'tag-views-item' } key={index} onClick={() => {
                setSelectTag(item);
                queryByConfigId(item.cfgId).then(res => {
                  if (res.data.length) setSelectId(JSON.parse(res.data[0].cfiLayout).i);
                  res.data.forEach(ele => {
                    ele.cdsOdbcValue = ele.cusDataSource.cdsOdbcValue;
                  });
                  setFormInfo(res.data);
                }); }} >
                {item.cfgName }
                <Icon type="close" style={{ marginLeft: '5px' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    const newViews = _.filter(tags, v => item.cfgId !== v.cfgId);
                    setTags(newViews);
                    setSelectTag({});
                    setFormInfo([]);
                    setSelectId('');
                  }
                  } />
              </li>
            );
          })
        }
      </ul>
    </div>
  );
};
