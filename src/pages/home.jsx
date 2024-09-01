import { useState, useEffect, createContext, useCallback, useRef } from 'react';
import './home.less';
import dbKeys from '../store/dbKeys'
import Form from '../component/Form';
import Tabs from '../component/Tabs';
import { Button, Modal, message } from 'antd';
import Edit from '../component/Edit'
import useIndexedDB from '../store/index'
// 新增编辑穿透
export const EditContext = createContext(null);
function Home() {
  // 说明
  const description = {
    title: '项目说明',
    content: (
      <>
        <p >1.项目初始状态，由于数据库无用户，所以需要先新增用户，才能去编辑。</p>
        <p>2.新增和编辑所有项都为必填，个别输入的值会进行正确性校验。</p>
        <p>3.新增用户会比对数据库是否已有该用户，用户名相当于用户Id，具有唯一性。</p>
        <p>4.新增完以后可以选择修改刚创建的用户，也可以选择修改库里保存的已创建的用户信息。</p>
        <p>5.修改时不可对用户名进行修改。</p>
      </>
    ),
  };
  // 创建数据库
  const { isInitialized, add, get, update, remove, getAll } = useIndexedDB(
    "MyDatabase",
    "webUser"
  );
  // 获取数据库数据
  const getAllData = async () => {
    const data = await getAll()
    setDbData(data)
  }
  // 新增和编辑结构
  const tabs = [
    {
      key: 'add',
      name: 'Add User'
    },
    {
      key: 'edit',
      name: 'Edit User'
    }
  ]
  // 校验规则
  const rulers = [{
    key: 'mobile',
    ruler: /^(?:\+?\d{1,3})?[-. ]?(?:1[5789]\d{9}|86\d{10})$/
  },
  {
    key: 'email',
    ruler: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/
  }
  ]
  // 数据结构
  const _data = dbKeys.map(res => {
    let errorInfor = [{
      ruler: /\S/,
      infor: `Please enter your ${res}`
    }]
    // 添加特殊校验
    rulers.map(r => {
      if (r.key === res) {
        errorInfor = [...errorInfor, {
          ruler: r.ruler,
          infor: `Please enter the correct ${res}`
        }]
      }
    })
    return {
      name: res,
      key: res,
      placeholder: `enter your ${res}`,
      value: '',
      errorInfor
    }
  })

  const [dbData, setDbData] = useState([])
  const [formData, setFormData] = useState(_data)
  const [recentData,setRecentData] = useState([])
  const [tabValue, setTabValue] = useState('add')
  const [hasAdd, setHasAdd] = useState(false)
  const errColloct = useRef([])
  const [messageApi, contextHolder] = message.useMessage();
  const [modal, contextModal] = Modal.useModal();
  // 切换模式
  const toggleTab = (v) => {
    errColloct.current = []
    if (v === 'add') {
      clearInput()
    }
    setTabValue(v)
  }
  // 输入回显数据
  const setFormDataEvent = (v) => {
    const { key, value } = v
    console.log(v)
    setFormData(prev =>
      prev.map(item => {
        if (item.key === key) {
          return {
            ...item,
            value: value
          }
        }
        return item
      })
    )
  }
  // 数据回填
  const backUserData = (v) => {
    setFormData(v)
  }
  // 添加用户
  const addUserData = async (params) => {
    const hasSave = dbData.find(db => db.useName === params.useName)
    // 已存在useName禁止创建
    if (hasSave) {
      messageApi.open({
        type: 'warning',
        content: 'The user already exists, please change youre userName',
      });
      return
    }

    const sucess = await add({ ...params, id: params.useName })
    if (sucess) {
      setHasAdd(true)
      setRecentData(formData)
      getAllData()
      messageApi.open({
        type: 'success',
        content: 'user added successfully.',
      });
    } else {
      messageApi.open({
        type: 'error',
        content: 'Failed to add data',
      });
    }
  }
  // 清空输入框数据
  const clearInput = () => {
    setFormData(_data)
  }
  // 编辑用户
  const editUserData = async (params) => {
    const sucess = await update({ ...params, id: params.useName })
    if (sucess) {
      getAllData()
      messageApi.open({
        type: 'success',
        content: 'The user has updated.',
      });
    } else {
      messageApi.open({
        type: 'error',
        content: 'Failed to updated data',
      });
    }
  }
  // 提交数据
  const confrimEvent = async () => {
    // console.log(await getAll())
    validation()
    if (errColloct.current.length > 0) {
      messageApi.open({
        type: 'error',
        content: errColloct.current[0].msg,
      });
      return
    }
    let params = {}
    formData.map(res => {
      params[res.key] = res.value
    })
    if (tabValue === 'add') {
      addUserData(params)
    } else {
      editUserData(params)
    }
  }

  // 校验数据
  const validation = () => {
    errColloct.current = []
    for (let i = 0; i < formData.length; i++) {
      const { errorInfor, value, key } = formData[i]
      errorInfor.forEach((err) => {
        if (!err.ruler.test(value)) {
          // console.log(err)
          errColloct.current = [...errColloct.current, { key, msg: err.infor }]
          // setErrColloct((errInor) => [...errInor,{key,msg:err.infor}])
          // setErrColloct((errInor) => {
          //   const newErrInor = []
          // })
        }
      })

    }
  }

  useEffect(() => {
    console.log(formData)
    // 数据库准备完毕
    if (isInitialized) {
      getAllData()
    }
  }, [isInitialized,formData])


  return (
    <>
      <header className='navbar flex justify-side align-center'>
        <div className='top bounce'>welcome to register</div>
        <Button className='walletBtn' type="primary" onClick={async () => {
          modal.info(description);
        }}>description</Button>
      </header>
      <main className='content'>
        {contextHolder}
        {contextModal}
        <Tabs data={{ tabs, tabValue }} toggleTab={toggleTab} />
        <EditContext.Provider value={{ setFormDataEvent, dbData }}>
          {
            tabValue === 'add'
              ?
              <Form type='add' formData={formData} confrimEvent={confrimEvent} />
              :
              <Edit hasAdd={hasAdd} recentData={recentData} backUserData={backUserData} formData={_data} getAllData={getAllData} dbData={dbData} confrimEvent={confrimEvent} />
          }

        </EditContext.Provider>
      </main>
    </>
  );
}

export default Home;
