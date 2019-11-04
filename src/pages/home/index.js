import React, { useState, useEffect } from 'react';
import RGL, { WidthProvider } from '@/components/Draggler';
import _ from 'lodash';
import DragDom from '@/components/DragDom';
import { getHomeDetail } from '@/api/index';
import { getToken } from '@/utils/auth';
const ReactGridLayout = WidthProvider(RGL);
const generateDOM = (layout) => {
  // eslint-disable-next-line complexity
  console.log(layout);

  return _.map(layout, (l, i) => {
    const nl = JSON.parse(l.cfiLayout);
    nl.static = true;

    return (
      <div key={nl.i} style={{ overflow: 'hidden' }} data-grid={nl}>
        <DragDom key={nl.i} data={l} isCs={false} isHome />
      </div>
    );
  });
};
export default () => {
  const [layout, setLayout] = useState([]);

  useEffect(() => {
    getHomeDetail(getToken()).then(res => {
      setLayout(res.data);
    });
  }, []);
  return (
    // onDragEnter={() => setDo(true)} fix bug: 拖入一个item还没放置的时候触发onLayoutChange导致页面白板
    <div className="home-grid-box" >
      <ReactGridLayout
        className="cst-layout"
        cols={12}
        rowHeight={30}
      >
        {generateDOM(layout)}
      </ReactGridLayout>
    </div>
  );

};
