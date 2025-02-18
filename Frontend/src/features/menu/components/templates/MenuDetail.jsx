import { Col, Row, Menu } from 'antd';

const items = [
  {
    key: '1',
    label: 'Option 1',
  },
  {
    key: '2',
    label: 'Option 2',
  },
  {
    key: '3',
    label: 'Option 3',
  },
];

const MenuDetail = () => {

    // if (isLoading) {
    //     return <h1>Loading...</h1>;
    // }
    // if (isError) {
    //     return <h1>Error...</h1>;
    // }
  return (
    <>
        <div style={styles.menuPage}>
            <Row>
                <Col span={3}>
                </Col>
                <Col span={4}>
                    <div style={{padding: "13px 26px"}}>
                        <p style={styles.titleMenu}>Thực Đơn</p>
                    </div>
                </Col>
                
            </Row>
            <Row>
                <Col span={3}>
                </Col>
                <Col span={4}>
                    <Menu style={{ width: '100%', height: '100%' }}
                        defaultSelectedKeys={['1']}
                        mode="inline"
                        items={items}>

                    </Menu>
                </Col>
                <Col span={9}>
                    <div style={{backgroundColor: 'red'}}>
                        <p>hakfakfh</p>
                    </div>
                </Col>
                <Col span={5}>
                    <div style={{backgroundColor: 'blue'}}>
                        <p>fahjkfhaf</p>
                    </div>
                </Col>
                <Col span={3}>
                </Col>
            </Row>
        </div>
    </>
  )
}

const styles = {
    menuPage: {
        backgroundColor: "#F5F5F5",
    },
    titleMenu: {
        fontSize: "14px",
        fontWeight: "bold",
        color: "#CF2127",
        
    },
    onecol: {
        backgroundColor: '#ffffff',
    }
    
};

export default MenuDetail;
