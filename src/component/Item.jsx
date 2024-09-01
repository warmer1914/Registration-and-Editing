import { useState, useContext } from 'react';
import { Input } from 'antd';
import { EditContext } from '../pages/home'

function Item({ data,type }) {
    const { placeholder, name, value, key } = data

    const onChange = (e, setFormDataEvent) => {
        console.log(e.target.value)
        setFormDataEvent({
            key,
            value: e.target.value
        })

    }
    return (
        <>
            <EditContext.Consumer>
                {
                    ({ setFormDataEvent }) => {
                        return <div className='flex-ro'>
                            <h3 className='label'>{name}：</h3>
                            <Input size="large" 
                                className="inputStyle" 
                                maxLength="50"
                                disabled={type === 'edit' && key === 'useName'}
                                allowClear
                                placeholder={placeholder} 
                                defaultValue={value} 
                                onChange={(e) => onChange(e, setFormDataEvent)}
                             />
                        </div>
                    }
                }

            </EditContext.Consumer>

        </>
    );
}

export default Item;
