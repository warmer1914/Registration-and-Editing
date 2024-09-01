import { useState } from 'react';
import { Card, Col, Row } from 'antd';

function Cards({ cardList,chooseType }) {
    const [count, setCount] = useState(0);
    return (
        <> 
            <div className='cards'>
                <h1 className='editTitle'>Choose the mode you want to modify</h1>
                <Row gutter={20} justify='center'>
                    {
                        cardList.map(card => {
                            return <Col key={card.key} span={12}>
                                        <Card hoverable  title={card.title} bordered={false} onClick={() => chooseType(card.key)}>
                                            {card.content}
                                        </Card>
                                    </Col>
                        })
                    }

                </Row>
            </div>
        </>
       
    );
}

export default Cards;
