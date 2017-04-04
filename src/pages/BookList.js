/**
 * Created by Cris on 2017/4/4.
 */
import React from 'react';
import { message, Table, Button, Popconfirm } from 'antd';
import { get, del } from '../utils/request';

class BookList extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            bookList: []
        };
    }

    componentWillMount () {
        get('http://localhost:3000/book')
            .then(res => {
                this.setState({
                    bookList: res
                });
            });
    }

    handleEdit (book) {
        this.context.router.push('/book/edit/' + book.id);
    }

    handleDel (book) {
        del('http://localhost:3000/book/' + book.id)
            .then(res => {
                this.setState({
                    bookList: this.state.bookList.filter(item => item.id !== book.id)
                });
                message.success('This book has been deleted!');
            })
            .catch(err => {
                console.error(err);
                message.error('Operation failed ');
            });
    }

    render () {
        const {bookList} = this.state;

        const columns = [
            {
                title: 'BookID',
                dataIndex: 'id'
            },
            {
                title: 'BookName',
                dataIndex: 'name'
            },
            {
                title: 'Price',
                dataIndex: 'price',
                render: (text, record) => <span>${record.price / 100}</span>
            },
            {
                title: 'OwnerID',
                dataIndex: 'owner_id'
            },
            {
                title: 'Operation',
                render: (text, record) => (
                    <Button.Group type="ghost">
                        <Button size="small" onClick={() => this.handleEdit(record)}>Edit</Button>
                        <Popconfirm title="Delete it?" onConfirm={() => this.handleDel(record)}>
                            <Button size="small">Delete</Button>
                        </Popconfirm>
                    </Button.Group>
                )
            }
        ];

        return (
            <Table columns={columns} dataSource={bookList} rowKey={row => row.id}/>
        );
    }
}

BookList.contextTypes = {
    router: React.PropTypes.object.isRequired
};

export default BookList;