 
import useIndexedDB from '../store/index'
 // 创建数据库
const { isInitialized, add, get, update, remove, getAll } = useIndexedDB(
  "MyDatabase",
  "webUser"
);

export { isInitialized, add, get, update, remove, getAll };