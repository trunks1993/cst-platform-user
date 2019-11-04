import loadable from '@/utils/loadable';
import { Modal } from 'antd';

const { confirm } = Modal;

const Dashboard = loadable(() => import('@/pages/dashboard'));

export function flatTree(tree, flatArr = []) {
  func(tree, flatArr);
  return flatArr;
}

function func(tree, arr) {
  if (!tree.length) return;
  Array.prototype.push.apply(arr, tree);
  tree.map(item => (item.children && item.children.length) && func(item.children, arr));
}


// confirm
export function showConfirm(success = function() {}, cancel = function() {}, title) {
  confirm({
    title: title || '确认删除',
    centered: true,
    okText: '确认',
    cancelText: '取消',
    // content: 'When clicked the OK button, this dialog will be closed after 1 second',
    onOk() {
      success();
    },
    onCancel() {
      cancel();
    },
  });
}

export default { Dashboard };
