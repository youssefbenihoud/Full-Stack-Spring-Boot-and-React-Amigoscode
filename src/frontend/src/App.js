import {useState, useEffect} from 'react'
import {getAllStudents} from "./client";
import {
    Layout,
    Menu,
    Breadcrumb,
    Table,
    Spin,
    Empty,
    Button,
    Badge,
    Avatar,
    Radio, Divider
} from 'antd';
import {
    DesktopOutlined,
    PieChartOutlined,
    LoadingOutlined,
    FileOutlined,
    TeamOutlined,
    DownloadOutlined, PlusOutlined, UserOutlined,
} from '@ant-design/icons';
import StudentDrawerForm from "./StudentDrawerForm";

import './App.css';
import studentDrawerForm from "./StudentDrawerForm";
import ActionsButtons from "./ActionsButtons";
import {errorNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const TheAvatar = ({name, size}) => {
    let trim = name.trim();
    if (trim.length === 0) {
        return <Avatar size={size} icon={<UserOutlined/>}/>;
    }
    const split = trim.split(" ");
    if (split.length === 1) {
        return <Avatar size={size}>{name.charAt(0)}</Avatar>
    }

    return <Avatar size={size}>{`${name.charAt(0)}${name.charAt(name.length - 1)}`}</Avatar>;
}


const columns = fetchStudents => [
    {
        title: '',
        dataIndex: 'avatar',
        key: 'avatar',
        render: (text, student) => <TheAvatar name={student.name} size={'large'}/>
    },
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
        render: (text, student) => <ActionsButtons
            studentId={student.id}
            studentName={student.name}
            fetchStudents={fetchStudents}
        />
    }
];

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setStudents(data);
                //setFetching(false);
            }).catch(err => {
            console.log("Error --> " + err.response);
            err.response.json().then(res => {
                console.log(res);
                errorNotification(
                    "There was an issue!",
                    res.message + " [statusCode:] " + res.status,
                    "bottomLeft")
            })
        }).finally(() => setFetching(false));

    useEffect(() => {
        console.log("component is mounted");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>;
        }
        if (students.length <= 0) {
            return <>
                <Button type="primary"
                        onClick={() => setShowDrawer(!showDrawer)}
                        shape="round"
                        icon={<PlusOutlined/>}
                        size="small">
                    Add New Student
                </Button>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"No Students Found!"}/>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />

            </>
        }

        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table dataSource={students}
                   columns={columns(fetchStudents)}
                   bordered
                   title={() =>
                       <>
                           <Badge
                               className="site-badge-count-109"
                               count={students.length}
                               style={{
                                   backgroundColor: '#52c41a',
                                   marginRight: '10px'
                               }}
                           />
                           <Button type="primary"
                                   onClick={() => setShowDrawer(!showDrawer)}
                                   shape="round"
                                   icon={<PlusOutlined/>}
                                   size="small">
                               Add New Student
                           </Button>
                       </>
                   }
                   pagination={{pageSize: 50}}
                   scroll={{y: 500}}
                   rowKey={(student) => student.id}
            />
        </>;
    }


    return <Layout style={{minHeight: '100vh'}}>
        <Sider collapsible collapsed={collapsed}
               onCollapse={setCollapsed}>
            <div className="logo"/>
            <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                <Menu.Item key="1" icon={<PieChartOutlined/>}>
                    Option 1
                </Menu.Item>
                <Menu.Item key="2" icon={<DesktopOutlined/>}>
                    Option 2
                </Menu.Item>
                <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                    <Menu.Item key="3">Tom</Menu.Item>
                    <Menu.Item key="4">Bill</Menu.Item>
                    <Menu.Item key="5">Alex</Menu.Item>
                </SubMenu>
                <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                    <Menu.Item key="6">Team 1</Menu.Item>
                    <Menu.Item key="8">Team 2</Menu.Item>
                </SubMenu>
                <Menu.Item key="9" icon={<FileOutlined/>}>
                    Files
                </Menu.Item>
            </Menu>
        </Sider>
        <Layout className="site-layout">
            <Header className="site-layout-background" style={{padding: 0}}/>
            <Content style={{margin: '0 16px'}}>
                <Breadcrumb style={{margin: '16px 0'}}>
                    <Breadcrumb.Item>User</Breadcrumb.Item>
                    <Breadcrumb.Item>Bill</Breadcrumb.Item>
                </Breadcrumb>
                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                    {renderStudents()}
                </div>
            </Content>
            <Footer style={{textAlign: 'center'}}>Youssef Benihoud with Amigoscode Course
                <Divider>
                    <a
                        target={"_blank"}
                        href={"https://www.t.me/youssefbenihoud"}>
                        Click here to contact me on Telegram!
                    </a>
                </Divider>
            </Footer>        </Layout>
    </Layout>
}

export default App;
