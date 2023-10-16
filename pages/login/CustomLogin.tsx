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

const { Title } = Typography;
const { useToken } = theme;

type LoginProps = LoginPageProps<LayoutProps, CardProps, FormProps>;
/**
 * **refine** has a default login page form which is served on `/login` route when the `authProvider` configuration is provided.
 *
 * @see {@link https://refine.dev/docs/ui-frameworks/antd/components/antd-auth-page/#login} for more details.
 */
const CustomLoginPage: React.FC<LoginProps> = ({
    contentProps,
    wrapperProps,
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
    const { mutate: login, isLoading, } = useLogin<LoginFormTypes>({
        v3LegacyAuthProviderCompatible: Boolean(authProvider?.isLegacy),
    });

    const [screenType, setScreenType] = useState<any>("")

    const PageTitle =
        title === false ? null : (
            <div>
                <h1>Kalamandir Admin</h1>
            </div>
        );

    const CardTitle = (
        <Title
            level={5}
            style={{
                color: token.colorPrimaryTextHover,
                ...titleStyles,
            }}
        >
            Sign in to your account
        </Title>
    );



    const PhoneCardContent = () => {

        const submitPhone = (values: any) => {
            console.log(values)
            login(values)

        }

        return (
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
                    onFinish={submitPhone}
                    requiredMark={false}
                    {...formProps}
                >
                    <Form.Item
                        name="phone"
                        label="Phone Number"
                        rules={[
                            { required: true },
                            {
                                pattern: /^\d{10}$/,
                                message: 'Enter Valid Number',
                            },
                        ]}
                    >
                        <Input
                            size="large"
                            placeholder="Enter Phone Number"
                            maxLength={10}
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
        )
    }

    const CodeCardContent = () => (
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
                    name="code"
                    label="Enter Code"
                    rules={[
                        { required: true },
                        {
                            pattern: /^\d{6}$/,
                            message: 'Enter Valid Code',
                        },
                    ]}
                >
                    <Input
                        size="large"
                        placeholder="Enter OTP"
                        maxLength={6}
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
                        Verify Otp
                    </Button>
                </Form.Item>

            </Form>
        </Card>
    )

    const renderContentForms = () => {
        switch (screenType) {
            case "otp": return <CodeCardContent />
            default: return <PhoneCardContent />
        }
    }

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
                    <>
                        {PageTitle}
                        {renderContentForms()}

                    </>
                </Col>
            </Row>
        </Layout>
    );
};

export default CustomLoginPage;