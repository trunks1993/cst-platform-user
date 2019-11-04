import React, { useState } from 'react';
import RGL, { WidthProvider } from '@/components/Draggler';
import _ from 'lodash';
import DragDom from '@/components/DragDom';

const generateDOM = (formInfo, setFormInfo, selectId, setSelectId) => {
  // eslint-disable-next-line complexity
  return _.map(formInfo, (l, i) => {
    const nl = JSON.parse(l.cfiLayout);
    return (
      <div key={nl.i} style={{ overflow: 'hidden' }} data-grid={nl}>
        <DragDom key={nl.i} index={nl.i} data={l} isCs={false} isHome={false} formInfo={formInfo} setFormInfo={setFormInfo} />
      </div>
    );
  });
};


const ReactGridLayout = WidthProvider(RGL);

export default ({ curIndex, handleCurIndex, formInfo, setFormInfo, tempData, tags, setSelectId, selectId }) => {
  // onDragEnter={() => setDo(true)} fix bug: 拖入一个item还没放置的时候触发onLayoutChange导致页面白板
  const [doing, setDo] = useState(false);

  function onLayoutChange(l) {
    if (doing) return;
    const f = _.map(_.clone(formInfo), v => {
      const item = l.find(lv => lv.i === JSON.parse(v.cfiLayout).i);
      v.cfiLayout = JSON.stringify(item);
      return v;
    });
    setFormInfo(f);
  }

  const onDrop = e => {
    const { datasourceId, layout, name, type, id, odbcValue, updateHz } = tempData;
    const { w, h } = JSON.parse(layout);
    const { x, y } = e;
    const i = '' + new Date().getTime();
    const cfiLayout = JSON.stringify({ x, y, w, h, i });
    const newInfo = [{ cfiLayout, cfiDatasourceId: datasourceId, cfiName: name, cfiType: type, cfiConfigId: id, cdsOdbcValue: odbcValue, cfiUpdateHz: updateHz, }, ...formInfo];
    setFormInfo(newInfo);
    setDo(false);
  };
  return (
    // onDragEnter={() => setDo(true)} fix bug: 拖入一个item还没放置的时候触发onLayoutChange导致页面白板
    <div className="grid-box" onDragEnter={() => setDo(true)}>
      <ReactGridLayout
        className="cst-layout"
        cols={12}
        rowHeight={30}
        onLayoutChange={onLayoutChange}
        onDrop={onDrop}
        isDroppable={curIndex.length > 0}
      >
        { generateDOM(formInfo, setFormInfo) }
      </ReactGridLayout>
    </div>
  );

};
