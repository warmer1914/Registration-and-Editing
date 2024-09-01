import {Radio } from 'antd';

function Tabs({data,toggleTab}) {
    const {tabs,tabValue} = data
    const onChange = (e) =>{
        toggleTab(e.target.value)
    }
    return (
        <div className='tabs'>
            <Radio.Group defaultValue={tabValue} buttonStyle="solid" onChange={onChange}>
               {
                tabs.map(tab =>{
                    return <Radio.Button key={tab.key} value={tab.key}>{tab.name}</Radio.Button>
                })
               }
            </Radio.Group>
      </div>
    );
}

export default Tabs;
