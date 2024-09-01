import { useState, useContext } from 'react';
import { Input, Flex, Card } from 'antd';
import { EditContext } from '../pages/home'

function Tags({ changeUser}) {
    return (
        <>
            <h1 className='editTitle'>Choose the user you want to modify</h1>
            <EditContext.Consumer>
                {
                    ({ dbData }) => {
                        return <Flex wrap gap="large" justify="center">
                            {
                                dbData.map((db) => {
                                    return <Card key={db.id} onClick={()=>changeUser(db.id)} hoverable className='tagCard'>
                                        {db.useName}
                                    </Card>
                                })
                            }
                        </Flex>

                    }
                }
            </EditContext.Consumer>

        </>
    );
}

export default Tags;
