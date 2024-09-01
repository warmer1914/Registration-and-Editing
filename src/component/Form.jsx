import { Button } from 'antd';
import Item from './Item';

function Form(props) {
  const {formData,confrimEvent,type} = props
  return (
    <>
      <div className='formContent flex-ro justify-side warp'>
          {
            formData.map(data =>{
              return  <Item key={data.key} data={data} type={type}/>
            })
          }
      </div>
      <div className='footer'>
        <Button className='walletBtn' size='large' type="primary" onClick={confrimEvent}>confrim</Button>
      </div>
    </>
  );
}

export default Form;
