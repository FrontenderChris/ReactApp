import React from 'react';
import { Form, Input, InputNumber, Select, Button, message } from 'antd';
import request from '../utils/request';

const FormItem = Form.Item;

const formLayout = {
    labelCol: {
        span: 4
    },
    wrapperCol: {
        span: 16
    }
};

class UserEditor extends React.Component {
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
            if (!err) {
                let editType = 'Add';
                let apiUrl = 'http://localhost:3000/user';
                let method = 'post';
                if (editTarget) {
                    editType = 'Edit';
                    apiUrl += '/' + editTarget.id;
                    method = 'put';
                }

                request(method, apiUrl, values)
                    .then((res) => {
                        if (res.id) {
                            message.success("Success to " + editType + 'user');
                            this.context.router.push('/user/list');
                        } else {
                            message.error(editType + 'fail');
                        }
                    })
                    .catch((err) => console.error(err));

            } else {
                message.warn(err);
            }
        });
    }

    render () {
        const {form} = this.props;
        const {getFieldDecorator} = form;
        return (
            <div style={{width: '400px'}}>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormItem label="Name：" {...formLayout}>
                        {getFieldDecorator('name', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Plz input a valid username'
                                },
                                {
                                    pattern: /^.{1,8}$/,
                                    message: 'Username should be less than 8 letters'
                                }
                            ]
                        })(
                            <Input type="text"/>
                        )}
                    </FormItem>
                    <FormItem label="Age：" {...formLayout}>
                        {getFieldDecorator('age', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please input a valid age',
                                    type: 'number'
                                },
                                {
                                    min: 1,
                                    max: 100,
                                    message: 'Please enter the age of 1 ~ 100',
                                    type: 'number'
                                }
                            ]
                        })(
                            <InputNumber/>
                        )}
                    </FormItem>
                    <FormItem label="Gender：" {...formLayout}>
                        {getFieldDecorator('gender', {
                            rules: [
                                {
                                    required: true,
                                    message: 'Please select your gender'
                                }
                            ]
                        })(
                            <Select placeholder="Select">
                                <Select.Option value="male">Male</Select.Option>
                                <Select.Option value="female">Female</Select.Option>
                            </Select>
                        )}
                    </FormItem>
                    <FormItem wrapperCol={{...formLayout.wrapperCol, offset: formLayout.labelCol.span}}>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
}

UserEditor.contextTypes = {
    router: React.PropTypes.object.isRequired
};

UserEditor = Form.create()(UserEditor);

export default UserEditor;