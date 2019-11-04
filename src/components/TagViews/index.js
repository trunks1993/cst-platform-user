import React from 'react';
import { Icon } from 'antd';
import _ from 'lodash';
import { getTempDetail } from '@/api/index';
export default ({ tags, setTags, curIndex, setIsShare, handleCurIndex, setFormInfo }) => {

  return (
    <div className="tag-views">
      <ul >
        {
          tags.map((item, index) => {
            return (
              <li className={ curIndex === item.cucId ? 'tag-views-item active-tag-views' : 'tag-views-item' } style={{ cursor: 'pointer' }} key={index} onClick={ () => {
                setIsShare(item.cucIsShare);
                if (curIndex !== item.cucId) {
                  getTempDetail(item.cucId).then(res => {
                    res.data.forEach(e => {
                      e.cfiConfigId = e.cfiId;
                    });
                    setFormInfo(_.clone(res.data));
                  });
                }
                handleCurIndex(item.cucId);
              } }>
                {item.cucName }
                <Icon type="close" style={{ marginLeft: '5px' }}
                  onClick={ (e) => {
                    e.stopPropagation();
                    e.nativeEvent.stopImmediatePropagation();
                    const newViews = _.filter(tags, (v, i) => i !== index);
                    const newIdx = _.findIndex(tags,(v) => curIndex === v.cucId);
                    if (newIdx === 0) handleCurIndex(tags[newIdx + 1].cucId);
                    else handleCurIndex(tags[newIdx - 1].cucId);
                    setTags(newViews);
                    // handleCurIndex('');
                    setFormInfo([]);
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
