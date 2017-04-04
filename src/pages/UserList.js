/**
 * Created by Cris on 2017/4/3.
 */
import React from 'react';
import { message, Table, Button, Popconfirm } from 'antd';
import { get, del } from '../utils/request';

class UserList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            userList: []
        };
    }

    componentWillMount () {
        get('http://localhost:3000/user')
            .then(res => {
                this.setState({
                    userList: res
                });
            });
    }

    handleEdit (user) {
        this.context.router.push('/user/edit/' + user.id);
    }

    handleDel (user) {
        del('http://localhost:3000/user/' + user.id)
            .then(res => {
                this.setState({
                    userList: this.state.userList.filter(item => item.id !== user.id)
                });
                message.success('This user has been deleted!');
            })
            .catch(err => {
                console.error(err);
                message.error('Operation failed ');
            });
    }

    render () {
        const {userList} = this.state;

        const columns = [
            {
                title: 'UserID',
                dataIndex: 'id'
            },
            {
                title: 'UserName',
                dataIndex: 'name'
            },
            {
                title: 'Gender',
                dataIndex: 'gender'
            },
            {
                title: 'Age',
                dataIndex: 'age'
            },
            {
                title: 'Operation',
                render: (text, record) => {
                    return (
                        <Button.Group type="ghost">
                            <Button size="small" onClick={() => this.handleEdit(record)}>Edit</Button>
                            <Popconfirm title="Delete it？" onConfirm={() => this.handleDel(record)}>
                                <Button size="small">Delete</Button>
                            </Popconfirm>
                        </Button.Group>
                    );
                }
            }
        ];

        return (
            <Table columns={columns} dataSource={userList} rowKey={row => row.id}/>
        );
    }
}

UserList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default UserList;