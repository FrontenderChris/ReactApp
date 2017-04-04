/**
 * Created by Cris on 2017/4/4.
 */
import React from 'react';
import { Input, InputNumber, Form, Button, message } from 'antd';
import AutoComplete from '../components/AutoComplete';
import request, { get } from '../utils/request';

const Option = AutoComplete.Option;
const FormItem = Form.Item;
const formLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    }
};

class BookEditor extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            recommendUsers: []
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleOwnerIdChange = this.handleOwnerIdChange.bind(this);
    }

    componentDidMount () {
        // 在componentWillMount里使用form.setFieldsValue无法设置表单的值
        // 所以在componentDidMount里进行赋值
        // see: https://github.com/ant-design/ant-design/issues/4802
        const {editTarget, form} = this.props;
        if (editTarget) {
            form.setFieldsValue(editTarget);
        }
    }

    handleSubmit (e) {
        e.preventDefault();

        const {form, editTarget} = this.props;

        form.validateFields((err, values) => {
            if (err) {
                message.warn(err);
                return;
            }

            let editType = 'Add';
            let apiUrl = 'http://localhost:3000/book';
            let method = 'post';
            if (editTarget) {
                editType = 'Edit';
                apiUrl += '/' + editTarget.id;
                method = 'put';
            }

            request(method, apiUrl, values)
                .then((res) => {
                    if (res.id) {
                        message.success("Success to " + editType + 'book');
                        this.context.router.push('/book/list');
                    } else {
                        message.error(editType + 'failed!');
                    }
                })
                .catch((err) => console.error(err));
        });
    }

    getRecommendUsers (partialUserId) {
        get('http://localhost:3000/user?id_like=' + partialUserId)
            .then((res) => {
                if (res.length === 1 && res[0].id === partialUserId) {
                    return;
                }

                this.setState({
                    recommendUsers: res.map((user) => {
                        return {
                            text: `${user.id}（${user.name}）`,
                            value: user.id
                        };
                    })
                });
            });
    }

    timer = 0;

    handleOwnerIdChange (value) {
        this.setState({recommendUsers: []});

        if (this.timer) {
            clearTimeout(this.timer);
        }

        if (value) {
            this.timer = setTimeout(() => {
                this.getRecommendUsers(value);
                this.timer = 0;
            }, 200);
        }
    }

    render () {
        const {recommendUsers} = this.state;
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <Form onSubmit={this.handleSubmit} style={{width: '400px'}}>
                <FormItem label="Name：" {...formLayout}>
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: 'Plz input a valid book name'
                            }
                        ]
                    })(<Input type="text"/>)}
                </FormItem>

                <FormItem label="Price：" {...formLayout}>
                    {getFieldDecorator('price', {
                        rules: [
                            {
                                required: true,
                                message: 'Plz input a valid price',
                                type: 'number'
                            },
                            {
                                min: 1,
                                max: 99999,
                                type: 'number',
                                message: 'Price should be number form 1 to 99999'
                            }
                        ]
                    })(<InputNumber/>)}
                </FormItem>

                <FormItem label="Owner：" {...formLayout}>
                    {getFieldDecorator('owner_id', {
                        rules: [
                            {
                                required: true,
                                message: 'Owner ID is required!'
                            },
                            {
                                pattern: /^\d*$/,
                                message: 'Plz input an owner ID'
                            }
                        ]
                    })(
                        <AutoComplete
                            options={recommendUsers}
                            onChange={this.handleOwnerIdChange}
                        />
                    )}
                </FormItem>
                <FormItem wrapperCol={{span: formLayout.wrapperCol.span, offset: formLayout.labelCol.span}}>
                    <Button type="primary" htmlType="submit">Submit</Button>
                </FormItem>
            </Form>
        );
    }
}

BookEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};

BookEditor = Form.create()(BookEditor);

export default BookEditor;