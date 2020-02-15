import React, { Component } from 'react';
import {
    Switch,
    Route,
    Link,
    Redirect,
    withRouter,
} from "react-router-dom";
import { Layout, Menu, Icon, Button } from 'antd';
import CompareComponent from './components/Compare';
import LoginForm from './components/Login';


const { Header, Sider, Content } = Layout;

const AuthButton = ({ isAuthenticated, signOut, history }) => {

    return isAuthenticated ? (
        <Button type="primary" ghost
        onClick={signOut}
        >
            Sign out
    </Button>
    ) : (
        <Button type="primary" ghost
        onClick={()=> history.push('/login')}
        >
            Login
    </Button>
        );
}
const AuthenticatedRoutes = ({ isAuthenticated, location }) => {
    return (
        <Route path="/">
            {isAuthenticated ? 
            <Switch>
                <Route path="/about">
                    About
                </Route>
                <Route path="/compare">
                    <CompareComponent />
                </Route>
                <Route path="/history">
                    history
                </Route>
            </Switch> 
            : <Redirect to={{
                pathname: "/login",
                state: { from: location }
            }}>
                </Redirect>}
        </Route>
    )
}
class Cockpit extends Component {
    state = {
        collapsed: false,
        isAuthenticated: false,
    };
    logUserIn = () => {
        this.setState({ isAuthenticated: true })
    }
    signOut = () => {
        this.setState({ isAuthenticated: false })
    }
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    componentDidMount(){
        this.toggle()
    }
    render() {
        const { location, history } = this.props;
        const {collapsed, isAuthenticated} = this.state
        return (
            <Layout className='section'>
                <Sider trigger={null} collapsible collapsed={collapsed} style={{height: '100vh'}}>
                    <div className="logo" />
                    <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]}>
                        <Menu.Item key="/about">
                            <Link to='/about'>
                                <Icon type="user" />
                                <span>nav 1</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/compare">
                            <Link to='/compare'>
                                <Icon type="file-add" />
                                <span>Compare</span>
                            </Link>
                        </Menu.Item>
                        <Menu.Item key="/history">
                            <Link to='/history'>
                                <Icon type="history" />
                                <span>History</span>
                            </Link>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header style={{ background: '#fff', padding: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 24px', alignItems: 'center' }}>
                            <Icon
                                className="trigger"
                                type={collapsed ? 'menu-unfold' : 'menu-fold'}
                                onClick={this.toggle}
                            />
                            <AuthButton isAuthenticated={isAuthenticated} signOut={this.signOut} history={history} />
                        </div>
                    </Header>
                    <Content
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            background: '#fff',
                            minHeight: 280,
                            overflow: 'scroll'
                        }}
                    >
                        <Switch>
                            <Route path="/login">
                                <LoginForm logIn={this.logUserIn} />
                            </Route>
                            <AuthenticatedRoutes isAuthenticated={isAuthenticated} location={location} />
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}

export default withRouter(Cockpit)