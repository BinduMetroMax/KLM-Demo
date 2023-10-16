import React, { useState } from "react";
import {
    LoginPageProps,
    LoginFormTypes,
    useLink,
    useRouterType,
    useActiveAuthProvider,
} from "@refinedev/core";
import {
    Row,
    Col,
    Layout,
    Card,
    Typography,
    Form,
    Input,
    Button,
    CardProps,
    LayoutProps,
    FormProps,
    theme,
} from "antd";
import { useLogin, useRouterContext } from "@refinedev/core";

import {
    bodyStyles,
    containerStyles,
    headStyles,
    layoutStyles,
    titleStyles,
} from "./style";

const { Text, Title } = Typography;
const { useToken } = theme;

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
const OtpValidation: React.FC<LoginProps> = ({
    providers,
    contentProps,
    wrapperProps,
    renderContent,
    formProps,
    title,
}) => {
    const { token } = useToken();
    const [form] = Form.useForm<LoginFormTypes>();
    const routerType = useRouterType();
    const Link = useLink();
    const { Link: LegacyLink } = useRouterContext();


    const ActiveLink = routerType === "legacy" ? LegacyLink : Link;

    const authProvider = useActiveAuthProvider();
    const { mutate: login, isLoading } = useLogin<LoginFormTypes>({
        v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });

    const CardTitle = (
        <Title
            level={5}
            style={{
                color: token.colorPrimaryTextHover,
                ...titleStyles,
            }}
        >
            Otp Validation
        </Title>
    );

    const CardContent = (
        <Card
            title={CardTitle}
            headStyle={headStyles}
            bodyStyle={bodyStyles}
            style={{
                ...containerStyles,
                backgroundColor: token.colorBgElevated,
            }}
            {...(contentProps ?? {})}
        >
            <Form<LoginFormTypes>
                layout="vertical"
                form={form}
                onFinish={(values) => login(values)}
                requiredMark={false}
                initialValues={{
                    remember: false,
                }}
                {...formProps}
            >
                <Form.Item
                    name="username"
                    label="Code"
                    rules={[
                        { required: true },
                        {
                            pattern: /^\d{6}$/,
                            message: 'Enter Valid Number',
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Enter Otp Code"
                        maxLength={6}
                        type="tel"
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        size="large"
                        htmlType="submit"
                        loading={isLoading}
                        block
                    >
                        Send OTP
                    </Button>
                </Form.Item>

            </Form>
        </Card>
    );

    return (
        <Layout style={layoutStyles} {...(wrapperProps ?? {})}>
            <Row
                justify="center"
                align="middle"
                style={{
                    height: "100vh",
                }}
            >
                <Col xs={22}>
                    {CardContent}
                </Col>
            </Row>
        </Layout>
    );
};

export default OtpValidation;