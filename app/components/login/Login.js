import React, { Component } from 'react';
import {
    Image,
    StyleSheet
} from 'react-native';

import {
    Body,
    Button,
    Card,
    CardItem,
    Container,
    Content,
    Footer,
    FooterTab,
    Header,
    Text,
    Form,
    Icon,
    Item,
    Input,
    Label,
    Left,
    Thumbnail,
    Grid,
    Col
} from 'native-base';

import login from './../../../lib/login/login';

export default class Login extends Component {

    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };
    }

    setEmail(email) {
        this.setState({email});
    }

    setPassword(password) {
        this.setState({password});
    }

    login() {
        login.loginUser(this.state.email, this.state.password).then(results => {
            alert(JSON.stringify(results));
        }).catch(err => {
            throw err;
        })
    }

    render() {
        return (
            <Container>
                <Content>
                    <Card style={{flex: 0}}>
                        <CardItem>
                            <Body>
                                <Body>
                                    <Thumbnail source={{uri: 'https://cdn.pixabay.com/photo/2017/01/31/08/25/boy-2023213_1280.png'}} />
                                    <Text>Welcome Back!</Text>
                                </Body>
                            </Body>
                        </CardItem>
                    </Card>
                    <Form>
                        <Item floatingLabel>
                            <Label>Email</Label>
                            <Input
                                onChangeText={(email) => this.setEmail(email)}
                                keyboardType={'email-address'}
                                autoCapitalize = 'none'
                            />
                        </Item>
                        <Item floatingLabel last>
                            <Label>Password</Label>
                            <Input
                                onChangeText={(password) => this.setPassword(password)}
                                secureTextEntry={true}
                                autoCapitalize = 'none'
                            />
                        </Item>
                    </Form>
                    <Button full style={styles.loginButton} onPress={() => this.login()}>
                        <Text style={styles.buttonText}>Log In</Text>
                    </Button>
                    <Grid>
                        <Col>
                            <Button full style={styles.facebookButton}>
                                <Text style={styles.buttonText}>Facebook</Text>
                            </Button>
                        </Col>
                        <Col>
                            <Button full style={styles.linkedInButton}>
                                <Text style={styles.buttonText}>LinkedIn</Text>
                            </Button>
                        </Col>
                    </Grid>
                </Content>
                <Footer>
                    <FooterTab>
                        <Button full style={styles.registerButton}>
                            <Text style={styles.buttonText}>No Account? Sign Up</Text>
                        </Button>
                    </FooterTab>
                </Footer>
            </Container>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#9B59B6'
    },
    HeaderImage: {
        marginBottom: 10
    },
    buttonText: {
        color: 'white'
    },
    facebookButton: {
        backgroundColor: '#3b5998',
        marginTop: 4,
        marginRight: 2
    },
    linkedInButton: {
        backgroundColor: '#0077B5',
        marginTop: 4,
        marginLeft: 2
    },
    loginButton: {
        backgroundColor: '#AEA8D3',
        marginTop: 20
    },
    registerButton: {
        backgroundColor: '#674172'
    }
});
