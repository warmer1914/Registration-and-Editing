import { useState, useEffect } from 'react';
import { Card, Col, Row ,message} from 'antd';
import Cards from './Cards';
import Form from './Form';
import Tags from './Tags';

function Edit({ hasAdd, formData, confrimEvent, dbData,backUserData,recentData }) {
  const cardData = [
    {
      key: 'recent',
      title: 'Recent additions',
      content: 'Since you just added a new user, you can choose to edit them.'
    },
    {
      key: 'past',
      title: 'Edit past users',
      content: 'You can edit users who have already registered.'
    }
  ]
  const [messageApi, contextHolder] = message.useMessage();
  const [cardList, setCardList] = useState([]);
  // think 选择状态 recent 选择编辑最近一次新增 past 选择编辑过去的用户 pastEdit 编辑过去用户
  const [status, setStatus] = useState('think')
  const [editData, setEditData] = useState([])

  //选择编辑种类
  const chooseType = (key) => {
    if(key === 'recent'){
      setEditData(recentData) 
    }
    if(key === 'past' && dbData.length === 0){
      // 无用户，需要新建
      messageApi.open({
        type: 'warning',
        content: 'There are currently no users, please add a new user',
      });
      return
    }
    setStatus(key)
  }
  // 回退
  const backStatu = () => {
    switch (status) {
      case 'recent':
        setStatus('think')
        break;
      case 'past':
        setStatus('think')
        break;
      case 'pastEdit':
        setStatus('past')
        break;
      default:
        break;
    }

  }
  // 编辑用户
  const changeUser = (id) => {
    const data = dbData.find(res => res.id === id)
    userInforcallback(data)
    chooseType('pastEdit')
  }
  // 回填用户信息
  const userInforcallback = (data) => {
    let _formData = formData
    for (let db in data) {
      _formData.map(res =>{
        if(res.key === db){
          res.value = data[db]
        }
      })
    }
    console.log(_formData)
    backUserData(_formData)
    setEditData(_formData)
  }
  useEffect(() => {
    // 如果最近新增过用户
    if (hasAdd) {
      console.log(dbData)
      // 新增完只有一条，只能修改当前用户
      dbData.length === 1? setCardList([cardData[0]]) : setCardList(cardData)
    } else {
      setCardList([cardData[1]])
    }
  }, [])
  return (
    <>
      {contextHolder}
      {
        status === 'think' && <Cards cardList={cardList} chooseType={chooseType} />
      }
      {
        status === 'past' && <Tags cardList={cardList} changeUser={changeUser} />
      }
      {
        (status === 'recent' || status === 'pastEdit') && <Form type='edit' formData={editData} confrimEvent={confrimEvent} />
      }
      {
        status != 'think' &&
        <div className='backArrow txt-center cursor'>
          <svg onClick={backStatu} t="1725105942061" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9904" width="42" height="42"><path d="M64 512c0 247 201 448 448 448s448-201 448-448S759 64 512 64 64 265 64 512z m64 0c0-211.8 172.2-384 384-384s384 172.2 384 384-172.2 384-384 384-384-172.2-384-384z" fill="#ffffff" p-id="9905"></path><path d="M548.6 287.9L376.3 448H768v64H376.4l172.2 160.1-39 41.9-251.7-234.1L509.6 246z" fill="#ffffff" p-id="9906"></path></svg>
        </div>
      }
    </>
  );
}

export default Edit;
